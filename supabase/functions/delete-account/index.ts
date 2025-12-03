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
    const { confirmText } = body;

    // Server-side confirmation validation
    if (confirmText !== 'DELETE') {
      return new Response(
        JSON.stringify({ ok: false, error: 'Confirmation text must be "DELETE"' }),
        {
          status: 400,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }

    // Get player data before deletion for final event log
    const { data: player } = await supabase
      .from('players')
      .select('username, email, level, xp')
      .eq('id', user.id)
      .single();

    // Log final event BEFORE deletion
    await supabase.from('event_log').insert({
      player_id: user.id,
      event_type: 'account_deleted',
      payload: {
        username: player?.username || 'unknown',
        email: user.email || 'unknown',
        level: player?.level || 0,
        xp: player?.xp || 0,
        deleted_at: new Date().toISOString(),
        user_agent: req.headers.get('user-agent') || 'unknown'
      }
    });

    // Delete player record (CASCADE will delete related records)
    // Note: Based on your schema, players.id has ON DELETE CASCADE for encounters, etc.
    const { error: deletePlayerError } = await supabase
      .from('players')
      .delete()
      .eq('id', user.id);

    if (deletePlayerError) {
      console.error('Error deleting player:', deletePlayerError);
      return new Response(
        JSON.stringify({ ok: false, error: 'Failed to delete player data' }),
        {
          status: 500,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }

    // Delete auth user (this is the final step)
    const { error: deleteAuthError } = await supabase.auth.admin.deleteUser(user.id);

    if (deleteAuthError) {
      console.error('Error deleting auth user:', deleteAuthError);
      return new Response(
        JSON.stringify({ ok: false, error: 'Failed to delete authentication' }),
        {
          status: 500,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }

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
