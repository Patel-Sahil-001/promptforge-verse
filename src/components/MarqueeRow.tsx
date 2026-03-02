const ITEMS = [
  "Prompt Engineering", "AI Optimization", "Multi-Model", "Score & Grade",
  "Claude", "GPT-4", "Gemini", "Midjourney", "DALL-E",
  "A/B Testing", "Enhancement", "Marketplace",
];

function MarqueeTrack({ reverse }: { reverse?: boolean }) {
  return (
    <div className={`marquee-track ${reverse ? "rev" : ""}`}>
      {[...ITEMS, ...ITEMS].map((item, i) => (
        <span key={i} className="text-[.7rem] font-mono tracking-[.15em] uppercase text-foreground/20 flex items-center gap-6 shrink-0">
          <span className="w-[3px] h-[3px] bg-primary rounded-full shrink-0" />
          {item}
        </span>
      ))}
    </div>
  );
}

export default function MarqueeRow() {
  return (
    <div className="relative z-[1]">
      <div className="py-10 overflow-hidden border-y border-border">
        <MarqueeTrack />
      </div>
      <div className="py-10 overflow-hidden border-b border-border">
        <MarqueeTrack reverse />
      </div>
    </div>
  );
}
