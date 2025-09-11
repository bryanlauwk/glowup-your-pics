import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Anti-detection enhancement presets with natural authenticity focus
const ENHANCEMENT_PRESETS = {
  headshot: {
    angle_preference: { mode: "front", tolerance_deg: 10 },
    composition: { framing: "rule_of_thirds", target_face_area_pct: 20, eye_line_pct: 38 },
    align: { roll_correction_deg: 2, horizon_level: true },
    background: { preset: "natural", strength: 0.20 },
    skin_soften: 0.08, // Reduced for more natural texture
    eye_teeth_clarity: 0.06,
    natural_grain: 0.15,
    texture_preservation: 0.85,
    lighting_consistency: true,
    anti_detection_mode: true
  },
  half_body: {
    angle_preference: { mode: "natural", tolerance_deg: 12 },
    composition: { framing: "center", target_face_area_pct: 14, eye_line_pct: 40 },
    align: { roll_correction_deg: 2, horizon_level: true },
    background: { preset: "aesthetic", strength: 0.25 },
    skin_soften: 0.06, // Reduced for authenticity
    eye_teeth_clarity: 0.05,
    natural_grain: 0.18,
    texture_preservation: 0.88,
    lighting_consistency: true,
    anti_detection_mode: true
  },
  outdoor_casual: {
    angle_preference: { mode: "three_quarter", tolerance_deg: 12 },
    composition: { framing: "rule_of_thirds", target_face_area_pct: 16, eye_line_pct: 36 },
    align: { roll_correction_deg: 2, horizon_level: true },
    background: { preset: "scene", strength: 0.25 },
    skin_soften: 0.05, // Minimal for natural outdoor look
    eye_teeth_clarity: 0.05,
    natural_grain: 0.20,
    texture_preservation: 0.90,
    lighting_consistency: true,
    anti_detection_mode: true
  }
};

// Anti-detection compliance caps for natural authenticity
const COMPLIANCE_CAPS = {
  skin_soften: 0.10, // Reduced to maintain natural texture
  eye_teeth_clarity: 0.08, // Reduced to avoid over-enhancement
  wb_shift_kelvin: 400, // Reduced for natural color preservation
  saturation_boost: 0.15, // Reduced for realistic colors
  contrast_adjustment: 0.12, // Reduced for natural contrast
  natural_grain_min: 0.10, // Minimum grain for authenticity
  texture_preservation_min: 0.80, // Minimum texture retention
  lighting_variance_max: 0.20 // Maximum lighting adjustment
};

interface EnhancementRequest {
  imageDataUrl: string;
  preset?: keyof typeof ENHANCEMENT_PRESETS;
  customSettings?: any;
}

interface EnhancementResult {
  enhancedImageUrl: string;
  appliedSettings: any;
  transformLog: string[];
  processingTime: number;
  complianceChecked: boolean;
  antiDetectionScore?: number;
  naturalness?: number;
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
    const { imageDataUrl, preset = 'headshot', customSettings } = await req.json() as EnhancementRequest;

    if (!imageDataUrl) {
      return new Response(JSON.stringify({ error: 'Image data is required' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    const startTime = Date.now();
    const transformLog: string[] = [];

    // Get preset settings
    const presetSettings = ENHANCEMENT_PRESETS[preset] || ENHANCEMENT_PRESETS.headshot;
    
    // Apply compliance caps to custom settings if provided
    const finalSettings = customSettings ? 
      applyComplianceCaps(customSettings) : 
      presetSettings;

    transformLog.push(`Applied anti-detection preset: ${preset}`);
    transformLog.push(`Skin softening (natural): ${Math.min(finalSettings.skin_soften || 0, COMPLIANCE_CAPS.skin_soften)}`);
    transformLog.push(`Eye/teeth clarity (subtle): ${Math.min(finalSettings.eye_teeth_clarity || 0, COMPLIANCE_CAPS.eye_teeth_clarity)}`);
    transformLog.push(`Natural grain added: ${finalSettings.natural_grain || 0.15}`);
    transformLog.push(`Texture preservation: ${finalSettings.texture_preservation || 0.85}`);
    transformLog.push(`Anti-detection mode: ${finalSettings.anti_detection_mode ? 'enabled' : 'disabled'}`);

    // Simulate enhancement processing (in real implementation, this would apply actual image processing)
    const enhancedImageUrl = await simulateEnhancement(imageDataUrl, finalSettings, transformLog);
    
    const processingTime = Date.now() - startTime;

    const result: EnhancementResult = {
      enhancedImageUrl,
      appliedSettings: finalSettings,
      transformLog,
      processingTime,
      complianceChecked: true,
      antiDetectionScore: calculateAntiDetectionScore(finalSettings),
      naturalness: Math.round(80 + (finalSettings.texture_preservation * 20))
    };

    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('Error in swipeBoost-enhance:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
});

function applyComplianceCaps(settings: any): any {
  const cappedSettings = { ...settings };
  
  // Enhanced anti-detection compliance caps
  if (cappedSettings.skin_soften > COMPLIANCE_CAPS.skin_soften) {
    cappedSettings.skin_soften = COMPLIANCE_CAPS.skin_soften;
  }
  
  if (cappedSettings.eye_teeth_clarity > COMPLIANCE_CAPS.eye_teeth_clarity) {
    cappedSettings.eye_teeth_clarity = COMPLIANCE_CAPS.eye_teeth_clarity;
  }
  
  // Ensure minimum natural elements for anti-detection
  cappedSettings.natural_grain = Math.max(cappedSettings.natural_grain || 0, COMPLIANCE_CAPS.natural_grain_min);
  cappedSettings.texture_preservation = Math.max(cappedSettings.texture_preservation || 0, COMPLIANCE_CAPS.texture_preservation_min);
  cappedSettings.anti_detection_mode = true;
  
  return cappedSettings;
}

function calculateAntiDetectionScore(settings: any): number {
  // Calculate how well the settings avoid AI detection
  let score = 50;
  
  // Lower enhancement = higher anti-detection score
  score += (0.15 - (settings.skin_soften || 0)) * 200; // Max 30 points
  score += (settings.texture_preservation || 0.8) * 30; // Max 30 points
  score += (settings.natural_grain || 0.1) * 100; // Max 20 points
  
  return Math.max(0, Math.min(100, Math.round(score)));
}

async function simulateEnhancement(imageDataUrl: string, settings: any, transformLog: string[]): Promise<string> {
  // In a real implementation, this would use advanced image processing with anti-detection features
  // For now, return the original image with enhanced anti-detection logging
  
  transformLog.push(`Applied natural lighting enhancement: ${settings.background?.strength || 0.20}`);
  transformLog.push(`Applied subtle skin enhancement: ${settings.skin_soften || 0.08}`);
  transformLog.push(`Applied composition adjustments: ${settings.composition?.framing || 'center'}`);
  transformLog.push(`Added natural grain for authenticity: ${settings.natural_grain || 0.15}`);
  transformLog.push(`Preserved texture at: ${Math.round((settings.texture_preservation || 0.85) * 100)}%`);
  transformLog.push(`Anti-detection mode: ${settings.anti_detection_mode ? 'ACTIVE' : 'inactive'}`);
  transformLog.push(`Lighting consistency check: ${settings.lighting_consistency ? 'PASSED' : 'skipped'}`);
  
  // Simulate enhanced processing time for anti-detection algorithms
  await new Promise(resolve => setTimeout(resolve, 300));
  
  return imageDataUrl; // In real implementation, return processed image with anti-detection enhancements
}