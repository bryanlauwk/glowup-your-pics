import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { toast } from 'sonner';

export interface PhotoEnhancementResult {
  enhancedImageUrl: string;
  processingTime: number;
  enhancementId: string;
  creditsRemaining: number;
}

export interface EnhancementState {
  isProcessing: boolean;
  error: string | null;
  progress: number;
}

export const usePhotoEnhancement = () => {
  const { user } = useAuth();
  const [state, setState] = useState<EnhancementState>({
    isProcessing: false,
    error: null,
    progress: 0
  });

  const enhancePhoto = useCallback(async (
    imageDataUrl: string,
    photoCategory: string,
    customPrompt: string
  ): Promise<PhotoEnhancementResult> => {
    if (!user) {
      throw new Error('User not authenticated');
    }

    setState(prev => ({ 
      ...prev, 
      isProcessing: true, 
      error: null, 
      progress: 0 
    }));

    try {
      setState(prev => ({ ...prev, progress: 20 }));

      const { data, error } = await supabase.functions.invoke('gemini-photo-enhance', {
        body: {
          imageDataUrl,
          photoCategory,
          customPrompt,
          userId: user.id
        }
      });

      if (error) throw error;

      setState(prev => ({ 
        ...prev, 
        isProcessing: false, 
        progress: 100 
      }));

      toast.success(`Photo enhanced successfully! ${data.creditsRemaining} credits remaining.`);

      return data as PhotoEnhancementResult;

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Enhancement failed';
      setState(prev => ({ 
        ...prev, 
        isProcessing: false, 
        error: errorMessage,
        progress: 0
      }));
      
      toast.error(errorMessage);
      throw error;
    }
  }, [user]);

  const resetState = useCallback(() => {
    setState({
      isProcessing: false,
      error: null,
      progress: 0
    });
  }, []);

  return {
    ...state,
    enhancePhoto,
    resetState
  };
};