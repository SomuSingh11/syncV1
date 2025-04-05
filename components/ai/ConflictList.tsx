import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle } from "lucide-react";

export function ConflictList({ conflicts }: { conflicts: any[] }) {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Detected Conflicts</h3>

      {conflicts.map((conflict, index) => (
        <Card key={index} className="p-4">
          <div className="flex items-start gap-3">
            <AlertTriangle className="h-5 w-5 text-amber-500" />
            <div>
              <h4 className="font-medium">{conflict.description}</h4>
              <div className="mt-2 flex gap-2">
                <Badge>{conflict.type}</Badge>
                <Badge variant="outline">{conflict.impact.risk}</Badge>
              </div>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}
