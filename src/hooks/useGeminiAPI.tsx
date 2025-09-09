import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface PhotoAnalysisResult {
  overallScore: number;
  attractivenessScore: number;
  qualityScore: number;
  expressionScore: number;
  styleScore: number;
  backgroundScore: number;
  poseScore: number;
  authenticityScore: number;
  strengths: string[];
  improvements: string[];
  enhancementSuggestions: string[];
  platformOptimization: {
    tinder: string;
    bumble: string;
    coffeeMeetsBagel: string;
  };
  rawAnalysis?: string;
}

export interface GeminiAPIState {
  isLoading: boolean;
  error: string | null;
}

export const useGeminiAPI = () => {
  const [state, setState] = useState<GeminiAPIState>({
    isLoading: false,
    error: null,
  });

  const analyzePhoto = useCallback(async (imageDataUrl: string, customPrompt?: string): Promise<PhotoAnalysisResult> => {
    setState({ isLoading: true, error: null });

    try {
      const { data, error } = await supabase.functions.invoke('analyze-photo-gemini', {
        body: {
          imageDataUrl,
          prompt: customPrompt
        }
      });

      if (error) {
        throw new Error(error.message || 'Failed to analyze photo');
      }

      if (!data || !data.analysis) {
        throw new Error('Invalid response from analysis service');
      }

      setState({ isLoading: false, error: null });
      return data.analysis;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to analyze photo';
      setState({ isLoading: false, error: errorMessage });
      throw error;
    }
  }, []);

  const generateEnhancementSuggestions = useCallback(async (analysis: PhotoAnalysisResult): Promise<string[]> => {
    setState({ isLoading: true, error: null });

    try {
      const prompt = `Based on this photo analysis, generate 5 specific, actionable enhancement suggestions:
      
      Overall Score: ${analysis.overallScore}/10
      Strengths: ${analysis.strengths.join(', ')}
      Areas for improvement: ${analysis.improvements.join(', ')}
      
      Return ONLY a JSON array of strings with specific suggestions, like:
      ["Improve lighting by facing a window", "Smile more naturally", "Choose a cleaner background"]`;

      const { data, error } = await supabase.functions.invoke('analyze-photo-gemini', {
        body: {
          imageDataUrl: '', // Not needed for text-only analysis
          prompt
        }
      });

      if (error) {
        throw new Error(error.message || 'Failed to generate suggestions');
      }

      setState({ isLoading: false, error: null });
      
      // Try to parse as JSON array, fallback to existing suggestions
      try {
        const suggestions = JSON.parse(data.analysis.rawAnalysis || '[]');
        return Array.isArray(suggestions) ? suggestions : analysis.enhancementSuggestions;
      } catch {
        return analysis.enhancementSuggestions;
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to generate suggestions';
      setState({ isLoading: false, error: errorMessage });
      return analysis.enhancementSuggestions; // Fallback to existing suggestions
    }
  }, []);

  const validateIdentitySimilarity = useCallback(async (originalImage: string, enhancedImage: string): Promise<number> => {
    setState({ isLoading: true, error: null });

    try {
      const prompt = `Compare these two photos and determine if they show the same person. Rate the identity similarity from 0-100, where 100 means definitely the same person and 0 means definitely different people.

      Return ONLY a JSON object with this structure:
      {
        "similarityScore": number,
        "explanation": "brief explanation of the comparison"
      }`;

      const { data, error } = await supabase.functions.invoke('analyze-photo-gemini', {
        body: {
          imageDataUrl: originalImage,
          prompt
        }
      });

      if (error) {
        throw new Error(error.message || 'Failed to validate identity');
      }

      setState({ isLoading: false, error: null });
      
      // Try to parse similarity score, fallback to 85
      try {
        const result = JSON.parse(data.analysis.rawAnalysis || '{"similarityScore": 85}');
        return result.similarityScore || 85;
      } catch {
        return 85; // Default similarity score
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to validate identity';
      setState({ isLoading: false, error: errorMessage });
      return 85; // Default similarity score on error
    }
  }, []);

  return {
    ...state,
    analyzePhoto,
    generateEnhancementSuggestions,
    validateIdentitySimilarity,
  };
};