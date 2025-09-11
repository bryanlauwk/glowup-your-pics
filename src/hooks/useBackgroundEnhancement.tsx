import { useState, useCallback } from 'react';
import { toast } from 'sonner';
import { pipeline, env } from '@huggingface/transformers';

// Configure transformers.js
env.allowLocalModels = false;
env.useBrowserCache = false;

export interface BackgroundEnhancementState {
  isProcessing: boolean;
  progress: number;
  error: string | null;
}

export interface BackgroundEnhancementResult {
  enhancedBlob: Blob;
  processingTime: number;
}

const MAX_IMAGE_DIMENSION = 1024;

export const useBackgroundEnhancement = () => {
  const [state, setState] = useState<BackgroundEnhancementState>({
    isProcessing: false,
    progress: 0,
    error: null
  });

  const loadImage = useCallback((file: File): Promise<HTMLImageElement> => {
    return new Promise<HTMLImageElement>((resolve, reject) => {
      const img = document.createElement('img') as HTMLImageElement;
      img.onload = () => resolve(img);
      img.onerror = reject;
      img.src = URL.createObjectURL(file);
    });
  }, []);

  const resizeImageIfNeeded = useCallback((
    canvas: HTMLCanvasElement, 
    ctx: CanvasRenderingContext2D, 
    image: HTMLImageElement
  ) => {
    let width = image.naturalWidth;
    let height = image.naturalHeight;

    if (width > MAX_IMAGE_DIMENSION || height > MAX_IMAGE_DIMENSION) {
      if (width > height) {
        height = Math.round((height * MAX_IMAGE_DIMENSION) / width);
        width = MAX_IMAGE_DIMENSION;
      } else {
        width = Math.round((width * MAX_IMAGE_DIMENSION) / height);
        height = MAX_IMAGE_DIMENSION;
      }

      canvas.width = width;
      canvas.height = height;
      ctx.drawImage(image, 0, 0, width, height);
      return true;
    }

    canvas.width = width;
    canvas.height = height;
    ctx.drawImage(image, 0, 0);
    return false;
  }, []);

  const removeBackground = useCallback(async (imageFile: File): Promise<BackgroundEnhancementResult> => {
    const startTime = Date.now();
    
    setState(prev => ({ ...prev, isProcessing: true, progress: 0, error: null }));

    try {
      setState(prev => ({ ...prev, progress: 10 }));
      
      // Load the segmentation model
      const segmenter = await pipeline('image-segmentation', 'Xenova/segformer-b0-finetuned-ade-512-512', {
        device: 'webgpu',
      });
      
      setState(prev => ({ ...prev, progress: 20 }));

      // Load and prepare image
      const imageElement = await loadImage(imageFile);
      setState(prev => ({ ...prev, progress: 30 }));

      // Convert to canvas
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      
      if (!ctx) throw new Error('Could not get canvas context');
      
      // Resize if needed
      const wasResized = resizeImageIfNeeded(canvas, ctx, imageElement);
      setState(prev => ({ ...prev, progress: 40 }));
      
      // Get image data as base64
      const imageData = canvas.toDataURL('image/jpeg', 0.8);
      setState(prev => ({ ...prev, progress: 50 }));
      
      // Process with segmentation model
      const result = await segmenter(imageData);
      setState(prev => ({ ...prev, progress: 70 }));
      
      if (!result || !Array.isArray(result) || result.length === 0 || !result[0].mask) {
        throw new Error('Invalid segmentation result');
      }
      
      // Create output canvas for masked image
      const outputCanvas = document.createElement('canvas');
      outputCanvas.width = canvas.width;
      outputCanvas.height = canvas.height;
      const outputCtx = outputCanvas.getContext('2d');
      
      if (!outputCtx) throw new Error('Could not get output canvas context');
      
      // Draw original image
      outputCtx.drawImage(canvas, 0, 0);
      
      // Apply the mask
      const outputImageData = outputCtx.getImageData(0, 0, outputCanvas.width, outputCanvas.height);
      const data = outputImageData.data;
      
      // Apply inverted mask to alpha channel
      for (let i = 0; i < result[0].mask.data.length; i++) {
        const alpha = Math.round((1 - result[0].mask.data[i]) * 255);
        data[i * 4 + 3] = alpha;
      }
      
      outputCtx.putImageData(outputImageData, 0, 0);
      setState(prev => ({ ...prev, progress: 90 }));
      
      // Convert to blob
      const enhancedBlob = await new Promise<Blob>((resolve, reject) => {
        outputCanvas.toBlob(
          (blob) => {
            if (blob) {
              resolve(blob);
            } else {
              reject(new Error('Failed to create blob'));
            }
          },
          'image/png',
          1.0
        );
      });

      setState(prev => ({ ...prev, progress: 100 }));
      
      const processingTime = Date.now() - startTime;
      
      // Reset state after a short delay
      setTimeout(() => {
        setState(prev => ({ ...prev, isProcessing: false, progress: 0 }));
      }, 1000);

      toast.success('Background removed successfully!');
      
      return {
        enhancedBlob,
        processingTime
      };

    } catch (error) {
      console.error('Background removal failed:', error);
      setState(prev => ({ 
        ...prev, 
        isProcessing: false, 
        progress: 0, 
        error: error instanceof Error ? error.message : 'Unknown error'
      }));
      
      toast.error('Background removal failed. Please try again.');
      throw error;
    }
  }, [loadImage, resizeImageIfNeeded]);

  const resetState = useCallback(() => {
    setState({
      isProcessing: false,
      progress: 0,
      error: null
    });
  }, []);

  return {
    ...state,
    removeBackground,
    resetState
  };
};