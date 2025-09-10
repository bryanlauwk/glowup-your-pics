import React, { useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Upload, X, Plus, Sparkles, Camera, Target, Heart, Users, Mountain, Compass, Activity, Zap, Download, CreditCard, ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { CategorySelectionModal } from './CategorySelectionModal';
import { ThemeSelectionModal } from './ThemeSelectionModal';
import { useCredits } from '@/hooks/useCredits';
import { usePhotoEnhancement } from '@/hooks/usePhotoEnhancement';
import { toast } from 'sonner';

interface UploadedPhoto {
  id: string;
  file: File;
  preview: string;
  category?: PhotoCategory;
  theme?: EnhancementTheme;
  analysis?: any;
  enhancedUrl?: string;
}

type PhotoCategory = 'the-hook' | 'style-confidence' | 'social-proof' | 'passion-hobbies' | 'lifestyle-adventure' | 'personality-closer';
type EnhancementTheme = 'confident-successful' | 'authentic-approachable' | 'irresistible-magnetic' | 'stunning-sophisticated' | 'creative-unique';

interface PhotoLineupStationProps {
  uploadedPhotos: UploadedPhoto[];
  setUploadedPhotos: React.Dispatch<React.SetStateAction<UploadedPhoto[]>>;
  onNext: (photo: UploadedPhoto, slotIndex: number) => void;
  onIndividualTransform?: (photo: UploadedPhoto, slotIndex: number) => void;
  onBulkTransform?: (photos: UploadedPhoto[]) => void;
}

export const PhotoLineupStation: React.FC<PhotoLineupStationProps> = ({
  uploadedPhotos,
  setUploadedPhotos,
  onNext,
  onIndividualTransform,
  onBulkTransform,
}) => {
  const [isDragging, setIsDragging] = useState<number>(-1);
  const [showCategoryModal, setShowCategoryModal] = useState<{ slotIndex: number } | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<PhotoCategory | null>(null);
  const [processingPhotoId, setProcessingPhotoId] = useState<string | null>(null);
  const { credits, loading: creditsLoading } = useCredits();
  const { isProcessing, enhancePhoto } = usePhotoEnhancement();

  const photoSlots = [
    {
      title: "The Perfect First Impression",
      subtitle: "Your Best Headshot",
      description: "A crisp, smiling, well-lit headshot with visible eyes. Make them stop scrolling!",
      icon: Target,
      color: "text-pink-500",
      bgColor: "bg-pink-500/10 border-pink-500/30",
      required: true
    },
    {
      title: "Show Your Style",
      subtitle: "Full-Body Confidence",
      description: "Show off your style and posture. Avoid mirror selfies - let your confidence shine!",
      icon: Heart,
      color: "text-purple-500", 
      bgColor: "bg-purple-500/10 border-purple-500/30",
      required: false
    },
    {
      title: "Social Butterfly",
      subtitle: "With Friends",
      description: "A fun shot with friends (max 2-3). Make sure you're the main focus and clearly identifiable.",
      icon: Users,
      color: "text-blue-500",
      bgColor: "bg-blue-500/10 border-blue-500/30", 
      required: false
    },
    {
      title: "Your Passion",
      subtitle: "Show What You Love",
      description: "An action shot of you doing something you're passionate about. Great conversation starter!",
      icon: Activity,
      color: "text-green-500",
      bgColor: "bg-green-500/10 border-green-500/30",
      required: false
    },
    {
      title: "Adventure Side",
      subtitle: "Your Aspirational Self",
      description: "Travel or outdoor activities that show you're interesting and adventurous.",
      icon: Mountain,
      color: "text-orange-500",
      bgColor: "bg-orange-500/10 border-orange-500/30",
      required: false
    },
    {
      title: "Personality Plus",
      subtitle: "Genuine & Fun",
      description: "With pets, genuine laughter, or something that shows your fun personality.",
      icon: Sparkles,
      color: "text-violet-500",
      bgColor: "bg-violet-500/10 border-violet-500/30",
      required: false
    }
  ];

  const handleFiles = async (files: File[], slotIndex: number) => {
    const file = files[0];
    if (!file || !file.type.startsWith('image/')) return;

    // Show category selection modal
    setShowCategoryModal({ slotIndex });
    
    // Store the file temporarily
    const id = Math.random().toString(36).substr(2, 9);
    const preview = URL.createObjectURL(file);
    const newPhoto = { file, preview, id };

    setUploadedPhotos(prev => {
      const newPhotos = [...prev];
      newPhotos[slotIndex] = newPhoto;
      return newPhotos.slice(0, 6); // Keep only first 6 slots
    });
  };

  const handleCategorySelect = (category: PhotoCategory) => {
    if (showCategoryModal) {
      setUploadedPhotos(prev => {
        const newPhotos = [...prev];
        if (newPhotos[showCategoryModal.slotIndex]) {
          newPhotos[showCategoryModal.slotIndex] = {
            ...newPhotos[showCategoryModal.slotIndex],
            category
          };
        }
        return newPhotos;
      });
      setSelectedCategory(category);
    }
  };

  const handleThemeSelect = (theme: EnhancementTheme) => {
    if (showCategoryModal && selectedCategory) {
      const photo = uploadedPhotos[showCategoryModal.slotIndex];
      if (photo) {
        const enhancedPhoto = {
          ...photo,
          category: selectedCategory,
          theme
        };
        
        // Update the photo with both category and theme
        setUploadedPhotos(prev => {
          const newPhotos = [...prev];
          newPhotos[showCategoryModal.slotIndex] = enhancedPhoto;
          return newPhotos;
        });

        // Proceed to enhancement
        onNext(enhancedPhoto, showCategoryModal.slotIndex);
      }
    }
  };

  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>, slotIndex: number) => {
    e.preventDefault();
    setIsDragging(-1);
    
    const files = Array.from(e.dataTransfer.files);
    handleFiles(files, slotIndex);
  }, []);

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>, slotIndex: number) => {
    if (e.target.files) {
      handleFiles(Array.from(e.target.files), slotIndex);
    }
  };

  const removePhoto = (index: number) => {
    setUploadedPhotos(prev => {
      const newPhotos = [...prev];
      if (newPhotos[index]) {
        URL.revokeObjectURL(newPhotos[index].preview);
        newPhotos.splice(index, 1);
      }
      return newPhotos;
    });
  };

  const handleIndividualTransform = async (photo: UploadedPhoto, slotIndex: number) => {
    if (credits < 1) {
      toast.error('Insufficient credits. Please purchase more credits to enhance photos.');
      return;
    }

    if (!photo.category || !photo.theme) {
      toast.error('Please select category and theme first.');
      return;
    }

    setProcessingPhotoId(photo.id);
    try {
      const result = await enhancePhoto(photo.preview, photo.category, photo.theme);
      
      // Update the photo with enhanced version
      setUploadedPhotos(prev => {
        const newPhotos = [...prev];
        newPhotos[slotIndex] = {
          ...newPhotos[slotIndex],
          enhancedUrl: result.enhancedImageUrl
        };
        return newPhotos;
      });
      
      onIndividualTransform?.(photo, slotIndex);
    } catch (error) {
      console.error('Enhancement failed:', error);
    } finally {
      setProcessingPhotoId(null);
    }
  };

  const handleBulkTransform = () => {
    const readyPhotos = uploadedPhotos.filter(photo => photo && photo.category && photo.theme);
    const totalCost = readyPhotos.length;

    if (credits < totalCost) {
      toast.error(`Insufficient credits. You need ${totalCost} credits but only have ${credits}.`);
      return;
    }

    if (readyPhotos.length === 0) {
      toast.error('Please upload and configure at least one photo first.');
      return;
    }

    onBulkTransform?.(readyPhotos);
  };

  const canProceed = uploadedPhotos[0]; // Only need first photo
  const readyPhotos = uploadedPhotos.filter(photo => photo && photo.category && photo.theme);
  const totalBulkCost = readyPhotos.length;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Left and center columns - Photo Upload Lineup */}
      <div className="lg:col-span-2 space-y-6">
        {/* Header with Credits Display */}
        <Card className="bg-gradient-to-r from-violet-purple/10 to-hot-pink/10 border-violet-purple/30">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-2xl font-bold text-gradient-primary">Your Perfect Dating Lineup</CardTitle>
                <p className="text-muted-foreground text-sm mt-1">
                  Build the ultimate 6-photo dating profile. Each photo serves a unique purpose to attract more matches!
                </p>
              </div>
              <div className="text-center">
                <div className="flex items-center gap-2 bg-card/50 rounded-lg px-3 py-2">
                  <CreditCard className="w-4 h-4 text-violet-purple" />
                  <span className="text-sm font-medium">
                    {creditsLoading ? '...' : credits} Credits
                  </span>
                </div>
                <p className="text-xs text-muted-foreground mt-1">1 photo = 1 credit</p>
              </div>
            </div>
          </CardHeader>
        </Card>

        {/* Bulk Transform CTA */}
        {readyPhotos.length > 1 && (
          <Card className="bg-gradient-to-r from-green-500/10 to-emerald-500/10 border-green-500/30">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-green-500/20 rounded-full flex items-center justify-center">
                    <Zap className="w-5 h-5 text-green-500" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-green-700 dark:text-green-300">
                      Transform All {readyPhotos.length} Photos
                    </h3>
                    <p className="text-xs text-muted-foreground">
                      Process your entire lineup at once for maximum efficiency
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Badge variant="outline" className="text-xs">
                    {totalBulkCost} Credits
                  </Badge>
                  <Button
                    onClick={handleBulkTransform}
                    disabled={credits < totalBulkCost}
                    className="bg-green-500 hover:bg-green-600 text-white"
                  >
                    <ArrowRight className="w-4 h-4 mr-2" />
                    Transform All
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">Photo Lineup</h3>
            <Badge variant="outline" className="text-xs">
              {uploadedPhotos.length}/6 uploaded
            </Badge>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {photoSlots.map((slot, index) => {
            const Icon = slot.icon;
            const photo = uploadedPhotos[index];
            
            return (
              <Card key={index} className={cn(
                "relative transition-all duration-300 hover:scale-[1.02]",
                slot.bgColor,
                photo ? "bg-card/80" : "bg-card/50 backdrop-blur-sm border-border/50"
              )}>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <div className={cn("w-8 h-8 rounded-full flex items-center justify-center", slot.bgColor)}>
                        <Icon className={cn("w-4 h-4", slot.color)} />
                      </div>
                      <div>
                        <h3 className="font-semibold text-sm">{slot.title}</h3>
                        <p className="text-xs text-muted-foreground">{slot.subtitle}</p>
                      </div>
                    </div>
                    {slot.required ? (
                      <Badge variant="destructive" className="text-xs">Required</Badge>
                    ) : (
                      <Badge variant="outline" className="text-xs">Optional</Badge>
                    )}
                  </div>
                  
                  <p className="text-xs text-muted-foreground mb-4 leading-relaxed">
                    {slot.description}
                  </p>

                  {!photo ? (
                    <div
                      className={cn(
                        "relative border-2 border-dashed rounded-lg p-6 text-center transition-all duration-300 cursor-pointer",
                        isDragging === index
                          ? "border-violet-purple bg-violet-purple/10 shadow-glow-violet"
                          : "border-border hover:border-violet-purple/50 hover:bg-violet-purple/5"
                      )}
                      onDrop={(e) => handleDrop(e, index)}
                      onDragOver={(e) => {
                        e.preventDefault();
                        setIsDragging(index);
                      }}
                      onDragLeave={() => setIsDragging(-1)}
                      onClick={() => {
                        document.getElementById(`file-input-${index}`)?.click();
                      }}
                    >
                      <input
                        id={`file-input-${index}`}
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleFileInput(e, index)}
                        className="hidden"
                      />
                      
                      <div className="space-y-2">
                        <div className="mx-auto w-8 h-8 bg-violet-purple/20 rounded-full flex items-center justify-center">
                          <Plus className="w-4 h-4 text-violet-purple" />
                        </div>
                        <p className="text-xs text-muted-foreground">
                          Drop photo or click
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <div className="relative group">
                        <img
                          src={photo.preview}
                          alt={`${slot.title} photo`}
                          className="w-full h-32 object-cover rounded-lg"
                        />
                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center rounded-lg">
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => removePhoto(index)}
                            className="rounded-full w-6 h-6 p-0"
                          >
                            <X className="w-3 h-3" />
                          </Button>
                        </div>
                        
                        {/* Status Badges */}
                        <div className="absolute top-2 left-2 flex gap-1">
                          {photo.category && photo.theme && (
                            <Badge className="text-xs bg-green-500/90 text-white">
                              Ready ✨
                            </Badge>
                          )}
                          {photo.enhancedUrl && (
                            <Badge className="text-xs bg-violet-purple/90 text-white">
                              Enhanced 🎉
                            </Badge>
                          )}
                        </div>
                      </div>

                      {/* Individual Transform Button */}
                      {photo.category && photo.theme && !photo.enhancedUrl && (
                        <Button
                          onClick={() => handleIndividualTransform(photo, index)}
                          disabled={isProcessing && processingPhotoId === photo.id || credits < 1}
                          size="sm"
                          className="w-full bg-violet-purple hover:bg-violet-purple/80 text-white text-xs"
                        >
                          {isProcessing && processingPhotoId === photo.id ? (
                            <>
                              <div className="animate-spin rounded-full h-3 w-3 border-b border-white mr-2" />
                              Transforming...
                            </>
                          ) : (
                            <>
                              <Sparkles className="w-3 h-3 mr-2" />
                              Transform (1 Credit)
                            </>
                          )}
                        </Button>
                      )}

                      {/* Download Button for Enhanced Photos */}
                      {photo.enhancedUrl && (
                        <Button
                          onClick={() => {
                            const link = document.createElement('a');
                            link.href = photo.enhancedUrl!;
                            link.download = `enhanced-photo-${index + 1}.png`;
                            document.body.appendChild(link);
                            link.click();
                            document.body.removeChild(link);
                          }}
                          size="sm"
                          variant="outline"
                          className="w-full text-xs"
                        >
                          <Download className="w-3 h-3 mr-2" />
                          Download Enhanced
                        </Button>
                      )}

                      {/* Configure Button for Unconfigured Photos */}
                      {(!photo.category || !photo.theme) && (
                        <Button
                          onClick={() => {
                            setShowCategoryModal({ slotIndex: index });
                          }}
                          size="sm"
                          variant="outline"
                          className="w-full text-xs"
                        >
                          <Target className="w-3 h-3 mr-2" />
                          Configure Photo
                        </Button>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Right column - Tips & Progress */}
      <div className="space-y-6">
        <div className="space-y-4">
          <h2 className="text-xl font-bold text-gradient-primary">Dating Photo Secrets</h2>
          <p className="text-muted-foreground text-sm">
            Pro tips to make your photos absolutely irresistible
          </p>
        </div>

        <Card className="bg-card/50 backdrop-blur-sm border-border/50">
          <CardContent className="p-6 space-y-4">
            <h3 className="font-semibold flex items-center gap-2 text-sm">
              <Sparkles className="w-4 h-4 text-violet-purple" />
              Success Formula
            </h3>
            
            <div className="space-y-3 text-xs">
              <div className="p-3 bg-pink-500/10 border border-pink-500/30 rounded-lg">
                <p className="font-medium text-pink-600 dark:text-pink-400 mb-1">✨ First Impression</p>
                <p className="text-muted-foreground">Eye contact, genuine smile, great lighting. This photo decides if they swipe right!</p>
              </div>
              
              <div className="p-3 bg-purple-500/10 border border-purple-500/30 rounded-lg">
                <p className="font-medium text-purple-600 dark:text-purple-400 mb-1">💪 Show Confidence</p>
                <p className="text-muted-foreground">Full-body shots show your style and confidence. No mirror selfies!</p>
              </div>
              
              <div className="p-3 bg-blue-500/10 border border-blue-500/30 rounded-lg">
                <p className="font-medium text-blue-600 dark:text-blue-400 mb-1">👥 Social Proof</p>
                <p className="text-muted-foreground">Photos with friends show you're fun and social. Just be clearly identifiable!</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Upload Progress */}
        <Card className="bg-card/50 backdrop-blur-sm border-border/50">
          <CardContent className="p-6">
            <h3 className="font-semibold mb-4 text-sm">Your Lineup Progress</h3>
            
            <div className="space-y-2">
              <div className="flex justify-between text-xs">
                <span>Photos uploaded</span>
                <span>{uploadedPhotos.length}/6</span>
              </div>
              <div className="w-full bg-muted rounded-full h-2">
                <div 
                  className="bg-gradient-to-r from-pink-500 to-violet-500 h-2 rounded-full transition-all duration-500"
                  style={{ width: `${(uploadedPhotos.length / 6) * 100}%` }}
                />
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                {uploadedPhotos.length === 0 ? "Start with your best headshot!" :
                 uploadedPhotos.length < 3 ? "Great start! Add more photos for better results." :
                 uploadedPhotos.length < 6 ? "Looking good! Complete your lineup for maximum appeal." :
                 "Perfect lineup! You're ready to get more matches."}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Modals */}
      {showCategoryModal && (
        <CategorySelectionModal
          isOpen={true}
          onClose={() => setShowCategoryModal(null)}
          onCategorySelect={handleCategorySelect}
          slotIndex={showCategoryModal.slotIndex}
        />
      )}
      
      {selectedCategory && showCategoryModal && (
        <ThemeSelectionModal
          isOpen={!!selectedCategory}
          onClose={() => {
            setSelectedCategory(null);
            setShowCategoryModal(null);
          }}
          onThemeSelect={handleThemeSelect}
          photoCategory={selectedCategory}
          slotIndex={showCategoryModal.slotIndex}
        />
      )}
    </div>
  );
};