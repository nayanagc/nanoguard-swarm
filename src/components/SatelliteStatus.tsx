import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface SatelliteData {
  id: string;
  status: "active" | "coordinating" | "tracking";
  battery: number;
  altitude: number;
  velocity: number;
}

const satellites: SatelliteData[] = [
  { id: "NS-001", status: "active", battery: 94, altitude: 580, velocity: 7.5 },
  { id: "NS-002", status: "coordinating", battery: 87, altitude: 582, velocity: 7.5 },
  { id: "NS-003", status: "tracking", battery: 91, altitude: 578, velocity: 7.6 },
  { id: "NS-004", status: "active", battery: 96, altitude: 581, velocity: 7.5 },
];

const SatelliteStatus = () => {
  return (
    <Card className="p-4 bg-card border-border">
      <h3 className="text-sm font-mono text-muted-foreground mb-4">
        NANOSAT STATUS
      </h3>
      <div className="space-y-3">
        {satellites.map((sat) => (
          <div
            key={sat.id}
            className="flex items-center justify-between p-3 bg-secondary/50 rounded-lg border border-border/50 hover:border-primary/50 transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 rounded-full bg-primary shadow-glow animate-pulse-slow" />
              <div>
                <div className="font-mono text-sm text-foreground">
                  {sat.id}
                </div>
                <div className="flex gap-2 mt-1">
                  <Badge
                    variant={
                      sat.status === "active"
                        ? "default"
                        : sat.status === "tracking"
                        ? "secondary"
                        : "outline"
                    }
                    className="text-xs"
                  >
                    {sat.status}
                  </Badge>
                </div>
              </div>
            </div>
            <div className="text-right font-mono text-xs text-muted-foreground">
              <div>PWR: {sat.battery}%</div>
              <div>ALT: {sat.altitude}km</div>
              <div>VEL: {sat.velocity}km/s</div>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
};

export default SatelliteStatus;
