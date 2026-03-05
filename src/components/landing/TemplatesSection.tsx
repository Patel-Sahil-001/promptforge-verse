import { useScrollReveal } from "@/hooks/useScrollReveal";
import { Link } from "react-router-dom";
import React, { useCallback } from "react";

const TEMPLATES = [
    {
        cat: "llm",
        title: "SaaS Landing Page Content",
        tags: ["Marketing", "Copywriting"],
        desc: "A framework that extracts value propositions and target audience pain points to write conversion-optimized copy.",
    },
    {
        cat: "image",
        title: "Cinematic Product Photography",
        tags: ["Midjourney", "Commercial"],
        desc: "Achieve studio-quality lighting, 85mm lens effects, and photorealistic textures for product mockups.",
    },
    {
        cat: "writing",
        title: "Executive Summarizer",
        tags: ["Business", "Analysis"],
        desc: "Distill complex reports into 3-point executive summaries with action items and key takeaways.",
    },
];

export default function TemplatesSection() {
    const { ref, isVisible } = useScrollReveal();

    const handleMagMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
        const w = e.currentTarget;
        const r = w.getBoundingClientRect();
        const cx = r.left + r.width / 2;
        const cy = r.top + r.height / 2;
        w.style.transform = `translate(${(e.clientX - cx) * 0.15}px, ${(e.clientY - cy) * 0.15}px)`;
    }, []);

    const handleMagLeave = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
        e.currentTarget.style.transform = "";
    }, []);

    return (
        <section className="relative z-[1] px-8 py-32 bg-[#050505]">
            <div className="max-w-[1200px] mx-auto" ref={ref}>
                <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-8">
                    <div>
                        <span
                            className={`font-mono text-[.68rem] tracking-[.25em] text-foreground/40 uppercase transition-all duration-700 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-5"
                                }`}
                        >
                            // Quick Starts
                        </span>
                        <h2
                            className={`font-display font-extrabold leading-[1] tracking-[-0.02em] mt-3 transition-all duration-800 delay-100 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
                                }`}
                            style={{ fontSize: "clamp(2rem, 4vw, 3.5rem)" }}
                        >
                            Templates for <br />
                            instant <span className="text-white">alchemy</span>
                        </h2>
                    </div>

                    <div
                        className={`transition-all duration-800 delay-200 ${isVisible ? "opacity-100 translate-x-0" : "opacity-0 translate-x-8"
                            }`}
                    >
                        <Link
                            to="/generator"
                            className="font-mono text-[.75rem] uppercase tracking-widest text-foreground/60 hover:text-primary transition-colors border-b border-border hover:border-primary pb-1"
                        >
                            View all templates →
                        </Link>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {TEMPLATES.map((tpl, i) => {
                        const delay = 300 + i * 150;
                        return (
                            <Link
                                key={tpl.title}
                                to={`/generator?cat=${tpl.cat}`}
                                className={`group block bg-black border border-border2 p-8 hover:border-primary/50 transition-all duration-500 hover:bg-white/5 no-underline mkt-card transform-style-3d ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"
                                    }`}
                                style={{ transitionDelay: `${delay}ms` }}
                            >
                                <div className="flex gap-2 mb-4">
                                    {tpl.tags.map(tag => (
                                        <span key={tag} className="px-2.5 py-1 text-[0.6rem] font-mono uppercase tracking-wider bg-white/5 border border-white/10 text-foreground/60 rounded">
                                            {tag}
                                        </span>
                                    ))}
                                </div>
                                <h3 className="font-display text-xl font-bold mb-3 text-foreground/90 group-hover:text-primary transition-colors">
                                    {tpl.title}
                                </h3>
                                <p className="font-mono text-sm leading-relaxed text-foreground/50">
                                    {tpl.desc}
                                </p>
                            </Link>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
