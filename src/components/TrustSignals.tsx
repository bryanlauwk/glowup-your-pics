import { Shield, Zap, Heart } from "lucide-react";
import { Badge } from "@/components/ui/badge";
export const TrustSignals = () => {
  return (
    <section className="py-16 bg-muted/20">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-3 gap-8 text-center">
          <div className="flex flex-col items-center space-y-4">
            <div className="p-3 rounded-full bg-primary/10">
              <Zap className="h-8 w-8 text-primary" />
            </div>
            <h3 className="text-xl font-semibold">30-Second Enhancement</h3>
            <p className="text-muted-foreground">AI transforms your photos instantly</p>
          </div>
          
          <div className="flex flex-col items-center space-y-4">
            <div className="p-3 rounded-full bg-primary/10">
              <Heart className="h-8 w-8 text-primary" />
            </div>
            <h3 className="text-xl font-semibold">3x More Matches</h3>
            <p className="text-muted-foreground">Proven results from enhanced photos</p>
          </div>
          
          <div className="flex flex-col items-center space-y-4">
            <div className="p-3 rounded-full bg-primary/10">
              <Shield className="h-8 w-8 text-primary" />
            </div>
            <h3 className="text-xl font-semibold">100% Natural Looking</h3>
            <p className="text-muted-foreground">Undetectable AI enhancement</p>
          </div>
        </div>
      </div>
    </section>
  );
};