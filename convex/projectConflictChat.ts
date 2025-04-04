import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

// Create a new project conflict conversation
export const createConflictConversation = mutation({
  args: {
    project1DepartmentId: v.id("departments"),
    project2DepartmentId: v.id("departments"),
    projectConflictId: v.id("projectConflicts"),
  },
  handler: async (ctx, args) => {
    const conversationId = await ctx.db.insert("projectConflictConversations", {
      project1DepartmentId: args.project1DepartmentId,
      project2DepartmentId: args.project2DepartmentId,
      projectConflictId: args.projectConflictId,
      status: "active",
      lastMessageAt: Date.now(),
      createdAt: Date.now(),
    });
    return conversationId;
  },
});

// Update conversation status and resolution type
export const updateConflictConversation = mutation({
  args: {
    conversationId: v.id("projectConflictConversations"),
    status: v.string(),
    resolutionType: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const now = Date.now();
    await ctx.db.patch(args.conversationId, {
      status: args.status,
      resolutionType: args.resolutionType,
      resolvedAt: args.status === "resolved" ? now : undefined,
      lastMessageAt: now,
    });
  },
});

// Send a conflict message
export const sendConflictMessage = mutation({
  args: {
    conversationId: v.id("projectConflictConversations"),
    senderId: v.string(),
    senderDepartmentId: v.id("departments"),
    content: v.string(),
    attachments: v.optional(v.array(v.string())),
  },
  handler: async (ctx, args) => {
    const now = Date.now();

    // Create the message
    const messageId = await ctx.db.insert("conflictMessages", {
      conversationId: args.conversationId,
      senderId: args.senderId,
      senderDepartmentId: args.senderDepartmentId,
      content: args.content,
      timestamp: now,
      attachments: args.attachments,
      readBy: [args.senderId], // Mark as read by sender
    });

    // Update conversation's last message timestamp
    await ctx.db.patch(args.conversationId, {
      lastMessageAt: now,
    });

    return messageId;
  },
});

// Mark messages as read
export const markConflictMessagesAsRead = mutation({
  args: {
    conversationId: v.id("projectConflictConversations"),
    userId: v.string(),
  },
  handler: async (ctx, args) => {
    const messages = await ctx.db
      .query("conflictMessages")
      .withIndex("by_conversation", (q) =>
        q.eq("conversationId", args.conversationId)
      )
      .collect();

    // Update readBy array for each message
    for (const message of messages) {
      const readBy = message.readBy || [];
      if (!readBy.includes(args.userId)) {
        await ctx.db.patch(message._id, {
          readBy: [...readBy, args.userId],
        });
      }
    }
  },
});

// Get messages for a specific conflict conversation
export const getConflictMessages = query({
  args: {
    conversationId: v.id("projectConflictConversations"),
  },
  handler: async (ctx, args) => {
    const messages = await ctx.db
      .query("conflictMessages")
      .withIndex("by_conversation", (q) =>
        q.eq("conversationId", args.conversationId)
      )
      .order("desc")
      .collect();

    return messages;
  },
});

// Get conflict conversation with messages
export const getConflictConversationWithMessages = query({
  args: {
    conversationId: v.id("projectConflictConversations"),
  },
  handler: async (ctx, args) => {
    const conversation = await ctx.db.get(args.conversationId);
    if (!conversation) return null;

    const messages = await ctx.db
      .query("conflictMessages")
      .withIndex("by_conversation", (q) =>
        q.eq("conversationId", args.conversationId)
      )
      .order("desc")
      .collect();

    return {
      conversation,
      messages,
    };
  },
});

// Get conflict conversation by project conflict ID
export const getConflictConversation = query({
  args: {
    projectConflictId: v.id("projectConflicts"),
  },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("projectConflictConversations")
      .withIndex("by_conflict", (q) =>
        q.eq("projectConflictId", args.projectConflictId)
      )
      .first();
  },
});

// Create conflict conversation if it doesn't exist
export const ensureConflictConversation = mutation({
  args: {
    projectConflictId: v.id("projectConflicts"),
    currentDepartmentId: v.id("departments"),
    otherDepartmentId: v.id("departments"),
  },
  handler: async (ctx, args) => {
    // Check if conversation exists
    const existing = await ctx.db
      .query("projectConflictConversations")
      .withIndex("by_conflict", (q) =>
        q.eq("projectConflictId", args.projectConflictId)
      )
      .first();

    if (!existing) {
      // Create new conversation
      const conversationId = await ctx.db.insert(
        "projectConflictConversations",
        {
          project1DepartmentId: args.currentDepartmentId,
          project2DepartmentId: args.otherDepartmentId,
          projectConflictId: args.projectConflictId,
          status: "active",
          lastMessageAt: Date.now(),
          createdAt: Date.now(),
        }
      );
      return await ctx.db.get(conversationId);
    }

    return existing;
  },
});

// Get conflict conversation by department IDs
export const getConflictConversationByDepartments = query({
  args: {
    department1Id: v.id("departments"),
    department2Id: v.id("departments"),
  },
  handler: async (ctx, args) => {
    // Try both combinations of department ordering
    const conversation = await ctx.db
      .query("projectConflictConversations")
      .withIndex("by_departments")
      .filter((q) =>
        q.or(
          q.and(
            q.eq(q.field("project1DepartmentId"), args.department1Id),
            q.eq(q.field("project2DepartmentId"), args.department2Id)
          ),
          q.and(
            q.eq(q.field("project1DepartmentId"), args.department2Id),
            q.eq(q.field("project2DepartmentId"), args.department1Id)
          )
        )
      )
      .first();

    return conversation;
  },
});

// Get other departments from conflict conversations
export const getConflictingDepartments = query({
  args: {
    currentDepartmentId: v.id("departments"),
  },
  handler: async (ctx, args) => {
    // Get all conversations involving the current department
    const conversations = await ctx.db
      .query("projectConflictConversations")
      .filter((q) =>
        q.or(
          q.eq(q.field("project1DepartmentId"), args.currentDepartmentId),
          q.eq(q.field("project2DepartmentId"), args.currentDepartmentId)
        )
      )
      .collect();

    // Get the other departments' IDs
    const otherDepartmentIds = conversations.map((conv) =>
      conv.project1DepartmentId === args.currentDepartmentId
        ? conv.project2DepartmentId
        : conv.project1DepartmentId
    );

    // Get department details
    const departments = await Promise.all(
      [...new Set(otherDepartmentIds)].map(async (deptId) => {
        const dept = await ctx.db.get(deptId);
        if (!dept) return null;

        // Find the associated conversation
        const conversation = conversations.find(
          (c) =>
            c.project1DepartmentId === deptId ||
            c.project2DepartmentId === deptId
        );

        return {
          _id: dept._id,
          name: dept.name,
          email: dept.email,
          projectConflictId: conversation?.projectConflictId,
        };
      })
    );

    return departments.filter(
      (dept): dept is NonNullable<typeof dept> => dept !== null
    );
  },
});

// Get departments from conflict conversation
export const getDepartmentsFromConversation = query({
  args: {
    conversationId: v.id("projectConflictConversations"),
  },
  handler: async (ctx, args) => {
    // Get the conversation
    const conversation = await ctx.db.get(args.conversationId);
    if (!conversation) return null;

    // Get both departments
    const department1 = await ctx.db.get(conversation.project1DepartmentId);
    const department2 = await ctx.db.get(conversation.project2DepartmentId);

    return {
      department1: department1
        ? {
            _id: department1._id,
            name: department1.name,
            email: department1.email,
          }
        : null,
      department2: department2
        ? {
            _id: department2._id,
            name: department2.name,
            email: department2.email,
          }
        : null,
    };
  },
});
