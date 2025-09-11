import React, { useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Sparkles, RefreshCw } from 'lucide-react';
import { useSceneTransformation } from '@/hooks/useSceneTransformation';
import { toast } from 'sonner';

// Import demo image
import demoAsianCasual from '@/assets/demo/demo-asian-casual.jpg';

export type PhotoCategory = 'passion-hobbies' | 'social-proof' | 'lifestyle-adventure' | 'professional';

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
    value: 'passion-hobbies' as PhotoCategory, 
    label: 'Passion & Hobbies', 
    description: 'Transform into sports & hobby scenes' 
  },
  { 
    value: 'social-proof' as PhotoCategory, 
    label: 'Social Proof', 
    description: 'Show yourself with friends socializing' 
  },
  { 
    value: 'lifestyle-adventure' as PhotoCategory, 
    label: 'Adventure & Travel', 
    description: 'Create epic outdoor lifestyle shots' 
  },
  { 
    value: 'professional' as PhotoCategory, 
    label: 'Professional Scene', 
    description: 'Executive presence in business settings' 
  }
];

const DemoShowcase: React.FC = () => {
  const [demoState, setDemoState] = useState<DemoState>({
    selectedCategory: null,
    enhancedPhoto: null,
    isProcessing: false,
  });

  const { transformScene, isProcessing } = useSceneTransformation();

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

      // Transform scene with AI
      const result = await transformScene(imageDataUrl, demoState.selectedCategory);
      
      setDemoState(prev => ({
        ...prev,
        enhancedPhoto: result.enhancedImageUrl,
        isProcessing: false,
      }));

      toast.success(`🎉 Scene transformed! From headshot to "${CATEGORIES.find(c => c.value === demoState.selectedCategory)?.label}" lifestyle photo!`);
    } catch (error) {
      console.error('Demo scene transformation failed:', error);
      setDemoState(prev => ({ ...prev, isProcessing: false }));
      toast.error('Demo transformation failed. Please try again.');
    }
  }, [demoState.selectedCategory, transformScene]);

  const handleReset = useCallback(() => {
    setDemoState({
      selectedCategory: null,
      enhancedPhoto: null,
      isProcessing: false,
    });
  }, []);


  return (
    <div className="mb-6 bg-muted/30 rounded-lg border border-border/50 p-6">
      {/* Header with Demo Badge */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="text-xs px-2 py-0.5 bg-violet-purple/10 text-violet-purple border-violet-purple/30">
            Demo
          </Badge>
          <span className="text-sm text-muted-foreground">Try AI scene transformation - no credits needed</span>
        </div>
        {demoState.selectedCategory && (
          <Button
            variant="ghost"
            size="sm"
            onClick={handleReset}
            className="h-8 px-3 text-sm text-muted-foreground hover:text-foreground"
          >
            <RefreshCw className="w-4 h-4 mr-1" />
            Reset
          </Button>
        )}
      </div>

      {/* Horizontal Layout: Photo → Controls → Result */}
      <div className="flex items-center gap-8">
        
        {/* Demo Photo */}
        <div className="flex-shrink-0">
          <div className="w-24 h-24 rounded-lg overflow-hidden border-2 border-border/50 shadow-sm">
            <img
              src={DEMO_PHOTO.src}
              alt={DEMO_PHOTO.alt}
              className="w-full h-full object-cover"
            />
          </div>
          
          {/* Category Selection underneath */}
          <div className="mt-3">
            <Select 
              value={demoState.selectedCategory || ''} 
              onValueChange={handleCategorySelect}
            >
              <SelectTrigger className="w-24 h-9 text-xs">
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

        {/* Arrow */}
        <div className="flex-shrink-0 text-muted-foreground">
          <div className="text-2xl">→</div>
        </div>

        {/* Controls */}
        <div className="flex-shrink-0">
          <Button
            onClick={handleTransform}
            disabled={!demoState.selectedCategory || demoState.isProcessing}
            className="h-12 px-6"
          >
            {demoState.isProcessing ? (
              <>
                <RefreshCw className="h-4 w-4 animate-spin mr-2" />
                Processing...
              </>
            ) : (
              <>
                <Sparkles className="h-4 w-4 mr-2" />
                Create Scene
              </>
            )}
          </Button>
        </div>

        {/* Arrow */}
        <div className="flex-shrink-0 text-muted-foreground">
          <div className="text-2xl">→</div>
        </div>
        
        {/* Result */}
        <div className="flex-shrink-0">
          {demoState.enhancedPhoto ? (
            <div className="text-center">
              <div className="w-24 h-24 rounded-lg overflow-hidden border-2 border-primary/50 shadow-md">
                <img
                  src={demoState.enhancedPhoto}
                  alt="Enhanced result"
                  className="w-full h-full object-cover"
                />
              </div>
              <p className="text-xs text-primary font-medium mt-2">Scene Created!</p>
            </div>
          ) : (
            <div className="w-24 h-24 rounded-lg border-2 border-dashed border-border/30 flex items-center justify-center bg-muted/20">
              <span className="text-sm text-muted-foreground">Result</span>
            </div>
          )}
        </div>
      </div>

      {/* Success message */}
      {demoState.enhancedPhoto && (
        <div className="mt-4 text-center">
          <p className="text-sm text-primary font-medium">
            🚀 Mind-blown? Upload your headshot to create amazing lifestyle scenes!
          </p>
        </div>
      )}
    </div>
  );
};

export default DemoShowcase;