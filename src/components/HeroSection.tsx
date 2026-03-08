import FloatingGeometry from "./FloatingGeometry";
import React from "react";
import { TextEffect } from "@/components/core/text-effect";

export default function HeroSection() {
  return (
    <section
      id="hero"
      className="min-h-screen flex flex-col items-center justify-center px-4 md:px-8 pt-28 md:pt-40 pb-16 md:pb-24 text-center relative overflow-hidden z-[1]"
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
        style={{ fontSize: "clamp(2.5rem, 11vw, 10rem)" }}
      >
        <TextEffect per="char" preset="slide" delay={1.1} className="block">
          CRAFT
        </TextEffect>
        <TextEffect
          per="char"
          preset="slide"
          delay={1.25}
          className="block"
          style={{
            background: "linear-gradient(90deg, hsl(0 100% 56%), hsl(222 100% 63%))",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
          }}
        >
          PERFECT
        </TextEffect>
        <TextEffect per="char" preset="slide" delay={1.4} className="block">
          PROMPTS
        </TextEffect>
      </h1>

      {/* Subtitle */}
      <p
        className="font-mono text-[.85rem] leading-[1.9] text-foreground/45 max-w-[480px] mb-12 opacity-0"
        style={{ transform: "translateY(20px)", animation: "fadeUp .8s 1.7s forwards" }}
      >
        Stop guessing. Start crafting.
      </p>

      {/* CTA Button removed */}

      {/* Scroll Hint */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-[2]">
        <div
          className="flex flex-col items-center gap-2 opacity-0"
          style={{ animation: "fadeUp 1s 2.5s forwards" }}
        >
          <span className="font-mono text-[.6rem] tracking-[.2em] text-foreground/25 uppercase">Scroll to explore</span>
          <div className="w-px h-[55px]" style={{ background: "linear-gradient(to bottom, hsl(var(--primary)), transparent)", animation: "pulse-line 2s ease-in-out infinite" }} />
        </div>
      </div>
    </section>
  );
}
