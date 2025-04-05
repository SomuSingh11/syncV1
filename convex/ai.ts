import { query,mutation,action} from "./_generated/server";
import { v } from "convex/values";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { api } from "./_generated/api";

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
  resourcesRequired?: string[];
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


export const analyzeProject = action({
  args: {
    projectId: v.id("projects"),
    departmentId: v.id("departments"),
  },
  handler: async (ctx, args) => {
    const { projectId, departmentId } = args;
     if (!process.env.GEMINI_API_KEY) {
       throw new Error("GEMINI_API_KEY is not configured");
     }


     try{
   const project = (await ctx.runQuery(api.ai.getProject, {
        projectId,
      })) as Project;
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
     }
catch(error){
    console.error("AI Analysis error:", error);
    throw new Error(
      "Failed to generate AI analysis. Please check API configuration."
    );
}
    // Get project and resources data
   
  },
});

export const getProject = query({
  args: { projectId: v.id("projects") },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("projects")
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

function generatePrompt(project: any, resources: any) {
  return `
    Analyze this project and its resource utilization:
    Project Details: ${JSON.stringify(project)}
    Available Resources: ${JSON.stringify(resources)}
    
    Please provide:
    1. Resource conflicts and risks
    2. Timeline impact analysis
    3. Budget utilization assessment
    4. Resource optimization recommendations
    5. Overall risk score (0-100)
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


export const storeAnalysis = mutation({
  args: {
    projectId: v.id("projects"),
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
