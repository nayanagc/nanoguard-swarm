import { useEffect, useRef, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import * as THREE from "three";
import { Play, Pause, Eye, EyeOff, RotateCcw, Orbit, Activity } from "lucide-react";

interface Satellite {
  id: string;
  angle: number;
  radius: number;
  speed: number;
  status: "active" | "coordinating" | "tracking";
}

interface Debris {
  id: string;
  angle: number;
  radius: number;
  speed: number;
  size: number;
  threat: "low" | "medium" | "high";
}

const OrbitalView3D = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [selectedObject, setSelectedObject] = useState<{type: 'satellite' | 'debris', data: Satellite | Debris} | null>(null);
  const [isPaused, setIsPaused] = useState(false);
  const [showSatellites, setShowSatellites] = useState(true);
  const [showDebris, setShowDebris] = useState(true);
  const [showOrbits, setShowOrbits] = useState(true);
  const [viewMode, setViewMode] = useState<"auto" | "free">("auto");
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const satellitesRef = useRef<{ mesh: THREE.Mesh; data: Satellite }[]>([]);
  const debrisRef = useRef<{ mesh: THREE.Mesh; data: Debris }[]>([]);
  const orbitRingsRef = useRef<THREE.Line[]>([]);
  const [autoRotate, setAutoRotate] = useState(true);

  useEffect(() => {
    if (!containerRef.current) return;

    // Scene setup
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x0a0e1a);
    sceneRef.current = scene;

    // Camera setup
    const camera = new THREE.PerspectiveCamera(
      60,
      containerRef.current.clientWidth / containerRef.current.clientHeight,
      0.1,
      1000
    );
    camera.position.set(15, 15, 15);
    camera.lookAt(0, 0, 0);
    cameraRef.current = camera;

    // Renderer setup
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    containerRef.current.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
    scene.add(ambientLight);

    const pointLight = new THREE.PointLight(0xffffff, 1, 100);
    pointLight.position.set(20, 20, 20);
    scene.add(pointLight);

    // Earth
    const earthGeometry = new THREE.SphereGeometry(5, 64, 64);
    const earthMaterial = new THREE.MeshPhongMaterial({
      color: 0x4169e1,
      emissive: 0x0c2d5e,
      shininess: 30,
    });
    const earth = new THREE.Mesh(earthGeometry, earthMaterial);
    scene.add(earth);

    // Earth atmosphere glow
    const glowGeometry = new THREE.SphereGeometry(5.2, 64, 64);
    const glowMaterial = new THREE.MeshBasicMaterial({
      color: 0x5bb9ff,
      transparent: true,
      opacity: 0.2,
    });
    const glow = new THREE.Mesh(glowGeometry, glowMaterial);
    scene.add(glow);

    // Orbital paths
    const createOrbitRing = (radius: number, color: number) => {
      const geometry = new THREE.BufferGeometry();
      const points = [];
      for (let i = 0; i <= 128; i++) {
        const angle = (i / 128) * Math.PI * 2;
        points.push(
          Math.cos(angle) * radius,
          0,
          Math.sin(angle) * radius
        );
      }
      geometry.setAttribute(
        "position",
        new THREE.Float32BufferAttribute(points, 3)
      );
      const material = new THREE.LineBasicMaterial({
        color: color,
        transparent: true,
        opacity: 0.3,
      });
      return new THREE.Line(geometry, material);
    };

    const ring1 = createOrbitRing(8, 0x5bb9ff);
    const ring2 = createOrbitRing(10, 0x5bb9ff);
    const ring3 = createOrbitRing(12, 0x5bb9ff);
    scene.add(ring1);
    scene.add(ring2);
    scene.add(ring3);
    orbitRingsRef.current = [ring1, ring2, ring3];

    // Create satellites
    const satellites: Satellite[] = [
      { id: "NS-001", angle: 0, radius: 8, speed: 0.01, status: "active" },
      { id: "NS-002", angle: Math.PI / 2, radius: 8, speed: 0.01, status: "coordinating" },
      { id: "NS-003", angle: Math.PI, radius: 10, speed: 0.008, status: "tracking" },
      { id: "NS-004", angle: (3 * Math.PI) / 2, radius: 10, speed: 0.008, status: "active" },
    ];

    satellites.forEach((sat) => {
      const geometry = new THREE.BoxGeometry(0.3, 0.3, 0.6);
      const statusColors = {
        active: 0x5bb9ff,
        coordinating: 0x6366f1,
        tracking: 0x22c55e,
      };
      const material = new THREE.MeshPhongMaterial({
        color: statusColors[sat.status],
        emissive: statusColors[sat.status],
        emissiveIntensity: 0.5,
      });
      const mesh = new THREE.Mesh(geometry, material);

      // Add solar panels
      const panelGeometry = new THREE.BoxGeometry(0.8, 0.05, 0.4);
      const panelMaterial = new THREE.MeshPhongMaterial({
        color: 0x1e293b,
        emissive: 0x334155,
      });
      const panel1 = new THREE.Mesh(panelGeometry, panelMaterial);
      panel1.position.x = 0.5;
      mesh.add(panel1);

      const panel2 = new THREE.Mesh(panelGeometry, panelMaterial);
      panel2.position.x = -0.5;
      mesh.add(panel2);

      const x = Math.cos(sat.angle) * sat.radius;
      const z = Math.sin(sat.angle) * sat.radius;
      mesh.position.set(x, 0, z);

      scene.add(mesh);
      satellitesRef.current.push({ mesh, data: sat });
    });

    // Create debris
    const debrisData: Debris[] = [
      { id: "D-001", angle: 0.5, radius: 9, speed: 0.012, size: 0.15, threat: "low" },
      { id: "D-002", angle: 2, radius: 11, speed: 0.009, size: 0.25, threat: "medium" },
      { id: "D-003", angle: 4, radius: 12, speed: 0.007, size: 0.4, threat: "high" },
      { id: "D-004", angle: 3, radius: 8.5, speed: 0.011, size: 0.12, threat: "low" },
      { id: "D-005", angle: 5, radius: 10.5, speed: 0.008, size: 0.2, threat: "medium" },
    ];

    debrisData.forEach((debris) => {
      const geometry = new THREE.SphereGeometry(debris.size, 16, 16);
      const threatColors = {
        low: 0x22c55e,
        medium: 0xeab308,
        high: 0xef4444,
      };
      const material = new THREE.MeshPhongMaterial({
        color: threatColors[debris.threat],
        emissive: threatColors[debris.threat],
        emissiveIntensity: debris.threat === "high" ? 0.6 : 0.3,
      });
      const mesh = new THREE.Mesh(geometry, material);

      const x = Math.cos(debris.angle) * debris.radius;
      const z = Math.sin(debris.angle) * debris.radius;
      mesh.position.set(x, 0, z);

      scene.add(mesh);
      debrisRef.current.push({ mesh, data: debris });
    });

    // Mouse interaction
    let isDragging = false;
    let previousMousePosition = { x: 0, y: 0 };

    const onMouseDown = (e: MouseEvent) => {
      isDragging = true;
      setAutoRotate(false);
      setViewMode("free");
    };

    const onMouseMove = (e: MouseEvent) => {
      if (isDragging) {
        const deltaX = e.clientX - previousMousePosition.x;
        const deltaY = e.clientY - previousMousePosition.y;

        camera.position.applyAxisAngle(
          new THREE.Vector3(0, 1, 0),
          deltaX * 0.005
        );

        const right = new THREE.Vector3();
        camera.getWorldDirection(right);
        right.cross(camera.up);
        camera.position.applyAxisAngle(right, deltaY * 0.005);

        camera.lookAt(0, 0, 0);
      }
      previousMousePosition = { x: e.clientX, y: e.clientY };
    };

    const onMouseUp = () => {
      isDragging = false;
    };

    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      const zoomSpeed = 0.1;
      const direction = new THREE.Vector3();
      camera.getWorldDirection(direction);
      camera.position.addScaledVector(direction, -e.deltaY * zoomSpeed * 0.01);
      
      // Limit zoom
      const distance = camera.position.length();
      if (distance < 10) {
        camera.position.normalize().multiplyScalar(10);
      } else if (distance > 40) {
        camera.position.normalize().multiplyScalar(40);
      }
    };

    renderer.domElement.addEventListener("mousedown", onMouseDown);
    renderer.domElement.addEventListener("mousemove", onMouseMove);
    renderer.domElement.addEventListener("mouseup", onMouseUp);
    renderer.domElement.addEventListener("wheel", onWheel);

    // Animation loop
    let animationId: number;
    let autoRotateAngle = 0;

    const animate = () => {
      animationId = requestAnimationFrame(animate);

      // Rotate Earth
      if (!isPaused) {
        earth.rotation.y += 0.001;
        glow.rotation.y += 0.001;
      }

      // Auto-rotate camera
      if (autoRotate && viewMode === "auto") {
        autoRotateAngle += 0.002;
        camera.position.x = Math.cos(autoRotateAngle) * 20;
        camera.position.z = Math.sin(autoRotateAngle) * 20;
        camera.lookAt(0, 0, 0);
      }

      // Update orbit visibility
      orbitRingsRef.current.forEach(ring => {
        ring.visible = showOrbits;
      });

      // Update satellites
      satellitesRef.current.forEach(({ mesh, data }) => {
        mesh.visible = showSatellites;
        if (!isPaused) {
          data.angle += data.speed;
          const x = Math.cos(data.angle) * data.radius;
          const z = Math.sin(data.angle) * data.radius;
          mesh.position.set(x, 0, z);
          mesh.rotation.y += 0.02;
        }
      });

      // Update debris
      debrisRef.current.forEach(({ mesh, data }) => {
        mesh.visible = showDebris;
        if (!isPaused) {
          data.angle += data.speed;
          const x = Math.cos(data.angle) * data.radius;
          const z = Math.sin(data.angle) * data.radius;
          mesh.position.set(x, 0, z);
          mesh.rotation.x += 0.01;
          mesh.rotation.y += 0.01;
        }
      });

      renderer.render(scene, camera);
    };

    animate();

    // Handle resize
    const handleResize = () => {
      if (!containerRef.current) return;
      const width = containerRef.current.clientWidth;
      const height = containerRef.current.clientHeight;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    };

    window.addEventListener("resize", handleResize);

    // Cleanup
    return () => {
      window.removeEventListener("resize", handleResize);
      renderer.domElement.removeEventListener("mousedown", onMouseDown);
      renderer.domElement.removeEventListener("mousemove", onMouseMove);
      renderer.domElement.removeEventListener("mouseup", onMouseUp);
      renderer.domElement.removeEventListener("wheel", onWheel);
      cancelAnimationFrame(animationId);
      renderer.dispose();
      containerRef.current?.removeChild(renderer.domElement);
    };
  }, [autoRotate, isPaused, showSatellites, showDebris, showOrbits, viewMode]);

  const resetView = () => {
    if (cameraRef.current) {
      cameraRef.current.position.set(15, 15, 15);
      cameraRef.current.lookAt(0, 0, 0);
      setAutoRotate(true);
      setViewMode("auto");
    }
  };

  const togglePause = () => {
    setIsPaused(!isPaused);
  };

  return (
    <Card className="relative overflow-hidden bg-card border-border h-[500px]">
      <div ref={containerRef} className="w-full h-full" />
      
      <div className="absolute top-4 left-4 text-xs font-mono text-muted-foreground">
        3D ORBITAL VIEW
      </div>

      <div className="absolute top-4 right-4 space-y-2">
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={togglePause}
            title={isPaused ? "Resume animation" : "Pause animation"}
            className="h-8 w-8 p-0"
          >
            {isPaused ? <Play className="w-4 h-4" /> : <Pause className="w-4 h-4" />}
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={resetView}
            title="Reset view"
            className="h-8 w-8 p-0"
          >
            <RotateCcw className="w-4 h-4" />
          </Button>
          <Button
            variant={viewMode === "auto" ? "default" : "outline"}
            size="sm"
            onClick={() => {
              setViewMode("auto");
              setAutoRotate(true);
            }}
            title="Auto-rotate camera"
            className="h-8 px-3 text-xs"
          >
            <Orbit className="w-4 h-4 mr-1" />
            Auto
          </Button>
        </div>

        <div className="flex flex-col gap-2 bg-card/80 backdrop-blur-sm p-2 rounded-lg border border-border">
          <Button
            variant={showSatellites ? "default" : "outline"}
            size="sm"
            onClick={() => setShowSatellites(!showSatellites)}
            className="justify-start h-7 text-xs"
          >
            {showSatellites ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
            <span className="ml-2">Satellites</span>
          </Button>
          <Button
            variant={showDebris ? "default" : "outline"}
            size="sm"
            onClick={() => setShowDebris(!showDebris)}
            className="justify-start h-7 text-xs"
          >
            {showDebris ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
            <span className="ml-2">Debris</span>
          </Button>
          <Button
            variant={showOrbits ? "default" : "outline"}
            size="sm"
            onClick={() => setShowOrbits(!showOrbits)}
            className="justify-start h-7 text-xs"
          >
            {showOrbits ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
            <span className="ml-2">Orbits</span>
          </Button>
        </div>
      </div>

      <div className="absolute bottom-4 left-4 text-xs font-mono text-muted-foreground">
        {isPaused ? "⏸ PAUSED" : "▶ LIVE"} • {viewMode === "auto" ? "Auto Rotate" : "Manual Control"}
      </div>

      <div className="absolute bottom-4 right-4 flex gap-4 text-xs font-mono">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-primary shadow-glow" />
          <span className="text-muted-foreground">Satellites</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-success" />
          <span className="text-muted-foreground">Low Threat</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-destructive" />
          <span className="text-muted-foreground">High Threat</span>
        </div>
      </div>

      <Dialog open={!!selectedObject} onOpenChange={() => setSelectedObject(null)}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              {selectedObject?.type === 'satellite' ? (
                <>
                  <Activity className="w-5 h-5 text-success" />
                  Satellite Details
                </>
              ) : (
                <>
                  <Activity className="w-5 h-5 text-destructive" />
                  Debris Details
                </>
              )}
            </DialogTitle>
            <DialogDescription>
              Real-time orbital information and status
            </DialogDescription>
          </DialogHeader>
          
          {selectedObject && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground">Object ID</p>
                  <p className="font-mono text-sm">{selectedObject.data.id}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground">Type</p>
                  <Badge variant={selectedObject.type === 'satellite' ? 'default' : 'destructive'}>
                    {selectedObject.type === 'satellite' ? 'NanoSwarm' : 'Debris'}
                  </Badge>
                </div>
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground">Orbital Radius</p>
                  <p className="text-sm font-mono">{selectedObject.data.radius.toFixed(2)} km</p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground">Orbital Speed</p>
                  <p className="text-sm font-mono">{(selectedObject.data.speed * 1000).toFixed(3)} rad/s</p>
                </div>
                {selectedObject.type === 'satellite' && (
                  <div className="space-y-1 col-span-2">
                    <p className="text-xs text-muted-foreground">Status</p>
                    <Badge variant="outline" className="text-success">
                      {(selectedObject.data as Satellite).status.toUpperCase()}
                    </Badge>
                  </div>
                )}
                {selectedObject.type === 'debris' && (
                  <>
                    <div className="space-y-1">
                      <p className="text-xs text-muted-foreground">Size</p>
                      <p className="text-sm font-mono">{(selectedObject.data as Debris).size.toFixed(2)} m</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-xs text-muted-foreground">Threat Level</p>
                      <Badge variant={(selectedObject.data as Debris).threat === 'high' ? 'destructive' : 'outline'}>
                        {(selectedObject.data as Debris).threat.toUpperCase()}
                      </Badge>
                    </div>
                  </>
                )}
              </div>
              
              <div className="p-3 bg-secondary/30 rounded-lg border border-border/50">
                <p className="text-xs text-muted-foreground mb-1">Current Angle</p>
                <p className="font-mono text-sm">
                  {(selectedObject.data.angle * (180 / Math.PI)).toFixed(2)}° ({selectedObject.data.angle.toFixed(4)} rad)
                </p>
              </div>

              {selectedObject.type === 'satellite' && (
                <div className="text-xs text-muted-foreground bg-success/10 p-3 rounded-lg border border-success/20">
                  ✓ This satellite is actively monitoring and coordinating debris tracking operations within the autonomous swarm network.
                </div>
              )}
              
              {selectedObject.type === 'debris' && (selectedObject.data as Debris).threat === 'high' && (
                <div className="text-xs text-destructive bg-destructive/10 p-3 rounded-lg border border-destructive/20">
                  ⚠ High threat debris detected. Nudge maneuvers recommended for collision avoidance.
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </Card>
  );
};

export default OrbitalView3D;
