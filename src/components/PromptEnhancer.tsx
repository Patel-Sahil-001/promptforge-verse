import React, { useState, useCallback } from "react";
import { toast } from "sonner";
import { usePromptStore } from "@/store/promptStore";
import { enhancePrompt } from "@/services/geminiService";

export default function PromptEnhancer() {
    const {
        userPrompt,
        enhancedPrompt,
        isEnhancing,
        enhanceError,
        apiKey,
        setUserPrompt,
        setEnhancedPrompt,
        setIsEnhancing,
        setEnhanceError,
    } = usePromptStore();

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

    const handleEnhance = async () => {
        if (!apiKey) {
            setEnhanceError("API key not found. Please set VITE_GEMINI_API_KEY in your .env file.");
            return;
        }
        if (!userPrompt.trim()) {
            setEnhanceError("Please enter a prompt to enhance.");
            return;
        }

        setIsEnhancing(true);
        setEnhanceError("");
        setEnhancedPrompt("");

        try {
            const result = await enhancePrompt(userPrompt, apiKey);
            setEnhancedPrompt(result);
        } catch (err: unknown) {
            const message = err instanceof Error ? err.message : "Something went wrong. Please try again.";
            setEnhanceError(message);
        } finally {
            setIsEnhancing(false);
        }
    };

    const copyToClipboard = () => {
        navigator.clipboard.writeText(enhancedPrompt);
        toast.success("Copied to clipboard!");
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-px bg-border min-h-[600px]">
            {/* Left Panel — Input */}
            <div className="bg-background p-10 flex flex-col">
                <div className="font-mono text-[.65rem] tracking-[.2em] text-foreground/35 uppercase mb-7 flex items-center gap-4">
                    Your Prompt
                    <span className="flex-1 h-px bg-border" />
                </div>

                <textarea
                    className="field-textarea flex-1 min-h-[300px] text-sm leading-relaxed resize-none"
                    placeholder={"Describe what you want in simple terms...\n\nExample: I want to create a full stack website on e-commerce site"}
                    value={userPrompt}
                    onChange={(e) => setUserPrompt(e.target.value)}
                />

                {/* Enhance Button */}
                <div className="mag-wrap mt-6 w-full" onMouseMove={handleMagMove} onMouseLeave={handleMagLeave}>
                    <button
                        onClick={handleEnhance}
                        disabled={isEnhancing}
                        className="btn-sweep relative px-8 py-3.5 font-display text-[.72rem] font-bold tracking-[.15em] uppercase cursor-none overflow-hidden bg-primary text-primary-foreground transition-all duration-300 hover:scale-[1.03] disabled:opacity-50 disabled:hover:scale-100 w-full"
                        style={{ clipPath: "polygon(10px 0%, 100% 0%, calc(100% - 10px) 100%, 0% 100%)" }}
                    >
                        {isEnhancing ? (
                            <span className="flex items-center justify-center gap-2">
                                <span className="inline-block w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                                Enhancing...
                            </span>
                        ) : (
                            "✨ Enhance Prompt"
                        )}
                    </button>
                </div>

                {enhanceError && (
                    <div className="mt-4 p-3 bg-red-500/10 border border-red-500/30 font-mono text-[.7rem] text-red-400">
                        {enhanceError}
                    </div>
                )}
            </div>

            {/* Right Panel — Enhanced Output */}
            <div className="bg-background p-10 flex flex-col">
                <div className="font-mono text-[.65rem] tracking-[.2em] text-foreground/35 uppercase mb-7 flex items-center gap-4">
                    Enhanced Prompt
                    <span className="flex-1 h-px bg-border" />
                    {enhancedPrompt && !isEnhancing && (
                        <button
                            onClick={copyToClipboard}
                            className="text-foreground/40 hover:text-primary transition-colors duration-200 font-mono text-[.65rem] tracking-[.1em] uppercase flex items-center gap-1.5"
                        >
                            📋 Copy
                        </button>
                    )}
                </div>

                <div className="flex-1 bg-black/40 border border-border p-6 font-mono text-[.78rem] leading-[1.9] text-foreground/80 whitespace-pre-wrap break-words min-h-[300px] overflow-y-auto">
                    {isEnhancing ? (
                        <div className="space-y-3 animate-pulse">
                            {[...Array(8)].map((_, i) => (
                                <div
                                    key={i}
                                    className="h-3 bg-foreground/5 rounded"
                                    style={{ width: `${70 + Math.random() * 30}%` }}
                                />
                            ))}
                        </div>
                    ) : enhancedPrompt ? (
                        enhancedPrompt
                    ) : (
                        <span className="text-foreground/20 italic">
                            Enter your prompt idea and click "Enhance" to generate a detailed, AI-powered prompt...
                        </span>
                    )}
                </div>

                {/* Copy Button */}
                {enhancedPrompt && !isEnhancing && (
                    <div className="flex gap-4 mt-6 items-center">
                        <div className="mag-wrap" onMouseMove={handleMagMove} onMouseLeave={handleMagLeave}>
                            <button
                                onClick={copyToClipboard}
                                className="btn-sweep relative px-6 py-2.5 font-display text-[.68rem] font-bold tracking-[.15em] uppercase cursor-none overflow-hidden bg-primary text-primary-foreground transition-transform duration-300 hover:scale-[1.03]"
                                style={{ clipPath: "polygon(10px 0%, 100% 0%, calc(100% - 10px) 100%, 0% 100%)" }}
                            >
                                📋 Copy Prompt
                            </button>
                        </div>
                        <div className="mag-wrap" onMouseMove={handleMagMove} onMouseLeave={handleMagLeave}>
                            <button
                                onClick={handleEnhance}
                                className="btn-sweep relative px-6 py-2.5 font-display text-[.68rem] font-bold tracking-[.15em] uppercase cursor-none overflow-hidden bg-transparent text-foreground border border-border2 transition-transform duration-300 hover:scale-[1.03]"
                                style={{ clipPath: "polygon(10px 0%, 100% 0%, calc(100% - 10px) 100%, 0% 100%)" }}
                            >
                                ↻ Re-Enhance
                            </button>
                        </div>
                        <span className="font-mono text-[.65rem] text-foreground/25 tracking-[.1em] ml-auto">
                            {enhancedPrompt.length} chars
                        </span>
                    </div>
                )}
            </div>
        </div>
    );
}
