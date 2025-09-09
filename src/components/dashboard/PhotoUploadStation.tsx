import React, { useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Upload, X, Image as ImageIcon, CheckCircle, AlertCircle } from 'lucide-react';
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
  const [isDragging, setIsDragging] = useState(false);
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});

  const validateImage = useCallback((file: File): Promise<{ isValid: boolean; error?: string }> => {
    return new Promise((resolve) => {
      // Check file type
      if (!file.type.startsWith('image/') || 
          (!file.type.includes('jpeg') && !file.type.includes('png') && !file.type.includes('webp'))) {
        resolve({ isValid: false, error: 'Only JPEG, PNG, and WebP formats are supported' });
        return;
      }

      // Check file size (10MB limit)
      if (file.size > 10 * 1024 * 1024) {
        resolve({ isValid: false, error: 'File size must be less than 10MB' });
        return;
      }

      // Validate image dimensions and quality
      const img = new Image();
      const url = URL.createObjectURL(file);
      
      img.onload = () => {
        URL.revokeObjectURL(url);
        
        // Check minimum dimensions for quality
        if (img.width < 400 || img.height < 400) {
          resolve({ isValid: false, error: 'Image must be at least 400x400 pixels for best results' });
          return;
        }
        
        // Check aspect ratio (should be reasonable for dating photos)
        const aspectRatio = img.width / img.height;
        if (aspectRatio < 0.5 || aspectRatio > 2.0) {
          resolve({ isValid: false, error: 'Image aspect ratio should be between 1:2 and 2:1' });
          return;
        }

        resolve({ isValid: true });
      };
      
      img.onerror = () => {
        URL.revokeObjectURL(url);
        resolve({ isValid: false, error: 'Invalid image file' });
      };
      
      img.src = url;
    });
  }, []);

  const handleFiles = async (files: File[]) => {
    const remainingSlots = 3 - uploadedPhotos.length;
    const filesToProcess = files.slice(0, remainingSlots);
    
    for (const file of filesToProcess) {
      const validation = await validateImage(file);
      
      if (!validation.isValid) {
        setValidationErrors(prev => ({
          ...prev,
          [file.name]: validation.error || 'Invalid file'
        }));
        continue;
      }

      const id = Math.random().toString(36).substr(2, 9);
      const preview = URL.createObjectURL(file);
      
      setUploadedPhotos(prev => [...prev, { file, preview, id }]);
      
      // Clear any previous validation errors for this file
      setValidationErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[file.name];
        return newErrors;
      });
    }
  };

  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    
    const files = Array.from(e.dataTransfer.files);
    handleFiles(files);
  }, [uploadedPhotos.length]);

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      handleFiles(Array.from(e.target.files));
    }
  };

  const removeFile = (id: string) => {
    setUploadedPhotos(prev => {
      const fileToRemove = prev.find(f => f.id === id);
      if (fileToRemove) {
        URL.revokeObjectURL(fileToRemove.preview);
      }
      return prev.filter(f => f.id !== id);
    });
  };

  const canProceed = uploadedPhotos.length > 0 && uploadedPhotos.length <= 3;

  return (
    <Card className="bg-card/50 backdrop-blur-sm border-border/50">
      <CardHeader>
        <CardTitle className="text-2xl text-gradient-primary">
          Upload Your Photos
        </CardTitle>
        <p className="text-muted-foreground">
          Upload 1-3 high-quality photos for AI analysis and enhancement. Our Match-Likelihood Engine works best with clear, well-lit portraits.
        </p>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Upload Area */}
        <div
          className={cn(
            "relative border-2 border-dashed rounded-lg p-12 text-center transition-all duration-300 cursor-pointer",
            isDragging
              ? "border-violet-purple bg-violet-purple/10 shadow-glow-violet"
              : "border-border hover:border-violet-purple/50 hover:bg-violet-purple/5",
            uploadedPhotos.length >= 3 && "opacity-50 cursor-not-allowed"
          )}
          onDrop={handleDrop}
          onDragOver={(e) => {
            e.preventDefault();
            if (uploadedPhotos.length < 3) {
              setIsDragging(true);
            }
          }}
          onDragLeave={() => setIsDragging(false)}
          onClick={() => {
            if (uploadedPhotos.length < 3) {
              document.getElementById('file-input')?.click();
            }
          }}
        >
          <input
            id="file-input"
            type="file"
            accept="image/jpeg,image/png,image/webp"
            multiple
            onChange={handleFileInput}
            className="hidden"
            disabled={uploadedPhotos.length >= 3}
          />
          
          <div className="space-y-4">
            <div className="mx-auto w-16 h-16 bg-violet-purple/20 rounded-full flex items-center justify-center">
              <Upload className="w-8 h-8 text-violet-purple" />
            </div>
            
            <div className="space-y-2">
              <h3 className="text-xl font-semibold">
                {uploadedPhotos.length >= 3 
                  ? "Maximum photos reached" 
                  : "Drop your photos here or click to browse"}
              </h3>
              <p className="text-muted-foreground">
                {3 - uploadedPhotos.length} slots remaining • JPEG, PNG, WebP up to 10MB
              </p>
              <p className="text-sm text-muted-foreground">
                Minimum 400x400px • Clear face visibility recommended
              </p>
            </div>
            
            {uploadedPhotos.length < 3 && (
              <Button variant="glow" size="lg">
                <ImageIcon className="w-5 h-5" />
                Choose Photos
              </Button>
            )}
          </div>
        </div>

        {/* Validation Errors */}
        {Object.keys(validationErrors).length > 0 && (
          <div className="space-y-2">
            {Object.entries(validationErrors).map(([filename, error]) => (
              <div key={filename} className="flex items-center space-x-2 text-destructive text-sm">
                <AlertCircle className="w-4 h-4" />
                <span><strong>{filename}:</strong> {error}</span>
              </div>
            ))}
          </div>
        )}

        {/* Photo Requirements */}
        <Card className="bg-muted/20 border-border/30">
          <CardContent className="p-4">
            <h4 className="font-semibold mb-2 flex items-center">
              <CheckCircle className="w-4 h-4 text-violet-purple mr-2" />
              Photo Requirements for Best Results
            </h4>
            <ul className="space-y-1 text-sm text-muted-foreground">
              <li>• <strong>Face visibility:</strong> At least 65% of face should be clearly visible</li>
              <li>• <strong>Quality:</strong> Sharp, well-lit photos work best</li>
              <li>• <strong>Composition:</strong> Face centered or following rule of thirds</li>
              <li>• <strong>Expression:</strong> Natural smile or direct eye contact preferred</li>
              <li>• <strong>Background:</strong> Minimal distractions, good contrast</li>
            </ul>
          </CardContent>
        </Card>

        {/* Uploaded Photos Preview */}
        {uploadedPhotos.length > 0 && (
          <div className="space-y-4">
            <h4 className="font-semibold text-lg flex items-center">
              Uploaded Photos ({uploadedPhotos.length}/3)
              <Badge variant="secondary" className="ml-2 bg-violet-purple/20 text-violet-purple">
                Ready for Analysis
              </Badge>
            </h4>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {uploadedPhotos.map((uploadedFile, index) => (
                <div
                  key={uploadedFile.id}
                  className="relative group rounded-lg overflow-hidden bg-dark-surface border border-border/50"
                >
                  <img
                    src={uploadedFile.preview}
                    alt={`Uploaded photo ${index + 1}`}
                    className="w-full h-48 object-cover"
                  />
                  
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        removeFile(uploadedFile.id);
                      }}
                      className="rounded-full w-8 h-8 p-0"
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                  
                  <div className="absolute top-2 right-2">
                    <CheckCircle className="w-6 h-6 text-violet-purple" />
                  </div>
                  
                  <div className="absolute bottom-2 left-2">
                    <Badge variant="secondary" className="bg-black/70 text-white">
                      Photo {index + 1}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Next Button */}
        <div className="flex justify-center pt-4">
          <Button 
            variant="glow" 
            size="xl"
            onClick={onNext}
            disabled={!canProceed}
            className="min-w-[200px]"
          >
            Start AI Analysis
            <span className="ml-2">→</span>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};