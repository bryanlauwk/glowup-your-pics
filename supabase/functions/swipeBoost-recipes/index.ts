import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Recipe suggestions for common failure scenarios
const FAILURE_RECIPES = {
  low_mls: {
    eye_line_too_low: {
      issue: "Eyes positioned below 34% from top",
      recipe: {
        composition: { 
          framing: "rule_of_thirds",
          target_eye_line_pct: 38,
          crop_adjustment: "raise_subject"
        },
        message: "Crop tighter and position eyes at 38% from top"
      }
    },
    face_area_too_small: {
      issue: "Face occupies less than 15% of frame", 
      recipe: {
        composition: {
          framing: "center",
          target_face_area_pct: 20,
          crop_adjustment: "zoom_closer"
        },
        message: "Move closer to camera or crop tighter for better face prominence"
      }
    },
    poor_pose: {
      issue: "Pose angles outside acceptable range",
      recipe: {
        angle_preference: { mode: "front", tolerance_deg: 8 },
        reshoot_guidance: true,
        message: "Face camera more directly - keep head level and look straight ahead"
      }
    },
    lighting_issues: {
      issue: "Poor lighting affecting attractiveness",
      recipe: {
        lighting: {
          exposure_correction: 0.08,
          shadow_lift: 0.12,
          highlight_recovery: 0.10
        },
        message: "Improve lighting - face a window or use softer light source"
      }
    }
  },
  low_cs: {
    identity_drift: {
      issue: "Enhanced image doesn't preserve identity well",
      recipe: {
        skin_soften: 0.08,
        eye_teeth_clarity: 0.06,
        background: { strength: 0.15 },
        message: "Reduce enhancement intensity to preserve natural appearance"
      }
    },
    oversmoothing: {
      issue: "Skin appears artificially smooth",
      recipe: {
        skin_soften: 0.05,
        texture_preservation: 0.80,
        message: "Decrease skin smoothing to maintain natural skin texture"
      }
    },
    halo_artifacts: {
      issue: "Visible halos around subject edges",
      recipe: {
        background: { strength: 0.20, feather_edges: true },
        edge_refinement: true,
        message: "Reduce background processing intensity and improve edge blending"
      }
    }
  }
};

// Preset recommendations based on photo context
const CONTEXT_RECIPES = {
  indoor_portrait: {
    preset: "headshot",
    modifications: {
      lighting: { warm_boost: 0.05, shadow_lift: 0.15 },
      background: { preset: "natural", strength: 0.25 }
    }
  },
  outdoor_casual: {
    preset: "outdoor_casual", 
    modifications: {
      lighting: { exposure_balance: true },
      background: { preset: "scene", strength: 0.30 }
    }
  },
  gym_fitness: {
    preset: "half_body",
    modifications: {
      skin_soften: 0.06,
      background: { preset: "aesthetic", strength: 0.35 },
      composition: { target_face_area_pct: 16 }
    }
  },
  professional: {
    preset: "headshot",
    modifications: {
      skin_soften: 0.10,
      eye_teeth_clarity: 0.08,
      background: { preset: "clean", strength: 0.40 }
    }
  }
};

interface RecipeRequest {
  failureType?: 'low_mls' | 'low_cs';
  specificIssues?: string[];
  currentMLS?: number;
  currentCS?: number;
  photoContext?: keyof typeof CONTEXT_RECIPES;
  metrics?: {
    eyeLinePercent?: number;
    faceAreaPercent?: number;
    poseAngles?: { yaw: number; pitch: number; roll: number };
    identitySimilarity?: number;
  };
}

interface RecipeResponse {
  suggestedRecipe: any;
  explanation: string;
  expectedImprovements: string[];
  reshootRequired: boolean;
  alternativeApproaches?: any[];
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
    const request = await req.json() as RecipeRequest;
    
    const recipe = generateRecipeSuggestion(request);

    return new Response(JSON.stringify({
      success: true,
      ...recipe
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('Error in swipeBoost-recipes:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
});

function generateRecipeSuggestion(request: RecipeRequest): RecipeResponse {
  const { failureType, specificIssues, currentMLS, currentCS, photoContext, metrics } = request;

  // Determine primary issue
  let primaryRecipe: any;
  let explanation: string;
  let expectedImprovements: string[] = [];
  let reshootRequired = false;

  if (failureType === 'low_mls' && currentMLS && currentMLS < 72) {
    // Handle MLS failures
    if (metrics?.eyeLinePercent && metrics.eyeLinePercent < 34) {
      primaryRecipe = FAILURE_RECIPES.low_mls.eye_line_too_low.recipe;
      explanation = FAILURE_RECIPES.low_mls.eye_line_too_low.message;
      expectedImprovements.push(`Eye line improvement: ${34 - metrics.eyeLinePercent}% higher positioning`);
    } else if (metrics?.faceAreaPercent && metrics.faceAreaPercent < 15) {
      primaryRecipe = FAILURE_RECIPES.low_mls.face_area_too_small.recipe;
      explanation = FAILURE_RECIPES.low_mls.face_area_too_small.message;
      expectedImprovements.push(`Face area improvement: increase to ${20 - metrics.faceAreaPercent}% larger`);
    } else if (metrics?.poseAngles && (Math.abs(metrics.poseAngles.yaw) > 12 || Math.abs(metrics.poseAngles.pitch) > 10)) {
      primaryRecipe = FAILURE_RECIPES.low_mls.poor_pose.recipe;
      explanation = FAILURE_RECIPES.low_mls.poor_pose.message;
      reshootRequired = true;
      expectedImprovements.push("Pose correction for better dating app performance");
    } else {
      primaryRecipe = FAILURE_RECIPES.low_mls.lighting_issues.recipe;
      explanation = FAILURE_RECIPES.low_mls.lighting_issues.message;
      expectedImprovements.push("Lighting enhancement for better visual appeal");
    }
  } else if (failureType === 'low_cs' && currentCS && currentCS < 90) {
    // Handle CS failures
    if (metrics?.identitySimilarity && metrics.identitySimilarity < 0.94) {
      primaryRecipe = FAILURE_RECIPES.low_cs.identity_drift.recipe;
      explanation = FAILURE_RECIPES.low_cs.identity_drift.message;
      expectedImprovements.push("Identity preservation improvement");
    } else if (specificIssues?.includes('oversmoothing')) {
      primaryRecipe = FAILURE_RECIPES.low_cs.oversmoothing.recipe;
      explanation = FAILURE_RECIPES.low_cs.oversmoothing.message;
      expectedImprovements.push("Natural texture preservation");
    } else {
      primaryRecipe = FAILURE_RECIPES.low_cs.halo_artifacts.recipe;
      explanation = FAILURE_RECIPES.low_cs.halo_artifacts.message;
      expectedImprovements.push("Artifact reduction for cleaner result");
    }
  } else if (photoContext && CONTEXT_RECIPES[photoContext]) {
    // Provide context-based recipe
    const contextRecipe = CONTEXT_RECIPES[photoContext];
    primaryRecipe = contextRecipe;
    explanation = `Optimized settings for ${photoContext.replace('_', ' ')} photography`;
    expectedImprovements.push("Context-optimized enhancement settings");
  } else {
    // Default improvement recipe
    primaryRecipe = {
      preset: "headshot",
      lighting: { exposure_correction: 0.05 },
      composition: { framing: "rule_of_thirds", target_eye_line_pct: 38 }
    };
    explanation = "General enhancement for dating app optimization";
    expectedImprovements.push("Overall photo quality improvement");
  }

  // Generate alternative approaches
  const alternativeApproaches = generateAlternatives(request, primaryRecipe);

  return {
    suggestedRecipe: primaryRecipe,
    explanation,
    expectedImprovements,
    reshootRequired,
    alternativeApproaches
  };
}

function generateAlternatives(request: RecipeRequest, primaryRecipe: any): any[] {
  const alternatives: any[] = [];

  // Conservative approach
  alternatives.push({
    name: "Conservative Enhancement",
    recipe: {
      ...primaryRecipe,
      skin_soften: Math.min(primaryRecipe.skin_soften || 0.10, 0.08),
      eye_teeth_clarity: Math.min(primaryRecipe.eye_teeth_clarity || 0.08, 0.06)
    },
    description: "Minimal changes for natural look"
  });

  // Aggressive approach (within limits)
  alternatives.push({
    name: "Maximum Enhancement",
    recipe: {
      ...primaryRecipe,
      skin_soften: Math.min(primaryRecipe.skin_soften || 0.10, 0.15),
      eye_teeth_clarity: Math.min(primaryRecipe.eye_teeth_clarity || 0.08, 0.12)
    },
    description: "Maximum allowed enhancement while staying compliant"
  });

  return alternatives;
}