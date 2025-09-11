import React, { useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Sparkles, RefreshCw } from 'lucide-react';
import { useIntelligentRouter } from '@/hooks/useIntelligentRouter';
import { toast } from 'sonner';

// Import demo image
import demoAsianCasual from '@/assets/demo/demo-asian-casual.jpg';

export type PhotoCategory = 'hook' | 'passion-hobbies' | 'social-proof' | 'adventure-travel' | 'professional' | 'custom';

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
    value: 'hook' as PhotoCategory, 
    label: 'First Impression Winner', 
    description: 'Instant attraction with magnetic appeal',
    icon: '✨'
  },
  { 
    value: 'passion-hobbies' as PhotoCategory, 
    label: 'Passion & Hobbies', 
    description: 'Transform into sports & hobby scenes',
    icon: '🏃'
  },
  { 
    value: 'social-proof' as PhotoCategory, 
    label: 'Social Proof', 
    description: 'Show yourself with friends socializing',
    icon: '👥'
  },
  { 
    value: 'adventure-travel' as PhotoCategory, 
    label: 'Adventure & Travel', 
    description: 'Create epic outdoor lifestyle shots',
    icon: '🏔️'
  },
  { 
    value: 'professional' as PhotoCategory, 
    label: 'Professional Authority', 
    description: 'Executive presence in business settings',
    icon: '💼'
  },
  { 
    value: 'custom' as PhotoCategory, 
    label: 'Custom Transformation', 
    description: 'Your unique vision brought to life',
    icon: '🎨'
  }
];

const DemoShowcase: React.FC = () => {
  const [demoState, setDemoState] = useState<DemoState>({
    selectedCategory: null,
    enhancedPhoto: null,
    isProcessing: false,
  });

  const { processPhoto, isProcessing } = useIntelligentRouter();

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

      // Process photo with intelligent routing (forces Level 2 for demo impact)
      const result = await processPhoto(imageDataUrl, {
        category: demoState.selectedCategory,
        forceLevel: 2 // Always use transformation for demo to show maximum impact
      });
      
      setDemoState(prev => ({
        ...prev,
        enhancedPhoto: result.finalImageUrl,
        isProcessing: false,
      }));

      toast.success(`🎉 Scene transformed! From headshot to "${CATEGORIES.find(c => c.value === demoState.selectedCategory)?.label}" lifestyle photo!`);
    } catch (error) {
      console.error('Demo intelligent processing failed:', error);
      setDemoState(prev => ({ ...prev, isProcessing: false }));
      toast.error('Demo transformation failed. Please try again.');
    }
  }, [demoState.selectedCategory, processPhoto]);

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

      {/* Horizontal Layout: Photo → Clickable Arrow → Result */}
      <div className="flex items-center gap-6">
        
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
              <SelectTrigger className="w-48 h-10 text-xs bg-background border-border/50">
                <SelectValue placeholder="Pick transformation style" />
              </SelectTrigger>
              <SelectContent className="bg-background border border-border z-50 max-h-80">
                {CATEGORIES.map((category) => (
                  <SelectItem key={category.value} value={category.value} className="text-xs py-3 cursor-pointer hover:bg-muted/50">
                    <div className="flex items-center gap-3 w-full">
                      <span className="text-lg">{category.icon}</span>
                      <div className="flex flex-col items-start">
                        <span className="font-medium text-foreground">{category.label}</span>
                        <span className="text-xs text-muted-foreground">{category.description}</span>
                      </div>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Clickable Magic Arrow */}
        <div className="flex-shrink-0">
          <button
            onClick={handleTransform}
            disabled={!demoState.selectedCategory || demoState.isProcessing}
            className={`
              text-4xl transition-all duration-300 cursor-pointer
              ${!demoState.selectedCategory || demoState.isProcessing 
                ? 'text-muted-foreground/30 cursor-not-allowed' 
                : 'text-primary hover:text-primary/80 hover:scale-110 active:scale-95'
              }
            `}
            title={demoState.selectedCategory ? "Click to transform!" : "Select a style first"}
          >
            {demoState.isProcessing ? (
              <div className="animate-spin">⚡</div>
            ) : (
              '✨'
            )}
          </button>
        </div>
        
        {/* Result */}
        <div className="flex-shrink-0">
          {demoState.enhancedPhoto ? (
            <div className="text-center">
              <div className="w-24 h-24 rounded-lg overflow-hidden border-2 border-primary/50 shadow-md animate-scale-in">
                <img
                  src={demoState.enhancedPhoto}
                  alt="Enhanced result"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="mt-2 flex items-center justify-center gap-1">
                <span className="text-xs text-primary font-medium">
                  {CATEGORIES.find(c => c.value === demoState.selectedCategory)?.icon}
                </span>
                <p className="text-xs text-primary font-medium">Scene Created!</p>
              </div>
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
            🚀 Mind-blown? This is the same {CATEGORIES.find(c => c.value === demoState.selectedCategory)?.label} engine our paid users get!
          </p>
        </div>
      )}
    </div>
  );
};

export default DemoShowcase;