import { useEffect, useRef } from "react";

export default function FloatingGeometry() {
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const container = containerRef.current;
        if (!container) return;

        function spawnFloater() {
            if (!container) return;
            const el = document.createElement("div");
            const size = Math.random() * 40 + 10;
            const dur = Math.random() * 10 + 6;
            el.className = "float-el";
            el.style.cssText = `
        width:${size}px; height:${size}px;
        left:${Math.random() * 100}%;
        bottom:-60px;
        animation-duration:${dur}s;
        ${Math.random() > 0.5 ? "border-radius:50%" : ""}
      `;
            container.appendChild(el);
            setTimeout(() => el.remove(), dur * 1000);
        }

        const interval = setInterval(() => spawnFloater(), 2000);
        // Spawn a few immediately
        for (let i = 0; i < 3; i++) spawnFloater();

        return () => clearInterval(interval);
    }, []);

    return (
        <div
            ref={containerRef}
            className="absolute inset-0 overflow-hidden pointer-events-none z-0"
        />
    );
}
