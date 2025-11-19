import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { AlertCircle, CheckCircle, AlertTriangle, Search, ArrowUpDown } from "lucide-react";

interface DebrisData {
  id: string;
  size: string;
  threat: "low" | "medium" | "high";
  distance: number;
  velocity: number;
  classification: string;
  action: string;
}

const debrisList: DebrisData[] = [
  {
    id: "D-001",
    size: "0.5cm",
    threat: "low",
    distance: 245,
    velocity: 0.8,
    classification: "Paint Fleck",
    action: "Nudge scheduled",
  },
  {
    id: "D-002",
    size: "2.3cm",
    threat: "medium",
    distance: 189,
    velocity: 1.2,
    classification: "Metal Fragment",
    action: "Tracking",
  },
  {
    id: "D-003",
    size: "15cm",
    threat: "high",
    distance: 156,
    velocity: 2.4,
    classification: "Satellite Component",
    action: "Alert broadcast",
  },
  {
    id: "D-004",
    size: "0.8cm",
    threat: "low",
    distance: 312,
    velocity: 0.6,
    classification: "Ice Crystal",
    action: "Monitoring",
  },
];

const DebrisTracking = () => {
  const getThreatIcon = (threat: string) => {
    switch (threat) {
      case "high":
        return <AlertCircle className="w-4 h-4 text-destructive" />;
      case "medium":
        return <AlertTriangle className="w-4 h-4 text-warning" />;
      default:
        return <CheckCircle className="w-4 h-4 text-success" />;
    }
  };

  const getThreatColor = (threat: string) => {
    switch (threat) {
      case "high":
        return "text-destructive";
      case "medium":
        return "text-warning";
      default:
        return "text-success";
    }
  };

  return (
    <Card className="p-4 bg-card border-border">
      <h3 className="text-sm font-mono text-muted-foreground mb-4">
        DEBRIS DETECTION & TRACKING
      </h3>
      <div className="space-y-2">
        {debrisList.map((debris) => (
          <div
            key={debris.id}
            className="p-3 bg-secondary/50 rounded-lg border border-border/50 hover:border-primary/50 transition-colors"
          >
            <div className="flex items-start justify-between mb-2">
              <div className="flex items-center gap-2">
                {getThreatIcon(debris.threat)}
                <span className="font-mono text-sm text-foreground">
                  {debris.id}
                </span>
                <Badge
                  variant="outline"
                  className={`text-xs ${getThreatColor(debris.threat)}`}
                >
                  {debris.threat}
                </Badge>
              </div>
              <span className="font-mono text-xs text-muted-foreground">
                {debris.distance}km
              </span>
            </div>
            <div className="grid grid-cols-2 gap-2 text-xs font-mono text-muted-foreground">
              <div>SIZE: {debris.size}</div>
              <div>VEL: {debris.velocity}km/s</div>
              <div className="col-span-2">TYPE: {debris.classification}</div>
              <div className="col-span-2 text-primary">→ {debris.action}</div>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
};

export default DebrisTracking;
