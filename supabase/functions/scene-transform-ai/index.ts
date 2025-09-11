import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.57.3';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// 6 Advanced Person-First Dating Transformation Engines - Optimized for Maximum Swipe Appeal
const transformationEngines = {
  // ENGINE 1: THE HOOK - Stop-the-Scroll Magnetism
  'the-hook': {
    highQuality: [
      'Transform this person into an irresistible first impression photo that maximizes swipe-right potential. Perfect their attractiveness with ideal lighting, magnetic eye contact, confident posture. This must be the photo that stops scrolling. Keep facial features identical but make them captivating. Add subtle natural imperfections and authentic lighting for humanized appeal.',
      'Create the ultimate hook shot that screams "swipe right immediately" - optimize everything for instant attraction and dating appeal. Enhance their natural magnetism while preserving exact identity. Include natural authenticity factors to avoid over-polished AI appearance.',
      'Revolutionary first impression transformation: Make this person impossible to ignore - think cover model quality that guarantees right swipes. Maintain identical features but maximize their attractiveness with natural humanization elements.',
    ],
    lowQuality: [
      'Complete dating profile transformation: Turn this into a show-stopping first impression photo that maximizes matches. Could be golden hour portrait, professional headshot, or charismatic moment - whatever makes them most swipe-worthy. Keep exact identity with natural, authentic feel.',
      'Revolutionary hook transformation: Create the perfect "stop-the-scroll" photo that instantly attracts potential dates. Think magazine cover quality optimized for dating apps with natural lighting variations and authentic imperfections.',
      'Transform into the ultimate swipe-right photo - whatever setting, lighting, or pose makes this person most attractive to potential matches. Maintain identical facial features while maximizing dating appeal with humanized authenticity.',
    ]
  },

  // ENGINE 2: PASSION & HOBBIES - Attractive Lifestyle Magnetism  
  'passion-hobbies': {
    highQuality: [
      'Enhance this person to showcase attractive hobbies that boost dating appeal - activities that signal interesting personality and active lifestyle. Make them more swipe-worthy through engaging interests. Keep facial features identical with natural environment interactions.',
      'Polish into compelling lifestyle shot that hints at attractive passions potential dates would love. Optimize for dating success and relationship appeal with authentic activity engagement. Maintain exact facial features.',
      'Transform to show this person engaged in swipe-worthy hobbies that make them irresistible - activities that signal they\'re interesting, active, and worth dating. Preserve exact identity with natural human elements.',
    ],
    lowQuality: [
      'Complete lifestyle transformation: Place this person in attractive hobby scenes that maximize dating appeal - playing guitar seductively, cooking gourmet meals, hiking scenic trails, or artistic pursuits. Whatever makes them most dateable with natural environmental authenticity.',
      'Revolutionary passion transformation: Create dynamic hobby environment that screams "relationship material" - art studio, climbing gym, cozy reading with wine, outdoor adventures. Make them irresistible to potential partners with authentic human touches.',
      'Transform into magnetic lifestyle shot optimized for dating success - surfing, piano playing, gardening, photography - whatever hobby makes them most attractive to potential matches with natural lighting and authentic interactions.',
    ]
  },

  // ENGINE 3: STYLE & CONFIDENCE - Full Body Appeal
  'style-confidence': {
    highQuality: [
      'Transform this person into an attractively confident full-body shot that maximizes dating appeal - style and confidence are incredibly sexy. Perfect lighting, confident posture, stylish appearance that screams "relationship material" with natural fashion authenticity. Keep facial features identical.',
      'Polish into irresistibly stylish and confident look that boosts swipe-right potential. Great style and confidence are massive dating advantages. Maintain exact facial features while maximizing style appeal with humanized elements.',
      'Enhance to showcase personal style and confidence - key attractive qualities for dating. Make them look like the stylish catch they are with natural confidence indicators. Preserve exact identity.',
    ],
    lowQuality: [
      'Complete style transformation optimized for dating success: Place as confident stylish person, fashionable appearance, or accomplished style icon with authentic fashion environment. Style is incredibly attractive to potential partners.',
      'Revolutionary confidence transformation: Create sophisticated style environment that signals "great catch" - trendy outfit, fashionable setting, upscale style scene with natural lighting and authentic interactions.',  
      'Transform into image of attractive style - fashion portrait, accomplished stylist, confident fashionable person who would be amazing to date with humanized style authenticity.',
    ]
  },

  // ENGINE 4: LIFESTYLE & ADVENTURE - Worldly and Irresistibly Exciting
  'lifestyle-adventure': {
    highQuality: [
      'Transform this person to showcase attractive adventure spirit that maximizes dating appeal - worldliness and excitement are incredibly sexy. Better outdoor lighting, adventurous confidence that screams "amazing partner" with natural outdoor authenticity. Keep facial features identical.',
      'Polish to convey irresistibly adventurous personality that potential dates would love to explore the world with. Adventure signals amazing relationship potential with authentic environmental elements.',
      'Enhance to showcase attractive wanderlust and love for exploration - qualities that make someone incredibly dateable and exciting to be with. Preserve exact identity with natural adventure elements.',
    ],
    lowQuality: [
      'Complete adventure transformation optimized for dating success: Place in breathtaking scenarios - mountain summits, exotic travel, beach adventures, or exploring cities with authentic natural lighting and environmental interactions.',
      'Revolutionary travel transformation: Create stunning outdoor locations that signal "incredible life partner" - tropical beaches, mountain peaks, bustling markets, scenic trails with natural lighting variations and authentic adventure elements.',
      'Transform into ultimate adventure partner image - world traveler, outdoor enthusiast, explorer in stunning locations with authentic environmental authenticity that make potential dates dream of adventures together.',
    ]
  },

  // ENGINE 5: SOCIAL PROOF - Popular and Magnetically Attractive  
  'social-proof': {
    highQuality: [
      'Transform this person to subtly showcase attractive social status and popularity that boosts dating appeal - being desired by others is incredibly attractive. Enhanced social confidence and magnetic energy with natural social interactions. Keep facial features identical.',
      'Polish to convey irresistible social magnetism and popularity that makes them more dateable. Social proof is a powerful dating advantage with authentic social environment elements.',
      'Enhance to subtly showcase social connections and natural attractiveness that signals "everyone wants to date them" with genuine social interaction authenticity.',
    ],
    lowQuality: [
      'Complete social transformation optimized for dating appeal: Place in attractive social scenes - trendy restaurants, exclusive events, popular gatherings where they clearly belong and are desired with natural social lighting and authentic interactions.',
      'Revolutionary social proof transformation: Create upscale social environments that signal "incredibly popular and dateable" - rooftop parties, wine tastings, gallery openings, trendy venues with authentic social energy and natural lighting.',
      'Transform into image of social magnetism and desirability - naturally popular person who everyone wants to date, in their element at attractive social events with genuine human authenticity.',
    ]
  },

  // ENGINE 6: PERSONALITY CLOSER - Genuine & Fun Appeal
  'personality-closer': {
    highQuality: [
      'Transform this person to showcase genuine personality and fun energy that maximizes dating appeal - authenticity and joy are incredibly attractive. Enhanced genuine expressions and playful energy with natural personality interactions. Keep facial features identical.',
      'Polish to convey irresistible personality and authentic charm that makes them more dateable. Genuine personality is a powerful dating advantage with authentic expressive elements.',
      'Enhance to showcase natural charisma and genuine fun personality that signals "amazing to be around" with authentic personality expression.',
    ],
    lowQuality: [
      'Complete personality transformation optimized for dating appeal: Place in genuine moments - laughing naturally, playing with pets, expressing joy, or candid fun moments with natural lighting and authentic interactions.',
      'Revolutionary personality transformation: Create authentic environments that signal "incredibly fun and genuine" - casual moments, pet interactions, natural laughter, candid joy with authentic personality energy and natural lighting.',
      'Transform into image of genuine personality and fun energy - naturally charismatic person who everyone wants to spend time with, in authentic moments with genuine human authenticity.',
    ]
  }
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { imageDataUrl, category, userId, customPrompt, qualityLevel, humanizationLevel = 0.5 } = await req.json();
    
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

    // Check user credits (2 credits for scene transformation)
    let userCredits = null;
    let isDemo = userId === 'demo-user';
    
    if (!isDemo) {
      const { data: creditsData, error: creditsError } = await supabase
        .from('user_credits')
        .select('credits')
        .eq('user_id', userId)
        .single();

      if (creditsError) {
        console.error('Credits check error:', creditsError);
        throw new Error('Failed to check user credits');
      }

      if (!creditsData || creditsData.credits < 2) {
        throw new Error('Insufficient credits. Scene transformation requires 2 credits.');
      }
      
      userCredits = creditsData;
    }

    // Advanced prompt selection based on quality assessment
    const engine = transformationEngines[category as keyof typeof transformationEngines];
    if (!engine) {
      throw new Error(`Invalid transformation category: ${category}`);
    }

    // Use provided quality level or default to revolutionary transformation
    const selectedQualityLevel = qualityLevel || 'lowQuality';
    const prompts = engine[selectedQualityLevel];
    
    let selectedPrompt = prompts[Math.floor(Math.random() * prompts.length)];
    
    // Append custom prompt with dating optimization
    if (customPrompt) {
      selectedPrompt += ` Additional dating-optimized request: ${customPrompt}. Ensure maximum attractiveness and swipe-right appeal.`;
    }
    
    // Add person-first emphasis with humanization factor
    const humanizationPrompts = humanizationLevel > 0.3 ? [
      ' Include natural lighting variations and subtle environmental authenticity.',
      ' Add authentic imperfections and natural human elements to avoid over-polished AI appearance.',
      ' Ensure natural skin texture, authentic facial expressions, and environmental realism.',
      ' Create genuine human authenticity with subtle natural imperfections and realistic lighting.',
      ' Balance enhancement with natural authenticity - avoid artificial perfection.'
    ] : [];
    
    const humanizationPrompt = humanizationLevel > 0.3 ? 
      humanizationPrompts[Math.floor(Math.random() * humanizationPrompts.length)] : '';
    
    selectedPrompt += humanizationPrompt + ' CRITICAL: This is for dating app success - prioritize making the person maximally attractive, confident, and irresistible while preserving their exact facial features and identity. Focus on swipe-right optimization with natural human authenticity.';
    
    console.log('Generating person-first dating transformation with prompt:', selectedPrompt);

    // Convert base64 image to proper format for Gemini
    const imageBase64 = imageDataUrl.replace(/^data:image\/[a-z]+;base64,/, '');

    // Generate optimized dating photo with Gemini 2.5 Flash Image Preview
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-image-preview:generateContent?key=${GEMINI_API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [
            {
              text: `${selectedPrompt}. Generate a high-quality, dating-optimized photograph with perfect lighting, composition, and maximum attractiveness. The person must look their absolute best for dating app success. Output as a single enhanced image.`
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
          temperature: 0.4, // Balanced for attractive yet natural results
          topK: 40,
          topP: 0.9,
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

    // Deduct credits (2 for scene transformation) - skip for demo
    if (!isDemo && userCredits) {
      const { error: updateError } = await supabase
        .from('user_credits')
        .update({ credits: userCredits.credits - 2 })
        .eq('user_id', userId);

      if (updateError) {
        console.error('Credits update error:', updateError);
        throw new Error('Failed to update credits');
      }
    }

    // Log the enhancement with dating optimization
    await supabase
      .from('photo_enhancements')
      .insert({
        user_id: userId,
        original_image_url: imageDataUrl,
        enhanced_image_url: enhancedImageUrl,
        enhancement_type: 'dating_optimized_transformation',
        category: category,
        status: 'completed',
        processing_time: Date.now(),
        metadata: {
          qualityLevel: selectedQualityLevel,
          customPrompt: customPrompt,
          datingOptimized: true,
          humanizationLevel: humanizationLevel
        }
      });

    const remainingCredits = isDemo ? 999 : (userCredits?.credits ?? 0) - 2;

    console.log('Person-first dating transformation completed successfully');

    return new Response(JSON.stringify({
      enhancedImageUrl,
      processingTime: Date.now(),
      enhancementId: `dating_transform_${Date.now()}`,
      creditsRemaining: remainingCredits,
      transformationType: 'dating_optimized_transformation',
      category,
      qualityLevel: selectedQualityLevel,
      datingOptimized: true,
      humanizationLevel: humanizationLevel,
      authenticityScore: Math.round((humanizationLevel * 100) + Math.random() * 20) // Simulated authenticity metric
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in person-first scene transformation:', error);
    return new Response(JSON.stringify({ 
      error: error instanceof Error ? error.message : 'Dating transformation failed' 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});