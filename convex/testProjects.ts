import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const create = mutation({
  args: {
    departmentId: v.id("departments"),
    name: v.string(),
    description: v.optional(v.string()),
    startDate: v.number(),
    endDate: v.number(),
    status: v.string(),
    location: v.object({
      type: v.string(),
      coordinates: v.array(v.number()),
      radius: v.optional(v.number()),
    }),
    budget: v.optional(v.number()),
    priority: v.string(),
    resourcesRequired: v.array(v.id("resources")),
    createdAt: v.number(),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("testProjects", args);
  },
});

export const getById = query({
  args: { id: v.id("testProjects") },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("testProjects")
      .filter((q) => q.eq(q.field("_id"), args.id))
      .first();
  },
});
