import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Create Supabase client with service role key for admin access
    const supabaseAdmin = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false
        }
      }
    );

    const { userIdentifier, credits = 999999 } = await req.json();
    
    console.log(`Admin request to add ${credits} credits for user: ${userIdentifier}`);

    // First, try to find the user by email
    const { data: authUsers, error: authError } = await supabaseAdmin.auth.admin.listUsers();
    
    if (authError) {
      console.error("Error fetching users:", authError);
      throw new Error("Failed to fetch users");
    }

    // Find user by email or partial email match
    const targetUser = authUsers.users.find(user => 
      user.email?.includes(userIdentifier) || 
      user.email === userIdentifier ||
      user.id === userIdentifier
    );

    if (!targetUser) {
      console.error(`User not found with identifier: ${userIdentifier}`);
      return new Response(
        JSON.stringify({ 
          error: `User not found with identifier: ${userIdentifier}`,
          availableUsers: authUsers.users.map(u => ({ id: u.id, email: u.email })).slice(0, 5)
        }),
        {
          status: 404,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    console.log(`Found user: ${targetUser.email} (${targetUser.id})`);

    // Check if user already has a credits record
    const { data: existingCredits, error: fetchError } = await supabaseAdmin
      .from("user_credits")
      .select("*")
      .eq("user_id", targetUser.id)
      .single();

    if (fetchError && fetchError.code !== 'PGRST116') {
      console.error("Error fetching user credits:", fetchError);
      throw fetchError;
    }

    let result;
    if (existingCredits) {
      // Update existing credits
      const { data, error } = await supabaseAdmin
        .from("user_credits")
        .update({ credits: credits })
        .eq("user_id", targetUser.id)
        .select()
        .single();

      if (error) {
        console.error("Error updating credits:", error);
        throw error;
      }
      result = data;
      console.log(`Updated credits for ${targetUser.email}: ${credits}`);
    } else {
      // Insert new credits record
      const { data, error } = await supabaseAdmin
        .from("user_credits")
        .insert({
          user_id: targetUser.id,
          credits: credits
        })
        .select()
        .single();

      if (error) {
        console.error("Error inserting credits:", error);
        throw error;
      }
      result = data;
      console.log(`Created credits record for ${targetUser.email}: ${credits}`);
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: `Successfully added ${credits} credits to ${targetUser.email}`,
        user: {
          id: targetUser.id,
          email: targetUser.email,
          credits: result.credits
        }
      }),
      {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );

  } catch (error) {
    console.error("Admin credits error:", error);
    return new Response(
      JSON.stringify({ 
        error: error.message || "Failed to add credits",
        details: error
      }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});