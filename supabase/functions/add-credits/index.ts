import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  const supabaseClient = createClient(
    Deno.env.get("SUPABASE_URL") ?? "",
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
    { auth: { persistSession: false } }
  );

  try {
    const { userId, credits, source = 'purchase' } = await req.json();

    if (!userId || !credits) {
      return new Response(JSON.stringify({ error: 'Missing required parameters' }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      });
    }

    // Get current credits
    const { data: userCredits } = await supabaseClient
      .from('user_credits')
      .select('credits')
      .eq('user_id', userId)
      .single();

    if (!userCredits) {
      // Create new credits record if doesn't exist
      await supabaseClient
        .from('user_credits')
        .insert({
          user_id: userId,
          credits: credits
        });
    } else {
      // Add credits to existing amount
      await supabaseClient
        .from('user_credits')
        .update({
          credits: userCredits.credits + credits
        })
        .eq('user_id', userId);
    }

    const finalCredits = (userCredits?.credits || 0) + credits;

    return new Response(JSON.stringify({ 
      success: true, 
      credits: finalCredits,
      added: credits,
      source 
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    console.error('Error adding credits:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});