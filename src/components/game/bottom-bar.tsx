import { useState } from 'react';
import { MapPin, Users, ScrollText, Home, Pickaxe, Sword, Eye } from 'lucide-react';

interface BottomBarProps {
  locationName: string;
  locationDescription: string;
  entities: string[];
  onAction: (action: string) => void;
}

export function BottomBar({
  locationName,
  locationDescription,
  entities,
  onAction
}: BottomBarProps) {
  const [showLocationPanel, setShowLocationPanel] = useState(true);

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-gradient-to-t from-ink-950/95 to-ink-900/90 border-t-2 border-amber-900/40 backdrop-blur-sm shadow-2xl z-40" style={{ maxHeight: '15rem' }}>
      
      {/* Ornate Top Border */}
      <div className="h-1 bg-gradient-to-r from-transparent via-amber-700/50 to-transparent" />

      <div className="max-w-full px-6 py-4 flex items-end justify-between gap-6">
        
        {/* Left: Location Info Panel */}
        {showLocationPanel && (
          <div className="flex-1 min-w-0 max-w-md">
            <div className="bg-ink-800/60 border border-amber-900/40 rounded-lg px-4 py-3 space-y-3">
              
              {/* Location Header */}
              <div className="flex items-start gap-2 border-b border-amber-900/30 pb-2">
                <MapPin size={16} className="text-amber-400 flex-shrink-0 mt-0.5" />
                <div className="min-w-0 flex-1">
                  <h3 className="text-sm font-serif text-amber-100 font-bold truncate">{locationName}</h3>
                  <p className="text-xs text-amber-200/60 italic line-clamp-2">{locationDescription}</p>
                </div>
              </div>

              {/* Entities */}
              {entities.length > 0 && (
                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-xs text-amber-200/70 uppercase tracking-widest">
                    <Users size={12} />
                    <span>Entities Nearby</span>
                  </div>
                  <div className="space-y-0.5">
                    {entities.map((entity, i) => (
                      <div key={i} className="text-xs text-amber-200/80 pl-4 flex items-center">
                        <span className="w-1 h-1 bg-amber-400/60 rounded-full mr-2" />
                        {entity}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Center: Action Buttons */}
        <div className="flex items-end gap-3 flex-wrap justify-center">
          <ActionButton
            icon={<Eye size={18} />}
            label="Scout"
            onClick={() => onAction('scout')}
          />
          <ActionButton
            icon={<Pickaxe size={18} />}
            label="Gather"
            onClick={() => onAction('gather')}
          />
          <ActionButton
            icon={<Sword size={18} />}
            label="Combat"
            onClick={() => onAction('combat')}
          />
          <ActionButton
            icon={<Home size={18} />}
            label="Tavern"
            onClick={() => onAction('tavern')}
            variant="special"
          />
          <ActionButton
            icon={<ScrollText size={18} />}
            label="Quests"
            onClick={() => onAction('quests')}
            variant="special"
          />
        </div>

        {/* Right: Toggle & Info */}
        <div className="flex items-end gap-2">
          <button
            onClick={() => setShowLocationPanel(!showLocationPanel)}
            className="px-3 py-2 bg-ink-800/60 border border-amber-900/40 rounded text-amber-200/70 hover:text-amber-100 hover:border-amber-700/60 text-xs uppercase tracking-widest transition-all"
            title={showLocationPanel ? 'Hide location panel' : 'Show location panel'}
          >
            {showLocationPanel ? '−' : '+'}
          </button>
        </div>
      </div>

      {/* Ornate Bottom Border */}
      <div className="h-1 bg-gradient-to-r from-transparent via-amber-700/50 to-transparent" />
    </div>
  );
}

interface ActionButtonProps {
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
  variant?: 'normal' | 'special';
}

function ActionButton({ icon, label, onClick, variant = 'normal' }: ActionButtonProps) {
  const baseStyle = 'flex flex-col items-center justify-center px-4 py-3 rounded-lg border transition-all duration-200 active:scale-95 hover:scale-105';
  
  if (variant === 'special') {
    return (
      <button
        onClick={onClick}
        className={`${baseStyle} bg-amber-900/40 border-amber-700/60 hover:bg-amber-900/60 hover:border-amber-600 text-amber-200 hover:text-amber-100`}
      >
        <div className="text-amber-300 mb-1">{icon}</div>
        <span className="text-xs font-bold uppercase tracking-widest whitespace-nowrap">{label}</span>
      </button>
    );
  }

  return (
    <button
      onClick={onClick}
      className={`${baseStyle} bg-ink-800/60 border-amber-900/40 hover:bg-ink-700/80 hover:border-amber-700/60 text-amber-300 hover:text-amber-100`}
    >
      <div className="mb-1">{icon}</div>
      <span className="text-xs font-bold uppercase tracking-widest whitespace-nowrap">{label}</span>
    </button>
  );
}
