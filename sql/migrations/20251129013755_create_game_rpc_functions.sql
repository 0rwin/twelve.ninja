-- Game RPC Functions for server-authoritative game logic
-- These functions handle all game state changes from the server side

-- ============================================================================
-- execute_action: Main function for processing player actions on tiles
-- ============================================================================
create or replace function execute_action(
  p_player_id uuid,
  p_action_type text,
  p_tile_id uuid
)
returns jsonb as $$
declare
  v_player record;
  v_tile record;
  v_stamina_cost int := 10; -- default; may be overridden per action
  v_xp_reward int := 0;
  v_ryo_reward int := 0;
  v_result jsonb;
  v_success boolean := true;
  v_message text;
  v_match_id text;
begin
  -- Authorization: the caller must match the player being acted on
  if auth.uid() is null or auth.uid() <> p_player_id then
    return jsonb_build_object(
      'success', false,
      'message', 'Unauthorized'
    );
  end if;
  -- Fetch player data
  select * into v_player from players where id = p_player_id;
  if not found then
    return jsonb_build_object(
      'success', false,
      'message', 'Player not found'
    );
  end if;

  -- Fetch tile data
  select * into v_tile from tiles where id = p_tile_id;
  if not found then
    return jsonb_build_object(
      'success', false,
      'message', 'Tile not found'
    );
  end if;

  -- Determine action effects and costs
  case p_action_type
    when 'scout' then
      v_stamina_cost := 10;
      v_xp_reward := 5;
      v_ryo_reward := 0;
      v_message := 'Scouted the area and gained knowledge';
    when 'forage' then
      v_stamina_cost := 10;
      v_xp_reward := 3;
      -- Random reward 10-30 inclusive
      v_ryo_reward := 10 + floor(random() * 21)::int;
      v_message := 'Foraged and found ' || v_ryo_reward::text || ' ryo';
    when 'rest' then
      v_stamina_cost := 0; -- Rest costs 0 stamina
      v_xp_reward := 1;
      v_ryo_reward := 0;
      v_message := 'Rested and recovered stamina';
    else
      return jsonb_build_object(
        'success', false,
        'message', 'Unknown action type'
      );
  end case;

  -- Check stamina after resolving cost (so rest can be performed even when low)
  if v_stamina_cost > 0 and v_player.stamina < v_stamina_cost then
    return jsonb_build_object(
      'success', false,
      'message', 'Not enough stamina'
    );
  end if;

  -- Generate precise unique match_id for audit correlation
  v_match_id := gen_random_uuid()::text;

  -- Apply action-specific effects
  if p_action_type = 'scout' then
    -- Mark tile as explored
    update tiles set explored = true where id = p_tile_id;
  elsif p_action_type = 'rest' then
    -- Restore stamina (cap at max_stamina)
    update players
    set stamina = least(stamina + 20, max_stamina)
    where id = p_player_id;
  end if;

  -- Deduct stamina and award rewards (except for rest which adds stamina)
  if p_action_type != 'rest' then
    update players
    set
      stamina = stamina - v_stamina_cost,
      xp = xp + v_xp_reward,
      ryo = ryo + v_ryo_reward
    where id = p_player_id;
  else
    update players
    set
      xp = xp + v_xp_reward
    where id = p_player_id;
  end if;

  -- Log event to event_log for audit trail
  insert into event_log (player_id, event_type, payload, tile_id, match_id)
  values (
    p_player_id,
    'action_executed',
    jsonb_build_object(
      'action_type', p_action_type,
      'stamina_cost', v_stamina_cost,
      'xp_reward', v_xp_reward,
      'ryo_reward', v_ryo_reward,
      'success', v_success
    ),
    p_tile_id,
    v_match_id
  );

  -- Build result
  v_result := jsonb_build_object(
    'success', v_success,
    'message', v_message,
    'rewards', jsonb_build_object(
      'xp', v_xp_reward,
      'ryo', v_ryo_reward
    ),
    'new_stats', jsonb_build_object(
      'stamina', (select stamina from players where id = p_player_id),
      'ryo', (select ryo from players where id = p_player_id)
    )
  );

  return v_result;
end;
$$ language plpgsql security definer;

-- ============================================================================
-- get_action_details: Preview action results without executing
-- ============================================================================
create or replace function get_action_details(
  p_action_type text,
  p_tile_id uuid
)
returns jsonb as $$
declare
  v_tile record;
  v_stamina_cost int := 10;
  v_estimated_xp int := 0;
  v_estimated_ryo int := 0;
  v_description text;
begin
  -- Fetch tile data
  select * into v_tile from tiles where id = p_tile_id;
  if not found then
    return jsonb_build_object(
      'success', false,
      'message', 'Tile not found'
    );
  end if;

  -- Estimate rewards and costs based on action type
  case p_action_type
    when 'scout' then
      v_stamina_cost := 10;
      v_estimated_xp := 5;
      v_estimated_ryo := 0;
      v_description := 'Scout the area to reveal information and gain experience';

    when 'forage' then
      v_stamina_cost := 10;
      v_estimated_xp := 3;
      v_estimated_ryo := 20; -- Average of 10-30 inclusive
      v_description := 'Search for resources and currency (10-30 ryo)';

    when 'rest' then
      v_estimated_xp := 1;
      v_estimated_ryo := 0;
      v_stamina_cost := 0;
      v_description := 'Recover stamina and take a breather';

    else
      return jsonb_build_object(
        'success', false,
        'message', 'Unknown action type'
      );
  end case;

  -- Return details
  return jsonb_build_object(
    'success', true,
    'action_type', p_action_type,
    'description', v_description,
    'stamina_cost', v_stamina_cost,
    'estimated_rewards', jsonb_build_object(
      'xp', v_estimated_xp,
      'ryo', v_estimated_ryo
    ),
    'tile_type', v_tile.tile_type
  );
end;
$$ language plpgsql security definer;

-- ============================================================================
-- update_player_stats: Direct stat update (use with caution, prefer execute_action)
-- ============================================================================
create or replace function update_player_stats(
  p_player_id uuid,
  p_stamina_change int default null,
  p_xp_change int default null,
  p_ryo_change int default null
)
returns jsonb as $$
declare
  v_player record;
begin
  -- Fetch current player stats
  select * into v_player from players where id = p_player_id;
  if not found then
    return jsonb_build_object(
      'success', false,
      'message', 'Player not found'
    );
  end if;

  -- Apply changes (with bounds checking)
  update players
  set
    stamina = case
      when p_stamina_change is not null then
        least(greatest(stamina + p_stamina_change, 0), max_stamina)
      else stamina
    end,
    xp = case
      when p_xp_change is not null then
        greatest(xp + p_xp_change, 0)
      else xp
    end,
    ryo = case
      when p_ryo_change is not null then
        greatest(ryo + p_ryo_change, 0)
      else ryo
    end
  where id = p_player_id;

  -- Log event
  insert into event_log (player_id, event_type, payload)
  values (
    p_player_id,
    'stats_updated',
    jsonb_build_object(
      'stamina_change', p_stamina_change,
      'xp_change', p_xp_change,
      'ryo_change', p_ryo_change
    )
  );

  -- Return updated stats
  return jsonb_build_object(
    'success', true,
    'message', 'Stats updated successfully',
    'new_stats', (
      select jsonb_build_object(
        'stamina', stamina,
        'xp', xp,
        'ryo', ryo
      )
      from players
      where id = p_player_id
    )
  );
end;
$$ language plpgsql security definer;

-- Grant execute permissions to authenticated users
grant execute on function execute_action(uuid, text, uuid) to authenticated;
grant execute on function get_action_details(text, uuid) to authenticated;
grant execute on function update_player_stats(uuid, int, int, int) to authenticated;
