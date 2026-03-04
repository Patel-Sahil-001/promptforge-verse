import { useScrollReveal } from "@/hooks/useScrollReveal";
import React, { useCallback } from "react";

export default function ABTestSection() {
  const { ref, isVisible } = useScrollReveal();

  const handleMagMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const w = e.currentTarget;
    const r = w.getBoundingClientRect();
    const cx = r.left + r.width / 2;
    const cy = r.top + r.height / 2;
    w.style.transform = `translate(${(e.clientX - cx) * 0.3}px, ${(e.clientY - cy) * 0.3}px)`;
  }, []);

  const handleMagLeave = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    e.currentTarget.style.transform = "";
  }, []);

  return (
    <section id="abtesting" className="relative z-[1] px-12 py-32" style={{ background: "linear-gradient(180deg, hsl(var(--background)) 0%, #05000a 50%, hsl(var(--background)) 100%)" }}>
      <div className="max-w-[1100px] mx-auto" ref={ref}>
        <span className={`font-mono text-[.68rem] tracking-[.25em] text-primary uppercase transition-all duration-700 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-5"}`}>
          // A/B Testing
        </span>
        <h2
          className={`font-display font-extrabold leading-[.95] tracking-[-0.02em] mt-3 grad-animated transition-all duration-800 delay-100 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-9"}`}
          style={{ fontSize: "clamp(2.2rem, 5vw, 4.5rem)" }}
        >
          Test & Compare
        </h2>

        {/* Controls */}
        <div className="flex gap-4 items-center flex-wrap my-10">
          <select className="bg-glass border border-border text-foreground font-mono text-xs py-3 px-4 outline-none cursor-none">
            <option>GPT-4</option>
            <option>Claude</option>
            <option>Gemini</option>
          </select>
          <div className="mag-wrap" onMouseMove={handleMagMove} onMouseLeave={handleMagLeave}>
            <button
              className="btn-sweep relative px-9 py-3.5 font-display text-xs font-bold tracking-[.15em] uppercase cursor-none overflow-hidden bg-primary text-primary-foreground transition-transform duration-300 hover:scale-[1.03]"
              style={{ clipPath: "polygon(10px 0%, 100% 0%, calc(100% - 10px) 100%, 0% 100%)" }}
            >
              Run A/B Test
            </button>
          </div>
        </div>

        {/* Panels */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-px bg-border">
          {/* Variant A */}
          <div className="bg-background p-8">
            <div className="font-mono text-[.68rem] tracking-[.15em] mb-4 flex items-center gap-2 text-primary">
              ● Variant A
            </div>
            <textarea
              className="w-full bg-black/40 border border-border p-4 font-mono text-[.78rem] leading-[1.8] text-foreground min-h-[140px] resize-none outline-none transition-colors duration-300 focus:border-primary"
              placeholder="Enter prompt variant A..."
            />
            <div className="font-mono text-[.6rem] tracking-[.15em] text-foreground/35 uppercase mt-6 mb-2">Output</div>
            <div className="bg-black/40 border border-border p-4 min-h-[100px] font-mono text-xs leading-[1.8] text-foreground/65 whitespace-pre-wrap break-words">
              AI output will appear here after running the test...
            </div>
          </div>
          {/* Variant B */}
          <div className="bg-background p-8">
            <div className="font-mono text-[.68rem] tracking-[.15em] mb-4 flex items-center gap-2 text-secondary">
              ● Variant B
            </div>
            <textarea
              className="w-full bg-black/40 border border-border p-4 font-mono text-[.78rem] leading-[1.8] text-foreground min-h-[140px] resize-none outline-none transition-colors duration-300 focus:border-primary"
              placeholder="Enter prompt variant B..."
            />
            <div className="font-mono text-[.6rem] tracking-[.15em] text-foreground/35 uppercase mt-6 mb-2">Output</div>
            <div className="bg-black/40 border border-border p-4 min-h-[100px] font-mono text-xs leading-[1.8] text-foreground/65 whitespace-pre-wrap break-words">
              AI output will appear here after running the test...
            </div>
          </div>
        </div>

        {/* Winner Buttons */}
        <div className="flex gap-4 justify-center mt-6">
          <div className="mag-wrap" onMouseMove={handleMagMove} onMouseLeave={handleMagLeave}>
            <button className="btn-sweep relative px-6 py-2.5 font-display text-[.68rem] font-bold tracking-[.15em] uppercase cursor-none overflow-hidden border border-primary text-primary bg-primary/10 transition-transform duration-300 hover:scale-[1.03]"
              style={{ clipPath: "polygon(8px 0%, 100% 0%, calc(100% - 8px) 100%, 0% 100%)" }}>
              A Wins
            </button>
          </div>
          <div className="mag-wrap" onMouseMove={handleMagMove} onMouseLeave={handleMagLeave}>
            <button className="btn-sweep relative px-6 py-2.5 font-display text-[.68rem] font-bold tracking-[.15em] uppercase cursor-none overflow-hidden border border-secondary text-secondary bg-secondary/10 transition-transform duration-300 hover:scale-[1.03]"
              style={{ clipPath: "polygon(8px 0%, 100% 0%, calc(100% - 8px) 100%, 0% 100%)" }}>
              B Wins
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
