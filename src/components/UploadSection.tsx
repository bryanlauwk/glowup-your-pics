import React, { useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Upload, X, Image as ImageIcon, CheckCircle } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';

interface UploadedFile {
  file: File;
  preview: string;
  id: string;
}

export const UploadSection = () => {
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    
    const files = Array.from(e.dataTransfer.files);
    handleFiles(files);
  }, []);

  const handleFiles = (files: File[]) => {
    if (!user) {
      navigate('/auth');
      return;
    }
    
    const imageFiles = files.filter(file => 
      file.type.startsWith('image/') && (file.type.includes('jpeg') || file.type.includes('png'))
    );

    imageFiles.slice(0, 3 - uploadedFiles.length).forEach(file => {
      const id = Math.random().toString(36).substr(2, 9);
      const preview = URL.createObjectURL(file);
      
      setUploadedFiles(prev => [...prev, { file, preview, id }]);
    });
  };

  const removeFile = (id: string) => {
    setUploadedFiles(prev => {
      const fileToRemove = prev.find(f => f.id === id);
      if (fileToRemove) {
        URL.revokeObjectURL(fileToRemove.preview);
      }
      return prev.filter(f => f.id !== id);
    });
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      handleFiles(Array.from(e.target.files));
    }
  };

  return (
    <div id="upload" className="py-20 bg-gradient-glow">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto space-y-12">
          {/* Section Header */}
          <div className="text-center space-y-4">
            <h2 className="text-4xl md:text-5xl font-bold text-gradient-primary">
              Upload Your Best Photos
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              {user 
                ? "Upload 1-3 of your favorite photos and let our AI give you that natural glow-up. JPEG and PNG formats supported."
                : "Sign in to upload and enhance your photos with AI magic."
              }
            </p>
            {!user && (
              <Button 
                variant="hero" 
                size="lg"
                onClick={() => navigate('/auth')}
                className="mt-4"
              >
                Sign In to Get Started
              </Button>
            )}
          </div>

          {/* Upload Area */}
          {user ? (
            <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
            <CardContent className="p-8">
              <div
                className={cn(
                  "relative border-2 border-dashed rounded-lg p-12 text-center transition-all duration-300",
                  isDragging
                    ? "border-rose-gold bg-rose-gold/10 glow-rose"
                    : "border-border hover:border-rose-gold/50 hover:bg-rose-gold/5"
                )}
                onDrop={handleDrop}
                onDragOver={(e) => {
                  e.preventDefault();
                  setIsDragging(true);
                }}
                onDragLeave={() => setIsDragging(false)}
              >
                <input
                  type="file"
                  accept="image/jpeg,image/png"
                  multiple
                  onChange={handleFileInput}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  disabled={uploadedFiles.length >= 3}
                />
                
                <div className="space-y-4">
                  <div className="mx-auto w-16 h-16 bg-rose-gold/20 rounded-full flex items-center justify-center">
                    <Upload className="w-8 h-8 text-rose-gold" />
                  </div>
                  
                  <div className="space-y-2">
                    <h3 className="text-xl font-semibold">
                      {uploadedFiles.length >= 3 
                        ? "Maximum files reached" 
                        : "Drop your photos here or click to browse"}
                    </h3>
                    <p className="text-muted-foreground">
                      {3 - uploadedFiles.length} slots remaining • JPEG, PNG up to 10MB
                    </p>
                  </div>
                  
                  {uploadedFiles.length < 3 && (
                    <Button variant="glow" size="lg">
                      <ImageIcon className="w-5 h-5" />
                      Choose Files
                    </Button>
                  )}
                </div>
              </div>

              {/* Uploaded Files Preview */}
              {uploadedFiles.length > 0 && (
                <div className="mt-8 space-y-4">
                  <h4 className="font-semibold text-lg">Uploaded Photos ({uploadedFiles.length}/3)</h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {uploadedFiles.map((uploadedFile) => (
                      <div
                        key={uploadedFile.id}
                        className="relative group rounded-lg overflow-hidden bg-dark-surface border border-border/50"
                      >
                        <img
                          src={uploadedFile.preview}
                          alt="Uploaded preview"
                          className="w-full h-48 object-cover"
                        />
                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => removeFile(uploadedFile.id)}
                            className="rounded-full w-8 h-8 p-0"
                          >
                            <X className="w-4 h-4" />
                          </Button>
                        </div>
                        <div className="absolute top-2 right-2">
                          <CheckCircle className="w-6 h-6 text-rose-gold" />
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  {uploadedFiles.length > 0 && (
                    <div className="flex justify-center pt-4">
                      <Button 
                        variant="hero" 
                        size="xl"
                        onClick={() => {
                          document.getElementById('enhance')?.scrollIntoView({ behavior: 'smooth' });
                        }}
                      >
                        ✨ Transform My Photos
                      </Button>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
          ) : null}
        </div>
      </div>
    </div>
  );
};