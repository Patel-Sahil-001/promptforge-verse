import categories from "@/categories";
import { usePromptStore } from "@/store/promptStore";

export default function CategorySelector() {
  const { selectedCategory, setCategory } = usePromptStore();

  return (
    <div className="flex flex-wrap gap-4 justify-center mb-12">
      {Object.entries(categories).map(([key, cat]) => (
        <button
          key={key}
          onClick={() => setCategory(key)}
          className={`relative overflow-hidden px-7 py-3 text-xs font-display font-bold tracking-[.12em] uppercase cursor-none border transition-all duration-300
            ${key === selectedCategory
              ? "text-primary-foreground border-primary"
              : "text-foreground/50 border-border hover:text-primary-foreground hover:border-primary"
            }`}
          style={{
            clipPath: "polygon(8px 0%, 100% 0%, calc(100% - 8px) 100%, 0% 100%)",
            background: key === selectedCategory ? "hsl(var(--primary))" : "hsl(var(--glass))",
          }}
        >
          <span className="relative z-10">{cat.icon} {cat.label}</span>
        </button>
      ))}
    </div>
  );
}
