import categories from "@/categories";
import { usePromptStore } from "@/store/promptStore";
import React, { useCallback } from "react";

export default function CategorySelector() {
  const { selectedCategory, setCategory } = usePromptStore();

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

  return (
    <div className="flex flex-wrap gap-4 justify-center mb-12">
      {Object.entries(categories).map(([key, cat]) => (
        <div
          key={key}
          className="mag-wrap"
          onMouseMove={handleMagMove}
          onMouseLeave={handleMagLeave}
        >
          <button
            onClick={() => setCategory(key)}
            className={`btn-sweep relative overflow-hidden px-7 py-3 text-xs font-display font-bold tracking-[.12em] uppercase cursor-none border transition-all duration-300
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
        </div>
      ))}
    </div>
  );
}
