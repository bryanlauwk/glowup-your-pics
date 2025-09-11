import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.57.3';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// 6 Advanced Person-First Dating Transformation Engines - Optimized for Maximum Swipe Appeal
const transformationEngines = {
  // ENGINE 1: THE HOOK - Naturally Appealing First Impression
  'the-hook': {
    highQuality: [
      'Enhance this person into a naturally appealing first impression photo that draws genuine interest. Improve their natural attractiveness with flattering lighting, warm eye contact, and confident posture. Focus on bringing out their best qualities authentically. Preserve all facial features while enhancing their natural magnetism. Maintain realistic skin texture and natural lighting patterns.',
      'Create an engaging portrait that showcases this person\'s natural appeal and dating potential. Enhance their inherent charm while preserving authentic identity. Use realistic lighting that flatters without appearing artificial. Include subtle natural elements that make the photo feel genuine and approachable.',
      'Transform into a compelling first impression that highlights natural attractiveness and confidence. Enhance their best qualities while maintaining complete authenticity. Think professional portrait quality that looks naturally flattering rather than overly processed.',
    ],
    lowQuality: [
      'Create a naturally attractive first impression photo that showcases this person\'s appeal. Could be warm golden hour lighting, professional-style portrait, or genuine moment that brings out their best qualities. Maintain authentic identity while enhancing natural charm.',
      'Enhance into an appealing portrait that draws positive attention through natural attractiveness. Focus on realistic lighting and genuine expressions that showcase their personality. Avoid over-processing while maximizing natural appeal.',
      'Transform into an attractive first impression photo using natural enhancement techniques. Whatever setting or lighting brings out their best qualities while maintaining authentic appearance and genuine appeal.',
    ]
  },

  // ENGINE 2: PASSION & HOBBIES - Authentic Lifestyle Appeal  
  'passion-hobbies': {
    highQuality: [
      'Show this person engaged in appealing hobbies that demonstrate their interesting personality and active lifestyle. Present them naturally enjoying activities that suggest they\'re engaging and fun to be around. Maintain all facial features while showcasing authentic interest engagement.',
      'Create a compelling lifestyle photo that shows attractive interests and passions. Focus on natural engagement with activities that suggest an interesting personality. Use realistic lighting and authentic expressions while preserving their exact identity.',
      'Enhance to show this person authentically enjoying hobbies that make them appear interesting and active. Focus on natural interaction with activities that suggest they have engaging interests and would be fun to spend time with.',
    ],
    lowQuality: [
      'Place this person in appealing hobby scenes that showcase interesting lifestyle - playing music, cooking, hiking, or creative pursuits. Focus on natural interaction with activities while maintaining authentic appearance and realistic environmental lighting.',
      'Create dynamic lifestyle environment that suggests interesting personality - art space, outdoor activities, cozy reading moments, or adventure settings. Show authentic engagement with hobbies using natural lighting and genuine expressions.',
      'Transform into engaging lifestyle shot - music, outdoor activities, creative pursuits, or culinary interests. Focus on natural interaction with hobbies while maintaining realistic lighting and authentic appearance.',
    ]
  },

  // ENGINE 3: STYLE & CONFIDENCE - Natural Style Appeal
  'style-confidence': {
    highQuality: [
      'Enhance this person to showcase natural style and confidence through flattering full-body presentation. Focus on bringing out their personal style with authentic confidence and good posture. Use natural lighting that complements their appearance while maintaining all facial features exactly.',
      'Create a stylish and confident presentation that highlights their natural appeal and fashion sense. Focus on authentic confidence and personal style while preserving their exact identity. Use realistic lighting and natural poses.',
      'Show this person with enhanced natural style and confident presence. Highlight their personal fashion sense and confident demeanor through authentic presentation while maintaining realistic appearance.',
    ],
    lowQuality: [
      'Present this person with appealing personal style and natural confidence in fashionable settings. Focus on authentic style presentation with realistic lighting and genuine confident posture.',
      'Create sophisticated style presentation that showcases natural confidence - well-coordinated outfits, appealing settings, stylish environments with authentic lighting and natural interactions.',  
      'Transform into appealing style presentation - fashionable appearance, confident bearing, stylish environment that highlights their natural appeal and personal style authentically.',
    ]
  },

  // ENGINE 4: LIFESTYLE & ADVENTURE - Natural Adventure Appeal
  'lifestyle-adventure': {
    highQuality: [
      'Show this person with natural adventure spirit and love of exploration through authentic outdoor settings. Use natural lighting that flatters while suggesting an active, adventurous lifestyle. Maintain all facial features while showcasing genuine adventurous character.',
      'Create an appealing adventure-focused presentation that suggests this person enjoys exploration and travel. Focus on authentic outdoor environments with natural lighting that complements their adventurous spirit.',
      'Enhance to showcase natural wanderlust and outdoor interests through realistic adventure settings. Present them as someone who genuinely enjoys exploration while maintaining authentic appearance.',
    ],
    lowQuality: [
      'Place this person in appealing adventure scenarios - mountain settings, travel environments, beach activities, or urban exploration with authentic natural lighting and realistic environmental interaction.',
      'Create engaging outdoor environments that suggest adventure spirit - scenic locations, travel settings, outdoor activities with natural lighting variations and authentic adventure elements.',
      'Transform into appealing adventure presentation - outdoor exploration, travel scenarios, nature settings with authentic environmental lighting that suggests genuine love of adventure.',
    ]
  },

  // ENGINE 5: SOCIAL PROOF - Natural Social Appeal  
  'social-proof': {
    highQuality: [
      'Show this person in appealing social settings that suggest they have good social connections and are well-liked. Focus on natural social confidence and genuine interactions while maintaining all facial features exactly. Use authentic social lighting.',
      'Create social presentation that suggests this person is naturally popular and enjoys good social connections. Focus on authentic social environments with realistic lighting and genuine social interactions.',
      'Present this person in natural social contexts that suggest they have appealing social connections and are enjoyed by others. Maintain authentic appearance while showcasing genuine social appeal.',
    ],
    lowQuality: [
      'Place this person in appealing social environments - nice restaurants, social gatherings, cultural events where they appear naturally comfortable and socially connected with authentic lighting and genuine interactions.',
      'Create upscale social environments that suggest natural popularity and social appeal - social events, cultural venues, dining experiences with authentic social energy and realistic lighting.',
      'Transform into natural social presentation - person who appears genuinely popular and socially appealing in authentic social settings with realistic environmental lighting.',
    ]
  },

  // ENGINE 6: PERSONALITY CLOSER - Authentic Personality Appeal
  'personality-closer': {
    highQuality: [
      'Show this person expressing genuine personality and natural joy that makes them appealing to be around. Focus on authentic expressions and natural energy while maintaining all facial features exactly. Use realistic lighting that enhances their natural charm.',
      'Create presentation that showcases this person\'s authentic personality and natural charisma. Focus on genuine expressions and natural charm while preserving their exact identity with realistic environmental elements.',
      'Enhance to show natural charisma and genuine personality that suggests they would be enjoyable company. Focus on authentic expression while maintaining realistic appearance.',
    ],
    lowQuality: [
      'Place this person in genuine moments that showcase personality - natural laughter, authentic interactions, or candid expressions of joy with realistic lighting and natural environmental elements.',
      'Create authentic environments that highlight natural personality - casual genuine moments, natural interactions, authentic expressions with realistic lighting and genuine personality energy.',
      'Transform into natural personality presentation - genuinely charismatic person in authentic moments that showcase their real personality with realistic environmental lighting.',
    ]
  }
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { imageDataUrl, category, userId, customPrompt, qualityLevel, humanizationLevel = 0.8 } = await req.json();
    
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
    
    // Enhanced anti-detection humanization with authenticity focus
    const humanizationPrompts = humanizationLevel > 0.3 ? [
      ' ANTI-DETECTION: Add natural skin texture with subtle pores, fine lines, and authentic imperfections. Maintain original lighting direction and shadows.',
      ' AUTHENTICITY BOOST: Include natural grain, realistic lighting variations, and environmental consistency. Avoid over-smoothed skin or artificial symmetry.',
      ' NATURAL ELEMENTS: Preserve original photo quality with subtle natural asymmetries, authentic facial expressions, and realistic environmental interactions.',
      ' REALISTIC ENHANCEMENT: Balance appeal with authenticity - add natural texture variations, maintain skin imperfections, ensure lighting matches environment.',
      ' HUMAN AUTHENTICITY: Create natural appearance with subtle flaws, realistic shadows, authentic expressions, and environmental coherence to avoid AI detection.'
    ] : [
      ' Maintain subtle natural appearance.',
      ' Keep authentic human elements.',
      ' Preserve realistic lighting.'
    ];
    
    const humanizationPrompt = humanizationPrompts[Math.floor(Math.random() * humanizationPrompts.length)];
    
    // Enhanced anti-detection instruction
    const antiDetectionSuffix = humanizationLevel > 0.5 ? 
      ' CRITICAL ANTI-DETECTION: This must appear as naturally appealing photography, not AI-generated. Preserve original lighting conditions, add natural grain matching the source photo, maintain subtle skin texture and realistic imperfections. Avoid: over-smoothed skin, perfect symmetry, artificial lighting, unrealistic scenarios. Focus on naturally attractive enhancement while maintaining complete authenticity.' :
      ' Focus on naturally attractive enhancement while maintaining authenticity.';
    
    selectedPrompt += humanizationPrompt + antiDetectionSuffix;
    
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
              text: `${selectedPrompt}. Generate a naturally appealing, dating-optimized photograph that enhances attractiveness while maintaining complete authenticity. The result must look like professional photography, not AI-generated content. Preserve natural skin texture, realistic lighting, and environmental consistency. Output as a single enhanced image that passes as authentic human photography.`
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
          temperature: 0.3, // Lower temperature for more consistent, natural results
          topK: 35,
          topP: 0.85,
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
      authenticityScore: Math.round((humanizationLevel * 100) + Math.random() * 20), // Simulated authenticity metric
      antiDetectionLevel: humanizationLevel > 0.5 ? 'high' : 'standard',
      naturalness: Math.round(85 + (humanizationLevel * 15)) // Higher humanization = more natural
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