import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Zap } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { 
  TinderLogo, 
  BumbleLogo, 
  HingeLogo, 
  CoffeeMeetsBagelLogo, 
  OkCupidLogo, 
  MatchLogo 
} from '@/components/DatingAppLogos';

const apps = [
  { name: 'Tinder', color: 'from-red-500 to-pink-500', logo: TinderLogo },
  { name: 'Bumble', color: 'from-yellow-400 to-yellow-500', logo: BumbleLogo },
  { name: 'Hinge', color: 'from-purple-500 to-purple-600', logo: HingeLogo },
  { name: 'Coffee Meets Bagel', color: 'from-amber-600 to-amber-700', logo: CoffeeMeetsBagelLogo },
  { name: 'OkCupid', color: 'from-blue-500 to-blue-600', logo: OkCupidLogo },
  { name: 'Match', color: 'from-green-500 to-green-600', logo: MatchLogo }
];


export const CheatAppsSection = () => {
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
    <div className="py-20 bg-gradient-to-br from-enchanting-purple/10 via-background to-love-pink/10">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto space-y-16">
          {/* Main Header */}
          <div className="text-center space-y-8">
            <div className="space-y-4">
              <h2 className="text-5xl md:text-7xl font-black text-gradient-primary leading-tight">
                💕 Love Conquers All Apps 💕
              </h2>
              <div className="space-y-2">
                <p className="text-2xl md:text-3xl font-bold text-foreground">
                  Tinder. Bumble. Hinge.
                </p>
                <p className="text-xl md:text-2xl font-semibold text-muted-foreground">
                  Every heart, every swipe, every match ✨
                </p>
              </div>
            </div>
            
            <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              While others play by the rules, you'll have the magic touch that makes hearts flutter. 
              Completely invisible AI enchantment that reveals your most irresistible self 💫
            </p>
          </div>

          {/* App Grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {apps.map((app, index) => (
              <Card key={index} className="group hover:shadow-love-glow transition-all duration-300 bg-card/50 backdrop-blur-sm border-border/50">
                <CardContent className="p-6 text-center">
                  <div className="w-16 h-16 mx-auto mb-3 bg-white rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform shadow-lg p-2">
                    <app.logo className="w-full h-full" />
                  </div>
                  <h3 className="font-bold text-sm text-foreground group-hover:text-love-pink transition-colors">
                    {app.name}
                  </h3>
                </CardContent>
              </Card>
            ))}
          </div>


          {/* CTA Section */}
          <div className="text-center space-y-6">
            <Badge variant="secondary" className="text-lg px-6 py-2 bg-love-pink/20 text-love-pink border-love-pink/30">
              The love magic you've been waiting for ✨
            </Badge>
            
            <Button 
              onClick={handleGetStarted}
              size="lg" 
              className="text-xl px-8 py-6 bg-gradient-primary hover:shadow-love-glow transition-all duration-300 hover:scale-105"
            >
              Start My Love Story
              <Zap className="ml-2 w-6 h-6" />
            </Button>
            
            <p className="text-sm text-muted-foreground">
              Join thousands already living their dream love story 💕
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};