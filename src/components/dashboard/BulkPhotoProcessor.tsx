import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, AlertCircle, Zap, Download, ArrowLeft } from 'lucide-react';
import { usePhotoEnhancement } from '@/hooks/usePhotoEnhancement';
import { useCredits } from '@/hooks/useCredits';

interface UploadedPhoto {
  id: string;
  file: File;
  preview: string;
  category?: string;
  theme?: string;
  enhancedUrl?: string;
}

interface BulkPhotoProcessorProps {
  photos: UploadedPhoto[];
  onComplete: (results: Array<{ photo: UploadedPhoto; result?: any; error?: string }>) => void;
  onBack: () => void;
}

export const BulkPhotoProcessor: React.FC<BulkPhotoProcessorProps> = ({
  photos,
  onComplete,
  onBack,
}) => {
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);
  const [results, setResults] = useState<Array<{ photo: UploadedPhoto; result?: any; error?: string }>>([]);
  const [isCompleted, setIsCompleted] = useState(false);
  const { enhancePhoto, isProcessing } = usePhotoEnhancement();
  const { credits } = useCredits();

  const totalPhotos = photos.length;
  const completedPhotos = results.length;
  const successfulPhotos = results.filter(r => r.result && !r.error).length;
  const failedPhotos = results.filter(r => r.error).length;

  useEffect(() => {
    if (currentPhotoIndex < totalPhotos && !isProcessing) {
      processNextPhoto();
    } else if (currentPhotoIndex >= totalPhotos && !isCompleted) {
      setIsCompleted(true);
      onComplete(results);
    }
  }, [currentPhotoIndex, isProcessing]);

  const processNextPhoto = async () => {
    const photo = photos[currentPhotoIndex];
    if (!photo.category || !photo.theme) {
      setResults(prev => [...prev, { 
        photo, 
        error: 'Photo not properly configured with category and theme' 
      }]);
      setCurrentPhotoIndex(prev => prev + 1);
      return;
    }

    try {
      const result = await enhancePhoto(photo.preview, photo.category, photo.theme);
      setResults(prev => [...prev, { photo, result }]);
    } catch (error) {
      setResults(prev => [...prev, { 
        photo, 
        error: error instanceof Error ? error.message : 'Enhancement failed' 
      }]);
    }

    setCurrentPhotoIndex(prev => prev + 1);
  };

  const downloadAllEnhanced = () => {
    results
      .filter(r => r.result?.enhancedImageUrl)
      .forEach((r, index) => {
        const link = document.createElement('a');
        link.href = r.result.enhancedImageUrl;
        link.download = `enhanced-photo-${index + 1}.png`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      });
  };

  if (isCompleted) {
    return (
      <div className="space-y-6">
        <Card className="bg-gradient-to-br from-green-500/10 to-emerald-500/10 border-green-500/30">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-green-700 dark:text-green-300">
              <CheckCircle className="w-6 h-6" />
              Bulk Processing Complete!
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-3 gap-4 text-center">
              <div className="p-3 bg-blue-500/10 rounded-lg">
                <p className="text-2xl font-bold text-blue-600">{totalPhotos}</p>
                <p className="text-xs text-muted-foreground">Total Photos</p>
              </div>
              <div className="p-3 bg-green-500/10 rounded-lg">
                <p className="text-2xl font-bold text-green-600">{successfulPhotos}</p>
                <p className="text-xs text-muted-foreground">Enhanced</p>
              </div>
              <div className="p-3 bg-red-500/10 rounded-lg">
                <p className="text-2xl font-bold text-red-600">{failedPhotos}</p>
                <p className="text-xs text-muted-foreground">Failed</p>
              </div>
            </div>

            <div className="flex gap-2">
              <Button
                onClick={downloadAllEnhanced}
                disabled={successfulPhotos === 0}
                className="flex-1 bg-green-500 hover:bg-green-600"
              >
                <Download className="w-4 h-4 mr-2" />
                Download All Enhanced ({successfulPhotos})
              </Button>
              <Button
                onClick={onBack}
                variant="outline"
                className="flex-1"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Lineup
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Results Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {results.map((result, index) => (
            <Card key={result.photo.id} className="overflow-hidden">
              <CardContent className="p-4">
                <div className="space-y-3">
                  <div className="relative">
                    <img
                      src={result.result?.enhancedImageUrl || result.photo.preview}
                      alt={`Photo ${index + 1}`}
                      className="w-full h-32 object-cover rounded-lg"
                    />
                    {result.result && (
                      <Badge className="absolute top-2 left-2 bg-green-500 text-white text-xs">
                        ✨ Enhanced
                      </Badge>
                    )}
                    {result.error && (
                      <Badge className="absolute top-2 left-2 bg-red-500 text-white text-xs">
                        ❌ Failed
                      </Badge>
                    )}
                  </div>

                  <div className="text-center">
                    <p className="text-xs text-muted-foreground">
                      Photo {index + 1}
                    </p>
                    {result.error && (
                      <p className="text-xs text-red-600 mt-1">{result.error}</p>
                    )}
                  </div>

                  {result.result?.enhancedImageUrl && (
                    <Button
                      onClick={() => {
                        const link = document.createElement('a');
                        link.href = result.result.enhancedImageUrl;
                        link.download = `enhanced-photo-${index + 1}.png`;
                        document.body.appendChild(link);
                        link.click();
                        document.body.removeChild(link);
                      }}
                      size="sm"
                      className="w-full text-xs"
                    >
                      <Download className="w-3 h-3 mr-1" />
                      Download
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card className="bg-gradient-to-br from-violet-purple/10 to-hot-pink/10 border-violet-purple/30">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="w-6 h-6 text-violet-purple" />
            Bulk Processing Your Photos
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="text-center space-y-2">
            <p className="text-lg font-semibold">
              Processing Photo {currentPhotoIndex + 1} of {totalPhotos}
            </p>
            <p className="text-sm text-muted-foreground">
              Please wait while we transform your entire photo lineup
            </p>
          </div>

          <Progress 
            value={(completedPhotos / totalPhotos) * 100} 
            className="h-3"
          />

          <div className="grid grid-cols-3 gap-4 text-center text-sm">
            <div>
              <p className="font-semibold text-violet-purple">{completedPhotos}</p>
              <p className="text-muted-foreground">Completed</p>
            </div>
            <div>
              <p className="font-semibold text-blue-600">{totalPhotos - completedPhotos}</p>
              <p className="text-muted-foreground">Remaining</p>
            </div>
            <div>
              <p className="font-semibold text-muted-foreground">{credits - totalPhotos}</p>
              <p className="text-muted-foreground">Credits Left</p>
            </div>
          </div>

          {/* Current Photo Being Processed */}
          {currentPhotoIndex < totalPhotos && (
            <Card className="bg-card/50">
              <CardContent className="p-4">
                <div className="flex items-center gap-4">
                  <img
                    src={photos[currentPhotoIndex]?.preview}
                    alt="Current photo"
                    className="w-16 h-16 object-cover rounded-lg"
                  />
                  <div className="flex-1">
                    <p className="font-medium text-sm">
                      {photos[currentPhotoIndex]?.category?.replace(/-/g, ' ')} Photo
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Style: {photos[currentPhotoIndex]?.theme?.replace(/-/g, ' ')}
                    </p>
                    <div className="flex items-center gap-2 mt-1">
                      {isProcessing && (
                        <>
                          <div className="animate-spin rounded-full h-3 w-3 border-b border-violet-purple" />
                          <span className="text-xs text-violet-purple">Enhancing...</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </CardContent>
      </Card>
    </div>
  );
};