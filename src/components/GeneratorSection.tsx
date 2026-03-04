import { useScrollReveal } from "@/hooks/useScrollReveal";
import { usePromptStore } from "@/store/promptStore";
import CategorySelector from "./CategorySelector";
import DynamicForm from "./DynamicForm";
import PromptPreview from "./PromptPreview";
import PromptEnhancer from "./PromptEnhancer";

export default function GeneratorSection() {
  const { ref, isVisible } = useScrollReveal();
  const { selectedCategory } = usePromptStore();

  return (
    <section id="generator" className="relative z-[1] px-12 pt-20 pb-32">
      <div className="max-w-[1200px] mx-auto" ref={ref}>
        <div className="text-center mb-16">
          <span className={`font-mono text-[.68rem] tracking-[.25em] text-primary uppercase transition-all duration-700 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-5"}`}>
            // Prompt Builder
          </span>
          <h2
            className={`font-display font-extrabold leading-[.95] tracking-[-0.02em] mt-3 transition-all duration-800 delay-100 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-9"}`}
            style={{ fontSize: "clamp(2.2rem, 5vw, 4.5rem)" }}
          >
            Build Your Prompt
          </h2>
        </div>

        <CategorySelector />

        {selectedCategory === "llm" ? (
          <PromptEnhancer />
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-px bg-border min-h-[600px]">
            <div className="bg-background p-10">
              <DynamicForm />
            </div>
            <div className="bg-background p-10">
              <PromptPreview />
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
