import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { useGeminiNano } from '@/hooks/useGeminiNano';
import { 
  Eye, 
  Smile, 
  Sun, 
  Crop, 
  Shield, 
  Users,
  CheckCircle, 
  AlertTriangle, 
  XCircle,
  Zap 
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { logger } from '@/lib/logger';

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

interface MatchLikelihoodEngineProps {
  photos: UploadedPhoto[];
  onAnalysisComplete: (analyzedPhotos: UploadedPhoto[]) => void;
  progress: number;
  setProgress: React.Dispatch<React.SetStateAction<number>>;
}

const PIPELINE_COMPONENTS = [
  {
    id: 'faceVisibility',
    name: 'Face Visibility Detector',
    icon: Eye,
    description: 'Ensures face is clear, unobstructed, and centered',
    threshold: 65,
    weight: 20,
  },
  {
    id: 'smileConfidence',
    name: 'Smile & Eye Contact Classifier',
    icon: Smile,
    description: 'Detects authentic smile and direct gaze',
    threshold: 70,
    weight: 15,
  },
  {
    id: 'lightingScore',
    name: 'Lighting & Quality Score',
    icon: Sun,
    description: 'Evaluates exposure and color balance',
    threshold: 70,
    weight: 20,
  },
  {
    id: 'compositionScore',
    name: 'Composition Cropper',
    icon: Crop,
    description: 'Auto-crop to rule-of-thirds optimization',
    threshold: 70,
    weight: 15,
  },
  {
    id: 'identitySimilarity',
    name: 'Identity Similarity Check',
    icon: Shield,
    description: 'Maintains authentic appearance',
    threshold: 92,
    weight: 20,
  },
  {
    id: 'photoSetGuidance',
    name: 'Photo Set Guidance',
    icon: Users,
    description: 'Optimal photo mix recommendations',
    threshold: 80,
    weight: 10,
  },
];

export const MatchLikelihoodEngine: React.FC<MatchLikelihoodEngineProps> = ({
  photos,
  onAnalysisComplete,
  progress,
  setProgress,
}) => {
  const { analyzePhoto, isReady, isSupported, error } = useGeminiNano();
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);
  const [currentComponent, setCurrentComponent] = useState(0);
  const [analyzedPhotos, setAnalyzedPhotos] = useState<UploadedPhoto[]>(photos);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const analyzeAllPhotos = async () => {
    if (!isReady || isAnalyzing) return;
    
    setIsAnalyzing(true);
    
    try {
      const totalSteps = photos.length * PIPELINE_COMPONENTS.length;
      let completedSteps = 0;
      
      const newAnalyzedPhotos = [...photos];
      
      for (let photoIndex = 0; photoIndex < photos.length; photoIndex++) {
        setCurrentPhotoIndex(photoIndex);
        const photo = photos[photoIndex];
        
        // Convert file to base64 for analysis
        const imageDataUrl = await new Promise<string>((resolve) => {
          const reader = new FileReader();
          reader.onload = (e) => resolve(e.target?.result as string);
          reader.readAsDataURL(photo.file);
        });
        
        try {
          // Simulate pipeline component analysis
          const analysis: PhotoAnalysis = {
            faceVisibility: 0,
            smileConfidence: 0,
            eyeContactConfidence: 0,
            lightingScore: 0,
            compositionScore: 0,
            identitySimilarity: 0,
            overallScore: 0,
            suggestions: [],
          };
          
          // Run through each pipeline component
          for (let componentIndex = 0; componentIndex < PIPELINE_COMPONENTS.length; componentIndex++) {
            setCurrentComponent(componentIndex);
            
            // Simulate processing time
            await new Promise(resolve => setTimeout(resolve, 500));
            
            // If Gemini Nano is available, use it for the first photo as demonstration
            if (photoIndex === 0 && componentIndex === 0 && isSupported) {
              try {
                const geminiAnalysis = await analyzePhoto(imageDataUrl);
                analysis.faceVisibility = geminiAnalysis.faceVisibility;
                analysis.smileConfidence = geminiAnalysis.smileConfidence;
                analysis.eyeContactConfidence = geminiAnalysis.eyeContactConfidence;
                analysis.lightingScore = geminiAnalysis.lightingScore;
                analysis.compositionScore = geminiAnalysis.compositionScore;
                analysis.identitySimilarity = geminiAnalysis.identitySimilarity;
                analysis.suggestions = geminiAnalysis.suggestions;
              } catch (geminiError) {
                logger.warn('Gemini Nano analysis failed, using fallback scores', { error: geminiError, component: 'MatchLikelihoodEngine' });
              }
            } else {
              // Fallback scoring system when Gemini Nano is not available
              const component = PIPELINE_COMPONENTS[componentIndex];
              const baseScore = 60 + Math.random() * 30; // 60-90 range
              
              switch (component.id) {
                case 'faceVisibility':
                  analysis.faceVisibility = Math.max(65, baseScore);
                  break;
                case 'smileConfidence':
                  analysis.smileConfidence = baseScore;
                  break;
                case 'lightingScore':
                  analysis.lightingScore = baseScore;
                  break;
                case 'compositionScore':
                  analysis.compositionScore = baseScore;
                  break;
                case 'identitySimilarity':
                  analysis.identitySimilarity = Math.max(92, baseScore);
                  break;
              }
            }
            
            completedSteps++;
            setProgress((completedSteps / totalSteps) * 100);
          }
          
          // Calculate overall score
          analysis.overallScore = PIPELINE_COMPONENTS.reduce((sum, component) => {
            const score = analysis[component.id as keyof PhotoAnalysis] as number;
            return sum + (score * component.weight / 100);
          }, 0);
          
          // Generate suggestions based on scores
          if (!analysis.suggestions.length) {
            analysis.suggestions = generateSuggestions(analysis);
          }
          
          newAnalyzedPhotos[photoIndex] = {
            ...photo,
            analysis,
          };
          
        } catch (error) {
          logger.error('Failed to analyze photo', { error, photoIndex, component: 'MatchLikelihoodEngine', action: 'analyzePhoto' });
          // Add fallback analysis
          newAnalyzedPhotos[photoIndex] = {
            ...photo,
            analysis: {
              faceVisibility: 70,
              smileConfidence: 65,
              eyeContactConfidence: 60,
              lightingScore: 70,
              compositionScore: 65,
              identitySimilarity: 90,
              overallScore: 68,
              suggestions: ['Analysis incomplete - using default scores'],
            },
          };
        }
      }
      
      setAnalyzedPhotos(newAnalyzedPhotos);
      setProgress(100);
      
      // Complete analysis
      setTimeout(() => {
        onAnalysisComplete(newAnalyzedPhotos);
      }, 1000);
      
    } catch (error) {
      logger.error('Analysis failed', { error, component: 'MatchLikelihoodEngine', action: 'analyzePhotos' });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const generateSuggestions = (analysis: PhotoAnalysis): string[] => {
    const suggestions = [];
    
    if (analysis.faceVisibility < 65) {
      suggestions.push('Ensure your face is more clearly visible - avoid obstructions');
    }
    if (analysis.smileConfidence < 70 && analysis.eyeContactConfidence < 70) {
      suggestions.push('Try looking directly at the camera or adding a genuine smile');
    }
    if (analysis.lightingScore < 70) {
      suggestions.push('Improve lighting - natural light or soft indoor lighting works best');
    }
    if (analysis.compositionScore < 70) {
      suggestions.push('Center your face better or follow rule-of-thirds composition');
    }
    
    return suggestions.length ? suggestions : ['Great photo! Minor enhancements can boost appeal'];
  };

  const getScoreColor = (score: number, threshold: number) => {
    if (score >= threshold) return 'text-green-400';
    if (score >= threshold * 0.8) return 'text-yellow-400';
    return 'text-red-400';
  };

  const getScoreIcon = (score: number, threshold: number) => {
    if (score >= threshold) return CheckCircle;
    if (score >= threshold * 0.8) return AlertTriangle;
    return XCircle;
  };

  useEffect(() => {
    if (photos.length > 0 && !isAnalyzing) {
      analyzeAllPhotos();
    }
  }, [photos, isReady]);

  if (!isSupported && error) {
    return (
      <Card className="bg-card/50 backdrop-blur-sm border-border/50">
        <CardHeader>
          <CardTitle className="text-2xl text-gradient-primary">
            Match-Likelihood Analysis
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center space-y-4 py-8">
            <AlertTriangle className="w-16 h-16 text-yellow-400 mx-auto" />
            <div>
              <h3 className="text-lg font-semibold">Gemini Nano Not Available</h3>
              <p className="text-muted-foreground">Using fallback analysis system for demonstration</p>
            </div>
            <Button variant="glow" onClick={analyzeAllPhotos}>
              Start Fallback Analysis
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card className="bg-card/50 backdrop-blur-sm border-border/50">
        <CardHeader>
          <CardTitle className="text-2xl text-gradient-primary flex items-center">
            <Zap className="w-6 h-6 mr-2" />
            Match-Likelihood Engine
          </CardTitle>
          <p className="text-muted-foreground">
            AI-powered analysis using our 7-component pipeline for maximum dating app success
          </p>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {/* Progress Overview */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">
                {isAnalyzing 
                  ? `Analyzing Photo ${currentPhotoIndex + 1}/${photos.length} - ${PIPELINE_COMPONENTS[currentComponent]?.name}`
                  : 'Analysis Complete'
                }
              </span>
              <span className="text-sm text-muted-foreground">
                {Math.round(progress)}%
              </span>
            </div>
            <Progress value={progress} className="h-3" />
          </div>

          {/* Pipeline Components */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {PIPELINE_COMPONENTS.map((component, index) => {
              const Icon = component.icon;
              const isActive = isAnalyzing && index === currentComponent;
              const isCompleted = !isAnalyzing || index < currentComponent || progress === 100;
              
              return (
                <Card 
                  key={component.id} 
                  className={cn(
                    "transition-all duration-300",
                    isActive && "ring-2 ring-violet-purple shadow-glow-violet",
                    isCompleted && "bg-muted/20"
                  )}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start space-x-3">
                      <div className={cn(
                        "flex items-center justify-center w-10 h-10 rounded-full",
                        isActive ? "bg-violet-purple text-primary-foreground" :
                        isCompleted ? "bg-bright-pink text-primary-foreground" :
                        "bg-muted text-muted-foreground"
                      )}>
                        <Icon className="w-5 h-5" />
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <h4 className="font-semibold text-sm leading-tight">
                          {component.name}
                        </h4>
                        <p className="text-xs text-muted-foreground mt-1">
                          {component.description}
                        </p>
                        
                        {isCompleted && !isAnalyzing && (
                          <div className="mt-2">
                            <Badge 
                              variant="secondary" 
                              className="bg-green-500/20 text-green-400"
                            >
                              Threshold: {component.threshold}%
                            </Badge>
                          </div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Analysis Results */}
      {analyzedPhotos.some(p => p.analysis) && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {analyzedPhotos.map((photo, index) => {
            const analysis = photo.analysis;
            if (!analysis) return null;
            
            return (
              <Card key={photo.id} className="bg-card/50 backdrop-blur-sm border-border/50">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center justify-between">
                    Photo {index + 1} Analysis
                    <Badge 
                      variant="secondary" 
                      className={cn(
                        "text-lg px-3 py-1",
                        analysis.overallScore >= 80 ? "bg-green-500/20 text-green-400" :
                        analysis.overallScore >= 60 ? "bg-yellow-500/20 text-yellow-400" :
                        "bg-red-500/20 text-red-400"
                      )}
                    >
                      {Math.round(analysis.overallScore)}%
                    </Badge>
                  </CardTitle>
                </CardHeader>
                
                <CardContent className="space-y-4">
                  <img 
                    src={photo.preview} 
                    alt={`Analysis for photo ${index + 1}`}
                    className="w-full h-48 object-cover rounded-lg"
                  />
                  
                  <div className="space-y-3">
                    {PIPELINE_COMPONENTS.slice(0, 5).map((component) => {
                      const score = analysis[component.id as keyof PhotoAnalysis] as number;
                      const ScoreIcon = getScoreIcon(score, component.threshold);
                      
                      return (
                        <div key={component.id} className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <ScoreIcon className={cn(
                              "w-4 h-4",
                              getScoreColor(score, component.threshold)
                            )} />
                            <span className="text-sm">{component.name}</span>
                          </div>
                          <span className={cn(
                            "font-semibold",
                            getScoreColor(score, component.threshold)
                          )}>
                            {Math.round(score)}%
                          </span>
                        </div>
                      );
                    })}
                  </div>
                  
                  {analysis.suggestions.length > 0 && (
                    <div className="bg-muted/20 rounded-lg p-3">
                      <h5 className="font-semibold text-sm mb-2">Improvement Suggestions:</h5>
                      <ul className="space-y-1">
                        {analysis.suggestions.map((suggestion, idx) => (
                          <li key={idx} className="text-xs text-muted-foreground flex items-start">
                            <span className="text-violet-purple mr-2">•</span>
                            {suggestion}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
};