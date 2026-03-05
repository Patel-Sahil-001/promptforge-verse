import CursorEffect from "@/components/CursorEffect";
import ProgressBar from "@/components/ProgressBar";
import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";

import ParticleField from "@/components/ParticleField";

const Index = () => {
  return (
    <>
      <ParticleField />
      <CursorEffect />
      <ProgressBar />
      <Navbar />
      <main>
        <HeroSection />

      </main>
      <footer className="relative z-[1] border-t border-border py-12 px-12 text-center">
        <span className="font-mono text-[.65rem] tracking-[.2em] text-foreground/25 uppercase">
          PROMPT VERSE © 2025 — Built for prompt engineers
        </span>
      </footer>
    </>
  );
};

export default Index;
