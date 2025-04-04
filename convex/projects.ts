import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { checkSpatialConflict } from "../lib/spatial-utils";

// Create a new project
export const create = mutation({
  args: {
    departmentId: v.id("departments"),
    name: v.string(),
    description: v.optional(v.string()),
    startDate: v.number(),
    endDate: v.number(),
    location: v.object({
      type: v.string(),
      coordinates: v.array(v.number()),
      radius: v.optional(v.number()),
    }),
    budget: v.optional(v.number()),
    priority: v.string(),
    resourcesRequired: v.optional(v.array(v.string())),
  },
  handler: async (ctx, args) => {
    const project = await ctx.db.insert("projects", {
      departmentId: args.departmentId,
      name: args.name,
      description: args.description,
      startDate: args.startDate,
      endDate: args.endDate,
      status: "active",
      location: args.location,
      budget: args.budget,
      priority: args.priority,
      resourcesRequired: args.resourcesRequired,
      createdAt: Date.now(),
    });

    // Check for potential conflicts with correct project data
    await checkProjectConflicts(ctx, {
      _id: project,
      departmentId: args.departmentId,
      startDate: args.startDate,
      endDate: args.endDate,
      location: args.location,
    });

    return project;
  },
});

// Update project details
export const update = mutation({
  args: {
    projectId: v.id("projects"),
    name: v.optional(v.string()),
    description: v.optional(v.string()),
    startDate: v.optional(v.number()),
    endDate: v.optional(v.number()),
    status: v.optional(v.string()),
    location: v.optional(
      v.object({
        type: v.string(),
        coordinates: v.array(v.number()),
        radius: v.optional(v.number()),
      })
    ),
    budget: v.optional(v.number()),
    priority: v.optional(v.string()),
    resourcesRequired: v.optional(v.array(v.string())),
  },
  handler: async (ctx, args) => {
    const { projectId, ...updates } = args;

    const project = await ctx.db.patch(projectId, updates);

    // Recheck conflicts after update
    const updatedProject = await ctx.db.get(projectId);
    if (updatedProject) {
      await checkProjectConflicts(ctx, {
        _id: projectId,
        departmentId: updatedProject.departmentId,
        startDate: updatedProject.startDate,
        endDate: updatedProject.endDate,
        location: updatedProject.location,
      });
    }

    return project;
  },
});

// Delete a project
export const remove = mutation({
  args: {
    projectId: v.id("projects"),
  },
  handler: async (ctx, args) => {
    // Remove associated conflicts first
    const conflicts = await ctx.db
      .query("projectConflicts")
      .filter(
        (q) =>
          q.eq(q.field("project1Id"), args.projectId) ||
          q.eq(q.field("project2Id"), args.projectId)
      )
      .collect();

    for (const conflict of conflicts) {
      await ctx.db.delete(conflict._id);
    }

    return await ctx.db.delete(args.projectId);
  },
});

// Helper function to check for project conflicts
async function checkProjectConflicts(
  ctx: { db: any },
  project: {
    _id: string;
    departmentId: string;
    startDate: number;
    endDate: number;
    location: {
      type: string;
      coordinates: number[] | number[][];
      radius?: number;
    };
  }
) {
  // Get all projects from OTHER departments
  const potentialConflicts = await ctx.db
    .query("projects")
    .filter((q: any) =>
      q.and(
        // Check projects from different departments
        q.neq(q.field("departmentId"), project.departmentId),
        q.neq(q.field("_id"), project._id),
        // Add status check if needed
        q.eq(q.field("status"), "active")
      )
    )
    .collect();

  const newConflictIds = new Set();

  for (const otherProject of potentialConflicts) {
    let conflictTypes = [];
    const conflictDetails: any = {};

    // Check temporal overlap
    const hasTimeOverlap =
      otherProject.startDate < project.endDate &&
      otherProject.endDate > project.startDate;

    if (hasTimeOverlap) {
      conflictTypes.push("temporal");
      conflictDetails.temporalOverlap = {
        startDate: Math.max(project.startDate, otherProject.startDate),
        endDate: Math.min(project.endDate, otherProject.endDate),
      };
    }

    // Check spatial overlap
    const spatialConflict = checkSpatialConflict(
      {
        coordinates: Array.isArray(project.location.coordinates[0])
          ? (project.location.coordinates[0] as number[])
          : (project.location.coordinates as number[]),
        radius: project.location.radius,
      },
      {
        coordinates: Array.isArray(otherProject.location.coordinates[0])
          ? (otherProject.location.coordinates[0] as number[])
          : (otherProject.location.coordinates as number[]),
        radius: otherProject.location.radius,
      }
    );

    if (spatialConflict && spatialConflict.overlapPercentage > 0) {
      conflictTypes.push("spatial");
      conflictDetails.spatialOverlap = spatialConflict.overlapPercentage;
    }

    // Create conflict record if both spatial and temporal conflicts exist
    if (conflictTypes.length === 2) {
      const conflictId = `${project._id}_${otherProject._id}`;
      newConflictIds.add(conflictId);

      try {
        // Create the conflict and get its ID
        const newConflictId = await ctx.db.insert("projectConflicts", {
          conflictId: conflictId,
          project1Id: project._id,
          project2Id: otherProject._id,
          conflictType: conflictTypes.join("-"),
          conflictDetails,
          status: "detected",
          createdAt: Date.now(),
        });

        // Create conflict conversation using the ID directly
        await createConflictConversation(ctx, {
          project,
          otherProject,
          conflictId: newConflictId, // Pass the ID instead of trying to fetch the object
          conflictDetails,
        });
      } catch (error) {
        console.error("Error creating conflict:", error);
      }
    }
  }

  // Delete existing conflicts that are no longer valid
  const existingConflicts = await ctx.db
    .query("projectConflicts")
    .filter((q: any) =>
      q.or(
        q.eq(q.field("project1Id"), project._id),
        q.eq(q.field("project2Id"), project._id)
      )
    )
    .collect();

  for (const conflict of existingConflicts) {
    // Extract the two project IDs from the conflict
    const project1Id = conflict.project1Id;
    const project2Id = conflict.project2Id;

    // Create a standardized conflict ID for checking
    const conflictIdToCheck =
      project._id === project1Id
        ? `${project1Id}_${project2Id}`
        : `${project2Id}_${project1Id}`;

    // If this conflict is not in our new set of conflicts, delete it
    if (!newConflictIds.has(conflictIdToCheck)) {
      await ctx.db.delete(conflict._id);
    }
  }
}

// Get all projects for a department
export const getByDepartment = query({
  args: { departmentId: v.id("departments") },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("projects")
      .filter((q) => q.eq(q.field("departmentId"), args.departmentId))
      .collect();
  },
});

// Get project conflicts
export const getConflicts = query({
  args: { projectId: v.id("projects") },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("projectConflicts")
      .filter((q) =>
        q.or(
          q.eq(q.field("project1Id"), args.projectId),
          q.eq(q.field("project2Id"), args.projectId)
        )
      )
      .collect();
  },
});

// Get all projects
export const getAll = query({
  handler: async (ctx) => {
    return await ctx.db.query("projects").collect();
  },
});

// Helper function to create conflict conversation
async function createConflictConversation(
  ctx: { db: any },
  params: {
    project: any;
    otherProject: any;
    conflictId: string; // Changed from conflict object to conflict ID
    conflictDetails: any;
  }
) {
  const { project, otherProject, conflictId, conflictDetails } = params;

  const conversationId = await ctx.db.insert("projectConflictConversations", {
    project1DepartmentId: project.departmentId,
    project2DepartmentId: otherProject.departmentId,
    projectConflictId: conflictId,
    status: "active",
    lastMessageAt: Date.now(),
    createdAt: Date.now(),
  });

  // Create initial system message
  await ctx.db.insert("conflictMessages", {
    conversationId,
    senderId: "system",
    senderDepartmentId: project.departmentId,
    content: `Project Conflict Detected between departments:\n
- Spatial Overlap: ${Math.round(conflictDetails.spatialOverlap)}%
- Time Period: ${new Date(conflictDetails.temporalOverlap.startDate).toLocaleDateString()} to ${new Date(conflictDetails.temporalOverlap.endDate).toLocaleDateString()}
\nPlease coordinate to resolve this conflict.`,
    timestamp: Date.now(),
    readBy: [],
  });

  return conversationId;
}
