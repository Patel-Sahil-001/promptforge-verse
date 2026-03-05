import FloatingGeometry from "./FloatingGeometry";
import React, { useCallback } from "react";
import { Link } from "react-router-dom";

export default function HeroSection() {
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
    <section
      id="hero"
      className="min-h-screen flex flex-col items-center justify-center px-8 pt-40 pb-24 text-center relative overflow-hidden z-[1]"
    >
      <FloatingGeometry />

      {/* Tag */}
      <div
        className="font-mono text-[.7rem] tracking-[.3em] text-primary uppercase flex items-center gap-4 justify-center mb-8 opacity-0"
        style={{ transform: "translateY(20px)", animation: "fadeUp .8s 1s cubic-bezier(0.16,1,0.3,1) forwards" }}
      >
        <span className="w-9 h-px bg-primary opacity-50" />
        AI-Powered Prompt Engineering
        <span className="w-9 h-px bg-primary opacity-50" />
      </div>

      {/* Title */}
      <h1 className="font-display font-extrabold leading-[.9] tracking-[-0.03em] mb-6"
        style={{ fontSize: "clamp(3.5rem, 11vw, 10rem)" }}
      >
        <span className="block overflow-hidden">
          <span className="block opacity-0" style={{ transform: "translateY(110%)", animation: "lineReveal 1s 1.1s cubic-bezier(0.16,1,0.3,1) forwards" }}>
            CRAFT
          </span>
        </span>
        <span className="block overflow-hidden">
          <span
            className="block opacity-0 bg-clip-text"
            style={{
              transform: "translateY(110%)",
              animation: "lineReveal 1s 1.25s cubic-bezier(0.16,1,0.3,1) forwards",
              background: "linear-gradient(90deg, hsl(0 100% 56%), hsl(222 100% 63%))",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            PERFECT
          </span>
        </span>
        <span className="block overflow-hidden">
          <span className="block opacity-0" style={{ transform: "translateY(110%)", animation: "lineReveal 1s 1.4s cubic-bezier(0.16,1,0.3,1) forwards" }}>
            PROMPTS
          </span>
        </span>
      </h1>

      {/* Subtitle */}
      <p
        className="font-mono text-[.85rem] leading-[1.9] text-foreground/45 max-w-[480px] mb-12 opacity-0"
        style={{ transform: "translateY(20px)", animation: "fadeUp .8s 1.7s forwards" }}
      >
        Score, enhance, and optimize your AI prompts across every major model. Built for prompt engineers who demand precision.
      </p>

      {/* CTA Button */}
      <div
        className="flex gap-5 justify-center opacity-0"
        style={{ animation: "fadeUp .8s 2s forwards" }}
      >
        <div className="mag-wrap" onMouseMove={handleMagMove} onMouseLeave={handleMagLeave}>
          <Link
            to="/generator"
            className="btn-sweep relative px-9 py-3.5 font-display text-xs font-bold tracking-[.15em] uppercase no-underline cursor-none overflow-hidden bg-primary text-primary-foreground inline-block transition-transform duration-300 hover:scale-[1.03]"
            style={{ clipPath: "polygon(10px 0%, 100% 0%, calc(100% - 10px) 100%, 0% 100%)" }}
          >
            Start Building
          </Link>
        </div>
      </div>

      {/* Scroll Hint */}
      <div
        className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-0"
        style={{ animation: "fadeUp 1s 2.5s forwards" }}
      >
        <span className="font-mono text-[.6rem] tracking-[.2em] text-foreground/25 uppercase">Scroll to explore</span>
        <div className="w-px h-[55px]" style={{ background: "linear-gradient(to bottom, hsl(var(--primary)), transparent)", animation: "pulse-line 2s ease-in-out infinite" }} />
      </div>
    </section>
  );
}
