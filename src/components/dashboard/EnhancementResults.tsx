import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Download, 
  Share2, 
  Star, 
  Shield, 
  Clock, 
  CheckCircle,
  CreditCard,
  Smartphone 
} from 'lucide-react';
import { logger } from '@/lib/logger';
import { cn } from '@/lib/utils';

interface UploadedPhoto {
  id: string;
  file: File;
  preview: string;
  analysis?: any;
}

interface EnhancementResult {
  id: string;
  originalPhoto: UploadedPhoto;
  variants: {
    tinder: string;
    bumble: string;
    cmb: string;
    universal: string;
  };
  metadata: {
    processingTime: number;
    antiDetectionScore: number;
    platformOptimizations: string[];
  };
}

interface EnhancementResultsProps {
  results: EnhancementResult[];
  originalPhotos: UploadedPhoto[];
}

const PLATFORM_INFO = {
  tinder: { name: 'Tinder', color: 'bg-red-500', icon: '🔥' },
  bumble: { name: 'Bumble', color: 'bg-yellow-500', icon: '🐝' },
  cmb: { name: 'Coffee Meets Bagel', color: 'bg-amber-600', icon: '☕' },
  universal: { name: 'Universal', color: 'bg-violet-purple', icon: '✨' },
};

export const EnhancementResults: React.FC<EnhancementResultsProps> = ({
  results,
  originalPhotos,
}) => {
  const [selectedResult, setSelectedResult] = useState(0);
  const [selectedPlatform, setSelectedPlatform] = useState<keyof typeof PLATFORM_INFO>('tinder');
  const [showPaywall, setShowPaywall] = useState(true);

  const currentResult = results[selectedResult];
  const totalVariants = results.reduce((sum, result) => sum + Object.keys(result.variants).length, 0);

  const handlePayment = async () => {
    // Simulate payment processing
    setShowPaywall(false);
    
    // In real app, integrate with Stripe here
    // const response = await supabase.functions.invoke('create-checkout');
    // window.open(response.data.url, '_blank');
  };

  const downloadVariant = (variant: string, filename: string) => {
    const link = document.createElement('a');
    link.href = variant;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const shareVariant = (platform: string) => {
    // Implement sharing logic
    logger.info('Share variant requested', { platform, component: 'EnhancementResults' });
  };

  if (!currentResult) {
    return (
      <Card className="bg-card/50 backdrop-blur-sm border-border/50">
        <CardContent className="p-8 text-center">
          <p className="text-muted-foreground">No enhancement results available</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Results Overview */}
      <Card className="bg-card/50 backdrop-blur-sm border-border/50">
        <CardHeader>
          <CardTitle className="text-2xl text-gradient-primary flex items-center">
            <Star className="w-6 h-6 mr-2" />
            Enhancement Complete!
          </CardTitle>
          <p className="text-muted-foreground">
            Your photos have been enhanced and optimized for maximum dating app success
          </p>
        </CardHeader>
        
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-violet-purple">{results.length}</div>
              <div className="text-sm text-muted-foreground">Photos Enhanced</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-bright-pink">{totalVariants}</div>
              <div className="text-sm text-muted-foreground">Total Variants</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-magenta-glow">
                {Math.round(currentResult.metadata.antiDetectionScore)}%
              </div>
              <div className="text-sm text-muted-foreground">Anti-Detection</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-lavender-soft">
                {Math.round(currentResult.metadata.processingTime / 1000)}s
              </div>
              <div className="text-sm text-muted-foreground">Processing Time</div>
            </div>
          </div>

          {/* Processing Summary */}
          <Card className="bg-muted/20 border-border/30">
            <CardContent className="p-4">
              <h4 className="font-semibold mb-2 flex items-center">
                <Shield className="w-4 h-4 mr-2 text-violet-purple" />
                Anti-Detection Features Applied
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {currentResult.metadata.platformOptimizations.map((opt, index) => (
                  <div key={index} className="flex items-center text-sm">
                    <CheckCircle className="w-4 h-4 text-green-400 mr-2" />
                    {opt}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </CardContent>
      </Card>

      {/* Photo Selection */}
      {results.length > 1 && (
        <Card className="bg-card/50 backdrop-blur-sm border-border/50">
          <CardHeader>
            <CardTitle>Select Photo</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-4">
              {results.map((result, index) => (
                <button
                  key={result.id}
                  onClick={() => setSelectedResult(index)}
                  className={cn(
                    "relative rounded-lg overflow-hidden border-2 transition-all duration-300",
                    selectedResult === index 
                      ? "border-violet-purple shadow-glow-violet" 
                      : "border-border hover:border-violet-purple/50"
                  )}
                >
                  <img
                    src={result.originalPhoto.preview}
                    alt={`Photo ${index + 1}`}
                    className="w-full h-24 object-cover"
                  />
                  <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                    <span className="text-white font-semibold">Photo {index + 1}</span>
                  </div>
                </button>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Platform Variants */}
      <Card className="bg-card/50 backdrop-blur-sm border-border/50">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Smartphone className="w-5 h-5 mr-2" />
            Platform-Optimized Variants
          </CardTitle>
        </CardHeader>
        
        <CardContent>
          <Tabs value={selectedPlatform} onValueChange={(value) => setSelectedPlatform(value as keyof typeof PLATFORM_INFO)}>
            <TabsList className="grid w-full grid-cols-4">
              {Object.entries(PLATFORM_INFO).map(([key, info]) => (
                <TabsTrigger key={key} value={key} className="flex items-center space-x-2">
                  <span>{info.icon}</span>
                  <span className="hidden sm:inline">{info.name}</span>
                </TabsTrigger>
              ))}
            </TabsList>
            
            {Object.entries(PLATFORM_INFO).map(([key, info]) => (
              <TabsContent key={key} value={key} className="space-y-4 mt-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Before/After Comparison */}
                  <Card className="bg-muted/10">
                    <CardHeader>
                      <CardTitle className="text-lg flex items-center">
                        <div className={cn("w-4 h-4 rounded-full mr-2", info.color)} />
                        {info.name} Optimized
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="relative">
                          <img
                            src={currentResult.variants[key as keyof typeof currentResult.variants]}
                            alt={`${info.name} optimized`}
                            className="w-full rounded-lg"
                          />
                          <Badge 
                            className="absolute top-2 right-2 bg-black/70 text-white"
                          >
                            Enhanced
                          </Badge>
                        </div>
                        
                        {showPaywall ? (
                          <div className="space-y-3 text-center p-4 bg-gradient-glow rounded-lg">
                            <div className="flex items-center justify-center space-x-2">
                              <CreditCard className="w-5 h-5 text-violet-purple" />
                              <span className="font-semibold">Unlock High-Resolution Download</span>
                            </div>
                            <p className="text-sm text-muted-foreground">
                              Remove watermarks and access full-quality versions
                            </p>
                            <Button 
                              variant="glow" 
                              onClick={handlePayment}
                              className="w-full"
                            >
                              Unlock for $9.99
                            </Button>
                          </div>
                        ) : (
                          <div className="space-y-3">
                            <Button
                              variant="glow"
                              onClick={() => downloadVariant(
                                currentResult.variants[key as keyof typeof currentResult.variants],
                                `enhanced_${info.name.toLowerCase()}_photo_${selectedResult + 1}.jpg`
                              )}
                              className="w-full"
                            >
                              <Download className="w-4 h-4 mr-2" />
                              Download {info.name} Version
                            </Button>
                            
                            <Button
                              variant="outline"
                              onClick={() => shareVariant(key)}
                              className="w-full"
                            >
                              <Share2 className="w-4 h-4 mr-2" />
                              Share
                            </Button>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>

                  {/* Original Comparison */}
                  <Card className="bg-muted/10">
                    <CardHeader>
                      <CardTitle className="text-lg">Original Photo</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="relative">
                          <img
                            src={currentResult.originalPhoto.preview}
                            alt="Original"
                            className="w-full rounded-lg"
                          />
                          <Badge className="absolute top-2 right-2 bg-black/70 text-white">
                            Original
                          </Badge>
                        </div>
                        
                        <div className="text-center text-sm text-muted-foreground">
                          Compare with the enhanced version to see the improvements
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Platform-Specific Benefits */}
                <Card className="bg-muted/20 border-border/30">
                  <CardContent className="p-4">
                    <h4 className="font-semibold mb-2">{info.name} Optimization Benefits:</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                      {getOptimizationBenefits(key).map((benefit, index) => (
                        <div key={index} className="flex items-center">
                          <CheckCircle className="w-3 h-3 text-green-400 mr-2" />
                          {benefit}
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            ))}
          </Tabs>
        </CardContent>
      </Card>

      {/* Success Tips */}
      <Card className="bg-gradient-glow border-border/50">
        <CardHeader>
          <CardTitle className="text-gradient-primary">Pro Tips for Maximum Success</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <h4 className="font-semibold">Upload Strategy:</h4>
              <ul className="space-y-1 text-sm text-muted-foreground">
                <li>• Use Tinder version for fast-paced swiping</li>
                <li>• Use Bumble version for quality-focused matches</li>
                <li>• Use CMB version for serious relationship seeking</li>
                <li>• Upload during peak hours (7-9 PM)</li>
              </ul>
            </div>
            
            <div className="space-y-2">
              <h4 className="font-semibold">Profile Tips:</h4>
              <ul className="space-y-1 text-sm text-muted-foreground">
                <li>• Mix enhanced photos with lifestyle shots</li>
                <li>• Update profile regularly for algorithm boost</li>
                <li>• Use different variants to test performance</li>
                <li>• Monitor match rates and adjust accordingly</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

const getOptimizationBenefits = (platform: string) => {
  const benefits = {
    tinder: [
      'Fast-loading optimized size',
      'High contrast for mobile viewing',
      'Anti-duplicate detection',
      'Swipe-optimized compression',
    ],
    bumble: [
      'Color accuracy preservation',
      'Profile coherence matching',
      'Quality retention focus',
      'Women-centric optimization',
    ],
    cmb: [
      'Detail preservation priority',
      'Authentic appearance maintained',
      'Consistent style matching',
      'Serious relationship focus',
    ],
    universal: [
      'Cross-platform compatibility',
      'Maximum quality retention',
      'Versatile format support',
      'Broad appeal optimization',
    ],
  };
  
  return benefits[platform as keyof typeof benefits] || [];
};