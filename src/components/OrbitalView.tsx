import { useEffect, useRef } from "react";
import { Card } from "@/components/ui/card";

interface Satellite {
  id: string;
  x: number;
  y: number;
  status: "active" | "coordinating" | "tracking";
}

interface Debris {
  id: string;
  x: number;
  y: number;
  size: "micro" | "small" | "large";
  threat: "low" | "medium" | "high";
}

const OrbitalView = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Sample data
    const satellites: Satellite[] = [
      { id: "NS-001", x: 150, y: 150, status: "active" },
      { id: "NS-002", x: 350, y: 200, status: "coordinating" },
      { id: "NS-003", x: 250, y: 350, status: "tracking" },
      { id: "NS-004", x: 450, y: 300, status: "active" },
    ];

    const debris: Debris[] = [
      { id: "D-001", x: 200, y: 180, size: "micro", threat: "low" },
      { id: "D-002", x: 380, y: 250, size: "small", threat: "medium" },
      { id: "D-003", x: 300, y: 300, size: "large", threat: "high" },
      { id: "D-004", x: 180, y: 280, size: "micro", threat: "low" },
      { id: "D-005", x: 420, y: 180, size: "small", threat: "medium" },
    ];

    let animationFrame: number;
    let angle = 0;

    const draw = () => {
      ctx.fillStyle = "hsl(222, 47%, 8%)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw orbital paths
      ctx.strokeStyle = "hsl(187, 85%, 55%, 0.1)";
      ctx.lineWidth = 1;
      [100, 200, 300].forEach((radius) => {
        ctx.beginPath();
        ctx.arc(canvas.width / 2, canvas.height / 2, radius, 0, Math.PI * 2);
        ctx.stroke();
      });

      // Draw Earth in center
      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;
      const gradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, 40);
      gradient.addColorStop(0, "hsl(217, 91%, 60%)");
      gradient.addColorStop(1, "hsl(187, 85%, 55%)");
      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(centerX, centerY, 40, 0, Math.PI * 2);
      ctx.fill();

      // Draw connection lines between coordinating satellites
      satellites.forEach((sat1, i) => {
        satellites.slice(i + 1).forEach((sat2) => {
          if (sat1.status === "coordinating" || sat2.status === "coordinating") {
            ctx.strokeStyle = "hsl(187, 85%, 55%, 0.3)";
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(sat1.x, sat1.y);
            ctx.lineTo(sat2.x, sat2.y);
            ctx.stroke();
          }
        });
      });

      // Draw debris
      debris.forEach((d) => {
        const colors = {
          low: "hsl(142, 76%, 45%)",
          medium: "hsl(38, 92%, 50%)",
          high: "hsl(0, 85%, 60%)",
        };
        const sizes = { micro: 3, small: 5, large: 8 };

        ctx.fillStyle = colors[d.threat];
        ctx.beginPath();
        ctx.arc(d.x, d.y, sizes[d.size], 0, Math.PI * 2);
        ctx.fill();

        // Add glow for high threat
        if (d.threat === "high") {
          ctx.shadowColor = colors[d.threat];
          ctx.shadowBlur = 15;
          ctx.fill();
          ctx.shadowBlur = 0;
        }
      });

      // Draw satellites
      satellites.forEach((sat) => {
        const colors = {
          active: "hsl(187, 85%, 55%)",
          coordinating: "hsl(217, 91%, 60%)",
          tracking: "hsl(142, 76%, 45%)",
        };

        // Satellite body
        ctx.fillStyle = colors[sat.status];
        ctx.beginPath();
        ctx.arc(sat.x, sat.y, 6, 0, Math.PI * 2);
        ctx.fill();

        // Glow effect
        ctx.shadowColor = colors[sat.status];
        ctx.shadowBlur = 10;
        ctx.fill();
        ctx.shadowBlur = 0;

        // Scanning range
        if (sat.status === "tracking") {
          ctx.strokeStyle = "hsl(142, 76%, 45%, 0.2)";
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.arc(sat.x, sat.y, 50, 0, Math.PI * 2);
          ctx.stroke();
        }
      });

      angle += 0.01;
      animationFrame = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      cancelAnimationFrame(animationFrame);
    };
  }, []);

  return (
    <Card className="relative overflow-hidden bg-card border-border">
      <div className="absolute inset-0 bg-gradient-orbital" />
      <canvas
        ref={canvasRef}
        width={600}
        height={400}
        className="w-full h-full"
      />
      <div className="absolute top-4 left-4 text-xs font-mono text-muted-foreground">
        ORBITAL VIEW
      </div>
      <div className="absolute bottom-4 right-4 flex gap-4 text-xs font-mono">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-primary shadow-glow" />
          <span className="text-muted-foreground">Active</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-success" />
          <span className="text-muted-foreground">Tracking</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-destructive" />
          <span className="text-muted-foreground">Threat</span>
        </div>
      </div>
    </Card>
  );
};

export default OrbitalView;
