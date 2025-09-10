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
    name: 'Cupid\'s Helper',
    price: '$9.99',
    period: 'month',
    description: 'Perfect for finding your first love',
    photoLimit: '3 enchanted photos',
    features: [
      '3 photo love transformations per month',
      'Sweet romantic enhancements',
      'Basic AI charm boosters',
      'Watermark-free love photos',
      'All dating apps compatibility',
      '30-day love guarantee 💕'
    ],
    icon: Zap,
    popular: false
  },
  {
    id: 'pro',
    name: 'Soulmate Seeker',
    price: '$19.99',
    period: 'month',
    description: 'Most loved by serious romantics',
    photoLimit: '10 enchanted photos',
    features: [
      '10 photo love transformations per month',
      'High quality (4K) romance magic',
      'Advanced AI love enhancements',
      'Priority heart processing',
      'Invisible romance technology',
      'Multiple enchantment styles',
      '30-day soulmate guarantee 💖'
    ],
    icon: Star,
    popular: true
  },
  {
    id: 'elite',
    name: 'Love Magnet',
    price: '$39.99',
    period: 'month',
    description: 'Premium love magic for love gods',
    photoLimit: '20 enchanted photos',
    features: [
      '20 photo love transformations per month',
      'Ultra-romantic quality processing',
      'Premium AI love features',
      'Instant heart melting',
      'Advanced love analytics',
      'White-glove romance service',
      '30-day irresistible guarantee 🔥'
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
    <div className="py-20 bg-gradient-to-br from-love-pink/5 via-background to-passionate-pink/5">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto space-y-12">
          {/* Section Header */}
          <div className="text-center space-y-4">
            <h2 className="text-4xl md:text-5xl font-bold text-gradient-primary">
              💕 Choose Your Love Journey 💕
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Unlock your heart's desires with AI magic. Start your romantic transformation today ✨
            </p>
          </div>

          {/* Pricing Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {pricingPlans.map((plan) => (
              <Card 
                key={plan.id}
                className={`relative group hover:shadow-love-glow transition-all duration-300 border-love-pink/50 bg-love-pink/5 ${
                  plan.popular ? 'scale-105 border-love-pink' : 'hover:scale-105'
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
                    <p className="text-love-pink font-semibold">{plan.photoLimit}</p>
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
                        <div className="w-5 h-5 rounded-full bg-love-pink/20 flex items-center justify-center flex-shrink-0">
                          <Check className="w-3 h-3 text-love-pink" />
                        </div>
                        <span className="text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  
                  <Button 
                    onClick={handleGetStarted}
                    className={`w-full py-6 font-bold text-lg transition-all duration-300 hover:scale-105 ${
                      plan.popular 
                        ? 'bg-gradient-primary hover:shadow-love-glow' 
                        : 'bg-gradient-accent hover:shadow-romance-glow'
                    }`}
                  >
                    Begin My Love Transformation
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