import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { logger } from '@/lib/logger';

export interface PhotoQualityMetrics {
  overallScore: number; // 0-100
  composition: number;
  lighting: number;
  clarity: number;
  contextMatch: number; // How well photo matches intended category
  pose: number;
  backgroundQuality: number;
}

export interface PhotoContext {
  detectedObjects: string[];
  setting: 'indoor' | 'outdoor' | 'studio' | 'mixed';
  bodyShot: 'headshot' | 'half-body' | 'full-body' | 'group';
  emotion: 'confident' | 'casual' | 'professional' | 'adventurous' | 'neutral';
  clothingStyle: string[];
  backgroundType: string;
}

export interface PhotoAssessment {
  quality: PhotoQualityMetrics;
  context: PhotoContext;
  categoryFit: {
    [key: string]: number; // Category name -> fit score (0-100)
  };
  recommendedLevel: 1 | 2; // Level 1: Enhancement, Level 2: Transformation
  confidenceScore: number;
  suggestions: string[];
}

export const usePhotoIntelligence = () => {
  const { user } = useAuth();
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const analyzePhoto = useCallback(async (
    imageDataUrl: string,
    targetCategory: string
  ): Promise<PhotoAssessment> => {
    if (!user) {
      throw new Error('User not authenticated');
    }

    setIsAnalyzing(true);
    setError(null);

    try {
      logger.debug('Starting photo intelligence analysis', { 
        component: 'usePhotoIntelligence',
        targetCategory 
      });

      const { data, error } = await supabase.functions.invoke('photo-intelligence-analyzer', {
        body: {
          imageDataUrl,
          targetCategory,
          userId: user.id
        }
      });

      if (error) throw error;

      logger.debug('Photo analysis completed', { 
        assessment: data,
        recommendedLevel: data.recommendedLevel 
      });

      return data as PhotoAssessment;

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Photo analysis failed';
      setError(errorMessage);
      logger.error('Photo intelligence analysis failed', { error: errorMessage });
      throw error;
    } finally {
      setIsAnalyzing(false);
    }
  }, [user]);

  const resetState = useCallback(() => {
    setError(null);
    setIsAnalyzing(false);
  }, []);

  return {
    analyzePhoto,
    isAnalyzing,
    error,
    resetState
  };
};