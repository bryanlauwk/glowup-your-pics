import { Shield, Zap, Heart } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export const TrustSignals = () => {
  return (
    <div className="py-12 bg-gradient-to-r from-love-pink/5 to-passionate-pink/5">
      <div className="container mx-auto px-4">
        {/* Simplified Core Value Props */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center max-w-4xl mx-auto">
          <div className="space-y-3">
            <div className="w-12 h-12 bg-love-pink/10 border border-love-pink/20 rounded-full flex items-center justify-center mx-auto">
              <Shield className="w-6 h-6 text-love-pink" />
            </div>
            <h3 className="font-bold text-lg">100% Private</h3>
            <p className="text-sm text-muted-foreground">Photos auto-deleted after processing</p>
          </div>
          
          <div className="space-y-3">
            <div className="w-12 h-12 bg-passionate-pink/10 border border-passionate-pink/20 rounded-full flex items-center justify-center mx-auto">
              <Zap className="w-6 h-6 text-passionate-pink" />
            </div>
            <h3 className="font-bold text-lg">30-Second Magic</h3>
            <p className="text-sm text-muted-foreground">Instant AI enhancement, natural results</p>
          </div>
          
          <div className="space-y-3">
            <div className="w-12 h-12 bg-enchanting-purple/10 border border-enchanting-purple/20 rounded-full flex items-center justify-center mx-auto">
              <Heart className="w-6 h-6 text-enchanting-purple" />
            </div>
            <h3 className="font-bold text-lg">More Matches</h3>
            <p className="text-sm text-muted-foreground">See results within days or refund</p>
          </div>
        </div>

        {/* Single Key Guarantee */}
        <div className="bg-gradient-to-r from-love-pink/10 to-passionate-pink/10 border border-love-pink/20 rounded-xl p-6 mt-8 text-center max-w-2xl mx-auto">
          <div className="flex justify-center mb-3">
            <Badge variant="secondary" className="bg-love-pink/20 text-love-pink border-love-pink/30 px-4 py-1">
              <Heart className="w-4 h-4 mr-2" />
              7-Day Guarantee
            </Badge>
          </div>
          <p className="text-muted-foreground">
            More matches in 7 days or full refund - that's how confident we are! ✨
          </p>
        </div>
      </div>
    </div>
  );
};