import { useScrollReveal } from "@/hooks/useScrollReveal";

const STEPS = [
    {
        num: "01",
        title: "Outline your intent",
        desc: "Drop in your rough notes, scattered ideas, or vague requirements. Don't worry about formatting or best practices—just get the core concept down.",
    },
    {
        num: "02",
        title: "AI Alchemy",
        desc: "Our engine processes your intent, analyzing it against proven prompt engineering frameworks (role, context, constraints, tone, and format).",
    },
    {
        num: "03",
        title: "Deploy anywhere",
        desc: "Copy your highly structured, perfectly formatted prompt. Paste it into your AI model of choice and watch the quality of your outputs skyrocket.",
    },
];

export default function HowItWorksSection() {
    const { ref, isVisible } = useScrollReveal();

    return (
        <section className="relative z-[1] px-4 md:px-8 py-16 md:py-32 bg-black border-y border-border overflow-hidden">
            {/* Background elements */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[80px] will-change-transform -translate-y-1/2 translate-x-1/3 pointer-events-none" />

            <div className="max-w-[1200px] mx-auto" ref={ref}>
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16">
                    {/* Left Column - Heading */}
                    <div className="lg:col-span-5 flex flex-col justify-center">
                        <span
                            className={`font-mono text-[.68rem] tracking-[.25em] text-secondary uppercase mb-4 transition-all duration-700 ${isVisible ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-5"
                                }`}
                        >
                            // The Process
                        </span>
                        <h2
                            className={`font-display font-extrabold leading-[1] tracking-[-0.02em] transition-all duration-800 delay-100 ${isVisible ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-8"
                                }`}
                            style={{ fontSize: "clamp(2.5rem, 5vw, 4.5rem)" }}
                        >
                            From concept to <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-secondary to-primary">
                                execution
                            </span>
                        </h2>
                        <p
                            className={`font-mono text-[.85rem] leading-[1.8] text-foreground/50 mt-8 max-w-[400px] transition-all duration-800 delay-200 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-5"
                                }`}
                        >
                            We've abstracted away the complexity of prompt engineering. Our pipeline turns the chaotic process of iteration into a predictable science.
                        </p>
                    </div>

                    {/* Right Column - Steps */}
                    <div className="lg:col-span-7 relative">
                        {/* Connecting line */}
                        <div
                            className={`absolute left-[27px] top-4 bottom-4 w-px bg-gradient-to-b from-primary/50 via-secondary/50 to-transparent origin-top transition-transform duration-1000 delay-300 ${isVisible ? "scale-y-100" : "scale-y-0"
                                }`}
                        />

                        <div className="flex flex-col gap-12">
                            {STEPS.map((step, i) => {
                                const delay = 300 + i * 200;
                                return (
                                    <div
                                        key={step.num}
                                        className={`relative pl-20 transition-all duration-700 ${isVisible ? "opacity-100 translate-x-0" : "opacity-0 translate-x-12"
                                            }`}
                                        style={{ transitionDelay: `${delay}ms` }}
                                    >
                                        <div className="absolute left-0 top-0 w-14 h-14 bg-background border border-border2 rounded-full flex items-center justify-center font-mono text-sm font-bold text-foreground/80 z-10 shadow-[0_0_20px_rgba(0,0,0,0.5)]">
                                            {step.num}
                                        </div>
                                        <div className="pt-2">
                                            <h3 className="font-display text-xl font-bold mb-3 tracking-wide text-foreground/90">
                                                {step.title}
                                            </h3>
                                            <p className="font-mono text-[.8rem] leading-[1.8] text-foreground/45 max-w-[480px]">
                                                {step.desc}
                                            </p>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
