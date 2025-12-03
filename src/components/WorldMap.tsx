import React, { useState, useEffect } from 'react';
import mapLayout from '../data/map_layout.json';
import { worldData } from '../data/worldData';

interface Region {
    id: string;
    image: string;
    x: number;
    y: number;
    width: number;
    height: number;
}

interface WorldMapProps {
    onTileSelect?: (tileId: string) => void;
}

export default function WorldMap({ onTileSelect }: WorldMapProps) {
    const [regions, setRegions] = useState<Region[]>([]);
    const [hoveredRegion, setHoveredRegion] = useState<string | null>(null);

    useEffect(() => {
        // In a real app, you might fetch this or import it directly if it's static
        // Casting to Region[] because JSON import might be inferred loosely
        setRegions(mapLayout as Region[]);
    }, []);

    const handleRegionClick = (regionId: string) => {
        // Validate regionId format: must contain underscore and numeric suffix
        if (typeof regionId !== 'string' || !regionId.includes('_')) {
            console.warn(`Invalid regionId: '${regionId}' (missing underscore)`);
            return;
        }
        const parts = regionId.split('_');
        if (parts.length < 2) {
            console.warn(`Invalid regionId: '${regionId}' (incorrect format)`);
            return;
        }
        const numStr = parts[1];
        const num = Number(numStr);
        if (!Number.isFinite(num) || !Number.isInteger(num)) {
            console.warn(`Invalid regionId: '${regionId}' (suffix not a finite integer)`);
            return;
        }
        const tileIndex = num - 1;
        if (tileIndex < 0 || tileIndex >= worldData.length) {
            console.warn(`Invalid regionId: '${regionId}' (index ${tileIndex} out of bounds)`);
            return;
        }
        const tile = worldData[tileIndex];
        if (tile && onTileSelect) {
            onTileSelect(tile.id.toString());
        }
    };

    return (
        <div className="relative w-full h-full bg-[#0d0d0f] overflow-auto flex items-center justify-center">
            <div className="relative" style={{ width: '100%', height: '100%', minWidth: '800px', minHeight: '600px' }}>
                {/* Background or container if needed */}
                {regions.map((region) => (
                    <div
                        key={region.id}
                        className={`absolute transition-transform duration-300 cursor-pointer ${hoveredRegion === region.id ? 'scale-110 z-10 drop-shadow-[0_0_15px_rgba(245,201,69,0.5)]' : 'scale-100 z-0'
                            }`}
                        style={{
                            left: region.x,
                            top: region.y,
                            width: region.width,
                            height: region.height,
                            // Centering the div on the coordinate
                            transform: `translate(-50%, -50%) ${hoveredRegion === region.id ? 'scale(1.1)' : 'scale(1)'}`,
                        }}
                        onMouseEnter={() => setHoveredRegion(region.id)}
                        onMouseLeave={() => setHoveredRegion(null)}
                        onClick={() => handleRegionClick(region.id)}
                    >
                        <img
                            src={region.image}
                            alt={region.id}
                            className="w-full h-full object-contain pointer-events-none" // pointer-events-none on img so the div handles events
                        />
                    </div>
                ))}
            </div>
        </div>
    );
}
