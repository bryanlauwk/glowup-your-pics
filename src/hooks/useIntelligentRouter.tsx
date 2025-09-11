import { useState, useCallback } from 'react';
import { usePhotoIntelligence, PhotoAssessment } from './usePhotoIntelligence';
import { usePhotoEnhancement } from './usePhotoEnhancement';
import { useSceneTransformation } from './useSceneTransformation';
import { supabase } from '@/integrations/supabase/client';
import { logger } from '@/lib/logger';

export interface TransformationConfig {
  category: string;
  customPrompt?: string;
  forceLevel?: 1 | 2; // Override AI decision
  qualityThreshold?: number; // Minimum score to use Level 1
  humanizationLevel?: number; // Controls authenticity factor (0-1, higher = more natural/less AI-polished)
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
  currentStep: 'scoring' | 'routing' | 'processing' | 'rescoring' | 'polishing' | 'complete';
  progress: number;
  error: string | null;
  currentScore?: number;
  targetScore?: number;
}

export const useIntelligentRouter = () => {
  const { analyzePhoto } = usePhotoIntelligence();
  const { enhancePhoto } = usePhotoEnhancement();
  const { transformScene } = useSceneTransformation();
  
  const [state, setState] = useState<RouterState>({
    isProcessing: false,
    currentStep: 'scoring',
    progress: 0,
    error: null,
    currentScore: 0,
    targetScore: 85
  });

  const processPhoto = useCallback(async (
    imageDataUrl: string,
    config: TransformationConfig
  ): Promise<IntelligentResult> => {
    const startTime = Date.now();
    
    setState({
      isProcessing: true,
      currentStep: 'scoring',
      progress: 5,
      error: null,
      currentScore: 0,
      targetScore: 85
    });

    try {
      // STEP 1: Initial Photo Scoring
      logger.debug('Starting enhanced intelligent photo processing', { config });
      
      let initialScore = 0;
      let assessment: any = null;
      
      if (config.forceLevel === 2) {
        // Demo mode: skip scoring, force transformation
        initialScore = 50; // Low score to trigger transformation
        assessment = {
          quality: { overallScore: 50 },
          categoryFit: { [config.category]: 85 },
          recommendedLevel: 2,
          suggestions: ['Demo transformation']
        };
      } else {
        // Real scoring via photo-scoring-engine
        const scoringResult = await supabase.functions.invoke('photo-scoring-engine', {
          body: {
            imageDataUrl,
            targetCategory: config.category,
            userId: 'demo-user' // TODO: Use real user ID
          }
        });
        
        if (scoringResult.error) {
          throw new Error(scoringResult.error.message || 'Photo scoring failed');
        }
        
        initialScore = scoringResult.data.score.overallAttractiveness;
        assessment = scoringResult.data.score;
      }
      
      setState(prev => ({ 
        ...prev, 
        currentStep: 'routing', 
        progress: 20,
        currentScore: initialScore 
      }));

      // STEP 2: Intelligent Routing Decision
      const targetScore = config.qualityThreshold || 85;
      const useLevel2 = config.forceLevel === 2 || 
        (config.forceLevel !== 1 && initialScore < targetScore) ||
        (assessment.recommendedLevel === 2);

      logger.debug('Enhanced routing decision', { 
        useLevel2, 
        initialScore,
        targetScore,
        recommendedLevel: assessment.recommendedLevel 
      });

      setState(prev => ({ ...prev, currentStep: 'processing', progress: 40 }));

      let result;
      let processingPath: 'enhancement' | 'transformation';
      let finalImageUrl = '';

      if (useLevel2) {
        // LEVEL 2: Advanced Multi-Stage Processing
        processingPath = 'transformation';
        
        // Stage 2A: Initial Transformation
        const userId = 'demo-user'; // TODO: Use real user ID
        const transformResult = await supabase.functions.invoke('scene-transform-ai', {
          body: {
            imageDataUrl,
            category: config.category,
            userId,
            customPrompt: config.customPrompt,
            qualityLevel: 'lowQuality', // Revolutionary transformation
            humanizationLevel: config.humanizationLevel || 0.5 // Natural authenticity
          }
        });
        
        if (transformResult.error) {
          throw new Error(transformResult.error.message || 'Scene transformation failed');
        }
        
        finalImageUrl = transformResult.data.enhancedImageUrl;
        
        setState(prev => ({ ...prev, currentStep: 'rescoring', progress: 70 }));
        
        // Stage 2B: Re-score the transformed image
        let newScore = initialScore + 30; // Estimate improvement for demo
        
        if (!config.forceLevel) {
          try {
            const rescoreResult = await supabase.functions.invoke('photo-scoring-engine', {
              body: {
                imageDataUrl: finalImageUrl,
                targetCategory: config.category,
                userId: 'demo-user'
              }
            });
            
            if (rescoreResult.data?.score) {
              newScore = rescoreResult.data.score.overallAttractiveness;
            }
          } catch (rescoreError) {
            console.warn('Rescoring failed, using estimated score:', rescoreError);
          }
        }
        
        setState(prev => ({ 
          ...prev, 
          currentStep: 'polishing', 
          progress: 85,
          currentScore: newScore 
        }));
        
        // Stage 2C: Final Polish (if needed)
        if (newScore < targetScore && newScore < 90) {
          // Apply final enhancement polish
          try {
            const polishResult = await supabase.functions.invoke('scene-transform-ai', {
              body: {
                imageDataUrl: finalImageUrl,
                category: config.category,
                userId,
                customPrompt: `Final polish for maximum dating appeal: ${config.customPrompt || ''}`,
                qualityLevel: 'highQuality', // Polish level
                humanizationLevel: config.humanizationLevel || 0.3 // Less humanization for final polish
              }
            });
            
            if (polishResult.data?.enhancedImageUrl) {
              finalImageUrl = polishResult.data.enhancedImageUrl;
              newScore = Math.min(95, newScore + 10); // Boost from polish
            }
          } catch (polishError) {
            console.warn('Final polish failed, using transformation result:', polishError);
          }
        }
        
        result = {
          data: { enhancedImageUrl: finalImageUrl, creditsRemaining: 999 }
        };
        
      } else {
        // LEVEL 1: Enhanced Enhancement Processing
        processingPath = 'enhancement';
        
        const enhancementPrompt = buildEnhancementPrompt(assessment, config);
        result = await enhancePhoto(imageDataUrl, config.category, enhancementPrompt);
        finalImageUrl = result.enhancedImageUrl || result.data?.enhancedImageUrl;
      }

      setState(prev => ({ ...prev, currentStep: 'complete', progress: 100 }));

      const processingTime = Date.now() - startTime;
      
      logger.debug('Intelligent processing completed', { 
        processingPath, 
        processingTime,
        creditsUsed: result.creditsRemaining 
      });

      return {
        finalImageUrl: finalImageUrl || result.data?.enhancedImageUrl || result.enhancedImageUrl,
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
      currentStep: 'scoring',
      progress: 0,
      error: null,
      currentScore: 0,
      targetScore: 85
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