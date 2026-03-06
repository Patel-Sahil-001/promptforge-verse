import { Link, useLocation } from "react-router-dom";
import React, { useCallback, useState } from "react";
import { Menu, X } from "lucide-react";

const NAV_LINKS = [
  { label: "Home", to: "/" },
  { label: "LLM Generator", to: "/generator?cat=llm" },
  { label: "Image Prompt", to: "/generator?cat=image" },
  { label: "Creative Studio", to: "/generator?cat=writing" },
];

export default function Navbar() {
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

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
      <ul className="hidden md:flex gap-4 list-none">
        {NAV_LINKS.map((link) => {
          const isActive = location.pathname === link.to.split('?')[0] &&
            (link.to.includes('?') ? location.search === `?${link.to.split('?')[1]}` : true);

          return (
            <li key={link.label}>
              <div className="mag-wrap" onMouseMove={handleMagMove} onMouseLeave={handleMagLeave}>
                <Link
                  to={link.to}
                  className={`btn-sweep relative px-6 py-2.5 font-display text-[.68rem] font-bold tracking-[.15em] uppercase no-underline cursor-none overflow-hidden inline-block transition-transform duration-300 hover:scale-[1.03] hover:text-primary hover:border-primary border
                  ${isActive ? "bg-primary/20 text-primary border-primary" : "bg-transparent text-foreground border-border2"}
                  `}
                  style={{ clipPath: "polygon(8px 0%, 100% 0%, calc(100% - 8px) 100%, 0% 100%)" }}
                >
                  {link.label}
                </Link>
              </div>
            </li>
          );
        })}
      </ul>

      {/* Mobile Menu Toggle */}
      <button
        className="md:hidden p-2 text-foreground focus:outline-none"
        onClick={() => setIsMenuOpen(!isMenuOpen)}
        aria-label="Toggle Navigation"
      >
        {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Mobile Menu Dropdown */}
      {isMenuOpen && (
        <div className="absolute top-[100%] left-0 w-full bg-background/95 backdrop-blur-3xl border-b border-border py-4 px-8 md:hidden flex flex-col gap-4 shadow-2xl">
          {NAV_LINKS.map((link) => {
            const isActive = location.pathname === link.to.split('?')[0] &&
              (link.to.includes('?') ? location.search === `?${link.to.split('?')[1]}` : true);

            return (
              <Link
                key={link.label}
                to={link.to}
                onClick={() => setIsMenuOpen(false)}
                className={`py-3 px-4 font-display text-sm tracking-wider uppercase border-l-2 text-left w-full
                 ${isActive ? "border-primary text-primary bg-primary/10" : "border-transparent text-foreground/80 hover:bg-white/5"}
               `}
              >
                {link.label}
              </Link>
            );
          })}
        </div>
      )}
    </nav>
  );
}

