import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { AlertTriangle, Target, TrendingDown, Zap } from "lucide-react";

interface DebrisAnalysis {
  id: string;
  name: string;
  classification: string;
  confidence: number;
  size: { width: number; height: number; depth: number };
  mass: number;
  velocity: number;
  altitude: number;
  decayPrediction: {
    currentOrbit: number;
    targetOrbit: number;
    estimatedDays: number;
    probability: number;
  };
  aiFeatures: {
    material: string;
    materialConfidence: number;
    shape: string;
    shapeConfidence: number;
    origin: string;
    originConfidence: number;
  };
  maneuverPlan?: {
    thrust: number;
    duration: number;
    deltaV: number;
    fuelRequired: number;
    successProbability: number;
  };
}

const DebrisAnalysisPanel = () => {
  const [selectedDebris, setSelectedDebris] = useState<DebrisAnalysis>({
    id: "D-003",
    name: "Large Fragment Alpha",
    classification: "Rocket Body Fragment",
    confidence: 0.94,
    size: { width: 2.3, height: 1.8, depth: 0.9 },
    mass: 45.2,
    velocity: 7.8,
    altitude: 420,
    decayPrediction: {
      currentOrbit: 420,
      targetOrbit: 380,
      estimatedDays: 87,
      probability: 0.89,
    },
    aiFeatures: {
      material: "Aluminum Alloy",
      materialConfidence: 0.91,
      shape: "Irregular Cylindrical",
      shapeConfidence: 0.88,
      origin: "Decommissioned Launch Vehicle",
      originConfidence: 0.94,
    },
    maneuverPlan: {
      thrust: 0.025,
      duration: 180,
      deltaV: 4.5,
      fuelRequired: 0.12,
      successProbability: 0.87,
    },
  });

  const [realTimeData, setRealTimeData] = useState({
    tracking: true,
    lastUpdate: new Date(),
    signalStrength: 0.92,
  });

  useEffect(() => {
    const interval = setInterval(() => {
      setRealTimeData((prev) => ({
        ...prev,
        lastUpdate: new Date(),
        signalStrength: 0.85 + Math.random() * 0.15,
      }));

      setSelectedDebris((prev) => ({
        ...prev,
        velocity: prev.velocity + (Math.random() - 0.5) * 0.01,
        altitude: prev.altitude + (Math.random() - 0.5) * 0.5,
        confidence: Math.min(0.99, prev.confidence + (Math.random() - 0.5) * 0.01),
      }));
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  const getThreatLevel = (confidence: number) => {
    if (confidence > 0.9) return { label: "HIGH", variant: "destructive" as const };
    if (confidence > 0.7) return { label: "MEDIUM", variant: "default" as const };
    return { label: "LOW", variant: "secondary" as const };
  };

  const threat = getThreatLevel(selectedDebris.confidence);

  return (
    <Card className="bg-card border-border">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-lg font-mono">DEBRIS ANALYSIS</CardTitle>
            <p className="text-xs text-muted-foreground font-mono mt-1">
              Real-time AI Classification & Maneuver Planning
            </p>
          </div>
          <div className="flex items-center gap-2">
            <div
              className={`w-2 h-2 rounded-full ${
                realTimeData.tracking ? "bg-success animate-pulse-slow" : "bg-muted"
              }`}
            />
            <span className="text-xs font-mono text-muted-foreground">
              LIVE
            </span>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Target Info */}
        <div className="p-3 bg-muted/30 rounded-lg">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <Target className="w-4 h-4 text-primary" />
              <span className="font-mono font-semibold text-sm">
                {selectedDebris.name}
              </span>
            </div>
            <Badge variant={threat.variant}>{threat.label}</Badge>
          </div>
          <div className="text-xs text-muted-foreground font-mono">
            ID: {selectedDebris.id} | Updated:{" "}
            {realTimeData.lastUpdate.toLocaleTimeString()}
          </div>
        </div>

        {/* AI Classification */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <AlertTriangle className="w-4 h-4 text-primary" />
            <span className="text-sm font-mono font-semibold">
              AI CLASSIFICATION
            </span>
          </div>
          <div className="space-y-2">
            <div>
              <div className="flex justify-between text-xs font-mono mb-1">
                <span className="text-muted-foreground">Type</span>
                <span className="text-foreground">
                  {selectedDebris.classification}
                </span>
              </div>
              <Progress
                value={selectedDebris.confidence * 100}
                className="h-1.5"
                indicatorClassName="bg-primary"
              />
              <div className="text-right text-xs font-mono text-primary mt-0.5">
                {(selectedDebris.confidence * 100).toFixed(1)}%
              </div>
            </div>

            <Separator className="my-2" />

            <div className="grid grid-cols-2 gap-2 text-xs">
              <div>
                <div className="text-muted-foreground font-mono mb-1">
                  Material
                </div>
                <div className="font-mono">{selectedDebris.aiFeatures.material}</div>
                <Progress
                  value={selectedDebris.aiFeatures.materialConfidence * 100}
                  className="h-1 mt-1"
                  indicatorClassName="bg-success"
                />
              </div>
              <div>
                <div className="text-muted-foreground font-mono mb-1">Shape</div>
                <div className="font-mono">{selectedDebris.aiFeatures.shape}</div>
                <Progress
                  value={selectedDebris.aiFeatures.shapeConfidence * 100}
                  className="h-1 mt-1"
                  indicatorClassName="bg-success"
                />
              </div>
            </div>

            <div>
              <div className="text-muted-foreground font-mono mb-1 text-xs">
                Origin
              </div>
              <div className="font-mono text-xs">{selectedDebris.aiFeatures.origin}</div>
              <Progress
                value={selectedDebris.aiFeatures.originConfidence * 100}
                className="h-1 mt-1"
                indicatorClassName="bg-success"
              />
            </div>
          </div>
        </div>

        <Separator />

        {/* Physical Properties */}
        <div>
          <div className="text-sm font-mono font-semibold mb-2">
            PHYSICAL PROPERTIES
          </div>
          <div className="grid grid-cols-2 gap-2 text-xs font-mono">
            <div className="p-2 bg-muted/30 rounded">
              <div className="text-muted-foreground mb-1">Size (m)</div>
              <div>
                {selectedDebris.size.width.toFixed(1)} ×{" "}
                {selectedDebris.size.height.toFixed(1)} ×{" "}
                {selectedDebris.size.depth.toFixed(1)}
              </div>
            </div>
            <div className="p-2 bg-muted/30 rounded">
              <div className="text-muted-foreground mb-1">Mass (kg)</div>
              <div>{selectedDebris.mass.toFixed(1)}</div>
            </div>
            <div className="p-2 bg-muted/30 rounded">
              <div className="text-muted-foreground mb-1">Velocity (km/s)</div>
              <div>{selectedDebris.velocity.toFixed(2)}</div>
            </div>
            <div className="p-2 bg-muted/30 rounded">
              <div className="text-muted-foreground mb-1">Altitude (km)</div>
              <div>{selectedDebris.altitude.toFixed(1)}</div>
            </div>
          </div>
        </div>

        <Separator />

        {/* Orbital Decay Prediction */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <TrendingDown className="w-4 h-4 text-primary" />
            <span className="text-sm font-mono font-semibold">
              ORBITAL DECAY PREDICTION
            </span>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between text-xs font-mono">
              <span className="text-muted-foreground">Current Orbit</span>
              <span>{selectedDebris.decayPrediction.currentOrbit} km</span>
            </div>
            <div className="flex justify-between text-xs font-mono">
              <span className="text-muted-foreground">Target Orbit</span>
              <span>{selectedDebris.decayPrediction.targetOrbit} km</span>
            </div>
            <Progress
              value={
                ((selectedDebris.decayPrediction.currentOrbit -
                  selectedDebris.decayPrediction.targetOrbit) /
                  selectedDebris.decayPrediction.currentOrbit) *
                100
              }
              className="h-2"
              indicatorClassName="bg-success"
            />
            <div className="flex justify-between text-xs font-mono">
              <span className="text-muted-foreground">Estimated Time</span>
              <span className="text-success">
                {selectedDebris.decayPrediction.estimatedDays} days
              </span>
            </div>
            <div className="flex justify-between text-xs font-mono">
              <span className="text-muted-foreground">Success Probability</span>
              <span className="text-success">
                {(selectedDebris.decayPrediction.probability * 100).toFixed(0)}%
              </span>
            </div>
          </div>
        </div>

        <Separator />

        {/* Maneuver Planning */}
        {selectedDebris.maneuverPlan && (
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Zap className="w-4 h-4 text-primary" />
              <span className="text-sm font-mono font-semibold">
                NUDGE MANEUVER PLAN
              </span>
            </div>
            <div className="space-y-2 text-xs font-mono">
              <div className="grid grid-cols-2 gap-2">
                <div className="p-2 bg-muted/30 rounded">
                  <div className="text-muted-foreground mb-1">Thrust (N)</div>
                  <div>{selectedDebris.maneuverPlan.thrust.toFixed(3)}</div>
                </div>
                <div className="p-2 bg-muted/30 rounded">
                  <div className="text-muted-foreground mb-1">Duration (s)</div>
                  <div>{selectedDebris.maneuverPlan.duration}</div>
                </div>
                <div className="p-2 bg-muted/30 rounded">
                  <div className="text-muted-foreground mb-1">ΔV (m/s)</div>
                  <div>{selectedDebris.maneuverPlan.deltaV.toFixed(2)}</div>
                </div>
                <div className="p-2 bg-muted/30 rounded">
                  <div className="text-muted-foreground mb-1">Fuel (kg)</div>
                  <div>{selectedDebris.maneuverPlan.fuelRequired.toFixed(2)}</div>
                </div>
              </div>
              <div className="p-2 bg-success/10 border border-success/30 rounded">
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Success Rate</span>
                  <span className="text-success font-semibold">
                    {(selectedDebris.maneuverPlan.successProbability * 100).toFixed(0)}%
                  </span>
                </div>
              </div>
            </div>
            <div className="flex gap-2 mt-3">
              <Button className="flex-1 h-8 text-xs font-mono" size="sm">
                EXECUTE MANEUVER
              </Button>
              <Button
                variant="outline"
                className="flex-1 h-8 text-xs font-mono"
                size="sm"
              >
                SIMULATE
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default DebrisAnalysisPanel;
