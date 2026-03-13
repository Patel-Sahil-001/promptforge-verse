import React, { useState, useCallback } from "react";
import { toast } from "sonner";
import { Sparkles, Mail, FileText, BookOpen, AlignLeft, PenLine, Copy } from "lucide-react";
import { enhancePrompt } from "@/services/aiService";
import { useAuthStore } from "@/store/authStore";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

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

        let promptSystem = `You are an expert creative writing assistant. `;
        if (mode === "improve") {
            promptSystem += `Your task is to significantly improve the grammar, structure, flow, and vocabulary of the provided text while preserving its original meaning.
Key Directives:
1. Fix any grammatical or spelling errors.
2. Enhance word choice to be more precise and impactful.
3. Improve sentence variety and pacing.
4. Ensure the text flows logically and beautifully.`;
        } else if (mode === "email") {
            promptSystem += `Your task is to draft a highly effective, clear, and professional email based on the provided notes.
Key Directives:
1. Include a strong, concise Subject Line at the top.
2. Use an appropriate greeting and sign-off.
3. Get straight to the point while maintaining the requested tone.
4. Use formatting (bullet points, short paragraphs) for readability.`;
        } else if (mode === "letter") {
            promptSystem += `Your task is to write a well-structured, elegant letter based on the provided notes.
Key Directives:
1. Structure with standard letter conventions (greeting, body paragraphs, closing).
2. Ensure rhythmic and deliberate pacing.
3. Adapt the vocabulary depth to match the requested tone perfectly.`;
        } else if (mode === "story") {
            promptSystem += `Your task is to write a compelling, vivid, and highly engaging story based on the provided idea.
Key Directives:
1. Focus on "show, don't tell". Use rich sensory details.
2. Develop a clear narrative arc.
3. Use character action and dialogue to drive the plot forward.
4. Maintain a consistent mood and atmosphere throughout.`;
        } else if (mode === "summary") {
            promptSystem += `Your task is to distill and summarize the provided text accurately and concisely.
Key Directives:
1. Identify and highlight the core message or thesis.
2. Extract the most critical supporting points.
3. Eliminate redundant examples or filler text.
4. Present the summary clearly (e.g., a brief overview followed by key bullet points).`;
        }

        const instructions = `${promptSystem}
Tone: ${tone}
Target Audience: ${audience || "General audience"}

Only return the final generated content. Do not include any meta-commentary, introductory text, or markdown code fences around the output.

Notes/Text:
"${text}"`;

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
            className="grid grid-cols-1 lg:grid-cols-2 gap-12 bg-transparent items-start min-h-[700px]"
        >
            {/* Left Panel - Input */}
            <div className="bg-background/40 p-6 md:p-10 flex flex-col gap-6 relative lg:sticky lg:top-[100px]">
                <div className="font-mono text-[.65rem] tracking-[.2em] text-foreground/35 uppercase mb-2 flex items-center gap-4">
                    Writing Mode
                    <span className="flex-1 h-px bg-border" />
                </div>

                {/* Mode Selector */}
                <div className="flex gap-2">
                    {MODES.map((m) => {
                        const Icon = m.icon;
                        const isActive = mode === m.id;
                        return (
                            <button
                                key={m.id}
                                onClick={() => setMode(m.id)}
                                className={`flex-1 flex flex-col items-center justify-center py-4 gap-2 transition-all border
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
                            className="field-textarea w-full h-[220px] resize-none"
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

                <div className="pt-4 mag-wrap w-full" onMouseMove={handleMagMove} onMouseLeave={handleMagLeave}>
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
            <div className="bg-background/40 p-6 md:p-10 flex flex-col min-h-[700px]">
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
