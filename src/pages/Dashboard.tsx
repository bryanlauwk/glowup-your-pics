import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { PhotoUploadStation } from "@/components/dashboard/PhotoUploadStation";
import { MatchLikelihoodEngine } from "@/components/dashboard/MatchLikelihoodEngine";
import { AntiDetectionProcessor } from "@/components/dashboard/AntiDetectionProcessor";
import { EnhancementResults } from "@/components/dashboard/EnhancementResults";
import { User, Camera, Zap, Shield, Download } from "lucide-react";

type DashboardStep = 'upload' | 'analysis' | 'enhancement' | 'processing' | 'results';

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
    { id: 'upload', label: 'Upload Photos', icon: Camera, desc: 'Select 1-3 photos' },
    { id: 'analysis', label: 'AI Analysis', icon: User, desc: 'Match-likelihood scoring' },
    { id: 'enhancement', label: 'Enhancement', icon: Zap, desc: 'Apply improvements' },
    { id: 'processing', label: 'Anti-Detection', icon: Shield, desc: 'Platform optimization' },
    { id: 'results', label: 'Download', icon: Download, desc: 'Get your photos' },
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
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gradient-primary mb-2">
            AI Enhancement Studio
          </h1>
          <p className="text-muted-foreground text-lg">
            Transform your photos with our Match-Likelihood Engine
          </p>
        </div>

        {/* Progress Steps */}
        <Card className="mb-8 bg-card/50 backdrop-blur-sm border-border/50">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              {steps.map((step, index) => {
                const Icon = step.icon;
                const isActive = index === currentStepIndex;
                const isCompleted = index < currentStepIndex;
                
                return (
                  <div key={step.id} className="flex items-center">
                    <div className={`
                      flex items-center justify-center w-12 h-12 rounded-full transition-all duration-300
                      ${isActive ? 'bg-violet-purple text-primary-foreground shadow-glow-violet' : 
                        isCompleted ? 'bg-bright-pink text-primary-foreground' : 
                        'bg-muted text-muted-foreground'}
                    `}>
                      <Icon className="w-6 h-6" />
                    </div>
                    
                    <div className="ml-3 flex-1">
                      <p className={`font-semibold ${isActive ? 'text-violet-purple' : 'text-foreground'}`}>
                        {step.label}
                      </p>
                      <p className="text-sm text-muted-foreground">{step.desc}</p>
                    </div>
                    
                    {index < steps.length - 1 && (
                      <div className={`
                        w-8 h-0.5 mx-4 transition-colors duration-300
                        ${isCompleted ? 'bg-bright-pink' : 'bg-border'}
                      `} />
                    )}
                  </div>
                );
              })}
            </div>
            
            <Progress 
              value={(currentStepIndex / (steps.length - 1)) * 100} 
              className="h-2 bg-muted"
            />
          </CardContent>
        </Card>

        {/* Step Content */}
        <div className="space-y-6">
          {currentStep === 'upload' && (
            <PhotoUploadStation
              uploadedPhotos={uploadedPhotos}
              setUploadedPhotos={setUploadedPhotos}
              onNext={() => setCurrentStep('analysis')}
            />
          )}

          {currentStep === 'analysis' && (
            <MatchLikelihoodEngine
              photos={uploadedPhotos}
              onAnalysisComplete={(analyzedPhotos) => {
                setUploadedPhotos(analyzedPhotos);
                setCurrentStep('enhancement');
              }}
              progress={analysisProgress}
              setProgress={setAnalysisProgress}
            />
          )}

          {currentStep === 'enhancement' && (
            <Card className="bg-card/50 backdrop-blur-sm border-border/50">
              <CardHeader>
                <CardTitle className="text-2xl text-gradient-primary">
                  Enhancement Options
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {uploadedPhotos.map((photo) => (
                    <div key={photo.id} className="space-y-4">
                      <img 
                        src={photo.preview} 
                        alt="Photo to enhance" 
                        className="w-full h-64 object-cover rounded-lg"
                      />
                      
                      {photo.analysis && (
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <span>Match-Likelihood Score</span>
                            <Badge variant="secondary" className="bg-violet-purple/20 text-violet-purple">
                              {Math.round(photo.analysis.overallScore)}%
                            </Badge>
                          </div>
                          
                          <div className="grid grid-cols-2 gap-2 text-sm">
                            <div>Face Visibility: {Math.round(photo.analysis.faceVisibility)}%</div>
                            <div>Smile: {Math.round(photo.analysis.smileConfidence)}%</div>
                            <div>Eye Contact: {Math.round(photo.analysis.eyeContactConfidence)}%</div>
                            <div>Lighting: {Math.round(photo.analysis.lightingScore)}%</div>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
                
                <div className="mt-6 flex justify-center">
                  <Button 
                    variant="glow" 
                    size="lg"
                    onClick={() => setCurrentStep('processing')}
                  >
                    Enhance Photos
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {currentStep === 'processing' && (
            <AntiDetectionProcessor
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
    </div>
  );
}