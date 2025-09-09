import { HeroSection } from "@/components/HeroSection";
import { BeforeAfterCarousel } from "@/components/BeforeAfterCarousel";
import { CheatAppsSection } from "@/components/CheatAppsSection";
import { PricingSection } from "@/components/PricingSection";
import { FAQSection } from "@/components/FAQSection";
import { Footer } from "@/components/Footer";
import { FloatingNav } from "@/components/FloatingNav";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <HeroSection />
      <BeforeAfterCarousel />
      <CheatAppsSection />
      <PricingSection />
      <FAQSection />
      <Footer />
      <FloatingNav />
    </div>
  );
};

export default Index;
