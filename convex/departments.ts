import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

// List all departments
export const listDepartments = query({
  handler: async (ctx) => {
    return await ctx.db.query("departments").collect();
  },
});

// Get a specific department by ID
export const getDepartment = query({
  args: { departmentId: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("departments")
      .withIndex("by_departmentId", (q) =>
        q.eq("departmentId", args.departmentId)
      )
      .first();
  },
});

// export const getDepartmentByInternalId = query({
//   args: { id: v.id("departments") },
//   handler: async (ctx, args) => {
//     return await ctx.db.get(args.id);
//   },
// });

// ... existing imports and queries ...

export const getDepartmentByInternalId = query({
  args: { id: v.id("departments") },
  handler: async (ctx, args) => {
    const department = await ctx.db.get(args.id);
    if (!department) return null;

    // Get the point of contact user details
    const pointOfContactUser = await ctx.db
      .query("users")
      .filter((q) => q.eq(q.field("userId"), department.pointOfContact))
      .first();

    return {
      ...department,
      contactPerson: pointOfContactUser || null,
    };
  },
});

// ... rest of the existing code ...

// Create a new department
export const createDepartment = mutation({
  args: {
    name: v.string(),
    email: v.string(),
    description: v.optional(v.string()),
    pointOfContact: v.string(), // This will be the userId/clerkId
    departmentType: v.optional(v.string()),
    parentDepartmentId: v.optional(v.string()),
    location: v.optional(
      v.object({
        city: v.string(),
        state: v.string(),
        zip: v.string(),
      })
    ),
  },
  handler: async (ctx, args) => {
    // Verify that the pointOfContact (userId) exists in the users table
    const userExists = await ctx.db
      .query("users")
      .filter((q) => q.eq(q.field("userId"), args.pointOfContact))
      .first();

    if (!userExists) {
      throw new Error("Point of contact user does not exist");
    }

    const departmentId = `dept_${Math.random().toString(36).substring(2, 15)}`;

    const id = await ctx.db.insert("departments", {
      departmentId,
      name: args.name,
      email: args.email,
      description: args.description,
      pointOfContact: args.pointOfContact,
      departmentType: args.departmentType,
      parentDepartmentId: args.parentDepartmentId,
      location: args.location,
      createdAt: Date.now(),
    });

    // Automatically assign the creator as a member of this department
    await ctx.db.patch(userExists._id, {
      departmentName: args.name,
      role: "admin", // Make the creator an admin of the department
      onboardingComplete: true,
      updatedAt: Date.now(),
    });

    return { id, departmentId };
  },
});

// Get departments by point of contact
export const getDepartmentsByPointOfContact = query({
  args: { userId: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("departments")
      .filter((q) => q.eq(q.field("pointOfContact"), args.userId))
      .collect();
  },
});

export const getResourceSharingDepartments = query({
  args: {
    departmentId: v.id("departments"),
  },
  handler: async (ctx, args) => {
    // Get conversations related to resource sharing
    const conversations = await ctx.db
      .query("conversations")
      .filter((q) =>
        q.and(
          q.eq(q.field("type"), "resource_sharing"),
          q.or(
            q.eq(q.field("initiatorDepartmentId"), args.departmentId),
            q.eq(q.field("recipientDepartmentId"), args.departmentId)
          )
        )
      )
      .collect();

    // Get department IDs from conversations
    const departmentIds = conversations.map((conv) =>
      conv.initiatorDepartmentId === args.departmentId
        ? conv.recipientDepartmentId
        : conv.initiatorDepartmentId
    );

    if (departmentIds.length === 0) return [];

    return await ctx.db
      .query("departments")
      .filter((q) =>
        q.or(...departmentIds.map((id) => q.eq(q.field("_id"), id)))
      )
      .collect();
  },
});

export const getProjectConflictDepartments = query({
  args: {
    departmentId: v.id("departments"),
  },
  handler: async (ctx, args) => {
    // Get conversations related to project conflicts
    const conversations = await ctx.db
      .query("conversations")
      .filter((q) =>
        q.and(
          q.eq(q.field("type"), "project_conflict"),
          q.or(
            q.eq(q.field("initiatorDepartmentId"), args.departmentId),
            q.eq(q.field("recipientDepartmentId"), args.departmentId)
          )
        )
      )
      .collect();

    // Get department IDs from conversations
    const departmentIds = conversations.map((conv) =>
      conv.initiatorDepartmentId === args.departmentId
        ? conv.recipientDepartmentId
        : conv.initiatorDepartmentId
    );

    if (departmentIds.length === 0) return [];

    return await ctx.db
      .query("departments")
      .filter((q) =>
        q.or(...departmentIds.map((id) => q.eq(q.field("_id"), id)))
      )
      .collect();
  },
});
