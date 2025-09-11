import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.57.3';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const scenePrompts = {
  'passion-hobbies': [
    "Transform this person into an action shot playing basketball in a modern gym, dynamic pose, professional sports photography",
    "Show this person rock climbing with determination and skill, outdoor adventure, cinematic lighting",
    "Create a shot of this person cooking passionately in a beautiful modern kitchen, chef-like confidence"
  ],
  'social-proof': [
    "Place this person laughing with friends at a trendy rooftop bar, social gathering, warm evening light",
    "Show this person as the center of attention at a stylish coffee shop, engaging conversation with friends",
    "Create a fun group photo where this person stands out naturally at a social event"
  ],
  'lifestyle-adventure': [
    "Transform into an epic hiking photo with mountain backdrop, adventure explorer, golden hour lighting",
    "Show this person at a beautiful beach location during sunset, travel lifestyle, relaxed confidence",
    "Create a travel adventure shot in an exotic destination, wanderlust vibes, professional travel photography"
  ],
  'professional': [
    "Transform into a confident business professional in a modern office setting, executive presence",
    "Show this person as a successful entrepreneur in a startup environment, innovative and approachable",
    "Create a professional headshot in a corporate setting with modern aesthetics"
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

    const OPENAI_API_KEY = Deno.env.get('OPENAI_API_KEY');
    if (!OPENAI_API_KEY) {
      throw new Error('OpenAI API key not configured');
    }

    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Check user credits
    const { data: userCredits, error: creditsError } = await supabase
      .from('user_credits')
      .select('credits')
      .eq('user_id', userId)
      .single();

    if (creditsError) {
      console.error('Credits check error:', creditsError);
      throw new Error('Failed to check user credits');
    }

    if (!userCredits || userCredits.credits < 3) {
      throw new Error('Insufficient credits. Scene transformation requires 3 credits.');
    }

    // Get random prompt for the category
    const categoryPrompts = scenePrompts[category as keyof typeof scenePrompts];
    if (!categoryPrompts) {
      throw new Error(`Invalid category: ${category}`);
    }

    const selectedPrompt = categoryPrompts[Math.floor(Math.random() * categoryPrompts.length)];
    
    console.log('Generating scene transformation with prompt:', selectedPrompt);

    // Generate new scene with OpenAI
    const response = await fetch('https://api.openai.com/v1/images/generations', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-image-1',
        prompt: `${selectedPrompt}. Maintain the person's facial features and characteristics from the reference image. High quality, professional photography, realistic lighting and composition.`,
        n: 1,
        size: '1024x1024',
        quality: 'high',
        response_format: 'b64_json'
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('OpenAI API error:', errorData);
      throw new Error(`OpenAI API error: ${errorData.error?.message || 'Unknown error'}`);
    }

    const data = await response.json();
    const enhancedImageUrl = `data:image/png;base64,${data.data[0].b64_json}`;

    // Deduct credits (3 for scene transformation)
    const { error: updateError } = await supabase
      .from('user_credits')
      .update({ credits: userCredits.credits - 3 })
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
        enhancement_type: 'scene_transformation',
        category: category,
        status: 'completed',
        processing_time: Date.now()
      });

    const remainingCredits = userCredits.credits - 3;

    console.log('Scene transformation completed successfully');

    return new Response(JSON.stringify({
      enhancedImageUrl,
      processingTime: Date.now(),
      enhancementId: `scene_${Date.now()}`,
      creditsRemaining: remainingCredits,
      transformationType: 'scene_transformation',
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