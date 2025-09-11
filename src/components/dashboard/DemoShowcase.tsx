import React, { useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Sparkles, RefreshCw } from 'lucide-react';
import { useImageEnhancement } from '@/hooks/useImageEnhancement';
import { toast } from 'sonner';

// Import demo image
import demoAsianCasual from '@/assets/demo/demo-asian-casual.jpg';

export type PhotoCategory = 'the-hook' | 'style-confidence' | 'social-proof' | 'passion-hobbies' | 'lifestyle-adventure' | 'personality-closer';

interface DemoState {
  selectedCategory: PhotoCategory | null;
  enhancedPhoto: string | null;
  isProcessing: boolean;
}

const DEMO_PHOTO = {
  id: 'asian-casual',
  src: demoAsianCasual,
  alt: 'Asian male casual portrait'
};

const CATEGORIES = [
  { 
    value: 'the-hook' as PhotoCategory, 
    label: 'The Hook', 
    description: 'Eye-catching first impression' 
  },
  { 
    value: 'style-confidence' as PhotoCategory, 
    label: 'Style & Confidence', 
    description: 'Sharp, sophisticated look' 
  },
  { 
    value: 'social-proof' as PhotoCategory, 
    label: 'Social Proof', 
    description: 'Fun, social situations' 
  },
  { 
    value: 'passion-hobbies' as PhotoCategory, 
    label: 'Passion & Hobbies', 
    description: 'Showing interests & skills' 
  },
  { 
    value: 'lifestyle-adventure' as PhotoCategory, 
    label: 'Lifestyle & Adventure', 
    description: 'Active, adventurous spirit' 
  },
  { 
    value: 'personality-closer' as PhotoCategory, 
    label: 'Personality Closer', 
    description: 'Authentic, approachable vibe' 
  }
];

const DemoShowcase: React.FC = () => {
  const [demoState, setDemoState] = useState<DemoState>({
    selectedCategory: null,
    enhancedPhoto: null,
    isProcessing: false,
  });

  const { enhanceImage, isProcessing } = useImageEnhancement();

  const handleCategorySelect = useCallback((category: PhotoCategory) => {
    setDemoState(prev => ({
      ...prev,
      selectedCategory: category,
      enhancedPhoto: null,
    }));
  }, []);

  const handleTransform = useCallback(async () => {
    if (!demoState.selectedCategory) return;

    setDemoState(prev => ({ ...prev, isProcessing: true }));

    try {
      // Convert image to data URL first
      const img = new Image();
      img.crossOrigin = 'anonymous';
      
      await new Promise((resolve, reject) => {
        img.onload = resolve;
        img.onerror = reject;
        img.src = DEMO_PHOTO.src;
      });

      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d')!;
      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0);
      const imageDataUrl = canvas.toDataURL('image/jpeg', 0.9);

      // Apply category-specific enhancement settings
      const categorySettings = getCategorySettings(demoState.selectedCategory);
      
      const result = await enhanceImage(imageDataUrl, categorySettings, 'preview');
      
      setDemoState(prev => ({
        ...prev,
        enhancedPhoto: result.dataUrl,
        isProcessing: false,
      }));

      toast.success(`Demo transformation complete! This is how "${CATEGORIES.find(c => c.value === demoState.selectedCategory)?.label}" style looks.`);
    } catch (error) {
      console.error('Demo enhancement failed:', error);
      setDemoState(prev => ({ ...prev, isProcessing: false }));
      toast.error('Demo transformation failed. Please try again.');
    }
  }, [demoState.selectedCategory, enhanceImage]);

  const handleReset = useCallback(() => {
    setDemoState({
      selectedCategory: null,
      enhancedPhoto: null,
      isProcessing: false,
    });
  }, []);

  const getCategorySettings = (category: PhotoCategory) => {
    const baseSettings = {
      lighting: 60,
      skinSmoothing: 40,
      eyeEnhancement: 50,
      teethWhitening: 30,
      backgroundBlur: 10,
      saturation: 110,
      contrast: 105,
      brightness: 102,
    };

    // Customize based on category
    switch (category) {
      case 'the-hook':
        return { ...baseSettings, eyeEnhancement: 70, teethWhitening: 50 };
      case 'style-confidence':
        return { ...baseSettings, contrast: 115, saturation: 120 };
      case 'social-proof':
        return { ...baseSettings, brightness: 108, backgroundBlur: 5 };
      case 'passion-hobbies':
        return { ...baseSettings, saturation: 115, lighting: 70 };
      case 'lifestyle-adventure':
        return { ...baseSettings, contrast: 110, brightness: 105 };
      case 'personality-closer':
        return { ...baseSettings, skinSmoothing: 30, eyeEnhancement: 40 };
      default:
        return baseSettings;
    }
  };

  return (
    <div className="mb-6 bg-muted/30 rounded-lg border border-border/50 p-4 max-h-[120px] overflow-hidden">
      {/* Header with Demo Badge */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="text-xs px-2 py-0.5 bg-violet-purple/10 text-violet-purple border-violet-purple/30">
            Demo
          </Badge>
          <span className="text-xs text-muted-foreground">Try AI enhancement - no credits needed</span>
        </div>
        {demoState.selectedCategory && (
          <Button
            variant="ghost"
            size="sm"
            onClick={handleReset}
            className="h-6 px-2 text-xs text-muted-foreground hover:text-foreground"
          >
            <RefreshCw className="w-3 h-3 mr-1" />
            Reset
          </Button>
        )}
      </div>

      {/* Simplified 2-Step Flow */}
      <div className="flex items-start gap-6 h-[80px]">
        
        {/* Step 1: Demo Photo with Style Selection */}
        <div className="flex-shrink-0">
          <div className="flex items-center gap-1 mb-2">
            <div className="w-5 h-5 rounded-full bg-primary text-primary-foreground text-xs flex items-center justify-center font-medium">1</div>
            <span className="text-xs text-muted-foreground">Sample photo</span>
          </div>
          <div className="space-y-2">
            {/* Demo Photo */}
            <div className="w-16 h-16 rounded-md overflow-hidden border-2 border-border/50">
              <img
                src={DEMO_PHOTO.src}
                alt={DEMO_PHOTO.alt}
                className="w-full h-full object-cover"
              />
            </div>
            
            {/* Category Selection underneath */}
            <Select 
              value={demoState.selectedCategory || ''} 
              onValueChange={handleCategorySelect}
            >
              <SelectTrigger className="w-36 h-8 text-xs">
                <SelectValue placeholder="Pick style" />
              </SelectTrigger>
              <SelectContent>
                {CATEGORIES.map((category) => (
                  <SelectItem key={category.value} value={category.value} className="text-xs">
                    {category.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Step 2: Transform Button & Result */}
        <div className="flex-1">
          <div className="flex items-center gap-1 mb-2">
            <div className="w-5 h-5 rounded-full bg-primary text-primary-foreground text-xs flex items-center justify-center font-medium">2</div>
            <span className="text-xs text-muted-foreground">Transform & result</span>
          </div>
          
          <div className="flex items-start gap-3">
            {/* Transform Button */}
            <Button
              onClick={handleTransform}
              disabled={!demoState.selectedCategory || demoState.isProcessing}
              size="sm"
              className="h-8 px-3 text-xs"
            >
              {demoState.isProcessing ? (
                <>
                  <RefreshCw className="h-3 w-3 animate-spin mr-1" />
                  Processing
                </>
              ) : (
                <>
                  <Sparkles className="h-3 w-3 mr-1" />
                  Transform
                </>
              )}
            </Button>
            
            {/* After Result Only */}
            {demoState.enhancedPhoto ? (
              <div className="text-center">
                <p className="text-xs text-muted-foreground mb-1">Enhanced</p>
                <div className="w-16 h-16 rounded-md overflow-hidden border-2 border-primary/50 shadow-sm">
                  <img
                    src={demoState.enhancedPhoto}
                    alt="Enhanced result"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            ) : (
              <div className="w-16 h-16 rounded-md border-2 border-dashed border-border/30 flex items-center justify-center">
                <span className="text-xs text-muted-foreground">Result</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Success message */}
      {demoState.enhancedPhoto && (
        <div className="mt-2 text-center">
          <p className="text-xs text-green-600 font-medium">
            ✨ Try with your photos below!
          </p>
        </div>
      )}
    </div>
  );
};

export default DemoShowcase;