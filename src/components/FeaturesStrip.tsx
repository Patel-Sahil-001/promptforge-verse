import { useScrollReveal } from "@/hooks/useScrollReveal";

const FEATURES = [
  { icon: "⚡", name: "Instant Generation", desc: "Build prompts in seconds with our data-driven template engine across 5 categories." },
  { icon: "🏆", name: "AI Scoring", desc: "Get a 0-100 score with per-dimension feedback to improve your prompts." },
  { icon: "🔀", name: "Multi-Model", desc: "Optimize for GPT-4, Claude, Gemini, Midjourney & DALL-E in one click." },
  { icon: "⚔️", name: "A/B Testing", desc: "Pit two prompt variants against each other and pick the winner." },
];

export default function FeaturesStrip() {
  const { ref, isVisible } = useScrollReveal();

  return (
    <section className="relative z-[1] px-12 py-32">
      <div ref={ref} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-px bg-border max-w-[1100px] mx-auto">
        {FEATURES.map((f, i) => (
          <div
            key={f.name}
            className={`bg-background p-10 cursor-none relative overflow-hidden transition-all duration-600 group
              ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}
            style={{ transitionDelay: `${i * 100}ms` }}
          >
            <div className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:w-full" />
            <div className="text-3xl mb-4">{f.icon}</div>
            <h3 className="text-base font-bold mb-2">{f.name}</h3>
            <p className="font-mono text-[.7rem] leading-[1.7] text-foreground/40">{f.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
