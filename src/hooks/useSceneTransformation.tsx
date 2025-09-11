import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { toast } from 'sonner';
import { logger } from '@/lib/logger';

export interface SceneTransformationResult {
  enhancedImageUrl: string;
  processingTime: number;
  enhancementId: string;
  creditsRemaining: number;
  transformationType: 'scene_transformation';
  category: string;
}

export interface TransformationState {
  isProcessing: boolean;
  error: string | null;
  progress: number;
}

export const useSceneTransformation = () => {
  const { user } = useAuth();
  const [state, setState] = useState<TransformationState>({
    isProcessing: false,
    error: null,
    progress: 0
  });

  const transformScene = useCallback(async (
    imageDataUrl: string,
    category: string
  ): Promise<SceneTransformationResult> => {
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
      logger.info('Starting scene transformation', { 
        component: 'useSceneTransformation',
        category,
        userId: user.id 
      });

      setState(prev => ({ ...prev, progress: 40 }));

      const { data, error } = await supabase.functions.invoke('scene-transform-ai', {
        body: {
          imageDataUrl,
          category,
          userId: user.id
        }
      });

      if (error) {
        logger.error('Scene transformation error', { error, component: 'useSceneTransformation' });
        throw error;
      }

      setState(prev => ({ 
        ...prev, 
        isProcessing: false, 
        progress: 100 
      }));

      toast.success(`Scene transformed successfully! ${data.creditsRemaining} credits remaining.`);

      logger.info('Scene transformation completed', { 
        component: 'useSceneTransformation',
        enhancementId: data.enhancementId,
        category: data.category
      });

      return data as SceneTransformationResult;

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Scene transformation failed';
      setState(prev => ({ 
        ...prev, 
        isProcessing: false, 
        error: errorMessage,
        progress: 0
      }));
      
      logger.error('Scene transformation failed', { error: errorMessage, component: 'useSceneTransformation' });
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
    transformScene,
    resetState
  };
};