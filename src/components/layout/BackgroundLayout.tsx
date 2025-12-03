import React from 'react';

interface BackgroundLayoutProps {
  children: React.ReactNode;
}

export const BackgroundLayout: React.FC<BackgroundLayoutProps> = ({ children }) => {
  return (
    <div 
      className="w-full flex flex-col text-parchment-100 font-sans selection:bg-hanko-500 selection:text-white"
      style={{
        backgroundImage: 'url(/assets/background.png)',
        backgroundAttachment: 'fixed',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        minHeight: '100vh'
      }}
    >
      {/* Content Container with semi-transparent overlay */}
      <div className="relative z-10 w-full flex flex-col bg-ink-950/40">
        {children}
      </div>
    </div>
  );
};

export default BackgroundLayout;
