import React, { useState, useEffect } from 'react';

interface World {
    id: number;
    name: string;
    description: string;
    difficulty: string;
}

// World data matching your tiles (1-10 in order)
const worldData: World[] = [
    { id: 1, name: "The Obsidian Crag", description: "A jagged wasteland of sharp rocks and dark minerals. Resources are rare, but valuable.", difficulty: "Hard" },
    { id: 2, name: "Duskfall Hamlet", description: "A quiet village perpetually shrouded in twilight. Excellent for trade.", difficulty: "Easy" },
    { id: 3, name: "Shadow-Crest Summit", description: "High-altitude peaks where the air is thin and ancient beasts roost.", difficulty: "Hard" },
    { id: 4, name: "Lantern's Deep", description: "A subterranean settlement illuminated by glowing fungi and lanterns.", difficulty: "Medium" },
    { id: 5, name: "Iron-Fang Range", description: "Snow-capped mountains rich in iron ore, guarded by territorial clans.", difficulty: "Medium" },
    { id: 6, name: "Serpent's Flow Valley", description: "A lush, winding river valley. The soil is fertile for farming.", difficulty: "Easy" },
    { id: 7, name: "The Silent Stalks", description: "A dense bamboo forest that confuses travelers. Home to stealthy units.", difficulty: "Medium" },
    { id: 8, name: "Mist-Veiled Bridge", description: "A strategic choke point connecting two cliffs. Control the trade routes.", difficulty: "Hard" },
    { id: 9, name: "Aether-Bound Citadel", description: "A floating fortress in the sky. Magic is potent here.", difficulty: "Very Hard" },
    { id: 10, name: "The Calm Waters", description: "Peaceful lakes and fishing spots. A safe haven for beginners.", difficulty: "Easy" }
];

function WorldSelection() {
    const [hoveredWorld, setHoveredWorld] = useState<World | null>(null);
    const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

    // Track mouse position globally
    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            setMousePos({ x: e.clientX, y: e.clientY });
        };
        window.addEventListener('mousemove', handleMouseMove);
        return () => window.removeEventListener('mousemove', handleMouseMove);
    }, []);

    const handleWorldSelect = (world: World) => {
        console.log(`Loading ${world.name}...`);
        alert(`Entering ${world.name}!\n\n(This would load the 256x256 grid for this region)`);
    };

    return (
        <div style={{
            width: '100vw',
            height: '100vh',
            background: 'linear-gradient(135deg, #d4c5a9 0%, #b8a280 50%, #a89968 100%)',
            backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'100\' height=\'100\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noise\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.9\' numOctaves=\'4\' /%3E%3C/filter%3E%3Crect width=\'100\' height=\'100\' filter=\'url(%23noise)\' opacity=\'0.05\'/%3E%3C/svg%3E")',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            fontFamily: 'serif',
            position: 'relative',
            overflow: 'hidden'
        }}>

            {/* Title */}
            <h1 style={{
                fontSize: '4rem',
                fontWeight: 'bold',
                color: '#2c1810',
                textShadow: '2px 2px 4px rgba(255,255,255,0.3)',
                marginBottom: '2rem',
                letterSpacing: '0.1em',
                textTransform: 'uppercase'
            }}>
                Select Your Origin
            </h1>

            {/* Grid Container */}
            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(5, 180px)',
                gridTemplateRows: 'repeat(2, 180px)',
                gap: '2rem',
                padding: '2rem',
                maxWidth: '1200px'
            }}>
                {worldData.map((world, index) => (
                    <div
                        key={world.id}
                        onMouseEnter={() => setHoveredWorld(world)}
                        onMouseLeave={() => setHoveredWorld(null)}
                        onClick={() => handleWorldSelect(world)}
                        style={{
                            position: 'relative',
                            width: '180px',
                            height: '180px',
                            cursor: 'pointer',
                            transition: 'all 0.3s ease',
                            transform: hoveredWorld?.id === world.id ? 'scale(1.1) translateY(-5px)' : 'scale(1)',
                            filter: hoveredWorld?.id === world.id
                                ? 'drop-shadow(0 10px 20px rgba(0,0,0,0.5)) brightness(1.2)'
                                : 'drop-shadow(0 5px 10px rgba(0,0,0,0.3))',
                            zIndex: hoveredWorld?.id === world.id ? 10 : 1
                        }}
                    >
                        {/* The tile image - NO clip-path, NO manipulation */}
                        <img
                            src={`/assets/world-tiles/tile_${String(index + 1).padStart(2, '0')}.png`}
                            alt={world.name}
                            style={{
                                width: '100%',
                                height: '100%',
                                objectFit: 'contain',
                                userSelect: 'none',
                                pointerEvents: 'none'
                            }}
                        />

                        {/* Label below tile */}
                        <div style={{
                            position: 'absolute',
                            bottom: '-30px',
                            left: '50%',
                            transform: 'translateX(-50%)',
                            whiteSpace: 'nowrap',
                            fontSize: '0.9rem',
                            fontWeight: 'bold',
                            color: '#2c1810',
                            textShadow: '1px 1px 2px rgba(255,255,255,0.8)',
                            pointerEvents: 'none'
                        }}>
                            {world.name}
                        </div>
                    </div>
                ))}
            </div>

            {/* Mouse-following tooltip */}
            {hoveredWorld && (
                <div style={{
                    position: 'fixed',
                    left: mousePos.x + 20,
                    top: mousePos.y + 20,
                    background: 'rgba(20, 15, 10, 0.95)',
                    border: '2px solid #8b7355',
                    borderRadius: '8px',
                    padding: '1rem',
                    maxWidth: '300px',
                    pointerEvents: 'none',
                    zIndex: 9999,
                    boxShadow: '0 8px 16px rgba(0,0,0,0.6)'
                }}>
                    <h3 style={{
                        margin: '0 0 0.5rem 0',
                        color: '#d4c5a9',
                        fontSize: '1.2rem',
                        fontWeight: 'bold'
                    }}>
                        {hoveredWorld.name}
                    </h3>
                    <p style={{
                        margin: '0 0 0.5rem 0',
                        color: '#b8a280',
                        fontSize: '0.9rem',
                        lineHeight: '1.4'
                    }}>
                        {hoveredWorld.description}
                    </p>
                    <div style={{
                        display: 'inline-block',
                        padding: '0.25rem 0.5rem',
                        background: hoveredWorld.difficulty === 'Easy' ? '#2d5016' :
                            hoveredWorld.difficulty === 'Medium' ? '#8b6914' :
                                hoveredWorld.difficulty === 'Hard' ? '#8b2500' : '#4b0082',
                        color: '#fff',
                        fontSize: '0.75rem',
                        fontWeight: 'bold',
                        borderRadius: '4px',
                        textTransform: 'uppercase'
                    }}>
                        {hoveredWorld.difficulty}
                    </div>
                </div>
            )}

            {/* Footer instruction */}
            <p style={{
                position: 'absolute',
                bottom: '1rem',
                color: '#5c4d3a',
                fontSize: '0.85rem',
                fontStyle: 'italic',
                opacity: 0.7
            }}>
                Click a region to begin your journey
            </p>
        </div>
    );
}

export default WorldSelection;
