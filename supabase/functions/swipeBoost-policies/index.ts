import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Current enhancement policies and numeric caps
const ENHANCEMENT_POLICIES = {
  version: "1.0.0",
  lastUpdated: "2024-01-15",
  allowedTransforms: [
    "lighting_adjustment",
    "skin_softening", 
    "eye_teeth_clarity",
    "background_cleanup",
    "composition_crop",
    "color_balance",
    "exposure_correction"
  ],
  disallowedTransforms: [
    "facial_structure_change",
    "body_modification", 
    "age_modification",
    "gender_modification",
    "race_modification",
    "fake_smile_overlay",
    "artificial_features"
  ],
  numericCaps: {
    skin_soften_max: 0.15,
    eye_teeth_clarity_max: 0.12,
    wb_shift_kelvin_max: 600,
    saturation_boost_max: 0.20,
    contrast_adjustment_max: 0.15,
    brightness_adjustment_max: 0.10,
    background_blur_max: 0.40,
    noise_reduction_max: 0.25
  },
  complianceThresholds: {
    identity_cosine_min: 0.92,
    age_delta_max_years: 3,
    pose_delta_max_degrees: 15,
    skin_tone_delta_max_percent: 5,
    oversmooth_artifact_max: 0.15,
    halo_artifact_max: 0.10,
    warp_artifact_max: 3,
    seam_artifact_max: 0.08,
    nsfw_content_max: 0.00,
    suggestive_content_max: 0.15
  },
  releaseGates: {
    mls_minimum: 72,
    cs_minimum: 90,
    identity_preservation_required: true,
    artifact_check_required: true,
    safety_check_required: true
  },
  poseRequirements: {
    front: {
      yaw_max_degrees: 12,
      pitch_max_degrees: 10, 
      roll_max_degrees: 2,
      eye_line_min_percent: 34,
      eye_line_max_percent: 42,
      face_area_min_percent: 15,
      face_area_max_percent: 25
    },
    three_quarter: {
      yaw_target_degrees: 25,
      yaw_tolerance_degrees: 10,
      pitch_max_degrees: 15,
      roll_max_degrees: 3,
      eye_line_min_percent: 32,
      eye_line_max_percent: 44,
      face_area_min_percent: 12,
      face_area_max_percent: 28
    },
    side_profile: {
      yaw_min_degrees: 70,
      eye_visibility_min_percent: 50,
      reshoot_recommended: true
    }
  },
  compositionGuidelines: {
    rule_of_thirds: {
      intersection_tolerance_percent: 6,
      preferred_quadrants: ["upper_left", "upper_right"]
    },
    eye_line_positioning: {
      optimal_percent: 38,
      acceptable_range: [34, 42]
    },
    face_area_targets: {
      headshot_percent: [18, 25],
      half_body_percent: [12, 18], 
      full_body_percent: [8, 12]
    }
  }
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  if (req.method !== 'GET') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }

  try {
    // Return current enhancement policies
    return new Response(JSON.stringify({
      success: true,
      policies: ENHANCEMENT_POLICIES
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('Error in swipeBoost-policies:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
});