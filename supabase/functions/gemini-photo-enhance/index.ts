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
  console.log('🤖 === CALLING GEMINI API ===');
  
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

  const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-image-preview:generateContent?key=${geminiApiKey}`;
  
  const requestPayload = {
    contents: [{
      parts: [
        {
          text: enhancementPrompt
        },
        {
          inlineData: {
            mimeType: "image/jpeg",
            data: imageData
          }
        }
      ]
    }],
    generationConfig: {
      temperature: 0.7,
      topK: 32,
      topP: 1,
      maxOutputTokens: 8192,
      responseMimeType: "image/jpeg"
    }
  };

  console.log('🔄 Making Gemini API request...');
  console.log('📤 Request config:', {
    url: geminiUrl.replace(geminiApiKey, 'HIDDEN'),
    temperature: requestPayload.generationConfig.temperature,
    responseMimeType: requestPayload.generationConfig.responseMimeType
  });

  const geminiResponse = await fetch(geminiUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(requestPayload)
  });

  console.log('📥 Gemini response status:', geminiResponse.status);
  console.log('📥 Gemini response headers:', Object.fromEntries(geminiResponse.headers.entries()));

  if (!geminiResponse.ok) {
    const errorText = await geminiResponse.text();
    console.error('❌ Gemini API error response:', errorText);
    throw new Error(`Gemini API error (${geminiResponse.status}): ${errorText}`);
  }

  const geminiResult = await geminiResponse.json();
  console.log('📦 Gemini response structure:', {
    candidates: geminiResult.candidates ? geminiResult.candidates.length : 'none',
    hasContent: !!geminiResult.candidates?.[0]?.content,
    hasParts: !!geminiResult.candidates?.[0]?.content?.parts?.length
  });

  // Parse response for image data - multiple strategies
  let enhancedImageBase64: string | null = null;

  // Strategy 1: Look for inline data in parts
  if (geminiResult.candidates?.[0]?.content?.parts) {
    for (const part of geminiResult.candidates[0].content.parts) {
      if (part.inlineData?.data) {
        console.log('✅ Found image in inlineData');
        enhancedImageBase64 = part.inlineData.data;
        break;
      }
    }
  }

  // Strategy 2: Look for direct image data
  if (!enhancedImageBase64 && geminiResult.image) {
    console.log('✅ Found image in direct image field');
    enhancedImageBase64 = geminiResult.image;
  }

  // Strategy 3: Look for base64 data in text response
  if (!enhancedImageBase64 && geminiResult.candidates?.[0]?.content?.parts?.[0]?.text) {
    const textContent = geminiResult.candidates[0].content.parts[0].text;
    const base64Match = textContent.match(/data:image\/[^;]+;base64,([A-Za-z0-9+/=]+)/);
    if (base64Match) {
      console.log('✅ Found base64 image in text response');
      enhancedImageBase64 = base64Match[1];
    }
  }

  if (!enhancedImageBase64) {
    console.error('❌ No image data found in response');
    console.error('Full response:', JSON.stringify(geminiResult, null, 2));
    throw new Error('No enhanced image received from Gemini API');
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
    const result = await performImageEnhancement(testImageDataUrl, 'Simple test enhancement');
    
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