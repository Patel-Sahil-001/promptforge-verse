import { useEffect, useRef } from "react";

export default function ParallaxText() {
  const textRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onScroll = () => {
      if (textRef.current) {
        const scrollY = window.scrollY;
        textRef.current.style.transform = `translateX(${-scrollY * 0.15}px)`;
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div className="py-8 overflow-hidden border-y border-border relative z-[1]">
      <div ref={textRef} className="ptext">
        PROMPT.LAB — CRAFT PERFECT PROMPTS — SCORE — ENHANCE — OPTIMIZE — PROMPT.LAB
      </div>
    </div>
  );
}
