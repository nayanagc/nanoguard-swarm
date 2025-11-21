import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { Activity, Battery, Gauge, Radio } from "lucide-react";

interface TelemetryData {
  time: string;
  battery: number;
  temperature: number;
  velocity: number;
  altitude: number;
  thrust: number;
  signalStrength: number;
}

const SatelliteTelemetry = () => {
  const [selectedSatellite, setSelectedSatellite] = useState("NS-001");
  const [telemetryData, setTelemetryData] = useState<TelemetryData[]>([]);
  const [liveStats, setLiveStats] = useState({
    battery: 87,
    temperature: 22,
    velocity: 7.8,
    altitude: 420,
    thrust: 0.12,
    signalStrength: 95,
  });

  useEffect(() => {
    // Initialize with historical data
    const now = Date.now();
    const initialData: TelemetryData[] = [];
    for (let i = 20; i >= 0; i--) {
      const time = new Date(now - i * 3000);
      initialData.push({
        time: time.toLocaleTimeString(),
        battery: 85 + Math.random() * 5,
        temperature: 20 + Math.random() * 5,
        velocity: 7.7 + Math.random() * 0.2,
        altitude: 418 + Math.random() * 4,
        thrust: 0.1 + Math.random() * 0.05,
        signalStrength: 90 + Math.random() * 10,
      });
    }
    setTelemetryData(initialData);
  }, [selectedSatellite]);

  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      const newDataPoint: TelemetryData = {
        time: now.toLocaleTimeString(),
        battery: liveStats.battery + (Math.random() - 0.5) * 0.5,
        temperature: liveStats.temperature + (Math.random() - 0.5) * 1,
        velocity: liveStats.velocity + (Math.random() - 0.5) * 0.05,
        altitude: liveStats.altitude + (Math.random() - 0.5) * 0.5,
        thrust: liveStats.thrust + (Math.random() - 0.5) * 0.02,
        signalStrength: liveStats.signalStrength + (Math.random() - 0.5) * 2,
      };

      setLiveStats({
        battery: Math.max(0, Math.min(100, newDataPoint.battery)),
        temperature: newDataPoint.temperature,
        velocity: Math.max(0, newDataPoint.velocity),
        altitude: Math.max(0, newDataPoint.altitude),
        thrust: Math.max(0, newDataPoint.thrust),
        signalStrength: Math.max(0, Math.min(100, newDataPoint.signalStrength)),
      });

      setTelemetryData((prev) => [...prev.slice(-20), newDataPoint]);
    }, 3000);

    return () => clearInterval(interval);
  }, [liveStats]);

  return (
    <Card className="bg-card border-border">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-mono">SATELLITE TELEMETRY</CardTitle>
          <Select value={selectedSatellite} onValueChange={setSelectedSatellite}>
            <SelectTrigger className="w-32 h-8 text-xs font-mono">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="NS-001">NS-001</SelectItem>
              <SelectItem value="NS-002">NS-002</SelectItem>
              <SelectItem value="NS-003">NS-003</SelectItem>
              <SelectItem value="NS-004">NS-004</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <p className="text-xs text-muted-foreground font-mono mt-1">
          Real-time Performance Monitoring
        </p>
      </CardHeader>
      <CardContent>
        {/* Live Stats */}
        <div className="grid grid-cols-3 gap-3 mb-4">
          <div className="p-3 bg-muted/30 rounded-lg">
            <div className="flex items-center gap-2 mb-1">
              <Battery className="w-3 h-3 text-primary" />
              <span className="text-xs font-mono text-muted-foreground">BATTERY</span>
            </div>
            <div className="text-lg font-mono font-bold text-foreground">
              {liveStats.battery.toFixed(1)}%
            </div>
          </div>
          <div className="p-3 bg-muted/30 rounded-lg">
            <div className="flex items-center gap-2 mb-1">
              <Gauge className="w-3 h-3 text-primary" />
              <span className="text-xs font-mono text-muted-foreground">VELOCITY</span>
            </div>
            <div className="text-lg font-mono font-bold text-foreground">
              {liveStats.velocity.toFixed(2)}
            </div>
            <div className="text-xs text-muted-foreground">km/s</div>
          </div>
          <div className="p-3 bg-muted/30 rounded-lg">
            <div className="flex items-center gap-2 mb-1">
              <Radio className="w-3 h-3 text-primary" />
              <span className="text-xs font-mono text-muted-foreground">SIGNAL</span>
            </div>
            <div className="text-lg font-mono font-bold text-foreground">
              {liveStats.signalStrength.toFixed(0)}%
            </div>
          </div>
        </div>

        <Tabs defaultValue="power" className="w-full">
          <TabsList className="grid w-full grid-cols-4 h-8">
            <TabsTrigger value="power" className="text-xs">Power</TabsTrigger>
            <TabsTrigger value="thermal" className="text-xs">Thermal</TabsTrigger>
            <TabsTrigger value="orbital" className="text-xs">Orbital</TabsTrigger>
            <TabsTrigger value="propulsion" className="text-xs">Propulsion</TabsTrigger>
          </TabsList>

          <TabsContent value="power" className="mt-4">
            <ResponsiveContainer width="100%" height={200}>
              <AreaChart data={telemetryData}>
                <defs>
                  <linearGradient id="batteryGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis 
                  dataKey="time" 
                  tick={{ fontSize: 10, fill: 'hsl(var(--muted-foreground))' }}
                  stroke="hsl(var(--border))"
                />
                <YAxis 
                  tick={{ fontSize: 10, fill: 'hsl(var(--muted-foreground))' }}
                  stroke="hsl(var(--border))"
                  domain={[80, 95]}
                />
                <Tooltip 
                  contentStyle={{
                    backgroundColor: 'hsl(var(--card))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '0.5rem',
                    fontSize: '12px',
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="battery"
                  stroke="hsl(var(--primary))"
                  fill="url(#batteryGradient)"
                  strokeWidth={2}
                />
              </AreaChart>
            </ResponsiveContainer>
          </TabsContent>

          <TabsContent value="thermal" className="mt-4">
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={telemetryData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis 
                  dataKey="time" 
                  tick={{ fontSize: 10, fill: 'hsl(var(--muted-foreground))' }}
                  stroke="hsl(var(--border))"
                />
                <YAxis 
                  tick={{ fontSize: 10, fill: 'hsl(var(--muted-foreground))' }}
                  stroke="hsl(var(--border))"
                  domain={[15, 30]}
                />
                <Tooltip 
                  contentStyle={{
                    backgroundColor: 'hsl(var(--card))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '0.5rem',
                    fontSize: '12px',
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="temperature"
                  stroke="hsl(var(--warning))"
                  strokeWidth={2}
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </TabsContent>

          <TabsContent value="orbital" className="mt-4">
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={telemetryData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis 
                  dataKey="time" 
                  tick={{ fontSize: 10, fill: 'hsl(var(--muted-foreground))' }}
                  stroke="hsl(var(--border))"
                />
                <YAxis 
                  yAxisId="left"
                  tick={{ fontSize: 10, fill: 'hsl(var(--muted-foreground))' }}
                  stroke="hsl(var(--border))"
                  domain={[415, 425]}
                />
                <YAxis 
                  yAxisId="right"
                  orientation="right"
                  tick={{ fontSize: 10, fill: 'hsl(var(--muted-foreground))' }}
                  stroke="hsl(var(--border))"
                  domain={[7.6, 8.0]}
                />
                <Tooltip 
                  contentStyle={{
                    backgroundColor: 'hsl(var(--card))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '0.5rem',
                    fontSize: '12px',
                  }}
                />
                <Legend 
                  wrapperStyle={{ fontSize: '11px' }}
                  iconType="line"
                />
                <Line
                  yAxisId="left"
                  type="monotone"
                  dataKey="altitude"
                  stroke="hsl(var(--primary))"
                  strokeWidth={2}
                  dot={false}
                  name="Altitude (km)"
                />
                <Line
                  yAxisId="right"
                  type="monotone"
                  dataKey="velocity"
                  stroke="hsl(var(--success))"
                  strokeWidth={2}
                  dot={false}
                  name="Velocity (km/s)"
                />
              </LineChart>
            </ResponsiveContainer>
          </TabsContent>

          <TabsContent value="propulsion" className="mt-4">
            <ResponsiveContainer width="100%" height={200}>
              <AreaChart data={telemetryData}>
                <defs>
                  <linearGradient id="thrustGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(var(--success))" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="hsl(var(--success))" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis 
                  dataKey="time" 
                  tick={{ fontSize: 10, fill: 'hsl(var(--muted-foreground))' }}
                  stroke="hsl(var(--border))"
                />
                <YAxis 
                  tick={{ fontSize: 10, fill: 'hsl(var(--muted-foreground))' }}
                  stroke="hsl(var(--border))"
                  domain={[0, 0.2]}
                />
                <Tooltip 
                  contentStyle={{
                    backgroundColor: 'hsl(var(--card))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '0.5rem',
                    fontSize: '12px',
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="thrust"
                  stroke="hsl(var(--success))"
                  fill="url(#thrustGradient)"
                  strokeWidth={2}
                />
              </AreaChart>
            </ResponsiveContainer>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default SatelliteTelemetry;
