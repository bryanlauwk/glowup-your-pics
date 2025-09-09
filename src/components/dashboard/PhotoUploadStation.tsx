import React, { useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Upload, X, Plus, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';

interface UploadedPhoto {
  id: string;
  file: File;
  preview: string;
  analysis?: any;
}

interface PhotoUploadStationProps {
  uploadedPhotos: UploadedPhoto[];
  setUploadedPhotos: React.Dispatch<React.SetStateAction<UploadedPhoto[]>>;
  onNext: () => void;
}

export const PhotoUploadStation: React.FC<PhotoUploadStationProps> = ({
  uploadedPhotos,
  setUploadedPhotos,
  onNext,
}) => {
  const [enhancementInstructions, setEnhancementInstructions] = useState('');
  const [isDragging, setIsDragging] = useState<number>(-1);

  const handleFiles = async (files: File[], slotIndex?: number) => {
    const file = files[0]; // Only take first file for specific slot
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) return;

    const id = Math.random().toString(36).substr(2, 9);
    const preview = URL.createObjectURL(file);
    
    const newPhoto = { file, preview, id };

    if (slotIndex !== undefined && slotIndex < 3) {
      // Replace or add to specific slot
      setUploadedPhotos(prev => {
        const newPhotos = [...prev];
        newPhotos[slotIndex] = newPhoto;
        return newPhotos.slice(0, 3); // Keep only first 3
      });
    } else {
      // Add to next available slot
      setUploadedPhotos(prev => {
        if (prev.length >= 3) return prev;
        return [...prev, newPhoto];
      });
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

  const canProceed = uploadedPhotos.length > 0;

  const suggestionPrompts = [
    "Make me look more attractive for dating apps",
    "Improve lighting and enhance my smile",
    "Make my eyes more captivating",
    "Enhance my facial features naturally",
    "Improve the overall photo quality"
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* Left side - Photo Upload Slots */}
      <div className="space-y-6">
        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-gradient-primary">Upload Your Photos</h2>
          <p className="text-muted-foreground">
            Upload 1-3 photos to get started. We'll analyze and enhance each one.
          </p>
        </div>

        <div className="space-y-4">
          {[0, 1, 2].map((slotIndex) => {
            const photo = uploadedPhotos[slotIndex];
            const isEmpty = !photo;
            const isRequired = slotIndex === 0;

            return (
              <Card key={slotIndex} className="relative bg-card/50 backdrop-blur-sm border-border/50">
                <CardContent className="p-4">
                  <div className="flex items-center space-x-4">
                    <div className="flex-shrink-0">
                      <Badge variant={isEmpty ? "outline" : "secondary"} className="mb-2">
                        Photo {slotIndex + 1} {isRequired && "(Required)"}
                      </Badge>
                    </div>
                  </div>

                  {isEmpty ? (
                    <div
                      className={cn(
                        "relative border-2 border-dashed rounded-lg p-8 text-center transition-all duration-300 cursor-pointer",
                        isDragging === slotIndex
                          ? "border-violet-purple bg-violet-purple/10 shadow-glow-violet"
                          : "border-border hover:border-violet-purple/50 hover:bg-violet-purple/5"
                      )}
                      onDrop={(e) => handleDrop(e, slotIndex)}
                      onDragOver={(e) => {
                        e.preventDefault();
                        setIsDragging(slotIndex);
                      }}
                      onDragLeave={() => setIsDragging(-1)}
                      onClick={() => {
                        document.getElementById(`file-input-${slotIndex}`)?.click();
                      }}
                    >
                      <input
                        id={`file-input-${slotIndex}`}
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleFileInput(e, slotIndex)}
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
                        src={photo.preview}
                        alt={`Photo ${slotIndex + 1}`}
                        className="w-full h-32 object-cover rounded-lg"
                      />
                      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center rounded-lg">
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => removePhoto(slotIndex)}
                          className="rounded-full w-8 h-8 p-0"
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Right side - Enhancement Instructions */}
      <div className="space-y-6">
        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-gradient-primary">What would you like to improve?</h2>
          <p className="text-muted-foreground">
            Describe what you'd like to enhance about your photos. Our AI will understand and apply the improvements naturally.
          </p>
        </div>

        <Card className="bg-card/50 backdrop-blur-sm border-border/50">
          <CardContent className="p-6 space-y-4">
            <Textarea
              placeholder="e.g., Make me look more attractive, improve lighting, enhance my smile, make my eyes more captivating..."
              value={enhancementInstructions}
              onChange={(e) => setEnhancementInstructions(e.target.value)}
              className="min-h-[120px] bg-input/50 border-border/50 focus:border-violet-purple resize-none"
            />

            <div className="space-y-3">
              <p className="text-sm font-medium text-muted-foreground">Quick suggestions:</p>
              <div className="flex flex-wrap gap-2">
                {suggestionPrompts.map((prompt, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    size="sm"
                    onClick={() => setEnhancementInstructions(prompt)}
                    className="text-xs border-border/50 hover:border-violet-purple hover:bg-violet-purple/10"
                  >
                    {prompt}
                  </Button>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Enhancement Preview */}
        {uploadedPhotos.length > 0 && (
          <Card className="bg-card/50 backdrop-blur-sm border-border/50">
            <CardContent className="p-6">
              <h3 className="font-semibold mb-4 flex items-center">
                <Sparkles className="w-4 h-4 text-violet-purple mr-2" />
                Photos Ready for Enhancement
              </h3>
              
              <div className="grid grid-cols-3 gap-3">
                {uploadedPhotos.map((photo, index) => (
                  <div key={photo.id} className="relative">
                    <img
                      src={photo.preview}
                      alt={`Photo ${index + 1}`}
                      className="w-full h-20 object-cover rounded-lg"
                    />
                    <Badge 
                      variant="secondary" 
                      className="absolute -top-2 -right-2 bg-violet-purple text-white text-xs px-2"
                    >
                      {index + 1}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Start Processing Button */}
        <div className="flex justify-center pt-4">
          <Button 
            variant="glow" 
            size="xl"
            onClick={onNext}
            disabled={!canProceed}
            className="min-w-[250px] text-lg font-semibold"
          >
            <Sparkles className="w-5 h-5 mr-2" />
            Start AI Enhancement
          </Button>
        </div>
      </div>
    </div>
  );
};