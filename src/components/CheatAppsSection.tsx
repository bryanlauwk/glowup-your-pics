import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Zap } from 'lucide-react';
import { 
  TinderLogo, 
  BumbleLogo, 
  HingeLogo, 
  CoffeeMeetsBagelLogo, 
  OkCupidLogo, 
  MatchLogo 
} from './DatingAppLogos';

const apps = [
  { name: 'Tinder', logo: TinderLogo },
  { name: 'Bumble', logo: BumbleLogo },
  { name: 'Hinge', logo: HingeLogo },
  { name: 'Coffee Meets Bagel', logo: CoffeeMeetsBagelLogo },
  { name: 'OkCupid', logo: OkCupidLogo },
  { name: 'Match', logo: MatchLogo }
];


export const CheatAppsSection = () => {
  const scrollToUpload = () => {
    const uploadElement = document.getElementById('upload');
    if (uploadElement) {
      uploadElement.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="py-20 bg-gradient-to-br from-deep-purple/10 via-background to-hot-pink/10">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto space-y-16">
          {/* Main Header */}
          <div className="text-center space-y-8">
            <div className="space-y-4">
              <h2 className="text-5xl md:text-7xl font-black text-gradient-primary leading-tight">
                It's time to cheat.
              </h2>
              <div className="space-y-2">
                <p className="text-2xl md:text-3xl font-bold text-foreground">
                  Tinder. Bumble. Hinge.
                </p>
                <p className="text-xl md:text-2xl font-semibold text-muted-foreground">
                  Coffee Meets Bagel. Really everything.
                </p>
              </div>
            </div>
            
            <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              While everyone else is playing fair, you'll have the unfair advantage of looking like 
              the most attractive version of yourself. Completely undetectable AI enhancement.
            </p>
          </div>

          {/* App Grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {apps.map((app, index) => (
              <Card key={index} className="group hover:shadow-glow-violet transition-all duration-300 bg-card/50 backdrop-blur-sm border-border/50">
                <CardContent className="p-6 text-center">
                  <div className="w-16 h-16 mx-auto mb-3 bg-white rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform shadow-lg">
                    <app.logo className="w-10 h-10" />
                  </div>
                  <h3 className="font-bold text-sm text-foreground group-hover:text-violet-purple transition-colors">
                    {app.name}
                  </h3>
                </CardContent>
              </Card>
            ))}
          </div>


          {/* CTA Section */}
          <div className="text-center space-y-6">
            <Badge variant="secondary" className="text-lg px-6 py-2 bg-violet-purple/20 text-violet-purple border-violet-purple/30">
              The unfair advantage you've been waiting for
            </Badge>
            
            <Button 
              onClick={scrollToUpload}
              size="lg" 
              className="text-xl px-8 py-6 bg-gradient-primary hover:shadow-glow-violet transition-all duration-300 hover:scale-105"
            >
              Get Your Cheat Code Now
              <Zap className="ml-2 w-6 h-6" />
            </Button>
            
            <p className="text-sm text-muted-foreground">
              Join the thousands already winning the dating game
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};