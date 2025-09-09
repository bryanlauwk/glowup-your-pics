import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Eye, EyeOff, Download, Share2, Zap, Shield } from 'lucide-react';
import { EnhancementSettings } from '@/hooks/useImageEnhancement';
import { PlatformVariant } from '@/hooks/useAntiDetection';

interface BeforeAfterComparisonProps {
  originalImage: string;
  enhancedImage: string;
  settings: EnhancementSettings;
  identitySimilarity: number;
  platformVariants?: PlatformVariant[];
  className?: string;
}

export const BeforeAfterComparison = ({
  originalImage,
  enhancedImage,
  settings,
  identitySimilarity,
  platformVariants = [],
  className,
}: BeforeAfterComparisonProps) => {
  const [showComparison, setShowComparison] = useState(true);
  const [selectedPlatform, setSelectedPlatform] = useState<string>('enhanced');

  const getDisplayImage = () => {
    if (selectedPlatform === 'enhanced') return enhancedImage;
    const variant = platformVariants.find(v => v.platform === selectedPlatform);
    return variant?.dataUrl || enhancedImage;
  };

  const getSimilarityColor = (similarity: number) => {
    if (similarity >= 85) return 'text-green-600';
    if (similarity >= 70) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getSimilarityBadgeVariant = (similarity: number) => {
    if (similarity >= 85) return 'default';
    if (similarity >= 70) return 'secondary';
    return 'destructive';
  };

  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = getDisplayImage();
    link.download = `enhanced-photo-${selectedPlatform}-${Date.now()}.jpg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleShare = () => {
    if (navigator.share) {
      // Convert data URL to blob for sharing
      fetch(getDisplayImage())
        .then(res => res.blob())
        .then(blob => {
          const file = new File([blob], 'enhanced-photo.jpg', { type: 'image/jpeg' });
          navigator.share({
            title: 'Enhanced Photo',
            text: 'Check out my enhanced dating profile photo!',
            files: [file],
          });
        });
    }
  };

  return (
    <Card className={className}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5" />
            Enhanced Result
          </CardTitle>
          <div className="flex items-center gap-2">
            <Badge variant={getSimilarityBadgeVariant(identitySimilarity)}>
              Identity: {identitySimilarity}%
            </Badge>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowComparison(!showComparison)}
            >
              {showComparison ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              {showComparison ? 'Hide' : 'Show'} Comparison
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Platform Selection */}
        <div className="flex flex-wrap gap-2">
          <Button
            variant={selectedPlatform === 'enhanced' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setSelectedPlatform('enhanced')}
          >
            Enhanced
          </Button>
          {platformVariants.map(variant => (
            <Button
              key={variant.platform}
              variant={selectedPlatform === variant.platform ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedPlatform(variant.platform)}
              className="capitalize"
            >
              {variant.platform}
            </Button>
          ))}
        </div>

        {/* Image Comparison */}
        <div className="space-y-4">
          {showComparison ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Before */}
              <div className="space-y-2">
                <h4 className="font-medium text-sm text-muted-foreground">Before</h4>
                <div className="relative overflow-hidden rounded-lg border">
                  <img
                    src={originalImage}
                    alt="Original photo"
                    className="w-full h-64 object-cover"
                  />
                  <div className="absolute top-2 left-2">
                    <Badge variant="secondary">Original</Badge>
                  </div>
                </div>
              </div>

              {/* After */}
              <div className="space-y-2">
                <h4 className="font-medium text-sm text-muted-foreground">After</h4>
                <div className="relative overflow-hidden rounded-lg border">
                  <img
                    src={getDisplayImage()}
                    alt="Enhanced photo"
                    className="w-full h-64 object-cover"
                  />
                  <div className="absolute top-2 left-2">
                    <Badge variant="default" className="capitalize">
                      {selectedPlatform}
                    </Badge>
                  </div>
                  {platformVariants.length > 0 && (
                    <div className="absolute top-2 right-2">
                      <Badge variant="outline" className="bg-background/80">
                        <Shield className="h-3 w-3 mr-1" />
                        Protected
                      </Badge>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-2">
              <h4 className="font-medium text-sm text-muted-foreground">Enhanced Photo</h4>
              <div className="relative overflow-hidden rounded-lg border">
                <img
                  src={getDisplayImage()}
                  alt="Enhanced photo"
                  className="w-full h-80 object-cover"
                />
                <div className="absolute top-2 left-2">
                  <Badge variant="default" className="capitalize">
                    {selectedPlatform}
                  </Badge>
                </div>
              </div>
            </div>
          )}
        </div>

        <Separator />

        {/* Enhancement Details */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          <div>
            <span className="text-muted-foreground">Lighting</span>
            <div className="font-medium">{settings.lighting}%</div>
          </div>
          <div>
            <span className="text-muted-foreground">Skin Smoothing</span>
            <div className="font-medium">{settings.skinSmoothing}%</div>
          </div>
          <div>
            <span className="text-muted-foreground">Eye Enhancement</span>
            <div className="font-medium">{settings.eyeEnhancement}%</div>
          </div>
          <div>
            <span className="text-muted-foreground">Teeth Whitening</span>
            <div className="font-medium">{settings.teethWhitening}%</div>
          </div>
        </div>

        {/* Platform Specific Info */}
        {selectedPlatform !== 'enhanced' && platformVariants.length > 0 && (
          <>
            <Separator />
            <div className="space-y-2">
              <h4 className="font-medium text-sm">Anti-Detection Features</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                {(() => {
                  const variant = platformVariants.find(v => v.platform === selectedPlatform);
                  return variant ? (
                    <>
                      <div>
                        <span className="text-muted-foreground">File Size</span>
                        <div className="font-medium">{Math.round(variant.fileSize / 1024)} KB</div>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Hash</span>
                        <div className="font-mono text-xs">{variant.hash.substring(0, 8)}...</div>
                      </div>
                      <div className="md:col-span-2">
                        <span className="text-muted-foreground">Modifications</span>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {variant.modifications.map((mod, idx) => (
                            <Badge key={idx} variant="outline" className="text-xs">
                              {mod}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </>
                  ) : null;
                })()}
              </div>
            </div>
          </>
        )}

        <Separator />

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-2">
          <Button onClick={handleDownload} className="flex-1 sm:flex-none">
            <Download className="h-4 w-4 mr-2" />
            Download
          </Button>
          {navigator.share && (
            <Button variant="outline" onClick={handleShare} className="flex-1 sm:flex-none">
              <Share2 className="h-4 w-4 mr-2" />
              Share
            </Button>
          )}
        </div>

        {/* Identity Warning */}
        {identitySimilarity < 80 && (
          <div className="p-3 rounded-lg bg-yellow-50 border border-yellow-200">
            <p className="text-sm text-yellow-800">
              ⚠️ Identity similarity is below 80%. Consider using more conservative enhancement settings.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};