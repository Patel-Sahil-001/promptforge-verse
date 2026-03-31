import { useEffect, useRef } from "react";
import { useIsMobile } from "@/hooks/use-mobile";

interface Particle {
    x: number;
    y: number;
    z: number;
    vx: number;
    vy: number;
    vz: number;
    col: string;
    size: number;
    pulse: number;
}

export default function ParticleField() {
    const isMobile = useIsMobile();
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const mouseRef = useRef({ x: 0, y: 0 });

    useEffect(() => {
        if (isMobile) return;
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        let W: number, H: number;
        let animId: number;
        let lastTime = 0;
        const fpsInterval = 1000 / 60;

        function resize() {
            W = canvas!.width = window.innerWidth;
            H = canvas!.height = window.innerHeight;
        }
        resize();
        window.addEventListener("resize", resize);

        const onMouseMove = (e: MouseEvent) => {
            mouseRef.current.x = (e.clientX / W - 0.5) * 2;
            mouseRef.current.y = (e.clientY / H - 0.5) * 2;
        };
        document.addEventListener("mousemove", onMouseMove);

        const pts: Particle[] = Array.from({ length: 160 }, () => ({
            x: (Math.random() - 0.5) * 2,
            y: (Math.random() - 0.5) * 2,
            z: Math.random() * 2 - 1,
            vx: (Math.random() - 0.5) * 0.002,
            vy: (Math.random() - 0.5) * 0.002,
            vz: (Math.random() - 0.5) * 0.001,
            col: Math.random() > 0.5 ? "#ff1e1e" : "#3d6eff",
            size: Math.random() * 2 + 0.5,
            pulse: Math.random() * Math.PI * 2,
        }));

        function project(x: number, y: number, z: number) {
            const fov = 380;
            const pz = z + 2;
            return {
                x: (x / pz) * fov + W / 2 + mouseRef.current.x * 25,
                y: (y / pz) * fov + H / 2 + mouseRef.current.y * 25,
                sc: fov / pz,
            };
        }

        function render(timestamp: number) {
            animId = requestAnimationFrame(render);
            if (document.hidden) return;

            const elapsed = timestamp - lastTime;
            if (elapsed < fpsInterval) return;
            lastTime = timestamp;

            ctx!.clearRect(0, 0, W, H);
            const sorted = [...pts].sort((a, b) => b.z - a.z);
            sorted.forEach((p, i, arr) => {
                // Draw connecting lines
                arr.slice(i + 1, i + 4).forEach((p2) => {
                    const d = Math.hypot(p.x - p2.x, p.y - p2.y, p.z - p2.z);
                    if (d < 0.55) {
                        const a = project(p.x, p.y, p.z);
                        const b = project(p2.x, p2.y, p2.z);
                        ctx!.beginPath();
                        ctx!.moveTo(a.x, a.y);
                        ctx!.lineTo(b.x, b.y);
                        ctx!.strokeStyle = `rgba(255,30,30,${(1 - d / 0.55) * 0.08})`;
                        ctx!.lineWidth = 0.4;
                        ctx!.stroke();
                    }
                });

                const pr = project(p.x, p.y, p.z);
                const sz = p.size * pr.sc * 0.01;
                p.pulse += 0.02;

                ctx!.beginPath();
                ctx!.arc(
                    pr.x,
                    pr.y,
                    sz * (0.8 + Math.sin(p.pulse) * 0.2),
                    0,
                    Math.PI * 2
                );
                ctx!.fillStyle = p.col;
                ctx!.globalAlpha = 0.5 * ((p.z + 1) / 2);
                ctx!.fill();
                ctx!.globalAlpha = 1;

                // Update position
                p.x += p.vx;
                p.y += p.vy;
                p.z += p.vz;
                if (p.x > 1.5) p.x = -1.5;
                if (p.x < -1.5) p.x = 1.5;
                if (p.y > 1.5) p.y = -1.5;
                if (p.y < -1.5) p.y = 1.5;
                if (p.z > 1) p.z = -1;
                if (p.z < -1) p.z = 1;
            });
        }

        animId = requestAnimationFrame(render);

        return () => {
            cancelAnimationFrame(animId);
            window.removeEventListener("resize", resize);
            document.removeEventListener("mousemove", onMouseMove);
        };
    }, [isMobile]);

    if (isMobile) {
        return (
            <div 
                className="absolute inset-0 z-[-1]"
                style={{
                    background: "radial-gradient(circle at 10% 10%, rgba(255,30,30,0.12) 0%, transparent 40%), radial-gradient(circle at 90% 90%, rgba(61,110,255,0.12) 0%, transparent 40%), #0F1014",
                }}
            />
        );
    }

    return <canvas ref={canvasRef} id="particle-canvas" />;
}
