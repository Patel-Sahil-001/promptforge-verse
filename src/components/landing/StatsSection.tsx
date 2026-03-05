import React, { useState, useEffect } from "react";
import { useScrollReveal } from "@/hooks/useScrollReveal";

const STATS = [
    { value: 4.9, suffix: "/5", decimals: 1, label: "Average output rating" },
    { value: 2, suffix: "M+", decimals: 0, label: "Prompts generated" },
    { value: 15, suffix: "+", decimals: 0, label: "Supported AI models" },
    { value: 10, suffix: "x", decimals: 0, label: "Faster iteration cycles" },
];

const CountUp = ({ end, suffix = "", decimals = 0, duration = 2000, start = false }: { end: number, suffix?: string, decimals?: number, duration?: number, start?: boolean }) => {
    const [count, setCount] = useState(0);

    useEffect(() => {
        if (!start) return;
        let startTime: number | null = null;
        let animationFrameId: number;

        const animate = (timestamp: number) => {
            if (!startTime) startTime = timestamp;
            const progress = timestamp - startTime;

            const percent = Math.min(progress / duration, 1);
            const easeProgress = percent === 1 ? 1 : 1 - Math.pow(2, -10 * percent);

            setCount(end * easeProgress);

            if (percent < 1) {
                animationFrameId = requestAnimationFrame(animate);
            } else {
                setCount(end);
            }
        };

        animationFrameId = requestAnimationFrame(animate);
        return () => cancelAnimationFrame(animationFrameId);
    }, [end, duration, start]);

    return <>{count.toFixed(decimals)}{suffix}</>;
};

export default function StatsSection() {
    const { ref, isVisible } = useScrollReveal();

    return (
        <section className="relative z-[1] py-24 bg-background border-y border-border" ref={ref}>
            <div className="max-w-[1200px] mx-auto px-8">
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
                    {STATS.map((stat, i) => {
                        const delay = 100 + i * 150;
                        return (
                            <div
                                key={stat.label}
                                className={`text-center transition-all duration-700 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
                                    }`}
                                style={{ transitionDelay: `${delay}ms` }}
                            >
                                <div className="font-display font-black text-4xl lg:text-5xl text-foreground/90 tracking-tighter mb-2">
                                    <CountUp
                                        end={stat.value}
                                        suffix={stat.suffix}
                                        decimals={stat.decimals}
                                        start={isVisible}
                                    />
                                </div>
                                <div className="font-mono text-[.7rem] uppercase tracking-widest text-foreground/40">
                                    {stat.label}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
