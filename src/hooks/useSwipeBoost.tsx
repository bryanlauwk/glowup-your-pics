import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { logger } from '@/lib/logger';

export interface SwipeBoostMetrics {
  mls: number; // Match-Likelihood Score
  cs: number;  // Compliance Score
  gateResults: {
    identityPass: boolean;
    artifactPass: boolean;
    posePass: boolean;
    compositionPass: boolean;
    overallPass: boolean;
  };
  metrics: {
    identitySimilarity: number;
    eyeLinePercent: number;
    faceAreaPercent: number;
    poseAngles: { yaw: number; pitch: number; roll: number };
    artifactScores: { oversmooth: number; halo: number; warp: number };
  };
  suggestions: string[];
  reshootRequired: boolean;
}

export interface EnhancementSettings {
  preset: 'headshot' | 'half_body' | 'outdoor_casual';
  customSettings?: any;
}

export interface SwipeBoostState {
  isProcessing: boolean;
  error: string | null;
  currentStep: 'idle' | 'enhancing' | 'evaluating' | 'complete';
  progress: number;
}

export const useSwipeBoost = () => {
  const [state, setState] = useState<SwipeBoostState>({
    isProcessing: false,
    error: null,
    currentStep: 'idle',
    progress: 0
  });

  const enhancePhoto = useCallback(async (
    imageDataUrl: string, 
    settings: EnhancementSettings
  ) => {
    setState(prev => ({ 
      ...prev, 
      isProcessing: true, 
      error: null, 
      currentStep: 'enhancing',
      progress: 25
    }));

    try {
      const { data, error } = await supabase.functions.invoke('swipeBoost-enhance', {
        body: {
          imageDataUrl,
          preset: settings.preset,
          customSettings: settings.customSettings
        }
      });

      if (error) throw error;

      setState(prev => ({ ...prev, progress: 50 }));
      return data;

    } catch (error) {
      setState(prev => ({ 
        ...prev, 
        isProcessing: false, 
        error: error instanceof Error ? error.message : 'Enhancement failed',
        currentStep: 'idle'
      }));
      throw error;
    }
  }, []);

  const evaluatePhoto = useCallback(async (
    originalImageUrl: string,
    enhancedImageUrl: string,
    appliedSettings?: any
  ): Promise<SwipeBoostMetrics> => {
    setState(prev => ({ 
      ...prev, 
      currentStep: 'evaluating',
      progress: 75
    }));

    try {
      const { data, error } = await supabase.functions.invoke('swipeBoost-evaluate', {
        body: {
          originalImageUrl,
          enhancedImageUrl,
          appliedSettings
        }
      });

      if (error) throw error;

      setState(prev => ({ 
        ...prev, 
        isProcessing: false,
        currentStep: 'complete',
        progress: 100
      }));

      return data as SwipeBoostMetrics;

    } catch (error) {
      setState(prev => ({ 
        ...prev, 
        isProcessing: false, 
        error: error instanceof Error ? error.message : 'Evaluation failed',
        currentStep: 'idle'
      }));
      throw error;
    }
  }, []);

  const getRecipeSuggestion = useCallback(async (
    failureType: 'low_mls' | 'low_cs',
    metrics: Partial<SwipeBoostMetrics>
  ) => {
    try {
      const { data, error } = await supabase.functions.invoke('swipeBoost-recipes', {
        body: {
          failureType,
          currentMLS: metrics.mls,
          currentCS: metrics.cs,
          metrics: metrics.metrics
        }
      });

      if (error) throw error;
      return data;

    } catch (error) {
      logger.error('Failed to get recipe suggestion', { error, hook: 'useSwipeBoost', action: 'getRecipeSuggestion' });
      return null;
    }
  }, []);

  const getPolicies = useCallback(async () => {
    try {
      const { data, error } = await supabase.functions.invoke('swipeBoost-policies');
      
      if (error) throw error;
      return data;

    } catch (error) {
      logger.error('Failed to get policies', { error, hook: 'useSwipeBoost', action: 'getPolicies' });
      return null;
    }
  }, []);

  const processPhotoComplete = useCallback(async (
    imageDataUrl: string,
    settings: EnhancementSettings
  ): Promise<{ enhanced: any; metrics: SwipeBoostMetrics }> => {
    // Full pipeline: enhance -> evaluate
    const enhanced = await enhancePhoto(imageDataUrl, settings);
    const metrics = await evaluatePhoto(imageDataUrl, enhanced.enhancedImageUrl, enhanced.appliedSettings);
    
    return { enhanced, metrics };
  }, [enhancePhoto, evaluatePhoto]);

  const resetState = useCallback(() => {
    setState({
      isProcessing: false,
      error: null,
      currentStep: 'idle',
      progress: 0
    });
  }, []);

  return {
    ...state,
    enhancePhoto,
    evaluatePhoto,
    getRecipeSuggestion,
    getPolicies,
    processPhotoComplete,
    resetState
  };
};