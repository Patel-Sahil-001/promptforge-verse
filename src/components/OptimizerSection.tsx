import { useScrollReveal } from "@/hooks/useScrollReveal";
import React, { useState, useCallback } from "react";
import { toast } from "sonner";

const MODELS = [
  { id: "gpt4", label: "GPT-4", tips: ["Added system role", "XML tags for structure", "Specified response length"] },
  { id: "claude", label: "Claude", tips: ["Used <instructions> tags", "Explicit format", "Context before task"] },
  { id: "gemini", label: "Gemini", tips: ["Conversational tone", "Think step by step", "Multimodal needs"] },
  { id: "midjourney", label: "Midjourney", tips: ["Style keywords at end", "--ar 16:9", "--v 6 flag"] },
  { id: "dalle", label: "DALL-E", tips: ["Literal description", "Art style specified", "8k resolution"] },
];

const SAMPLE_PROMPTS: Record<string, string> = {
  gpt4: "System: You are a helpful assistant.\n\nUser: Write a comprehensive analysis of renewable energy trends.\n\nRespond in a structured, detailed manner with headers and bullet points.",
  claude: "<instructions>\nWrite a comprehensive analysis of renewable energy trends.\n</instructions>\n\nPlease follow the above instructions carefully and provide detailed output.",
  gemini: "Write a comprehensive analysis of renewable energy trends.\n\nThink step by step before responding. Structure your answer with clear sections.",
  midjourney: "renewable energy future, solar panels on floating platforms, golden hour lighting, photorealistic --v 6 --ar 16:9 --style raw",
  dalle: "A highly detailed, photorealistic image of: futuristic renewable energy farm with solar panels and wind turbines at sunset. High quality, 8k resolution.",
};

export default function OptimizerSection() {
  const { ref, isVisible } = useScrollReveal();
  const [selected, setSelected] = useState<string[]>(["gpt4", "claude", "gemini"]);

  const toggle = (id: string) =>
    setSelected((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));

  const copy = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success("Copied!");
  };

  // 3D tilt handlers
  const handleTiltMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const card = e.currentTarget;
    const r = card.getBoundingClientRect();
    const dx = (e.clientX - r.left - r.width / 2) / r.width;
    const dy = (e.clientY - r.top - r.height / 2) / r.height;
    card.style.transform = `rotateX(${dy * -18}deg) rotateY(${dx * 18}deg) scale(1.04)`;
    const g = card.querySelector<HTMLElement>(".spotlight");
    if (g) {
      g.style.setProperty("--tx", ((e.clientX - r.left) / r.width * 100) + "%");
      g.style.setProperty("--ty", ((e.clientY - r.top) / r.height * 100) + "%");
    }
    card.style.setProperty("--mx", ((e.clientX - r.left) / r.width * 100) + "%");
    card.style.setProperty("--my", ((e.clientY - r.top) / r.height * 100) + "%");
  }, []);

  const handleTiltLeave = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    e.currentTarget.style.transform = "";
  }, []);

  // Magnetic button handlers
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
    <section id="optimizer" className="relative z-[1] px-12 py-32">
      <div className="max-w-[1100px] mx-auto" ref={ref}>
        <span className={`font-mono text-[.68rem] tracking-[.25em] text-primary uppercase transition-all duration-700 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-5"}`}>
          // Multi-Model Optimizer
        </span>
        <h2
          className={`font-display font-extrabold leading-[.95] tracking-[-0.02em] mt-3 grad-animated transition-all duration-800 delay-100 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-9"}`}
          style={{ fontSize: "clamp(2.2rem, 5vw, 4.5rem)" }}
        >
          Optimize for Every Model
        </h2>

        <div className="flex flex-wrap gap-4 my-8">
          {MODELS.map((m) => (
            <label
              key={m.id}
              className={`flex items-center gap-2.5 px-5 py-2.5 border font-mono text-[.72rem] cursor-none transition-all duration-300
                ${selected.includes(m.id) ? "border-primary text-primary" : "border-border text-foreground/50 hover:border-primary hover:text-primary"}`}
              style={{ background: "hsl(var(--glass))" }}
            >
              <input
                type="checkbox"
                checked={selected.includes(m.id)}
                onChange={() => toggle(m.id)}
                className="appearance-none w-3 h-3 border border-border2 relative cursor-none shrink-0
                  checked:bg-primary checked:border-primary"
              />
              {m.label}
            </label>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px bg-border mt-8">
          {MODELS.filter((m) => selected.includes(m.id)).map((m, i) => (
            <div
              key={m.id}
              className={`tilt-card mkt-card bg-background p-8 relative overflow-hidden transition-all duration-500 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-5"}`}
              style={{ transitionDelay: `${i * 100}ms` }}
              onMouseMove={handleTiltMove}
              onMouseLeave={handleTiltLeave}
            >
              <div className="spotlight" />
              <div className="text-[.7rem] font-mono tracking-[.15em] text-primary uppercase mb-4 flex items-center gap-2 relative z-[2]">
                <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                {m.label}
              </div>
              <div className="bg-black/40 border border-border p-4 font-mono text-[.72rem] leading-[1.8] text-foreground/70 min-h-[120px] whitespace-pre-wrap break-words relative z-[2]">
                {SAMPLE_PROMPTS[m.id]}
              </div>
              <div className="flex flex-wrap gap-2 mt-4 relative z-[2]">
                {m.tips.map((tip) => (
                  <span key={tip} className="px-3 py-0.5 font-mono text-[.6rem] tracking-[.1em] text-primary border border-primary/15 bg-primary/[.06]">
                    {tip}
                  </span>
                ))}
              </div>
              <div className="mag-wrap mt-4 relative z-[2]" onMouseMove={handleMagMove} onMouseLeave={handleMagLeave}>
                <button
                  onClick={() => copy(SAMPLE_PROMPTS[m.id])}
                  className="btn-sweep relative px-5 py-2 font-display text-[.65rem] font-bold tracking-[.15em] uppercase cursor-none overflow-hidden bg-transparent text-foreground border border-border2 transition-transform duration-300 hover:scale-[1.03]"
                  style={{ clipPath: "polygon(8px 0%, 100% 0%, calc(100% - 8px) 100%, 0% 100%)" }}
                >
                  Copy
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
