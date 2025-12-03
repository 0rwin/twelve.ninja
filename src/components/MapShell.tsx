import React, { useEffect, useRef, useState } from 'react'
import { fetchTilesBounds, type TileRow } from '../lib/api'
import { axialToPixel, HEX_WIDTH, HEX_HEIGHT } from '../lib/hex'
import TileHitbox from './TileHitbox'
import FogLayer from './FogLayer'
import HoverCard from './HoverCard'

type Props = {
    originX?: number
    originY?: number
    hexWidth?: number   // NEW: dynamic hex width
    hexHeight?: number  // NEW: dynamic hex height
    qBounds?: { min: number, max: number }
    rBounds?: { min: number, max: number }
    onTileSelect?: (tileId: string) => void
}

export default function MapShell({
    originX = 400,
    originY = 200,
    hexWidth = 55,
    hexHeight = 63,
    qBounds = { min: -20, max: 20 },
    rBounds = { min: -20, max: 20 },
    onTileSelect
}: Props) {
    const [tiles, setTiles] = useState<TileRow[]>([])
    const [hover, setHover] = useState<{ tile: TileRow | null, x: number, y: number } | null>(null)
    const containerRef = useRef<HTMLDivElement | null>(null)

    useEffect(() => {
        let mounted = true
        fetchTilesBounds(qBounds.min, qBounds.max, rBounds.min, rBounds.max).then(res => {
            if (!mounted) return
            if (res.ok) setTiles(res.tiles)
        })
        return () => { mounted = false }
    }, [qBounds, rBounds])

    return (
        <div className="relative w-full h-full overflow-hidden bg-[#0d0d0f]">
            {/* Layer 1: background handled globally via CSS; remove overlay image */}

            {/* Layer 2: tile hitboxes */}
            <div ref={containerRef} className="absolute inset-0 pointer-events-none">
                {tiles.map(t => {
                    const pos = axialToPixel({ q: t.q, r: t.r }, originX, originY, hexWidth, hexHeight)
                    return (
                        <TileHitbox
                            key={t.id}
                            tile={t}
                            left={pos.x}
                            top={pos.y}
                            onHover={(evt) => setHover({ tile: t, x: evt.clientX, y: evt.clientY })}
                            onLeave={() => setHover(null)}
                            onClick={() => {
                                if (onTileSelect) {
                                    onTileSelect(t.id.toString())
                                }
                            }}
                        />
                    )
                })}
            </div>

            {/* Layer 3: fog + highlights (pointer-events none so individual tileHitbox handles clicks) */}
            <FogLayer tiles={tiles} origin={{ x: originX, y: originY }} hexWidth={hexWidth} hexHeight={hexHeight} />

            {/* Hover Card (floating, uses pointer-events none so it doesn't occlude) */}
            {hover?.tile && <HoverCard tile={hover.tile} x={hover.x} y={hover.y} onClose={() => setHover(null)} />}

        </div>
    )
}
