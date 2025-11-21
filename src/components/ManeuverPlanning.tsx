import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Rocket, Target, Timer, Fuel, TrendingDown, PlayCircle, BarChart3, AlertCircle } from "lucide-react";
import { toast } from "sonner";

interface ManeuverPlan {
  targetDebris: string;
  thrustLevel: number;
  duration: number;
  burnAngle: number;
  estimatedDeltaV: number;
  fuelCost: number;
  successProbability: number;
  timeToContact: number;
}

const ManeuverPlanning = () => {
  const [selectedDebris, setSelectedDebris] = useState("D-003");
  const [maneuverType, setManeuverType] = useState<"nudge" | "avoidance">("nudge");
  
  const [plan, setPlan] = useState<ManeuverPlan>({
    targetDebris: "D-003",
    thrustLevel: 0.025,
    duration: 180,
    burnAngle: 45,
    estimatedDeltaV: 4.5,
    fuelCost: 0.12,
    successProbability: 0.87,
    timeToContact: 3.2,
  });

  const updateThrust = (value: number[]) => {
    const thrust = value[0];
    setPlan((prev) => ({
      ...prev,
      thrustLevel: thrust,
      estimatedDeltaV: thrust * 200,
      fuelCost: thrust * 5,
      successProbability: Math.min(0.99, 0.7 + thrust * 10),
    }));
  };

  const updateDuration = (value: number[]) => {
    const duration = value[0];
    setPlan((prev) => ({
      ...prev,
      duration,
      estimatedDeltaV: prev.thrustLevel * duration * 0.025,
      fuelCost: prev.thrustLevel * duration * 0.0007,
    }));
  };

  const updateBurnAngle = (value: number[]) => {
    setPlan((prev) => ({
      ...prev,
      burnAngle: value[0],
    }));
  };

  const executeManeuver = () => {
    toast.success("Maneuver Initiated", {
      description: `${maneuverType === "nudge" ? "Nudge" : "Avoidance"} maneuver for ${selectedDebris} started successfully`,
    });
  };

  const simulateManeuver = () => {
    toast.info("Running Simulation", {
      description: "Computing trajectory predictions...",
    });
  };

  const getSuccessColor = (probability: number) => {
    if (probability >= 0.8) return "text-success";
    if (probability >= 0.6) return "text-warning";
    return "text-destructive";
  };

  return (
    <Card className="bg-card border-border">
      <CardHeader>
        <CardTitle className="text-lg font-mono">MANEUVER PLANNING</CardTitle>
        <p className="text-xs text-muted-foreground font-mono mt-1">
          Autonomous Thruster Control & Trajectory Optimization
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        <Tabs value={maneuverType} onValueChange={(v) => setManeuverType(v as "nudge" | "avoidance")}>
          <TabsList className="grid w-full grid-cols-2 h-9">
            <TabsTrigger value="nudge" className="text-xs font-mono">
              <TrendingDown className="w-3 h-3 mr-2" />
              DECAY NUDGE
            </TabsTrigger>
            <TabsTrigger value="avoidance" className="text-xs font-mono">
              <AlertCircle className="w-3 h-3 mr-2" />
              COLLISION AVOID
            </TabsTrigger>
          </TabsList>

          <TabsContent value="nudge" className="space-y-4 mt-4">
            {/* Target Selection */}
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Target className="w-4 h-4 text-primary" />
                <span className="text-sm font-mono font-semibold">TARGET DEBRIS</span>
              </div>
              <Select value={selectedDebris} onValueChange={setSelectedDebris}>
                <SelectTrigger className="w-full font-mono">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="D-001">D-001 - Small Fragment</SelectItem>
                  <SelectItem value="D-002">D-002 - Medium Fragment</SelectItem>
                  <SelectItem value="D-003">D-003 - Large Fragment Alpha</SelectItem>
                  <SelectItem value="D-004">D-004 - Micro Debris</SelectItem>
                  <SelectItem value="D-005">D-005 - Panel Section</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Separator />

            {/* Thrust Level Control */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Rocket className="w-4 h-4 text-primary" />
                  <span className="text-sm font-mono font-semibold">THRUST LEVEL</span>
                </div>
                <span className="text-sm font-mono text-primary">{plan.thrustLevel.toFixed(3)} N</span>
              </div>
              <Slider
                value={[plan.thrustLevel]}
                onValueChange={updateThrust}
                min={0.005}
                max={0.05}
                step={0.001}
                className="py-4"
              />
              <div className="flex justify-between text-xs text-muted-foreground font-mono mt-1">
                <span>Min</span>
                <span>Max</span>
              </div>
            </div>

            {/* Burn Duration */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Timer className="w-4 h-4 text-primary" />
                  <span className="text-sm font-mono font-semibold">BURN DURATION</span>
                </div>
                <span className="text-sm font-mono text-primary">{plan.duration}s</span>
              </div>
              <Slider
                value={[plan.duration]}
                onValueChange={updateDuration}
                min={60}
                max={300}
                step={10}
                className="py-4"
              />
              <div className="flex justify-between text-xs text-muted-foreground font-mono mt-1">
                <span>1 min</span>
                <span>5 min</span>
              </div>
            </div>

            {/* Burn Angle */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Target className="w-4 h-4 text-primary" />
                  <span className="text-sm font-mono font-semibold">BURN ANGLE</span>
                </div>
                <span className="text-sm font-mono text-primary">{plan.burnAngle}°</span>
              </div>
              <Slider
                value={[plan.burnAngle]}
                onValueChange={updateBurnAngle}
                min={0}
                max={360}
                step={5}
                className="py-4"
              />
              <div className="flex justify-between text-xs text-muted-foreground font-mono mt-1">
                <span>0°</span>
                <span>360°</span>
              </div>
            </div>

            <Separator />

            {/* Maneuver Estimates */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <BarChart3 className="w-4 h-4 text-primary" />
                <span className="text-sm font-mono font-semibold">MANEUVER ESTIMATES</span>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 bg-muted/30 rounded-lg">
                  <div className="text-xs text-muted-foreground font-mono mb-1">ΔV</div>
                  <div className="text-lg font-mono font-bold">{plan.estimatedDeltaV.toFixed(2)}</div>
                  <div className="text-xs text-muted-foreground">m/s</div>
                </div>
                <div className="p-3 bg-muted/30 rounded-lg">
                  <div className="flex items-center gap-1 mb-1">
                    <Fuel className="w-3 h-3 text-muted-foreground" />
                    <span className="text-xs text-muted-foreground font-mono">FUEL COST</span>
                  </div>
                  <div className="text-lg font-mono font-bold">{plan.fuelCost.toFixed(2)}</div>
                  <div className="text-xs text-muted-foreground">kg</div>
                </div>
                <div className="p-3 bg-muted/30 rounded-lg col-span-2">
                  <div className="text-xs text-muted-foreground font-mono mb-2">SUCCESS PROBABILITY</div>
                  <div className="flex items-center justify-between">
                    <div className={`text-2xl font-mono font-bold ${getSuccessColor(plan.successProbability)}`}>
                      {(plan.successProbability * 100).toFixed(0)}%
                    </div>
                    <Badge 
                      variant={plan.successProbability >= 0.8 ? "default" : plan.successProbability >= 0.6 ? "outline" : "destructive"}
                    >
                      {plan.successProbability >= 0.8 ? "HIGH" : plan.successProbability >= 0.6 ? "MEDIUM" : "LOW"}
                    </Badge>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2 pt-2">
              <Button onClick={executeManeuver} className="flex-1 font-mono" size="sm">
                <PlayCircle className="w-4 h-4 mr-2" />
                EXECUTE
              </Button>
              <Button onClick={simulateManeuver} variant="outline" className="flex-1 font-mono" size="sm">
                <BarChart3 className="w-4 h-4 mr-2" />
                SIMULATE
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="avoidance" className="space-y-4 mt-4">
            <div className="p-4 bg-destructive/10 border border-destructive/30 rounded-lg">
              <div className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-destructive flex-shrink-0 mt-0.5" />
                <div className="space-y-2">
                  <div className="text-sm font-mono font-semibold text-destructive">
                    COLLISION AVOIDANCE MODE
                  </div>
                  <p className="text-xs text-muted-foreground font-mono">
                    Automated emergency maneuvers for imminent collision threats. System will calculate optimal escape trajectory and execute burn sequence automatically when threat level reaches CRITICAL.
                  </p>
                  <div className="mt-3 p-2 bg-card rounded border border-border">
                    <div className="text-xs font-mono text-muted-foreground mb-1">Time to Closest Approach</div>
                    <div className="text-lg font-mono font-bold text-foreground">{plan.timeToContact.toFixed(1)} hours</div>
                  </div>
                  <Button variant="outline" className="w-full font-mono text-xs mt-3" size="sm">
                    <AlertCircle className="w-3 h-3 mr-2" />
                    MONITOR THREAT
                  </Button>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default ManeuverPlanning;
