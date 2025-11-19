import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowUpDown } from "lucide-react";

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
  const [selectedSatellite, setSelectedSatellite] = useState<SatelliteData | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [sortBy, setSortBy] = useState<"battery" | "altitude" | "velocity">("battery");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

  const filteredAndSortedSatellites = satellites
    .filter(sat => filterStatus === "all" || sat.status === filterStatus)
    .sort((a, b) => {
      const multiplier = sortOrder === "asc" ? 1 : -1;
      return (a[sortBy] - b[sortBy]) * multiplier;
    });

  const toggleSort = (field: "battery" | "altitude" | "velocity") => {
    if (sortBy === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(field);
      setSortOrder("desc");
    }
  };

  return (
    <>
      <Card className="p-4 bg-card border-border">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-mono text-muted-foreground">
            NANOSAT STATUS
          </h3>
          <Select value={filterStatus} onValueChange={setFilterStatus}>
            <SelectTrigger className="w-[120px] h-8">
              <SelectValue placeholder="Filter" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="coordinating">Coordinating</SelectItem>
              <SelectItem value="tracking">Tracking</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex gap-2 mb-3">
          <Button
            size="sm"
            variant={sortBy === "battery" ? "default" : "outline"}
            onClick={() => toggleSort("battery")}
            className="h-7 text-xs"
          >
            Battery <ArrowUpDown className="ml-1 h-3 w-3" />
          </Button>
          <Button
            size="sm"
            variant={sortBy === "altitude" ? "default" : "outline"}
            onClick={() => toggleSort("altitude")}
            className="h-7 text-xs"
          >
            Altitude <ArrowUpDown className="ml-1 h-3 w-3" />
          </Button>
          <Button
            size="sm"
            variant={sortBy === "velocity" ? "default" : "outline"}
            onClick={() => toggleSort("velocity")}
            className="h-7 text-xs"
          >
            Velocity <ArrowUpDown className="ml-1 h-3 w-3" />
          </Button>
        </div>

        <div className="space-y-3">
          {filteredAndSortedSatellites.map((sat) => (
            <div
              key={sat.id}
              className="flex items-center justify-between p-3 bg-secondary/50 rounded-lg border border-border/50 hover:border-primary/50 transition-colors cursor-pointer"
              onClick={() => setSelectedSatellite(sat)}
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

      <Dialog open={selectedSatellite !== null} onOpenChange={() => setSelectedSatellite(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Satellite Details: {selectedSatellite?.id}</DialogTitle>
          </DialogHeader>
          {selectedSatellite && (
            <div className="space-y-4">
              <div>
                <div className="text-sm text-muted-foreground">Status</div>
                <Badge variant={selectedSatellite.status === "active" ? "default" : selectedSatellite.status === "tracking" ? "secondary" : "outline"}>
                  {selectedSatellite.status}
                </Badge>
              </div>
              <div>
                <div className="text-sm text-muted-foreground">Battery Level</div>
                <div className="flex items-center gap-2">
                  <div className="flex-1 h-3 bg-secondary rounded-full overflow-hidden">
                    <div
                      className="h-full bg-primary transition-all"
                      style={{ width: `${selectedSatellite.battery}%` }}
                    />
                  </div>
                  <span className="font-semibold">{selectedSatellite.battery}%</span>
                </div>
              </div>
              <div>
                <div className="text-sm text-muted-foreground">Altitude</div>
                <div className="font-semibold">{selectedSatellite.altitude} km</div>
              </div>
              <div>
                <div className="text-sm text-muted-foreground">Velocity</div>
                <div className="font-semibold">{selectedSatellite.velocity} km/s</div>
              </div>
              <div className="flex gap-2 pt-4">
                <Button className="flex-1" onClick={() => console.log('Send command to', selectedSatellite.id)}>
                  Send Command
                </Button>
                <Button variant="outline" className="flex-1" onClick={() => setSelectedSatellite(null)}>
                  Close
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default SatelliteStatus;
