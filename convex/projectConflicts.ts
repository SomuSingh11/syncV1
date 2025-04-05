import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

// Get all conflicts
export const getAll = query({
  handler: async (ctx) => {
    return await ctx.db
      .query("projectConflicts")
      .collect();
  },
});

// Update conflict status
export const updateStatus = mutation({
  args: {
    conflictId: v.id("projectConflicts"),
    status: v.string(), // "detected", "resolved", "ignored"
    resolution: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const conflict = await ctx.db.get(args.conflictId);
    if (!conflict) throw new Error("Conflict not found");

    const updates: any = {
      status: args.status,
    };

    if (args.status === "resolved") {
      updates.resolvedAt = Date.now();
      updates.resolution = args.resolution;
    }

    return await ctx.db.patch(args.conflictId, updates);
  },
});

// Get conflicts by project
export const getByProject = query({
  args: {
    projectId: v.id("projects"),
  },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("projectConflicts")
      .filter(q => 
        q.or(
          q.eq(q.field("project1Id"), args.projectId),
          q.eq(q.field("project2Id"), args.projectId)
        )
      )
      .collect();
  },
});

// Get conflicts by status
export const getByStatus = query({
  args: {
    status: v.string(),
  },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("projectConflicts")
      .filter(q => q.eq(q.field("status"), args.status))
      .collect();
  },
});