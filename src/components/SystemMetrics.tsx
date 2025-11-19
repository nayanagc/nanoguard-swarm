import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";

interface Metric {
  label: string;
  value: number;
  unit: string;
  status: "optimal" | "warning" | "critical";
}

const metrics: Metric[] = [
  { label: "AI Classification Accuracy", value: 98.7, unit: "%", status: "optimal" },
  { label: "Network Coordination", value: 94.2, unit: "%", status: "optimal" },
  { label: "Debris Cleared (24h)", value: 127, unit: "", status: "optimal" },
  { label: "Active Alerts", value: 3, unit: "", status: "warning" },
];

const SystemMetrics = () => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "optimal":
        return "bg-success";
      case "warning":
        return "bg-warning";
      case "critical":
        return "bg-destructive";
      default:
        return "bg-primary";
    }
  };

  return (
    <Card className="p-4 bg-card border-border">
      <h3 className="text-sm font-mono text-muted-foreground mb-4">
        SYSTEM METRICS
      </h3>
      <div className="space-y-4">
        {metrics.map((metric, idx) => (
          <div key={idx} className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-xs font-mono text-muted-foreground">
                {metric.label}
              </span>
              <span className="text-sm font-mono text-foreground">
                {metric.value}
                {metric.unit}
              </span>
            </div>
            {metric.unit === "%" && (
              <Progress
                value={metric.value}
                className="h-1"
                indicatorClassName={getStatusColor(metric.status)}
              />
            )}
          </div>
        ))}
      </div>

      <div className="mt-6 pt-4 border-t border-border">
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <div className="text-2xl font-mono text-primary">4</div>
            <div className="text-xs font-mono text-muted-foreground mt-1">
              Active Nanosats
            </div>
          </div>
          <div>
            <div className="text-2xl font-mono text-success">847</div>
            <div className="text-xs font-mono text-muted-foreground mt-1">
              Objects Tracked
            </div>
          </div>
          <div>
            <div className="text-2xl font-mono text-warning">12</div>
            <div className="text-xs font-mono text-muted-foreground mt-1">
              Threats Mitigated
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default SystemMetrics;
