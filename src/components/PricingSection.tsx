import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, Heart, Star, Crown, ArrowRight } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useNavigate } from 'react-router-dom';

const pricingPlans = [
  {
    id: 'starter-pack',
    name: 'Starter Pack',
    price: '$7.99',
    originalPrice: '$12.99',
    description: 'Perfect for testing the waters after your FREE trial',
    features: [
      '5 AI-enhanced photos',
      'All dating app optimization',
      'Instant results',
      '7-day match guarantee',
      'Email support'
    ],
    icon: Heart,
    gradient: 'from-passionate-pink/20 to-love-pink/20',
    borderColor: 'border-passionate-pink/30',
    textColor: 'text-passionate-pink',
    buttonVariant: 'default' as const,
    savings: 'Save 38%'
  },
  {
    id: 'soulmate-seeker',
    name: 'Soulmate Seeker',
    price: '$19.99',
    originalPrice: '$29.99',
    description: 'Most popular! Transform multiple photos for maximum impact',
    features: [
      '15 AI-enhanced photos',
      'Premium AI models',
      'Multi-platform optimization',
      'Priority processing',
      'Match increase guarantee',
      'Live chat support'
    ],
    icon: Star,
    gradient: 'from-enchanting-purple/20 to-romance-rose/20',
    borderColor: 'border-enchanting-purple/30',
    textColor: 'text-enchanting-purple',
    buttonVariant: 'hero' as const,
    popular: true,
    savings: 'Save 33%'
  },
  {
    id: 'love-legend',
    name: 'Love Legend',
    price: '$39.99',
    originalPrice: '$59.99',
    description: 'Ultimate package for serious daters who want the best results',
    features: [
      '40 AI-enhanced photos',
      'Celebrity-grade AI',
      'Personal dating coach tips',
      'Unlimited revisions',
      'Advanced analytics',
      'VIP support',
      'Success guarantee'
    ],
    icon: Crown,
    gradient: 'from-rose-gold/20 to-magic-pink/20',
    borderColor: 'border-rose-gold/30',
    textColor: 'text-rose-gold',
    buttonVariant: 'secondary' as const,
    savings: 'Save 33%'
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
          <div className="text-center mb-16">
            {/* FREE Trial Badge */}
            <div className="bg-gradient-to-r from-love-pink/20 to-passionate-pink/20 backdrop-blur-sm border border-love-pink/30 rounded-full px-6 py-3 mx-auto w-fit mb-6">
              <div className="flex items-center gap-2 text-love-pink font-semibold">
                <Heart className="w-5 h-5 animate-pulse" />
                <span className="text-lg">Start FREE • See The Magic First</span>
                <Heart className="w-5 h-5 animate-pulse" />
              </div>
            </div>
            
            <h2 className="text-4xl md:text-5xl font-bold text-gradient-primary mb-6">
              Try FREE, Then Choose Your Love Story
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Start with a <span className="text-love-pink font-bold">100% FREE trial</span> to see the magic. Then choose more credits to find your soulmate. Your romantic journey starts with zero risk! ✨
            </p>
          </div>

          {/* Pricing Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {pricingPlans.map((plan) => (
              <Card key={plan.id} className="relative hover:shadow-lg transition-all duration-300">
                <div className="space-y-4">
                  <div className={`${plan.gradient} rounded-lg p-6 border ${plan.borderColor} relative`}>
                    {plan.popular && (
                      <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                        <span className="bg-gradient-to-r from-enchanting-purple to-romance-rose text-white px-4 py-1 rounded-full text-sm font-semibold">
                          Most Popular 💕
                        </span>
                      </div>
                    )}
                    {plan.savings && (
                      <div className="absolute -top-3 right-4">
                        <span className="bg-love-pink text-white px-3 py-1 rounded-full text-xs font-semibold">
                          {plan.savings}
                        </span>
                      </div>
                    )}
                    <div className="flex items-center justify-between mb-4">
                      <h3 className={`text-2xl font-bold ${plan.textColor}`}>
                        {plan.name}
                      </h3>
                      <plan.icon className={`w-8 h-8 ${plan.textColor}`} />
                    </div>
                    <div className="mb-4">
                      <div className="flex items-baseline gap-2">
                        <span className={`text-4xl font-black ${plan.textColor}`}>
                          {plan.price}
                        </span>
                        {plan.originalPrice && (
                          <span className="text-lg text-muted-foreground line-through">
                            {plan.originalPrice}
                          </span>
                        )}
                      </div>
                      <span className="text-muted-foreground text-lg">
                        one-time • limited time
                      </span>
                    </div>
                    <p className="text-muted-foreground mb-6">
                      {plan.description}
                    </p>
                    <ul className="space-y-3 mb-8">
                      {plan.features.map((feature, featureIndex) => (
                        <li key={featureIndex} className="flex items-center gap-3">
                          <CheckCircle className={`w-5 h-5 ${plan.textColor} flex-shrink-0`} />
                          <span className="text-foreground">{feature}</span>
                        </li>
                      ))}
                    </ul>
                    <Button 
                      variant={plan.buttonVariant} 
                      size="lg" 
                      className="w-full group"
                      onClick={handleGetStarted}
                    >
                      <Heart className="w-5 h-5 group-hover:animate-pulse" />
                      Get Started
                      <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </div>
                </div>
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