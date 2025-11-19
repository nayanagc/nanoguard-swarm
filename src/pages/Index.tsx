import OrbitalView from "@/components/OrbitalView";
import SatelliteStatus from "@/components/SatelliteStatus";
import DebrisTracking from "@/components/DebrisTracking";
import SystemMetrics from "@/components/SystemMetrics";
import AlertFeed from "@/components/AlertFeed";
import { Satellite } from "lucide-react";

const Index = () => {
  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-gradient-orbital flex items-center justify-center shadow-glow">
                <Satellite className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-foreground">
                  NanoSwarm Mission Control
                </h1>
                <p className="text-xs font-mono text-muted-foreground">
                  AI-Powered Space Debris Management System
                </p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <div className="text-xs font-mono text-muted-foreground">
                  SYSTEM STATUS
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-success shadow-glow animate-pulse-slow" />
                  <span className="text-sm font-mono text-success">
                    OPERATIONAL
                  </span>
                </div>
              </div>
              <div className="text-right">
                <div className="text-xs font-mono text-muted-foreground">
                  UTC TIME
                </div>
                <div className="text-sm font-mono text-foreground">
                  {new Date().toUTCString().slice(17, 25)}
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Dashboard */}
      <main className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Main View */}
          <div className="lg:col-span-2 space-y-6">
            <OrbitalView />
            <DebrisTracking />
          </div>

          {/* Right Column - Stats & Alerts */}
          <div className="space-y-6">
            <SystemMetrics />
            <SatelliteStatus />
            <AlertFeed />
          </div>
        </div>

        {/* Info Banner */}
        <div className="mt-6 p-4 bg-gradient-orbital rounded-lg border border-primary/30">
          <p className="text-sm text-center text-muted-foreground">
            Autonomous nano-satellite swarm utilizing AI computer vision and ML
            prediction algorithms to detect, classify, and track space debris.
            Coordinated micro-thruster maneuvers enable gentle orbital decay
            nudging for micro-debris, while real-time alerts protect larger
            spacecraft.
          </p>
        </div>
      </main>
    </div>
  );
};

export default Index;
