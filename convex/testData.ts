import { mutation } from "./_generated/server";
import { v } from "convex/values";


export const insertTestData = mutation({
  args: {},
  handler: async (ctx) => {
    // Insert test department
    const departmentId = await ctx.db.insert("departments", {
      departmentId: "test_dept_" + Date.now(), // Add required departmentId
      name: "Test Department",
      email: "test@example.com",
      description: "A test department for AI analysis",
      pointOfContact: "John Doe",
      departmentType: "Engineering",
      location: {
        // Add optional location
        city: "Test City",
        state: "Test State",
        zip: "12345",
      },
      createdAt: Date.now(),
    });

    // Insert test project
    const projectId = await ctx.db.insert("projects", {
      departmentId,
      name: "Test Project",
      description: "A test project for AI analysis",
      startDate: Date.now(),
      endDate: Date.now() + 90 * 24 * 60 * 60 * 1000,
      status: "active",
      location: {
        type: "Point",
        coordinates: [0, 0],
        radius: 1000,
      },
      budget: 100000,
      priority: "low",
      resourcesRequired: ['equip1'],
      createdAt: Date.now(),
    });

    // Insert test resources
    await ctx.db.insert("resources", {
      resourceId: "test_resource_1",
      departmentId,
      departmentName: "Test Department",
      name: "Test Equipment",
      type: "Equipment",
      totalQuantity: 10,
      allocatedQuantity: 5,
      status: "active",
      isGlobal: false,
      description: "Test equipment for analysis",
      usageHistory: [],
      price: 5000,
      location: {
        city: "Test City",
        state: "Test State",
        zip: "12345",
      },
      categories: ["equipment", "test"],
      tags: ["test", "analysis"],
      createdAt: Date.now(),
    });

    return { projectId, departmentId };
  },
});
