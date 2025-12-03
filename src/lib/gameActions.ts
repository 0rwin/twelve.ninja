import { supabase } from './supabase';

/**
 * Action Types
 */
export type ActionType = 'scout' | 'forage' | 'rest';

export interface ActionResult {
  success: boolean;
  message: string;
  rewards?: {
    xp?: number;
    ryo?: number;
    items?: string[];
  };
  damage?: number;
  newStats?: {
    hp?: number;
    stamina?: number;
    ryo?: number;
  };
}

/**
 * Execute an action on a tile
 * Calls Supabase RPC function to process the action server-side
 */
export async function executeAction(
  playerId: string,
  actionType: ActionType,
  tileId: string
): Promise<ActionResult> {
  try {
    const { data, error } = await supabase.rpc('execute_action', {
      p_player_id: playerId,
      p_action_type: actionType,
      p_tile_id: tileId
    });

    if (error) {
      console.error('Supabase RPC error:', error);
      return {
        success: false,
        message: 'Failed to execute action'
      };
    }

    return {
      success: true,
      message: data?.message || 'Action completed',
      rewards: data?.rewards,
      damage: data?.damage,
      newStats: data?.new_stats
    };
  } catch (error) {
    console.error('Error executing action:', error);
    return {
      success: false,
      message: 'An error occurred while executing the action'
    };
  }
}

/**
 * Get detailed result of an action (rewards, encounters, etc.)
 * Useful for displaying a detailed result screen
 */
export async function getActionDetails(
  actionType: ActionType,
  tileId: string,
  difficulty: 'Easy' | 'Medium' | 'Hard' | 'Very Hard'
): Promise<ActionResult> {
  try {
    const { data, error } = await supabase.rpc('get_action_details', {
      p_action_type: actionType,
      p_tile_id: tileId,
      p_difficulty: difficulty
    });

    if (error) {
      console.error('Supabase RPC error:', error);
      return {
        success: false,
        message: 'Failed to get action details'
      };
    }

    return {
      success: true,
      message: data?.narrative || 'You completed the action',
      rewards: data?.rewards,
      damage: data?.danger_damage
    };
  } catch (error) {
    console.error('Error getting action details:', error);
    return {
      success: false,
      message: 'Could not retrieve action details'
    };
  }
}

/**
 * Update player stats after an action
 * Applies rewards and damage to player record
 */
export async function updatePlayerAfterAction(
  playerId: string,
  updates: {
    xpGain?: number;
    ryoGain?: number;
    hpLoss?: number;
    staminaLoss?: number;
    staminaGain?: number;
    itemsGained?: string[];
  }
): Promise<{ success: boolean; message: string }> {
  try {
    const { data, error } = await supabase.rpc('update_player_stats', {
      p_player_id: playerId,
      p_xp_gain: updates.xpGain || 0,
      p_ryo_gain: updates.ryoGain || 0,
      p_hp_loss: updates.hpLoss || 0,
      p_stamina_loss: updates.staminaLoss || 0,
      p_stamina_gain: updates.staminaGain || 0
    });

    if (error) {
      console.error('Supabase RPC error:', error);
      return {
        success: false,
        message: 'Failed to update player stats'
      };
    }

    return {
      success: true,
      message: 'Player stats updated successfully'
    };
  } catch (error) {
    console.error('Error updating player stats:', error);
    return {
      success: false,
      message: 'Could not update player stats'
    };
  }
}

/**
 * Fetch current player state from database
 * Ensures UI reflects server state
 */
export async function fetchPlayerState(
  playerId: string
): Promise<{
  success: boolean;
  player?: any;
  message: string;
}> {
  try {
    const { data, error } = await supabase
      .from('players')
      .select('*')
      .eq('id', playerId)
      .single();

    if (error) {
      console.error('Supabase fetch error:', error);
      return {
        success: false,
        message: 'Failed to fetch player state'
      };
    }

    return {
      success: true,
      player: data,
      message: 'Player state fetched successfully'
    };
  } catch (error) {
    console.error('Error fetching player state:', error);
    return {
      success: false,
      message: 'Could not fetch player state'
    };
  }
}

/**
 * Get tile data from database
 * Useful for dynamic tile information
 */
export async function getTileData(tileId: string): Promise<{
  success: boolean;
  tile?: any;
  message: string;
}> {
  try {
    const { data, error } = await supabase
      .from('tiles')
      .select('*')
      .eq('id', tileId)
      .single();

    if (error) {
      console.error('Supabase fetch error:', error);
      return {
        success: false,
        message: 'Failed to fetch tile data'
      };
    }

    return {
      success: true,
      tile: data,
      message: 'Tile data fetched successfully'
    };
  } catch (error) {
    console.error('Error fetching tile data:', error);
    return {
      success: false,
      message: 'Could not fetch tile data'
    };
  }
}
