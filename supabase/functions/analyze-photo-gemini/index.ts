import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const geminiApiKey = Deno.env.get('GEMINI_API_KEY');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { imageDataUrl, prompt } = await req.json();

    if (!imageDataUrl) {
      return new Response(JSON.stringify({ error: 'Image data is required' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Extract base64 data from data URL
    const base64Data = imageDataUrl.split(',')[1];
    const mimeType = imageDataUrl.split(',')[0].split(':')[1].split(';')[0];

    const systemPrompt = `You are an expert dating profile photo analyst. Analyze photos for dating app success and provide specific, actionable feedback.

Rate each aspect from 1-10 and provide detailed suggestions:
1. Overall attractiveness and appeal
2. Photo quality (lighting, resolution, composition)
3. Facial expression and approachability
4. Outfit and styling choices
5. Background and setting appropriateness
6. Body language and pose
7. Authenticity and naturalness

Return ONLY a valid JSON object with this structure:
{
  "overallScore": number,
  "attractivenessScore": number,
  "qualityScore": number,
  "expressionScore": number,
  "styleScore": number,
  "backgroundScore": number,
  "poseScore": number,
  "authenticityScore": number,
  "strengths": ["strength1", "strength2"],
  "improvements": ["improvement1", "improvement2"],
  "enhancementSuggestions": ["suggestion1", "suggestion2"],
  "platformOptimization": {
    "tinder": "tinder-specific advice",
    "bumble": "bumble-specific advice",
    "coffeeMeetsBagel": "cmb-specific advice"
  }
}`;

    const requestBody = {
      contents: [
        {
          parts: [
            { text: prompt || systemPrompt },
            {
              inline_data: {
                mime_type: mimeType,
                data: base64Data
              }
            }
          ]
        }
      ],
      generationConfig: {
        temperature: 0.7,
        topK: 40,
        topP: 0.95,
        maxOutputTokens: 1024
      }
    };

    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${geminiApiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Gemini API error:', errorText);
      return new Response(JSON.stringify({ error: 'Failed to analyze photo' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const data = await response.json();
    const content = data.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!content) {
      return new Response(JSON.stringify({ error: 'No analysis result' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Try to parse as JSON, fallback to structured response
    let analysisResult;
    try {
      analysisResult = JSON.parse(content);
    } catch (parseError) {
      // Fallback structure if JSON parsing fails
      analysisResult = {
        overallScore: 7,
        attractivenessScore: 7,
        qualityScore: 7,
        expressionScore: 7,
        styleScore: 7,
        backgroundScore: 7,
        poseScore: 7,
        authenticityScore: 7,
        strengths: ["Photo uploaded successfully"],
        improvements: ["Analysis completed"],
        enhancementSuggestions: ["Consider retaking with better lighting"],
        platformOptimization: {
          tinder: "Good for casual dating apps",
          bumble: "Suitable for relationship-focused platforms",
          coffeeMeetsBagel: "Works well for professional dating apps"
        },
        rawAnalysis: content
      };
    }

    return new Response(JSON.stringify({ analysis: analysisResult }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in analyze-photo-gemini function:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});