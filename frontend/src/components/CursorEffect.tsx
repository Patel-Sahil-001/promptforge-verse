import { useEffect, useRef } from "react";

export default function CursorEffect() {
  const rafId = useRef<number>(0);
  const mouseX = useRef(0);
  const mouseY = useRef(0);

  useEffect(() => {
    const cursor = document.getElementById("cursor");
    const trail = document.getElementById("cursor-trail");
    if (!cursor || !trail) return;

    // Don't attach listener on mobile devices
    if (
      window.matchMedia("(max-width: 768px)").matches ||
      window.matchMedia("(pointer: coarse)").matches
    ) {
      return;
    }

    let trailX = 0;
    let trailY = 0;

    const onMove = (e: MouseEvent) => {
      mouseX.current = e.clientX;
      mouseY.current = e.clientY;
    };

    const tick = () => {
      // Cursor follows instantly
      cursor.style.transform = `translate3d(${mouseX.current}px, ${mouseY.current}px, 0) translate(-50%, -50%)`;

      // Trail lerps toward the cursor for a smooth follow
      trailX += (mouseX.current - trailX) * 0.18;
      trailY += (mouseY.current - trailY) * 0.18;
      trail.style.transform = `translate3d(${trailX}px, ${trailY}px, 0) translate(-50%, -50%)`;

      rafId.current = requestAnimationFrame(tick);
    };

    rafId.current = requestAnimationFrame(tick);
    window.addEventListener("mousemove", onMove, { passive: true });

    return () => {
      cancelAnimationFrame(rafId.current);
      window.removeEventListener("mousemove", onMove);
    };
  }, []);

  return null;
}
