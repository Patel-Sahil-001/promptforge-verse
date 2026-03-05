import { useScrollReveal } from "@/hooks/useScrollReveal";

const TESTIMONIALS = [
    {
        quote: "Before Prompt Verse, I was manually testing Midjourney prompts for hours. This tool gives me the exact structure I need on the first try.",
        author: "Sarah J.",
        role: "Creative Director"
    },
    {
        quote: "The LLM enhancer is basically a superpower. It turns my rambling notes into highly logical, deterministic instructions that Claude understands perfectly.",
        author: "Marcus T.",
        role: "Lead Developer"
    },
    {
        quote: "Content generation used to be hit or miss. Now, we get consistent Tone of Voice across all our marketing emails because the prompts are airtight.",
        author: "Elena R.",
        role: "Growth Marketer"
    }
];

export default function TestimonialsSection() {
    const { ref, isVisible } = useScrollReveal();

    return (
        <section className="relative z-[1] px-8 py-32 bg-background border-t border-border">
            <div className="max-w-[1200px] mx-auto" ref={ref}>
                <div className="text-center mb-20">
                    <span
                        className={`font-mono text-[.68rem] tracking-[.25em] text-primary uppercase transition-all duration-700 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-5"
                            }`}
                    >
                        // Field Reports
                    </span>
                    <h2
                        className={`font-display font-bold leading-[1] tracking-[-0.02em] mt-3 text-3xl lg:text-4xl transition-all duration-800 delay-100 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
                            }`}
                    >
                        Engineers who demand <span className="text-primary italic border-b border-primary/30">precision</span>
                    </h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {TESTIMONIALS.map((test, i) => {
                        const delay = 200 + i * 150;
                        return (
                            <div
                                key={test.author}
                                className={`bg-black/40 border border-border2 p-8 relative group hover:bg-white/5 transition-colors duration-500 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"
                                    }`}
                                style={{ transitionDelay: `${delay}ms` }}
                            >
                                <div className="absolute top-0 left-0 w-8 h-8 border-t border-l border-primary/50 -translate-x-1 -translate-y-1 opacity-0 group-hover:opacity-100 transition-opacity" />
                                <div className="absolute bottom-0 right-0 w-8 h-8 border-b border-r border-primary/50 translate-x-1 translate-y-1 opacity-0 group-hover:opacity-100 transition-opacity" />

                                <div className="text-primary/40 text-4xl font-serif leading-none mb-4">"</div>
                                <p className="font-mono text-[.85rem] leading-[1.8] text-foreground/70 mb-8 min-h-[120px]">
                                    {test.quote}
                                </p>
                                <div className="flex flex-col">
                                    <span className="font-display font-bold text-sm tracking-wide text-foreground/90 uppercase">
                                        {test.author}
                                    </span>
                                    <span className="font-mono text-[.65rem] tracking-widest text-foreground/40 uppercase mt-1">
                                        {test.role}
                                    </span>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
