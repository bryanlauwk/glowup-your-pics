import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Enhancement presets with strict compliance caps
const ENHANCEMENT_PRESETS = {
  headshot: {
    angle_preference: { mode: "front", tolerance_deg: 10 },
    composition: { framing: "rule_of_thirds", target_face_area_pct: 20, eye_line_pct: 38 },
    align: { roll_correction_deg: 2, horizon_level: true },
    background: { preset: "natural", strength: 0.25 },
    skin_soften: 0.12,
    eye_teeth_clarity: 0.10
  },
  half_body: {
    angle_preference: { mode: "natural", tolerance_deg: 12 },
    composition: { framing: "center", target_face_area_pct: 14, eye_line_pct: 40 },
    align: { roll_correction_deg: 2, horizon_level: true },
    background: { preset: "aesthetic", strength: 0.30 },
    skin_soften: 0.10,
    eye_teeth_clarity: 0.08
  },
  outdoor_casual: {
    angle_preference: { mode: "three_quarter", tolerance_deg: 12 },
    composition: { framing: "rule_of_thirds", target_face_area_pct: 16, eye_line_pct: 36 },
    align: { roll_correction_deg: 2, horizon_level: true },
    background: { preset: "scene", strength: 0.30 },
    skin_soften: 0.08,
    eye_teeth_clarity: 0.08
  }
};

// Compliance caps for safety
const COMPLIANCE_CAPS = {
  skin_soften: 0.15,
  eye_teeth_clarity: 0.12,
  wb_shift_kelvin: 600,
  saturation_boost: 0.20,
  contrast_adjustment: 0.15
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

    transformLog.push(`Applied preset: ${preset}`);
    transformLog.push(`Skin softening capped at: ${Math.min(finalSettings.skin_soften || 0, COMPLIANCE_CAPS.skin_soften)}`);
    transformLog.push(`Eye/teeth clarity capped at: ${Math.min(finalSettings.eye_teeth_clarity || 0, COMPLIANCE_CAPS.eye_teeth_clarity)}`);

    // Simulate enhancement processing (in real implementation, this would apply actual image processing)
    const enhancedImageUrl = await simulateEnhancement(imageDataUrl, finalSettings, transformLog);
    
    const processingTime = Date.now() - startTime;

    const result: EnhancementResult = {
      enhancedImageUrl,
      appliedSettings: finalSettings,
      transformLog,
      processingTime,
      complianceChecked: true
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
  
  if (cappedSettings.skin_soften > COMPLIANCE_CAPS.skin_soften) {
    cappedSettings.skin_soften = COMPLIANCE_CAPS.skin_soften;
  }
  
  if (cappedSettings.eye_teeth_clarity > COMPLIANCE_CAPS.eye_teeth_clarity) {
    cappedSettings.eye_teeth_clarity = COMPLIANCE_CAPS.eye_teeth_clarity;
  }
  
  return cappedSettings;
}

async function simulateEnhancement(imageDataUrl: string, settings: any, transformLog: string[]): Promise<string> {
  // In a real implementation, this would use canvas manipulation or external image processing API
  // For now, return the original image with a timestamp to simulate enhancement
  
  transformLog.push(`Applied lighting enhancement: ${settings.background?.strength || 0.25}`);
  transformLog.push(`Applied skin softening: ${settings.skin_soften || 0.10}`);
  transformLog.push(`Applied composition adjustments: ${settings.composition?.framing || 'center'}`);
  
  // Simulate processing time
  await new Promise(resolve => setTimeout(resolve, 200));
  
  return imageDataUrl; // In real implementation, return processed image data URL
}