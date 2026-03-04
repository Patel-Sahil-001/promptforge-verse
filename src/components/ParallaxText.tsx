import { useEffect, useRef } from "react";

export default function ParallaxText() {
  const row1Ref = useRef<HTMLDivElement>(null);
  const row2Ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function loop() {
      const sy = window.scrollY;
      if (row1Ref.current) {
        row1Ref.current.style.transform = `translateX(${sy * -0.6}px)`;
      }
      if (row2Ref.current) {
        row2Ref.current.style.transform = `translateX(${sy * 0.5}px)`;
      }
      requestAnimationFrame(loop);
    }
    requestAnimationFrame(loop);
  }, []);

  return (
    <div className="relative z-[1] border-y border-border overflow-hidden">
      {/* Row 1 — slides LEFT */}
      <div className="parallax-row">
        <div ref={row1Ref} className="parallax-text">
          PROMPT.LAB · CRAFT PERFECT PROMPTS · SCORE · ENHANCE · OPTIMIZE · PROMPT.LAB · CRAFT PERFECT PROMPTS · SCORE · ENHANCE · OPTIMIZE ·
        </div>
      </div>
      {/* Row 2 — slides RIGHT */}
      <div className="parallax-row">
        <div ref={row2Ref} className="parallax-text parallax-text-alt">
          AI-POWERED · GPT-4 · CLAUDE · GEMINI · MIDJOURNEY · DALL-E · A/B TESTING · MARKETPLACE · AI-POWERED · GPT-4 · CLAUDE · GEMINI · MIDJOURNEY · DALL-E ·
        </div>
      </div>
    </div>
  );
}
