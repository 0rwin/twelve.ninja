import React from 'react'
import { axialToPixel } from '../lib/hex'
import type { TileRow } from '../lib/api'

export default function FogLayer({ tiles, origin }: { tiles: TileRow[], origin: { x: number, y: number } }) {
    return (
        <div className="absolute inset-0 pointer-events-none">
            {tiles.filter(t => !t.explored).map(t => {
                const p = axialToPixel({ q: t.q, r: t.r }, origin.x, origin.y)
                return (
                    <div key={t.id}
                        className="absolute rounded-lg"
                        style={{
                            left: p.x - 48, // center offsets for HEX_WIDTH/HEIGHT
                            top: p.y - 55,
                            width: 96,
                            height: 110,
                            background: 'linear-gradient(180deg, rgba(3,3,3,0.75), rgba(3,3,3,0.85))',
                            mixBlendMode: 'multiply',
                            backdropFilter: 'blur(2px)'
                        }}
                    />
                )
            })}
        </div>
    )
}
