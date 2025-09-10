import { Shield, Star, Users, Zap, Heart, CheckCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export const TrustSignals = () => {
  return (
    <div className="py-16 bg-card/50 backdrop-blur-sm">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gradient-primary mb-4">
            Why 87% Get More Matches Within 7 Days
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Join thousands who've already transformed their dating life with our proven AI magic
          </p>
        </div>

        {/* Trust Badges */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
          <div className="text-center">
            <div className="bg-love-pink/10 border border-love-pink/20 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-3">
              <Shield className="w-8 h-8 text-love-pink" />
            </div>
            <p className="text-sm font-semibold">256-bit SSL</p>
            <p className="text-xs text-muted-foreground">Bank-level security</p>
          </div>
          
          <div className="text-center">
            <div className="bg-passionate-pink/10 border border-passionate-pink/20 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-3">
              <CheckCircle className="w-8 h-8 text-passionate-pink" />
            </div>
            <p className="text-sm font-semibold">Privacy First</p>
            <p className="text-xs text-muted-foreground">Photos auto-deleted</p>
          </div>
          
          <div className="text-center">
            <div className="bg-enchanting-purple/10 border border-enchanting-purple/20 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-3">
              <Zap className="w-8 h-8 text-enchanting-purple" />
            </div>
            <p className="text-sm font-semibold">Instant Results</p>
            <p className="text-xs text-muted-foreground">30-second magic</p>
          </div>
          
          <div className="text-center">
            <div className="bg-romance-rose/10 border border-romance-rose/20 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-3">
              <Heart className="w-8 h-8 text-romance-rose" />
            </div>
            <p className="text-sm font-semibold">Love Guarantee</p>
            <p className="text-xs text-muted-foreground">More matches or refund</p>
          </div>
        </div>

        {/* Success Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
          <div className="bg-gradient-to-br from-love-pink/10 to-passionate-pink/10 border border-love-pink/20 rounded-xl p-6">
            <div className="text-4xl font-bold text-love-pink mb-2">3.2x</div>
            <p className="text-sm font-semibold mb-1">More Matches</p>
            <p className="text-xs text-muted-foreground">Average increase in first week</p>
          </div>
          
          <div className="bg-gradient-to-br from-enchanting-purple/10 to-passionate-pink/10 border border-enchanting-purple/20 rounded-xl p-6">
            <div className="text-4xl font-bold text-enchanting-purple mb-2">87%</div>
            <p className="text-sm font-semibold mb-1">Success Rate</p>
            <p className="text-xs text-muted-foreground">See improvement in 7 days</p>
          </div>
          
          <div className="bg-gradient-to-br from-romance-rose/10 to-love-pink/10 border border-romance-rose/20 rounded-xl p-6">
            <div className="text-4xl font-bold text-romance-rose mb-2">24hrs</div>
            <p className="text-sm font-semibold mb-1">First Match</p>
            <p className="text-xs text-muted-foreground">Average time to first new match</p>
          </div>
        </div>

        {/* Money Back Guarantee */}
        <div className="bg-gradient-to-r from-love-pink/10 to-passionate-pink/10 border border-love-pink/20 rounded-xl p-8 mt-12 text-center">
          <div className="flex justify-center mb-4">
            <Badge variant="secondary" className="bg-love-pink/20 text-love-pink border-love-pink/30 px-4 py-2">
              <Heart className="w-4 h-4 mr-2" />
              Love Guarantee
            </Badge>
          </div>
          <h3 className="text-2xl font-bold text-love-pink mb-2">
            Your Happiness is Guaranteed
          </h3>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            If you don't see more matches within 7 days of using SwipeBoost, 
            we'll refund your credits - no questions asked. That's how confident we are in our magic! ✨
          </p>
        </div>
      </div>
    </div>
  );
};