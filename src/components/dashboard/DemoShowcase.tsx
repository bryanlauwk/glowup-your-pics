import React, { useState, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Sparkles, RefreshCw, ArrowRight } from 'lucide-react';
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
    <Card className="mb-8 bg-gradient-to-r from-violet-purple/5 to-electric-cyan/5 border-violet-purple/20">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-lg font-semibold text-gradient-primary flex items-center gap-2">
              <Sparkles className="w-5 h-5" />
              Try Our AI Demo
            </CardTitle>
            <p className="text-sm text-muted-foreground mt-1">
              Select a demo photo and category to see instant transformation
            </p>
          </div>
          <Badge variant="outline" className="bg-green-500/10 text-green-600 border-green-500/30">
            No Credits Required
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent>
        {/* 3-Column Layout */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Column 1: Photo Selection */}
          <div className="space-y-3">
            <h4 className="text-sm font-medium text-foreground text-center">Pick a Photo</h4>
            <div className="space-y-3">
              {DEMO_PHOTOS.map((photo) => (
                <div
                  key={photo.id}
                  className={`relative cursor-pointer rounded-lg overflow-hidden border-2 transition-all duration-200 ${
                    demoState.selectedPhoto?.id === photo.id
                      ? 'border-violet-purple shadow-lg'
                      : 'border-border hover:border-violet-purple/50'
                  }`}
                  onClick={() => handlePhotoSelect(photo)}
                >
                  <img
                    src={photo.src}
                    alt={photo.alt}
                    className="w-full h-24 object-cover"
                  />
                  {demoState.selectedPhoto?.id === photo.id && (
                    <div className="absolute inset-0 bg-violet-purple/20 flex items-center justify-center">
                      <div className="w-6 h-6 bg-violet-purple rounded-full flex items-center justify-center">
                        <ArrowRight className="w-3 h-3 text-white" />
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Column 2: Enhancement Controls */}
          <div className="space-y-4">
            <h4 className="text-sm font-medium text-foreground text-center">Transform</h4>
            
            {/* Drag Area */}
            <div className={`border-2 border-dashed rounded-lg p-6 transition-all duration-200 ${
              demoState.selectedPhoto 
                ? 'border-violet-purple/50 bg-violet-purple/5' 
                : 'border-border bg-muted/50'
            }`}>
              <div className="text-center space-y-3">
                {demoState.selectedPhoto ? (
                  <div className="space-y-2">
                    <img
                      src={demoState.selectedPhoto.src}
                      alt="Selected"
                      className="w-16 h-16 object-cover rounded-lg mx-auto border-2 border-violet-purple"
                    />
                    <p className="text-xs text-muted-foreground">Photo Selected!</p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <div className="w-16 h-16 bg-muted rounded-lg mx-auto flex items-center justify-center">
                      <ArrowRight className="w-6 h-6 text-muted-foreground" />
                    </div>
                    <p className="text-xs text-muted-foreground">Pick a photo first</p>
                  </div>
                )}
              </div>
            </div>

            {/* Category Selection */}
            <Select value={demoState.selectedCategory || ''} onValueChange={handleCategorySelect}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Choose style..." />
              </SelectTrigger>
              <SelectContent>
                {CATEGORIES.map((category) => (
                  <SelectItem key={category.value} value={category.value}>
                    <div className="flex flex-col">
                      <span className="font-medium">{category.label}</span>
                      <span className="text-xs text-muted-foreground">{category.description}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Transform Button */}
            <Button
              onClick={handleTransform}
              disabled={!demoState.selectedPhoto || !demoState.selectedCategory || demoState.isProcessing}
              className="w-full bg-gradient-primary hover:bg-gradient-primary/90 text-white"
            >
              {demoState.isProcessing ? (
                <>
                  <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                  Transforming...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 mr-2" />
                  Transform
                </>
              )}
            </Button>

            {(demoState.selectedPhoto || demoState.selectedCategory) && (
              <Button variant="outline" onClick={handleReset} className="w-full">
                <RefreshCw className="w-4 h-4 mr-2" />
                Reset
              </Button>
            )}
          </div>

          {/* Column 3: Results */}
          <div className="space-y-3">
            <h4 className="text-sm font-medium text-foreground text-center">Results</h4>
            
            <div className="space-y-3">
              <div className="space-y-2">
                <p className="text-xs text-muted-foreground text-center">Before</p>
                <div className="relative rounded-lg overflow-hidden border aspect-square">
                  {demoState.selectedPhoto ? (
                    <img
                      src={demoState.selectedPhoto.src}
                      alt="Original"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-muted flex items-center justify-center">
                      <p className="text-xs text-muted-foreground">Original</p>
                    </div>
                  )}
                </div>
              </div>
              
              <div className="space-y-2">
                <p className="text-xs text-muted-foreground text-center">After</p>
                <div className="relative rounded-lg overflow-hidden border aspect-square">
                  {demoState.enhancedPhoto ? (
                    <img
                      src={demoState.enhancedPhoto}
                      alt="Enhanced"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-muted flex items-center justify-center">
                      <p className="text-xs text-muted-foreground">Enhanced</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
            
            {demoState.enhancedPhoto && (
              <div className="text-center p-3 bg-green-500/10 rounded-lg border border-green-500/20">
                <p className="text-xs font-medium text-green-700 dark:text-green-400">
                  ✨ Try with your photos below!
                </p>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default DemoShowcase;