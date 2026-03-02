import CursorEffect from "@/components/CursorEffect";
import ProgressBar from "@/components/ProgressBar";
import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import MarqueeRow from "@/components/MarqueeRow";
import GeneratorSection from "@/components/GeneratorSection";
import ScoreSection from "@/components/ScoreSection";
import OptimizerSection from "@/components/OptimizerSection";
import ABTestSection from "@/components/ABTestSection";
import MarketplaceSection from "@/components/MarketplaceSection";
import FeaturesStrip from "@/components/FeaturesStrip";
import ParallaxText from "@/components/ParallaxText";

const Index = () => {
  return (
    <>
      <CursorEffect />
      <ProgressBar />
      <Navbar />
      <main>
        <HeroSection />
        <MarqueeRow />
        <GeneratorSection />
        <ParallaxText />
        <ScoreSection />
        <OptimizerSection />
        <ABTestSection />
        <MarketplaceSection />
        <FeaturesStrip />
        <ParallaxText />
      </main>
      <footer className="relative z-[1] border-t border-border py-12 px-12 text-center">
        <span className="font-mono text-[.65rem] tracking-[.2em] text-foreground/25 uppercase">
          PROMPT.LAB © 2025 — Built for prompt engineers
        </span>
      </footer>
    </>
  );
};

export default Index;
