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
      'the-hook': 'Perfect headshot photo that makes an amazing first impression',
      'style-confidence': 'Full-body confidence shot showing great style and posture',
      'social-proof': 'Social photo with friends where the main subject stands out clearly',
      'passion-hobbies': 'Action shot showing passion and engagement in an activity',
      'lifestyle-adventure': 'Lifestyle photo showing adventure and interesting experiences',
      'personality-closer': 'Genuine personality photo with warmth and authenticity'
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

      // Store enhanced image in Supabase Storage
      const fileName = `enhanced_${enhancementId}.jpg`;
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
        
      throw enhancementError;
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
  console.log('🤖 === CALLING IMAGEN API ===');
  
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

  console.log('📸 Image data length:', imageData.length);
  console.log('📝 Enhancement prompt length:', enhancementPrompt.length);

  // Use Imagen 4.0 API format
  const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/imagen-4.0-generate-001:predict`;
  
  const requestPayload = {
    instances: [{
      prompt: enhancementPrompt,
      image: {
        bytes_base64_encoded: imageData
      }
    }],
    parameters: {
      sampleCount: 1,
      sampleImageSize: "1K",
      aspectRatio: "1:1"
    }
  };

  console.log('🔄 Making Imagen API request...');
  console.log('📤 Request config:', {
    url: apiUrl,
    model: 'imagen-4.0-generate-001'
  });

  const imagenResponse = await fetch(apiUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-goog-api-key': geminiApiKey,
    },
    body: JSON.stringify(requestPayload)
  });

  console.log('📥 Imagen response status:', imagenResponse.status);
  console.log('📥 Imagen response headers:', Object.fromEntries(imagenResponse.headers.entries()));

  if (!imagenResponse.ok) {
    const errorText = await imagenResponse.text();
    console.error('❌ Imagen API error response:', errorText);
    throw new Error(`Imagen API error (${imagenResponse.status}): ${errorText}`);
  }

  const imagenResult = await imagenResponse.json();
  console.log('📦 Imagen response structure:', {
    predictions: imagenResult.predictions ? imagenResult.predictions.length : 'none',
    hasPrediction: !!imagenResult.predictions?.[0],
  });

  // Parse response for image data - Imagen API format
  let enhancedImageBase64: string | null = null;

  // Look for predictions format (Imagen API)
  if (imagenResult.predictions && imagenResult.predictions[0]) {
    const prediction = imagenResult.predictions[0];
    
    // Look for image data in different possible formats
    if (prediction.image && prediction.image.bytes_base64_encoded) {
      console.log('✅ Found image in image.bytes_base64_encoded');
      enhancedImageBase64 = prediction.image.bytes_base64_encoded;
    } else if (prediction.bytes_base64_encoded) {
      console.log('✅ Found image in bytes_base64_encoded');
      enhancedImageBase64 = prediction.bytes_base64_encoded;
    } else if (prediction.image_bytes) {
      console.log('✅ Found image in image_bytes');
      enhancedImageBase64 = prediction.image_bytes;
    } else if (prediction.generated_images && prediction.generated_images[0]) {
      console.log('✅ Found image in generated_images array');
      enhancedImageBase64 = prediction.generated_images[0].image_bytes || prediction.generated_images[0];
    }
  }

  if (!enhancedImageBase64) {
    console.error('❌ No image data found in Imagen response');
    console.error('Full response:', JSON.stringify(imagenResult, null, 2));
    throw new Error('No enhanced image received from Imagen API');
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