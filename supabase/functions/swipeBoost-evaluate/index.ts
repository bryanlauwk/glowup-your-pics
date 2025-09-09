import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Scoring thresholds for compliance and match-likelihood
const THRESHOLDS = {
  identity_cosine_min: 0.92,
  age_delta_max: 3,
  pose_delta_max: 15,
  skin_tone_delta_max: 5,
  oversmooth_max: 0.15,
  halo_max: 0.10,
  warp_max: 3,
  seam_max: 0.08,
  nsfw_max: 0.00,
  suggestive_max: 0.15,
  mls_release_min: 72,
  cs_release_min: 90
};

// Pose requirements for different angles
const POSE_REQUIREMENTS = {
  front: { yaw_max: 12, pitch_max: 10, roll_max: 2, eye_line_min: 34, eye_line_max: 42, face_area_min: 15, face_area_max: 25 },
  three_quarter: { yaw_target: 25, yaw_tolerance: 10, pitch_max: 15, roll_max: 3 },
  side: { yaw_min: 70, eye_visibility_min: 0.5 }
};

interface EvaluationRequest {
  originalImageUrl: string;
  enhancedImageUrl: string;
  appliedSettings?: any;
}

interface EvaluationResult {
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
    safetyScores: { nsfw: number; suggestive: number };
  };
  suggestions: string[];
  reshootRequired: boolean;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }

  try {
    const { originalImageUrl, enhancedImageUrl, appliedSettings } = await req.json() as EvaluationRequest;

    if (!originalImageUrl || !enhancedImageUrl) {
      return new Response(JSON.stringify({ error: 'Both original and enhanced images are required' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    // Perform evaluation analysis
    const evaluation = await performEvaluation(originalImageUrl, enhancedImageUrl, appliedSettings);

    return new Response(JSON.stringify(evaluation), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('Error in swipeBoost-evaluate:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
});

async function performEvaluation(originalUrl: string, enhancedUrl: string, settings?: any): Promise<EvaluationResult> {
  // Simulate comprehensive photo analysis
  // In real implementation, this would use computer vision APIs
  
  const metrics = await analyzePhotoMetrics(enhancedUrl);
  const identitySimilarity = await compareIdentity(originalUrl, enhancedUrl);
  
  // Calculate gate results
  const gateResults = {
    identityPass: identitySimilarity >= THRESHOLDS.identity_cosine_min,
    artifactPass: metrics.artifactScores.oversmooth <= THRESHOLDS.oversmooth_max &&
                  metrics.artifactScores.halo <= THRESHOLDS.halo_max,
    posePass: isPoseCompliant(metrics.poseAngles),
    compositionPass: isCompositionGood(metrics.eyeLinePercent, metrics.faceAreaPercent),
    overallPass: false // Will be calculated below
  };

  // Calculate MLS (Match-Likelihood Score)
  const mls = calculateMLS(metrics, gateResults);
  
  // Calculate CS (Compliance Score) 
  const cs = calculateCS(metrics, identitySimilarity, settings);
  
  // Overall pass check
  gateResults.overallPass = mls >= THRESHOLDS.mls_release_min && 
                           cs >= THRESHOLDS.cs_release_min &&
                           gateResults.identityPass;

  // Generate suggestions
  const suggestions = generateSuggestions(metrics, gateResults, mls, cs);
  
  // Determine if reshoot is required
  const reshootRequired = !gateResults.posePass || 
                         metrics.eyeLinePercent < 30 || 
                         metrics.faceAreaPercent < 8;

  return {
    mls,
    cs,
    gateResults,
    metrics: {
      ...metrics,
      identitySimilarity
    },
    suggestions,
    reshootRequired
  };
}

async function analyzePhotoMetrics(imageUrl: string) {
  // Simulate photo analysis - in real implementation use CV APIs
  await new Promise(resolve => setTimeout(resolve, 100));
  
  return {
    eyeLinePercent: Math.random() * 20 + 30, // 30-50%
    faceAreaPercent: Math.random() * 15 + 10, // 10-25%
    poseAngles: {
      yaw: (Math.random() - 0.5) * 30, // -15 to +15 degrees
      pitch: (Math.random() - 0.5) * 20, // -10 to +10 degrees  
      roll: (Math.random() - 0.5) * 6   // -3 to +3 degrees
    },
    artifactScores: {
      oversmooth: Math.random() * 0.1, // 0-0.1
      halo: Math.random() * 0.05,      // 0-0.05
      warp: Math.random() * 2          // 0-2%
    },
    safetyScores: {
      nsfw: 0,                         // Always 0 for safety
      suggestive: Math.random() * 0.1  // 0-0.1
    }
  };
}

async function compareIdentity(originalUrl: string, enhancedUrl: string): Promise<number> {
  // Simulate identity comparison - in real implementation use face recognition APIs
  await new Promise(resolve => setTimeout(resolve, 150));
  return Math.random() * 0.08 + 0.92; // 0.92-1.0
}

function isPoseCompliant(poseAngles: { yaw: number; pitch: number; roll: number }): boolean {
  const { yaw, pitch, roll } = poseAngles;
  
  // Check against front pose requirements (most common)
  return Math.abs(yaw) <= POSE_REQUIREMENTS.front.yaw_max &&
         Math.abs(pitch) <= POSE_REQUIREMENTS.front.pitch_max &&
         Math.abs(roll) <= POSE_REQUIREMENTS.front.roll_max;
}

function isCompositionGood(eyeLinePercent: number, faceAreaPercent: number): boolean {
  const eyeLineGood = eyeLinePercent >= POSE_REQUIREMENTS.front.eye_line_min && 
                     eyeLinePercent <= POSE_REQUIREMENTS.front.eye_line_max;
  const faceAreaGood = faceAreaPercent >= POSE_REQUIREMENTS.front.face_area_min && 
                      faceAreaPercent <= POSE_REQUIREMENTS.front.face_area_max;
  return eyeLineGood && faceAreaGood;
}

function calculateMLS(metrics: any, gateResults: any): number {
  // Match-Likelihood Score algorithm
  let score = 50; // Base score
  
  // Eye line contribution (20 points)
  if (metrics.eyeLinePercent >= 36 && metrics.eyeLinePercent <= 40) {
    score += 20;
  } else {
    score += Math.max(0, 20 - Math.abs(38 - metrics.eyeLinePercent) * 2);
  }
  
  // Face area contribution (15 points)
  if (metrics.faceAreaPercent >= 18 && metrics.faceAreaPercent <= 22) {
    score += 15;
  } else {
    score += Math.max(0, 15 - Math.abs(20 - metrics.faceAreaPercent));
  }
  
  // Pose contribution (10 points)
  if (gateResults.posePass) {
    score += 10;
  }
  
  // Artifact penalties
  score -= metrics.artifactScores.oversmooth * 50;
  score -= metrics.artifactScores.halo * 100;
  
  return Math.max(0, Math.min(100, score));
}

function calculateCS(metrics: any, identitySimilarity: number, settings?: any): number {
  // Compliance Score algorithm
  let score = 50; // Base score
  
  // Identity preservation (40 points)
  score += (identitySimilarity - 0.92) * 500; // Scale 0.92-1.0 to 0-40
  
  // Artifact compliance (30 points)
  if (metrics.artifactScores.oversmooth <= THRESHOLDS.oversmooth_max) score += 15;
  if (metrics.artifactScores.halo <= THRESHOLDS.halo_max) score += 15;
  
  // Safety compliance (20 points)
  if (metrics.safetyScores.nsfw <= THRESHOLDS.nsfw_max) score += 10;
  if (metrics.safetyScores.suggestive <= THRESHOLDS.suggestive_max) score += 10;
  
  return Math.max(0, Math.min(100, score));
}

function generateSuggestions(metrics: any, gateResults: any, mls: number, cs: number): string[] {
  const suggestions: string[] = [];
  
  if (mls < 72) {
    if (metrics.eyeLinePercent < 34) {
      suggestions.push("Move eyes higher in frame - aim for 38% from top");
    }
    if (metrics.faceAreaPercent < 15) {
      suggestions.push("Move closer to camera for better face prominence");
    }
    if (!gateResults.posePass) {
      suggestions.push("Adjust pose - face camera more directly");
    }
  }
  
  if (cs < 90) {
    if (metrics.identitySimilarity < 0.94) {
      suggestions.push("Reduce enhancement intensity to preserve natural appearance");
    }
    if (metrics.artifactScores.oversmooth > 0.10) {
      suggestions.push("Decrease skin smoothing to avoid artificial look");
    }
  }
  
  if (suggestions.length === 0) {
    suggestions.push("Photo meets all quality standards!");
  }
  
  return suggestions;
}