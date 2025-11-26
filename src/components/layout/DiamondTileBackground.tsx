import React from 'react';

export function DiamondTileBackground() {
    return (
        <div className="absolute inset-0 w-full h-full bg-[#1a1612]">
            <svg
                width="100%"
                height="100%"
                viewBox="0 0 1920 1200"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="w-full h-full"
                preserveAspectRatio="xMidYMid slice"
            >
                <defs>
                    {/* Paper texture */}
                    <filter id="paperTexture" x="0%" y="0%" width="100%" height="100%">
                        <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="4" result="noise" />
                        <feDiffuseLighting in="noise" lightingColor="#d4c4a8" surfaceScale="1">
                            <feDistantLight azimuth="45" elevation="60" />
                        </feDiffuseLighting>
                    </filter>

                    {/* Ink wash effect */}
                    <filter id="inkWash" x="-50%" y="-50%" width="200%" height="200%">
                        <feTurbulence type="fractalNoise" baseFrequency="0.02" numOctaves="3" result="turbulence" />
                        <feDisplacementMap in="SourceGraphic" in2="turbulence" scale="8" />
                        <feGaussianBlur stdDeviation="1" />
                    </filter>

                    {/* Brush stroke texture */}
                    <filter id="brush" x="-50%" y="-50%" width="200%" height="200%">
                        <feTurbulence type="fractalNoise" baseFrequency="1.2" numOctaves="4" result="noise" />
                        <feDisplacementMap in="SourceGraphic" in2="noise" scale="1.5" />
                    </filter>

                    {/* Aged parchment gradient */}
                    <radialGradient id="parchment" cx="50%" cy="50%">
                        <stop offset="0%" stopColor="#2a2419" />
                        <stop offset="50%" stopColor="#1a1612" />
                        <stop offset="100%" stopColor="#0f0d0a" />
                    </radialGradient>

                    {/* Ink gradient for lines */}
                    <linearGradient id="inkLine" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#4a4237" stopOpacity="0.6" />
                        <stop offset="50%" stopColor="#6b6052" stopOpacity="0.4" />
                        <stop offset="100%" stopColor="#4a4237" stopOpacity="0.6" />
                    </linearGradient>

                    {/* Red accent for some tiles */}
                    <radialGradient id="redInk">
                        <stop offset="0%" stopColor="#5a0000" stopOpacity="0.3" />
                        <stop offset="100%" stopColor="#2a0000" stopOpacity="0.1" />
                    </radialGradient>

                    {/* Diamond tile pattern */}
                    <pattern id="diamondTiles" x="0" y="0" width="120" height="104" patternUnits="userSpaceOnUse">
                        {/* Diamond/Rhombus shape */}
                        <path
                            d="M 60 2 L 118 52 L 60 102 L 2 52 Z"
                            fill="none"
                            stroke="url(#inkLine)"
                            strokeWidth="1.5"
                            filter="url(#brush)"
                            opacity="0.8"
                        />
                        <path
                            d="M 60 2 L 118 52 L 60 102 L 2 52 Z"
                            fill="none"
                            stroke="#3a3228"
                            strokeWidth="0.5"
                            opacity="0.4"
                        />
                    </pattern>

                    {/* Offset pattern for seamless tiling */}
                    <pattern id="diamondTilesOffset" x="60" y="52" width="120" height="104" patternUnits="userSpaceOnUse">
                        <path
                            d="M 60 2 L 118 52 L 60 102 L 2 52 Z"
                            fill="none"
                            stroke="url(#inkLine)"
                            strokeWidth="1.5"
                            filter="url(#brush)"
                            opacity="0.8"
                        />
                    </pattern>
                </defs>

                {/* Base parchment background */}
                <rect width="100%" height="100%" fill="url(#parchment)" />

                {/* Texture overlay */}
                <rect width="100%" height="100%" fill="#1a1612" opacity="0.3" filter="url(#paperTexture)" />

                {/* Ink wash atmosphere */}
                <g opacity="0.15" filter="url(#inkWash)">
                    <ellipse cx="480" cy="300" rx="600" ry="400" fill="#000000" />
                    <ellipse cx="1440" cy="900" rx="500" ry="350" fill="#000000" />
                    <ellipse cx="960" cy="600" rx="800" ry="500" fill="#000000" />
                </g>

                {/* Diamond tile grid - main layer */}
                <rect width="100%" height="100%" fill="url(#diamondTiles)" />

                {/* Diamond tile grid - offset layer for complete coverage */}
                <rect width="100%" height="100%" fill="url(#diamondTilesOffset)" opacity="0.7" />

                {/* Accent red tiles scattered */}
                <g opacity="0.5">
                    <path d="M 300 150 L 358 200 L 300 250 L 242 200 Z" fill="url(#redInk)" filter="url(#brush)" />
                    <path d="M 780 450 L 838 500 L 780 550 L 722 500 Z" fill="url(#redInk)" filter="url(#brush)" />
                    <path d="M 1380 750 L 1438 800 L 1380 850 L 1322 800 Z" fill="url(#redInk)" filter="url(#brush)" />
                    <path d="M 1620 350 L 1678 400 L 1620 450 L 1562 400 Z" fill="url(#redInk)" filter="url(#brush)" />
                    <path d="M 540 850 L 598 900 L 540 950 L 482 900 Z" fill="url(#redInk)" filter="url(#brush)" />
                </g>

                {/* Subtle brush stroke details */}
                <g opacity="0.1" filter="url(#brush)">
                    <path d="M 0 200 Q 480 220 960 200 Q 1440 180 1920 200" stroke="#e8dcc8" strokeWidth="40" fill="none" />
                    <path d="M 0 800 Q 480 820 960 800 Q 1440 780 1920 800" stroke="#e8dcc8" strokeWidth="40" fill="none" />
                </g>

                {/* Vignette edge darkening */}
                <rect width="100%" height="100%" fill="url(#parchment)" opacity="0.4" />

                {/* Additional weathering */}
                <g opacity="0.05" filter="url(#paperTexture)">
                    <rect width="100%" height="100%" fill="#000000" />
                </g>
            </svg>
        </div>
    );
}
