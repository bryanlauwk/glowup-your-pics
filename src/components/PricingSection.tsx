import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Check, Zap, Star, Crown } from 'lucide-react';

const pricingPlans = [
  {
    name: 'Starter',
    price: '$19',
    period: 'one-time',
    description: 'Perfect for getting started',
    features: [
      '5 photo enhancements',
      'Basic AI improvements',
      'Download high-res images',
      '24/7 support'
    ],
    icon: Zap,
    popular: false
  },
  {
    name: 'Pro',
    price: '$39',
    period: 'one-time',
    description: 'Most popular choice',
    features: [
      '15 photo enhancements',
      'Advanced AI improvements',
      'Premium filters & effects',
      'Before/after comparisons',
      'Priority processing',
      '24/7 support'
    ],
    icon: Star,
    popular: true
  },
  {
    name: 'Elite',
    price: '$79',
    period: 'one-time',
    description: 'For the ultimate advantage',
    features: [
      'Unlimited enhancements',
      'Premium AI technology',
      'Custom style preferences',
      'Personal consultation call',
      'Dating profile optimization',
      'Instant processing',
      'VIP support'
    ],
    icon: Crown,
    popular: false
  }
];

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

          {/* Pricing Cards */}
          <div className="grid md:grid-cols-3 gap-6">
            {pricingPlans.map((plan, index) => (
              <Card 
                key={index} 
                className={`relative group hover:shadow-glow-violet transition-all duration-300 ${
                  plan.popular 
                    ? 'border-violet-purple/50 bg-violet-purple/5 scale-105' 
                    : 'bg-card/50 backdrop-blur-sm border-border/50'
                }`}
              >
                {plan.popular && (
                  <Badge 
                    variant="secondary" 
                    className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gradient-primary text-primary-foreground px-4 py-1 text-sm font-bold"
                  >
                    Most Popular
                  </Badge>
                )}
                
                <CardHeader className="text-center space-y-4">
                  <div className={`w-16 h-16 mx-auto rounded-full flex items-center justify-center ${
                    plan.popular ? 'bg-gradient-primary' : 'bg-gradient-accent'
                  }`}>
                    <plan.icon className="w-8 h-8 text-white" />
                  </div>
                  
                  <div className="space-y-2">
                    <CardTitle className="text-2xl font-bold">{plan.name}</CardTitle>
                    <p className="text-muted-foreground">{plan.description}</p>
                  </div>
                  
                  <div className="space-y-1">
                    <div className="flex items-baseline justify-center gap-1">
                      <span className="text-4xl font-black text-gradient-accent">{plan.price}</span>
                      <span className="text-muted-foreground">/{plan.period}</span>
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="space-y-6">
                  <ul className="space-y-3">
                    {plan.features.map((feature, idx) => (
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
                    className={`w-full py-6 font-bold ${
                      plan.popular 
                        ? 'bg-gradient-primary hover:shadow-glow-violet' 
                        : 'bg-gradient-accent hover:shadow-glow-pink'
                    } transition-all duration-300 hover:scale-105`}
                  >
                    Get Started Now
                  </Button>
                </CardContent>
              </Card>
            ))}
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