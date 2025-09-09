import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Check, Zap, Star, Crown } from 'lucide-react';

const pricingPlan = {
  name: 'Unlock Your Transformation',
  price: '$9.99',
  period: 'one-time',
  description: 'Everything you need to win the dating game',
  features: [
    'AI-enhanced photos in 4K quality',
    'Watermark-free downloads',
    'Ready for all dating apps',
    'Lifetime access to your photos',
    'Undetectable enhancements',
    'Instant processing',
    '30-day money-back guarantee'
  ],
  icon: Crown
};

export const PricingSection = () => {
  const scrollToUpload = () => {
    const uploadElement = document.getElementById('upload');
    if (uploadElement) {
      uploadElement.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="py-20 bg-gradient-to-br from-violet-purple/5 via-background to-hot-pink/5">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto space-y-12">
          {/* Section Header */}
          <div className="text-center space-y-4">
            <h2 className="text-4xl md:text-5xl font-bold text-gradient-primary">
              Choose Your Advantage
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Start getting better matches today. No subscriptions, just results.
            </p>
          </div>

          {/* Pricing Card */}
          <div className="max-w-md mx-auto">
            <Card className="relative group hover:shadow-glow-violet transition-all duration-300 border-violet-purple/50 bg-violet-purple/5 scale-105">
              <Badge 
                variant="secondary" 
                className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gradient-primary text-primary-foreground px-4 py-1 text-sm font-bold"
              >
                Best Value
              </Badge>
              
              <CardHeader className="text-center space-y-4">
                <div className="w-16 h-16 mx-auto rounded-full flex items-center justify-center bg-gradient-primary">
                  <pricingPlan.icon className="w-8 h-8 text-white" />
                </div>
                
                <div className="space-y-2">
                  <CardTitle className="text-2xl font-bold">{pricingPlan.name}</CardTitle>
                  <p className="text-muted-foreground">{pricingPlan.description}</p>
                </div>
                
                <div className="space-y-1">
                  <div className="flex items-baseline justify-center gap-1">
                    <span className="text-4xl font-black text-gradient-accent">{pricingPlan.price}</span>
                    <span className="text-muted-foreground">/{pricingPlan.period}</span>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="space-y-6">
                <ul className="space-y-3">
                  {pricingPlan.features.map((feature, idx) => (
                    <li key={idx} className="flex items-center gap-3">
                      <div className="w-5 h-5 rounded-full bg-violet-purple/20 flex items-center justify-center flex-shrink-0">
                        <Check className="w-3 h-3 text-violet-purple" />
                      </div>
                      <span className="text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>
                
                <Button 
                  onClick={scrollToUpload}
                  className="w-full py-6 font-bold text-xl bg-gradient-primary hover:shadow-glow-violet transition-all duration-300 hover:scale-105"
                >
                  Unlock My Photos Now
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Bottom CTA */}
          <div className="text-center space-y-4 pt-8">
            <p className="text-lg text-muted-foreground">
              🔒 Secure payment • ✨ Instant delivery • 💯 Money-back guarantee
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};