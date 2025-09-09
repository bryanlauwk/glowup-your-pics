import { HeroSection } from "@/components/HeroSection";
import { BeforeAfterCarousel } from "@/components/BeforeAfterCarousel";
import { CheatAppsSection } from "@/components/CheatAppsSection";
import { UploadSection } from "@/components/UploadSection";
import { EnhancementSection } from "@/components/EnhancementSection";
import { PreviewSection } from "@/components/PreviewSection";
import { FloatingNav } from "@/components/FloatingNav";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <HeroSection />
      <BeforeAfterCarousel />
      <CheatAppsSection />
      <UploadSection />
      <EnhancementSection />
      <PreviewSection />
      <FloatingNav />
    </div>
  );
};

export default Index;
