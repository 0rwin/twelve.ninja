import { supabase } from './supabase'

export type TileRow = {
    id: string
    q: number
    r: number
    tile_type: string
    owner_code?: string | null
    discovered_by?: string[]
    explored?: boolean
    metadata?: Record<string, any>
}

export async function fetchTilesBounds(qMin: number, qMax: number, rMin: number, rMax: number): Promise<{ ok: true, tiles: TileRow[] } | { ok: false, error: any }> {
    try {
        const { data, error } = await supabase.functions.invoke('get-tiles', {
            body: { qMin, qMax, rMin, rMax }
        })

        if (error) return { ok: false, error }
        if (!data.ok) return { ok: false, error: data.error }

        return { ok: true, tiles: data.tiles }
    } catch (error) {
        return { ok: false, error }
    }
}

// ============================================================================
// Profile Management API
// ============================================================================

/**
 * Update the authenticated user's username
 * Server-authoritative: validates uniqueness and logs to event_log
 */
export async function updateUsername(newUsername: string): Promise<{ ok: true } | { ok: false, error: string }> {
    try {
        const { data, error } = await supabase.functions.invoke('update-username', {
            body: { newUsername }
        })

        if (error) {
            return { ok: false, error: error.message || 'Failed to update username' }
        }

        if (!data.ok) {
            return { ok: false, error: data.error || 'Failed to update username' }
        }

        return { ok: true }
    } catch (error: any) {
        return { ok: false, error: error.message || 'Failed to update username' }
    }
}

/**
 * Change the authenticated user's password
 * Server-authoritative: validates strength and logs to event_log
 */
export async function changePassword(newPassword: string): Promise<{ ok: true } | { ok: false, error: string }> {
    try {
        const { data, error } = await supabase.functions.invoke('change-password', {
            body: { newPassword }
        })

        if (error) {
            return { ok: false, error: error.message || 'Failed to change password' }
        }

        if (!data || !data.ok) {
            return { ok: false, error: (data && data.error) ? data.error : 'Failed to change password' }
        }

        return { ok: true }
    } catch (error: any) {
        return { ok: false, error: error.message || 'Failed to change password' }
    }
}

/**
 * Delete the authenticated user's account
 * Server-authoritative: permanently deletes all user data and auth
 * Requires confirmation text "DELETE"
 */
export async function deleteAccount(confirmText: string): Promise<{ ok: true } | { ok: false, error: string }> {
    try {
        const { data, error } = await supabase.functions.invoke('delete-account', {
            body: { confirmText }
        })

        if (error) {
            return { ok: false, error: error.message || 'Failed to delete account' }
        }

        if (!data.ok) {
            return { ok: false, error: data.error || 'Failed to delete account' }
        }

        return { ok: true }
    } catch (error: any) {
        return { ok: false, error: error.message || 'Failed to delete account' }
    }
}
