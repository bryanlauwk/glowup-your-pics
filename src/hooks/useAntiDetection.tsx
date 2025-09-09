import { useState, useCallback } from 'react';

export interface AntiDetectionResult {
  originalDataUrl: string;
  variants: PlatformVariant[];
  detectionRisk: 'low' | 'medium' | 'high';
  strategies: string[];
}

export interface PlatformVariant {
  platform: 'tinder' | 'bumble' | 'cmb';
  dataUrl: string;
  modifications: string[];
  fileSize: number;
  hash: string;
}

export interface AntiDetectionState {
  isProcessing: boolean;
  progress: number;
  error: string | null;
  currentStep: string;
}

const PLATFORM_CONFIGS = {
  tinder: {
    maxSize: 800,
    quality: 0.85,
    format: 'image/jpeg',
    compressionVariation: 0.1,
  },
  bumble: {
    maxSize: 640,
    quality: 0.8,
    format: 'image/jpeg',
    compressionVariation: 0.15,
  },
  cmb: {
    maxSize: 1024,
    quality: 0.9,
    format: 'image/jpeg',
    compressionVariation: 0.05,
  },
};

export const useAntiDetection = () => {
  const [state, setState] = useState<AntiDetectionState>({
    isProcessing: false,
    progress: 0,
    error: null,
    currentStep: '',
  });

  const generateMicroNoise = useCallback((imageData: ImageData, intensity: number = 1) => {
    const data = imageData.data;
    
    for (let i = 0; i < data.length; i += 4) {
      // Add imperceptible random noise
      const noise = (Math.random() - 0.5) * intensity;
      data[i] = Math.max(0, Math.min(255, data[i] + noise));
      data[i + 1] = Math.max(0, Math.min(255, data[i + 1] + noise));
      data[i + 2] = Math.max(0, Math.min(255, data[i + 2] + noise));
    }
    
    return imageData;
  }, []);

  const manipulatePixelPattern = useCallback((imageData: ImageData, pattern: 'checkerboard' | 'random' | 'wave') => {
    const data = imageData.data;
    const width = imageData.width;
    const height = imageData.height;
    
    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        const idx = (y * width + x) * 4;
        let shouldModify = false;
        
        switch (pattern) {
          case 'checkerboard':
            shouldModify = (x + y) % 2 === 0;  
            break;
          case 'random':
            shouldModify = Math.random() < 0.01; // 1% of pixels
            break;
          case 'wave':
            shouldModify = Math.sin(x * 0.01) * Math.cos(y * 0.01) > 0;
            break;
        }
        
        if (shouldModify) {
          // Apply minimal modification
          const modification = (Math.random() - 0.5) * 2;
          data[idx] = Math.max(0, Math.min(255, data[idx] + modification));
          data[idx + 1] = Math.max(0, Math.min(255, data[idx + 1] + modification));
          data[idx + 2] = Math.max(0, Math.min(255, data[idx + 2] + modification));
        }
      }
    }
    
    return imageData;
  }, []);

  const stripAndFakeMetadata = useCallback((canvas: HTMLCanvasElement, platform: keyof typeof PLATFORM_CONFIGS) => {
    // Canvas automatically strips EXIF data when converting to data URL
    // We simulate different compression and encoding parameters
    const config = PLATFORM_CONFIGS[platform];
    const qualityVariation = (Math.random() - 0.5) * config.compressionVariation;
    const finalQuality = Math.max(0.5, Math.min(1.0, config.quality + qualityVariation));
    
    return canvas.toDataURL(config.format, finalQuality);
  }, []);

  const resizeForPlatform = useCallback((canvas: HTMLCanvasElement, platform: keyof typeof PLATFORM_CONFIGS) => {
    const config = PLATFORM_CONFIGS[platform];
    const ctx = canvas.getContext('2d');
    if (!ctx) return canvas;
    
    // Calculate resize dimensions
    const scale = Math.min(config.maxSize / canvas.width, config.maxSize / canvas.height);
    
    if (scale >= 1) return canvas; // No need to resize
    
    const newWidth = Math.floor(canvas.width * scale);
    const newHeight = Math.floor(canvas.height * scale);
    
    const resizedCanvas = document.createElement('canvas');
    const resizedCtx = resizedCanvas.getContext('2d');
    if (!resizedCtx) return canvas;
    
    resizedCanvas.width = newWidth;
    resizedCanvas.height = newHeight;
    
    // Use different interpolation methods for variety
    resizedCtx.imageSmoothingEnabled = Math.random() > 0.5;
    resizedCtx.imageSmoothingQuality = ['low', 'medium', 'high'][Math.floor(Math.random() * 3)] as ImageSmoothingQuality;
    
    resizedCtx.drawImage(canvas, 0, 0, newWidth, newHeight);
    
    return resizedCanvas;
  }, []);

  const calculateSimpleHash = useCallback((dataUrl: string): string => {
    let hash = 0;
    for (let i = 0; i < dataUrl.length; i++) {
      const char = dataUrl.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    return Math.abs(hash).toString(16);
  }, []);

  const processAntiDetection = useCallback(async (imageDataUrl: string): Promise<AntiDetectionResult> => {
    setState(prev => ({ ...prev, isProcessing: true, progress: 0, error: null }));
    
    try {
      setState(prev => ({ ...prev, currentStep: 'Loading image...', progress: 10 }));
      
      const img = new Image();
      await new Promise((resolve, reject) => {
        img.onload = resolve;
        img.onerror = reject;
        img.src = imageDataUrl;
      });
      
      const baseCanvas = document.createElement('canvas');
      const baseCtx = baseCanvas.getContext('2d');
      if (!baseCtx) throw new Error('Could not get canvas context');
      
      baseCanvas.width = img.width;
      baseCanvas.height = img.height;
      baseCtx.drawImage(img, 0, 0);
      
      const variants: PlatformVariant[] = [];
      const strategies: string[] = [];
      
      for (const [platform, config] of Object.entries(PLATFORM_CONFIGS)) {
        const platformKey = platform as keyof typeof PLATFORM_CONFIGS;
        setState(prev => ({ 
          ...prev, 
          currentStep: `Processing ${platform.toUpperCase()} variant...`, 
          progress: 20 + (Object.keys(PLATFORM_CONFIGS).indexOf(platform) * 25)
        }));
        
        // Create platform-specific canvas
        const platformCanvas = document.createElement('canvas');
        const platformCtx = platformCanvas.getContext('2d');
        if (!platformCtx) continue;
        
        platformCanvas.width = baseCanvas.width;
        platformCanvas.height = baseCanvas.height;
        platformCtx.drawImage(baseCanvas, 0, 0);
        
        // Apply anti-detection strategies
        let imageData = platformCtx.getImageData(0, 0, platformCanvas.width, platformCanvas.height);
        const modifications: string[] = [];
        
        // Strategy 1: Micro-noise injection
        imageData = generateMicroNoise(imageData, 1.5);
        modifications.push('Micro-noise injection');
        
        // Strategy 2: Pixel pattern manipulation
        const patterns = ['checkerboard', 'random', 'wave'] as const;
        const selectedPattern = patterns[Math.floor(Math.random() * patterns.length)];
        imageData = manipulatePixelPattern(imageData, selectedPattern);
        modifications.push(`Pixel pattern: ${selectedPattern}`);
        
        platformCtx.putImageData(imageData, 0, 0);
        
        // Strategy 3: Platform-specific resizing
        const resizedCanvas = resizeForPlatform(platformCanvas, platformKey);
        modifications.push(`Resized to ${resizedCanvas.width}x${resizedCanvas.height}`);
        
        // Strategy 4: Metadata manipulation and compression variation
        const dataUrl = stripAndFakeMetadata(resizedCanvas, platformKey);
        modifications.push(`Compression quality: ${config.quality}`);
        
        const hash = calculateSimpleHash(dataUrl);
        const fileSize = Math.floor(dataUrl.length * 0.75); // Approximate file size
        
        variants.push({
          platform: platformKey,
          dataUrl,
          modifications,
          fileSize,
          hash,
        });
        
        strategies.push(...modifications);
      }
      
      setState(prev => ({ ...prev, currentStep: 'Analyzing detection risk...', progress: 95 }));
      
      // Calculate detection risk based on applied strategies
      const uniqueStrategies = [...new Set(strategies)];
      const detectionRisk: 'low' | 'medium' | 'high' = 
        uniqueStrategies.length >= 8 ? 'low' : 
        uniqueStrategies.length >= 5 ? 'medium' : 'high';
      
      setState(prev => ({ ...prev, isProcessing: false, progress: 100, currentStep: 'Complete!' }));
      
      return {
        originalDataUrl: imageDataUrl,
        variants,
        detectionRisk,
        strategies: uniqueStrategies,
      };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Anti-detection processing failed';
      setState(prev => ({ ...prev, isProcessing: false, error: errorMessage }));
      throw error;
    }
  }, [generateMicroNoise, manipulatePixelPattern, stripAndFakeMetadata, resizeForPlatform, calculateSimpleHash]);

  return {
    ...state,
    processAntiDetection,
  };
};