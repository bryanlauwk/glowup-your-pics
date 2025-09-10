import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { PhotoLineupStation } from "@/components/dashboard/PhotoLineupStation";
import { AIProcessingEngine } from "@/components/dashboard/AIProcessingEngine";
import { EnhancementResults } from '@/components/dashboard/EnhancementResults';
import { CreditsDisplay } from '@/components/CreditsDisplay';
import { SwipeBoostEngine } from '@/components/SwipeBoostEngine';
import { BulkPhotoProcessor } from '@/components/dashboard/BulkPhotoProcessor';
import { DevPanel } from '@/components/DevPanel';
import { Upload, Zap, Download, Target, ArrowLeft } from "lucide-react";

type DashboardStep = 'upload' | 'analysis' | 'processing' | 'bulk-processing' | 'results';
type PhotoCategory = 'the-hook' | 'style-confidence' | 'social-proof' | 'passion-hobbies' | 'lifestyle-adventure' | 'personality-closer';
type EnhancementTheme = 'confident-successful' | 'authentic-approachable' | 'irresistible-magnetic' | 'stunning-sophisticated' | 'creative-unique';

interface PhotoAnalysis {
  faceVisibility: number;
  smileConfidence: number;
  eyeContactConfidence: number;
  lightingScore: number;
  compositionScore: number;
  identitySimilarity: number;
  overallScore: number;
  suggestions: string[];
}

interface UploadedPhoto {
  id: string;
  file: File;
  preview: string;
  category?: PhotoCategory;
  theme?: EnhancementTheme;
  analysis?: PhotoAnalysis;
  enhancedUrl?: string;
}

export default function Dashboard() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState<DashboardStep>('upload');
  const [uploadedPhotos, setUploadedPhotos] = useState<UploadedPhoto[]>([]);
  const [currentPhoto, setCurrentPhoto] = useState<UploadedPhoto | null>(null);
  const [currentSlotIndex, setCurrentSlotIndex] = useState<number>(0);
  const [enhancementResults, setEnhancementResults] = useState<any[]>([]);
  const [bulkPhotos, setBulkPhotos] = useState<UploadedPhoto[]>([]);

  useEffect(() => {
    if (!loading && !user) {
      navigate('/auth');
    }
  }, [user, loading, navigate]);

  const steps = [
    { id: 'upload', label: 'Build Your Lineup', icon: Upload, desc: 'Create your 6-photo dating lineup' },
    { id: 'analysis', label: 'Photo Review', icon: Target, desc: 'AI feedback on your photo appeal' },
    { id: 'processing', label: 'Photo Makeover', icon: Zap, desc: 'Make your photos irresistible' },
    { id: 'results', label: 'Ready to Swipe', icon: Download, desc: 'Download your amazing photos' },
  ];

  const currentStepIndex = steps.findIndex(step => step.id === currentStep);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-dark flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-violet-purple border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-dark">
      <div className="container mx-auto px-4 py-6">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gradient-primary mb-2">
            Build Your Perfect Dating Profile
          </h1>
          <p className="text-muted-foreground">
            Transform your photos into irresistible dating app magnets that get more matches
          </p>
        </div>

        {/* Simplified Progress */}
        <div className="flex items-center justify-center mb-8">
          {steps.map((step, index) => {
            const Icon = step.icon;
            const isActive = index === currentStepIndex;
            const isCompleted = index < currentStepIndex;
            
            return (
              <div key={step.id} className="flex items-center">
                <div className={`
                  flex flex-col items-center ${index < steps.length - 1 ? 'mr-12' : ''}
                `}>
                  <div className={`
                    flex items-center justify-center w-12 h-12 rounded-full transition-all duration-300 mb-2
                    ${isActive ? 'bg-violet-purple text-primary-foreground shadow-glow-violet' : 
                      isCompleted ? 'bg-bright-pink text-primary-foreground' : 
                      'bg-muted text-muted-foreground'}
                  `}>
                    <Icon className="w-6 h-6" />
                  </div>
                  
                  <div className="text-center">
                    <p className={`font-medium text-sm ${isActive ? 'text-violet-purple' : 'text-muted-foreground'}`}>
                      {step.label}
                    </p>
                  </div>
                </div>
                
                {index < steps.length - 1 && (
                  <div className={`
                    w-16 h-0.5 mb-6 transition-colors duration-300
                    ${isCompleted ? 'bg-bright-pink' : 'bg-border'}
                  `} />
                )}
              </div>
            );
          })}
        </div>

        {/* Step Content */}
        {currentStep === 'upload' && (
          <PhotoLineupStation
            uploadedPhotos={uploadedPhotos}
            setUploadedPhotos={setUploadedPhotos}
            onNext={(photo, slotIndex) => {
              setCurrentPhoto(photo);
              setCurrentSlotIndex(slotIndex);
              setCurrentStep('analysis');
            }}
            onIndividualTransform={(photo, slotIndex) => {
              // Individual photo processing handled within PhotoLineupStation
              console.log('Individual photo transformed:', photo);
            }}
            onBulkTransform={(photos) => {
              setBulkPhotos(photos);
              setCurrentStep('bulk-processing');
            }}
          />
        )}

        {currentStep === 'analysis' && currentPhoto && (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="w-5 h-5" />
                  Your Photo Makeover Preview
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <img 
                      src={currentPhoto.preview} 
                      alt="Selected photo"
                      className="w-full h-64 object-cover rounded-lg mb-4"
                    />
                    <div className="space-y-2">
                      <Badge variant="secondary">
                        Photo #{currentSlotIndex + 1}: {currentPhoto.category?.replace(/-/g, ' ')}
                      </Badge>
                      <Badge variant="outline">
                        Style: {currentPhoto.theme?.replace(/-/g, ' ')}
                      </Badge>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <p className="text-muted-foreground">
                      Ready to make this photo absolutely irresistible with {currentPhoto.theme} styling.
                    </p>
                    
                    <Button 
                      onClick={() => setCurrentStep('processing')}
                      className="w-full"
                      size="lg"
                    >
                      ✨ Transform My Photo
                    </Button>
                    
                    <Button 
                      variant="outline" 
                      onClick={() => setCurrentStep('upload')}
                      className="w-full"
                    >
                      Back to Lineup
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {currentStep === 'processing' && currentPhoto && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <SwipeBoostEngine
                imageDataUrl={currentPhoto.preview}
                photoCategory={currentPhoto.category || 'the-hook'}
                enhancementTheme={currentPhoto.theme || 'confident-successful'}
                onResults={(results) => {
                  setEnhancementResults(prev => [...prev, { photo: currentPhoto, results }]);
                  
                  // Check if there are more photos to process or go to results
                  const nextIndex = currentSlotIndex + 1;
                  const nextPhoto = uploadedPhotos[nextIndex];
                  
                  if (nextPhoto && nextPhoto.category && nextPhoto.theme) {
                    setCurrentPhoto(nextPhoto);
                    setCurrentSlotIndex(nextIndex);
                    // Stay on processing step for next photo
                  } else {
                    setCurrentStep('results');
                  }
                }}
                onBack={() => {
                  setCurrentStep('upload');
                  setCurrentPhoto(null);
                  setCurrentSlotIndex(0);
                }}
              />
            </div>
            <div className="lg:col-span-1">
              <CreditsDisplay />
            </div>
          </div>
        )}

        {currentStep === 'bulk-processing' && bulkPhotos.length > 0 && (
          <BulkPhotoProcessor
            photos={bulkPhotos}
            onComplete={(results) => {
              setEnhancementResults(results);
              setCurrentStep('results');
            }}
            onBack={() => setCurrentStep('upload')}
          />
        )}

        {currentStep === 'bulk-processing' && bulkPhotos.length > 0 && (
          <BulkPhotoProcessor
            photos={bulkPhotos}
            onComplete={(results) => {
              setEnhancementResults(results);
              setCurrentStep('results');
            }}
            onBack={() => {
              setCurrentStep('upload');
              setBulkPhotos([]);
            }}
          />
        )}

        {currentStep === 'results' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gradient-primary">Your Enhanced Photos</h2>
              <Button
                onClick={() => {
                  setCurrentStep('upload');
                  setEnhancementResults([]);
                  setCurrentPhoto(null);
                  setCurrentSlotIndex(0);
                  setBulkPhotos([]);
                }}
                variant="outline"
                className="flex items-center gap-2"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to Lineup
              </Button>
            </div>
            
            <EnhancementResults
              results={enhancementResults}
              originalPhotos={uploadedPhotos}
            />
          </div>
        )}
      </div>

      {/* Developer Panel */}
      <DevPanel />
    </div>
  );
}