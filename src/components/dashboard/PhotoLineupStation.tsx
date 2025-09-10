import React, { useState, useCallback } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { Target, Heart, Users, Activity, Mountain, Sparkles, Upload, X, Download, Wand2, Zap, Clock, CheckCircle } from 'lucide-react';
import { useCredits } from '@/hooks/useCredits';
import { logger } from '@/lib/logger';
import { usePhotoEnhancement } from '@/hooks/usePhotoEnhancement';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Progress } from '@/components/ui/progress';
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
  const {
    credits
  } = useCredits();
  const {
    isProcessing,
    enhancePhoto,
    progress
  } = usePhotoEnhancement();
  const photoSlots = [{
    title: "The Perfect First Impression",
    subtitle: "Your Best Headshot",
    description: "A crisp, smiling, well-lit headshot with visible eyes. Make them stop scrolling!",
    icon: Target,
    color: "text-pink-500",
    bgColor: "bg-pink-500/10 border-pink-500/30",
    category: 'the-hook' as PhotoCategory,
    required: true
  }, {
    title: "Show Your Style",
    subtitle: "Full-Body Confidence",
    description: "Show off your style and posture. Avoid mirror selfies - let your confidence shine!",
    icon: Heart,
    color: "text-purple-500",
    bgColor: "bg-purple-500/10 border-purple-500/30",
    category: 'style-confidence' as PhotoCategory,
    required: false
  }, {
    title: "Social Butterfly",
    subtitle: "With Friends",
    description: "A fun shot with friends (max 2-3). Make sure you're the main focus and clearly identifiable.",
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
    description: 'Genuine, warm, and down-to-earth'
  }, {
    id: 'irresistible-magnetic',
    name: 'Irresistible & Magnetic',
    description: 'Captivating, alluring, and memorable'
  }, {
    id: 'stunning-sophisticated',
    name: 'Stunning & Sophisticated',
    description: 'Elegant, refined, and classy'
  }, {
    id: 'creative-unique',
    name: 'Creative & Unique',
    description: 'Artistic, original, and intriguing'
  }];
  const promptSuggestions = ["Make me look confident and successful", "Natural and approachable vibe", "Professional but friendly", "Mysterious and intriguing", "Fun and energetic personality", "Sophisticated and elegant", "Creative and artistic look"];

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
  const handleFileInput = useCallback((e: React.ChangeEvent<HTMLInputElement>, slotIndex: number) => {
    const files = Array.from(e.target.files || []);
    handleFiles(files, slotIndex);
    // Reset input value to allow selecting the same file again
    e.target.value = '';
  }, [handleFiles]);
  const removePhoto = (index: number) => {
    setUploadedPhotos(prev => {
      const newPhotos = [...prev];
      if (newPhotos[index]) {
        URL.revokeObjectURL(newPhotos[index]!.preview);
        newPhotos[index] = null;
      }
      return newPhotos;
    });
  };
  const handlePromptChange = (photo: UploadedPhoto, slotIndex: number, customPrompt: string) => {
    setUploadedPhotos(prev => {
      const newPhotos = [...prev];
      newPhotos[slotIndex] = {
        ...photo,
        customPrompt
      };
      return newPhotos;
    });
  };
  const handleIndividualTransform = async (photo: UploadedPhoto, slotIndex: number) => {
    if (credits < 1) {
      toast.error('Insufficient credits. Please purchase more credits to enhance photos.');
      return;
    }
    if (!photo.customPrompt?.trim()) {
      toast.error('Please enter your desired vibe/style first.');
      return;
    }
    setCurrentProcessingPhoto({
      photo,
      slotIndex
    });
    setShowProcessingModal(true);
    try {
      // Convert blob URL to base64 data URL
      let imageDataUrl: string;
      if (photo.preview.startsWith('blob:')) {
        const response = await fetch(photo.preview);
        const blob = await response.blob();
        imageDataUrl = await blobToBase64(blob);
      } else {
        imageDataUrl = photo.preview;
      }
      const result = await enhancePhoto(imageDataUrl, photo.category!, photo.customPrompt);

      // Update the photo with enhanced version
      setUploadedPhotos(prev => {
        const newPhotos = [...prev];
        newPhotos[slotIndex] = {
          ...newPhotos[slotIndex]!,
          enhancedUrl: result.enhancedImageUrl
        };
        return newPhotos;
      });
      setShowProcessingModal(false);
      setShowResultsModal({
        photo: {
          ...photo,
          enhancedUrl: result.enhancedImageUrl
        },
        slotIndex
      });
      onIndividualTransform?.(photo, slotIndex);
    } catch (error) {
      logger.error('Enhancement failed', { error, component: 'PhotoLineupStation', action: 'handleEnhance' });
      toast.error('Enhancement failed. Please try again.');
      setShowProcessingModal(false);
    }
  };
  const handleBulkTransform = () => {
    const readyPhotos = uploadedPhotos.filter(photo => photo && photo.customPrompt?.trim());
    const totalCost = readyPhotos.length;
    if (credits < totalCost) {
      toast.error(`Insufficient credits. You need ${totalCost} credits but only have ${credits}.`);
      return;
    }
    if (readyPhotos.length === 0) {
      toast.error('Please upload and add custom prompts for at least one photo first.');
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
  return <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
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
            {totalBulkCost > 0 && <Button onClick={handleBulkTransform} disabled={credits < totalBulkCost} className="bg-gradient-primary text-white hover:bg-gradient-primary/90">
                <Zap className="w-4 h-4 mr-2" />
                Transform All ({totalBulkCost})
              </Button>}
          </div>
        </div>

        {/* Photo Slots Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {photoSlots.map((slot, index) => {
          const photo = uploadedPhotos[index];
          const Icon = slot.icon;
          const isReady = photo && photo.customPrompt?.trim();
          const isEnhanced = photo && photo.enhancedUrl;
          return <Card key={index} className={`${slot.bgColor} border-2 transition-all duration-300 hover:shadow-lg`}>
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
                    {slot.required}
                  </div>

                  {/* Upload Area or Photo Preview */}
                  <div className={`
                      relative aspect-[4/5] rounded-lg border-2 border-dashed transition-all duration-300 mb-4
                      ${dragOverIndex === index ? 'border-primary bg-primary/5' : 'border-muted'}
                      ${!photo ? 'hover:border-primary/50 cursor-pointer' : ''}
                    `} onDragOver={e => {
                e.preventDefault();
                setDragOverIndex(index);
              }} onDragLeave={() => setDragOverIndex(null)} onDrop={e => handleDrop(e, index)} onClick={() => !photo && document.getElementById(`file-input-${index}`)?.click()}>
                    {!photo ? <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-4">
                        <Upload className="w-8 h-8 text-muted-foreground mb-2" />
                        <p className="text-sm font-medium mb-1">Upload Photo</p>
                        <p className="text-xs text-muted-foreground">Drag & drop or click</p>
                      </div> : <>
                        <img src={photo.enhancedUrl || photo.preview} alt="Uploaded" className="w-full h-full object-cover rounded-lg" />
                        <button onClick={e => {
                    e.stopPropagation();
                    removePhoto(index);
                  }} className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors">
                          <X className="w-3 h-3" />
                        </button>
                        
                        {/* Status Badge */}
                        <div className="absolute top-2 left-2">
                          {isEnhanced ? <Badge className="bg-green-500 text-white">Enhanced ✨</Badge> : isReady ? <Badge className="bg-blue-500 text-white">Ready 🎯</Badge> : <Badge variant="outline" className="bg-background/80">Needs Theme</Badge>}
                        </div>
                      </>}

                    <input id={`file-input-${index}`} type="file" accept="image/*" className="hidden" onChange={e => handleFileInput(e, index)} />
                  </div>

                  {/* Photo Description */}
                  <p className="text-xs text-muted-foreground mb-4 leading-relaxed">
                    {slot.description}
                  </p>

                  {/* Custom Vibe Input & Actions */}
                  {photo && <div className="space-y-3">
                      <div>
                        <label className="text-xs font-medium text-muted-foreground mb-2 block">
                          Describe your desired vibe/style:
                        </label>
                        <Textarea value={photo.customPrompt || ''} onChange={e => handlePromptChange(photo, index, e.target.value)} placeholder="e.g., Make me look confident and professional, or natural and approachable..." className="h-20 text-xs resize-none" />
                        
                        {/* Suggestion buttons */}
                        <div className="flex flex-wrap gap-1 mt-2">
                          {promptSuggestions.slice(0, 3).map((suggestion, i) => <Button key={i} variant="outline" size="sm" className="text-xs h-6 px-2" onClick={() => handlePromptChange(photo, index, suggestion)}>
                              {suggestion}
                            </Button>)}
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex gap-2">
                        {photo.customPrompt?.trim() && !photo.enhancedUrl && <Button onClick={() => handleIndividualTransform(photo, index)} disabled={processingPhotoId === photo.id || credits < 1} size="sm" className="flex-1 bg-gradient-primary text-white hover:bg-gradient-primary/90">
                            {processingPhotoId === photo.id ? <Clock className="w-3 h-3 mr-1" /> : <Wand2 className="w-3 h-3 mr-1" />}
                            Transform
                          </Button>}
                        
                        {photo.enhancedUrl && <Button onClick={() => downloadImage(photo.enhancedUrl!, `enhanced-photo-${index + 1}.png`)} size="sm" variant="outline" className="flex-1">
                            <Download className="w-3 h-3 mr-1" />
                            Download
                          </Button>}
                      </div>
                    </div>}
                </CardContent>
              </Card>;
        })}
        </div>
      </div>

      {/* Sidebar with Tips */}
      <div className="space-y-6">
        <Card className="bg-gradient-to-br from-violet-purple/10 to-bright-pink/10 border-violet-purple/20">
          <CardContent className="p-6">
            <h3 className="font-bold text-lg mb-4 text-gradient-primary">Dating Photo Secrets</h3>
            <div className="space-y-4 text-sm">
              <div>
                <h4 className="font-semibold mb-2">✨ The Golden Rules</h4>
                <ul className="space-y-1 text-muted-foreground">
                  <li>• Eye contact is everything</li>
                  <li>• Natural lighting wins</li>
                  <li>• Show your genuine smile</li>
                  <li>• Quality over quantity</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-2">🎯 Pro Tips</h4>
                <ul className="space-y-1 text-muted-foreground">
                  <li>• Avoid group photos as your main</li>
                  <li>• Include full-body shots</li>
                  <li>• Show your interests</li>
                  <li>• Keep it recent (within 2 years)</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-500/10 to-blue-500/10 border-green-500/20">
          <CardContent className="p-6">
            <h3 className="font-bold text-lg mb-4">Success Formula</h3>
            <div className="space-y-3 text-sm">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-500" />
                <span>Upload to category-specific slots</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-500" />
                <span>Choose the perfect vibe/theme</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-500" />
                <span>Transform with AI enhancement</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-500" />
                <span>Download and upload to dating apps</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Processing Modal */}
      <Dialog open={showProcessingModal} onOpenChange={setShowProcessingModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-center">✨ Transforming Your Photo</DialogTitle>
          </DialogHeader>
          <div className="space-y-6 py-4">
            {currentProcessingPhoto && <div className="text-center">
                <div className="relative w-32 h-40 mx-auto mb-4 rounded-lg overflow-hidden">
                  <img src={currentProcessingPhoto.photo.preview} alt="Processing" className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-violet-purple/20 flex items-center justify-center">
                    <Wand2 className="w-8 h-8 text-white animate-pulse" />
                  </div>
                </div>
                <h3 className="font-semibold mb-2">
                  {photoSlots[currentProcessingPhoto.slotIndex].title}
                </h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Applying custom enhancement: "{currentProcessingPhoto.photo.customPrompt}"...
                </p>
                <Progress value={progress} className="w-full" />
                <p className="text-xs text-muted-foreground mt-2">
                  {progress}% complete
                </p>
              </div>}
          </div>
        </DialogContent>
      </Dialog>

      {/* Results Modal */}
      <Dialog open={!!showResultsModal} onOpenChange={() => setShowResultsModal(null)}>
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-center">🎉 Transformation Complete!</DialogTitle>
          </DialogHeader>
          {showResultsModal && <div className="space-y-6 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center">
                  <h3 className="font-semibold mb-2">Before</h3>
                  <div className="aspect-[4/5] rounded-lg overflow-hidden">
                    <img src={showResultsModal.photo.preview} alt="Original" className="w-full h-full object-cover" />
                  </div>
                </div>
                <div className="text-center">
                  <h3 className="font-semibold mb-2">After ✨</h3>
                  <div className="aspect-[4/5] rounded-lg overflow-hidden">
                    <img src={showResultsModal.photo.enhancedUrl!} alt="Enhanced" className="w-full h-full object-cover" />
                  </div>
                </div>
              </div>
              
              <div className="flex gap-3 justify-center">
                <Button onClick={() => downloadImage(showResultsModal.photo.enhancedUrl!, `enhanced-photo-${showResultsModal.slotIndex + 1}.png`)} className="bg-gradient-primary text-white hover:bg-gradient-primary/90">
                  <Download className="w-4 h-4 mr-2" />
                  Download Enhanced Photo
                </Button>
                <Button onClick={() => setShowResultsModal(null)} variant="outline">
                  Continue Editing
                </Button>
              </div>
            </div>}
        </DialogContent>
      </Dialog>
    </div>;
};
export default PhotoLineupStation;