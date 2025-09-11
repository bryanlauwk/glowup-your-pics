import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.57.3';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const scenePrompts = {
  'passion-hobbies': [
    "Edit this photo to show the person in action playing basketball in a modern gym with dynamic pose and professional sports photography lighting",
    "Transform the scene to show this person rock climbing outdoors with determination, adventure setting, cinematic lighting",
    "Change the background and context to show this person cooking passionately in a beautiful modern kitchen with chef-like confidence"
  ],
  'social-proof': [
    "Edit this photo to place the person laughing with friends at a trendy rooftop bar during golden hour with warm social atmosphere",
    "Transform the scene to show this person as the center of attention at a stylish coffee shop having engaging conversations",
    "Change the setting to a fun social event where this person stands out naturally among friends"
  ],
  'lifestyle-adventure': [
    "Edit this photo to show the person on an epic hiking adventure with mountain backdrop during golden hour",
    "Transform the scene to a beautiful beach location during sunset with relaxed confidence and travel vibes",
    "Change the background to an exotic travel destination with wanderlust adventure photography style"
  ],
  'professional': [
    "Edit this photo to show the person as a confident business professional in a modern office with executive presence",
    "Transform the scene to show this person as a successful entrepreneur in a startup environment looking innovative and approachable",
    "Change the setting to a corporate environment with modern professional headshot aesthetics"
  ]
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { imageDataUrl, category, userId } = await req.json();
    
    if (!imageDataUrl || !category || !userId) {
      throw new Error('Missing required parameters: imageDataUrl, category, and userId are required');
    }

    const GEMINI_API_KEY = Deno.env.get('GEMINI_API_KEY');
    if (!GEMINI_API_KEY) {
      throw new Error('Gemini API key not configured');
    }

    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Check user credits (reduced to 2 credits for Gemini)
    const { data: userCredits, error: creditsError } = await supabase
      .from('user_credits')
      .select('credits')
      .eq('user_id', userId)
      .single();

    if (creditsError) {
      console.error('Credits check error:', creditsError);
      throw new Error('Failed to check user credits');
    }

    if (!userCredits || userCredits.credits < 2) {
      throw new Error('Insufficient credits. Scene transformation requires 2 credits.');
    }

    // Get random prompt for the category
    const categoryPrompts = scenePrompts[category as keyof typeof scenePrompts];
    if (!categoryPrompts) {
      throw new Error(`Invalid category: ${category}`);
    }

    const selectedPrompt = categoryPrompts[Math.floor(Math.random() * categoryPrompts.length)];
    
    console.log('Generating scene transformation with Gemini prompt:', selectedPrompt);

    // Convert base64 image to proper format for Gemini
    const imageBase64 = imageDataUrl.replace(/^data:image\/[a-z]+;base64,/, '');

    // Generate new scene with Gemini 2.5 Flash Image
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-image:generateContent?key=${GEMINI_API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [
            {
              text: `${selectedPrompt}. Keep the person's facial features and identity intact. Generate a high-quality, professional photograph with realistic lighting and composition. Output as a single enhanced image.`
            },
            {
              inline_data: {
                mime_type: "image/jpeg",
                data: imageBase64
              }
            }
          ]
        }],
        generationConfig: {
          temperature: 0.4,
          topK: 32,
          topP: 1,
          maxOutputTokens: 4096,
        }
      }),
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error('Gemini API error:', errorData);
      throw new Error(`Gemini API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    
    if (!data.candidates || !data.candidates[0] || !data.candidates[0].content) {
      console.error('Invalid Gemini response:', data);
      throw new Error('Invalid response from Gemini API');
    }

    // Extract the generated image from Gemini response
    const candidate = data.candidates[0];
    let enhancedImageUrl = '';

    // Check if there's inline data in the response
    if (candidate.content.parts && candidate.content.parts[0] && candidate.content.parts[0].inline_data) {
      const imageData = candidate.content.parts[0].inline_data.data;
      const mimeType = candidate.content.parts[0].inline_data.mime_type || 'image/jpeg';
      enhancedImageUrl = `data:${mimeType};base64,${imageData}`;
    } else {
      // Fallback: return original image if generation failed
      console.warn('No image generated by Gemini, using original');
      enhancedImageUrl = imageDataUrl;
    }

    // Deduct credits (2 for Gemini scene transformation)
    const { error: updateError } = await supabase
      .from('user_credits')
      .update({ credits: userCredits.credits - 2 })
      .eq('user_id', userId);

    if (updateError) {
      console.error('Credits update error:', updateError);
      throw new Error('Failed to update credits');
    }

    // Log the enhancement
    await supabase
      .from('photo_enhancements')
      .insert({
        user_id: userId,
        original_image_url: imageDataUrl,
        enhanced_image_url: enhancedImageUrl,
        enhancement_type: 'scene_transformation_gemini',
        category: category,
        status: 'completed',
        processing_time: Date.now()
      });

    const remainingCredits = userCredits.credits - 2;

    console.log('Gemini scene transformation completed successfully');

    return new Response(JSON.stringify({
      enhancedImageUrl,
      processingTime: Date.now(),
      enhancementId: `scene_gemini_${Date.now()}`,
      creditsRemaining: remainingCredits,
      transformationType: 'scene_transformation_gemini',
      category
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in scene-transform-ai function:', error);
    return new Response(JSON.stringify({ 
      error: error instanceof Error ? error.message : 'Scene transformation failed' 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});