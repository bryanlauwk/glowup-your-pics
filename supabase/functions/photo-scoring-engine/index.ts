import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.57.3';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

export interface DetailedPhotoScore {
  // Overall Scores
  overallAttractiveness: number; // 0-100
  swipeRightPotential: number; // 0-100
  datingAppOptimization: number; // 0-100
  
  // Technical Quality
  imageQuality: {
    resolution: number;
    lighting: number;
    clarity: number;
    composition: number;
    colorBalance: number;
  };
  
  // Person Analysis
  personMetrics: {
    facialAttractiveness: number;
    eyeContact: number;
    smileQuality: number;
    confidence: number;
    approachability: number;
    physicalAppeal: number;
  };
  
  // Dating Context
  datingFactors: {
    firstImpressionImpact: number;
    profileWorthiness: number;
    conversationStarter: number;
    lifestyleAppeal: number;
    socialProof: number;
  };
  
  // Category Fit
  categoryAlignment: {
    [key: string]: number; // Each category score 0-100
  };
  
  // Improvement Suggestions
  suggestions: {
    priority: 'high' | 'medium' | 'low';
    category: string;
    improvement: string;
    expectedImpact: number;
  }[];
  
  // Processing Recommendation
  recommendedLevel: 1 | 2; // 1: Enhancement, 2: Transformation
  confidenceScore: number;
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

    const GEMINI_API_KEY = Deno.env.get('GEMINI_API_KEY');
    if (!GEMINI_API_KEY) {
      throw new Error('Gemini API key not configured');
    }

    // Advanced dating-focused scoring prompt
    const scoringPrompt = `
    Analyze this photo for dating app optimization and provide detailed scoring. You are an expert dating coach and photo analyst.

    Evaluate these key areas for maximum swipe-right potential:

    1. OVERALL ATTRACTIVENESS (0-100): How attractive is this person in this photo?
    2. SWIPE RIGHT POTENTIAL (0-100): Likelihood this photo gets right swipes
    3. DATING APP OPTIMIZATION (0-100): How well optimized for dating apps

    4. IMAGE QUALITY:
       - Resolution/sharpness (0-100)
       - Lighting quality (0-100) 
       - Clarity/focus (0-100)
       - Composition/framing (0-100)
       - Color balance (0-100)

    5. PERSON METRICS:
       - Facial attractiveness (0-100)
       - Eye contact/engagement (0-100)
       - Smile quality (0-100)
       - Confidence level (0-100)
       - Approachability (0-100)
       - Physical appeal (0-100)

    6. DATING FACTORS:
       - First impression impact (0-100)
       - Profile worthiness (0-100)
       - Conversation starter potential (0-100)
       - Lifestyle appeal (0-100)
       - Social proof level (0-100)

    7. CATEGORY ALIGNMENT for "${targetCategory}":
       - Hook (first impression): score 0-100
       - Passion/hobbies: score 0-100
       - Professional: score 0-100
       - Adventure/travel: score 0-100
       - Social proof: score 0-100
       - Custom: score 0-100

    8. TOP 3 IMPROVEMENT SUGGESTIONS:
       - Priority level (high/medium/low)
       - Category of improvement
       - Specific improvement needed
       - Expected impact score (0-100)

    9. PROCESSING RECOMMENDATION:
       - Level 1 (enhancement) if overall score > 70
       - Level 2 (transformation) if overall score ≤ 70
       - Confidence in recommendation (0-100)

    Return ONLY valid JSON in this exact format:
    {
      "overallAttractiveness": number,
      "swipeRightPotential": number, 
      "datingAppOptimization": number,
      "imageQuality": {
        "resolution": number,
        "lighting": number,
        "clarity": number,
        "composition": number,
        "colorBalance": number
      },
      "personMetrics": {
        "facialAttractiveness": number,
        "eyeContact": number,
        "smileQuality": number,
        "confidence": number,
        "approachability": number,
        "physicalAppeal": number
      },
      "datingFactors": {
        "firstImpressionImpact": number,
        "profileWorthiness": number,
        "conversationStarter": number,
        "lifestyleAppeal": number,
        "socialProof": number
      },
      "categoryAlignment": {
        "hook": number,
        "passion-hobbies": number,
        "professional": number,
        "adventure-travel": number,
        "social-proof": number,
        "custom": number
      },
      "suggestions": [
        {
          "priority": "high|medium|low",
          "category": "string",
          "improvement": "string", 
          "expectedImpact": number
        }
      ],
      "recommendedLevel": 1|2,
      "confidenceScore": number
    }`;

    // Convert base64 image for Gemini
    const imageBase64 = imageDataUrl.replace(/^data:image\/[a-z]+;base64,/, '');

    console.log('Starting advanced photo scoring analysis...');

    // Call Gemini for detailed analysis
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-image-preview:generateContent?key=${GEMINI_API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [
            { text: scoringPrompt },
            {
              inline_data: {
                mime_type: "image/jpeg",
                data: imageBase64
              }
            }
          ]
        }],
        generationConfig: {
          temperature: 0.1, // Very low for consistent scoring
          topK: 1,
          topP: 0.1,
          maxOutputTokens: 2048,
        }
      }),
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error('Gemini API error:', errorData);
      throw new Error(`Gemini API error: ${response.status}`);
    }

    const data = await response.json();
    
    if (!data.candidates?.[0]?.content?.parts?.[0]?.text) {
      throw new Error('Invalid Gemini response format');
    }

    const responseText = data.candidates[0].content.parts[0].text;
    console.log('Raw Gemini response:', responseText);

    // Parse the JSON response
    let photoScore: DetailedPhotoScore;
    try {
      // Extract JSON from response (might have markdown formatting)
      const jsonMatch = responseText.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new Error('No JSON found in response');
      }
      
      photoScore = JSON.parse(jsonMatch[0]);
      
      // Validate and clamp all scores to 0-100 range
      photoScore = validateAndClampScores(photoScore);
      
    } catch (parseError) {
      console.error('JSON parsing failed:', parseError);
      // Return fallback scoring
      photoScore = createFallbackScore(targetCategory);
    }

    console.log('Photo scoring completed successfully');

    return new Response(JSON.stringify({
      score: photoScore,
      processingTime: Date.now(),
      analysisType: 'dating_optimized_scoring'
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in photo scoring engine:', error);
    return new Response(JSON.stringify({ 
      error: error instanceof Error ? error.message : 'Photo scoring failed' 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});

function validateAndClampScores(score: any): DetailedPhotoScore {
  const clamp = (val: number) => Math.max(0, Math.min(100, val || 0));
  
  return {
    overallAttractiveness: clamp(score.overallAttractiveness),
    swipeRightPotential: clamp(score.swipeRightPotential),
    datingAppOptimization: clamp(score.datingAppOptimization),
    imageQuality: {
      resolution: clamp(score.imageQuality?.resolution),
      lighting: clamp(score.imageQuality?.lighting),
      clarity: clamp(score.imageQuality?.clarity),
      composition: clamp(score.imageQuality?.composition),
      colorBalance: clamp(score.imageQuality?.colorBalance),
    },
    personMetrics: {
      facialAttractiveness: clamp(score.personMetrics?.facialAttractiveness),
      eyeContact: clamp(score.personMetrics?.eyeContact),
      smileQuality: clamp(score.personMetrics?.smileQuality),
      confidence: clamp(score.personMetrics?.confidence),
      approachability: clamp(score.personMetrics?.approachability),
      physicalAppeal: clamp(score.personMetrics?.physicalAppeal),
    },
    datingFactors: {
      firstImpressionImpact: clamp(score.datingFactors?.firstImpressionImpact),
      profileWorthiness: clamp(score.datingFactors?.profileWorthiness),
      conversationStarter: clamp(score.datingFactors?.conversationStarter),
      lifestyleAppeal: clamp(score.datingFactors?.lifestyleAppeal),
      socialProof: clamp(score.datingFactors?.socialProof),
    },
    categoryAlignment: {
      'hook': clamp(score.categoryAlignment?.hook),
      'passion-hobbies': clamp(score.categoryAlignment?.['passion-hobbies']),
      'professional': clamp(score.categoryAlignment?.professional),
      'adventure-travel': clamp(score.categoryAlignment?.['adventure-travel']),
      'social-proof': clamp(score.categoryAlignment?.['social-proof']),
      'custom': clamp(score.categoryAlignment?.custom),
    },
    suggestions: Array.isArray(score.suggestions) ? score.suggestions.slice(0, 3) : [],
    recommendedLevel: (score.recommendedLevel === 1 || score.recommendedLevel === 2) ? score.recommendedLevel : 2,
    confidenceScore: clamp(score.confidenceScore),
  };
}

function createFallbackScore(targetCategory: string): DetailedPhotoScore {
  return {
    overallAttractiveness: 65,
    swipeRightPotential: 60,
    datingAppOptimization: 55,
    imageQuality: {
      resolution: 70,
      lighting: 60,
      clarity: 65,
      composition: 60,
      colorBalance: 65,
    },
    personMetrics: {
      facialAttractiveness: 70,
      eyeContact: 60,
      smileQuality: 65,
      confidence: 60,
      approachability: 70,
      physicalAppeal: 65,
    },
    datingFactors: {
      firstImpressionImpact: 55,
      profileWorthiness: 60,
      conversationStarter: 50,
      lifestyleAppeal: 55,
      socialProof: 45,
    },
    categoryAlignment: {
      'hook': targetCategory === 'hook' ? 80 : 50,
      'passion-hobbies': targetCategory === 'passion-hobbies' ? 80 : 50,
      'professional': targetCategory === 'professional' ? 80 : 50,
      'adventure-travel': targetCategory === 'adventure-travel' ? 80 : 50,
      'social-proof': targetCategory === 'social-proof' ? 80 : 50,
      'custom': targetCategory === 'custom' ? 80 : 50,
    },
    suggestions: [
      {
        priority: 'high' as const,
        category: 'lighting',
        improvement: 'Improve lighting and brightness',
        expectedImpact: 25
      }
    ],
    recommendedLevel: 2,
    confidenceScore: 75,
  };
}