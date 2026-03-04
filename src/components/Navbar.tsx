import { useState, useEffect, useCallback } from "react";

export default function Navbar() {
  const [isLight, setIsLight] = useState(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("theme") === "light";
    }
    return false;
  });

  useEffect(() => {
    const root = document.documentElement;
    if (isLight) {
      root.classList.add("light");
      localStorage.setItem("theme", "light");
    } else {
      root.classList.remove("light");
      localStorage.setItem("theme", "dark");
    }
  }, [isLight]);

  const toggleTheme = useCallback(() => {
    setIsLight((prev) => !prev);
  }, []);

  return (
    <nav
      className="fixed top-0 left-0 right-0 z-[1000] flex justify-between items-center px-12 py-5 backdrop-blur-2xl border-b border-border"
      style={{
        background: isLight ? "rgba(245,246,250,0.85)" : "rgba(2,4,8,0.8)",
        transform: "translateY(-100%)",
        animation: "navIn 1s 0.4s cubic-bezier(0.16,1,0.3,1) forwards",
        transition: "background 0.4s ease",
      }}
    >
      <span className="text-base font-extrabold tracking-[.2em] text-primary font-display glitch" data-text="PROMPT.LAB">PROMPT.LAB</span>
      <ul className="flex gap-8 list-none">
        {["Generator", "Score", "Optimizer", "A/B Test", "Marketplace"].map((link) => (
          <li key={link}>
            <a
              href={`#${link.toLowerCase().replace(/[^a-z]/g, "")}`}
              className="text-foreground/55 no-underline text-xs tracking-[.1em] uppercase font-mono relative
                after:content-[''] after:absolute after:bottom-[-4px] after:left-0 after:w-0 after:h-px after:bg-primary after:transition-all after:duration-300
                hover:text-primary hover:after:w-full"
            >
              {link}
            </a>
          </li>
        ))}
      </ul>
      <button
        onClick={toggleTheme}
        className="flex items-center gap-2 px-3 py-1.5 border border-border text-foreground/60 font-mono text-[.65rem] tracking-[.1em] uppercase cursor-none transition-all duration-300 hover:border-primary hover:text-primary"
        style={{
          clipPath: "polygon(6px 0%, 100% 0%, calc(100% - 6px) 100%, 0% 100%)",
          background: "hsl(var(--glass))",
        }}
        title={isLight ? "Switch to dark mode" : "Switch to light mode"}
      >
        <span className="text-sm">{isLight ? "🌙" : "☀️"}</span>
        {isLight ? "DARK" : "LIGHT"}
      </button>
    </nav>
  );
}
