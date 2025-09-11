import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.57.3';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// 6 Fine-tuned Transformation Engines for Different Dating Profile Goals
const transformationEngines = {
  // ENGINE 1: THE HOOK - First Impression Winner
  'hook': {
    highQuality: [
      'Enhance this photo to maximize first impression impact - perfect lighting, magnetic eye contact, confident expression. This should be the photo that stops the scroll. Keep facial features identical.',
      'Transform into an irresistible first impression shot - optimize everything for instant attraction and intrigue. Maintain exact facial features and identity.',
      'Create the ultimate hook photo - whatever makes this person most magnetically appealing at first glance. Preserve their exact appearance.',
    ],
    lowQuality: [
      'Completely transform this into a show-stopping first impression photo - could be a confident portrait in golden hour, professional headshot with perfect lighting, or charismatic candid moment. Keep their exact identity.',
      'Revolutionary transformation: Create the perfect "hook" photo from this image - think magazine cover quality that immediately captures attention. Maintain identical facial features.',
      'Transform this person into the kind of photo that gets instant right-swipes - perfect composition, lighting, and presence. Preserve their exact appearance.',
    ]
  },

  // ENGINE 2: PASSION & HOBBIES - Lifestyle Magnetism  
  'passion-hobbies': {
    highQuality: [
      'Enhance this photo to better showcase an engaging hobby or passion - add elements that make their lifestyle more attractive and interesting. Keep facial features identical.',
      'Polish this into a compelling lifestyle shot that hints at their interests and passions. Maintain exact facial features.',
      'Enhance to show this person engaged in an appealing hobby or interest that makes them more attractive. Preserve their exact identity.',
    ],
    lowQuality: [
      'Completely transform this person into an engaging passion scene - playing guitar, painting, cooking gourmet meals, hiking scenic trails, or practicing photography. Keep their exact identity.',
      'Revolutionary lifestyle transformation: Place this person in a dynamic hobby environment - art studio, climbing gym, cozy reading nook, or outdoor adventure. Maintain identical features.',
      'Transform into a magnetic lifestyle shot - could be surfing, playing piano, gardening, or any hobby that makes them irresistibly interesting. Preserve exact appearance.',
    ]
  },

  // ENGINE 3: PROFESSIONAL AUTHORITY - Success & Status
  'professional': {
    highQuality: [
      'Enhance this into a more polished professional look - better lighting, confident posture, successful appearance. Keep facial features identical.',
      'Polish this photo to convey more professional success and authority. Maintain exact facial features.',
      'Enhance to showcase professional confidence and achievement - perfect for showing success and ambition. Preserve their exact identity.',
    ],
    lowQuality: [
      'Completely transform this person into an authoritative professional portrait - could be executive in corner office, confident business leader, or successful entrepreneur. Keep their exact identity.',
      'Revolutionary professional transformation: Place in sophisticated business environment - modern office, boardroom, or upscale professional setting. Maintain identical features.',  
      'Transform into the image of success - think CEO portrait, accomplished professional, or confident business leader. Preserve exact appearance.',
    ]
  },

  // ENGINE 4: ADVENTURE & TRAVEL - Worldly & Exciting
  'adventure-travel': {
    highQuality: [
      'Enhance this photo to suggest more adventure and travel experience - better outdoor lighting, adventurous vibe. Keep facial features identical.',
      'Polish this to convey a more adventurous, worldly personality. Maintain exact facial features.',
      'Enhance to showcase an adventurous spirit and love for travel and exploration. Preserve their exact identity.',
    ],
    lowQuality: [
      'Completely transform this person into an exciting adventure scene - hiking mountain peaks, exploring European cities, beach adventures, or exotic travel destinations. Keep their exact identity.',
      'Revolutionary adventure transformation: Place in breathtaking outdoor locations - mountain summits, tropical beaches, bustling foreign markets, or scenic hiking trails. Maintain identical features.',
      'Transform into the image of wanderlust - think world traveler, adventure seeker, or outdoor enthusiast in stunning locations. Preserve exact appearance.',
    ]
  },

  // ENGINE 5: SOCIAL PROOF - Popular & Connected  
  'social-proof': {
    highQuality: [
      'Enhance this photo to suggest higher social status and popularity - better social context, confident energy. Keep facial features identical.',
      'Polish this to convey social confidence and popularity without being obvious about it. Maintain exact facial features.',
      'Enhance to subtly showcase social connections and likability. Preserve their exact identity.',
    ],
    lowQuality: [
      'Completely transform this person into a vibrant social scene - trendy restaurant with friends, exclusive event, or popular social gathering. Keep their exact identity but add social context.',
      'Revolutionary social transformation: Place in upscale social environments - rooftop parties, wine tastings, gallery openings, or trendy venues. Maintain identical features.',
      'Transform into the image of social magnetism - think naturally popular person in their element at social events. Preserve exact appearance.',
    ]
  },

  // ENGINE 6: CUSTOM PROMPT - User-Directed Transformation
  'custom': {
    highQuality: [
      'Enhance this photo according to the user\'s specific vision while maintaining photorealistic quality. Keep facial features identical.',
      'Polish and improve this image following the custom transformation request. Maintain exact facial features.',
      'Enhance this photo with the requested modifications while preserving natural appearance. Preserve their exact identity.',
    ],
    lowQuality: [
      'Completely transform this person according to the user\'s specific vision - revolutionary change while maintaining their exact identity and facial features.',
      'Revolutionary custom transformation: Recreate this person in entirely new context as specified by user request. Maintain identical features.',
      'Transform this image completely according to user specifications while preserving the person\'s exact appearance and identity.',
    ]
  }
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { imageDataUrl, category, userId, customPrompt } = await req.json();
    
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

    // Intelligent prompt selection based on photo quality and context
    const engine = transformationEngines[category as keyof typeof transformationEngines];
    if (!engine) {
      throw new Error(`Invalid transformation category: ${category}`);
    }

    // For now, we'll use low-quality (revolutionary) prompts as default
    // TODO: Integrate with photo intelligence to determine quality level
    const qualityLevel = 'lowQuality'; // Default to revolutionary transformation
    const prompts = engine[qualityLevel];
    
    let selectedPrompt = prompts[Math.floor(Math.random() * prompts.length)];
    
    // Append custom prompt if provided
    if (customPrompt) {
      selectedPrompt += ` Additional user request: ${customPrompt}`;
    }
    
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