import CursorEffect from "@/components/CursorEffect";
import ProgressBar from "@/components/ProgressBar";
import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import ParticleField from "@/components/ParticleField";

// New Landing Page Sections
import FeaturesSection from "@/components/landing/FeaturesSection";
import DemoSection from "@/components/landing/DemoSection";
import HowItWorksSection from "@/components/landing/HowItWorksSection";
import TemplatesSection from "@/components/landing/TemplatesSection";
import TestimonialsSection from "@/components/landing/TestimonialsSection";
import StatsSection from "@/components/landing/StatsSection";

const Index = () => {
  return (
    <>
      <ParticleField />
      <div className="grid-lines scanlines"></div>
      <div className="orb orb-red-topleft"></div>
      <div className="orb orb-blue-bottomleft"></div>
      <CursorEffect />
      <ProgressBar />
      <Navbar />
      <main>
        <HeroSection />
        <FeaturesSection />
        <DemoSection />
        <HowItWorksSection />
        <TemplatesSection />
        <TestimonialsSection />
        <StatsSection />
      </main>
      <footer className="relative z-[1] border-t border-border py-12 px-12 text-center bg-background">
        <span className="font-mono text-[.65rem] tracking-[.2em] text-foreground/25 uppercase">
          PROMPT VERSE © 2026 — Built for prompt engineers
        </span>
      </footer>
    </>
  );
};

export default Index;
