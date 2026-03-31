import { useScrollReveal } from "@/hooks/useScrollReveal";
import { Link } from "react-router-dom";
import { Sparkles, Image as ImageIcon, PenLine } from "lucide-react";
import React, { useCallback } from "react";
import GlowHover from "@/components/GlowHover";

const FEATURES = [
    {
        title: "LLM Enhancer",
        desc: "Turn vague ideas into structured, model-ready prompts for ChatGPT, Claude, and Gemini.",
        icon: Sparkles,
        link: "/generator?cat=llm",
        color: "text-primary",
        border: "border-primary/30 hover:border-primary/60",
        bg: "hover:bg-primary/5",
        glowTheme: { hue: 0, saturation: 100, lightness: 56 },
    },
    {
        title: "Image Alchemy",
        desc: "Upload any image and extract a high-fidelity Midjourney or Stable Diffusion prompt.",
        icon: ImageIcon,
        link: "/generator?cat=image",
        color: "text-secondary",
        border: "border-secondary/30 hover:border-secondary/60",
        bg: "hover:bg-secondary/5",
        glowTheme: { hue: 222, saturation: 100, lightness: 63 },
    },
    {
        title: "Creative Studio",
        desc: "Generate perfectly toned emails, stories, and summaries with targeted audience alignment.",
        icon: PenLine,
        link: "/generator?cat=writing",
        color: "text-purple-400",
        border: "border-purple-400/30 hover:border-purple-400/60",
        bg: "hover:bg-purple-400/5",
        glowTheme: { hue: 282, saturation: 100, lightness: 57 },
    },
];

export default function FeaturesSection() {
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

    const glowItems = FEATURES.map((feat, i) => {
        const Icon = feat.icon;
        const delay = 200 + i * 150;
        return {
            id: feat.title,
            theme: feat.glowTheme,
            element: (
                <div
                    className={`bg-background p-8 md:p-10 lg:p-14 group transition-all duration-700 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"}`}
                    style={{ transitionDelay: `${delay}ms` }}
                >
                    <div className={`w-14 h-14 rounded-2xl border ${feat.border} flex items-center justify-center mb-8 bg-black/40 transition-colors duration-500 ${feat.bg}`}>
                        <Icon className={feat.color} size={24} />
                    </div>
                    <h3 className="font-display text-2xl font-bold mb-4 tracking-tight">{feat.title}</h3>
                    <p className="font-mono text-[.8rem] leading-[1.8] text-foreground/50 mb-10 max-w-[400px]">{feat.desc}</p>
                    <div className="mag-wrap" onMouseMove={handleMagMove} onMouseLeave={handleMagLeave}>
                        <Link
                            to={feat.link}
                            className="inline-flex items-center gap-2 font-mono text-[.7rem] uppercase tracking-widest text-foreground hover:text-primary transition-colors cursor-none btn-sweep px-5 py-2.5 bg-black/40 border border-border2"
                            style={{ clipPath: "polygon(8px 0%, 100% 0%, calc(100% - 8px) 100%, 0% 100%)" }}
                        >
                            Explore Lab <span>→</span>
                        </Link>
                    </div>
                </div>
            ),
        };
    });

    return (
        <section id="features" className="relative z-[1] px-4 md:px-8 py-20 md:py-32 bg-background">
            <div className="max-w-[1200px] mx-auto" ref={ref}>
                <div className="text-center mb-20">
                    <span
                        className={`font-mono text-[.68rem] tracking-[.25em] text-primary uppercase transition-all duration-700 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-5"}`}
                    >
                        // The Laboratory
                    </span>
                    <h2
                        className={`font-display font-extrabold leading-[1] tracking-[-0.02em] mt-3 transition-all duration-800 delay-100 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
                        style={{ fontSize: "clamp(2rem, 6vw, 5rem)" }}
                    >
                        Tools for every <br className="hidden md:block" />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">
                            imaginable medium
                        </span>
                    </h2>
                </div>

                <GlowHover
                    className="grid grid-cols-1 md:grid-cols-3 gap-px bg-border"
                    items={glowItems}
                />
            </div>
        </section>
    );
}
