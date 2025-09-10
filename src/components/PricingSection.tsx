import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Check, Zap, Star, Crown } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useNavigate } from 'react-router-dom';

const pricingPlans = [
  {
    id: 'basic',
    name: 'Basic',
    price: '$9.99',
    period: 'month',
    description: 'Perfect for casual dating',
    photoLimit: '3 photos',
    features: [
      '3 photo enhancements per month',
      'Standard quality processing',
      'Basic AI enhancements',
      'Watermark-free downloads',
      'All dating apps compatibility',
      '30-day money-back guarantee'
    ],
    icon: Zap,
    popular: false
  },
  {
    id: 'pro',
    name: 'Pro',
    price: '$19.99',
    period: 'month',
    description: 'Most popular for serious daters',
    photoLimit: '10 photos',
    features: [
      '10 photo enhancements per month',
      'High quality (4K) processing',
      'Advanced AI enhancements',
      'Priority processing',
      'Anti-detection technology',
      'Multiple enhancement styles',
      '30-day money-back guarantee'
    ],
    icon: Star,
    popular: true
  },
  {
    id: 'elite',
    name: 'Elite',
    price: '$39.99',
    period: 'month',
    description: 'Premium experience for power users',
    photoLimit: '20 photos',
    features: [
      '20 photo enhancements per month',
      'Ultra-high quality processing',
      'Premium AI features',
      'Instant processing',
      'Advanced analytics',
      'White-glove service',
      '30-day money-back guarantee'
    ],
    icon: Crown,
    popular: false
  }
];

export const PricingSection = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleGetStarted = () => {
    if (user) {
      navigate('/dashboard');
    } else {
      navigate('/auth');
    }
  };

  return (
    <div className="py-20 bg-gradient-to-br from-violet-purple/5 via-background to-hot-pink/5">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto space-y-12">
          {/* Section Header */}
          <div className="text-center space-y-4">
            <h2 className="text-4xl md:text-5xl font-bold text-gradient-primary">
              Choose Your Plan
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Get more matches with our AI-enhanced photos. Start your dating transformation today.
            </p>
          </div>

          {/* Pricing Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {pricingPlans.map((plan) => (
              <Card 
                key={plan.id}
                className={`relative group hover:shadow-glow-violet transition-all duration-300 border-violet-purple/50 bg-violet-purple/5 ${
                  plan.popular ? 'scale-105 border-violet-purple' : 'hover:scale-105'
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
                  <div className="w-16 h-16 mx-auto rounded-full flex items-center justify-center bg-gradient-primary">
                    <plan.icon className="w-8 h-8 text-white" />
                  </div>
                  
                  <div className="space-y-2">
                    <CardTitle className="text-2xl font-bold">{plan.name}</CardTitle>
                    <p className="text-muted-foreground text-sm">{plan.description}</p>
                    <p className="text-violet-purple font-semibold">{plan.photoLimit}</p>
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
                    onClick={handleGetStarted}
                    className={`w-full py-6 font-bold text-lg transition-all duration-300 hover:scale-105 ${
                      plan.popular 
                        ? 'bg-gradient-primary hover:shadow-glow-violet' 
                        : 'bg-gradient-secondary hover:shadow-glow-pink'
                    }`}
                  >
                    Get Started
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