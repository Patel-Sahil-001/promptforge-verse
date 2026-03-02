import { useEffect } from "react";

export default function CursorEffect() {
  useEffect(() => {
    const cursor = document.getElementById("cursor");
    const trail = document.getElementById("cursor-trail");
    if (!cursor || !trail) return;

    const onMove = (e: MouseEvent) => {
      cursor.style.left = e.clientX + "px";
      cursor.style.top = e.clientY + "px";
      trail.style.left = e.clientX + "px";
      trail.style.top = e.clientY + "px";
    };

    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, []);

  return null;
}
