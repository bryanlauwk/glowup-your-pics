import { Button } from "@/components/ui/button";
import { ArrowRight, Zap } from "lucide-react";
import heroBackground from "@/assets/hero-background.jpg";

export const HeroSection = () => {
  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-dark">
      {/* Background Image with Overlay */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${heroBackground})` }}
      />
      <div className="absolute inset-0 bg-background/70" />
      
      {/* Animated Grid */}
      <div className="absolute inset-0 opacity-20">
        <div className="h-full w-full bg-[linear-gradient(rgba(127,255,0,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(127,255,0,0.1)_1px,transparent_1px)] bg-[size:50px_50px]" />
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 text-center">
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Main Headline */}
          <div className="space-y-4">
            <h1 className="text-5xl md:text-7xl font-black tracking-tight">
              The Dating App
              <span className="block text-gradient-primary">
                Photo Cheat-Code
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              Transform your dating photos into irresistible profile pics that get more matches. 
              <span className="text-neon-green font-semibold"> Completely undetectable.</span>
            </p>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4">
            <Button 
              variant="hero" 
              size="xl"
              className="group"
              onClick={() => {
                document.getElementById('upload')?.scrollIntoView({ behavior: 'smooth' });
              }}
            >
              <Zap className="w-5 h-5 group-hover:animate-pulse" />
              Get My Glow-Up Now
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Button>
            <Button variant="cheat" size="xl">
              See Before & After Examples
            </Button>
          </div>

          {/* Social Proof */}
          <div className="pt-8 space-y-4">
            <p className="text-sm text-muted-foreground uppercase tracking-wide">
              Trusted by 10,000+ Users
            </p>
            <div className="flex flex-wrap justify-center gap-8 items-center text-2xl font-bold text-gradient-accent">
              <span>+300% More Matches</span>
              <span>•</span>
              <span>100% Undetectable</span>
              <span>•</span>
              <span>5-Star Reviews</span>
            </div>
          </div>
        </div>
      </div>

      {/* Floating Elements */}
      <div className="absolute top-20 left-10 w-2 h-2 bg-neon-green rounded-full animate-pulse" />
      <div className="absolute bottom-32 right-16 w-3 h-3 bg-electric-blue rounded-full animate-pulse delay-1000" />
      <div className="absolute top-1/2 right-8 w-1 h-1 bg-neon-green rounded-full animate-pulse delay-500" />
    </div>
  );
};