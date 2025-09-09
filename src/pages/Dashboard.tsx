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
import { Upload, Zap, Download } from "lucide-react";

type DashboardStep = 'upload' | 'processing' | 'results';

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
  const [analysisProgress, setAnalysisProgress] = useState(0);
  const [enhancementResults, setEnhancementResults] = useState<any[]>([]);

  useEffect(() => {
    if (!loading && !user) {
      navigate('/auth');
    }
  }, [user, loading, navigate]);

  const steps = [
    { id: 'upload', label: 'Upload Photos', icon: Upload, desc: 'Select 1-3 photos for enhancement' },
    { id: 'processing', label: 'AI Processing', icon: Zap, desc: 'Analysis & enhancement in progress' },
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
            AI Photo Enhancement
          </h1>
          <p className="text-muted-foreground">
            Upload your photos and describe what you'd like to improve
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
            onNext={() => setCurrentStep('processing')}
          />
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