import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

// Create a new resource request
export const create = mutation({
  args: {
    resourceId: v.id("resources"),
    requesterDepartmentId: v.id("departments"),
    ownerDepartmentId: v.id("departments"),
    quantity: v.number(),
    startDate: v.number(),
    endDate: v.number(),
    purpose: v.string(),
    priority: v.optional(v.string()),
    additionalNotes: v.optional(v.string()),
    status: v.string(),
  },
  handler: async (ctx, args) => {
    // Generate a unique resource request ID
    const resourceRequestId = `REQ-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

    // Create the resource request
    const requestId = await ctx.db.insert("resourceRequests", {
      resourceRequestId,
      resourceId: args.resourceId,
      requestingDepartmentId: args.requesterDepartmentId,
      lendingDepartmentId: args.ownerDepartmentId,
      quantityRequested: args.quantity,
      status: args.status,
      priorityLevel: args.priority,
      description: args.additionalNotes || args.purpose,
      expectedDuration: {
        start: args.startDate,
        end: args.endDate,
      },
      requestedAt: Date.now(),
      expiresAt: Date.now() + 30 * 24 * 60 * 60 * 1000, // Expires in 30 days
    });

    return requestId;
  },
});

// Get all resource requests
export const getAll = query({
  handler: async (ctx) => {
    const requests = await ctx.db.query("resourceRequests").collect();
    return requests;
  },
});

// Get resource request by ID
export const getById = query({
  args: { id: v.id("resourceRequests") },
  handler: async (ctx, args) => {
    const request = await ctx.db.get(args.id);
    return request;
  },
});

// Get resource request by resourceRequestId
export const getByRequestId = query({
  args: { resourceRequestId: v.string() },
  handler: async (ctx, args) => {
    const request = await ctx.db
      .query("resourceRequests")
      .filter((q) => q.eq(q.field("resourceRequestId"), args.resourceRequestId))
      .first();
    return request;
  },
});

// Get resource requests by requester department ID
export const getByRequesterDepartment = query({
  args: { departmentId: v.id("departments") },
  handler: async (ctx, args) => {
    const requests = await ctx.db
      .query("resourceRequests")
      .withIndex("by_requestingDepartmentId", (q) =>
        q.eq("requestingDepartmentId", args.departmentId)
      )
      .collect();
    return requests;
  },
});

// Get resource requests by lending department ID
export const getByLendingDepartment = query({
  args: { departmentId: v.id("departments") },
  handler: async (ctx, args) => {
    const requests = await ctx.db
      .query("resourceRequests")
      .withIndex("by_lendingDepartmentId", (q) =>
        q.eq("lendingDepartmentId", args.departmentId)
      )
      .collect();
    return requests;
  },
});

// Get resource requests by resource ID
export const getByResourceId = query({
  args: { resourceId: v.id("resources") },
  handler: async (ctx, args) => {
    const requests = await ctx.db
      .query("resourceRequests")
      .withIndex("by_resourceId", (q) => q.eq("resourceId", args.resourceId))
      .collect();
    return requests;
  },
});

// Get resource requests by status
export const getByStatus = query({
  args: { status: v.string() },
  handler: async (ctx, args) => {
    const requests = await ctx.db
      .query("resourceRequests")
      .filter((q) => q.eq(q.field("status"), args.status))
      .collect();
    return requests;
  },
});

// Update a resource request
export const update = mutation({
  args: {
    id: v.id("resourceRequests"),
    quantityRequested: v.optional(v.number()),
    status: v.optional(v.string()),
    priorityLevel: v.optional(v.string()),
    description: v.optional(v.string()),
    expectedDuration: v.optional(
      v.object({
        start: v.number(),
        end: v.number(),
      })
    ),
    expiresAt: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const { id, ...updateFields } = args;

    // Check if request exists
    const existingRequest = await ctx.db.get(id);
    if (!existingRequest) {
      throw new Error("Resource request not found");
    }

    // Update the request with the provided fields
    await ctx.db.patch(id, updateFields);

    return id;
  },
});

// Update request status
export const updateStatus = mutation({
  args: {
    id: v.id("resourceRequests"),
    status: v.string(),
    reason: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const { id, status, reason } = args;

    // Check if request exists
    const existingRequest = await ctx.db.get(id);
    if (!existingRequest) {
      throw new Error("Resource request not found");
    }

    // Update the status and add a reason if provided
    const updateData: { status: string; description?: string } = { status };
    if (reason) {
      updateData.description = existingRequest.description
        ? `${existingRequest.description}\n\nStatus update reason: ${reason}`
        : `Status update reason: ${reason}`;
    }

    await ctx.db.patch(id, updateData);

    return id;
  },
});

// Delete a resource request
export const remove = mutation({
  args: { id: v.id("resourceRequests") },
  handler: async (ctx, args) => {
    // Check if request exists
    const existingRequest = await ctx.db.get(args.id);
    if (!existingRequest) {
      throw new Error("Resource request not found");
    }

    await ctx.db.delete(args.id);
    return args.id;
  },
});

// Get pending requests count for a department
export const getPendingRequestsCount = query({
  args: { departmentId: v.id("departments") },
  handler: async (ctx, args) => {
    const pendingRequests = await ctx.db
      .query("resourceRequests")
      .withIndex("by_lendingDepartmentId", (q) =>
        q.eq("lendingDepartmentId", args.departmentId)
      )
      .filter((q) => q.eq(q.field("status"), "pending"))
      .collect();

    return pendingRequests.length;
  },
});

// Get detailed resource requests with resource and department info
// export const getDetailedRequests = query({
//   args: { departmentId: v.string() },
//   handler: async (ctx, args) => {
//     const requests = await ctx.db
//       .query("resourceRequests")
//       .filter((q) =>
//         q.or(
//           q.eq(q.field("lendingDepartmentId"), args.departmentId),
//           q.eq(q.field("requestingDepartmentId"), args.departmentId)
//         )
//       )
//       .collect();

//     // Enhance requests with additional information
//     const enhancedRequests = await Promise.all(
//       requests.map(async (request) => {
//         // Get resource details
//         const resource = await ctx.db
//           .query("resources")
//           .filter((q) => q.eq(q.field("_id"), request.resourceId))
//           .first();

//         // Get requester department details
//         const requesterDepartment = await ctx.db
//           .query("departments")
//           .filter((q) => q.eq(q.field("_id"), request.requestingDepartmentId))
//           .first();

//         // Get lending department details
//         const lendingDepartment = await ctx.db
//           .query("departments")
//           .filter((q) => q.eq(q.field("_id"), request.lendingDepartmentId))
//           .first();

//         return {
//           ...request,
//           resource: resource || null,
//           requesterDepartment: requesterDepartment || null,
//           lendingDepartment: lendingDepartment || null,
//         };
//       })
//     );

//     return enhancedRequests;
//   },
// });

// Get detailed resource requests with resource and department info
export const getDetailedRequests = query({
  args: { departmentId: v.id("departments") },
  handler: async (ctx, args) => {
    // Get both sent and received requests
    const requests = await ctx.db
      .query("resourceRequests")
      .filter((q) =>
        q.or(
          q.eq(q.field("lendingDepartmentId"), args.departmentId),
          q.eq(q.field("requestingDepartmentId"), args.departmentId)
        )
      )
      .collect();

    // Enhance requests with additional information
    const enhancedRequests = await Promise.all(
      requests.map(async (request) => {
        const [resource, requesterDepartment, lendingDepartment] =
          await Promise.all([
            ctx.db.get(request.resourceId),
            ctx.db.get(request.requestingDepartmentId),
            ctx.db.get(request.lendingDepartmentId),
          ]);

        return {
          ...request,
          resource,
          requesterDepartment,
          lendingDepartment,
        };
      })
    );

    return enhancedRequests;
  },
});

// added by bharat ----- for detailed request page
// Get detailed request information by ID
export const getRequestWithDetails = query({
  args: { id: v.id("resourceRequests") },
  handler: async (ctx, args) => {
    const request = await ctx.db.get(args.id);
    if (!request) return null;

    // Get resource details
    const resource = await ctx.db.get(request.resourceId);

    // Get requester department details
    const requesterDepartment = await ctx.db.get(
      request.requestingDepartmentId
    );

    // Get lending department details
    const lendingDepartment = await ctx.db.get(request.lendingDepartmentId);

    return {
      ...request,
      resource,
      requesterDepartment,
      lendingDepartment,
    };
  },
});
