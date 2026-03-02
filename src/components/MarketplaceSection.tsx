import { useScrollReveal } from "@/hooks/useScrollReveal";
import { useRef } from "react";

const CARDS = [
  { cat: "LLM", title: "Advanced Data Pipeline Architect", score: 92, preview: "You are a senior data engineer specializing in building scalable ETL pipelines...", author: "@datacraft", upvotes: 342 },
  { cat: "Image", title: "Cyberpunk Neon Portraits", score: 88, preview: "Portrait of a cyborg woman, neon-lit Tokyo alley background, rain reflections...", author: "@synthwave", upvotes: 218 },
  { cat: "Coding", title: "React Hook Generator", score: 85, preview: "Write a custom React hook in TypeScript that handles infinite scrolling with...", author: "@devtools", upvotes: 176 },
  { cat: "Writing", title: "Noir Detective Opening", score: 79, preview: "Write the opening chapter of a noir detective novel set in 1940s Los Angeles...", author: "@inkwell", upvotes: 134 },
  { cat: "Marketing", title: "SaaS Launch Email Sequence", score: 91, preview: "Create a 5-email drip campaign for a B2B SaaS product launch targeting...", author: "@growthlab", upvotes: 289 },
  { cat: "LLM", title: "Academic Paper Reviewer", score: 87, preview: "You are a peer reviewer for a top-tier machine learning conference...", author: "@scholar", upvotes: 156 },
];

const FILTERS = ["All", "LLM", "Image", "Coding", "Writing", "Marketing"];

export default function MarketplaceSection() {
  const { ref, isVisible } = useScrollReveal();
  const gridRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>, card: HTMLDivElement) => {
    const rect = card.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    card.style.setProperty("--mx", `${x}%`);
    card.style.setProperty("--my", `${y}%`);
  };

  return (
    <section id="marketplace" className="relative z-[1] px-12 py-32">
      <div className="max-w-[1200px] mx-auto" ref={ref}>
        <span className={`font-mono text-[.68rem] tracking-[.25em] text-primary uppercase transition-all duration-700 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-5"}`}>
          // Community Marketplace
        </span>
        <h2
          className={`font-display font-extrabold leading-[.95] tracking-[-0.02em] mt-3 transition-all duration-800 delay-100 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-9"}`}
          style={{ fontSize: "clamp(2.2rem, 5vw, 4.5rem)" }}
        >
          Discover & Fork
        </h2>

        {/* Filters */}
        <div className="flex gap-4 flex-wrap my-10 items-center">
          <input
            placeholder="Search prompts..."
            className="flex-1 min-w-[200px] bg-glass border border-border text-foreground font-mono text-[.78rem] py-3 px-5 outline-none transition-colors duration-300 focus:border-primary placeholder:text-foreground/20"
          />
          {FILTERS.map((f) => (
            <button
              key={f}
              className={`px-5 py-2 font-mono text-[.65rem] tracking-[.1em] uppercase cursor-none border transition-all duration-300
                ${f === "All" ? "border-primary text-primary bg-primary/5" : "border-border text-foreground/50 hover:border-primary hover:text-primary"}`}
              style={{ background: f !== "All" ? "hsl(var(--glass))" : undefined }}
            >
              {f}
            </button>
          ))}
        </div>

        {/* Grid */}
        <div ref={gridRef} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px bg-border">
          {CARDS.map((card, i) => (
            <div
              key={i}
              className={`mkt-card bg-background p-8 relative overflow-hidden cursor-none transition-all duration-600 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}
              style={{ transitionDelay: `${(i % 3) * 100}ms` }}
              onMouseMove={(e) => handleMouseMove(e, e.currentTarget)}
            >
              {/* Bottom line on hover */}
              <div className="absolute bottom-0 left-0 w-0 h-px bg-primary transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:w-full" />

              <div className="flex justify-between items-start mb-4">
                <span className="font-mono text-[.6rem] tracking-[.15em] uppercase px-3 py-1 border border-primary/15 bg-primary/[.07] text-primary">{card.cat}</span>
                <span className="font-mono text-[.7rem] font-bold bg-clip-text" style={{ background: "linear-gradient(90deg, hsl(0 100% 56%), hsl(222 100% 63%))", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                  {card.score}/100
                </span>
              </div>
              <h3 className="text-base font-bold mb-2 leading-tight">{card.title}</h3>
              <p className="font-mono text-[.7rem] leading-[1.7] text-foreground/40 line-clamp-3">{card.preview}</p>
              <div className="flex justify-between items-center mt-5 pt-4 border-t border-border">
                <span className="font-mono text-[.62rem] text-foreground/30 tracking-[.08em]">{card.author}</span>
                <div className="flex gap-3 items-center">
                  <button className="bg-transparent border-none text-foreground/35 font-mono text-[.68rem] cursor-none flex items-center gap-1 transition-colors duration-300 hover:text-primary">
                    ▲ {card.upvotes}
                  </button>
                  <button className="border border-border text-foreground/35 font-mono text-[.62rem] tracking-[.08em] px-3 py-1 cursor-none transition-all duration-300 uppercase hover:border-primary hover:text-primary">
                    Fork
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
