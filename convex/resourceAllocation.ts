import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
// import { Id } from "./_generated/dataModel";

export const createAllocation = mutation({
  args: {
    resourceId: v.string(),
    lendingDepartmentId: v.string(),
    borrowingDepartmentId: v.string(),
    quantityAllocated: v.number(),
    startDate: v.number(),
    endDate: v.number(),
  },
  handler: async (ctx, args) => {
    // First check if resource has enough quantity
    const resource = await ctx.db
      .query("resources")
      .filter((q) => q.eq(q.field("_id"), args.resourceId))
      .first();

    if (!resource) {
      throw new Error("Resource not found");
    }

    const newAllocatedQuantity =
      resource.allocatedQuantity + args.quantityAllocated;
    const availableQuantity = resource.totalQuantity - newAllocatedQuantity;

    if (availableQuantity < 0) {
      throw new Error("Not enough quantity available");
    }

    // Update resource status and quantity
    await ctx.db.patch(resource._id, {
      allocatedQuantity: newAllocatedQuantity,
      status: availableQuantity <= 0 ? "unavailable" : "available",
    });

    // Create allocation
    const allocation = await ctx.db.insert("resourceAllocation", {
      allocationId: crypto.randomUUID(),
      ...args,
      status: "active",
      returnStatus: "notreturned",
      createdAt: Date.now(),
    });

    return allocation;
  },
});

export const getBorrowedResources = query({
  args: { departmentId: v.string() },
  handler: async (ctx, args) => {
    const allocations = await ctx.db
      .query("resourceAllocation")
      .filter((q) => q.eq(q.field("borrowingDepartmentId"), args.departmentId))
      .collect();

    // Get associated resources and departments
    const enrichedAllocations = await Promise.all(
      allocations.map(async (allocation) => {
        const resource = await ctx.db
          .query("resources")
          .filter((q) => q.eq(q.field("_id"), allocation.resourceId))
          .first();

        const lendingDepartment = await ctx.db
          .query("departments")
          .filter((q) => q.eq(q.field("_id"), allocation.lendingDepartmentId))
          .first();

        return {
          ...allocation,
          resource,
          lendingDepartment,
        };
      })
    );

    console.log("Enriched Allocations:", enrichedAllocations); // Debug log
    return enrichedAllocations;
  },
});

export const getLentResources = query({
  args: { departmentId: v.string() },
  handler: async (ctx, args) => {
    const allocations = await ctx.db
      .query("resourceAllocation")
      .filter((q) => q.eq(q.field("lendingDepartmentId"), args.departmentId))
      .collect();

    // Get associated resources and departments
    const enrichedAllocations = await Promise.all(
      allocations.map(async (allocation) => {
        const resource = await ctx.db
          .query("resources")
          .filter((q) => q.eq(q.field("_id"), allocation.resourceId))
          .first();

        const borrowingDepartment = await ctx.db
          .query("departments")
          .filter((q) => q.eq(q.field("_id"), allocation.borrowingDepartmentId))
          .first();

        return {
          ...allocation,
          resource,
          borrowingDepartment,
        };
      })
    );

    return enrichedAllocations;
  },
});

export const returnResource = mutation({
  args: {
    allocationId: v.string(),
    resourceId: v.string(),
    quantityReturned: v.number(),
  },
  handler: async (ctx, args) => {
    // Update allocation status
    const allocation = await ctx.db
      .query("resourceAllocation")
      .filter((q) => q.eq(q.field("allocationId"), args.allocationId))
      .first();

    if (!allocation) {
      throw new Error("Allocation not found");
    }

    // Update allocation status
    await ctx.db.patch(allocation._id, {
      status: "completed",
      returnStatus: "returned",
    });

    // Update resource quantity
    const resource = await ctx.db
      .query("resources")
      .filter((q) => q.eq(q.field("_id"), args.resourceId))
      .first();

    if (resource) {
      const newAllocatedQuantity =
        resource.allocatedQuantity - args.quantityReturned;
      await ctx.db.patch(resource._id, {
        allocatedQuantity: newAllocatedQuantity,
        status: "available",
      });
    }

    return allocation;
  },
});
