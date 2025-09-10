import React, { useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Upload, X, Plus, Sparkles, Camera, Target } from 'lucide-react';
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

type PhotoCategory = 'headshot' | 'lifestyle-fullbody' | 'background-scenery' | 'lifestyle-activity' | 'social-friends' | 'adventure-travel';
type EnhancementTheme = 'professional' | 'natural' | 'attractive-dating' | 'glamour' | 'artistic';

interface PhotoUploadStationProps {
  uploadedPhotos: UploadedPhoto[];
  setUploadedPhotos: React.Dispatch<React.SetStateAction<UploadedPhoto[]>>;
  onNext: (photo: UploadedPhoto, slotType: 'primary' | 'secondary') => void;
}

export const PhotoUploadStation: React.FC<PhotoUploadStationProps> = ({
  uploadedPhotos,
  setUploadedPhotos,
  onNext,
}) => {
  const [isDragging, setIsDragging] = useState<number>(-1);
  const [showCategoryModal, setShowCategoryModal] = useState<{ slotIndex: number; slotType: 'primary' | 'secondary' } | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<PhotoCategory | null>(null);

  const handleFiles = async (files: File[], slotIndex: number) => {
    const file = files[0];
    if (!file || !file.type.startsWith('image/')) return;

    // Show category selection modal
    const slotType = slotIndex === 0 ? 'primary' : 'secondary';
    setShowCategoryModal({ slotIndex, slotType });
    
    // Store the file temporarily
    const id = Math.random().toString(36).substr(2, 9);
    const preview = URL.createObjectURL(file);
    const newPhoto = { file, preview, id };

    setUploadedPhotos(prev => {
      const newPhotos = [...prev];
      newPhotos[slotIndex] = newPhoto;
      return newPhotos.slice(0, 2); // Keep only first 2 slots
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
        onNext(enhancedPhoto, showCategoryModal.slotType);
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

  const canProceed = uploadedPhotos[0]; // Only need primary photo

  const categoryNames = {
    'headshot': 'Headshot',
    'lifestyle-fullbody': 'Lifestyle',
    'background-scenery': 'Background',
    'lifestyle-activity': 'Activity',
    'social-friends': 'Social',
    'adventure-travel': 'Adventure'
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* Left side - Photo Upload Slots */}
      <div className="space-y-6">
        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-gradient-primary">Sequential Photo Enhancement</h2>
          <p className="text-muted-foreground">
            Upload photos one at a time for targeted enhancement. Primary photo is required.
          </p>
        </div>

        <div className="space-y-6">
          {/* Primary Photo Slot */}
          <Card className="relative bg-card/50 backdrop-blur-sm border-border/50">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Target className="w-5 h-5 text-violet-purple" />
                  <h3 className="font-semibold">Primary Photo</h3>
                  <Badge variant="destructive" className="text-xs">Required</Badge>
                </div>
                {uploadedPhotos[0]?.category && (
                  <Badge variant="secondary" className="text-xs">
                    {categoryNames[uploadedPhotos[0].category]}
                  </Badge>
                )}
              </div>
              
              <p className="text-sm text-muted-foreground mb-4">
                Your main profile photo - headshot or full-body lifestyle shot
              </p>

              {!uploadedPhotos[0] ? (
                <div
                  className={cn(
                    "relative border-2 border-dashed rounded-lg p-8 text-center transition-all duration-300 cursor-pointer",
                    isDragging === 0
                      ? "border-violet-purple bg-violet-purple/10 shadow-glow-violet"
                      : "border-border hover:border-violet-purple/50 hover:bg-violet-purple/5"
                  )}
                  onDrop={(e) => handleDrop(e, 0)}
                  onDragOver={(e) => {
                    e.preventDefault();
                    setIsDragging(0);
                  }}
                  onDragLeave={() => setIsDragging(-1)}
                  onClick={() => {
                    document.getElementById('file-input-0')?.click();
                  }}
                >
                  <input
                    id="file-input-0"
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleFileInput(e, 0)}
                    className="hidden"
                  />
                  
                  <div className="space-y-3">
                    <div className="mx-auto w-12 h-12 bg-violet-purple/20 rounded-full flex items-center justify-center">
                      <Plus className="w-6 h-6 text-violet-purple" />
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Click to upload or drag & drop
                    </p>
                    <p className="text-xs text-muted-foreground">
                      JPEG, PNG up to 10MB
                    </p>
                  </div>
                </div>
              ) : (
                <div className="relative group">
                  <img
                    src={uploadedPhotos[0].preview}
                    alt="Primary photo"
                    className="w-full h-48 object-cover rounded-lg"
                  />
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center rounded-lg">
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => removePhoto(0)}
                      className="rounded-full w-8 h-8 p-0"
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Secondary Photo Slot */}
          <Card className="relative bg-card/50 backdrop-blur-sm border-border/50 opacity-75">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Camera className="w-5 h-5 text-muted-foreground" />
                  <h3 className="font-semibold text-muted-foreground">Secondary Photo</h3>
                  <Badge variant="outline" className="text-xs">Optional</Badge>
                </div>
                {uploadedPhotos[1]?.category && (
                  <Badge variant="secondary" className="text-xs">
                    {categoryNames[uploadedPhotos[1].category]}
                  </Badge>
                )}
              </div>
              
              <p className="text-sm text-muted-foreground mb-4">
                Background, lifestyle, or social photos - available after primary photo
              </p>

              {!canProceed ? (
                <div className="relative border-2 border-dashed border-muted rounded-lg p-8 text-center opacity-50">
                  <div className="space-y-3">
                    <div className="mx-auto w-12 h-12 bg-muted/20 rounded-full flex items-center justify-center">
                      <Plus className="w-6 h-6 text-muted-foreground" />
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Upload primary photo first
                    </p>
                  </div>
                </div>
              ) : !uploadedPhotos[1] ? (
                <div
                  className={cn(
                    "relative border-2 border-dashed rounded-lg p-8 text-center transition-all duration-300 cursor-pointer",
                    isDragging === 1
                      ? "border-violet-purple bg-violet-purple/10 shadow-glow-violet"
                      : "border-border hover:border-violet-purple/50 hover:bg-violet-purple/5"
                  )}
                  onDrop={(e) => handleDrop(e, 1)}
                  onDragOver={(e) => {
                    e.preventDefault();
                    setIsDragging(1);
                  }}
                  onDragLeave={() => setIsDragging(-1)}
                  onClick={() => {
                    document.getElementById('file-input-1')?.click();
                  }}
                >
                  <input
                    id="file-input-1"
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleFileInput(e, 1)}
                    className="hidden"
                  />
                  
                  <div className="space-y-3">
                    <div className="mx-auto w-12 h-12 bg-violet-purple/20 rounded-full flex items-center justify-center">
                      <Plus className="w-6 h-6 text-violet-purple" />
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Click to upload or drag & drop
                    </p>
                    <p className="text-xs text-muted-foreground">
                      JPEG, PNG up to 10MB
                    </p>
                  </div>
                </div>
              ) : (
                <div className="relative group">
                  <img
                    src={uploadedPhotos[1].preview}
                    alt="Secondary photo"
                    className="w-full h-48 object-cover rounded-lg"
                  />
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center rounded-lg">
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => removePhoto(1)}
                      className="rounded-full w-8 h-8 p-0"
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Right side - Enhancement Guide */}
      <div className="space-y-6">
        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-gradient-primary">How It Works</h2>
          <p className="text-muted-foreground">
            Each photo gets individually optimized based on its category and your chosen enhancement theme.
          </p>
        </div>

        <Card className="bg-card/50 backdrop-blur-sm border-border/50">
          <CardContent className="p-6 space-y-6">
            <div className="space-y-4">
              <h3 className="font-semibold flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-violet-purple" />
                Enhancement Process
              </h3>
              
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-violet-purple/20 flex items-center justify-center text-xs font-semibold text-violet-purple">
                    1
                  </div>
                  <div>
                    <p className="font-medium text-sm">Upload Photo</p>
                    <p className="text-xs text-muted-foreground">Select image and choose category</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-violet-purple/20 flex items-center justify-center text-xs font-semibold text-violet-purple">
                    2
                  </div>
                  <div>
                    <p className="font-medium text-sm">Choose Theme</p>
                    <p className="text-xs text-muted-foreground">Professional, dating, natural, etc.</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-violet-purple/20 flex items-center justify-center text-xs font-semibold text-violet-purple">
                    3
                  </div>
                  <div>
                    <p className="font-medium text-sm">AI Enhancement</p>
                    <p className="text-xs text-muted-foreground">Targeted optimization for your goals</p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Photo Tips */}
        <Card className="bg-card/50 backdrop-blur-sm border-border/50">
          <CardContent className="p-6">
            <h3 className="font-semibold mb-4 flex items-center">
              <Camera className="w-4 h-4 text-violet-purple mr-2" />
              Photo Tips
            </h3>
            
            <div className="space-y-3 text-sm">
              <div className="p-3 bg-blue-500/10 border border-blue-500/30 rounded-lg">
                <p className="font-medium text-blue-600 dark:text-blue-400 mb-1">Primary Photo</p>
                <p className="text-muted-foreground text-xs">Face-forward, eye contact, natural lighting. This is your first impression!</p>
              </div>
              
              <div className="p-3 bg-green-500/10 border border-green-500/30 rounded-lg">
                <p className="font-medium text-green-600 dark:text-green-400 mb-1">Secondary Photo</p>
                <p className="text-muted-foreground text-xs">Show personality, lifestyle, hobbies. Great for conversation starters.</p>
              </div>
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
          slotType={showCategoryModal.slotType}
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
          slotType={showCategoryModal.slotType}
        />
      )}
    </div>
  );
};