import React from "react";
import { motion } from "framer-motion";
import { Check, Zap, Sparkles, Star } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuthStore } from "@/store/authStore";
import ProgressBar from "@/components/ProgressBar";
import Navbar from "@/components/Navbar";
import GlowHover from "@/components/GlowHover";

const Pricing = () => {
    const { user, profile } = useAuthStore();
    const currentPlan = profile?.plan || "free";

    const handleMagMove = React.useCallback((e: React.MouseEvent<HTMLDivElement>) => {
        const w = e.currentTarget;
        const r = w.getBoundingClientRect();
        const cx = r.left + r.width / 2;
        const cy = r.top + r.height / 2;
        w.style.transform = `translate(${(e.clientX - cx) * 0.3}px, ${(e.clientY - cy) * 0.3}px)`;
    }, []);

    const handleMagLeave = React.useCallback((e: React.MouseEvent<HTMLDivElement>) => {
        e.currentTarget.style.transform = "";
    }, []);

    const tiers = [
        {
            name: "Free",
            id: "free",
            href: user ? "/generator" : "/sign-up",
            price: "$0",
            description: "Perfect for exploring the possibilities of PromptForge Verse.",
            features: [
                "10 AI Generations per day",
                "Access to standard LLM models",
                "Basic Image Alchemy tools",
                "Standard generation speed",
            ],
            icon: Zap,
            popular: false,
            ctaText: currentPlan === "free" ? "Current Plan" : "Get Started",
            glowTheme: { hue: 0, saturation: 0, lightness: 80 } // Whiteish/gray for free
        },
        {
            name: "Pro 6-Month",
            id: "pro_6month",
            href: "#", // Add Stripe checkout link here later
            price: "$49",
            billing: "/ 6-months",
            description: "For creators who need more power and fewer limits.",
            features: [
                "Unlimited AI Generations",
                "Access to Pro & Premium LLMs",
                "Advanced Image Alchemy settings",
                "Priority generation speed",
                "Early access to new features",
            ],
            icon: Sparkles,
            popular: true,
            ctaText: currentPlan === "pro_6month" ? "Current Plan" : "Upgrade to Pro",
            glowTheme: { hue: 0, saturation: 100, lightness: 56 } // Primary Red for popular
        },
        {
            name: "Pro Yearly",
            id: "pro_yearly",
            href: "#", // Add Stripe checkout link here later
            price: "$89",
            billing: "/ year",
            description: "Best value for serious prompt engineers.",
            features: [
                "Everything in Pro 6-Month",
                "Save 10% compared to 6-month plan",
                "Exclusive Yearly badges",
                "Dedicated VIP support",
            ],
            icon: Star,
            popular: false,
            ctaText: currentPlan === "pro_yearly" ? "Current Plan" : "Upgrade to Yearly",
            glowTheme: { hue: 282, saturation: 100, lightness: 57 } // Accent Purple for yearly
        },
    ];

    const glowItems = tiers.map((tier) => {
        const isCurrentPlan = currentPlan === tier.id;

        return {
            id: tier.id,
            theme: tier.glowTheme,
            element: (
                <motion.div
                    whileHover={{ y: -8, scale: 1.02 }}
                    animate={tier.popular ? { y: [-5, 5, -5] } : {}}
                    transition={
                        tier.popular
                            ? { duration: 4, repeat: Infinity, ease: "easeInOut" }
                            : { type: "spring", stiffness: 300, damping: 20 }
                    }
                    className={`relative flex flex-col p-8 rounded-2xl border transition-colors duration-300 hover:shadow-2xl hover:shadow-primary/10 ${tier.popular
                        ? "border-primary bg-primary/5 shadow-xl shadow-primary/5 md:-translate-y-4"
                        : "border-border bg-background/50 hover:border-primary/50"
                        }`}
                    style={{ backdropFilter: "blur(24px)" }}
                >
                    {tier.popular && (
                        <div className="absolute -top-4 left-1/2 -translate-x-1/2 z-10">
                            <span className="bg-primary text-primary-foreground text-xs font-bold font-display tracking-widest uppercase px-4 py-1.5 rounded-full shadow-lg pointer-events-none">
                                Most Popular
                            </span>
                        </div>
                    )}

                    <div className="mb-8 relative z-10 pointer-events-none">
                        <div className={`inline-flex p-3 rounded-xl mb-6 ${tier.popular ? 'bg-primary/20 text-primary' : 'bg-muted text-foreground'}`}>
                            <tier.icon size={24} />
                        </div>
                        <h2 className="text-2xl font-bold font-display mb-2">{tier.name}</h2>
                        <p className="text-muted-foreground text-sm h-10">{tier.description}</p>
                    </div>

                    <div className="mb-8 relative z-10 pointer-events-none">
                        <span className="text-5xl font-extrabold font-display tracking-tight">{tier.price}</span>
                        {tier.billing && <span className="text-muted-foreground font-mono ml-2">{tier.billing}</span>}
                    </div>

                    <ul className="space-y-4 mb-10 flex-1 relative z-10 pointer-events-auto">
                        {tier.features.map((feature, i) => (
                            <li key={i} className="group flex items-start gap-3 transition-colors duration-300">
                                <Check size={18} className="text-primary shrink-0 mt-0.5 transition-all duration-300 group-hover:drop-shadow-[0_0_8px_hsl(var(--primary))]" />
                                <span className="text-sm text-foreground/80 leading-snug transition-colors duration-300 group-hover:text-foreground">{feature}</span>
                            </li>
                        ))}
                    </ul>

                    <motion.div
                        className="mag-wrap relative z-20 pointer-events-auto mt-auto"
                        onMouseMove={handleMagMove}
                        onMouseLeave={handleMagLeave}
                        whileHover={!isCurrentPlan ? { scale: 1.03 } : {}}
                        whileTap={!isCurrentPlan ? { scale: 0.96 } : {}}
                    >
                        <Link
                            to={tier.href}
                            className={`btn-sweep cursor-none overflow-hidden relative w-full text-center py-4 px-6 rounded-lg font-bold font-display tracking-widest uppercase transition-colors duration-300 no-underline inline-block ${isCurrentPlan
                                ? "bg-muted text-muted-foreground cursor-default border border-border"
                                : tier.popular
                                    ? "bg-primary text-primary-foreground shadow-[0_0_20px_hsl(var(--primary)/0.3)] border border-transparent"
                                    : "bg-transparent text-foreground border border-primary"
                                }`}
                            style={tier.popular ? { clipPath: "polygon(12px 0%, 100% 0%, calc(100% - 12px) 100%, 0% 100%)" } : {}}
                            onClick={(e) => {
                                if (isCurrentPlan) e.preventDefault();
                            }}
                        >
                            <span className="relative z-10">{tier.ctaText}</span>
                        </Link>
                    </motion.div>
                </motion.div>
            )
        };
    });

    return (
        <>
            <ProgressBar />
            <Navbar />
            <div className="min-h-screen bg-background text-foreground pt-32 pb-24 px-6 md:px-12 relative overflow-hidden">
                {/* Background elements */}
                <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none">
                    <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/20 blur-[120px] rounded-full mix-blend-screen opacity-50" />
                    <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-primary/20 blur-[120px] rounded-full mix-blend-screen opacity-30" />
                </div>

                <div className="max-w-6xl mx-auto">
                    <div className="text-center mb-16">
                        <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-extrabold tracking-tight mb-6 glitch" data-text="PRICING PLANS">
                            PRICING PLANS
                        </h1>
                        <p className="text-muted-foreground text-lg md:text-xl max-w-2xl mx-auto font-mono">
                            Unleash the full potential of PromptForge Verse. No hidden fees.
                        </p>
                    </div>

                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                    >
                        <GlowHover
                            className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch pt-4"
                            items={glowItems}
                        />
                    </motion.div>
                </div>
            </div>
        </>
    );
};

export default Pricing;
