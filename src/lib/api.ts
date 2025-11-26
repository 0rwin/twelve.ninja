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
    const res = await fetch('/.netlify/functions/get-tiles', { // adjust path to supabase Edge Functions URL
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ qMin, qMax, rMin, rMax })
    })
    const payload = await res.json()
    if (!payload.ok) return { ok: false, error: payload.error }
    return { ok: true, tiles: payload.tiles }
}
