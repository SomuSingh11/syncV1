import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

// Update schema usage to use _id instead of resourceId
export const getById = query({
  args: { id: v.id("resources") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id);
  },
});

export const create = mutation({
  args: {
    departmentId: v.id("departments"),
    departmentName: v.string(), // Added departmentName field
    name: v.string(),
    type: v.string(),
    totalQuantity: v.number(),
    allocatedQuantity: v.number(),
    status: v.string(),
    isGlobal: v.boolean(),
    description: v.optional(v.string()),
    usageHistory: v.optional(
      v.array(
        v.object({
          allocationId: v.string(),
          usedBy: v.string(),
          quantityUsed: v.number(),
          startDate: v.number(),
          endDate: v.number(),
        })
      )
    ),
    image: v.optional(v.string()),
    price: v.optional(v.number()),
    location: v.optional(
      v.object({
        city: v.string(),
        state: v.string(),
        zip: v.string(),
        latitude: v.optional(v.string()),
        longitude: v.optional(v.string()),
      })
    ),

    categories: v.optional(v.array(v.string())),
    tags: v.optional(v.array(v.string())),
  },
  handler: async (ctx, args) => {
    // You can now directly use args.departmentId as a reference to the departments table
    const id = await ctx.db.insert("resources", {
      ...args,
      resourceId: crypto.randomUUID(),
      createdAt: Date.now(),
    });
    return id;
  },
});

// You'll also need to update the getByDepartment query
export const getByDepartmentId = query({
  args: { departmentId: v.id("departments") }, // Changed from v.string()
  handler: async (ctx, args) => {
    return await ctx.db
      .query("resources")
      .filter((q) => q.eq(q.field("departmentId"), args.departmentId))
      .collect();
  },
});

export const update = mutation({
  args: {
    id: v.id("resources"),
    departmentName: v.optional(v.string()), // Added departmentName field
    name: v.optional(v.string()),
    type: v.optional(v.string()),
    totalQuantity: v.optional(v.number()),
    allocatedQuantity: v.optional(v.number()),
    status: v.optional(v.string()),
    isGlobal: v.optional(v.boolean()),
    description: v.optional(v.string()),
    image: v.optional(v.string()),
    price: v.optional(v.number()),
    location: v.optional(
      v.object({
        city: v.string(),
        state: v.string(),
        zip: v.string(),
        latitude: v.optional(v.string()),
        longitude: v.optional(v.string()),
      })
    ),

    categories: v.optional(v.array(v.string())),
    tags: v.optional(v.array(v.string())),
  },
  handler: async (ctx, args) => {
    const { id, ...updates } = args;
    await ctx.db.patch(id, updates);
    return id;
  },
});

export const remove = mutation({
  args: { resourceId: v.id("resources") },
  handler: async (ctx, args) => {
    const { resourceId } = args;

    // Check if resource exists
    const resource = await ctx.db.get(resourceId);
    if (!resource) {
      throw new Error("Resource not found");
    }

    // Delete any associated requests first (optional)
    const requests = await ctx.db
      .query("resourceRequests")
      .filter((q) => q.eq(q.field("resourceId"), resourceId))
      .collect();

    for (const request of requests) {
      await ctx.db.delete(request._id);
    }

    // Delete the resource
    await ctx.db.delete(resourceId);
    return true;
  },
});

// export const getByCategory = query({
//   args: { category: v.string() },
//   handler: async (ctx, args) => {
//     return await ctx.db
//       .query("resources")
//       .filter(q => q.field("categories").contains(args.category))
//       .collect();
//   },
// });

// export const searchByTags = query({
//   args: { tags: v.array(v.string()) },
//   handler: async (ctx, args) => {
//     return await ctx.db
//       .query("resources")
//       .filter(q => q.containsAll(q.field("tags"), args.tags))
//       .collect();
//   },
// });

// Get all resources
export const getAll = query({
  handler: async (ctx) => {
    return await ctx.db.query("resources").collect();
  },
});

// written by bharat to update resource quantity
// export const updateResourceQuantity = mutation({
//   args: {
//     id: v.id('resources'), // Using id to match your existing pattern
//     quantityChange: v.number(),
//   },
//   handler: async (ctx, args) => {
//     const resource = await ctx.db.get(args.id);
//     if (!resource) {
//       throw new Error('Resource not found');
//     }

//     const newAllocatedQuantity = resource.allocatedQuantity + args.quantityChange;
//     const availableQuantity = resource.totalQuantity - newAllocatedQuantity;

//     // Update using the existing patch pattern from your update mutation
//     await ctx.db.patch(args.id, {
//       allocatedQuantity: newAllocatedQuantity,
//       status: availableQuantity <= 0 ? 'unavailable' : 'available',
//     });

//     return {
//       newAllocatedQuantity,
//       availableQuantity,
//       status: availableQuantity <= 0 ? 'unavailable' : 'available',
//     };
//   },
// });

export const getAllExceptOwn = query({
  args: { departmentId: v.string() },
  handler: async (ctx, args) => {
    const resources = await ctx.db
      .query("resources")
      .filter((q) => q.neq(q.field("departmentId"), args.departmentId))
      .collect();

    return resources;
  },
});

export const getCollaborations = query({
  args: {
    departmentId: v.id("departments"),
  },
  handler: async (ctx, args) => {
    // Get all conversations where this department is involved
    const conversations = await ctx.db
      .query("conversations")
      .filter((q) =>
        q.or(
          q.eq(q.field("initiatorDepartmentId"), args.departmentId),
          q.eq(q.field("recipientDepartmentId"), args.departmentId)
        )
      )
      .filter((q) => q.eq(q.field("status"), "active"))
      .collect();

    // Get unique department IDs from conversations
    const collaboratingDepartmentIds = new Set(
      conversations
        .flatMap((conv) => [
          conv.initiatorDepartmentId,
          conv.recipientDepartmentId,
        ])
        .filter((id) => id !== args.departmentId)
    );

    // Get department details for collaborating departments
    const collaboratingDepartments = await Promise.all(
      Array.from(collaboratingDepartmentIds).map(async (deptId) => {
        return await ctx.db.get(deptId);
      })
    );

    return collaboratingDepartments.filter(Boolean);
  },
});