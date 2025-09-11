import React, { useState, useCallback } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { Target, Heart, Users, Activity, Mountain, Sparkles, Upload, X, Download, Wand2, Zap, Clock, CheckCircle, Scissors } from 'lucide-react';
import { useCredits } from '@/hooks/useCredits';
import { logger } from '@/lib/logger';
import { usePhotoEnhancement } from '@/hooks/usePhotoEnhancement';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Progress } from '@/components/ui/progress';
import { BackgroundEnhancer } from './BackgroundEnhancer';

export interface UploadedPhoto {
  id: string;
  file: File;
  preview: string;
  category?: PhotoCategory;
  customPrompt?: string; // Changed from theme to customPrompt
  enhancedUrl?: string;
}

export type PhotoCategory = 'the-hook' | 'style-confidence' | 'social-proof' | 'passion-hobbies' | 'lifestyle-adventure' | 'personality-closer';
export type EnhancementTheme = 'confident-successful' | 'authentic-approachable' | 'irresistible-magnetic' | 'stunning-sophisticated' | 'creative-unique';

interface PhotoLineupStationProps {
  uploadedPhotos: (UploadedPhoto | null)[];
  setUploadedPhotos: React.Dispatch<React.SetStateAction<(UploadedPhoto | null)[]>>;
  onNext?: (photo: UploadedPhoto, slotIndex: number) => void;
  onIndividualTransform?: (photo: UploadedPhoto, slotIndex: number) => void;
  onBulkTransform?: (photos: UploadedPhoto[]) => void;
}

const PhotoLineupStation: React.FC<PhotoLineupStationProps> = ({
  uploadedPhotos,
  setUploadedPhotos,
  onNext,
  onIndividualTransform,
  onBulkTransform
}) => {
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);
  const [processingPhotoId, setProcessingPhotoId] = useState<string | null>(null);
  const [showProcessingModal, setShowProcessingModal] = useState<boolean>(false);
  const [showResultsModal, setShowResultsModal] = useState<{
    photo: UploadedPhoto;
    slotIndex: number;
  } | null>(null);
  const [currentProcessingPhoto, setCurrentProcessingPhoto] = useState<{
    photo: UploadedPhoto;
    slotIndex: number;
  } | null>(null);
  const [showBackgroundEnhancer, setShowBackgroundEnhancer] = useState<{
    photo: UploadedPhoto;
    slotIndex: number;
  } | null>(null);

  const { credits } = useCredits();
  const { isProcessing, enhancePhoto, progress } = usePhotoEnhancement();

  // Photo slots configuration with categories
  const photoSlots = [{
    title: "The Hook",
    subtitle: "First Impression Winner",
    description: "Your best headshot or close-up that stops the scroll. This is your main profile photo.",
    icon: Target,
    color: "text-rose-500",
    bgColor: "bg-rose-500/10 border-rose-500/30",
    category: 'the-hook' as PhotoCategory,
    required: true
  }, {
    title: "Style & Confidence",
    subtitle: "Full Body Appeal",
    description: "Show your style and confidence. A full-body shot that displays your fashion sense.",
    icon: Heart,
    color: "text-pink-500",
    bgColor: "bg-pink-500/10 border-pink-500/30",
    category: 'style-confidence' as PhotoCategory,
    required: true
  }, {
    title: "Social Proof",
    subtitle: "You're Fun Company",
    description: "With friends or at events. Shows you're socially connected and fun to be around.",
    icon: Users,
    color: "text-blue-500",
    bgColor: "bg-blue-500/10 border-blue-500/30",
    category: 'social-proof' as PhotoCategory,
    required: false
  }, {
    title: "Your Passion",
    subtitle: "Show What You Love",
    description: "An action shot of you doing something you're passionate about. Great conversation starter!",
    icon: Activity,
    color: "text-green-500",
    bgColor: "bg-green-500/10 border-green-500/30",
    category: 'passion-hobbies' as PhotoCategory,
    required: false
  }, {
    title: "Adventure Side",
    subtitle: "Your Aspirational Self",
    description: "Travel or outdoor activities that show you're interesting and adventurous.",
    icon: Mountain,
    color: "text-orange-500",
    bgColor: "bg-orange-500/10 border-orange-500/30",
    category: 'lifestyle-adventure' as PhotoCategory,
    required: false
  }, {
    title: "Personality Plus",
    subtitle: "Genuine & Fun",
    description: "With pets, genuine laughter, or something that shows your fun personality.",
    icon: Sparkles,
    color: "text-violet-500",
    bgColor: "bg-violet-500/10 border-violet-500/30",
    category: 'personality-closer' as PhotoCategory,
    required: false
  }];

  const themes = [{
    id: 'confident-successful',
    name: 'Confident & Successful',
    description: 'Professional, polished, and accomplished'
  }, {
    id: 'authentic-approachable',
    name: 'Authentic & Approachable',
    description: 'Genuine, warm, and relatable'
  }, {
    id: 'irresistible-magnetic',
    name: 'Irresistible & Magnetic',
    description: 'Charismatic, alluring, and captivating'
  }, {
    id: 'stunning-sophisticated',
    name: 'Stunning & Sophisticated',
    description: 'Elegant, refined, and tasteful'
  }, {
    id: 'creative-unique',
    name: 'Creative & Unique',
    description: 'Artistic, original, and memorable'
  }];

  // Category-specific enhancement suggestions
  const categoryPromptSuggestions = {
    'the-hook': [
      "Golden hour lighting with sparkling eyes and confident smile",
      "Professional headshot with perfect facial symmetry and warm lighting",
      "Natural outdoor portrait with soft bokeh background",
      "Studio quality with flawless skin and magnetic gaze",
      "Candid laugh with professional lighting enhancement"
    ],
    'style-confidence': [
      "Fashion magazine pose with perfect posture and premium outfit", 
      "Urban street style with confident stance and dynamic background",
      "Elegant formal look with sophisticated lighting", 
      "Replace background with luxury penthouse setting",
      "High-fashion editorial with dramatic shadows"
    ],
    'social-proof': [
      "Make me the clear focal point with enhanced lighting on my face",
      "Boost my presence while keeping friends naturally lit",
      "Premium event atmosphere with me as the standout star",
      "Replace background with upscale rooftop party setting",
      "Natural group interaction with perfect composition"
    ],
    'passion-hobbies': [
      "Dynamic action shot with professional sports photography lighting",
      "Expert-level skill display with enhanced equipment and dramatic background",
      "Peak performance moment with motion blur and intensity",
      "Replace background with epic stadium or premium gym setting",
      "Adventure gear enhancement with outdoor lighting perfection"
    ],
    'lifestyle-adventure': [
      "Epic landscape with dramatic sky and perfect golden hour",
      "Replace background with stunning mountain vista or tropical paradise", 
      "Enhance to Maldives-level luxury resort background",
      "National Geographic quality with enhanced natural colors",
      "Adventure documentary style with cinematic lighting"
    ],
    'personality-closer': [
      "Warm, cozy lighting with genuine laughter and connection",
      "Perfect pet photography with enhanced colors and expressions",
      "Candid moment with professional portrait quality",
      "Replace background with cozy coffee shop or luxury home setting",
      "Heartwarming scene with enhanced emotional connection"
    ]
  };

  // Helper function to convert blob URL to base64
  const blobToBase64 = (blob: Blob): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  };

  const handleFiles = useCallback((files: File[], slotIndex: number) => {
    const file = files[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast.error('Please select an image file');
      return;
    }

    const photoId = `photo-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const newPhoto: UploadedPhoto = {
      id: photoId,
      file,
      preview: URL.createObjectURL(file),
      category: photoSlots[slotIndex].category // Auto-assign category based on slot
    };

    setUploadedPhotos(prev => {
      const newPhotos = [...prev];
      // Clean up old preview URL if exists
      if (newPhotos[slotIndex]) {
        URL.revokeObjectURL(newPhotos[slotIndex]!.preview);
      }
      newPhotos[slotIndex] = newPhoto;
      return newPhotos;
    });
  }, [photoSlots, setUploadedPhotos]);

  const handleDrop = useCallback((e: React.DragEvent, slotIndex: number) => {
    e.preventDefault();
    setDragOverIndex(null);
    const files = Array.from(e.dataTransfer.files);
    handleFiles(files, slotIndex);
  }, [handleFiles]);

  const handleEnhance = async (photo: UploadedPhoto, slotIndex: number) => {
    if (credits < 1) {
      toast.error('Insufficient credits. Please purchase more credits to continue.');
      return;
    }

    if (!photo.customPrompt?.trim()) {
      toast.error('Please select an enhancement style first.');
      return;
    }

    try {
      setShowProcessingModal(true);
      setCurrentProcessingPhoto({ photo, slotIndex });
      setProcessingPhotoId(photo.id);

      logger.info('Starting photo enhancement', { 
        photoId: photo.id, 
        slotIndex, 
        category: photo.category, 
        prompt: photo.customPrompt 
      });

      // Convert file to base64 for the enhancement API
      const imageDataUrl = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(photo.file);
      });

      const result = await enhancePhoto(imageDataUrl, photo.category!, photo.customPrompt);
      const enhancedUrl = result.enhancedImageUrl;
      
      // Update the photo with the enhanced URL
      setUploadedPhotos(prev => {
        const newPhotos = [...prev];
        if (newPhotos[slotIndex]) {
          newPhotos[slotIndex] = {
            ...newPhotos[slotIndex]!,
            enhancedUrl: enhancedUrl
          };
        }
        return newPhotos;
      });

      setShowProcessingModal(false);
      setShowResultsModal({ photo: { ...photo, enhancedUrl }, slotIndex });
      
      logger.info('Photo enhancement completed', { photoId: photo.id, enhancedUrl });
      toast.success('Photo enhanced successfully! ✨');

      // Call the callback if provided
      onIndividualTransform?.(photo, slotIndex);
    } catch (error) {
      logger.error('Enhancement failed', { error, component: 'PhotoLineupStation', action: 'handleEnhance' });
      toast.error('Enhancement failed. Please try again.');
      setShowProcessingModal(false);
    }
  };

  const handleBackgroundEnhance = (photo: UploadedPhoto, slotIndex: number) => {
    setShowBackgroundEnhancer({ photo, slotIndex });
  };

  const handleBackgroundEnhanced = (enhancedBlob: Blob, slotIndex: number) => {
    // Process the enhanced background image
    const enhancedUrl = URL.createObjectURL(enhancedBlob);
    
    setUploadedPhotos(prev => {
      const newPhotos = [...prev];
      if (newPhotos[slotIndex]) {
        newPhotos[slotIndex] = {
          ...newPhotos[slotIndex]!,
          enhancedUrl: enhancedUrl
        };
      }
      return newPhotos;
    });

    setShowBackgroundEnhancer(null);
    toast.success('Background enhanced successfully! ✨');
  };

  const handleBulkTransform = () => {
    const readyPhotos = uploadedPhotos.filter(photo => photo && photo.customPrompt?.trim()) as UploadedPhoto[];
    
    if (readyPhotos.length === 0) {
      toast.error('No photos are ready for transformation. Please select enhancement styles first.');
      return;
    }

    onBulkTransform?.(readyPhotos);
  };

  const downloadImage = async (imageUrl: string, filename: string) => {
    try {
      const response = await fetch(imageUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      logger.error('Download failed', { error, component: 'PhotoLineupStation', action: 'handleDownload' });
      toast.error('Download failed. Please try again.');
    }
  };

  const readyPhotos = uploadedPhotos.filter(photo => photo && photo.customPrompt?.trim());
  const totalBulkCost = readyPhotos.length;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Main Photo Lineup */}
      <div className="lg:col-span-2 space-y-6">
        {/* Header with Credits and Bulk Action */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gradient-primary mb-1">
              Your Dating Photo Lineup
            </h2>
            <p className="text-muted-foreground text-sm">
              Upload photos to each category, select themes, and transform them instantly
            </p>
          </div>
          <div className="flex items-center gap-4">
            <Badge variant="outline" className="text-sm font-medium">
              {credits} Credits Available
            </Badge>
            {totalBulkCost > 0 && (
              <Button 
                onClick={handleBulkTransform} 
                disabled={credits < totalBulkCost} 
                className="bg-gradient-primary text-white hover:bg-gradient-primary/90"
              >
                <Zap className="w-4 h-4 mr-2" />
                Transform All ({totalBulkCost})
              </Button>
            )}
          </div>
        </div>

        {/* Photo Slots Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {photoSlots.map((slot, index) => {
            const photo = uploadedPhotos[index];
            const Icon = slot.icon;
            const isReady = photo && photo.customPrompt?.trim();
            const isEnhanced = photo && photo.enhancedUrl;

            return (
              <Card key={index} className={`${slot.bgColor} border-2 transition-all duration-300 hover:shadow-lg`}>
                <CardContent className="p-6">
                  {/* Slot Header */}
                  <div className="flex items-center gap-3 mb-4">
                    <div className={`p-2 rounded-lg bg-background/50`}>
                      <Icon className={`w-5 h-5 ${slot.color}`} />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-sm">{slot.title}</h3>
                      <p className="text-xs text-muted-foreground">{slot.subtitle}</p>
                    </div>
                  </div>

                  {/* Upload Area or Photo Preview */}
                  <div className={`
                    relative aspect-[4/5] rounded-lg border-2 border-dashed transition-all duration-300 mb-4
                    ${dragOverIndex === index ? 'border-violet-purple bg-violet-purple/5' : 'border-muted-foreground/30'}
                    ${photo ? 'border-solid' : 'hover:border-violet-purple/50'}
                  `}
                  onDragOver={(e) => {
                    e.preventDefault();
                    setDragOverIndex(index);
                  }}
                  onDragLeave={() => setDragOverIndex(null)}
                  onDrop={(e) => handleDrop(e, index)}>
                    {photo ? (
                      <>
                        <img 
                          src={isEnhanced ? photo.enhancedUrl : photo.preview} 
                          alt={`${slot.title} preview`}
                          className="w-full h-full object-cover rounded-lg"
                        />
                        {isEnhanced && (
                          <div className="absolute top-2 right-2">
                            <Badge className="bg-gradient-primary text-white text-xs">
                              ✨ Enhanced
                            </Badge>
                          </div>
                        )}
                        <div className="absolute inset-0 bg-black/50 opacity-0 hover:opacity-100 transition-opacity duration-300 rounded-lg flex items-center justify-center gap-2">
                          <Button 
                            size="sm" 
                            variant="secondary"
                            onClick={() => {
                              const input = document.createElement('input');
                              input.type = 'file';
                              input.accept = 'image/*';
                              input.onchange = (e) => {
                                const files = Array.from((e.target as HTMLInputElement).files || []);
                                handleFiles(files, index);
                              };
                              input.click();
                            }}
                          >
                            <Upload className="w-3 h-3 mr-1" />
                            Replace
                          </Button>
                          {photo && (
                            <Button 
                              size="sm" 
                              variant="secondary"
                              onClick={() => handleBackgroundEnhance(photo, index)}
                            >
                              <Scissors className="w-3 h-3 mr-1" />
                              Background
                            </Button>
                          )}
                          <Button 
                            size="sm" 
                            variant="destructive"
                            onClick={() => {
                              URL.revokeObjectURL(photo.preview);
                              setUploadedPhotos(prev => {
                                const newPhotos = [...prev];
                                newPhotos[index] = null;
                                return newPhotos;
                              });
                            }}
                          >
                            <X className="w-3 h-3" />
                          </Button>
                        </div>
                      </>
                    ) : (
                      <div 
                        className="w-full h-full flex flex-col items-center justify-center cursor-pointer hover:bg-muted/50 transition-colors duration-300"
                        onClick={() => {
                          const input = document.createElement('input');
                          input.type = 'file';
                          input.accept = 'image/*';
                          input.onchange = (e) => {
                            const files = Array.from((e.target as HTMLInputElement).files || []);
                            handleFiles(files, index);
                          };
                          input.click();
                        }}
                      >
                        <Upload className="w-8 h-8 text-muted-foreground mb-2" />
                        <p className="text-xs text-muted-foreground text-center">
                          Drop photo here or click to upload
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Enhancement Suggestions */}
                  {photo && (
                    <div className="space-y-3">
                      <div className="space-y-2">
                        <label className="text-xs font-medium text-muted-foreground">
                          Choose Enhancement Style:
                        </label>
                        <div className="grid gap-1">
                          {categoryPromptSuggestions[photo.category!]?.slice(0, 3).map((suggestion, suggIndex) => (
                            <Button
                              key={suggIndex}
                              variant="ghost"
                              size="sm" 
                              className={`text-xs h-auto py-2 px-3 text-left justify-start whitespace-normal ${
                                photo.customPrompt === suggestion 
                                  ? 'bg-gradient-primary/10 text-gradient-primary border border-violet-purple/30' 
                                  : 'hover:bg-muted/50'
                              }`}
                              onClick={() => {
                                setUploadedPhotos(prev => {
                                  const newPhotos = [...prev];
                                  if (newPhotos[index]) {
                                    newPhotos[index] = {
                                      ...newPhotos[index]!,
                                      customPrompt: suggestion
                                    };
                                  }
                                  return newPhotos;
                                });
                              }}
                            >
                              {suggestion}
                            </Button>
                          ))}
                        </div>
                      </div>

                      {/* Custom Enhancement Input */}
                      <div className="space-y-2">
                        <Textarea
                          placeholder="Or write your custom enhancement prompt..."
                          value={photo.customPrompt || ''}
                          onChange={(e) => {
                            setUploadedPhotos(prev => {
                              const newPhotos = [...prev];
                              if (newPhotos[index]) {
                                newPhotos[index] = {
                                  ...newPhotos[index]!,
                                  customPrompt: e.target.value
                                };
                              }
                              return newPhotos;
                            });
                          }}
                          className="text-xs resize-none"
                          rows={2}
                        />
                      </div>

                      {/* Action Button */}
                      <Button 
                        onClick={() => handleEnhance(photo, index)}
                        disabled={!isReady || credits < 1 || processingPhotoId === photo.id}
                        className="w-full bg-gradient-primary text-white hover:bg-gradient-primary/90"
                        size="sm"
                      >
                        {processingPhotoId === photo.id ? (
                          <>
                            <Clock className="w-3 h-3 mr-2 animate-spin" />
                            Enhancing...
                          </>
                        ) : isReady ? (
                          <>
                            <Wand2 className="w-3 h-3 mr-2" />
                            Transform Photo (1 Credit)
                          </>
                        ) : (
                          'Select Enhancement Style'
                        )}
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Processing Modal */}
      <Dialog open={showProcessingModal} onOpenChange={() => {}}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Wand2 className="w-5 h-5 text-violet-purple animate-spin" />
              Enhancing Your Photo
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="flex items-center gap-4">
              {currentProcessingPhoto && (
                <img 
                  src={currentProcessingPhoto.photo.preview}
                  alt="Processing"
                  className="w-16 h-16 object-cover rounded-lg"
                />
              )}
              <div className="flex-1">
                <p className="text-sm font-medium">AI Enhancement in Progress</p>
                <p className="text-xs text-muted-foreground">This may take 30-60 seconds...</p>
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span>Progress</span>
                <span>{progress}%</span>
              </div>
              <Progress value={progress} className="h-2" />
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Results Modal */}
      <Dialog open={!!showResultsModal} onOpenChange={() => setShowResultsModal(null)}>
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-green-500" />
              Enhancement Complete!
            </DialogTitle>
          </DialogHeader>
          {showResultsModal && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-medium text-sm mb-2">Original</h4>
                  <img 
                    src={showResultsModal.photo.preview} 
                    alt="Original" 
                    className="w-full aspect-[4/5] object-cover rounded-lg border"
                  />
                </div>
                <div>
                  <h4 className="font-medium text-sm mb-2">Enhanced ✨</h4>
                  <img 
                    src={showResultsModal.photo.enhancedUrl} 
                    alt="Enhanced" 
                    className="w-full aspect-[4/5] object-cover rounded-lg border"
                  />
                </div>
              </div>
              
              <div className="flex gap-3 justify-center">
                <Button 
                  onClick={() => downloadImage(showResultsModal.photo.enhancedUrl!, `enhanced-photo-${showResultsModal.slotIndex + 1}.png`)} 
                  className="bg-gradient-primary text-white hover:bg-gradient-primary/90"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Download Enhanced Photo
                </Button>
                <Button onClick={() => setShowResultsModal(null)} variant="outline">
                  Continue Editing
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Background Enhancer Modal */}
      <Dialog open={!!showBackgroundEnhancer} onOpenChange={() => setShowBackgroundEnhancer(null)}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Scissors className="w-5 h-5 text-rose-gold" />
              Advanced Background Enhancement
            </DialogTitle>
          </DialogHeader>
          {showBackgroundEnhancer && (
            <BackgroundEnhancer
              imageFile={showBackgroundEnhancer.photo.file}
              onEnhanced={(blob) => handleBackgroundEnhanced(blob, showBackgroundEnhancer.slotIndex)}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default PhotoLineupStation;