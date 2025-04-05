import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  departments: defineTable({
    departmentId: v.string(),
    name: v.string(),
    email: v.string(),
    description: v.optional(v.string()),
    pointOfContact: v.string(),
    departmentType: v.optional(v.string()),
    parentDepartmentId: v.optional(v.string()),
    location: v.optional(
      v.object({
        city: v.string(),
        state: v.string(),
        zip: v.string(),
      })
    ),
    createdAt: v.number(),
  }).index("by_departmentId", ["departmentId"]),

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
  }).index("by_email", ["email"]), // Index for email

  resources: defineTable({
    resourceId: v.string(),
    departmentId: v.string(),
    departmentName: v.string(),
    name: v.string(),
    type: v.string(), // Equipment, Vehicle, Staff, etc.
    totalQuantity: v.number(),
    allocatedQuantity: v.number(),
    status: v.string(), // "active", "inactive", "maintenance", "shared", "outofservice"
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
    createdAt: v.number(),
  })
    .index("by_departmentId", ["departmentId"])
    .index("by_resourceId", ["resourceId"])
    .index("by_tags", ["tags"])
    .index("by_categories", ["categories"]),

  resourceRequests: defineTable({
    resourceId: v.id("resources"),
    resourceRequestId: v.string(),
    requestingDepartmentId: v.id("departments"),
    lendingDepartmentId: v.id("departments"),
    quantityRequested: v.number(),
    status: v.string(), //pending, approved, rejected
    priorityLevel: v.optional(v.string()), //low, medium, high
    description: v.optional(v.string()),
    expectedDuration: v.optional(
      v.object({
        start: v.number(),
        end: v.number(),
      })
    ),
    requestedAt: v.number(),
    expiresAt: v.number(),
  })
    .index("by_resourceId", ["resourceId"])
    .index("by_requestingDepartmentId", ["requestingDepartmentId"])
    .index("by_lendingDepartmentId", ["lendingDepartmentId"]),

  resourceAllocation: defineTable({
    allocationId: v.string(),
    resourceId: v.string(),
    lendingDepartmentId: v.string(),
    borrowingDepartmentId: v.string(),
    quantityAllocated: v.number(),
    startDate: v.number(),
    endDate: v.number(),
    status: v.string(), //active, completed
    returnStatus: v.optional(v.string()), //returned, notreturned
    returnCondition: v.optional(v.string()),
    createdAt: v.number(),
  })
    .index("by_resourceId", ["resourceId"])
    .index("by_lendingDepartmentId", ["lendingDepartmentId"])
    .index("by_borrowingDepartmentId", ["borrowingDepartmentId"])
    .index("by_status", ["status"]),

  notifications: defineTable({
    notificationId: v.string(),
    departmentId: v.string(),
    message: v.string(),
    isRead: v.boolean(),
    createdAt: v.number(),
  }).index("by_departmentId", ["departmentId"]),

  projects: defineTable({
    departmentId: v.id("departments"),
    name: v.string(),
    description: v.optional(v.string()),
    startDate: v.number(),
    endDate: v.number(),
    status: v.string(), // active, completed, cancelled
    location: v.object({
      type: v.string(), // Point, Polygon, LineString
      coordinates: v.array(v.number()), // For point [lng, lat], for polygon [[lng, lat], ...]
      radius: v.optional(v.number()), // For circular areas (in meters)
    }),
    budget: v.optional(v.number()),
    priority: v.string(), // high, medium, low
    resourcesRequired: v.optional(v.array(v.string())), // Array of resource IDs
    createdAt: v.number(),
  })
    .index("by_departmentId", ["departmentId"])
    .index("by_status", ["status"])
    .index("by_dateRange", ["startDate", "endDate"]),

  projectConflicts: defineTable({
    conflictId: v.string(),
    project1Id: v.id("projects"),
    project2Id: v.id("projects"),
    conflictType: v.string(), // spatial, temporal, resource
    conflictDetails: v.object({
      spatialOverlap: v.optional(v.number()), // Percentage of overlap
      temporalOverlap: v.optional(
        v.object({
          startDate: v.number(),
          endDate: v.number(),
        })
      ),
      conflictingResources: v.optional(v.array(v.string())), // Array of resource IDs
    }),
    status: v.string(), // detected, resolved, ignored
    resolution: v.optional(v.string()),
    createdAt: v.number(),
    resolvedAt: v.optional(v.number()),
  })
    .index("by_project1Id", ["project1Id"])
    .index("by_project2Id", ["project2Id"])
    .index("by_status", ["status"]),

  conversations: defineTable({
    initiatorDepartmentId: v.id("departments"),
    recipientDepartmentId: v.id("departments"),
    status: v.string(), // "active", "closed"
    type: v.string(), // "resource_sharing", "project_conflict"
    resourceId: v.optional(v.string()),
    projectId: v.optional(v.string()),
    projectConflictId: v.optional(v.string()),
    lastMessageAt: v.number(),
    createdAt: v.number(),
  })
    .index("by_departments", ["initiatorDepartmentId", "recipientDepartmentId"])
    .index("by_status", ["status"])
    .index("by_type", ["type"]),

  messages: defineTable({
    conversationId: v.id("conversations"),
    senderId: v.string(),
    senderDepartmentId: v.id("departments"),
    content: v.string(),
    timestamp: v.number(),
    type: v.string(), // "text", "resource_request", "project_conflict"
    resourceId: v.optional(v.string()),
    projectId: v.optional(v.string()),
    attachments: v.optional(v.array(v.string())),
    readBy: v.optional(v.array(v.string())),
  })
    .index("by_conversation", ["conversationId"])
    .index("by_timestamp", ["timestamp"]),

  projectConflictConversations: defineTable({
    project1DepartmentId: v.id("departments"),
    project2DepartmentId: v.id("departments"),
    projectConflictId: v.id("projectConflicts"),
    status: v.string(), // "active", "resolved", "closed"
    resolutionType: v.optional(v.string()), // "rescheduled", "relocated", "resourceReallocation", "other"
    lastMessageAt: v.number(),
    createdAt: v.number(),
    resolvedAt: v.optional(v.number()),
  })
    .index("by_departments", ["project1DepartmentId", "project2DepartmentId"])
    .index("by_conflict", ["projectConflictId"])
    .index("by_status", ["status"]),

  conflictMessages: defineTable({
    conversationId: v.id("projectConflictConversations"),
    senderId: v.string(),
    senderDepartmentId: v.id("departments"),
    content: v.string(),
    timestamp: v.number(),
    readBy: v.optional(v.array(v.string())),
    attachments: v.optional(v.array(v.string())),
  })
    .index("by_conversation", ["conversationId"])
    .index("by_timestamp", ["timestamp"]),

  // ai realted schemass

  // ... existing imports and schema start ...

  // Add new AI-related tables
  aiAnalysis: defineTable({
    projectId: v.id("projects"),
    departmentId: v.id("departments"),
    analysisType: v.string(), // "resource_conflict", "spatial_conflict", "timeline_conflict"
    severity: v.string(), // "low", "medium", "high"
    conflicts: v.array(
      v.object({
        type: v.string(),
        description: v.string(),
        affectedResources: v.optional(v.array(v.string())),
        impact: v.object({
          schedule: v.string(),
          cost: v.number(),
          risk: v.string(),
        }),
        recommendations: v.array(v.string()),
      })
    ),
    metrics: v.object({
      riskScore: v.number(),
      resourceUtilization: v.number(),
      budgetImpact: v.number(),
      scheduleDeviation: v.number(),
    }),
    status: v.string(), // "pending", "analyzed", "resolved"
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_projectId", ["projectId"])
    .index("by_departmentId", ["departmentId"])
    .index("by_status", ["status"]),

  aiRecommendations: defineTable({
    analysisId: v.id("aiAnalysis"),
    projectId: v.id("projects"),
    recommendationType: v.string(), // "resource_optimization", "schedule_adjustment", "conflict_resolution"
    description: v.string(),
    priority: v.string(), // "low", "medium", "high"
    status: v.string(), // "pending", "implemented", "rejected"
    impact: v.object({
      cost: v.number(),
      timeline: v.string(),
      resources: v.array(v.string()),
    }),
    implementationSteps: v.array(v.string()),
    createdAt: v.number(),
    implementedAt: v.optional(v.number()),
  })
    .index("by_analysisId", ["analysisId"])
    .index("by_projectId", ["projectId"])
    .index("by_status", ["status"]),

  // ... rest of your existing schema
});