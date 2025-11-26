import React from 'react';
import { DiamondTileBackground } from './DiamondTileBackground';

interface BackgroundLayoutProps {
  children: React.ReactNode;
}

export const BackgroundLayout: React.FC<BackgroundLayoutProps> = ({ children }) => {
  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-ink-950 text-parchment-100 font-sans selection:bg-hanko-500 selection:text-white">
      {/* Scalable Background */}
      <div className="fixed inset-0 z-0 w-full h-full">
        <DiamondTileBackground />
      </div>

      {/* Content Container */}
      <div className="relative z-10 w-full min-h-screen flex flex-col">
        {children}
      </div>
    </div>
  );
};
