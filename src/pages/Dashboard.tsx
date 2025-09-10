import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { PhotoUploadStation } from "@/components/dashboard/PhotoUploadStation";
import { AIProcessingEngine } from "@/components/dashboard/AIProcessingEngine";
import { EnhancementResults } from "@/components/dashboard/EnhancementResults";
import { SwipeBoostEngine } from "@/components/SwipeBoostEngine";
import { Upload, Zap, Download, Target } from "lucide-react";

type DashboardStep = 'upload' | 'analysis' | 'processing' | 'results';
type PhotoCategory = 'headshot' | 'lifestyle-fullbody' | 'background-scenery' | 'lifestyle-activity' | 'social-friends' | 'adventure-travel';
type EnhancementTheme = 'professional' | 'natural' | 'attractive-dating' | 'glamour' | 'artistic';

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
}

export default function Dashboard() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState<DashboardStep>('upload');
  const [uploadedPhotos, setUploadedPhotos] = useState<UploadedPhoto[]>([]);
  const [currentPhoto, setCurrentPhoto] = useState<UploadedPhoto | null>(null);
  const [currentSlotType, setCurrentSlotType] = useState<'primary' | 'secondary'>('primary');
  const [enhancementResults, setEnhancementResults] = useState<any[]>([]);

  useEffect(() => {
    if (!loading && !user) {
      navigate('/auth');
    }
  }, [user, loading, navigate]);

  const steps = [
    { id: 'upload', label: 'Upload Photos', icon: Upload, desc: 'Select 1-3 photos for analysis' },
    { id: 'analysis', label: 'SwipeBoost Analysis', icon: Target, desc: 'Match-likelihood & compliance scoring' },
    { id: 'processing', label: 'AI Enhancement', icon: Zap, desc: 'Optimized enhancement processing' },
    { id: 'results', label: 'Download Results', icon: Download, desc: 'Get your enhanced photos' },
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
            SwipeBoost Match-Likelihood Engine
          </h1>
          <p className="text-muted-foreground">
            Compliance-first photo enhancement optimized for dating apps with measurable MLS + CS scores
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
          <PhotoUploadStation
            uploadedPhotos={uploadedPhotos}
            setUploadedPhotos={setUploadedPhotos}
            onNext={(photo, slotType) => {
              setCurrentPhoto(photo);
              setCurrentSlotType(slotType);
              setCurrentStep('analysis');
            }}
          />
        )}

        {currentStep === 'analysis' && currentPhoto && (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="w-5 h-5" />
                  {currentSlotType === 'primary' ? 'Primary' : 'Secondary'} Photo Enhancement
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
                        Category: {currentPhoto.category}
                      </Badge>
                      <Badge variant="outline">
                        Theme: {currentPhoto.theme}
                      </Badge>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <p className="text-muted-foreground">
                      Ready to analyze and enhance your {currentSlotType} photo with {currentPhoto.theme} styling.
                    </p>
                    
                    <Button 
                      onClick={() => setCurrentStep('processing')}
                      className="w-full"
                      size="lg"
                    >
                      Start Enhancement Process
                    </Button>
                    
                    <Button 
                      variant="outline" 
                      onClick={() => setCurrentStep('upload')}
                      className="w-full"
                    >
                      Back to Upload
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {currentStep === 'processing' && currentPhoto && (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="w-5 h-5" />
                  Enhancing {currentSlotType === 'primary' ? 'Primary' : 'Secondary'} Photo
                </CardTitle>
              </CardHeader>
              <CardContent>
                <SwipeBoostEngine 
                  imageDataUrl={currentPhoto.preview}
                  onResults={(results) => {
                    console.log('Enhancement results:', results);
                    setEnhancementResults(prev => [...prev, { photo: currentPhoto, results }]);
                    
                    // Check if there are more photos to process or go to results
                    const nextSlot = currentSlotType === 'primary' ? 'secondary' : null;
                    const nextPhoto = nextSlot === 'secondary' ? uploadedPhotos[1] : null;
                    
                    if (nextPhoto && nextPhoto.category && nextPhoto.theme) {
                      setCurrentPhoto(nextPhoto);
                      setCurrentSlotType('secondary');
                      // Stay on processing step for next photo
                    } else {
                      setCurrentStep('results');
                    }
                  }}
                />
                
                <div className="mt-6 p-4 bg-muted/20 rounded-lg">
                  <p className="text-sm text-muted-foreground">
                    Processing your {currentPhoto.category} photo with {currentPhoto.theme} enhancement...
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {currentStep === 'results' && (
          <EnhancementResults
            results={enhancementResults}
            originalPhotos={uploadedPhotos}
          />
        )}
      </div>
    </div>
  );
}