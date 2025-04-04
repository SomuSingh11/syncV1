import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
// import { Id } from "./_generated/dataModel";

export const getConversations = query({
  args: {
    departmentId: v.string(),
  },
  handler: async (ctx, args) => {
    const conversations = await ctx.db
      .query("conversations")
      .filter((q) =>
        q.or(
          q.eq(q.field("initiatorDepartmentId"), args.departmentId),
          q.eq(q.field("recipientDepartmentId"), args.departmentId)
        )
      )
      .collect();

    return conversations;
  },
});

export const getConversation = query({
  args: {
    conversationId: v.id("conversations"),
  },
  handler: async (ctx, args) => {
    const conversation = await ctx.db.get(args.conversationId);
    return conversation;
  },
});

export const getMessages = query({
  args: {
    conversationId: v.id("conversations"),
  },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("messages")
      .filter((q) => q.eq(q.field("conversationId"), args.conversationId))
      .order("desc")
      .take(50);
  },
});

export const startConversation = mutation({
  args: {
    initiatorDepartmentId: v.id("departments"),
    recipientDepartmentId: v.id("departments"),
    type: v.string(),
    resourceId: v.optional(v.string()),
    projectId: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("conversations", {
      ...args,
      status: "active",
      lastMessageAt: Date.now(),
      createdAt: Date.now(),
    });
  },
});

export const sendMessage = mutation({
  args: {
    conversationId: v.id("conversations"),
    senderId: v.string(),
    senderDepartmentId: v.id("departments"),
    content: v.string(),
    type: v.string(),
    resourceId: v.optional(v.string()),
    projectId: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const messageId = await ctx.db.insert("messages", {
      ...args,
      timestamp: Date.now(),
      readBy: [args.senderId],
    });

    // Update conversation's lastMessageAt
    await ctx.db.patch(args.conversationId, {
      lastMessageAt: Date.now(),
    });

    return messageId;
  },
});

export const createResourceChat = mutation({
  args: {
    initiatorDepartmentId: v.id("departments"),
    recipientDepartmentId: v.id("departments"),
    resourceId: v.string(),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("conversations", {
      ...args,
      type: "resource_sharing",
      status: "active",
      lastMessageAt: Date.now(),
      createdAt: Date.now(),
    });
  },
});

export const createConflictChat = mutation({
  args: {
    initiatorDepartmentId: v.id("departments"),
    recipientDepartmentId: v.id("departments"),
    projectId: v.string(),
    projectConflictId: v.string(),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("conversations", {
      ...args,
      type: "project_conflict",
      status: "active",
      lastMessageAt: Date.now(),
      createdAt: Date.now(),
    });
  },
});

export const getConversationBetweenDepartments = query({
  args: {
    department1Id: v.id("departments"),
    department2Id: v.id("departments"),
    chatType: v.string(), // "project_conflict" or "resource_sharing"
  },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("conversations")
      .filter((q) =>
        q.and(
          q.eq(q.field("type"), args.chatType),
          q.or(
            q.and(
              q.eq(q.field("initiatorDepartmentId"), args.department1Id),
              q.eq(q.field("recipientDepartmentId"), args.department2Id)
            ),
            q.and(
              q.eq(q.field("initiatorDepartmentId"), args.department2Id),
              q.eq(q.field("recipientDepartmentId"), args.department1Id)
            )
          )
        )
      )
      .first();
  },
});
