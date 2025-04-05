import { useMutation, useAction, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RiskMetrics } from "./RiskMetrics";
import { ConflictList } from "./ConflictList";
import { Id } from "@/convex/_generated/dataModel";
import { useState } from "react";

interface ProjectAnalysisProps {
  projectId: Id<"testProjects">;
  departmentId: Id<"departments">;
}

export function ProjectAnalysis({
  projectId,
  departmentId,
}: ProjectAnalysisProps) {
  const analyzeTestProject = useAction(api.ai.analyzeTestProject);
  const storeTestAnalysis = useMutation(api.ai.storeTestAnalysis);
  const testProject = useQuery(api.testProjects.getById, { id: projectId });
  const resources = useQuery(api.resources.getAll);
  const [analysis, setAnalysis] = useState<any>(null);

  function calculateMetrics(analysisResult: string) {
    const metrics = {
      riskScore: 50,
      resourceUtilization: 75,
      budgetImpact: 0,
      scheduleDeviation: 0,
    };

    try {
      const riskMatch = analysisResult.match(/risk score.*?(\d+)/i);
      if (riskMatch) {
        metrics.riskScore = parseInt(riskMatch[1]);
      }

      const utilizationMatch = analysisResult.match(/utilization.*?(\d+)/i);
      if (utilizationMatch) {
        metrics.resourceUtilization = parseInt(utilizationMatch[1]);
      }
    } catch (error) {
      console.error("Error calculating metrics:", error);
    }

    return metrics;
  }

  function parseConflicts(analysisResult: string) {
    const conflicts = [];
    try {
      const sections = analysisResult.split("\n");
      for (const section of sections) {
        if (
          section.toLowerCase().includes("conflict") ||
          section.toLowerCase().includes("risk")
        ) {
          conflicts.push({
            type: "resource_conflict",
            description: section,
            severity: "medium",
            impact: { schedule: "Potential delay", cost: 0, risk: "medium" },
          });
        }
      }
    } catch (error) {
      console.error("Error parsing conflicts:", error);
    }
    return conflicts;
  }

  const handleAnalysis = async () => {
    if (!testProject || !resources) return;

    const requiredResources = testProject.resourcesRequired?.map((resourceId) => {
      const resourceData = resources.find((r) => r._id === resourceId);
      return {
        resourceId,
        name: resourceData?.name || "",
        type: resourceData?.type || "",
        available: resourceData?.totalQuantity || 0,
      };
    }) || [];

    const result = await analyzeTestProject({
      projectId,
      departmentId,
      resources: requiredResources,
    });

    setAnalysis(result);

    if (result) {
      await storeTestAnalysis({
        projectId,
        departmentId,
        analysisResult: result.analysisResult,
      });
    }
  };

  const metrics = analysis?.analysisResult
    ? calculateMetrics(analysis.analysisResult)
    : null;

  const conflicts = analysis?.analysisResult
    ? parseConflicts(analysis.analysisResult)
    : [];

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <h2 className="text-2xl font-bold mb-4">Project Analysis</h2>
        <Button
          onClick={handleAnalysis}
          className="mb-4"
          disabled={!testProject || !resources}
        >
          Run Analysis
        </Button>

        {analysis && (
          <div className="space-y-4">
            {metrics && <RiskMetrics metrics={metrics} />}
            <ConflictList conflicts={conflicts} />
          </div>
        )}
      </Card>
    </div>
  );
}
