import { useState, useCallback } from 'react';
import { Canvas as FabricCanvas, FabricImage } from 'fabric';

export interface EnhancementSettings {
  lighting: number; // 0-100
  skinSmoothing: number; // 0-100
  eyeEnhancement: number; // 0-100
  teethWhitening: number; // 0-100
  backgroundBlur: number; // 0-100
  saturation: number; // 0-200 (100 = normal)
  contrast: number; // 0-200 (100 = normal)
  brightness: number; // 0-200 (100 = normal)
}

export interface ProcessedImage {
  dataUrl: string;
  settings: EnhancementSettings;
  identitySimilarity: number;
  quality: 'preview' | 'high';
}

export interface EnhancementState {
  isProcessing: boolean;
  progress: number;
  error: string | null;
  currentStep: string;
}

const DEFAULT_SETTINGS: EnhancementSettings = {
  lighting: 50,
  skinSmoothing: 30,
  eyeEnhancement: 40,
  teethWhitening: 25,
  backgroundBlur: 0,
  saturation: 100,
  contrast: 100,
  brightness: 100,
};

export const useImageEnhancement = () => {
  const [state, setState] = useState<EnhancementState>({
    isProcessing: false,
    progress: 0,
    error: null,
    currentStep: '',
  });

  const loadImageToCanvas = useCallback(async (imageDataUrl: string): Promise<{ canvas: HTMLCanvasElement; ctx: CanvasRenderingContext2D }> => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          reject(new Error('Could not get canvas context'));
          return;
        }
        
        canvas.width = img.width;
        canvas.height = img.height;
        ctx.drawImage(img, 0, 0);
        resolve({ canvas, ctx });
      };
      img.onerror = () => reject(new Error('Failed to load image'));
      img.src = imageDataUrl;
    });
  }, []);

  const applyLightingEnhancement = useCallback((imageData: ImageData, intensity: number) => {
    const data = imageData.data;
    const factor = intensity / 100;
    
    // Apply histogram equalization and exposure adjustment
    for (let i = 0; i < data.length; i += 4) {
      // Brightness and contrast adjustment
      data[i] = Math.min(255, data[i] * (1 + factor * 0.3)); // Red
      data[i + 1] = Math.min(255, data[i + 1] * (1 + factor * 0.3)); // Green
      data[i + 2] = Math.min(255, data[i + 2] * (1 + factor * 0.3)); // Blue
    }
    
    return imageData;
  }, []);

  const applySkinSmoothing = useCallback((imageData: ImageData, intensity: number) => {
    const data = imageData.data;
    const factor = intensity / 100;
    const width = imageData.width;
    const height = imageData.height;
    
    // Simple Gaussian blur simulation for skin smoothing
    const tempData = new Uint8ClampedArray(data);
    const radius = Math.floor(factor * 2) + 1;
    
    for (let y = radius; y < height - radius; y++) {
      for (let x = radius; x < width - radius; x++) {
        const idx = (y * width + x) * 4;
        
        // Detect skin tone (simplified)
        const r = data[idx];
        const g = data[idx + 1];
        const b = data[idx + 2];
        
        const isSkinTone = r > 95 && g > 40 && b > 20 && 
                          Math.max(r, g, b) - Math.min(r, g, b) > 15 &&
                          Math.abs(r - g) > 15 && r > g && r > b;
        
        if (isSkinTone) {
          // Apply blur to skin areas
          let rSum = 0, gSum = 0, bSum = 0, count = 0;
          
          for (let dy = -radius; dy <= radius; dy++) {
            for (let dx = -radius; dx <= radius; dx++) {
              const pixelIdx = ((y + dy) * width + (x + dx)) * 4;
              rSum += tempData[pixelIdx];
              gSum += tempData[pixelIdx + 1];
              bSum += tempData[pixelIdx + 2];
              count++;
            }
          }
          
          data[idx] = Math.floor((data[idx] * (1 - factor)) + (rSum / count * factor));
          data[idx + 1] = Math.floor((data[idx + 1] * (1 - factor)) + (gSum / count * factor));
          data[idx + 2] = Math.floor((data[idx + 2] * (1 - factor)) + (bSum / count * factor));
        }
      }
    }
    
    return imageData;
  }, []);

  const applyEyeEnhancement = useCallback((imageData: ImageData, intensity: number) => {
    const data = imageData.data;
    const factor = intensity / 100;
    
    // Simple eye enhancement - brighten and sharpen darker regions (eyes)
    for (let i = 0; i < data.length; i += 4) {
      const brightness = (data[i] + data[i + 1] + data[i + 2]) / 3;
      
      // Enhance darker regions that might be eyes
      if (brightness < 80) {
        const enhancement = factor * 0.5;
        data[i] = Math.min(255, data[i] * (1 + enhancement));
        data[i + 1] = Math.min(255, data[i + 1] * (1 + enhancement));
        data[i + 2] = Math.min(255, data[i + 2] * (1 + enhancement));
      }
    }
    
    return imageData;
  }, []);

  const applyTeethWhitening = useCallback((imageData: ImageData, intensity: number) => {
    const data = imageData.data;
    const factor = intensity / 100;
    
    // Detect and whiten teeth (simplified)
    for (let i = 0; i < data.length; i += 4) {
      const r = data[i];
      const g = data[i + 1];
      const b = data[i + 2];
      
      // Detect teeth-like colors (light with slight yellow tint)
      const isTeeth = r > 150 && g > 140 && b > 120 && 
                     r >= g && g >= b && (r - b) < 40;
      
      if (isTeeth) {
        // Reduce yellow tint and increase brightness
        data[i] = Math.min(255, r + factor * 10);
        data[i + 1] = Math.min(255, g + factor * 15);
        data[i + 2] = Math.min(255, b + factor * 20);
      }
    }
    
    return imageData;
  }, []);

  const applyBackgroundBlur = useCallback(async (canvas: HTMLCanvasElement, intensity: number) => {
    if (intensity === 0) return canvas;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return canvas;
    
    // Simple background blur using CSS filter
    const tempCanvas = document.createElement('canvas');
    const tempCtx = tempCanvas.getContext('2d');
    if (!tempCtx) return canvas;
    
    tempCanvas.width = canvas.width;
    tempCanvas.height = canvas.height;
    
    tempCtx.filter = `blur(${intensity / 10}px)`;
    tempCtx.drawImage(canvas, 0, 0);
    
    return tempCanvas;
  }, []);

  const enhanceImage = useCallback(async (
    imageDataUrl: string,
    settings: Partial<EnhancementSettings> = {},
    quality: 'preview' | 'high' = 'preview'
  ): Promise<ProcessedImage> => {
    setState(prev => ({ ...prev, isProcessing: true, progress: 0, error: null }));
    
    try {
      const finalSettings = { ...DEFAULT_SETTINGS, ...settings };
      
      setState(prev => ({ ...prev, currentStep: 'Loading image...', progress: 10 }));
      const { canvas, ctx } = await loadImageToCanvas(imageDataUrl);
      
      // Scale for preview mode
      if (quality === 'preview' && (canvas.width > 800 || canvas.height > 800)) {
        const scale = Math.min(800 / canvas.width, 800 / canvas.height);
        const newWidth = canvas.width * scale;
        const newHeight = canvas.height * scale;
        
        canvas.width = newWidth;
        canvas.height = newHeight;
        ctx.scale(scale, scale);
      }
      
      setState(prev => ({ ...prev, currentStep: 'Enhancing lighting...', progress: 25 }));
      let imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      
      if (finalSettings.lighting !== 50) {
        imageData = applyLightingEnhancement(imageData, finalSettings.lighting);
      }
      
      setState(prev => ({ ...prev, currentStep: 'Smoothing skin...', progress: 40 }));
      if (finalSettings.skinSmoothing > 0) {
        imageData = applySkinSmoothing(imageData, finalSettings.skinSmoothing);
      }
      
      setState(prev => ({ ...prev, currentStep: 'Enhancing eyes...', progress: 55 }));
      if (finalSettings.eyeEnhancement > 0) {
        imageData = applyEyeEnhancement(imageData, finalSettings.eyeEnhancement);
      }
      
      setState(prev => ({ ...prev, currentStep: 'Whitening teeth...', progress: 70 }));
      if (finalSettings.teethWhitening > 0) {
        imageData = applyTeethWhitening(imageData, finalSettings.teethWhitening);
      }
      
      setState(prev => ({ ...prev, currentStep: 'Applying color adjustments...', progress: 85 }));
      // Apply saturation, contrast, brightness
      const data = imageData.data;
      for (let i = 0; i < data.length; i += 4) {
        // Brightness
        if (finalSettings.brightness !== 100) {
          const brightnessFactor = finalSettings.brightness / 100;
          data[i] *= brightnessFactor;
          data[i + 1] *= brightnessFactor;
          data[i + 2] *= brightnessFactor;
        }
        
        // Contrast
        if (finalSettings.contrast !== 100) {
          const contrastFactor = finalSettings.contrast / 100;
          data[i] = ((data[i] - 128) * contrastFactor) + 128;
          data[i + 1] = ((data[i + 1] - 128) * contrastFactor) + 128;
          data[i + 2] = ((data[i + 2] - 128) * contrastFactor) + 128;
        }
        
        // Saturation
        if (finalSettings.saturation !== 100) {
          const saturationFactor = finalSettings.saturation / 100;
          const gray = 0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2];
          data[i] = gray + saturationFactor * (data[i] - gray);
          data[i + 1] = gray + saturationFactor * (data[i + 1] - gray);
          data[i + 2] = gray + saturationFactor * (data[i + 2] - gray);
        }
        
        // Clamp values
        data[i] = Math.max(0, Math.min(255, data[i]));
        data[i + 1] = Math.max(0, Math.min(255, data[i + 1]));
        data[i + 2] = Math.max(0, Math.min(255, data[i + 2]));
      }
      
      ctx.putImageData(imageData, 0, 0);
      
      setState(prev => ({ ...prev, currentStep: 'Processing background...', progress: 95 }));
      const finalCanvas = await applyBackgroundBlur(canvas, finalSettings.backgroundBlur);
      
      const dataUrl = finalCanvas.toDataURL('image/jpeg', quality === 'high' ? 0.95 : 0.8);
      
      // Calculate identity similarity (simplified)
      const identitySimilarity = Math.max(70, 100 - (
        Math.abs(finalSettings.lighting - 50) * 0.2 +
        finalSettings.skinSmoothing * 0.3 +
        finalSettings.backgroundBlur * 0.1
      ));
      
      setState(prev => ({ ...prev, isProcessing: false, progress: 100, currentStep: 'Complete!' }));
      
      return {
        dataUrl,
        settings: finalSettings,
        identitySimilarity,
        quality,
      };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Enhancement failed';
      setState(prev => ({ ...prev, isProcessing: false, error: errorMessage }));
      throw error;
    }
  }, [loadImageToCanvas, applyLightingEnhancement, applySkinSmoothing, applyEyeEnhancement, applyTeethWhitening, applyBackgroundBlur]);

  const generateVariants = useCallback(async (
    imageDataUrl: string,
    count: number = 3
  ): Promise<ProcessedImage[]> => {
    const variants: ProcessedImage[] = [];
    const baseSettings = DEFAULT_SETTINGS;
    
    for (let i = 0; i < count; i++) {
      const variation = {
        lighting: baseSettings.lighting + (Math.random() - 0.5) * 20,
        skinSmoothing: baseSettings.skinSmoothing + (Math.random() - 0.5) * 15,
        eyeEnhancement: baseSettings.eyeEnhancement + (Math.random() - 0.5) * 15,
        teethWhitening: baseSettings.teethWhitening + (Math.random() - 0.5) * 10,
        backgroundBlur: Math.random() * 30,
        saturation: baseSettings.saturation + (Math.random() - 0.5) * 20,
        contrast: baseSettings.contrast + (Math.random() - 0.5) * 20,
        brightness: baseSettings.brightness + (Math.random() - 0.5) * 15,
      };
      
      // Clamp values
      Object.keys(variation).forEach(key => {
        const value = variation[key as keyof EnhancementSettings];
        if (key === 'saturation' || key === 'contrast' || key === 'brightness') {
          variation[key as keyof EnhancementSettings] = Math.max(50, Math.min(150, value));
        } else {
          variation[key as keyof EnhancementSettings] = Math.max(0, Math.min(100, value));
        }
      });
      
      const enhanced = await enhanceImage(imageDataUrl, variation, 'preview');
      variants.push(enhanced);
    }
    
    return variants;
  }, [enhanceImage]);

  return {
    ...state,
    enhanceImage,
    generateVariants,
    defaultSettings: DEFAULT_SETTINGS,
  };
};