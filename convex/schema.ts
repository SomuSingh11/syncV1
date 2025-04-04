import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  users: defineTable({
    userId: v.string(), //clerk
    name: v.string(),
    email: v.string(),
    role: v.string(), // admin, manager, staff
    departmentName: v.optional(v.string()),
    profileImage: v.optional(v.string()), //
    isActive: v.boolean(),
    onboardingComplete: v.boolean(),
    lastLogin: v.optional(v.number()),
    createdAt: v.number(),
    updatedAt: v.optional(v.number()),
  }).index("by_email", ["email"]),
});