import React, { useState, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { CheckCircle, XCircle, Zap, Sparkles, Download, ArrowLeft } from 'lucide-react';
import { cn } from '@/lib/utils';
import { usePhotoEnhancement } from '@/hooks/usePhotoEnhancement';
import { useCredits } from '@/hooks/useCredits';
import { logger } from '@/lib/logger';

interface SwipeBoostEngineProps {
  imageDataUrl: string;
  photoCategory: string;
  enhancementTheme: string;
  onResults?: (results: any) => void;
  onBack?: () => void;
}

export const SwipeBoostEngine: React.FC<SwipeBoostEngineProps> = ({
  imageDataUrl,
  photoCategory,
  enhancementTheme,
  onResults,
  onBack,
}) => {
  const [enhancedImage, setEnhancedImage] = useState<string | null>(null);
  const { isProcessing, error, progress, enhancePhoto } = usePhotoEnhancement();
  const { credits } = useCredits();

  const processPhoto = useCallback(async () => {
    if (credits < 1) {
      alert('Insufficient credits. Please purchase more credits to enhance photos.');
      return;
    }

    try {
      const result = await enhancePhoto(imageDataUrl, photoCategory, enhancementTheme);
      setEnhancedImage(result.enhancedImageUrl);
      onResults?.(result);
    } catch (error) {
      logger.error('Processing failed', { error, component: 'SwipeBoostEngine', action: 'processPhoto' });
    }
  }, [imageDataUrl, photoCategory, enhancementTheme, enhancePhoto, onResults, credits]);

  const downloadImage = useCallback(() => {
    if (!enhancedImage) return;
    
    const link = document.createElement('a');
    link.href = enhancedImage;
    link.download = `enhanced-${photoCategory}-${Date.now()}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }, [enhancedImage, photoCategory]);

  return (
    <div className="space-y-6">
      <Card className="bg-card/50 backdrop-blur-sm border-border/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Sparkles className="w-5 h-5 text-violet-purple" />
            Photo Makeover Studio
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-center space-y-2">
            <p className="text-sm text-muted-foreground">
              Transform your photo with AI-powered enhancement
            </p>
            <Badge variant="outline" className="text-xs">
              Credits available: {credits}
            </Badge>
          </div>
          
          <div className="space-y-3">
            <Button 
              onClick={processPhoto}
              disabled={isProcessing || credits < 1}
              className="w-full bg-gradient-primary hover:shadow-glow-violet transition-all duration-300"
              size="lg"
            >
              {isProcessing ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                  Creating Your Perfect Photo...
                </>
              ) : credits < 1 ? (
                <>
                  <XCircle className="w-4 h-4 mr-2" />
                  Insufficient Credits
                </>
              ) : (
                <>
                  <Zap className="w-4 h-4 mr-2" />
                  Transform My Photo (1 Credit)
                </>
              )}
            </Button>

            {onBack && (
              <Button
                onClick={onBack}
                variant="outline"
                className="w-full"
                disabled={isProcessing}
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Lineup
              </Button>
            )}
          </div>
          
          {error && (
            <div className="p-3 bg-destructive/10 border border-destructive/30 rounded-lg">
              <p className="text-sm text-destructive">{error}</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Processing Progress */}
      {isProcessing && (
        <Card className="bg-card/50 backdrop-blur-sm border-border/50">
          <CardContent className="p-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold">Transforming Your Photo</h3>
                <span className="text-sm text-muted-foreground">{Math.round(progress)}%</span>
              </div>
              <Progress value={progress} className="h-2" />
              <div className="text-center">
                <p className="text-sm text-muted-foreground">
                  Our AI is creating your perfect dating profile photo...
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Enhanced Photo Result */}
      {enhancedImage && (
        <Card className="bg-gradient-to-br from-violet-purple/10 to-hot-pink/10 border-violet-purple/30">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-green-500" />
              Your Irresistible Photo
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Before */}
              <div className="space-y-2">
                <p className="text-sm font-medium text-muted-foreground">BEFORE</p>
                <img 
                  src={imageDataUrl} 
                  alt="Original"
                  className="w-full aspect-square object-cover rounded-lg"
                />
              </div>
              
              {/* After */}
              <div className="space-y-2">
                <p className="text-sm font-medium text-violet-purple">AFTER ✨</p>
                <img 
                  src={enhancedImage} 
                  alt="Enhanced"
                  className="w-full aspect-square object-cover rounded-lg shadow-glow-violet"
                />
              </div>
            </div>
            
            <div className="text-center space-y-4">
              <div className="p-4 bg-green-500/10 border border-green-500/30 rounded-lg">
                <p className="text-sm text-green-600 dark:text-green-400 font-medium">
                  🎉 Perfect! This photo will get you more matches
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  Your photo has been optimized with {enhancementTheme.replace(/-/g, ' ')} styling for maximum appeal
                </p>
              </div>
              
              <div className="flex gap-2">
                <Button 
                  onClick={downloadImage}
                  className="flex-1 bg-gradient-primary hover:shadow-glow-violet"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Download Photo
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => onResults?.({ enhancedImageUrl: enhancedImage })}
                  className="flex-1"
                >
                  Continue to Next Photo
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};