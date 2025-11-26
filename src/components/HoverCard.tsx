import React from 'react'
import type { TileRow } from '../lib/api'

export default function HoverCard({ tile, x, y, onClose }: { tile: TileRow, x: number, y: number, onClose: () => void }) {
    return (
        <div style={{ position: 'fixed', left: x + 12, top: y + 12, pointerEvents: 'auto' }}>
            <div className="rounded-xl bg-white/6 border border-white/8 p-3 w-56 shadow-lg">
                <div className="text-sm font-semibold text-white">{tile.tile_type.replace('_', ' ')}</div>
                <div className="text-xs text-white/70 mt-1">Owner: {tile.owner_code || 'None'}</div>
                <div className="text-xs text-white/70 mt-2">Coords: {tile.q}, {tile.r}</div>
            </div>
        </div>
    )
}
