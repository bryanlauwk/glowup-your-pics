import React, { useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Upload, X, Plus, Sparkles, Camera, Target, Heart, Users, Mountain, Compass, Activity } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { CategorySelectionModal } from './CategorySelectionModal';
import { ThemeSelectionModal } from './ThemeSelectionModal';

interface UploadedPhoto {
  id: string;
  file: File;
  preview: string;
  category?: PhotoCategory;
  theme?: EnhancementTheme;
  analysis?: any;
}

type PhotoCategory = 'the-hook' | 'style-confidence' | 'social-proof' | 'passion-hobbies' | 'lifestyle-adventure' | 'personality-closer';
type EnhancementTheme = 'confident-successful' | 'authentic-approachable' | 'irresistible-magnetic' | 'stunning-sophisticated' | 'creative-unique';

interface PhotoLineupStationProps {
  uploadedPhotos: UploadedPhoto[];
  setUploadedPhotos: React.Dispatch<React.SetStateAction<UploadedPhoto[]>>;
  onNext: (photo: UploadedPhoto, slotIndex: number) => void;
}

export const PhotoLineupStation: React.FC<PhotoLineupStationProps> = ({
  uploadedPhotos,
  setUploadedPhotos,
  onNext,
}) => {
  const [isDragging, setIsDragging] = useState<number>(-1);
  const [showCategoryModal, setShowCategoryModal] = useState<{ slotIndex: number } | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<PhotoCategory | null>(null);

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

  const canProceed = uploadedPhotos[0]; // Only need first photo

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Left and center columns - Photo Upload Lineup */}
      <div className="lg:col-span-2 space-y-6">
        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-gradient-primary">Your Perfect Dating Lineup</h2>
          <p className="text-muted-foreground">
            Build the ultimate 6-photo dating profile. Each photo serves a unique purpose to attract more matches!
          </p>
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
                      {photo.category && (
                        <Badge className="absolute top-2 left-2 text-xs bg-black/70">
                          Ready ✨
                        </Badge>
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