import React from "react";
import { motion } from "framer-motion";
import { Check, Zap, Sparkles, Star } from "lucide-react";

import { useAuthStore } from "@/store/authStore";
import ProgressBar from "@/components/ProgressBar";
import Navbar from "@/components/Navbar";
import GlowHover from "@/components/GlowHover";
import { toast } from "sonner";
import { generateReceipt } from "@/lib/pdfUtils";
import { apiFetch } from "@/lib/api";

// ─── Razorpay types ───────────────────────────────────────────────────────────
interface RazorpayResponse {
    razorpay_payment_id: string;
    razorpay_order_id: string;
    razorpay_signature: string;
}

interface RazorpayOrderData {
    id: string;
    amount: number;
    currency: string;
    displayAmountINR?: number;
}

interface VerifyData {
    success: boolean;
    planId: string;
    planLabel: string;
    profile?: {
        plan: "free" | "pro_monthly" | "pro_yearly";
        plan_started_at: string | null;
        plan_expires_at: string | null;
    };
}

declare global {
    interface Window {
        Razorpay: new (options: Record<string, unknown>) => { open: () => void };
    }
}

const Pricing = () => {
    const { user, profile, fetchProfile, updateProfile } = useAuthStore();
    const currentPlan = profile?.plan || "free";
    const [isLoading, setIsLoading] = React.useState(false);
    const [currency, setCurrency] = React.useState('INR');
    const [rate, setRate] = React.useState(1);

    React.useEffect(() => {
        const fetchCurrencyAndRate = async () => {
            try {
                // Fetch local currency code
                const curRes = await fetch('https://ipapi.co/currency/');
                const cur = await curRes.text();
                
                // Fetch exchange rate from INR to other currencies
                const rateRes = await fetch('https://api.exchangerate-api.com/v4/latest/INR');
                const rateData = await rateRes.json();
                
                if (cur && cur.length === 3 && rateData.rates[cur]) {
                    setCurrency(cur);
                    setRate(rateData.rates[cur]);
                }
            } catch (e) {
                console.error("Failed to fetch currency/rate, defaulting to INR", e);
            }
        };
        fetchCurrencyAndRate();
    }, []);

    const loadScript = (src: string) => {
        return new Promise((resolve) => {
            const script = document.createElement("script");
            script.src = src;
            script.onload = () => {
                resolve(true);
            };
            script.onerror = () => {
                resolve(false);
            };
            document.body.appendChild(script);
        });
    };

    const handlePayment = async (planId: string, planName: string, basePrice: number) => {
        if (!user) {
            toast.error("Please sign in to upgrade your plan.");
            return;
        }

        const finalAmount = Number((basePrice * rate).toFixed(2));
        
        setIsLoading(true);
        const res = await loadScript("https://checkout.razorpay.com/v1/checkout.js");

        if (!res) {
            toast.error("Razorpay SDK failed to load. Are you online?");
            setIsLoading(false);
            return;
        }

        try {
            const orderData = await apiFetch<RazorpayOrderData>('/api/create-razorpay-order', {
                method: 'POST',
                body: JSON.stringify({ planId, currency: 'INR' }),
            });

            const options = {
                key: import.meta.env.VITE_RAZORPAY_KEY_ID, 
                amount: orderData.amount,
                currency: orderData.currency,
                name: "Prompt Forge Verse",
                description: `Upgrade to ${planId}`,
                order_id: orderData.id,
                handler: async (response: RazorpayResponse) => {
                    try {
                        const verifyData = await apiFetch<VerifyData>('/api/verify-razorpay-payment', {
                            method: 'POST',
                            body: JSON.stringify({
                                razorpay_payment_id: response.razorpay_payment_id,
                                razorpay_order_id: response.razorpay_order_id,
                                razorpay_signature: response.razorpay_signature,
                                planId,
                            })
                        });

                        // Instant state update using profile snapshot from server (no race condition)
                        if (verifyData.profile) {
                            updateProfile(verifyData.profile);
                            // Refresh credits so limits change to Infinity and PRO UI activates
                            useAuthStore.getState().refreshCredits();
                        }
                        // Background consistency re-fetch after 2 seconds
                        setTimeout(() => fetchProfile(user.id), 2000);

                        toast.success(`🎉 You're now on ${verifyData.planLabel || planName}!`, {
                            action: {
                                label: "Download Receipt",
                                onClick: () => generateReceipt({
                                    paymentId:   response.razorpay_payment_id,
                                    orderId:     response.razorpay_order_id,
                                    planLabel:   verifyData.planLabel || planName,
                                    amountINR:   orderData.displayAmountINR ?? finalAmount,
                                    email:       profile?.email || user.email || '',
                                    displayName: profile?.display_name || user.email || '',
                                    expiresAt:   verifyData.profile?.plan_expires_at || '',
                                }),
                            }
                        });
                    } catch (err: unknown) {
                        const msg = err instanceof Error ? err.message : 'Payment verification failed.';
                        toast.error(msg);
                    }
                },
                prefill: {
                    name: profile?.display_name || user.email || "User",
                    email: user.email || "",
                },
                theme: { color: "hsl(var(--primary))" },
            };

            const orderDataTyped = orderData as RazorpayOrderData;
            const paymentObject = new window.Razorpay({
                ...options,
                amount: orderDataTyped.amount,
                order_id: orderDataTyped.id,
            });
            paymentObject.open();
        } catch (error: unknown) {
            const msg = error instanceof Error ? error.message : 'Error starting checkout.';
            toast.error(msg);
        } finally {
            setIsLoading(false);
        }
    };

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
            price: new Intl.NumberFormat('en-US', { style: 'currency', currency: currency }).format(0),
            basePrice: 0,
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
            glowTheme: { hue: 0, saturation: 0, lightness: 80 } 
        },
        {
            name: "Pro Monthly",
            id: "pro_monthly",
            href: "#",
            price: new Intl.NumberFormat('en-US', { style: 'currency', currency: currency }).format(25 * rate),
            basePrice: 25,
            billing: "/ month",
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
            ctaText: currentPlan === "pro_monthly" ? "Current Plan" : "Upgrade to Pro",
            glowTheme: { hue: 0, saturation: 100, lightness: 56 } 
        },
        {
            name: "Pro Yearly",
            id: "pro_yearly",
            href: "#",
            price: new Intl.NumberFormat('en-US', { style: 'currency', currency: currency }).format(99 * rate),
            basePrice: 99,
            billing: "/ year",
            description: "Best value for serious prompt engineers.",
            features: [
                "Everything in Pro Monthly",
                "Save compared to monthly plan",
                "Exclusive Yearly badges",
                "Dedicated VIP support",
            ],
            icon: Star,
            popular: false,
            ctaText: currentPlan === "pro_yearly" ? "Current Plan" : "Upgrade to Yearly",
            glowTheme: { hue: 282, saturation: 100, lightness: 57 } 
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
                        <button
                            onClick={(e) => {
                                if (isCurrentPlan) {
                                    e.preventDefault();
                                    return;
                                }
                                if (tier.id === "free") {
                                    window.location.href = tier.href;
                                } else {
                                    handlePayment(tier.id, tier.name, tier.basePrice);
                                }
                            }}
                            disabled={isLoading}
                            className={`btn-sweep cursor-none overflow-hidden relative w-full text-center py-4 px-6 rounded-lg font-bold font-display tracking-widest uppercase transition-colors duration-300 no-underline inline-block ${isCurrentPlan
                                ? "bg-muted text-muted-foreground cursor-default border border-border"
                                : tier.popular
                                    ? "bg-primary text-primary-foreground shadow-[0_0_20px_hsl(var(--primary)/0.3)] border border-transparent"
                                    : "bg-transparent text-foreground border border-primary"
                                }`}
                            style={tier.popular ? { clipPath: "polygon(12px 0%, 100% 0%, calc(100% - 12px) 100%, 0% 100%)" } : {}}
                        >
                            <span className="relative z-10">{isLoading && !isCurrentPlan && tier.id !== "free" ? "Loading..." : tier.ctaText}</span>
                        </button>
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
