import React from 'react'
import { axialToPixel } from '../lib/hex'
import type { TileRow } from '../lib/api'

export default function FogLayer({
    tiles,
    origin,
    hexWidth = 55,
    hexHeight = 63
}: {
    tiles: TileRow[];
    origin: { x: number; y: number };
    hexWidth?: number;
    hexHeight?: number;
}) {
    return (
        <div className="absolute inset-0 pointer-events-none">
            {tiles.filter(t => !t.explored).map(t => {
                const p = axialToPixel({ q: t.q, r: t.r }, origin.x, origin.y, hexWidth, hexHeight)
                return (
                    <div key={t.id}
                        className="absolute rounded-lg"
                        style={{
                            left: p.x - hexWidth / 2,
                            top: p.y - hexHeight / 2,
                            width: hexWidth,
                            height: hexHeight * 1.15,
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
