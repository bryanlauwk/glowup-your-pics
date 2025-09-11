import React, { useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Sparkles, RefreshCw } from 'lucide-react';
import { useImageEnhancement } from '@/hooks/useImageEnhancement';
import { toast } from 'sonner';

// Import demo images
import demoAsian1 from '@/assets/demo/demo-asian-1.jpg';
import demoAsian2 from '@/assets/demo/demo-asian-2.jpg';
import demoAsian3 from '@/assets/demo/demo-asian-3.jpg';

export type PhotoCategory = 'the-hook' | 'style-confidence' | 'social-proof' | 'passion-hobbies' | 'lifestyle-adventure' | 'personality-closer';

interface DemoPhoto {
  id: string;
  src: string;
  alt: string;
}

interface DemoState {
  selectedPhoto: DemoPhoto | null;
  selectedCategory: PhotoCategory | null;
  enhancedPhoto: string | null;
  isProcessing: boolean;
}

const DEMO_PHOTOS: DemoPhoto[] = [
  { id: 'demo1', src: demoAsian1, alt: 'Casual selfie' },
  { id: 'demo2', src: demoAsian2, alt: 'Street photo' },
  { id: 'demo3', src: demoAsian3, alt: 'Indoor shot' },
];

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
    selectedPhoto: null,
    selectedCategory: null,
    enhancedPhoto: null,
    isProcessing: false,
  });

  const { enhanceImage, isProcessing } = useImageEnhancement();

  const handlePhotoSelect = useCallback((photo: DemoPhoto) => {
    setDemoState(prev => ({
      ...prev,
      selectedPhoto: photo,
      enhancedPhoto: null,
    }));
  }, []);

  const handleCategorySelect = useCallback((category: PhotoCategory) => {
    setDemoState(prev => ({
      ...prev,
      selectedCategory: category,
      enhancedPhoto: null,
    }));
  }, []);

  const handleTransform = useCallback(async () => {
    if (!demoState.selectedPhoto || !demoState.selectedCategory) return;

    setDemoState(prev => ({ ...prev, isProcessing: true }));

    try {
      // Convert image to data URL first
      const img = new Image();
      img.crossOrigin = 'anonymous';
      
      await new Promise((resolve, reject) => {
        img.onload = resolve;
        img.onerror = reject;
        img.src = demoState.selectedPhoto!.src;
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
  }, [demoState.selectedPhoto, demoState.selectedCategory, enhanceImage]);

  const handleReset = useCallback(() => {
    setDemoState({
      selectedPhoto: null,
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
        {(demoState.selectedPhoto || demoState.selectedCategory) && (
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

      {/* Compact 3-Step Flow */}
      <div className="flex items-center gap-4 h-[80px]">
        
        {/* Step 1: Photo Selection - Horizontal thumbnails */}
        <div className="flex-shrink-0">
          <div className="flex items-center gap-1">
            <div className="w-6 h-6 bg-primary/10 text-primary rounded-full flex items-center justify-center text-xs font-medium mr-2">
              1
            </div>
            <div className="flex gap-2">
              {DEMO_PHOTOS.map((photo) => (
                <div
                  key={photo.id}
                  className={`relative cursor-pointer rounded-md overflow-hidden border-2 transition-all duration-200 w-12 h-12 ${
                    demoState.selectedPhoto?.id === photo.id
                      ? 'border-violet-purple ring-2 ring-violet-purple/20'
                      : 'border-border hover:border-violet-purple/50'
                  }`}
                  onClick={() => handlePhotoSelect(photo)}
                >
                  <img
                    src={photo.src}
                    alt={photo.alt}
                    className="w-full h-full object-cover"
                  />
                  {demoState.selectedPhoto?.id === photo.id && (
                    <div className="absolute inset-0 bg-violet-purple/20 flex items-center justify-center">
                      <div className="w-3 h-3 bg-violet-purple rounded-full" />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Step 2: Transform Controls - Inline */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-primary/10 text-primary rounded-full flex items-center justify-center text-xs font-medium">
              2
            </div>
            <div className="flex items-center gap-2 flex-1">
              <Select 
                value={demoState.selectedCategory || ''} 
                onValueChange={handleCategorySelect}
                disabled={!demoState.selectedPhoto}
              >
                <SelectTrigger className="h-8 text-xs min-w-[140px]">
                  <SelectValue placeholder="Pick style..." />
                </SelectTrigger>
                <SelectContent>
                  {CATEGORIES.map((category) => (
                    <SelectItem key={category.value} value={category.value}>
                      <span className="text-xs">{category.label}</span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              <Button
                onClick={handleTransform}
                disabled={!demoState.selectedPhoto || !demoState.selectedCategory || demoState.isProcessing}
                size="sm"
                className="h-8 px-3 text-xs bg-gradient-primary hover:bg-gradient-primary/90 text-white"
              >
                {demoState.isProcessing ? (
                  <>
                    <RefreshCw className="w-3 h-3 mr-1 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-3 h-3 mr-1" />
                    Transform
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>

        {/* Step 3: Before/After Results - Side by side */}
        <div className="flex-shrink-0">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-primary/10 text-primary rounded-full flex items-center justify-center text-xs font-medium">
              3
            </div>
            <div className="flex gap-2">
              {/* Before */}
              <div className="text-center">
                <p className="text-xs text-muted-foreground mb-1">Before</p>
                <div className="w-12 h-12 rounded-md overflow-hidden border bg-muted">
                  {demoState.selectedPhoto ? (
                    <img
                      src={demoState.selectedPhoto.src}
                      alt="Before"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <div className="w-2 h-2 bg-muted-foreground/30 rounded" />
                    </div>
                  )}
                </div>
              </div>
              
              {/* After */}
              <div className="text-center">
                <p className="text-xs text-muted-foreground mb-1">After</p>
                <div className="w-12 h-12 rounded-md overflow-hidden border bg-muted relative">
                  {demoState.enhancedPhoto ? (
                    <img
                      src={demoState.enhancedPhoto}
                      alt="After"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <div className="w-2 h-2 bg-muted-foreground/30 rounded" />
                    </div>
                  )}
                  {demoState.enhancedPhoto && (
                    <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full border border-background" />
                  )}
                </div>
              </div>
            </div>
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