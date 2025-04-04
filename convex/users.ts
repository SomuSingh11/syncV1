import { v } from "convex/values";
import { mutation} from "./_generated/server";

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
