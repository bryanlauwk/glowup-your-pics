import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Palette, Sparkles, Camera, Wand2, Lock, CreditCard } from 'lucide-react';

const backgroundModes = [
  {
    id: 'authentic',
    name: 'Authentic',
    description: 'Natural lighting and subtle enhancements',
    icon: Camera,
    color: 'text-neon-green'
  },
  {
    id: 'aesthetic',
    name: 'Aesthetic', 
    description: 'Instagram-ready with perfect lighting',
    icon: Sparkles,
    color: 'text-electric-blue'
  },
  {
    id: 'scene',
    name: 'Scene',
    description: 'Background blur and depth enhancement',
    icon: Palette,
    color: 'text-purple-400'
  },
  {
    id: 'natural',
    name: 'Natural',
    description: 'Golden hour vibes and skin smoothing',
    icon: Wand2,
    color: 'text-orange-400'
  }
];

export const EnhancementSection = () => {
  const [selectedMode, setSelectedMode] = useState('aesthetic');
  const [isProcessing, setIsProcessing] = useState(false);

  const handleEnhance = async () => {
    setIsProcessing(true);
    // Simulate processing time
    setTimeout(() => {
      setIsProcessing(false);
      // Navigate to preview section
      document.getElementById('preview')?.scrollIntoView({ behavior: 'smooth' });
    }, 3000);
  };

  return (
    <div id="enhance" className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto space-y-12">
          {/* Section Header */}
          <div className="text-center space-y-4">
            <h2 className="text-4xl md:text-5xl font-bold text-gradient-primary">
              Choose Your Enhancement Mode
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Select the perfect style for your photos. Each mode is carefully crafted 
              to maximize your dating app success while staying completely natural.
            </p>
          </div>

          {/* Background Mode Selection */}
          <div className="grid md:grid-cols-2 gap-6">
            {backgroundModes.map((mode) => {
              const IconComponent = mode.icon;
              const isSelected = selectedMode === mode.id;
              
              return (
                <Card
                  key={mode.id}
                  className={`cursor-pointer transition-all duration-300 border-2 ${
                    isSelected 
                      ? 'border-neon-green shadow-glow-green bg-neon-green/10' 
                      : 'border-border/50 hover:border-neon-green/50 hover:bg-neon-green/5'
                  }`}
                  onClick={() => setSelectedMode(mode.id)}
                >
                  <CardHeader className="text-center">
                    <div className={`mx-auto w-16 h-16 rounded-full flex items-center justify-center ${
                      isSelected ? 'bg-neon-green/20' : 'bg-muted/50'
                    }`}>
                      <IconComponent className={`w-8 h-8 ${isSelected ? 'text-neon-green' : mode.color}`} />
                    </div>
                    <CardTitle className="text-xl">
                      {mode.name}
                      {isSelected && <Badge className="ml-2 bg-neon-green text-primary-foreground">Selected</Badge>}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-center text-muted-foreground">
                      {mode.description}
                    </p>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Enhancement Process */}
          <div className="text-center space-y-8">
            {!isProcessing ? (
              <div className="space-y-6">
                <div className="bg-card/50 backdrop-blur-sm rounded-lg p-6 border border-border/50">
                  <h3 className="text-2xl font-semibold mb-4">
                    Ready to Transform Your Photos?
                  </h3>
                  <p className="text-muted-foreground mb-6">
                    Our AI will enhance your photos with <span className="text-neon-green font-semibold">{selectedMode}</span> mode, 
                    improving lighting, smoothing skin, and boosting attractiveness while keeping it 100% natural.
                  </p>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-muted-foreground mb-6">
                    <div className="flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-neon-green" />
                      Golden Hour Lighting
                    </div>
                    <div className="flex items-center gap-2">
                      <Camera className="w-4 h-4 text-electric-blue" />
                      Skin Smoothing
                    </div>
                    <div className="flex items-center gap-2">
                      <Palette className="w-4 h-4 text-purple-400" />
                      Background Blur
                    </div>
                    <div className="flex items-center gap-2">
                      <Wand2 className="w-4 h-4 text-orange-400" />
                      Contrast Boost
                    </div>
                  </div>
                </div>

                <Button 
                  variant="hero" 
                  size="xl" 
                  onClick={handleEnhance}
                  className="group"
                >
                  <Sparkles className="w-6 h-6 group-hover:animate-spin" />
                  Start Enhancement Process
                </Button>
              </div>
            ) : (
              <div className="space-y-6">
                <Card className="border-neon-green/50 bg-neon-green/10">
                  <CardContent className="p-8 text-center">
                    <div className="space-y-4">
                      <div className="mx-auto w-16 h-16 bg-neon-green/20 rounded-full flex items-center justify-center">
                        <Sparkles className="w-8 h-8 text-neon-green animate-pulse" />
                      </div>
                      <h3 className="text-2xl font-semibold">
                        ✨ AI Enhancement in Progress
                      </h3>
                      <p className="text-muted-foreground max-w-md mx-auto">
                        Our advanced AI is analyzing your photos and applying {selectedMode} enhancements. 
                        This usually takes 30-60 seconds.
                      </p>
                      
                      {/* Progress Animation */}
                      <div className="w-full max-w-md mx-auto">
                        <div className="h-2 bg-muted rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-gradient-primary rounded-full"
                            style={{
                              animation: 'progressBar 3s ease-in-out forwards',
                              width: '0%'
                            }}
                          />
                        </div>
                        <p className="text-sm text-muted-foreground mt-2">
                          Processing your glow-up...
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};