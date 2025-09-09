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
  analysis?: PhotoAnalysis;
}

export default function Dashboard() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState<DashboardStep>('upload');
  const [uploadedPhotos, setUploadedPhotos] = useState<UploadedPhoto[]>([]);
  const [selectedPhoto, setSelectedPhoto] = useState<UploadedPhoto | null>(null);
  const [analysisProgress, setAnalysisProgress] = useState(0);
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
            onNext={(photos) => {
              setUploadedPhotos(photos);
              if (photos.length > 0) {
                setSelectedPhoto(photos[0]);
                setCurrentStep('analysis');
              }
            }}
          />
        )}

        {currentStep === 'analysis' && selectedPhoto && (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="w-5 h-5" />
                  Select Photo for Analysis
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                  {uploadedPhotos.map((photo) => (
                    <Card
                      key={photo.id}
                      className={`cursor-pointer transition-all duration-200 ${
                        selectedPhoto.id === photo.id
                          ? 'border-violet-purple bg-violet-purple/10'
                          : 'hover:border-violet-purple/50'
                      }`}
                      onClick={() => setSelectedPhoto(photo)}
                    >
                      <CardContent className="p-4">
                        <img 
                          src={photo.preview} 
                          alt="Upload preview"
                          className="w-full h-48 object-cover rounded-lg mb-2"
                        />
                        <Badge variant={selectedPhoto.id === photo.id ? 'default' : 'secondary'} className="w-full">
                          {selectedPhoto.id === photo.id ? 'Selected' : 'Select'}
                        </Badge>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>

            <SwipeBoostEngine 
              imageDataUrl={selectedPhoto.preview}
              onResults={(results) => {
                console.log('SwipeBoost results:', results);
                // Can proceed to enhancement if gates pass
                if (results.gateResults.overallPass) {
                  setCurrentStep('processing');
                }
              }}
            />
          </div>
        )}

        {currentStep === 'processing' && (
          <AIProcessingEngine
            photos={uploadedPhotos}
            onProcessingComplete={(results) => {
              setEnhancementResults(results);
              setCurrentStep('results');
            }}
          />
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