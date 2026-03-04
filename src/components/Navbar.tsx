export default function Navbar() {
  return (
    <nav
      className="fixed top-0 left-0 right-0 z-[1000] flex justify-between items-center px-12 py-5 backdrop-blur-2xl border-b border-border"
      style={{
        background: "rgba(2,4,8,0.8)",
        transform: "translateY(-100%)",
        animation: "navIn 1s 0.4s cubic-bezier(0.16,1,0.3,1) forwards",
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
    </nav>
  );
}
