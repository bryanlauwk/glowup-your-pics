import { Button } from "@/components/ui/button";
import { ArrowRight, Zap, Heart, Star, Sparkles } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";
import heroBackground from "@/assets/hero-background.jpg";
export const HeroSection = () => {
  const {
    user
  } = useAuth();
  const navigate = useNavigate();
  const handleGetStarted = () => {
    if (user) {
      navigate('/dashboard');
    } else {
      navigate('/auth');
    }
  };
  return <div className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
      {/* Vibrant Pink-Romance Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-love-pink/30 via-passionate-pink/20 to-enchanting-purple/25" />
      <div className="absolute inset-0 bg-gradient-to-t from-background/70 via-background/30 to-background/50" />
      
      {/* Love-Focused Background Effects */}
      <div className="absolute inset-0 opacity-40">
        <div className="h-full w-full bg-[radial-gradient(ellipse_at_top_left,rgba(255,182,218,0.4)_0%,transparent_60%),radial-gradient(ellipse_at_bottom_right,rgba(255,105,180,0.3)_0%,transparent_60%),radial-gradient(ellipse_at_center,rgba(255,192,203,0.2)_0%,transparent_70%)]" />
      </div>
      
      {/* Floating Love Elements */}
      <div className="absolute inset-0 opacity-20">
        {/* Phone Mockups */}
        <div className="absolute top-20 left-10 w-16 h-28 bg-white/10 rounded-lg border border-white/20 backdrop-blur-sm animate-float" />
        <div className="absolute bottom-20 right-10 w-16 h-28 bg-white/10 rounded-lg border border-white/20 backdrop-blur-sm animate-float delay-1000" />
        
        {/* Floating Hearts */}
        <div className="absolute top-1/3 left-1/4 animate-bounce delay-300">
          <Heart className="w-6 h-6 text-love-pink/60 fill-current" />
        </div>
        <div className="absolute bottom-1/3 right-1/4 animate-bounce delay-700">
          <Heart className="w-4 h-4 text-enchanting-purple/60 fill-current" />
        </div>
        <div className="absolute top-2/3 left-1/3 animate-bounce delay-500">
          <Heart className="w-5 h-5 text-passionate-pink/60 fill-current" />
        </div>
        
        {/* Swipe Gesture Trails */}
        <div className="absolute top-1/2 left-1/6 w-20 h-1 bg-gradient-to-r from-transparent via-love-pink/40 to-transparent animate-pulse" />
        <div className="absolute bottom-1/3 right-1/6 w-16 h-1 bg-gradient-to-r from-transparent via-enchanting-purple/40 to-transparent animate-pulse delay-1000" />
        
        {/* Match Notifications */}
        <div className="absolute top-1/4 right-1/3 bg-white/10 backdrop-blur-sm rounded-lg px-3 py-2 border border-white/20 animate-pulse">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-love-pink rounded-full" />
            <span className="text-xs text-white/80">It's a Match! 💕</span>
          </div>
        </div>
        
        {/* Sparkle Effects */}
        <div className="absolute top-1/5 left-1/2 animate-spin-slow">
          <Sparkles className="w-4 h-4 text-passionate-pink/50" />
        </div>
        <div className="absolute bottom-1/5 left-1/5 animate-spin-slow delay-500">
          <Sparkles className="w-3 h-3 text-enchanting-purple/50" />
        </div>
      </div>
      
      {/* Luminous Love Particles */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-love-pink/40 rounded-full blur-xl animate-pulse" />
        <div className="absolute top-3/4 right-1/3 w-24 h-24 bg-passionate-pink/35 rounded-full blur-2xl animate-pulse delay-1000" />
        <div className="absolute bottom-1/3 left-1/2 w-40 h-40 bg-enchanting-purple/30 rounded-full blur-3xl animate-pulse delay-500" />
        <div className="absolute top-1/2 left-1/6 w-20 h-20 bg-romance-rose/25 rounded-full blur-2xl animate-pulse delay-700" />
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 text-center">
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Main Headline */}
          <div className="space-y-4">
            <h1 className="text-5xl md:text-7xl font-black tracking-tight">
              <span className="block text-gradient-primary">
                💕 Make Them Fall
              </span>
              <span className="block text-gradient-primary">
                Head Over Heels 💕
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              Stop being invisible on <span className="text-love-pink font-semibold">Tinder</span>, <span className="text-passionate-pink font-semibold">Bumble</span> & <span className="text-enchanting-purple font-semibold">Hinge</span>. AI magic that makes hearts skip beats and fingers swipe right on 
              <span className="text-romance-rose font-semibold"> the love of your life</span> ✨
            </p>
            <p className="text-lg text-muted-foreground/80 italic">
              Be the one they've been dreaming of 💫
            </p>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4">
            <Button variant="hero" size="xl" className="group relative overflow-hidden" onClick={handleGetStarted}>
              <div className="absolute inset-0 bg-gradient-to-r from-love-pink/20 to-passionate-pink/20 animate-pulse opacity-0 group-hover:opacity-100 transition-opacity" />
              <Heart className="w-5 h-5 group-hover:animate-pulse text-love-pink" />
              Ignite My Love Story
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Button>
            
          </div>

          {/* Social Proof */}
          <div className="pt-8 space-y-4">
            <p className="text-sm text-muted-foreground uppercase tracking-wide">
              Join 50k+ hearts already finding their perfect match 💘
            </p>
            <div className="flex flex-wrap justify-center gap-8 items-center text-xl font-semibold text-gradient-accent">
              <span className="flex items-center gap-2">
                <Heart className="w-5 h-5 text-love-pink fill-current" />
                3x More Soulmate Matches
              </span>
              <span>•</span>
              <span className="flex items-center gap-2">
                <Zap className="w-5 h-5 text-enchanting-purple" />
                Invisible Love Magic
              </span>
              <span>•</span>
              <span className="flex items-center gap-2">
                <Star className="w-5 h-5 text-passionate-pink fill-current" />
                Instant Confidence Glow
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Romance & Mischief Floating Elements */}
      <div className="absolute top-20 left-10 w-3 h-3 bg-hot-pink/70 rounded-full animate-pulse blur-sm" />
      <div className="absolute bottom-32 right-16 w-4 h-4 bg-violet-purple/60 rounded-full animate-pulse delay-1000 blur-sm" />
      <div className="absolute top-1/2 right-8 w-2 h-2 bg-magenta-glow/80 rounded-full animate-pulse delay-500 blur-sm" />
      <div className="absolute top-1/3 left-1/2 w-1 h-1 bg-bright-pink/90 rounded-full animate-pulse delay-700 blur-sm" />
      <div className="absolute bottom-1/4 left-1/4 w-2 h-2 bg-rose-gold/70 rounded-full animate-pulse delay-300 blur-sm" />
      
      {/* Kiss Marks & Rose Petals */}
      <div className="absolute top-1/6 right-1/4 text-hot-pink/30 animate-float">💋</div>
      <div className="absolute bottom-1/6 left-1/3 text-rose-gold/30 animate-float delay-1000">🌹</div>
      <div className="absolute top-3/4 right-1/6 text-violet-purple/30 animate-bounce delay-500">💕</div>
    </div>;
};