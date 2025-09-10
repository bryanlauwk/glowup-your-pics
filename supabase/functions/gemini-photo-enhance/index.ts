import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  const supabase = createClient(
    Deno.env.get("SUPABASE_URL") ?? "",
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
    { auth: { persistSession: false } }
  );

  try {
    const { imageDataUrl, photoCategory, customPrompt, userId } = await req.json();

    console.log('Enhancement request received:', {
      userId,
      photoCategory,
      customPrompt: customPrompt?.substring(0, 50) + '...',
      imageSize: imageDataUrl.length
    });

    if (!imageDataUrl || !photoCategory || !customPrompt || !userId) {
      console.error('Missing required parameters:', { 
        hasImageDataUrl: !!imageDataUrl, 
        hasPhotoCategory: !!photoCategory, 
        hasCustomPrompt: !!customPrompt, 
        hasUserId: !!userId 
      });
      return new Response(JSON.stringify({ error: 'Missing required parameters' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    // Check user credits first
    const { data: userCredits } = await supabase
      .from('user_credits')
      .select('credits')
      .eq('user_id', userId)
      .single();

    if (!userCredits || userCredits.credits < 1) {
      return new Response(JSON.stringify({ error: 'Insufficient credits' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    // Create enhancement prompt based on category and custom user input
    const basePrompts = {
      'the-hook': 'Perfect headshot photo that makes an amazing first impression',
      'style-confidence': 'Full-body confidence shot showing great style and posture',
      'social-proof': 'Social photo with friends where the main subject stands out clearly',
      'passion-hobbies': 'Action shot showing passion and engagement in an activity',
      'lifestyle-adventure': 'Lifestyle photo showing adventure and interesting experiences',
      'personality-closer': 'Genuine personality photo with warmth and authenticity'
    };

    const categoryPrompt = basePrompts[photoCategory as keyof typeof basePrompts] || 'Dating profile photo';
    
    const enhancementPrompt = `Edit and enhance this image to create ${categoryPrompt}. User's specific request: "${customPrompt}".

CRITICAL: You MUST return an enhanced version of this image, not text analysis.

Enhancement instructions:
- Improve lighting, contrast, and color balance for maximum visual appeal
- Enhance skin tone and texture naturally (avoid over-smoothing)
- Optimize facial features and expressions for attractiveness
- Improve composition and background if needed
- Ensure the person looks confident and approachable
- Maintain authenticity - no artificial or fake appearance
- Focus specifically on: ${customPrompt}

IMPORTANT: Generate and return the enhanced image file directly. Do not provide text analysis or suggestions.`;

    const startTime = Date.now();

    // Call Gemini API
    const geminiApiKey = Deno.env.get('GEMINI_API_KEY');
    if (!geminiApiKey) {
      throw new Error('GEMINI_API_KEY not configured');
    }
    
    const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-image-preview:generateContent?key=${geminiApiKey}`;
    
    // Handle both blob URLs and data URLs
    let base64Data: string;
    let mimeType: string;
    
    if (imageDataUrl.startsWith('blob:')) {
      // Convert blob URL to base64
      console.log('Converting blob URL to base64...');
      const blobResponse = await fetch(imageDataUrl);
      const blob = await blobResponse.blob();
      const arrayBuffer = await blob.arrayBuffer();
      const uint8Array = new Uint8Array(arrayBuffer);
      base64Data = btoa(String.fromCharCode(...uint8Array));
      mimeType = blob.type || 'image/jpeg';
      console.log('Blob converted, mime type:', mimeType);
    } else if (imageDataUrl.startsWith('data:')) {
      // Extract base64 data from data URL
      base64Data = imageDataUrl.split(',')[1];
      mimeType = imageDataUrl.split(';')[0].split(':')[1];
    } else {
      throw new Error('Invalid image data format. Expected blob: or data: URL');
    }

    const payload = {
      contents: [{
        parts: [
          { text: enhancementPrompt },
          { 
            inlineData: { 
              mimeType: mimeType, 
              data: base64Data 
            } 
          }
        ]
      }]
    };

    console.log('Calling Gemini API with payload structure:', {
      contentsLength: payload.contents.length,
      hasText: !!payload.contents[0].parts[0].text,
      hasImage: !!payload.contents[0].parts[1].inlineData,
      mimeType,
      imageSizeKB: Math.round(base64Data.length * 0.75 / 1024)
    });

    const response = await fetch(geminiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    console.log('Gemini API response status:', response.status, response.statusText);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Gemini API error details:', {
        status: response.status,
        statusText: response.statusText,
        error: errorText,
        url: geminiUrl,
        payloadStructure: {
          contentsLength: payload.contents.length,
          hasText: !!payload.contents[0].parts[0].text,
          hasImage: !!payload.contents[0].parts[1].inlineData,
          mimeType,
          imageSizeKB: Math.round(base64Data.length * 0.75 / 1024)
        }
      });
      throw new Error(`Gemini API error: ${response.status} - ${errorText}`);
    }

    const result = await response.json();
    console.log('Gemini API response structure:', {
      hasCandidates: !!result.candidates,
      candidatesLength: result.candidates?.length,
      hasContent: !!result.candidates?.[0]?.content,
      partsLength: result.candidates?.[0]?.content?.parts?.length,
      firstPartType: typeof result.candidates?.[0]?.content?.parts?.[0],
      firstPartKeys: result.candidates?.[0]?.content?.parts?.[0] ? Object.keys(result.candidates[0].content.parts[0]) : []
    });

    // Try different possible response structures for image generation with 2.5-flash-image-preview
    let enhancedBase64 = null;
    let analysisResult = null;
    
    console.log('Parsing Gemini 2.5 Flash Image Preview response...');
    console.log('Full response structure:', JSON.stringify(result, null, 2));
    
    if (result.candidates?.[0]?.content?.parts) {
      const parts = result.candidates[0].content.parts;
      console.log(`Response has ${parts.length} parts`);
      
      // Look for image data in any part (priority for image generation model)
      for (let i = 0; i < parts.length; i++) {
        console.log(`Part ${i} structure:`, Object.keys(parts[i]));
        
        if (parts[i].inlineData?.data) {
          enhancedBase64 = parts[i].inlineData.data;
          console.log(`✅ Found enhanced image data in part ${i}, size: ${enhancedBase64.length} characters`);
          break;
        }
        
        // Also check for alternative response structures
        if (parts[i].image?.data) {
          enhancedBase64 = parts[i].image.data;
          console.log(`✅ Found enhanced image data in image field of part ${i}`);
          break;
        }
        
        if (parts[i].text) {
          analysisResult = parts[i].text;
          console.log(`⚠️ Found text in part ${i}:`, analysisResult.substring(0, 200) + '...');
        }
      }
    }

    if (!enhancedBase64) {
      console.error('❌ No enhanced image returned from Gemini 2.5 Flash Image Preview');
      console.error('Full response for debugging:', JSON.stringify(result, null, 2));
      
      if (analysisResult) {
        throw new Error(`Model returned text analysis instead of enhanced image. This suggests the model may not support image editing or the prompt needs adjustment. Response: ${analysisResult.substring(0, 200)}...`);
      }
      
      throw new Error('No enhanced image returned from Gemini 2.5 Flash Image Preview. Response structure: ' + JSON.stringify(result, null, 1).substring(0, 500));
    }

    console.log('✅ Successfully extracted enhanced image data');

    const enhancedImageUrl = `data:image/png;base64,${enhancedBase64}`;
    const processingTime = Date.now() - startTime;

    // Store enhancement record
    const { error: insertError } = await supabase
      .from('photo_enhancements')
      .insert({
        user_id: userId,
        original_photo_url: imageDataUrl,
        enhanced_photo_url: enhancedImageUrl,
        photo_category: photoCategory,
        enhancement_theme: customPrompt, // Store custom prompt in theme field
        prompt_used: enhancementPrompt,
        processing_time: processingTime,
        status: 'completed'
      });

    if (insertError) {
      console.error('Database insert error:', insertError);
    }

    // Deduct credit
    await supabase
      .from('user_credits')
      .update({ credits: userCredits.credits - 1 })
      .eq('user_id', userId);

    return new Response(JSON.stringify({
      enhancedImageUrl,
      processingTime,
      creditsRemaining: userCredits.credits - 1
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('Enhancement error:', {
      message: error.message,
      stack: error.stack,
      name: error.name
    });
    return new Response(JSON.stringify({ 
      error: 'Enhancement failed: ' + error.message,
      details: error.name 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
});