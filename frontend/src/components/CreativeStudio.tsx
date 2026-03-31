import React, { useState, useCallback } from "react";
import { toast } from "sonner";
import { Sparkles, Mail, FileText, BookOpen, AlignLeft } from "lucide-react";
import { enhancePrompt } from "@/services/aiService";
import { useAuthStore } from "@/store/authStore";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { IMPROVE_PROMPT, EMAIL_PROMPT, LETTER_PROMPT, STORY_PROMPT, SUMMARY_PROMPT } from "@/lib/creativePrompts";

const MODES = [
    { id: "improve", label: "Improve", icon: Sparkles },
    { id: "email", label: "Email", icon: Mail },
    { id: "letter", label: "Letter", icon: FileText },
    { id: "story", label: "Story", icon: BookOpen },
    { id: "summary", label: "Summary", icon: AlignLeft },
];

const TONES = [
    "Professional",
    "Casual",
    "Friendly",
    "Enthusiastic",
    "Persuasive",
    "Empathetic",
    "Academic",
];

export default function CreativeStudio() {
    const [mode, setMode] = useState("improve");
    const [text, setText] = useState("");
    const [tone, setTone] = useState("Professional");
    const [audience, setAudience] = useState("");

    const [output, setOutput] = useState("");
    const [isGenerating, setIsGenerating] = useState(false);
    const [error, setError] = useState("");

    const { credits, deductLocalCredit } = useAuthStore();
    const navigate = useNavigate();

    const handleMagMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
        const w = e.currentTarget;
        const r = w.getBoundingClientRect();
        const cx = r.left + r.width / 2;
        const cy = r.top + r.height / 2;
        w.style.transform = `translate(${(e.clientX - cx) * 0.3}px, ${(e.clientY - cy) * 0.3}px)`;
    }, []);

    const handleMagLeave = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
        e.currentTarget.style.transform = "";
    }, []);

    const handleGenerate = async () => {
        if (!text.trim()) {
            setError("Please enter some text or an idea first.");
            return;
        }

        setIsGenerating(true);
        setError("");
        setOutput("");

        const modePrompts: Record<string, () => string> = {
            improve: () => IMPROVE_PROMPT(tone, audience, text),
            email:   () => EMAIL_PROMPT(tone, audience, text),
            letter:  () => LETTER_PROMPT(tone, audience, text),
            story:   () => STORY_PROMPT(tone, audience, text),
            summary: () => SUMMARY_PROMPT(tone, audience, text),
        };

        const instructions = modePrompts[mode]?.() ?? IMPROVE_PROMPT(tone, audience, text);

        try {
            const result = await enhancePrompt(instructions);
            setOutput(result);
            deductLocalCredit();
        } catch (err: unknown) {
            const message = err instanceof Error ? err.message : "Something went wrong.";
            if (message.includes("free credits")) {
                toast.error("Limit Reached", { description: message });
                navigate("/pricing");
            }
            setError(message);
        } finally {
            setIsGenerating(false);
        }
    };

    const copyToClipboard = () => {
        if (!output) return;
        navigator.clipboard.writeText(output);
        toast.success("Copied to clipboard!");
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 bg-transparent items-start lg:min-h-[700px]"
        >
            {/* Left Panel - Input */}
            <div className="bg-background/40 p-5 md:p-10 flex flex-col gap-6 relative lg:sticky lg:top-[100px]">
                <div className="font-mono text-[.65rem] tracking-[.2em] text-foreground/35 uppercase mb-2 flex items-center gap-4">
                    Writing Mode
                    <span className="flex-1 h-px bg-border" />
                </div>

                {/* Mode Selector */}
                <div className="flex flex-wrap sm:flex-nowrap gap-2">
                    {MODES.map((m) => {
                        const Icon = m.icon;
                        const isActive = mode === m.id;
                        return (
                            <button
                                key={m.id}
                                onClick={() => setMode(m.id)}
                                className={`flex-[1_1_30%] sm:flex-1 flex flex-col items-center justify-center py-3 md:py-4 gap-1.5 md:gap-2 transition-all border
                  ${isActive ? "bg-primary/10 border-primary text-primary" : "bg-transparent border-border2 text-foreground/50 hover:text-foreground hover:bg-white/5"}
                `}
                            >
                                <Icon size={18} className={isActive ? "text-primary" : ""} />
                                <span className="text-[.65rem] font-bold tracking-[.05em] uppercase">{m.label}</span>
                            </button>
                        );
                    })}
                </div>

                <div className="flex flex-col gap-2">
                    <label className="font-mono text-[.68rem] tracking-[.12em] text-foreground/50 uppercase block">Your text (rough draft, notes, or idea)</label>
                    <div className="relative group">
                        <textarea
                            className="field-textarea w-full h-[160px] md:h-[220px] resize-none"
                            placeholder="Paste your text here, or describe what you want to write..."
                            value={text}
                            onChange={(e) => setText(e.target.value)}
                        />
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex flex-col gap-2">
                        <label className="font-mono text-[.68rem] tracking-[.12em] text-foreground/50 uppercase block">Tone</label>
                        <select
                            value={tone}
                            onChange={(e) => setTone(e.target.value)}
                            className="field-select"
                        >
                            {TONES.map(t => <option key={t} value={t}>{t}</option>)}
                        </select>
                    </div>
                    <div className="flex flex-col gap-2">
                        <label className="font-mono text-[.68rem] tracking-[.12em] text-foreground/50 uppercase block">Target Audience</label>
                        <input
                            type="text"
                            value={audience}
                            onChange={(e) => setAudience(e.target.value)}
                            placeholder="e.g. Business executives"
                            className="field-input"
                        />
                    </div>
                </div>

                {error && (
                    <div className="p-3 bg-red-500/10 border border-red-500/30 font-mono text-[.7rem] text-red-400 rounded-lg">
                        {error}
                    </div>
                )}

                <div className="pt-2 md:pt-4 mag-wrap w-full" onMouseMove={handleMagMove} onMouseLeave={handleMagLeave}>
                    <button
                        onClick={handleGenerate}
                        disabled={isGenerating || Boolean(credits && credits.limit !== Infinity && credits.remaining === 0)}
                        className="btn-sweep relative px-8 py-3.5 font-display text-[.72rem] font-bold tracking-[.15em] uppercase cursor-none overflow-hidden bg-primary text-primary-foreground transition-all duration-300 hover:scale-[1.03] disabled:opacity-50 disabled:hover:scale-100 w-full"
                        style={{ clipPath: "polygon(10px 0%, 100% 0%, calc(100% - 10px) 100%, 0% 100%)" }}
                    >
                        {isGenerating ? (
                            <span className="flex items-center justify-center gap-2">
                                <span className="inline-block w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                                Generating...
                            </span>
                        ) : (
                            "✨ Generate"
                        )}
                    </button>
                </div>
            </div>

            {/* Right Panel - Output */}
            <div className="bg-background/40 p-5 md:p-10 flex flex-col lg:min-h-[700px]">
                <div className="font-mono text-[.65rem] tracking-[.2em] text-foreground/35 uppercase mb-7 flex items-center justify-between gap-4">
                    <span className="flex items-center gap-4 flex-1">
                        Generated Output
                        <span className="flex-1 h-px bg-border" />
                    </span>
                    {output && !isGenerating && (
                        <button
                            onClick={copyToClipboard}
                            className="text-foreground/40 hover:text-primary transition-colors duration-200 font-mono text-[.65rem] tracking-[.1em] uppercase flex items-center gap-1.5"
                        >
                            📋 Copy
                        </button>
                    )}
                </div>

                <div className="flex-1 bg-black/40 border-l border-primary/20 p-6 font-mono text-[.78rem] leading-[1.9] text-foreground/80 whitespace-pre-wrap break-words min-h-[300px] overflow-y-auto mb-8">
                    {isGenerating ? (
                        <div className="space-y-3 animate-pulse">
                            {[...Array(6)].map((_, i) => (
                                <div
                                    key={i}
                                    className="h-3 bg-foreground/5 rounded"
                                    style={{ width: `${70 + Math.random() * 30}%` }}
                                />
                            ))}
                        </div>
                    ) : output ? (
                        output
                    ) : (
                        <span className="text-foreground/20 italic">
                            Select a mode and generate to see your writing here...
                        </span>
                    )}
                </div>

                {/* Tips Card */}
                <div className="bg-black/20 p-6 mt-auto">
                    <div className="font-mono text-[.65rem] tracking-[.2em] text-foreground/35 uppercase mb-4 flex items-center gap-4">
                        Writing Tips
                        <span className="flex-1 h-px bg-border" />
                    </div>

                    <div className="flex flex-col gap-3 font-mono text-[.7rem] text-foreground/60 leading-relaxed">
                        <div className="flex items-start gap-3">
                            <span className="text-primary mt-0.5">01</span>
                            <p>Include the context or relationship for more personalized output.</p>
                        </div>
                        <div className="flex items-start gap-3">
                            <span className="text-primary mt-0.5">02</span>
                            <p>For emails, mention the goal (inform, request, apologize, etc.).</p>
                        </div>
                        <div className="flex items-start gap-3">
                            <span className="text-primary mt-0.5">03</span>
                            <p>For stories, give your characters names and a setting to start.</p>
                        </div>
                    </div>
                </div>
            </div>
        </motion.div>
    );
}
