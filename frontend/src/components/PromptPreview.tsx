import React, { useEffect, useCallback } from "react";
import { toast } from "sonner";
import categories from "@/categories";
import { usePromptStore } from "@/store/promptStore";
import { useAuthStore } from "@/store/authStore";
import { enhancePrompt } from "@/services/aiService";
import { useNavigate } from "react-router-dom";

export default function PromptPreview() {
  const {
    selectedCategory,
    formValues,
    generatedPrompt,
    setGeneratedPrompt,
    enhancedPrompt,
    setEnhancedPrompt,
    isEnhancing,
    setIsEnhancing,
    enhanceError,
    setEnhanceError,
    resetForm
  } = usePromptStore();
  const { credits, deductLocalCredit } = useAuthStore();
  const navigate = useNavigate();
  const cat = categories[selectedCategory];

  useEffect(() => {
    if (cat) {
      setGeneratedPrompt(cat.template(formValues));
      // Clear AI enhanced version if user edits the form
      if (enhancedPrompt && !isEnhancing) {
        setEnhancedPrompt("");
      }
    }
  }, [formValues, selectedCategory, cat, setGeneratedPrompt, enhancedPrompt, isEnhancing, setEnhancedPrompt]);

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

  const copyToClipboard = () => {
    navigator.clipboard.writeText(enhancedPrompt || generatedPrompt);
    toast.success("Copied to clipboard!");
  };

  const handleEnhance = async (isRegeneration = false) => {
    if (!generatedPrompt.trim()) {
      setEnhanceError("Please fill in some fields to generate a prompt first.");
      return;
    }

    setIsEnhancing(true);
    setEnhanceError("");
    if (!isRegeneration) setEnhancedPrompt("");

    try {
      const result = await enhancePrompt(generatedPrompt, isRegeneration);
      setEnhancedPrompt(result);
      deductLocalCredit();
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Something went wrong. Please try again.";
      if (message.includes("free credits")) {
        toast.error("Limit Reached", { description: message });
        navigate("/pricing");
      }
      setEnhanceError(message);
    } finally {
      setIsEnhancing(false);
    }
  };

  return (
    <div className="flex flex-col h-full">
      <div className="font-mono text-[.65rem] tracking-[.2em] text-foreground/35 uppercase mb-7 flex items-center gap-4">
        Live Preview
        <span className="flex-1 h-px bg-border" />
      </div>
      <div className="flex-1 bg-black/40 border border-border p-6 font-mono text-[.78rem] leading-[1.9] text-foreground/80 whitespace-pre-wrap break-words min-h-[200px]">
        {isEnhancing ? (
          <div className="space-y-3 animate-pulse">
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className="h-3 bg-foreground/5 rounded"
                style={{ width: `${70 + Math.random() * 30}%` }}
              />
            ))}
          </div>
        ) : enhancedPrompt ? (
          enhancedPrompt
        ) : generatedPrompt ? (
          generatedPrompt
        ) : (
          <span className="text-foreground/20 italic">Fill in the fields to generate your prompt...</span>
        )}
      </div>

      {enhanceError && (
        <div className="mt-4 p-3 bg-red-500/10 border border-red-500/30 font-mono text-[.7rem] text-red-400">
          {enhanceError}
        </div>
      )}
      <div className="flex gap-4 mt-6 flex-wrap">
        <div className="mag-wrap" onMouseMove={handleMagMove} onMouseLeave={handleMagLeave}>
          <button
            onClick={copyToClipboard}
            disabled={isEnhancing}
            className="btn-sweep relative px-6 py-2.5 font-display text-[.68rem] font-bold tracking-[.15em] uppercase cursor-none overflow-hidden bg-primary text-primary-foreground transition-transform duration-300 hover:scale-[1.03] disabled:opacity-50"
            style={{ clipPath: "polygon(10px 0%, 100% 0%, calc(100% - 10px) 100%, 0% 100%)" }}
          >
            Copy Prompt
          </button>
        </div>

        {!enhancedPrompt ? (
          <div className="mag-wrap" onMouseMove={handleMagMove} onMouseLeave={handleMagLeave}>
            <button
              onClick={() => handleEnhance(false)}
              disabled={isEnhancing || !generatedPrompt.trim() || Boolean(credits && credits.limit !== Infinity && credits.remaining === 0)}
              className="btn-sweep relative px-6 py-2.5 font-display text-[.68rem] font-bold tracking-[.15em] uppercase cursor-none overflow-hidden bg-transparent text-foreground border border-border2 transition-transform duration-300 hover:scale-[1.03] hover:text-primary hover:border-primary disabled:opacity-50"
              style={{ clipPath: "polygon(10px 0%, 100% 0%, calc(100% - 10px) 100%, 0% 100%)" }}
            >
              ✨ AI Enhance
            </button>
          </div>
        ) : (
          <div className="mag-wrap" onMouseMove={handleMagMove} onMouseLeave={handleMagLeave}>
            <button
              onClick={() => handleEnhance(true)}
              disabled={isEnhancing || Boolean(credits && credits.limit !== Infinity && credits.remaining === 0)}
              className="btn-sweep relative px-6 py-2.5 font-display text-[.68rem] font-bold tracking-[.15em] uppercase cursor-none overflow-hidden bg-transparent text-foreground border border-border2 transition-transform duration-300 hover:scale-[1.03]"
              style={{ clipPath: "polygon(10px 0%, 100% 0%, calc(100% - 10px) 100%, 0% 100%)" }}
            >
              ↻ Regenerate Better
            </button>
          </div>
        )}

        <div className="mag-wrap" onMouseMove={handleMagMove} onMouseLeave={handleMagLeave}>
          <button
            onClick={() => {
              resetForm();
              setEnhancedPrompt("");
              setEnhanceError("");
            }}
            disabled={isEnhancing}
            className="btn-sweep relative px-6 py-2.5 font-display text-[.68rem] font-bold tracking-[.15em] uppercase cursor-none overflow-hidden bg-transparent text-foreground border border-border2 transition-transform duration-300 hover:scale-[1.03] hover:text-red-400 hover:border-red-400/50 disabled:opacity-50"
            style={{ clipPath: "polygon(10px 0%, 100% 0%, calc(100% - 10px) 100%, 0% 100%)" }}
          >
            ✕ Clear Form
          </button>
        </div>
      </div>
      <div className="font-mono text-[.65rem] text-foreground/25 tracking-[.1em] mt-2">
        {(enhancedPrompt || generatedPrompt).length} characters
      </div>
    </div>
  );
}
