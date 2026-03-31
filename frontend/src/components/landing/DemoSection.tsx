import { useState, useEffect } from "react";
import { useScrollReveal } from "@/hooks/useScrollReveal";

const DEFAULT_PROMPT = "make me a python script to scrape a website";
const ENHANCED_PROMPT = `Act as an expert Python developer and data engineer.
Write a robust web scraping script using BeautifulSoup and Requests.

Target: A standard HTML website.
Requirements:
1. Include proper error handling for HTTP requests (timeouts, 404s, retries).
2. Use headers to simulate a real browser request and avoid basic blocks.
3. Parse the HTML to extract specific data (assume article titles and links for this example).
4. Save the extracted data to a cleanly formatted CSV file.
5. Add rate-limiting (e.g., time.sleep) to be respectful of the server.
6. Provide clear inline comments explaining each step.

Output format: ONLY valid Python code, properly formatted.`;

export default function DemoSection() {
    const { ref, isVisible } = useScrollReveal();
    const [isAnimating, setIsAnimating] = useState(false);
    const [animatedText, setAnimatedText] = useState("");
    const [showEnhanced, setShowEnhanced] = useState(false);

    useEffect(() => {
        if (!isVisible || showEnhanced) return;

        // Start typing animation when visible
        const timeout = setTimeout(() => {
            setIsAnimating(true);
            let i = 0;
            const interval = setInterval(() => {
                setAnimatedText(ENHANCED_PROMPT.slice(0, i));
                i += 3; // Speed of typing
                if (i > ENHANCED_PROMPT.length) {
                    clearInterval(interval);
                    setAnimatedText(ENHANCED_PROMPT);
                    setIsAnimating(false);
                    setShowEnhanced(true);
                }
            }, 10);
            return () => clearInterval(interval);
        }, 1500);

        return () => clearTimeout(timeout);
    }, [isVisible, showEnhanced]);

    return (
        <section className="relative z-[1] px-8 py-32 bg-[#020408]">
            <div className="max-w-[1200px] mx-auto" ref={ref}>
                <div className="text-center mb-16">
                    <span
                        className={`font-mono text-[.68rem] tracking-[.25em] text-accent uppercase transition-all duration-700 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-5"
                            }`}
                    >
                        // The Difference
                    </span>
                    <h2
                        className={`font-display font-extrabold leading-[1] tracking-[-0.02em] mt-3 transition-all duration-800 delay-100 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
                            }`}
                        style={{ fontSize: "clamp(2.5rem, 5vw, 4.5rem)" }}
                    >
                        See the <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent to-primary">Alchemy</span>
                    </h2>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-0 items-center">
                    {/* Before Card */}
                    <div
                        className={`bg-background/80 backdrop-blur-sm border border-border2 p-8 lg:p-12 relative z-10 lg:translate-x-4 transition-all duration-1000 ${isVisible ? "opacity-100 transform-none" : "opacity-0 -translate-x-12"
                            }`}
                    >
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-2.5 h-2.5 rounded-full bg-red-500/80 shadow-[0_0_10px_rgba(239,68,68,0.5)]" />
                            <span className="font-mono text-xs tracking-widest uppercase text-foreground/40">Basic Input</span>
                        </div>
                        <p className="font-mono text-sm leading-relaxed text-foreground/70">
                            "{DEFAULT_PROMPT}"
                        </p>
                    </div>

                    {/* After Card */}
                    <div
                        className={`bg-black border border-primary/30 p-8 lg:p-12 relative shadow-[0_0_50px_rgba(0,100,255,0.05)] transition-all duration-1000 delay-300 ${isVisible ? "opacity-100 transform-none" : "opacity-0 translate-x-12"
                            }`}
                    >
                        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent pointer-events-none" />

                        <div className="flex items-center justify-between mb-6 relative">
                            <div className="flex items-center gap-3">
                                <div className={`w-2.5 h-2.5 rounded-full ${showEnhanced ? 'bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.8)]' : 'bg-primary/50 animate-pulse'} `} />
                                <span className="font-mono text-xs tracking-widest uppercase text-primary">
                                    {isAnimating ? "Enhancing..." : showEnhanced ? "Optimized Output" : "Waiting..."}
                                </span>
                            </div>
                        </div>

                        <div className="font-mono text-[0.8rem] leading-loose text-foreground/90 whitespace-pre-wrap min-h-[350px] relative">
                            {animatedText || (
                                <span className="text-foreground/20 italic">Anewzing the prompt structure...</span>
                            )}
                            {isAnimating && (
                                <span className="inline-block w-2 h-4 bg-primary ml-1 animate-pulse" />
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
