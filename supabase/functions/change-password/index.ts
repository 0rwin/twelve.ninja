// @deno-types="https://deno.land/std@0.177.0/http/server.ts"
import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
// @deno-types="https://esm.sh/@supabase/supabase-js@2"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

serve(async (req: Request) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response('ok', {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST',
        'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
      }
    });
  }

  try {
    // Get authorization header
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return new Response(
        JSON.stringify({ ok: false, error: 'Unauthorized' }),
        {
          status: 401,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }

    // Create Supabase client with service role
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Verify the user's JWT token
    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);

    if (authError || !user) {
      return new Response(
        JSON.stringify({ ok: false, error: 'Invalid authentication' }),
        {
          status: 401,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }


    // Parse request body safely
    let body;
    try {
      body = await req.json();
    } catch (err) {
      return new Response(
        JSON.stringify({ ok: false, error: 'Invalid JSON body' }),
        {
          status: 400,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }
    const { newPassword } = body;

    // Server-side validation
    if (!newPassword || typeof newPassword !== 'string') {
      return new Response(
        JSON.stringify({ ok: false, error: 'Password is required' }),
        {
          status: 400,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }

    if (newPassword.length < 6) {
      return new Response(
        JSON.stringify({ ok: false, error: 'Password must be at least 6 characters' }),
        {
          status: 400,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }

    // Optional: Add stronger password validation
    // const hasUppercase = /[A-Z]/.test(newPassword);
    // const hasLowercase = /[a-z]/.test(newPassword);
    // const hasNumber = /[0-9]/.test(newPassword);
    // if (!hasUppercase || !hasLowercase || !hasNumber) {
    //   return new Response(
    //     JSON.stringify({ ok: false, error: 'Password must contain uppercase, lowercase, and numbers' }),
    //     { status: 400, headers: { 'Content-Type': 'application/json' } }
    //   );
    // }

    // Update password using admin API
    const { error: updateError } = await supabase.auth.admin.updateUserById(
      user.id,
      {
        password: newPassword
      }
    );

    if (updateError) {
      console.error('Error updating password:', updateError);
      return new Response(
        JSON.stringify({ ok: false, error: 'Failed to update password' }),
        {
          status: 500,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }

    // Log event to event_log (don't include the actual password!)
    await supabase.from('event_log').insert({
      player_id: user.id,
      event_type: 'password_changed',
      payload: {
        changed_at: new Date().toISOString(),
        user_agent: req.headers.get('user-agent') || 'unknown'
      }
    });

    return new Response(
      JSON.stringify({ ok: true }),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      }
    );

  } catch (error) {
    console.error('Unexpected error:', error);
    return new Response(
      JSON.stringify({ ok: false, error: 'Internal server error' }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  }
});
