import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  console.log('🚀 FUNCTION INVOKED:', req.method, req.url);
  
  if (req.method === 'OPTIONS') {
    console.log('✅ Handling OPTIONS request');
    return new Response(null, { headers: corsHeaders });
  }

  const supabase = createClient(
    Deno.env.get("SUPABASE_URL") ?? "",
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
    { auth: { persistSession: false } }
  );

  try {
    console.log('📥 Parsing request body...');
    const body = await req.json();
    console.log('📄 Request body keys:', Object.keys(body));
    
    // Handle internal test request
    if (body.internal_test) {
      console.log('🧪 INTERNAL TEST MODE');
      return await handleInternalTest(supabase);
    }
    
    const { imageDataUrl, photoCategory, customPrompt, userId } = body;

    console.log('Enhancement request received:', {
      userId,
      photoCategory,
      customPrompt: customPrompt?.substring(0, 50) + '...',
      imageSize: imageDataUrl.length
    });

    if (!imageDataUrl || !photoCategory || !userId) {
      console.error('Missing required parameters:', { 
        hasImageDataUrl: !!imageDataUrl, 
        hasPhotoCategory: !!photoCategory, 
        hasUserId: !!userId 
      });
      return new Response(JSON.stringify({ error: 'Missing required parameters: imageDataUrl, photoCategory, userId' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    // Check user credits first
    console.log('💳 Checking user credits for userId:', userId);
    const { data: userCredits, error: creditsError } = await supabase
      .from('user_credits')
      .select('credits')
      .eq('user_id', userId)
      .single();
      
    console.log('💳 Credits result:', { userCredits, creditsError });

    if (creditsError || !userCredits || userCredits.credits < 1) {
      console.log('❌ Insufficient credits or error:', { creditsError, userCredits });
      return new Response(JSON.stringify({ error: 'Insufficient credits' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }
    
    console.log('✅ User has sufficient credits:', userCredits.credits);

    // Create enhancement prompt based on category and custom user input
    const basePrompts = {
      'the-hook': `Transform into a captivating professional headshot with perfect golden hour lighting that creates a warm, magnetic glow on the face. 
      Enhance facial symmetry subtly and naturally while maintaining authenticity. Create sparkling, confident eyes that draw viewers in with perfect catchlight. 
      Optimize the smile to be genuine and approachable - the kind that stops scrolling. Perfect skin tone with natural texture (no over-smoothing). 
      Ensure impeccable composition with the subject perfectly positioned. Add subtle depth of field to make the subject pop from background. 
      This should be the ultimate "stop scrolling" headshot that radiates confidence and approachability.`,
      
      'style-confidence': `Enhance into a fashion-magazine quality full-body shot that radiates success and style. Perfect the posture to show supreme confidence - shoulders back, 
      head high, commanding presence. Optimize outfit colors and contrast for maximum visual impact. Enhance fabric textures and fit to look premium. 
      Create a sophisticated background that complements without competing. Perfect the lighting to create dimension and highlight the best features. 
      Enhance body language to project confidence, success, and magnetic appeal. The result should look like a high-end fashion or lifestyle magazine cover.`,
      
      'social-proof': `Transform into a dynamic social photo where the main subject clearly stands out as the star with enhanced lighting and natural focus effects. 
      Subtly adjust lighting and contrast to make the main person pop while keeping others naturally lit but secondary. Enhance the social energy and 
      authentic group interaction. Perfect the composition to guide eyes to the main subject. Optimize facial expressions to show genuine connection and fun. 
      Create warm, inviting atmosphere that shows social confidence without diminishing others. The goal is natural social proof where the subject shines.`,
      
      'passion-hobbies': `Create an inspiring action shot that captures passionate engagement and skill with enhanced motion dynamics and energy. 
      Add subtle motion blur or freeze-frame effects to emphasize action and expertise. Enhance the expression to show intense focus, determination, 
      and genuine passion for the activity. Optimize the environment and equipment to look professional and appealing. Create dramatic lighting that 
      adds energy and excitement to the scene. Enhance colors and contrast to make the activity look more dynamic and engaging. 
      The result should inspire others to want to join this exciting activity.`,
      
      'lifestyle-adventure': `Transform into an epic adventure photo with dramatic landscape enhancement and perfect natural lighting that inspires wanderlust. 
      Enhance the natural scenery to be more breathtaking - richer colors, more dramatic skies, enhanced textures in nature. Perfect the outdoor lighting 
      for golden hour or blue hour effects. Add atmospheric elements like enhanced mist, rays of light, or weather drama. Position the subject to show 
      scale and adventure spirit against the magnificent backdrop. Enhance gear and clothing to look premium and adventure-ready. 
      Create a sense of awe and wanderlust that makes viewers want to experience similar adventures.`,
      
      'personality-closer': `Enhance into a heartwarming personality shot with genuine joy and laughter that creates instant emotional connection. 
      Perfect the lighting for a warm, inviting atmosphere that feels cozy and authentic. Enhance genuine expressions of joy, laughter, or 
      warm smiles that reveal true character. If there are pets or props, make them complement the personality perfectly. Create soft, 
      natural lighting that makes the scene feel intimate and genuine. Enhance colors to be warm and inviting. Perfect the composition 
      to feel candid yet polished. The result should make viewers feel like they already know and like this person's genuine character.`
    };

    const categoryPrompt = basePrompts[photoCategory as keyof typeof basePrompts] || 'Dating profile photo';
    
    const enhancementPrompt = `${categoryPrompt}. ${customPrompt ? `\n\nSpecific instructions: ${customPrompt}` : ''}

Enhancement guidelines:
- Improve lighting, contrast, and color balance for maximum visual appeal
- Enhance skin tone and texture naturally (avoid over-smoothing)  
- Optimize facial features and expressions for attractiveness
- Improve composition and background if needed
- Ensure the person looks confident and approachable
- Maintain authenticity - no artificial or fake appearance
- Generate and return the enhanced image, not text analysis

CRITICAL: Generate and return only the enhanced image file.`;

    // Create enhancement record with timeout handling
    const enhancementId = crypto.randomUUID();
    const startTime = Date.now();
    
    console.log('📝 Creating enhancement record:', enhancementId);
    const { error: insertError } = await supabase
      .from('photo_enhancements')
      .insert({
        id: enhancementId,
        user_id: userId,
        photo_category: photoCategory,
        enhancement_theme: 'ai_enhanced',
        prompt_used: customPrompt || `Enhance this ${photoCategory} photo`,
        original_photo_url: 'data_url_provided',
        status: 'processing'
      });

    if (insertError) {
      console.error('❌ Failed to create enhancement record:', insertError);
      throw new Error('Failed to create enhancement record');
    }

    try {
      // Set up timeout (Edge Functions have 55-second limit, use 50 seconds)
      const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => reject(new Error('Function timeout after 50 seconds')), 50000);
      });

      const enhancementPromise = performImageEnhancement(imageDataUrl, enhancementPrompt);
      
      console.log('🏁 Starting enhancement with timeout...');
      const enhancedImageBase64 = await Promise.race([enhancementPromise, timeoutPromise]) as string;

      const processingTime = Date.now() - startTime;
      console.log(`✅ Enhancement completed in ${processingTime}ms`);

      // Store enhanced image in Supabase Storage with user folder structure
      const fileName = `${userId}/enhanced_${enhancementId}.jpg`;
      const imageBuffer = Uint8Array.from(atob(enhancedImageBase64), c => c.charCodeAt(0));
      
      console.log('💾 Uploading to storage:', fileName);
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('enhanced-photos')
        .upload(fileName, imageBuffer, {
          contentType: 'image/jpeg',
          upsert: false
        });

      if (uploadError) {
        console.error('❌ Upload error:', uploadError);
        throw new Error(`Upload failed: ${uploadError.message}`);
      }

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('enhanced-photos')
        .getPublicUrl(fileName);

      console.log('🔗 Public URL created:', publicUrl);

      // Update enhancement record with results
      const { error: updateError } = await supabase
        .from('photo_enhancements')
        .update({
          enhanced_photo_url: publicUrl,
          processing_time: processingTime,
          status: 'completed'
        })
        .eq('id', enhancementId);

      if (updateError) {
        console.error('❌ Failed to update enhancement record:', updateError);
        throw new Error('Failed to update enhancement record');
      }

      // Deduct credits
      console.log('💳 Deducting credit from user');
      const { error: creditError } = await supabase
        .from('user_credits')
        .update({ credits: userCredits.credits - 1 })
        .eq('user_id', userId);

      if (creditError) {
        console.error('❌ Failed to deduct credits:', creditError);
        // Don't fail the request for credit deduction errors
      }

      console.log('🎉 Enhancement successful!');
      return new Response(JSON.stringify({
        enhancedImageUrl: publicUrl,
        processingTime,
        enhancementId,
        creditsRemaining: userCredits.credits - 1
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });

    } catch (enhancementError) {
      console.error('❌ Enhancement failed:', enhancementError.message);
      
      // Update record to failed status
      await supabase
        .from('photo_enhancements')
        .update({ status: 'failed' })
        .eq('id', enhancementId);
        
      // Provide user-friendly error message based on error type
      let userMessage = 'Enhancement failed. ';
      if (enhancementError.message.includes('attempts')) {
        userMessage += 'The AI service is temporarily unavailable. Please try again in a few minutes.';
      } else if (enhancementError.message.includes('timeout')) {
        userMessage += 'The enhancement took too long to process. Please try with a smaller image.';
      } else if (enhancementError.message.includes('too large')) {
        userMessage += 'Image is too large. Please use an image smaller than 20MB.';
      } else {
        userMessage += 'Please try again or contact support if the issue persists.';
      }
        
      throw new Error(userMessage);
    }

  } catch (error) {
    console.error('🔥 === FUNCTION ERROR ===');
    console.error('Error message:', error.message);
    console.error('Error stack:', error.stack);
    console.error('Error name:', error.name);
    console.error('Full error object:', error);
    
    return new Response(JSON.stringify({ 
      error: 'Enhancement failed: ' + error.message,
      details: error.name,
      timestamp: new Date().toISOString()
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
});

async function performImageEnhancement(imageDataUrl: string, enhancementPrompt: string): Promise<string> {
  console.log('🤖 === CALLING GEMINI IMAGE PREVIEW API ===');
  
  const geminiApiKey = Deno.env.get('GEMINI_API_KEY');
  if (!geminiApiKey) {
    console.log('ERROR: GEMINI_API_KEY not configured');
    throw new Error('GEMINI_API_KEY not configured');
  }
  console.log('✅ Gemini API Key available');

  // Clean image data URL
  let imageData = imageDataUrl;
  if (imageData.startsWith('data:image/')) {
    const base64Index = imageData.indexOf(';base64,');
    if (base64Index !== -1) {
      imageData = imageData.substring(base64Index + 8);
    }
  }

  // Validate image size (max 20MB for Gemini API)
  const imageSizeBytes = (imageData.length * 3) / 4; // Base64 to bytes conversion
  if (imageSizeBytes > 20 * 1024 * 1024) {
    throw new Error('Image too large. Please use an image smaller than 20MB.');
  }

  console.log('📸 Image data length:', imageData.length);
  console.log('📸 Image size (MB):', (imageSizeBytes / (1024 * 1024)).toFixed(2));
  console.log('📝 Enhancement prompt length:', enhancementPrompt.length);

  // Use Gemini 2.5 Flash Image Preview model - correct for image editing
  const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-image-preview:generateContent?key=${geminiApiKey}`;
  
  const requestPayload = {
    contents: [{
      parts: [
        {
          text: enhancementPrompt
        },
        {
          inline_data: {
            mime_type: "image/jpeg",
            data: imageData
          }
        }
      ]
    }],
    generationConfig: {
      temperature: 0.7,
      topK: 32,
      topP: 1,
      maxOutputTokens: 8192
    }
  };

  // Retry logic with exponential backoff
  const maxRetries = 3;
  let lastError: Error | null = null;

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      console.log(`🔄 Making Gemini API request (attempt ${attempt}/${maxRetries})...`);
      console.log('📤 Request config:', {
        url: apiUrl.replace(geminiApiKey, 'HIDDEN'),
        model: 'gemini-2.5-flash-image-preview'
      });

      const geminiResponse = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestPayload)
      });

      console.log(`📥 Gemini response status (attempt ${attempt}):`, geminiResponse.status);
      console.log('📥 Gemini response headers:', Object.fromEntries(geminiResponse.headers.entries()));

      if (!geminiResponse.ok) {
        const errorText = await geminiResponse.text();
        console.error(`❌ Gemini API error response (attempt ${attempt}):`, errorText);
        
        // Parse error to determine if it's retryable
        const isRetryableError = geminiResponse.status >= 500 || geminiResponse.status === 429;
        
        if (!isRetryableError || attempt === maxRetries) {
          // Don't retry on 4xx errors (except 429) or final attempt
          throw new Error(`Gemini API error (${geminiResponse.status}): ${errorText}`);
        }
        
        // Log retry attempt
        const waitTime = Math.pow(2, attempt - 1) * 1000; // Exponential backoff: 1s, 2s, 4s
        console.log(`🔄 Retryable error, waiting ${waitTime}ms before attempt ${attempt + 1}...`);
        lastError = new Error(`Gemini API error (${geminiResponse.status}): ${errorText}`);
        
        // Wait before retry
        await new Promise(resolve => setTimeout(resolve, waitTime));
        continue;
      }

      const geminiResult = await geminiResponse.json();
      console.log(`✅ Successfully received response on attempt ${attempt}`);
      return await parseGeminiResponse(geminiResult, apiUrl, requestPayload);
      
    } catch (error) {
      console.error(`❌ Error on attempt ${attempt}:`, error.message);
      lastError = error as Error;
      
      // Check if it's a network/timeout error (retryable)
      const isNetworkError = error.message.includes('fetch') || 
                           error.message.includes('timeout') || 
                           error.message.includes('network');
      
      if (isNetworkError && attempt < maxRetries) {
        const waitTime = Math.pow(2, attempt - 1) * 1000; // Exponential backoff
        console.log(`🔄 Network error, waiting ${waitTime}ms before attempt ${attempt + 1}...`);
        await new Promise(resolve => setTimeout(resolve, waitTime));
        continue;
      }
      
      // If not retryable or final attempt, throw the error
      if (attempt === maxRetries) {
        break;
      }
    }
  }
  
  // If we get here, all retries failed
  console.error(`❌ All ${maxRetries} attempts failed. Last error:`, lastError?.message);
  throw new Error(`Enhancement failed after ${maxRetries} attempts. ${lastError?.message || 'Unknown error'}`);
}

async function parseGeminiResponse(geminiResult: any, apiUrl: string, fallbackPayload: any): Promise<string> {
  console.log('📦 Gemini response structure:', {
    candidates: geminiResult.candidates ? geminiResult.candidates.length : 'none',
    hasContent: !!geminiResult.candidates?.[0]?.content,
    hasParts: !!geminiResult.candidates?.[0]?.content?.parts?.length
  });

  // Parse response for image data - multiple strategies
  let enhancedImageBase64: string | null = null;

  // Strategy 1: Look for inline_data in parts (correct format)
  if (geminiResult.candidates?.[0]?.content?.parts) {
    for (const part of geminiResult.candidates[0].content.parts) {
      if (part.inline_data?.data) {
        console.log('✅ Found image in inline_data');
        enhancedImageBase64 = part.inline_data.data;
        break;
      }
    }
  }

  // Strategy 2: Look for inlineData (alternative format)
  if (!enhancedImageBase64 && geminiResult.candidates?.[0]?.content?.parts) {
    for (const part of geminiResult.candidates[0].content.parts) {
      if (part.inlineData?.data) {
        console.log('✅ Found image in inlineData');
        enhancedImageBase64 = part.inlineData.data;
        break;
      }
    }
  }

  // Strategy 3: Check if it returns text asking us to use text-to-image instead
  if (!enhancedImageBase64 && geminiResult.candidates?.[0]?.content?.parts?.[0]?.text) {
    const textContent = geminiResult.candidates[0].content.parts[0].text;
    console.log('📄 Received text response:', textContent.substring(0, 200) + '...');
    
    // If the model suggests using text-to-image, we'll create a new prompt
    if (textContent.toLowerCase().includes('cannot edit') || textContent.toLowerCase().includes('text-to-image')) {
      console.log('🔄 Model suggests text-to-image generation, switching approach...');
      
      // Create a text-to-image prompt based on the enhancement request
      const textToImagePrompt = `Generate a high-quality, enhanced dating profile photo. ${fallbackPayload.contents[0].parts[0].text}`;
      
      // Make a new request for text-to-image generation
      const textToImagePayload = {
        contents: [{
          parts: [{
            text: textToImagePrompt
          }]
        }],
        generationConfig: fallbackPayload.generationConfig
      };
      
      console.log('🔄 Making text-to-image request...');
      const textToImageResponse = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(textToImagePayload)
      });
      
      if (textToImageResponse.ok) {
        const textToImageResult = await textToImageResponse.json();
        if (textToImageResult.candidates?.[0]?.content?.parts) {
          for (const part of textToImageResult.candidates[0].content.parts) {
            if (part.inline_data?.data || part.inlineData?.data) {
              enhancedImageBase64 = part.inline_data?.data || part.inlineData?.data;
              console.log('✅ Generated new image via text-to-image');
              break;
            }
          }
        }
      }
    }
  }

  if (!enhancedImageBase64) {
    console.error('❌ No image data found in Gemini response');
    console.error('Full response:', JSON.stringify(geminiResult, null, 2));
    throw new Error('No enhanced image received from Gemini API - model may not support image editing');
  }

  console.log('✅ Successfully extracted enhanced image data');
  return enhancedImageBase64;
}

async function handleInternalTest(supabase: any): Promise<Response> {
  console.log('🧪 Running internal test...');
  
  try {
    // Clean up stuck processing records first
    console.log('🧹 Cleaning up stuck processing records...');
    const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000).toISOString();
    
    const { data: stuckRecords, error: stuckError } = await supabase
      .from('photo_enhancements')
      .update({ status: 'failed' })
      .eq('status', 'processing')
      .lt('created_at', fiveMinutesAgo);
      
    if (stuckError) {
      console.error('❌ Error cleaning stuck records:', stuckError);
    } else {
      console.log('✅ Cleaned up stuck records');
    }

    // Test with a simple base64 image (1x1 pixel)
    const testImageBase64 = '/9j/4AAQSkZJRgABAQEAYABgAAD/2wBDAAEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQH/2wBDAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQH/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwA/8A8A';
    const testImageDataUrl = `data:image/jpeg;base64,${testImageBase64}`;
    
    console.log('🔬 Testing enhancement with minimal image...');
    const explicitPrompt = `Generate an enhanced version of this image. Improve the lighting, contrast, and overall visual quality. Return only the enhanced image file, not text.

CRITICAL: You must generate and return an enhanced image file as output. Do not respond with text analysis or questions.`;
    const result = await performImageEnhancement(testImageDataUrl, explicitPrompt);
    
    console.log('✅ Internal test successful - received enhanced image');
    return new Response(JSON.stringify({
      success: true,
      message: 'Internal test passed',
      resultLength: result.length,
      timestamp: new Date().toISOString()
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
    
  } catch (error) {
    console.error('❌ Internal test failed:', error.message);
    return new Response(JSON.stringify({
      success: false,
      error: error.message,
      timestamp: new Date().toISOString()
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
}