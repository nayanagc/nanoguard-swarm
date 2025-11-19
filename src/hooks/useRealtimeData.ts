import { useEffect, useState } from "react";

interface RealtimeMetrics {
  activeSatellites: number;
  debrisTracked: number;
  threatLevel: "low" | "medium" | "high";
  systemStatus: "operational" | "warning" | "critical";
  cpuUsage: number;
  memoryUsage: number;
  networkLatency: number;
}

interface RealtimeAlert {
  id: string;
  type: "detection" | "maneuver" | "system" | "collision";
  severity: "info" | "warning" | "critical";
  message: string;
  timestamp: Date;
}

export const useRealtimeData = (updateInterval: number = 3000) => {
  const [metrics, setMetrics] = useState<RealtimeMetrics>({
    activeSatellites: 4,
    debrisTracked: 247,
    threatLevel: "low",
    systemStatus: "operational",
    cpuUsage: 45,
    memoryUsage: 62,
    networkLatency: 23,
  });

  const [alerts, setAlerts] = useState<RealtimeAlert[]>([
    {
      id: "1",
      type: "detection",
      severity: "warning",
      message: "New debris detected in LEO sector 7",
      timestamp: new Date(Date.now() - 120000),
    },
    {
      id: "2",
      type: "maneuver",
      severity: "info",
      message: "NS-003 completed decay nudge maneuver",
      timestamp: new Date(Date.now() - 300000),
    },
  ]);

  useEffect(() => {
    const interval = setInterval(() => {
      // Simulate real-time metric updates
      setMetrics((prev) => ({
        ...prev,
        debrisTracked: prev.debrisTracked + Math.floor(Math.random() * 3 - 1),
        cpuUsage: Math.max(20, Math.min(95, prev.cpuUsage + (Math.random() - 0.5) * 10)),
        memoryUsage: Math.max(30, Math.min(90, prev.memoryUsage + (Math.random() - 0.5) * 5)),
        networkLatency: Math.max(10, Math.min(100, prev.networkLatency + (Math.random() - 0.5) * 15)),
        threatLevel: Math.random() > 0.95 ? "high" : Math.random() > 0.8 ? "medium" : "low",
      }));

      // Randomly generate new alerts
      if (Math.random() > 0.7) {
        const alertTypes: Array<RealtimeAlert["type"]> = ["detection", "maneuver", "system", "collision"];
        const severities: Array<RealtimeAlert["severity"]> = ["info", "warning", "critical"];
        const messages = [
          "Debris trajectory updated",
          "Satellite handoff completed",
          "AI model confidence increased",
          "Collision avoidance protocol initiated",
          "New micro-debris cluster detected",
          "Orbital decay progression nominal",
        ];

        const newAlert: RealtimeAlert = {
          id: Date.now().toString(),
          type: alertTypes[Math.floor(Math.random() * alertTypes.length)],
          severity: severities[Math.floor(Math.random() * severities.length)],
          message: messages[Math.floor(Math.random() * messages.length)],
          timestamp: new Date(),
        };

        setAlerts((prev) => [newAlert, ...prev].slice(0, 10));
      }
    }, updateInterval);

    return () => clearInterval(interval);
  }, [updateInterval]);

  return { metrics, alerts };
};
