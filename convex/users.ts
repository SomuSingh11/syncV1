import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

// Sync user from Clerk
export const syncUser = mutation({
  args: {
    userId: v.string(),
    email: v.string(),
    name: v.string(),
  },
  handler: async (ctx, args) => {
    const existingUser = await ctx.db
      .query("users")
      .filter((q) => q.eq(q.field("userId"), args.userId))
      .first();

    if (!existingUser) {
      await ctx.db.insert("users", {
        userId: args.userId,
        email: args.email,
        name: args.name,
        departmentName: undefined,
        role: "user",
        profileImage: undefined,
        isActive: true,
        onboardingComplete: false,
        lastLogin: Date.now(),
        createdAt: Date.now(),
        updatedAt: undefined,
      });

      return {
        needsDepartment: true,
        userId: args.userId,
      };
    } else {
      await ctx.db.patch(existingUser._id, {
        lastLogin: Date.now(),
      });

      return {
        userId: args.userId,
        departmentName: existingUser.departmentName,
        role: existingUser.role,
      };
    }
  },
});

// Get user by ID
export const getUser = query({
  args: { userId: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("users")
      .filter((q) => q.eq(q.field("userId"), args.userId))
      .first();
  },
});

// Get user by email
export const getUserByEmail = query({
  args: { email: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("users")
      .withIndex("by_email", (q) => q.eq("email", args.email))
      .first();
  },
});

// Check if user has a department
export const getUserDepartmentStatus = query({
  args: { userId: v.string() },
  handler: async (ctx, args) => {
    const user = await ctx.db
      .query("users")
      .filter((q) => q.eq(q.field("userId"), args.userId))
      .first();

    if (!user) {
      return { exists: false };
    }

    // Check if user is a point of contact for any department
    const departmentAsContact = await ctx.db
      .query("departments")
      .filter((q) => q.eq(q.field("pointOfContact"), args.userId))
      .first();

    return {
      exists: true,
      hasDepartment: !!user.departmentName,
      departmentName: user.departmentName,
      role: user.role,
      onboardingComplete: user.onboardingComplete,
      isPointOfContact: !!departmentAsContact,
      pointOfContactFor: departmentAsContact
        ? departmentAsContact.name
        : undefined,
      departmentId: departmentAsContact ? departmentAsContact._id : undefined, // Return the internal Convex ID
    };
  },
});

// Assign user to a department using internal _id
export const assignUserToDepartment = mutation({
  args: {
    userId: v.string(),
    departmentId: v.id("departments"), // Use internal _id type
    departmentName: v.string(),
    role: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const user = await ctx.db
      .query("users")
      .filter((q) => q.eq(q.field("userId"), args.userId))
      .first();

    if (!user) {
      throw new Error("User not found");
    }

    const department = await ctx.db.get(args.departmentId);
    if (!department) {
      throw new Error("Department not found");
    }

    await ctx.db.patch(user._id, {
      departmentName: department.name, // Assuming department has a name field
      role: args.role || "staff",
      onboardingComplete: true,
      updatedAt: Date.now(),
    });

    return {
      success: true,
      userId: args.userId,
      departmentName: department.name,
      role: args.role || "staff",
    };
  },
});

// Remove user from department
export const removeUserFromDepartment = mutation({
  args: {
    userId: v.string(),
  },
  handler: async (ctx, args) => {
    const user = await ctx.db
      .query("users")
      .filter((q) => q.eq(q.field("userId"), args.userId))
      .first();

    if (!user) {
      throw new Error("User not found");
    }

    await ctx.db.patch(user._id, {
      departmentName: undefined,
      onboardingComplete: false,
      updatedAt: Date.now(),
    });

    return { success: true };
  },
});

// List all users
export const listUsers = query({
  handler: async (ctx) => {
    return await ctx.db.query("users").collect();
  },
});
