import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

serve(async (req) => {
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

    // Parse request body
    const body = await req.json();
    const { newUsername } = body;

    // Server-side validation
    if (!newUsername || typeof newUsername !== 'string') {
      return new Response(
        JSON.stringify({ ok: false, error: 'Username is required' }),
        {
          status: 400,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }

    if (newUsername.length < 3 || newUsername.length > 20) {
      return new Response(
        JSON.stringify({ ok: false, error: 'Username must be 3-20 characters' }),
        {
          status: 400,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }

    // Check if username already exists
    const { data: existingUser, error: checkError } = await supabase
      .from('players')
      .select('id')
      .eq('username', newUsername)
      .neq('id', user.id)
      .maybeSingle();

    if (checkError) {
      console.error('Error checking username:', checkError);
      return new Response(
        JSON.stringify({ ok: false, error: 'Database error' }),
        {
          status: 500,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }

    if (existingUser) {
      return new Response(
        JSON.stringify({ ok: false, error: 'Username already taken' }),
        {
          status: 409,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }

    // Get old username for event log
    const { data: currentPlayer } = await supabase
      .from('players')
      .select('username')
      .eq('id', user.id)
      .single();

    const oldUsername = currentPlayer?.username || 'unknown';

    // Update username in players table
    const { error: updateError } = await supabase
      .from('players')
      .update({ username: newUsername })
      .eq('id', user.id);

    if (updateError) {
      console.error('Error updating username:', updateError);
      return new Response(
        JSON.stringify({ ok: false, error: 'Failed to update username' }),
        {
          status: 500,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }

    // Update auth metadata
    const { error: metadataError } = await supabase.auth.admin.updateUserById(
      user.id,
      {
        user_metadata: { username: newUsername }
      }
    );

    if (metadataError) {
      console.error('Error updating metadata:', metadataError);
      // Non-fatal - username is updated in players table
    }

    // Log event to event_log
    await supabase.from('event_log').insert({
      player_id: user.id,
      event_type: 'username_changed',
      payload: {
        old_username: oldUsername,
        new_username: newUsername,
        changed_at: new Date().toISOString()
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
