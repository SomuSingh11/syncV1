import { Progress } from "@/components/ui/progress";

export function RiskMetrics({ metrics }: { metrics: any }) {
  const formatDeviation = (value: number) => {
    return value > 0 ? `+${value}%` : `${value}%`;
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Risk Analysis</h3>

      <div className="grid gap-4">
        {/* Risk Score */}
        <div>
          <div className="flex justify-between mb-2">
            <span>Risk Score</span>
            <span>{metrics.riskScore}%</span>
          </div>
          <Progress value={metrics.riskScore} />
        </div>

        {/* Resource Utilization */}
        <div>
          <div className="flex justify-between mb-2">
            <span>Resource Utilization</span>
            <span>{metrics.resourceUtilization}%</span>
          </div>
          <Progress value={metrics.resourceUtilization} />
        </div>

        {/* Budget Impact */}
        <div>
          <div className="flex justify-between mb-2">
            <span>Budget Impact</span>
            <span>{metrics.budgetImpact}%</span>
          </div>
          <Progress value={metrics.budgetImpact} />
        </div>

        {/* Schedule Deviation */}
        <div>
          <div className="flex justify-between mb-2">
            <span>Schedule Deviation</span>
            <span>{formatDeviation(metrics.scheduleDeviation)}</span>
          </div>
          <Progress
            value={Math.min(100, Math.abs(metrics.scheduleDeviation))}
          />
        </div>
      </div>
    </div>
  );
}
