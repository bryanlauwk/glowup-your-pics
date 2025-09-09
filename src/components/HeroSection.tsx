import { Button } from "@/components/ui/button";
import { ArrowRight, Zap } from "lucide-react";
import heroBackground from "@/assets/hero-background.jpg";

export const HeroSection = () => {
  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Romantic Golden Hour Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-rose-gold/20 via-coral/10 to-sunset-orange/20" />
      <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-background/40 to-background/60" />
      
      {/* Soft Romantic Lighting Effects */}
      <div className="absolute inset-0 opacity-30">
        <div className="h-full w-full bg-[radial-gradient(ellipse_at_top_left,rgba(232,180,184,0.3)_0%,transparent_60%),radial-gradient(ellipse_at_bottom_right,rgba(255,179,71,0.2)_0%,transparent_60%),radial-gradient(ellipse_at_center,rgba(255,107,107,0.1)_0%,transparent_70%)]" />
      </div>
      
      {/* Gentle Bokeh Particles */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-rose-gold/30 rounded-full blur-xl animate-pulse" />
        <div className="absolute top-3/4 right-1/3 w-24 h-24 bg-coral/25 rounded-full blur-2xl animate-pulse delay-1000" />
        <div className="absolute bottom-1/3 left-1/2 w-40 h-40 bg-sunset-orange/20 rounded-full blur-3xl animate-pulse delay-500" />
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 text-center">
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Main Headline */}
          <div className="space-y-4">
            <h1 className="text-5xl md:text-7xl font-black tracking-tight">
              Turn Your Photos Into
              <span className="block text-gradient-primary">
                Conversation Starters
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              Look like the best version of yourself with invisible AI enhancement that gets you more matches. 
              <span className="text-rose-gold font-semibold"> Naturally irresistible.</span>
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
              Get My Confidence Boost
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Button>
            <Button variant="outline" size="xl" className="border-rose-gold text-rose-gold hover:bg-rose-gold hover:text-primary-foreground">
              See Real Results
            </Button>
          </div>

          {/* Social Proof */}
          <div className="pt-8 space-y-4">
            <p className="text-sm text-muted-foreground uppercase tracking-wide">
              Join thousands of confident users
            </p>
            <div className="flex flex-wrap justify-center gap-8 items-center text-xl font-semibold text-gradient-accent">
              <span>More meaningful connections</span>
              <span>•</span>
              <span>Naturally enhanced</span>
              <span>•</span>
              <span>Loved by users everywhere</span>
            </div>
          </div>
        </div>
      </div>

      {/* Gentle Floating Light Spots */}
      <div className="absolute top-20 left-10 w-3 h-3 bg-rose-gold/60 rounded-full animate-pulse blur-sm" />
      <div className="absolute bottom-32 right-16 w-4 h-4 bg-coral/50 rounded-full animate-pulse delay-1000 blur-sm" />
      <div className="absolute top-1/2 right-8 w-2 h-2 bg-sunset-orange/70 rounded-full animate-pulse delay-500 blur-sm" />
      <div className="absolute top-1/3 left-1/2 w-1 h-1 bg-rose-gold/80 rounded-full animate-pulse delay-700 blur-sm" />
    </div>
  );
};