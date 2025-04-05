import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  AlertTriangle,
  Clock,
  DollarSign,
  ArrowRight,
  AlertCircle,
} from "lucide-react";
import { Progress } from "@/components/ui/progress";

interface RiskMetrics {
  resourceRisk: number;
  scheduleRisk: number;
  scopeRisk: number;
  budgetRisk: number;
}

interface ConflictProps {
  conflicts: {
    type: string;
    description: string;
    impact: {
      risk: string;
      schedule: string;
      cost: number;
    };
    recommendations: string[];
    metrics?: RiskMetrics;
  }[];
}

export function ConflictList({ conflicts }: ConflictProps) {
  if (conflicts.length === 0) {
    return (
      <Card className="p-6 text-center text-muted-foreground">
        No conflicts detected
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-4">
        <AlertTriangle className="h-5 w-5 text-amber-500" />
        <h3 className="text-lg font-semibold">Resource Conflicts</h3>
      </div>

      <div className="grid gap-4">
        {conflicts.map((conflict, index) => (
          <Card key={index} className="p-4 hover:shadow-md transition-shadow">
            <div className="space-y-4">
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-2">
                  <Badge
                    variant={
                      conflict.impact.risk === "high"
                        ? "destructive"
                        : "outline"
                    }
                  >
                    {conflict.impact.risk.toUpperCase()}
                  </Badge>
                  <Badge variant="secondary">{conflict.type}</Badge>
                </div>
              </div>

              <p className="text-sm text-muted-foreground">
                {conflict.description}
              </p>

              {conflict.metrics && (
                <div className="space-y-3 bg-muted/50 p-3 rounded-lg">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium w-32">
                      Resource Risk
                    </span>
                    <div className="flex-1 flex items-center gap-2">
                      <Progress
                        value={conflict.metrics.resourceRisk}
                        className="h-2"
                        indicatorClassName={
                          conflict.metrics.resourceRisk > 70 ? "bg-red-500" : ""
                        }
                      />
                      <span className="text-sm w-12">
                        {conflict.metrics.resourceRisk}%
                      </span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium w-32">
                      Schedule Risk
                    </span>
                    <div className="flex-1 flex items-center gap-2">
                      <Progress
                        value={conflict.metrics.scheduleRisk}
                        className="h-2"
                        indicatorClassName={
                          conflict.metrics.scheduleRisk > 70 ? "bg-red-500" : ""
                        }
                      />
                      <span className="text-sm w-12">
                        {conflict.metrics.scheduleRisk}%
                      </span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium w-32">Scope Risk</span>
                    <div className="flex-1 flex items-center gap-2">
                      <Progress
                        value={conflict.metrics.scopeRisk}
                        className="h-2"
                        indicatorClassName={
                          conflict.metrics.scopeRisk > 70 ? "bg-red-500" : ""
                        }
                      />
                      <span className="text-sm w-12">
                        {conflict.metrics.scopeRisk}%
                      </span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium w-32">
                      Budget Risk
                    </span>
                    <div className="flex-1 flex items-center gap-2">
                      <Progress
                        value={conflict.metrics.budgetRisk}
                        className="h-2"
                        indicatorClassName={
                          conflict.metrics.budgetRisk > 70 ? "bg-red-500" : ""
                        }
                      />
                      <span className="text-sm w-12">
                        {conflict.metrics.budgetRisk}%
                      </span>
                    </div>
                  </div>
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">{conflict.impact.schedule}</span>
                </div>
                <div className="flex items-center gap-2">
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">
                    Impact: ${conflict.impact.cost || 0}
                  </span>
                </div>
              </div>

              {conflict.recommendations &&
                conflict.recommendations.length > 0 && (
                  <div className="pt-2 border-t">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <ArrowRight className="h-4 w-4" />
                      <span>Recommended Action:</span>
                    </div>
                    <ul className="list-disc list-inside text-sm pl-5 pt-1">
                      {conflict.recommendations.map(
                        (rec: string, idx: number) => (
                          <li key={idx}>{rec}</li>
                        )
                      )}
                    </ul>
                  </div>
                )}
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
