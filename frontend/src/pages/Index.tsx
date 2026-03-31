import ProgressBar from "@/components/ProgressBar";
import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import { lazy, Suspense } from "react";

const ParticleField = lazy(() => import("@/components/ParticleField"));

// New Landing Page Sections
import FeaturesSection from "@/components/landing/FeaturesSection";
import DemoSection from "@/components/landing/DemoSection";
import HowItWorksSection from "@/components/landing/HowItWorksSection";
import TemplatesSection from "@/components/landing/TemplatesSection";
import TestimonialsSection from "@/components/landing/TestimonialsSection";
import StatsSection from "@/components/landing/StatsSection";

const CanvasFallback = () => (
    <div 
        className="absolute inset-0 z-[-1]"
        style={{
            background: "radial-gradient(circle at 10% 10%, rgba(255,30,30,0.12) 0%, transparent 40%), radial-gradient(circle at 90% 90%, rgba(61,110,255,0.12) 0%, transparent 40%), #0F1014",
        }}
    />
);

const Index = () => {
  return (
    <>
      <Suspense fallback={<CanvasFallback />}>
          <ParticleField />
      </Suspense>
      <div className="grid-lines scanlines"></div>
      <div className="orb orb-red-topleft"></div>
      <div className="orb orb-blue-bottomleft"></div>
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
          PROMPT FORGE VERSE © 2026 — Built for prompt engineers
        </span>
      </footer>
    </>
  );
};

export default Index;
