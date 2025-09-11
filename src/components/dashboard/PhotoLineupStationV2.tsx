import React, { useState, useCallback } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { 
  Upload, X, Download, Wand2, Zap, Clock, CheckCircle, 
  Scissors, Plus, Image as ImageIcon, RefreshCw
} from 'lucide-react';
import { useCredits } from '@/hooks/useCredits';
import { logger } from '@/lib/logger';
import { usePhotoEnhancement } from '@/hooks/usePhotoEnhancement';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Progress } from '@/components/ui/progress';
import { BackgroundEnhancer } from './BackgroundEnhancer';
import DemoShowcase from './DemoShowcase';
import { PhotoCategory, photoSlots, categoryPromptSuggestions } from '@/constants/photoCategories';

export interface UploadedPhoto {
  id: string;
  file: File;
  preview: string;
  category?: PhotoCategory;
  customPrompt?: string;
  enhancedUrl?: string;
}

interface PhotoLineupStationProps {
  uploadedPhotos: (UploadedPhoto | null)[];
  setUploadedPhotos: React.Dispatch<React.SetStateAction<(UploadedPhoto | null)[]>>;
  onNext?: (photo: UploadedPhoto, slotIndex: number) => void;
  onIndividualTransform?: (photo: UploadedPhoto, slotIndex: number) => void;
  onBulkTransform?: (photos: UploadedPhoto[]) => void;
}

const PhotoLineupStationV2: React.FC<PhotoLineupStationProps> = ({
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
  const [activeCategory, setActiveCategory] = useState<PhotoCategory | undefined>();
  const [showResetDialog, setShowResetDialog] = useState<boolean>(false);

  const { credits } = useCredits();
  const { isProcessing, enhancePhoto, progress } = usePhotoEnhancement();

  // Using shared photo slots and category prompt suggestions from constants
  // Debug: Check if photoSlots is properly loaded
  if (!photoSlots || photoSlots.length === 0) {
    console.error('PhotoSlots not loaded from constants');
  }

  const handleFiles = useCallback((files: File[], slotIndex: number) => {
    const file = files[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast.error('Please select an image file');
      return;
    }

    // Ensure photoSlots is available
    if (!photoSlots || photoSlots.length === 0) {
      console.error('PhotoSlots not available');
      toast.error('Configuration error - please refresh the page');
      return;
    }

    const photoId = `photo-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const newPhoto: UploadedPhoto = {
      id: photoId,
      file,
      preview: URL.createObjectURL(file),
      category: photoSlots[slotIndex]?.category
    };

    setUploadedPhotos(prev => {
      const newPhotos = [...prev];
      if (newPhotos[slotIndex]) {
        URL.revokeObjectURL(newPhotos[slotIndex]!.preview);
      }
      newPhotos[slotIndex] = newPhoto;
      return newPhotos;
    });

    // Set active category for tips
    if (photoSlots[slotIndex]) {
      setActiveCategory(photoSlots[slotIndex].category);
    }
  }, [setUploadedPhotos]);

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

      const imageDataUrl = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(photo.file);
      });

      const result = await enhancePhoto(imageDataUrl, photo.category!, photo.customPrompt);
      const enhancedUrl = result.enhancedImageUrl;
      
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

      onIndividualTransform?.(photo, slotIndex);
    } catch (error) {
      logger.error('Enhancement failed', { error, component: 'PhotoLineupStation', action: 'handleEnhance' });
      toast.error('Enhancement failed. Please try again.');
      setShowProcessingModal(false);
    } finally {
      setProcessingPhotoId(null);
    }
  };

  const handleBackgroundEnhance = (photo: UploadedPhoto, slotIndex: number) => {
    setShowBackgroundEnhancer({ photo, slotIndex });
  };

  const handleBackgroundEnhanced = (enhancedBlob: Blob, slotIndex: number) => {
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

  const handleLineupReset = () => {
    // Clean up object URLs to prevent memory leaks
    uploadedPhotos.forEach(photo => {
      if (photo) {
        URL.revokeObjectURL(photo.preview);
        if (photo.enhancedUrl) {
          URL.revokeObjectURL(photo.enhancedUrl);
        }
      }
    });

    // Reset all photos to null
    setUploadedPhotos(new Array(6).fill(null));
    
    // Reset active category
    setActiveCategory(undefined);
    
    setShowResetDialog(false);
    toast.success('Lineup cleared successfully');
    
    logger.info('Photo lineup reset', { component: 'PhotoLineupStationV2' });
  };

  const readyPhotos = uploadedPhotos.filter(photo => photo && photo.customPrompt?.trim());
  const totalBulkCost = readyPhotos.length;
  const uploadedCount = uploadedPhotos.filter(photo => photo).length;

  return (
    <div className="space-y-8">
      {/* Interactive Demo Section */}
      <DemoShowcase />
      
      {/* Streamlined Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gradient-primary">Perfect Dating Lineup</h1>
          <p className="text-sm text-muted-foreground">Upload 6 photos, pick styles, transform with AI</p>
        </div>
        
        {/* Action Controls */}
        <div className="flex items-center gap-3">
          <Badge variant="outline" className="text-sm font-medium bg-violet-purple/10 border-violet-purple/30">
            {credits} Credits
          </Badge>
          
          {uploadedCount > 0 && (
            <AlertDialog open={showResetDialog} onOpenChange={setShowResetDialog}>
              <AlertDialogTrigger asChild>
                <Button variant="outline" size="sm">
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Reset Lineup
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Reset Photo Lineup?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This will remove all {uploadedCount} uploaded photos from your lineup. This action cannot be undone.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={handleLineupReset} className="bg-destructive hover:bg-destructive/90">
                    Reset Lineup
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          )}
          
          {totalBulkCost > 0 && (
            <Button 
              onClick={handleBulkTransform} 
              disabled={credits < totalBulkCost} 
              className="btn-professional shadow-lg"
            >
              <Zap className="w-4 h-4 mr-2" />
              Transform All ({totalBulkCost})
            </Button>
          )}
        </div>
      </div>

      {/* Photo Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {photoSlots?.map((slot, index) => {
              const photo = uploadedPhotos[index];
              const Icon = slot.icon;
              const isReady = photo && photo.customPrompt?.trim();
              const isEnhanced = photo && photo.enhancedUrl;
              const isProcessing = processingPhotoId === photo?.id;

              return (
                <Card 
                  key={index} 
                  className={`group photo-card enhancement-card ${
                    photo ? slot.borderColor : 'border-dashed border-muted-foreground/30'
                  }`}
                  onClick={() => photo && setActiveCategory(slot.category)}
                >
                  <CardHeader className="pb-3">
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-lg bg-gradient-to-br ${slot.bgGradient}`}>
                        <Icon className={`w-5 h-5 ${slot.color}`} />
                      </div>
                      <div>
                        <h3 className="font-semibold text-sm">{slot.title}</h3>
                        <p className="text-xs text-muted-foreground">{slot.subtitle}</p>
                      </div>
                    </div>
                  </CardHeader>

                  <CardContent className="p-6 pt-0">
                    {/* Upload Area or Photo Preview */}
                    <div 
                      className={`relative aspect-[4/5] rounded-lg border-2 transition-all duration-300 mb-4 ${
                        dragOverIndex === index ? 'border-violet-purple bg-violet-purple/5' : 
                        photo ? 'border-solid border-transparent' : 'border-dashed border-muted-foreground/30 hover:border-violet-purple/50'
                      }`}
                      onDragOver={(e) => {
                        e.preventDefault();
                        setDragOverIndex(index);
                      }}
                      onDragLeave={() => setDragOverIndex(null)}
                      onDrop={(e) => handleDrop(e, index)}
                    >
                      {photo ? (
                        <>
                          <img 
                            src={isEnhanced ? photo.enhancedUrl : photo.preview} 
                            alt={`${slot.title} preview`}
                            className="w-full h-full object-cover rounded-lg"
                          />
                          {isEnhanced && (
                            <div className="absolute top-3 right-3">
                              <Badge className="bg-gradient-primary text-white text-xs shadow-lg">
                                ✨ Enhanced
                              </Badge>
                            </div>
                          )}
                          {/* Overlay Controls */}
                          <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg flex items-center justify-center gap-2">
                            <Button size="sm" variant="secondary" onClick={() => {
                              const input = document.createElement('input');
                              input.type = 'file';
                              input.accept = 'image/*';
                              input.onchange = (e) => {
                                const files = Array.from((e.target as HTMLInputElement).files || []);
                                handleFiles(files, index);
                              };
                              input.click();
                            }}>
                              <Upload className="w-3 h-3 mr-1" />
                              Replace
                            </Button>
                            <Button size="sm" variant="secondary" onClick={() => handleBackgroundEnhance(photo, index)}>
                              <Scissors className="w-3 h-3 mr-1" />
                              Background
                            </Button>
                            <Button size="sm" variant="destructive" onClick={() => {
                              URL.revokeObjectURL(photo.preview);
                              setUploadedPhotos(prev => {
                                const newPhotos = [...prev];
                                newPhotos[index] = null;
                                return newPhotos;
                              });
                            }}>
                              <X className="w-3 h-3" />
                            </Button>
                          </div>
                        </>
                      ) : (
                        <div 
                          className="w-full h-full flex flex-col items-center justify-center cursor-pointer hover:bg-muted/20 transition-colors duration-300 rounded-lg"
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
                          <div className={`p-4 rounded-full bg-gradient-to-br ${slot.bgGradient} mb-3`}>
                            <Plus className={`w-6 h-6 ${slot.color}`} />
                          </div>
                          <p className="text-sm font-medium text-center mb-1">{slot.description}</p>
                          <p className="text-xs text-muted-foreground text-center">
                            Click or drop photo here
                          </p>
                        </div>
                      )}
                    </div>

                    {/* Enhancement Controls */}
                    {photo && (
                      <div className="space-y-3">
                        {/* Quick Enhancement Options */}
                        <div className="space-y-2">
                          <p className="text-xs font-medium text-muted-foreground">Custom prompt:</p>
                          <div className="space-y-1">
                            {categoryPromptSuggestions[photo.category!]?.map((suggestion, suggIndex) => (
                              <Button
                                key={suggIndex}
                                variant="ghost"
                                size="sm" 
                                className={`w-full text-xs h-auto py-2 px-3 text-left justify-start ${
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
                            placeholder="Or describe your custom enhancement..."
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

                        {/* Transform Button */}
                        <Button 
                          onClick={() => handleEnhance(photo, index)}
                          disabled={!isReady || credits < 1 || isProcessing}
                          className="w-full btn-professional"
                          size="sm"
                        >
                          {isProcessing ? (
                            <>
                              <Clock className="w-3 h-3 mr-2 animate-spin" />
                              Enhancing...
                            </>
                          ) : isReady ? (
                            <>
                              <Wand2 className="w-3 h-3 mr-2" />
                              Transform (1 Credit)
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

export default PhotoLineupStationV2;