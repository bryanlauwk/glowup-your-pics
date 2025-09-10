import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Coins, Plus, Zap, Crown, Star } from 'lucide-react';
import { useCredits } from '@/hooks/useCredits';
import { cn } from '@/lib/utils';

export const CreditsDisplay: React.FC = () => {
  const { credits, loading, purchaseCredits } = useCredits();

  const packages = [
    {
      id: 'single',
      name: 'Single Enhancement', 
      credits: 1,
      price: '$2.99',
      icon: Zap,
      popular: false,
      description: 'Perfect for testing'
    },
    {
      id: 'starter',
      name: 'Starter Pack',
      credits: 5,
      price: '$9.99',
      icon: Plus,
      popular: false,
      description: 'Great for building your lineup',
      savings: '$4.96'
    },
    {
      id: 'pro',
      name: 'Pro Pack',
      credits: 15,
      price: '$24.99',
      icon: Crown,
      popular: true,
      description: 'Most popular choice',
      savings: '$19.86'
    },
    {
      id: 'unlimited',
      name: 'Unlimited Pack',
      credits: 100,
      price: '$49.99',
      icon: Star,
      popular: false,
      description: 'Best value for power users',
      savings: '$249.01'
    }
  ];

  if (loading) {
    return (
      <Card className="bg-card/50 backdrop-blur-sm border-border/50">
        <CardContent className="p-6">
          <div className="animate-pulse space-y-4">
            <div className="h-6 bg-muted rounded w-1/2"></div>
            <div className="h-4 bg-muted rounded w-3/4"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Current Credits Display */}
      <Card className="bg-gradient-to-r from-violet-purple/10 to-hot-pink/10 border-violet-purple/30">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-violet-purple/20 rounded-full flex items-center justify-center">
                <Coins className="w-5 h-5 text-violet-purple" />
              </div>
              <div>
                <h3 className="font-semibold text-lg">Your Credits</h3>
                <p className="text-sm text-muted-foreground">
                  Each enhancement uses 1 credit
                </p>
              </div>
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold text-gradient-primary">
                {credits}
              </div>
              <p className="text-xs text-muted-foreground">Available</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Purchase Credits */}
      <Card className="bg-card/50 backdrop-blur-sm border-border/50">
        <CardContent className="p-6 space-y-4">
          <div className="text-center space-y-2">
            <h3 className="font-semibold text-lg text-gradient-primary">
              Get More Credits
            </h3>
            <p className="text-sm text-muted-foreground">
              Transform more photos and build the perfect dating lineup
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {packages.map((pkg) => {
              const Icon = pkg.icon;
              return (
                <div
                  key={pkg.id}
                  className={cn(
                    "relative p-4 rounded-lg border-2 transition-all duration-300 hover:scale-[1.02] cursor-pointer group",
                    pkg.popular 
                      ? "border-violet-purple bg-violet-purple/5 shadow-glow-violet" 
                      : "border-border hover:border-violet-purple/50"
                  )}
                  onClick={() => purchaseCredits(pkg.id)}
                >
                  {pkg.popular && (
                    <Badge className="absolute -top-2 left-1/2 transform -translate-x-1/2 bg-gradient-primary text-background">
                      Most Popular
                    </Badge>
                  )}
                  
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <Icon className={cn(
                        "w-5 h-5",
                        pkg.popular ? "text-violet-purple" : "text-muted-foreground"
                      )} />
                      <h4 className="font-semibold text-sm">{pkg.name}</h4>
                    </div>
                    
                    <div className="space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="text-lg font-bold">{pkg.price}</span>
                        <span className="text-sm text-muted-foreground">
                          {pkg.credits} credits
                        </span>
                      </div>
                      
                      <p className="text-xs text-muted-foreground">
                        {pkg.description}
                      </p>
                      
                      {pkg.savings && (
                        <p className="text-xs text-green-500 font-medium">
                          Save {pkg.savings}!
                        </p>
                      )}
                    </div>
                    
                    <Button 
                      size="sm" 
                      className={cn(
                        "w-full transition-all",
                        pkg.popular 
                          ? "bg-gradient-primary hover:shadow-glow-violet" 
                          : "bg-secondary hover:bg-secondary/80"
                      )}
                    >
                      Purchase
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
          
          <div className="text-center pt-4 border-t border-border">
            <p className="text-xs text-muted-foreground">
              💳 Secure payment powered by Stripe • 🔄 Instant credit delivery
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};