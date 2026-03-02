import { useScrollReveal } from "@/hooks/useScrollReveal";
import { useState, useEffect } from "react";

const DIMENSIONS = [
  { key: "clarity", label: "Clarity", score: 18 },
  { key: "specificity", label: "Specificity", score: 15 },
  { key: "context", label: "Context", score: 14 },
  { key: "format", label: "Format", score: 16 },
  { key: "constraints", label: "Constraints", score: 15 },
];

const FEEDBACK = [
  { dim: "Clarity", text: "Clear task definition but role could be more specific." },
  { dim: "Specificity", text: "Add more detail about expected output length and structure." },
  { dim: "Context", text: "Good background provided but missing audience info." },
  { dim: "Format", text: "Output format is well specified — keep it up." },
  { dim: "Constraints", text: "Consider adding tone and style constraints." },
];

function AnimatedScore({ target }: { target: number }) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    let frame: number;
    const start = performance.now();
    const duration = 1500;
    const tick = (now: number) => {
      const elapsed = now - start;
      const pct = Math.min(elapsed / duration, 1);
      setCount(Math.round(pct * target));
      if (pct < 1) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [target]);
  return <>{count}</>;
}

export default function ScoreSection() {
  const { ref, isVisible } = useScrollReveal();
  const totalScore = 78;
  const circumference = 2 * Math.PI * 78;
  const offset = circumference - (totalScore / 100) * circumference;

  return (
    <section id="scoring" className="relative z-[1] px-12 py-32" style={{ background: "linear-gradient(180deg, #000 0%, #0a0000 50%, #000 100%)" }}>
      <div className="max-w-[1000px] mx-auto" ref={ref}>
        <span className={`font-mono text-[.68rem] tracking-[.25em] text-primary uppercase transition-all duration-700 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-5"}`}>
          // AI Scoring
        </span>
        <h2
          className={`font-display font-extrabold leading-[.95] tracking-[-0.02em] mt-3 transition-all duration-800 delay-100 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-9"}`}
          style={{ fontSize: "clamp(2.2rem, 5vw, 4.5rem)" }}
        >
          Score Your Prompt
        </h2>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-px bg-border mt-12">
          {/* Left: Score Circle + Bars */}
          <div className="bg-background p-12">
            <div className="flex justify-center mb-8">
              <div className="relative w-[180px] h-[180px]">
                <svg width="180" height="180" className="-rotate-90">
                  <circle cx="90" cy="90" r="78" fill="none" stroke="hsl(var(--border))" strokeWidth="3" />
                  <circle
                    cx="90" cy="90" r="78" fill="none"
                    stroke="url(#scoreGrad)" strokeWidth="3"
                    strokeDasharray={circumference}
                    strokeDashoffset={isVisible ? offset : circumference}
                    strokeLinecap="round"
                    style={{ transition: "stroke-dashoffset 1.5s cubic-bezier(0.16,1,0.3,1)" }}
                  />
                  <defs>
                    <linearGradient id="scoreGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="hsl(0 100% 56%)" />
                      <stop offset="100%" stopColor="hsl(222 100% 63%)" />
                    </linearGradient>
                  </defs>
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-[3.5rem] font-extrabold leading-none bg-clip-text" style={{ background: "linear-gradient(135deg, hsl(0 100% 56%), hsl(222 100% 63%))", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                    {isVisible ? <AnimatedScore target={totalScore} /> : 0}
                  </span>
                  <span className="font-mono text-[.65rem] tracking-[.2em] text-foreground/40 uppercase">/ 100</span>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-5">
              {DIMENSIONS.map((d) => (
                <div key={d.key}>
                  <div className="flex justify-between items-center mb-1.5">
                    <span className="font-mono text-[.68rem] tracking-[.1em] text-foreground/50 uppercase">{d.label}</span>
                    <span className="font-mono text-[.7rem] text-primary font-bold">{d.score}/20</span>
                  </div>
                  <div className="h-[3px] bg-border relative overflow-hidden">
                    <div className="score-bar-fill" style={{ width: isVisible ? `${(d.score / 20) * 100}%` : "0%" }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right: Feedback */}
          <div className="bg-background p-12">
            <div className="font-mono text-[.65rem] tracking-[.2em] text-foreground/35 uppercase mb-7 flex items-center gap-4">
              Feedback
              <span className="flex-1 h-px bg-border" />
            </div>
            <div className="flex flex-col gap-4">
              {FEEDBACK.map((f) => (
                <div key={f.dim} className="p-4 bg-glass border-l-2 border-primary">
                  <div className="font-mono text-[.62rem] tracking-[.15em] text-primary uppercase mb-1">{f.dim}</div>
                  <div className="font-mono text-[.72rem] leading-[1.7] text-foreground/55">{f.text}</div>
                </div>
              ))}
            </div>
            <div className="text-center mt-10">
              <button
                className="btn-sweep relative px-9 py-3.5 font-display text-xs font-bold tracking-[.15em] uppercase cursor-none overflow-hidden bg-primary text-primary-foreground transition-transform duration-300 hover:scale-[1.03]"
                style={{ clipPath: "polygon(10px 0%, 100% 0%, calc(100% - 10px) 100%, 0% 100%)" }}
              >
                Enhance with AI
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
