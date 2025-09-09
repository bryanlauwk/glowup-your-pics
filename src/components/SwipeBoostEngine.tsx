import React, { useState, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Zap, 
  Eye, 
  Target, 
  Shield, 
  CheckCircle, 
  XCircle, 
  AlertTriangle,
  Camera,
  Grid3x3,
  RotateCcw
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface SwipeBoostMetrics {
  mls: number; // Match-Likelihood Score
  cs: number;  // Compliance Score
  gateResults: {
    identityPass: boolean;
    artifactPass: boolean;
    posePass: boolean;
    compositionPass: boolean;
    overallPass: boolean;
  };
  metrics: {
    identitySimilarity: number;
    eyeLinePercent: number;
    faceAreaPercent: number;
    poseAngles: { yaw: number; pitch: number; roll: number };
    artifactScores: { oversmooth: number; halo: number; warp: number };
  };
  suggestions: string[];
  reshootRequired: boolean;
}

interface SwipeBoostEngineProps {
  imageDataUrl: string;
  onResults?: (results: SwipeBoostMetrics) => void;
}

export const SwipeBoostEngine: React.FC<SwipeBoostEngineProps> = ({
  imageDataUrl,
  onResults
}) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [results, setResults] = useState<SwipeBoostMetrics | null>(null);
  const [selectedPreset, setSelectedPreset] = useState<'headshot' | 'half_body' | 'outdoor_casual'>('headshot');
  const [showReshootGrid, setShowReshootGrid] = useState(false);
  const [enhancedImage, setEnhancedImage] = useState<string | null>(null);

  const presets = [
    { 
      id: 'headshot' as const,
      name: 'Headshot',
      description: 'Close-up portraits for maximum impact',
      icon: '👤',
      bestFor: 'Tinder, Bumble main photos'
    },
    { 
      id: 'half_body' as const,
      name: 'Half Body', 
      description: 'Torso shots showing style and physique',
      icon: '🔥',
      bestFor: 'Showcase personality and style'
    },
    { 
      id: 'outdoor_casual' as const,
      name: 'Outdoor Casual',
      description: 'Natural lifestyle and activity photos',
      icon: '🌟',
      bestFor: 'Coffee Meets Bagel, Hinge'
    }
  ];

  const processPhoto = useCallback(async () => {
    if (!imageDataUrl) return;

    setIsProcessing(true);
    toast.info("Analyzing photo with SwipeBoost engine...");

    try {
      // Step 1: Enhance photo with selected preset
      const { data: enhanceData, error: enhanceError } = await supabase.functions.invoke('swipeBoost-enhance', {
        body: {
          imageDataUrl,
          preset: selectedPreset
        }
      });

      if (enhanceError) throw enhanceError;

      setEnhancedImage(enhanceData.enhancedImageUrl);

      // Step 2: Evaluate the enhanced photo
      const { data: evaluateData, error: evaluateError } = await supabase.functions.invoke('swipeBoost-evaluate', {
        body: {
          originalImageUrl: imageDataUrl,
          enhancedImageUrl: enhanceData.enhancedImageUrl,
          appliedSettings: enhanceData.appliedSettings
        }
      });

      if (evaluateError) throw evaluateError;

      const metrics: SwipeBoostMetrics = evaluateData;
      setResults(metrics);
      
      // Show reshoot grid if needed
      if (metrics.reshootRequired) {
        setShowReshootGrid(true);
      }

      onResults?.(metrics);
      
      toast.success(`Analysis complete! MLS: ${metrics.mls}/100, CS: ${metrics.cs}/100`);

    } catch (error) {
      console.error('SwipeBoost processing error:', error);
      toast.error("Failed to process photo. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  }, [imageDataUrl, selectedPreset, onResults]);

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-emerald-500';
    if (score >= 72) return 'text-yellow-500'; 
    return 'text-red-500';
  };

  const getGateIcon = (passed: boolean) => {
    return passed ? (
      <CheckCircle className="w-5 h-5 text-emerald-500" />
    ) : (
      <XCircle className="w-5 h-5 text-red-500" />
    );
  };

  return (
    <div className="space-y-6">
      {/* Preset Selection */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="w-5 h-5" />
            Enhancement Preset
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            {presets.map((preset) => (
              <Card
                key={preset.id}
                className={`cursor-pointer transition-all duration-200 ${
                  selectedPreset === preset.id
                    ? 'border-violet-purple bg-violet-purple/10'
                    : 'hover:border-violet-purple/50'
                }`}
                onClick={() => setSelectedPreset(preset.id)}
              >
                <CardContent className="p-4 text-center">
                  <div className="text-2xl mb-2">{preset.icon}</div>
                  <h3 className="font-semibold mb-1">{preset.name}</h3>
                  <p className="text-sm text-muted-foreground mb-2">{preset.description}</p>
                  <Badge variant="secondary" className="text-xs">
                    {preset.bestFor}
                  </Badge>
                </CardContent>
              </Card>
            ))}
          </div>

          <Button 
            onClick={processPhoto}
            disabled={isProcessing || !imageDataUrl}
            className="w-full"
            size="lg"
          >
            {isProcessing ? (
              <>
                <Zap className="w-5 h-5 mr-2 animate-pulse" />
                Processing with SwipeBoost Engine...
              </>
            ) : (
              <>
                <Zap className="w-5 h-5 mr-2" />
                Analyze & Enhance Photo
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {/* Processing Progress */}
      {isProcessing && (
        <Card>
          <CardContent className="p-6">
            <div className="space-y-4">
              <div className="text-center">
                <Zap className="w-8 h-8 text-violet-purple mx-auto mb-2 animate-pulse" />
                <p className="text-sm text-muted-foreground">SwipeBoost Engine Processing</p>
              </div>
              <Progress value={66} className="h-2" />
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-xs text-muted-foreground">
                <div className="flex items-center gap-1">
                  <CheckCircle className="w-3 h-3 text-emerald-500" />
                  Enhancement
                </div>
                <div className="flex items-center gap-1">
                  <CheckCircle className="w-3 h-3 text-emerald-500" />
                  Identity Check
                </div>
                <div className="flex items-center gap-1">
                  <Zap className="w-3 h-3 text-yellow-500 animate-pulse" />
                  MLS Calculation
                </div>
                <div className="flex items-center gap-1">
                  <Shield className="w-3 h-3 text-muted-foreground" />
                  CS Analysis
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Results Display */}
      {results && (
        <div className="space-y-4">
          {/* Score Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card className="bg-gradient-to-br from-violet-purple/10 to-bright-pink/10 border-violet-purple/30">
              <CardContent className="p-6 text-center">
                <Eye className="w-8 h-8 text-violet-purple mx-auto mb-2" />
                <h3 className="text-sm font-medium text-muted-foreground mb-1">Match-Likelihood Score</h3>
                <div className={`text-4xl font-bold ${getScoreColor(results.mls)}`}>
                  {results.mls}
                </div>
                <div className="text-sm text-muted-foreground">/100</div>
                <Progress value={results.mls} className="mt-3 h-2" />
                <p className="text-xs text-muted-foreground mt-2">
                  {results.mls >= 72 ? 'Dating app optimized!' : 'Needs improvement'}
                </p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-rose-gold/10 to-emerald-500/10 border-rose-gold/30">
              <CardContent className="p-6 text-center">
                <Shield className="w-8 h-8 text-rose-gold mx-auto mb-2" />
                <h3 className="text-sm font-medium text-muted-foreground mb-1">Compliance Score</h3>
                <div className={`text-4xl font-bold ${getScoreColor(results.cs)}`}>
                  {results.cs}
                </div>
                <div className="text-sm text-muted-foreground">/100</div>
                <Progress value={results.cs} className="mt-3 h-2" />
                <p className="text-xs text-muted-foreground mt-2">
                  {results.cs >= 90 ? 'Platform compliant!' : 'May be detected'}
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Gate Results */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5" />
                Quality Gates
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                <div className="flex items-center gap-2">
                  {getGateIcon(results.gateResults.identityPass)}
                  <span className="text-sm">Identity</span>
                </div>
                <div className="flex items-center gap-2">
                  {getGateIcon(results.gateResults.artifactPass)}
                  <span className="text-sm">Artifacts</span>
                </div>
                <div className="flex items-center gap-2">
                  {getGateIcon(results.gateResults.posePass)}
                  <span className="text-sm">Pose</span>
                </div>
                <div className="flex items-center gap-2">
                  {getGateIcon(results.gateResults.compositionPass)}
                  <span className="text-sm">Composition</span>
                </div>
                <div className="flex items-center gap-2">
                  {getGateIcon(results.gateResults.overallPass)}
                  <span className="text-sm font-semibold">
                    {results.gateResults.overallPass ? 'APPROVED' : 'BLOCKED'}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Detailed Metrics */}
          <Tabs defaultValue="metrics" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="metrics">Metrics</TabsTrigger>
              <TabsTrigger value="suggestions">Suggestions</TabsTrigger>
              <TabsTrigger value="technical">Technical</TabsTrigger>
            </TabsList>

            <TabsContent value="metrics" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card>
                  <CardContent className="p-4">
                    <h4 className="font-semibold mb-2">Eye Line Position</h4>
                    <div className="text-2xl font-bold">
                      {results.metrics.eyeLinePercent.toFixed(1)}%
                    </div>
                    <Progress value={results.metrics.eyeLinePercent} className="mt-2" />
                    <p className="text-xs text-muted-foreground mt-1">
                      Target: 34-42% (optimal: 38%)
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-4">
                    <h4 className="font-semibold mb-2">Face Area</h4>
                    <div className="text-2xl font-bold">
                      {results.metrics.faceAreaPercent.toFixed(1)}%
                    </div>
                    <Progress value={results.metrics.faceAreaPercent * 4} className="mt-2" />
                    <p className="text-xs text-muted-foreground mt-1">
                      Target: 15-25% of frame
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-4">
                    <h4 className="font-semibold mb-2">Identity Match</h4>
                    <div className="text-2xl font-bold">
                      {(results.metrics.identitySimilarity * 100).toFixed(1)}%
                    </div>
                    <Progress value={results.metrics.identitySimilarity * 100} className="mt-2" />
                    <p className="text-xs text-muted-foreground mt-1">
                      Minimum: 92% similarity
                    </p>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="suggestions" className="space-y-4">
              {results.suggestions.map((suggestion, index) => (
                <Alert key={index}>
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription>{suggestion}</AlertDescription>
                </Alert>
              ))}
            </TabsContent>

            <TabsContent value="technical" className="space-y-4">
              <Card>
                <CardContent className="p-4">
                  <h4 className="font-semibold mb-3">Pose Analysis</h4>
                  <div className="grid grid-cols-3 gap-4 text-sm">
                    <div>
                      <span className="text-muted-foreground">Yaw:</span>
                      <div className="font-mono">{results.metrics.poseAngles.yaw.toFixed(1)}°</div>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Pitch:</span>
                      <div className="font-mono">{results.metrics.poseAngles.pitch.toFixed(1)}°</div>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Roll:</span>
                      <div className="font-mono">{results.metrics.poseAngles.roll.toFixed(1)}°</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <h4 className="font-semibold mb-3">Artifact Detection</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Oversmoothing:</span>
                      <Badge variant={results.metrics.artifactScores.oversmooth > 0.15 ? 'destructive' : 'secondary'}>
                        {(results.metrics.artifactScores.oversmooth * 100).toFixed(1)}%
                      </Badge>
                    </div>
                    <div className="flex justify-between">
                      <span>Halo Effect:</span>
                      <Badge variant={results.metrics.artifactScores.halo > 0.10 ? 'destructive' : 'secondary'}>
                        {(results.metrics.artifactScores.halo * 100).toFixed(1)}%
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          {/* Reshoot Guidance */}
          {results.reshootRequired && (
            <Alert className="border-orange-500 bg-orange-50 dark:bg-orange-950">
              <Camera className="h-4 w-4" />
              <AlertDescription className="flex items-center justify-between">
                <span>Photo requires reshoot for optimal results</span>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => setShowReshootGrid(!showReshootGrid)}
                >
                  <Grid3x3 className="w-4 h-4 mr-2" />
                  {showReshootGrid ? 'Hide' : 'Show'} Guide
                </Button>
              </AlertDescription>
            </Alert>
          )}

          {/* Enhanced Image Preview */}
          {enhancedImage && (
            <Card>
              <CardHeader>
                <CardTitle>Enhanced Result</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="relative">
                  <img 
                    src={enhancedImage} 
                    alt="Enhanced"
                    className="w-full max-w-md mx-auto rounded-lg"
                  />
                  {showReshootGrid && (
                    <div className="absolute inset-0 pointer-events-none">
                      {/* Rule of thirds grid */}
                      <div className="absolute inset-0 border border-white/50">
                        <div className="absolute top-1/3 left-0 right-0 h-px bg-white/50" />
                        <div className="absolute top-2/3 left-0 right-0 h-px bg-white/50" />
                        <div className="absolute left-1/3 top-0 bottom-0 w-px bg-white/50" />
                        <div className="absolute left-2/3 top-0 bottom-0 w-px bg-white/50" />
                      </div>
                      {/* Eye line indicator */}
                      <div className="absolute top-[38%] left-0 right-0 h-px bg-violet-purple/70" />
                      <div className="absolute top-[38%] right-2 bg-violet-purple text-white text-xs px-2 py-1 rounded">
                        Eye Line (38%)
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      )}
    </div>
  );
};