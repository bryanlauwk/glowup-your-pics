import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface PhotoQualityMetrics {
  overallScore: number;
  composition: number;
  lighting: number;
  clarity: number;
  contextMatch: number;
  pose: number;
  backgroundQuality: number;
}

interface PhotoContext {
  detectedObjects: string[];
  setting: 'indoor' | 'outdoor' | 'studio' | 'mixed';
  bodyShot: 'headshot' | 'half-body' | 'full-body' | 'group';
  emotion: 'confident' | 'casual' | 'professional' | 'adventurous' | 'neutral';
  clothingStyle: string[];
  backgroundType: string;
}

interface PhotoAssessment {
  quality: PhotoQualityMetrics;
  context: PhotoContext;
  categoryFit: { [key: string]: number };
  recommendedLevel: 1 | 2;
  confidenceScore: number;
  suggestions: string[];
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { imageDataUrl, targetCategory, userId } = await req.json();

    if (!imageDataUrl || !targetCategory || !userId) {
      throw new Error('Missing required parameters');
    }

    const geminiApiKey = Deno.env.get('GEMINI_API_KEY');
    if (!geminiApiKey) {
      throw new Error('Gemini API key not configured');
    }

    console.log('Starting photo intelligence analysis for category:', targetCategory);

    // Prepare the analysis prompt
    const analysisPrompt = `Analyze this photo for dating profile optimization. Target category: "${targetCategory}"

Please assess the photo and return a JSON response with this exact structure:

{
  "quality": {
    "overallScore": number (0-100),
    "composition": number (0-100),
    "lighting": number (0-100), 
    "clarity": number (0-100),
    "contextMatch": number (0-100),
    "pose": number (0-100),
    "backgroundQuality": number (0-100)
  },
  "context": {
    "detectedObjects": ["object1", "object2"],
    "setting": "indoor|outdoor|studio|mixed",
    "bodyShot": "headshot|half-body|full-body|group",
    "emotion": "confident|casual|professional|adventurous|neutral",
    "clothingStyle": ["style1", "style2"],
    "backgroundType": "description"
  },
  "categoryFit": {
    "hook": number (0-100),
    "passion-hobbies": number (0-100),
    "professional": number (0-100),
    "adventure-travel": number (0-100),
    "social-proof": number (0-100),
    "custom": number (0-100)
  },
  "recommendedLevel": 1 or 2,
  "confidenceScore": number (0-100),
  "suggestions": ["suggestion1", "suggestion2", "suggestion3"]
}

Analysis Guidelines:
- Level 1 (Enhancement): For photos with 70+ overall score that match the target category well
- Level 2 (Transformation): For photos with <70 score OR poor category fit (<60) that need scene/context changes
- Consider if the photo setting matches the intended category (e.g., office photo for adventure category = poor fit)
- Factor in body shot appropriateness (e.g., headshot for adventure category might need full-body transformation)

Provide honest, actionable feedback for dating profile optimization.`;

    // Convert base64 to binary for Gemini API
    const base64Data = imageDataUrl.split(',')[1];
    
    // Call Gemini Vision API
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent?key=${geminiApiKey}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                { text: analysisPrompt },
                {
                  inlineData: {
                    mimeType: 'image/jpeg',
                    data: base64Data
                  }
                }
              ]
            }
          ],
          generationConfig: {
            temperature: 0.1,
            maxOutputTokens: 2048
          }
        })
      }
    );

    if (!response.ok) {
      const errorData = await response.text();
      console.error('Gemini API error:', errorData);
      throw new Error(`Gemini API error: ${response.status}`);
    }

    const geminiResult = await response.json();
    
    if (!geminiResult.candidates?.[0]?.content?.parts?.[0]?.text) {
      throw new Error('Invalid response from Gemini API');
    }

    const analysisText = geminiResult.candidates[0].content.parts[0].text;
    console.log('Raw Gemini analysis:', analysisText);

    // Parse JSON from response
    let assessment: PhotoAssessment;
    try {
      // Extract JSON from markdown code blocks if present
      const jsonMatch = analysisText.match(/```json\n([\s\S]*?)\n```/) || 
                       analysisText.match(/```\n([\s\S]*?)\n```/) ||
                       [null, analysisText];
      
      assessment = JSON.parse(jsonMatch[1] || analysisText);
    } catch (parseError) {
      console.error('Failed to parse Gemini response as JSON:', parseError);
      
      // Fallback assessment if parsing fails
      assessment = createFallbackAssessment(targetCategory);
    }

    // Validate and sanitize assessment
    assessment = validateAssessment(assessment, targetCategory);

    console.log('Final photo assessment:', {
      overallScore: assessment.quality.overallScore,
      recommendedLevel: assessment.recommendedLevel,
      targetCategoryFit: assessment.categoryFit[targetCategory]
    });

    return new Response(JSON.stringify(assessment), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Photo intelligence analysis error:', error);
    return new Response(
      JSON.stringify({ 
        error: 'Analysis failed',
        details: error.message 
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});

function createFallbackAssessment(targetCategory: string): PhotoAssessment {
  return {
    quality: {
      overallScore: 50,
      composition: 50,
      lighting: 50,
      clarity: 50,
      contextMatch: 50,
      pose: 50,
      backgroundQuality: 50
    },
    context: {
      detectedObjects: ['person'],
      setting: 'mixed',
      bodyShot: 'half-body',
      emotion: 'neutral',
      clothingStyle: ['casual'],
      backgroundType: 'unclear'
    },
    categoryFit: {
      'hook': 50,
      'passion-hobbies': 50,
      'professional': 50,
      'adventure-travel': 50,
      'social-proof': 50,
      'custom': 50
    },
    recommendedLevel: 2, // Default to transformation when uncertain
    confidenceScore: 30,
    suggestions: [
      'Photo analysis was inconclusive',
      'Consider retaking with better lighting',
      'Ensure clear subject visibility'
    ]
  };
}

function validateAssessment(assessment: PhotoAssessment, targetCategory: string): PhotoAssessment {
  // Ensure all scores are between 0-100
  const clampScore = (score: number) => Math.max(0, Math.min(100, score || 50));
  
  // Validate quality metrics
  assessment.quality = {
    overallScore: clampScore(assessment.quality?.overallScore),
    composition: clampScore(assessment.quality?.composition),
    lighting: clampScore(assessment.quality?.lighting),
    clarity: clampScore(assessment.quality?.clarity),
    contextMatch: clampScore(assessment.quality?.contextMatch),
    pose: clampScore(assessment.quality?.pose),
    backgroundQuality: clampScore(assessment.quality?.backgroundQuality)
  };

  // Validate category fit scores
  const categories = ['hook', 'passion-hobbies', 'professional', 'adventure-travel', 'social-proof', 'custom'];
  assessment.categoryFit = assessment.categoryFit || {};
  categories.forEach(category => {
    assessment.categoryFit[category] = clampScore(assessment.categoryFit[category]);
  });

  // Validate recommended level (1 or 2)
  if (![1, 2].includes(assessment.recommendedLevel)) {
    // Auto-determine based on scores
    const targetFit = assessment.categoryFit[targetCategory] || 50;
    assessment.recommendedLevel = (assessment.quality.overallScore >= 70 && targetFit >= 60) ? 1 : 2;
  }

  // Validate confidence score
  assessment.confidenceScore = clampScore(assessment.confidenceScore);

  // Ensure suggestions array exists
  assessment.suggestions = assessment.suggestions || ['Analysis completed'];

  return assessment;
}