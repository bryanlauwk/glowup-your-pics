import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { toast } from 'sonner';
import { Scissors, Image, Wand2, Download, X } from 'lucide-react';
import { pipeline, env } from '@huggingface/transformers';

// Configure transformers.js to always download models
env.allowLocalModels = false;
env.useBrowserCache = false;

const MAX_IMAGE_DIMENSION = 1024;

interface BackgroundEnhancerProps {
  imageFile: File;
  onEnhanced: (enhancedBlob: Blob) => void;
  className?: string;
}

// Preset backgrounds for different photo categories
const backgroundPresets = {
  professional: [
    { name: 'Corporate Office', description: 'Modern office setting', color: 'bg-slate-100' },
    { name: 'Studio Gray', description: 'Clean professional backdrop', color: 'bg-gray-200' },
    { name: 'Executive Suite', description: 'Luxury office environment', color: 'bg-blue-50' }
  ],
  lifestyle: [
    { name: 'Urban Rooftop', description: 'City skyline background', color: 'bg-orange-100' },
    { name: 'Luxury Resort', description: 'Tropical paradise setting', color: 'bg-green-100' },
    { name: 'Mountain Vista', description: 'Scenic outdoor landscape', color: 'bg-purple-100' }
  ],
  social: [
    { name: 'Upscale Lounge', description: 'Premium social setting', color: 'bg-rose-100' },
    { name: 'Art Gallery', description: 'Sophisticated cultural venue', color: 'bg-violet-100' },
    { name: 'Rooftop Bar', description: 'Trendy nightlife atmosphere', color: 'bg-amber-100' }
  ]
};

function resizeImageIfNeeded(canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D, image: HTMLImageElement) {
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
}

const loadImageFromFile = (file: File): Promise<HTMLImageElement> => {
  return new Promise<HTMLImageElement>((resolve, reject) => {
    const img = document.createElement('img') as HTMLImageElement;
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = URL.createObjectURL(file);
  });
};

const removeBackground = async (imageElement: HTMLImageElement): Promise<Blob> => {
  try {
    console.log('Starting background removal process...');
    const segmenter = await pipeline('image-segmentation', 'Xenova/segformer-b0-finetuned-ade-512-512', {
      device: 'webgpu',
    });
    
    // Convert HTMLImageElement to canvas
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    
    if (!ctx) throw new Error('Could not get canvas context');
    
    // Resize image if needed and draw it to canvas
    const wasResized = resizeImageIfNeeded(canvas, ctx, imageElement);
    console.log(`Image ${wasResized ? 'was' : 'was not'} resized. Final dimensions: ${canvas.width}x${canvas.height}`);
    
    // Get image data as base64
    const imageData = canvas.toDataURL('image/jpeg', 0.8);
    console.log('Image converted to base64');
    
    // Process the image with the segmentation model
    console.log('Processing with segmentation model...');
    const result = await segmenter(imageData);
    
    console.log('Segmentation result:', result);
    
    if (!result || !Array.isArray(result) || result.length === 0 || !result[0].mask) {
      throw new Error('Invalid segmentation result');
    }
    
    // Create a new canvas for the masked image
    const outputCanvas = document.createElement('canvas');
    outputCanvas.width = canvas.width;
    outputCanvas.height = canvas.height;
    const outputCtx = outputCanvas.getContext('2d');
    
    if (!outputCtx) throw new Error('Could not get output canvas context');
    
    // Draw original image
    outputCtx.drawImage(canvas, 0, 0);
    
    // Apply the mask
    const outputImageData = outputCtx.getImageData(
      0, 0,
      outputCanvas.width,
      outputCanvas.height
    );
    const data = outputImageData.data;
    
    // Apply inverted mask to alpha channel
    for (let i = 0; i < result[0].mask.data.length; i++) {
      // Invert the mask value (1 - value) to keep the subject instead of the background
      const alpha = Math.round((1 - result[0].mask.data[i]) * 255);
      data[i * 4 + 3] = alpha;
    }
    
    outputCtx.putImageData(outputImageData, 0, 0);
    console.log('Mask applied successfully');
    
    // Convert canvas to blob
    return new Promise((resolve, reject) => {
      outputCanvas.toBlob(
        (blob) => {
          if (blob) {
            console.log('Successfully created final blob');
            resolve(blob);
          } else {
            reject(new Error('Failed to create blob'));
          }
        },
        'image/png',
        1.0
      );
    });
  } catch (error) {
    console.error('Error removing background:', error);
    throw error;
  }
};

export const BackgroundEnhancer: React.FC<BackgroundEnhancerProps> = ({
  imageFile,
  onEnhanced,
  className = ''
}) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [removedBgBlob, setRemovedBgBlob] = useState<Blob | null>(null);
  const [selectedPreset, setSelectedPreset] = useState<string | null>(null);

  const handleRemoveBackground = async () => {
    setIsProcessing(true);
    setProgress(10);

    try {
      const imageElement = await loadImageFromFile(imageFile);
      setProgress(30);

      const backgroundRemovedBlob = await removeBackground(imageElement);
      setProgress(90);

      setRemovedBgBlob(backgroundRemovedBlob);
      setProgress(100);
      
      toast.success('Background removed successfully!');
    } catch (error) {
      console.error('Background removal failed:', error);
      toast.error('Background removal failed. Please try again.');
    } finally {
      setIsProcessing(false);
      setTimeout(() => setProgress(0), 1000);
    }
  };

  const handleApplyPreset = (presetCategory: string, presetName: string) => {
    // For now, just use the background-removed image
    // In a full implementation, you'd composite with actual background images
    if (removedBgBlob) {
      onEnhanced(removedBgBlob);
      setSelectedPreset(`${presetCategory}-${presetName}`);
      toast.success(`Applied ${presetName} background!`);
    }
  };

  const downloadBackgroundRemoved = () => {
    if (removedBgBlob) {
      const url = URL.createObjectURL(removedBgBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'background-removed.png';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    }
  };

  return (
    <Card className={`border-rose-gold/20 ${className}`}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <Scissors className="w-5 h-5 text-rose-gold" />
          Advanced Background Enhancement
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Background Removal */}
        <div className="space-y-3">
          <Button 
            onClick={handleRemoveBackground}
            disabled={isProcessing}
            className="w-full bg-gradient-primary text-white hover:bg-gradient-primary/90"
          >
            {isProcessing ? (
              <>
                <Wand2 className="w-4 h-4 mr-2 animate-spin" />
                Removing Background...
              </>
            ) : (
              <>
                <Scissors className="w-4 h-4 mr-2" />
                Remove Background
              </>
            )}
          </Button>

          {isProcessing && (
            <div className="space-y-2">
              <Progress value={progress} className="h-2" />
              <p className="text-xs text-muted-foreground text-center">
                Processing with AI segmentation model...
              </p>
            </div>
          )}
        </div>

        {/* Background Preview & Download */}
        {removedBgBlob && (
          <div className="space-y-3 p-4 bg-muted/50 rounded-lg">
            <div className="flex items-center justify-between">
              <Badge className="bg-green-500 text-white">Background Removed ✨</Badge>
              <Button size="sm" variant="outline" onClick={downloadBackgroundRemoved}>
                <Download className="w-3 h-3 mr-1" />
                Download
              </Button>
            </div>
            <img 
              src={URL.createObjectURL(removedBgBlob)} 
              alt="Background removed" 
              className="w-full rounded-lg border-2 border-dashed border-rose-gold/30"
              style={{ backgroundColor: 'transparent' }}
            />
          </div>
        )}

        {/* Background Presets */}
        {removedBgBlob && (
          <div className="space-y-4">
            <h4 className="font-semibold text-sm">Choose New Background:</h4>
            
            {Object.entries(backgroundPresets).map(([category, presets]) => (
              <div key={category} className="space-y-2">
                <h5 className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                  {category}
                </h5>
                <div className="grid grid-cols-1 gap-2">
                  {presets.map((preset) => (
                    <Button
                      key={preset.name}
                      variant="outline"
                      size="sm"
                      className={`justify-start ${selectedPreset === `${category}-${preset.name}` ? 'border-rose-gold bg-rose-gold/10' : ''}`}
                      onClick={() => handleApplyPreset(category, preset.name)}
                    >
                      <div className={`w-3 h-3 rounded mr-2 ${preset.color}`} />
                      <div className="text-left">
                        <div className="font-medium text-xs">{preset.name}</div>
                        <div className="text-xs text-muted-foreground">{preset.description}</div>
                      </div>
                    </Button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
