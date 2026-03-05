import { Link } from "react-router-dom";
import React, { useCallback } from "react";

const NAV_LINKS = [
  { label: "Home", to: "/" },
  { label: "LLM Generator", to: "/generator?cat=llm" },
  { label: "Image Prompt", to: "/generator?cat=image" },
  { label: "Creative Studio", to: "/generator?cat=writing" },
];

export default function Navbar() {
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
    <nav
      className="fixed top-0 left-0 right-0 z-[1000] flex justify-between items-center px-12 py-5 backdrop-blur-2xl border-b border-border"
      style={{
        background: "rgba(2,4,8,0.8)",
        transform: "translateY(-100%)",
        animation: "navIn 1s 0.4s cubic-bezier(0.16,1,0.3,1) forwards",
      }}
    >
      <Link to="/" className="text-base font-extrabold tracking-[.2em] text-primary font-display glitch no-underline" data-text="PROMPT VERSE">PROMPT VERSE</Link>
      <ul className="flex gap-4 list-none">
        {NAV_LINKS.map((link) => (
          <li key={link.label}>
            <div className="mag-wrap" onMouseMove={handleMagMove} onMouseLeave={handleMagLeave}>
              <Link
                to={link.to}
                className="btn-sweep relative px-6 py-2.5 font-display text-[.68rem] font-bold tracking-[.15em] uppercase no-underline cursor-none overflow-hidden bg-transparent text-foreground border border-border2 inline-block transition-transform duration-300 hover:scale-[1.03] hover:text-primary hover:border-primary"
                style={{ clipPath: "polygon(8px 0%, 100% 0%, calc(100% - 8px) 100%, 0% 100%)" }}
              >
                {link.label}
              </Link>
            </div>
          </li>
        ))}
      </ul>
    </nav>
  );
}

