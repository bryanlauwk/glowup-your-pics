import { useState, useCallback } from 'react';
import { usePhotoIntelligence, PhotoAssessment } from './usePhotoIntelligence';
import { usePhotoEnhancement } from './usePhotoEnhancement';
import { useSceneTransformation } from './useSceneTransformation';
import { supabase } from '@/integrations/supabase/client';
import { logger } from '@/lib/logger';
import { toast } from 'sonner';

export interface TransformationConfig {
  category: string;
  customPrompt?: string;
  forceLevel?: 1 | 2; // Override AI decision
  qualityThreshold?: number; // Minimum score to use Level 1
}

export interface IntelligentResult {
  finalImageUrl: string;
  processingPath: 'enhancement' | 'transformation';
  assessment: PhotoAssessment;
  processingTime: number;
  creditsUsed: number;
  creditsRemaining: number;
}

export interface RouterState {
  isProcessing: boolean;
  currentStep: 'analyzing' | 'routing' | 'processing' | 'validating' | 'complete';
  progress: number;
  error: string | null;
}

export const useIntelligentRouter = () => {
  const { analyzePhoto } = usePhotoIntelligence();
  const { enhancePhoto } = usePhotoEnhancement();
  const { transformScene } = useSceneTransformation();
  
  const [state, setState] = useState<RouterState>({
    isProcessing: false,
    currentStep: 'analyzing',
    progress: 0,
    error: null
  });

  const processPhoto = useCallback(async (
    imageDataUrl: string,
    config: TransformationConfig
  ): Promise<IntelligentResult> => {
    const startTime = Date.now();
    
    setState({
      isProcessing: true,
      currentStep: 'analyzing',
      progress: 10,
      error: null
    });

    try {
      // Step 1: Analyze photo with AI
      logger.debug('Starting intelligent photo processing', { config });
      
      // Skip analysis for demo and force transformation
      let assessment;
      if (config.forceLevel === 2) {
        // Create a simple assessment that recommends Level 2
        assessment = {
          quality: { overallScore: 50 }, // Low score to trigger transformation
          categoryFit: { [config.category]: 85 },
          recommendedLevel: 2,
          suggestions: ['Demo transformation']
        } as any;
      } else {
        assessment = await analyzePhoto(imageDataUrl, config.category);
      }
      
      setState(prev => ({ ...prev, currentStep: 'routing', progress: 30 }));

      // Step 2: Determine processing path
      const useLevel2 = config.forceLevel === 2 || 
        (config.forceLevel !== 1 && assessment.recommendedLevel === 2) ||
        (config.qualityThreshold && assessment.quality.overallScore < config.qualityThreshold);

      logger.debug('Routing decision made', { 
        useLevel2, 
        overallScore: assessment.quality.overallScore,
        categoryFit: assessment.categoryFit[config.category],
        recommendedLevel: assessment.recommendedLevel 
      });

      setState(prev => ({ ...prev, currentStep: 'processing', progress: 50 }));

      let result;
      let processingPath: 'enhancement' | 'transformation';

      if (useLevel2) {
        // Level 2: Scene Transformation (Revolutionary change)
        processingPath = 'transformation';
        toast.info('🚀 Using Level 2: Scene Transformation for maximum impact!');
        
        // For demo, use demo-user as userId
        const userId = 'demo-user';
        result = await supabase.functions.invoke('scene-transform-ai', {
          body: {
            imageDataUrl,
            category: config.category,
            userId,
            customPrompt: config.customPrompt
          }
        });
        
        if (result.error) {
          throw new Error(result.error.message || 'Scene transformation failed');
        }
      } else {
        // Level 1: Enhancement (Polish existing photo)
        processingPath = 'enhancement';
        toast.info('✨ Using Level 1: Enhancement to polish your photo!');
        
        // Build enhancement prompt based on assessment
        const enhancementPrompt = buildEnhancementPrompt(assessment, config);
        result = await enhancePhoto(imageDataUrl, config.category, enhancementPrompt);
      }

      setState(prev => ({ ...prev, currentStep: 'validating', progress: 90 }));

      // Step 3: Quality validation (future enhancement)
      // TODO: Validate final result meets quality standards

      setState(prev => ({ ...prev, currentStep: 'complete', progress: 100 }));

      const processingTime = Date.now() - startTime;
      
      logger.debug('Intelligent processing completed', { 
        processingPath, 
        processingTime,
        creditsUsed: result.creditsRemaining 
      });

      return {
        finalImageUrl: result.data?.enhancedImageUrl || result.enhancedImageUrl,
        processingPath,
        assessment,
        processingTime,
        creditsUsed: processingPath === 'transformation' ? 2 : 1,
        creditsRemaining: result.data?.creditsRemaining || result.creditsRemaining || 999
      };

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Intelligent processing failed';
      setState(prev => ({ 
        ...prev, 
        isProcessing: false, 
        error: errorMessage,
        progress: 0 
      }));
      
      logger.error('Intelligent processing failed', { error: errorMessage });
      throw error;
    } finally {
      setState(prev => ({ ...prev, isProcessing: false }));
    }
  }, [analyzePhoto, enhancePhoto, transformScene]);

  const resetState = useCallback(() => {
    setState({
      isProcessing: false,
      currentStep: 'analyzing',
      progress: 0,
      error: null
    });
  }, []);

  return {
    ...state,
    processPhoto,
    resetState
  };
};

// Helper function to build enhancement prompts based on AI assessment
function buildEnhancementPrompt(assessment: PhotoAssessment, config: TransformationConfig): string {
  const { quality, context } = assessment;
  const prompts = [];

  // Address specific quality issues
  if (quality.lighting < 70) {
    prompts.push('improve lighting and brightness');
  }
  if (quality.clarity < 70) {
    prompts.push('enhance image sharpness and reduce noise');
  }
  if (quality.composition < 70) {
    prompts.push('optimize composition and framing');
  }
  if (quality.backgroundQuality < 70) {
    prompts.push('enhance and clean up background');
  }

  // Add category-specific enhancements
  const categoryEnhancements = {
    'passion-hobbies': 'enhance colors to make hobbies more vibrant and engaging',
    'professional': 'create professional lighting and clean background',
    'adventure-travel': 'enhance natural lighting and outdoor scenery',
    'social-proof': 'optimize for social media with enhanced colors and contrast',
    'hook': 'maximize visual appeal and first impression impact'
  };

  if (categoryEnhancements[config.category as keyof typeof categoryEnhancements]) {
    prompts.push(categoryEnhancements[config.category as keyof typeof categoryEnhancements]);
  }

  // Include user's custom prompt
  if (config.customPrompt) {
    prompts.push(config.customPrompt);
  }

  return prompts.join(', ');
}