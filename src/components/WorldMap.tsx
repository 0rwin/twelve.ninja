import React, { useState, useEffect } from 'react';
import mapLayout from '../data/map_layout.json';

interface Region {
    id: string;
    image: string;
    x: number;
    y: number;
    width: number;
    height: number;
}

export default function WorldMap() {
    const [regions, setRegions] = useState<Region[]>([]);
    const [hoveredRegion, setHoveredRegion] = useState<string | null>(null);

    useEffect(() => {
        // In a real app, you might fetch this or import it directly if it's static
        // Casting to Region[] because JSON import might be inferred loosely
        setRegions(mapLayout as Region[]);
    }, []);

    const handleRegionClick = (regionId: string) => {
        console.log(`handleRegionSelect(${regionId})`);
        // Add your navigation or selection logic here
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
