import React from 'react'
import type { TileRow } from '../lib/api'

export default function TileHitbox({ tile, left, top, onHover, onLeave, onClick }:
    { tile: TileRow, left: number, top: number, onHover: (e: MouseEvent) => void, onLeave: () => void, onClick: () => void }) {
    return (
        <div
            className="absolute transform -translate-x-1/2 -translate-y-1/2 w-[96px] h-[110px] cursor-pointer"
            style={{ left, top }}
            onMouseEnter={(e) => onHover(e as any as MouseEvent)}
            onMouseLeave={() => onLeave()}
            onClick={() => onClick()}
            role="button"
            aria-label={`Tile ${tile.tile_type} (${tile.q},${tile.r})`}
        />
    )
}
