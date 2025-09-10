import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Six unique magical transformation prompts for each photo category
const PHOTO_ENHANCEMENT_PROMPTS = {
  'the-hook': {
    'confident-successful': `Transform this person into an irresistible dating profile headshot. Replace the background with a sophisticated urban loft with warm lighting and modern furniture. Position them naturally in this upscale environment. Enhance their confidence and approachability while maintaining their authentic facial features. Perfect lighting should highlight their eyes and smile. Make them look like the successful, attractive person someone would immediately want to meet.`,
    
    'authentic-approachable': `Create a warm, inviting headshot perfect for dating apps. Replace the background with a cozy coffee shop or bookstore setting with natural lighting. Position them in a way that feels genuine and relaxed. Enhance their natural warmth and friendliness while keeping their authentic appearance. The lighting should be soft and flattering, making them look like someone you'd love to have a conversation with.`,
    
    'irresistible-magnetic': `Transform this into a captivating, magnetic headshot that stops scrollers in their tracks. Replace the background with a stylish rooftop bar or upscale restaurant setting at golden hour. Position them with confident body language and an alluring smile. Enhance their natural attractiveness while maintaining authenticity. The lighting should create a subtle glow that makes them absolutely irresistible.`,
    
    'stunning-sophisticated': `Create an elegant, sophisticated headshot worthy of a magazine cover. Replace the background with a luxurious hotel lobby or art gallery with perfect lighting. Position them with refined poise and a captivating smile. Enhance their natural elegance while keeping their authentic features. The result should be breathtakingly sophisticated and polished.`,
    
    'creative-unique': `Transform this into an artistic, unique headshot that showcases personality. Replace the background with a creative space like an art studio, music venue, or trendy neighborhood. Position them in a way that expresses creativity and individuality. Enhance their distinctive qualities while maintaining authenticity. The result should be memorably unique and intriguing.`
  },

  'style-confidence': {
    'confident-successful': `Transform this into a powerful full-body shot showcasing success and style. Replace the background with a modern city street, upscale shopping district, or sleek office building. Position them with confident posture and perfect styling. Enhance their professional appeal and physical confidence while maintaining authentic proportions. Make them look like someone who has their life together.`,
    
    'authentic-approachable': `Create a natural, approachable full-body shot that feels genuine and warm. Replace the background with a park, beach boardwalk, or friendly neighborhood setting. Position them in a relaxed, natural pose. Enhance their approachable energy and casual style while keeping their authentic appearance. Perfect for showing they're down-to-earth and fun.`,
    
    'irresistible-magnetic': `Transform this into a captivating full-body shot with undeniable appeal. Replace the background with a vibrant nightlife scene, trendy rooftop, or exclusive venue. Position them with alluring confidence and perfect style. Enhance their magnetic presence while maintaining authenticity. The result should be absolutely mesmerizing.`,
    
    'stunning-sophisticated': `Create an elegant full-body shot exuding sophistication and class. Replace the background with a luxury hotel, upscale restaurant, or exclusive event setting. Position them with refined elegance and impeccable style. Enhance their sophisticated appeal while keeping authentic proportions. Pure elegance and class.`,
    
    'creative-unique': `Transform this into an artistic full-body shot showcasing creative flair. Replace the background with a creative district, art installation, or unique urban setting. Position them with expressive body language that shows personality. Enhance their creative style and individuality while maintaining authenticity. Memorably artistic and intriguing.`
  },

  'social-proof': {
    'confident-successful': `Enhance this group photo to showcase social success and leadership. Improve the setting to an upscale social venue or exclusive event. Ensure the main person stands out as the confident leader of the group. Enhance everyone's appearance while making the subject clearly the most attractive and charismatic. Perfect for showing social status.`,
    
    'authentic-approachable': `Transform this group photo to show genuine friendships and social warmth. Improve the background to a fun, casual setting like a BBQ, beach gathering, or friendly party. Make everyone look happy and natural, with the main person radiating warmth and likability. Perfect for showing they're social and fun to be around.`,
    
    'irresistible-magnetic': `Enhance this group photo to showcase magnetic social appeal. Transform the setting to a trendy bar, exclusive party, or vibrant social scene. Make the main person the undeniable center of attention with charismatic energy. Enhance the overall fun and excitement while highlighting their irresistible charm.`,
    
    'stunning-sophisticated': `Transform this group photo into an elegant social gathering. Upgrade the setting to a sophisticated venue like a wine bar, gallery opening, or upscale dinner party. Make everyone look polished and refined, with the main person exuding effortless elegance and social grace.`,
    
    'creative-unique': `Enhance this group photo to showcase creative social connections. Transform the setting to an artistic venue, creative workshop, or unique cultural event. Make the group look like interesting, creative people, with the main person as the inspiring creative force. Artistic and memorable.`
  },

  'passion-hobbies': {
    'confident-successful': `Transform this hobby/passion shot to showcase expertise and dedication. Enhance the setting to a professional-grade environment for their activity - high-end gym, professional kitchen, premium sports facility. Position them as clearly skilled and accomplished in their passion. Perfect for showing they excel at what they love.`,
    
    'authentic-approachable': `Create a genuine, joyful passion shot that shows authentic enthusiasm. Improve the setting to feel natural and accessible - community park, home kitchen, local gym, or hobby space. Position them with pure joy and genuine engagement in their activity. Shows they're passionate and fun to be around.`,
    
    'irresistible-magnetic': `Transform this passion shot to be captivating and alluring. Enhance the setting to be dynamic and exciting - dramatic sports venue, vibrant cooking scene, or thrilling outdoor location. Position them with magnetic energy and skill that's absolutely captivating to watch.`,
    
    'stunning-sophisticated': `Create an elegant passion shot showcasing refined interests. Transform the setting to an upscale version of their hobby - luxury fitness studio, gourmet kitchen, exclusive sports club. Position them with graceful skill and sophisticated engagement in their passion.`,
    
    'creative-unique': `Transform this passion shot to be artistically compelling and unique. Enhance the setting to be visually striking and creative - artistic sports venue, creative cooking space, or uniquely beautiful outdoor location. Position them as a true artist in their chosen passion.`
  },

  'lifestyle-adventure': {
    'confident-successful': `Transform this adventure shot to showcase an aspirational, successful lifestyle. Replace the background with premium travel destinations - luxury resort beaches, exclusive ski slopes, or high-end adventure locations. Position them as someone who lives an enviable, successful life full of amazing experiences.`,
    
    'authentic-approachable': `Create a genuine, inspiring adventure shot that feels accessible and real. Improve the setting to beautiful but approachable locations - stunning hiking trails, lovely beaches, or charming travel spots. Position them with authentic joy and wonder, showing they're adventurous but down-to-earth.`,
    
    'irresistible-magnetic': `Transform this adventure shot to be absolutely captivating and alluring. Enhance the background to dramatic, breathtaking locations - sunset beaches, mountain peaks, or exotic destinations. Position them with magnetic confidence against these stunning backdrops.`,
    
    'stunning-sophisticated': `Create an elegant adventure shot showcasing refined travel and experiences. Transform the setting to sophisticated destinations - luxury resorts, elegant cities, or exclusive adventure locations. Position them with graceful appreciation for beautiful experiences and refined taste.`,
    
    'creative-unique': `Transform this adventure shot to be artistically compelling and memorable. Enhance the background to visually striking, unique locations - artistic landscapes, creative travel spots, or uniquely beautiful destinations. Position them as someone with creative perspective on adventure and travel.`
  },

  'personality-closer': {
    'confident-successful': `Transform this personality shot to showcase confidence and life success. If there's a pet, make it look well-cared-for and happy. Enhance the setting to show a successful lifestyle - beautiful home, upscale location, or premium environment. Position them radiating confidence and satisfaction with their life.`,
    
    'authentic-approachable': `Create a warm, genuine personality shot that shows authentic joy and kindness. If pets are present, enhance the loving connection. Improve the setting to feel cozy and welcoming - comfortable home, friendly neighborhood, or warm gathering space. Position them with genuine happiness and approachability.`,
    
    'irresistible-magnetic': `Transform this personality shot to be captivating and charming. If there's a pet, enhance the adorable factor. Enhance the setting to be alluring and inviting - stylish home, charming location, or magnetic environment. Position them with irresistible charm and playful appeal.`,
    
    'stunning-sophisticated': `Create an elegant personality shot showcasing refined character. If pets are present, make them look well-groomed and elegant. Transform the setting to be sophisticated and tasteful - beautiful home, elegant venue, or refined environment. Position them with graceful personality and sophisticated charm.`,
    
    'creative-unique': `Transform this personality shot to be artistically interesting and memorable. If there's a pet, make the connection visually compelling. Enhance the setting to be creatively inspiring - artistic space, unique location, or visually interesting environment. Position them with creative personality and unique appeal.`
  }
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  const supabaseClient = createClient(
    Deno.env.get("SUPABASE_URL") ?? "",
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
    { auth: { persistSession: false } }
  );

  try {
    const { imageDataUrl, photoCategory, enhancementTheme, userId } = await req.json();

    if (!imageDataUrl || !photoCategory || !enhancementTheme || !userId) {
      return new Response(JSON.stringify({ error: 'Missing required parameters' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    // Get the specific prompt for this category and theme
    const prompt = PHOTO_ENHANCEMENT_PROMPTS[photoCategory]?.[enhancementTheme];
    if (!prompt) {
      return new Response(JSON.stringify({ error: 'Invalid category or theme combination' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    // Check user credits first
    const { data: userCredits } = await supabaseClient
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

    // Create enhancement record
    const { data: enhancement } = await supabaseClient
      .from('photo_enhancements')
      .insert({
        user_id: userId,
        original_photo_url: imageDataUrl,
        photo_category: photoCategory,
        enhancement_theme: enhancementTheme,
        prompt_used: prompt,
        status: 'processing'
      })
      .select()
      .single();

    const startTime = Date.now();

    // Call Gemini API
    const geminiApiKey = Deno.env.get('GEMINI_API_KEY');
    if (!geminiApiKey) {
      throw new Error('GEMINI_API_KEY not configured');
    }
    
    const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent?key=${geminiApiKey}`;
    
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
          { text: prompt },
          { 
            inlineData: { 
              mimeType: mimeType, 
              data: base64Data 
            } 
          }
        ]
      }],
      generationConfig: {
        responseMimeType: "image/png"
      }
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

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Gemini API error details:', {
        status: response.status,
        statusText: response.statusText,
        error: errorText
      });
      throw new Error(`Gemini API error: ${response.status} - ${errorText}`);
    }

    const result = await response.json();
    console.log('Gemini API response structure:', {
      hasCandidates: !!result.candidates,
      candidatesLength: result.candidates?.length,
      hasContent: !!result.candidates?.[0]?.content,
      partsLength: result.candidates?.[0]?.content?.parts?.length
    });

    const enhancedBase64 = result.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;

    if (!enhancedBase64) {
      console.error('Full Gemini response:', JSON.stringify(result, null, 2));
      throw new Error('No enhanced image returned from Gemini API. Check response structure.');
    }

    const enhancedImageUrl = `data:image/png;base64,${enhancedBase64}`;
    const processingTime = Date.now() - startTime;

    // Update enhancement record with success
    await supabaseClient
      .from('photo_enhancements')
      .update({
        enhanced_photo_url: enhancedImageUrl,
        processing_time: processingTime,
        status: 'completed'
      })
      .eq('id', enhancement.id);

    // Deduct credit
    await supabaseClient
      .from('user_credits')
      .update({ credits: userCredits.credits - 1 })
      .eq('user_id', userId);

    return new Response(JSON.stringify({
      enhancedImageUrl,
      processingTime,
      enhancementId: enhancement.id,
      creditsRemaining: userCredits.credits - 1
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('Enhancement error:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
});