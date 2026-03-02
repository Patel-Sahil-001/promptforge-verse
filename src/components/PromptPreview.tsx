import { useEffect } from "react";
import { toast } from "sonner";
import categories from "@/categories";
import { usePromptStore } from "@/store/promptStore";

export default function PromptPreview() {
  const { selectedCategory, formValues, generatedPrompt, setGeneratedPrompt } = usePromptStore();
  const cat = categories[selectedCategory];

  useEffect(() => {
    if (cat) {
      setGeneratedPrompt(cat.template(formValues));
    }
  }, [formValues, selectedCategory, cat, setGeneratedPrompt]);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(generatedPrompt);
    toast.success("Copied to clipboard!");
  };

  return (
    <div className="flex flex-col h-full">
      <div className="font-mono text-[.65rem] tracking-[.2em] text-foreground/35 uppercase mb-7 flex items-center gap-4">
        Live Preview
        <span className="flex-1 h-px bg-border" />
      </div>
      <div className="flex-1 bg-black/40 border border-border p-6 font-mono text-[.78rem] leading-[1.9] text-foreground/80 whitespace-pre-wrap break-words min-h-[200px]">
        {generatedPrompt || <span className="text-foreground/20 italic">Fill in the fields to generate your prompt...</span>}
      </div>
      <div className="flex gap-4 mt-6 flex-wrap">
        <button
          onClick={copyToClipboard}
          className="btn-sweep relative px-6 py-2.5 font-display text-[.68rem] font-bold tracking-[.15em] uppercase cursor-none overflow-hidden bg-primary text-primary-foreground transition-transform duration-300 hover:scale-[1.03]"
          style={{ clipPath: "polygon(10px 0%, 100% 0%, calc(100% - 10px) 100%, 0% 100%)" }}
        >
          Copy Prompt
        </button>
        <button
          className="btn-sweep relative px-6 py-2.5 font-display text-[.68rem] font-bold tracking-[.15em] uppercase cursor-none overflow-hidden bg-transparent text-foreground border border-border2 transition-transform duration-300 hover:scale-[1.03]"
          style={{ clipPath: "polygon(10px 0%, 100% 0%, calc(100% - 10px) 100%, 0% 100%)" }}
        >
          Score Prompt
        </button>
      </div>
      <div className="font-mono text-[.65rem] text-foreground/25 tracking-[.1em] mt-2">
        {generatedPrompt.length} characters
      </div>
    </div>
  );
}
