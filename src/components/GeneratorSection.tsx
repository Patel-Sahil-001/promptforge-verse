import { useScrollReveal } from "@/hooks/useScrollReveal";
import { usePromptStore } from "@/store/promptStore";
import categories from "@/categories";

import DynamicForm from "./DynamicForm";
import PromptPreview from "./PromptPreview";
import PromptEnhancer from "./PromptEnhancer";
import CreativeStudio from "./CreativeStudio";
import ImageToPrompt from "./ImageToPrompt";

export default function GeneratorSection() {
  const { ref, isVisible } = useScrollReveal();
  const { selectedCategory } = usePromptStore();

  return (
    <section id="generator" className="relative z-[1] px-4 md:px-12 pt-16 md:pt-20 pb-20 md:pb-32">
      <div className="max-w-[1200px] mx-auto" ref={ref}>
        <div className="text-center mb-16">
          <span className={`font-mono text-[.68rem] tracking-[.25em] text-primary uppercase transition-all duration-700 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-5"}`}>
            // Prompt Builder
          </span>
          <h2
            className={`font-display font-extrabold leading-[.95] tracking-[-0.02em] mt-3 grad-animated transition-all duration-800 delay-100 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-9"}`}
            style={{ fontSize: "clamp(2.2rem, 5vw, 4.5rem)" }}
          >
            Build Your {categories[selectedCategory]?.label || ""} Prompt
          </h2>
        </div>



        {selectedCategory === "llm" ? (
          <PromptEnhancer />
        ) : selectedCategory === "writing" ? (
          <CreativeStudio />
        ) : selectedCategory === "image" ? (
          <ImageToPrompt />
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-px bg-border min-h-[600px]">
            <div className="bg-background p-6 md:p-10">
              <DynamicForm />
            </div>
            <div className="bg-background p-6 md:p-10">
              <PromptPreview />
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
