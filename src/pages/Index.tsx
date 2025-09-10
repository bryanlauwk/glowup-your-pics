import { Header } from "@/components/Header";
import { HeroSection } from "@/components/HeroSection";
import { TrustSignals } from "@/components/TrustSignals";
import { BeforeAfterCarousel } from "@/components/BeforeAfterCarousel";
import { TestimonialsSection } from "@/components/TestimonialsSection";
import { CheatAppsSection } from "@/components/CheatAppsSection";
import { PricingSection } from "@/components/PricingSection";
import { FAQSection } from "@/components/FAQSection";
import { Footer } from "@/components/Footer";
import { FloatingNav } from "@/components/FloatingNav";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <HeroSection />
      <TrustSignals />
      <BeforeAfterCarousel />
      <TestimonialsSection />
      <CheatAppsSection />
      <PricingSection />
      <FAQSection />
      <Footer />
      <FloatingNav />
    </div>
  );
};

export default Index;
