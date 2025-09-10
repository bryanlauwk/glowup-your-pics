import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Sparkles, Eye, Smile, Sun, Focus, Palette } from 'lucide-react';
import { EnhancementSettings, useImageEnhancement } from '@/hooks/useImageEnhancement';

interface EnhancementControlsProps {
  imageDataUrl: string;
  onEnhancementChange: (enhancedImage: string, settings: EnhancementSettings, similarity: number) => void;
  className?: string;
}

export const EnhancementControls = ({ 
  imageDataUrl, 
  onEnhancementChange, 
  className 
}: EnhancementControlsProps) => {
  const { enhanceImage, isProcessing, defaultSettings } = useImageEnhancement();
  const [settings, setSettings] = useState<EnhancementSettings>(defaultSettings);
  const [identitySimilarity, setIdentitySimilarity] = useState(95);

  const handleSettingChange = async (key: keyof EnhancementSettings, value: number) => {
    const newSettings = { ...settings, [key]: value };
    setSettings(newSettings);
    
    try {
      const result = await enhanceImage(imageDataUrl, newSettings, 'preview');
      setIdentitySimilarity(result.identitySimilarity);
      onEnhancementChange(result.dataUrl, newSettings, result.identitySimilarity);
    } catch (error) {
      logger.error('Enhancement failed', { error, component: 'EnhancementControls', action: 'handleBoostPhoto' });
    }
  };

  const resetSettings = async () => {
    setSettings(defaultSettings);
    try {
      const result = await enhanceImage(imageDataUrl, defaultSettings, 'preview');
      setIdentitySimilarity(result.identitySimilarity);
      onEnhancementChange(result.dataUrl, defaultSettings, result.identitySimilarity);
    } catch (error) {
      logger.error('Enhancement failed', { error, component: 'EnhancementControls', action: 'handleEnhancePhoto' });
    }
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

  return (
    <Card className={className}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5" />
            Enhancement Controls
          </CardTitle>
          <div className="flex items-center gap-2">
            <Badge variant={getSimilarityBadgeVariant(identitySimilarity)}>
              Identity: {identitySimilarity}%
            </Badge>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={resetSettings}
              disabled={isProcessing}
            >
              Reset
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Lighting Controls */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Sun className="h-4 w-4" />
            <span className="font-medium">Lighting Enhancement</span>
            <Badge variant="outline">{settings.lighting}</Badge>
          </div>
          <Slider
            value={[settings.lighting]}
            onValueChange={([value]) => handleSettingChange('lighting', value)}
            max={100}
            step={1}
            disabled={isProcessing}
            className="w-full"
          />
        </div>

        <Separator />

        {/* Skin Enhancement */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Smile className="h-4 w-4" />
            <span className="font-medium">Skin Smoothing</span>
            <Badge variant="outline">{settings.skinSmoothing}</Badge>
          </div>
          <Slider
            value={[settings.skinSmoothing]}
            onValueChange={([value]) => handleSettingChange('skinSmoothing', value)}
            max={100}
            step={1}
            disabled={isProcessing}
            className="w-full"
          />
        </div>

        <Separator />

        {/* Eye Enhancement */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Eye className="h-4 w-4" />
            <span className="font-medium">Eye Enhancement</span>
            <Badge variant="outline">{settings.eyeEnhancement}</Badge>
          </div>
          <Slider
            value={[settings.eyeEnhancement]}
            onValueChange={([value]) => handleSettingChange('eyeEnhancement', value)}
            max={100}
            step={1}
            disabled={isProcessing}
            className="w-full"
          />
        </div>

        <Separator />

        {/* Teeth Whitening */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Sparkles className="h-4 w-4" />
            <span className="font-medium">Teeth Whitening</span>
            <Badge variant="outline">{settings.teethWhitening}</Badge>
          </div>
          <Slider
            value={[settings.teethWhitening]}
            onValueChange={([value]) => handleSettingChange('teethWhitening', value)}
            max={100}
            step={1}
            disabled={isProcessing}
            className="w-full"
          />
        </div>

        <Separator />

        {/* Background Blur */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Focus className="h-4 w-4" />
            <span className="font-medium">Background Blur</span>
            <Badge variant="outline">{settings.backgroundBlur}</Badge>
          </div>
          <Slider
            value={[settings.backgroundBlur]}
            onValueChange={([value]) => handleSettingChange('backgroundBlur', value)}
            max={100}
            step={1}
            disabled={isProcessing}
            className="w-full"
          />
        </div>

        <Separator />

        {/* Color Adjustments */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Palette className="h-4 w-4" />
            <span className="font-medium">Color Adjustments</span>
          </div>
          
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm">Saturation</span>
              <Badge variant="outline">{settings.saturation}%</Badge>
            </div>
            <Slider
              value={[settings.saturation]}
              onValueChange={([value]) => handleSettingChange('saturation', value)}
              min={50}
              max={150}
              step={1}
              disabled={isProcessing}
              className="w-full"
            />
          </div>
          
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm">Contrast</span>
              <Badge variant="outline">{settings.contrast}%</Badge>
            </div>
            <Slider
              value={[settings.contrast]}
              onValueChange={([value]) => handleSettingChange('contrast', value)}
              min={50}
              max={150}
              step={1}
              disabled={isProcessing}
              className="w-full"
            />
          </div>
          
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm">Brightness</span>
              <Badge variant="outline">{settings.brightness}%</Badge>
            </div>
            <Slider
              value={[settings.brightness]}
              onValueChange={([value]) => handleSettingChange('brightness', value)}
              min={50}
              max={150}
              step={1}
              disabled={isProcessing}
              className="w-full"
            />
          </div>
        </div>

        {/* Identity Warning */}
        {identitySimilarity < 80 && (
          <div className="p-3 rounded-lg bg-yellow-50 border border-yellow-200">
            <p className="text-sm text-yellow-800">
              ⚠️ High enhancement levels may affect identity similarity. Consider reducing some settings.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};