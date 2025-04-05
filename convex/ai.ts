import { query,mutation,action} from "./_generated/server";
import { v } from "convex/values";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { api } from "./_generated/api";
import { Id } from "./_generated/dataModel";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

interface Project {
  _id: string;
  departmentId: string;
  name: string;
  description?: string;
  startDate: number;
  endDate: number;
  status: string;
  location: {
    type: string;
    coordinates: number[];
    radius?: number;
  };
  budget?: number;
  priority: string;
  resourcesRequired: {
    resourceId: Id<"resources">;
    quantity: number;
  }[];
  createdAt: number;
}

interface Resource {
  _id: string;
  departmentId: string;
  name: string;
  type: string;
  totalQuantity: number;
  allocatedQuantity: number;
  status: string;
  isGlobal: boolean;
  description?: string;
  price?: number;
  createdAt: number;
}


export const analyzeTestProject = action({
  args: {
    projectId: v.id("testProjects"),
    departmentId: v.id("departments"),
    resources: v.array(
      v.object({
        resourceId: v.string(),
        name: v.string(),
        type: v.string(),
        available: v.number(),
      })
    ),
  },
  handler: async (ctx, args) => {
    const { projectId, departmentId } = args;
    if (!process.env.GEMINI_API_KEY) {
      throw new Error("GEMINI_API_KEY is not configured");
    }

    try {
      const project = (await ctx.runQuery(api.testProjects.getById, {
        id: projectId,
      })) as {
        _id: string;
        departmentId: string;
        name: string;
        description?: string;
        startDate: number;
        endDate: number;
        status: string;
        location: {
          type: string;
          coordinates: number[];
          radius?: number;
        };
        budget?: number;
        priority: string;
        resourcesRequired: Id<"resources">[];
        createdAt: number;
      };
      const resources = (await ctx.runQuery(api.ai.getResources, {
        departmentId,
      })) as Resource[];

      // Generate AI analysis
      const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
      const result = await model.generateContent(
        generatePrompt(project, resources)
      );

      return {
        analysisResult: result.response.text(),
        project,
        resources,
      };
    } catch (error) {
      console.error("AI Analysis error:", error);
      throw new Error(
        "Failed to generate AI analysis. Please check API configuration."
      );
    }
    // Get project and resources data
  },
});

export const getTestProject = query({
  args: { projectId: v.id("testProjects") },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("testProjects")
      .filter((q) => q.eq(q.field("_id"), args.projectId))
      .first();
  },
});

export const getResources = query({
  args: { departmentId: v.id("departments") },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("resources")
      .filter((q) => q.eq(q.field("departmentId"), args.departmentId))
      .collect();
  },
});

function generatePrompt(project: {
  _id: string;
  departmentId: string;
  name: string;
  description?: string;
  startDate: number;
  endDate: number;
  status: string;
  location: {
    type: string;
    coordinates: number[];
    radius?: number;
  };
  budget?: number;
  priority: string;
  resourcesRequired: Id<"resources">[];
  createdAt: number;
}, resources: Resource[]) {
  return `
    As an AI project analyzer, analyze this project and its resource utilization. Provide a detailed, structured response.

    Project Details:
    - Name: ${project.name}
    - Description: ${project.description}
    - Timeline: ${new Date(project.startDate).toLocaleDateString()} to ${new Date(project.endDate).toLocaleDateString()}
    - Budget: $${project.budget}
    - Priority: ${project.priority}
    - Status: ${project.status}

    Available Resources:
    ${resources.map((r) => `- ${r.name} (${r.allocatedQuantity}/${r.totalQuantity} allocated)`).join("\n")}

    Please provide your analysis in the following structured format:

    1. RESOURCE CONFLICTS AND RISKS
    - List specific resource conflicts
    - Identify potential bottlenecks
    - Resource availability risks

    2. TIMELINE ANALYSIS
    - Project duration assessment
    - Critical path impacts
    - Schedule risk level (Low/Medium/High)

    3. BUDGET ASSESSMENT
    - Current resource cost: ${resources.reduce((sum, r) => sum + (r.price || 0) * r.allocatedQuantity, 0)}
    - Budget utilization percentage
    - Cost optimization opportunities

    4. RESOURCE OPTIMIZATION
    - Specific recommendations for resource allocation
    - Alternative resource strategies
    - Efficiency improvements

    5. RISK ASSESSMENT
    - Overall risk score (0-100)
    - Risk breakdown by category
    - Mitigation recommendations

    Please be specific and quantitative where possible, and provide actionable recommendations.
  `;
}


// Helper function to parse conflicts from AI response
function parseConflicts(analysisResult: string) {
  // Basic parsing logic - you can enhance this based on your AI response format
  const conflicts = [];
  
  try {
    // Split the analysis into sections
    const sections = analysisResult.split('\n');
    
    for (const section of sections) {
      if (section.toLowerCase().includes('conflict') || section.toLowerCase().includes('risk')) {
        conflicts.push({
          type: 'resource_conflict',
          description: section,
          affectedResources: [],
          impact: {
            schedule: 'Potential delay',
            cost: 0,
            risk: 'medium'
          },
          recommendations: ['Review resource allocation']
        });
      }
    }
  } catch (error) {
    console.error('Error parsing conflicts:', error);
  }

  return conflicts;
}

function calculateMetrics(analysisResult: string) {
  // Default metrics
  const metrics = {
    riskScore: 50,
    resourceUtilization: 75,
    budgetImpact: 0,
    scheduleDeviation: 0,
  };

  try {
    // Extract risk score if present
    const riskMatch = analysisResult.match(/risk score.*?(\d+)/i);
    if (riskMatch) {
      metrics.riskScore = parseInt(riskMatch[1]);
    }

    // Extract utilization if present
    const utilizationMatch = analysisResult.match(/utilization.*?(\d+)/i);
    if (utilizationMatch) {
      metrics.resourceUtilization = parseInt(utilizationMatch[1]);
    }
  } catch (error) {
    console.error("Error calculating metrics:", error);
  }

  return metrics;
}


export const storeTestAnalysis = mutation({
  args: {
    projectId: v.id("testProjects"),
    departmentId: v.id("departments"),
    analysisResult: v.string(),
  },
  handler: async (ctx, args) => {
    const analysis = await ctx.db.insert("aiAnalysis", {
      projectId: args.projectId,
      departmentId: args.departmentId,
      analysisType: "resource_conflict",
      severity: "medium",
      conflicts: parseConflicts(args.analysisResult),
      metrics: calculateMetrics(args.analysisResult),
      status: "analyzed",
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });

    return analysis;
  },
});
