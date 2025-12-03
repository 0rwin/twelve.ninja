import React, { useState } from 'react';
import { Eye, Pickaxe, Tent, ChevronLeft } from 'lucide-react';

interface TileExplorationProps {
  tile: {
    id: string;
    name: string;
    image: string;
    description: string;
    difficulty: 'Easy' | 'Medium' | 'Hard' | 'Very Hard';
  };
  player: {
    hp: number;
    maxHp: number;
    stamina: number;
    maxStamina: number;
    ryo: number;
  };
  onBack: () => void;
  onAction: (action: 'scout' | 'forage' | 'rest', tileId: string) => Promise<void>;
}

interface ActionResult {
  type: 'scout' | 'forage' | 'rest' | null;
  message: string;
  rewards?: {
    xp?: number;
    ryo?: number;
    items?: string[];
  };
  damage?: number;
}

export default function TileExploration({
  tile,
  player,
  onBack,
  onAction
}: TileExplorationProps) {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ActionResult | null>(null);
  const [showResult, setShowResult] = useState(false);

  const difficultyColors = {
    Easy: 'text-green-400',
    Medium: 'text-yellow-400',
    Hard: 'text-orange-400',
    'Very Hard': 'text-red-400'
  };

  const handleAction = async (action: 'scout' | 'forage' | 'rest') => {
    try {
      setLoading(true);
      setShowResult(false);
      
      // Call the action handler
      await onAction(action, tile.id);
      
      // Simulate result display (in real implementation, this would come from server)
      const mockResults: Record<string, ActionResult> = {
        scout: {
          type: 'scout',
          message: 'You carefully scout the area and discover hidden treasures nearby.',
          rewards: { xp: 50, ryo: 25 }
        },
        forage: {
          type: 'forage',
          message: 'You gather valuable resources from the land.',
          rewards: { xp: 30, ryo: 15, items: ['Common Herb', 'Wood'] }
        },
        rest: {
          type: 'rest',
          message: 'You rest and recover your strength.',
          rewards: { xp: 10 }
        }
      };
      
      setResult(mockResults[action]);
      setShowResult(true);
    } catch (error) {
      console.error('Error performing action:', error);
      setResult({
        type: null,
        message: 'An error occurred. Please try again.'
      });
      setShowResult(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-40 flex items-center justify-center p-4">
      {/* Main Content Card */}
      <div className="w-full max-w-4xl max-h-[90vh] overflow-y-auto bg-gradient-to-b from-[#2c2416] to-[#1a1410] border-2 border-[#8b7355] rounded-lg shadow-2xl">
        
        {/* Header */}
        <div className="sticky top-0 bg-[#140f0a] border-b border-[#8b7355] p-4 sm:p-6 flex items-center justify-between">
          <div className="flex-1">
            <h1 className="text-2xl sm:text-3xl font-serif text-[#d4c5a9] font-bold">{tile.name}</h1>
            <p className={`text-xs sm:text-sm font-mono uppercase tracking-widest mt-1 ${difficultyColors[tile.difficulty]}`}>
              Difficulty: {tile.difficulty}
            </p>
          </div>
          <button
            onClick={onBack}
            className="flex items-center gap-2 px-3 py-2 sm:px-4 sm:py-2 rounded border border-[#8b7355] text-[#d4c5a9] hover:bg-[#8b7355]/20 transition-colors ml-4"
            title="Return to map"
          >
            <ChevronLeft size={18} />
            <span className="hidden sm:inline text-sm">Map</span>
          </button>
        </div>

        {/* Content */}
        <div className="p-4 sm:p-6 space-y-6">
          
          {/* Tile Image & Description */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Image */}
            <div className="rounded-lg overflow-hidden border border-[#8b7355]/50 bg-[#0d0d0f]">
              <img
                src={tile.image}
                alt={tile.name}
                className="w-full h-64 md:h-80 object-cover"
              />
            </div>

            {/* Description & Info */}
            <div className="space-y-4">
              <div>
                <h2 className="text-sm font-mono uppercase tracking-widest text-[#8b7355] mb-2">Description</h2>
                <p className="text-[#d4c5a9] text-sm leading-relaxed italic">
                  "{tile.description}"
                </p>
              </div>

              {/* Player Stats */}
              <div className="border-t border-[#8b7355]/30 pt-4">
                <h3 className="text-sm font-mono uppercase tracking-widest text-[#8b7355] mb-3">Your Status</h3>
                <div className="space-y-2">
                  {/* HP */}
                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-xs text-[#b8a280]">Health</span>
                      <span className="text-xs font-mono text-[#d4c5a9]">{player.hp}/{player.maxHp}</span>
                    </div>
                    <div className="h-2 bg-[#0d0d0f] rounded-full overflow-hidden border border-[#5c4d3a]">
                      <div
                        className="h-full bg-gradient-to-r from-red-900 to-red-600 transition-all"
                        style={{ width: `${(player.hp / player.maxHp) * 100}%` }}
                      />
                    </div>
                  </div>

                  {/* Stamina */}
                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-xs text-[#b8a280]">Stamina</span>
                      <span className="text-xs font-mono text-[#d4c5a9]">{player.stamina}/{player.maxStamina}</span>
                    </div>
                    <div className="h-2 bg-[#0d0d0f] rounded-full overflow-hidden border border-[#5c4d3a]">
                      <div
                        className="h-full bg-gradient-to-r from-green-900 to-green-600 transition-all"
                        style={{ width: `${(player.stamina / player.maxStamina) * 100}%` }}
                      />
                    </div>
                  </div>

                  {/* Ryo */}
                  <div className="text-xs text-[#b8a280]">
                    Ryo: <span className="text-yellow-500 font-bold">{player.ryo}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Action Result (if any) */}
          {showResult && result && (
            <div className={`border-l-4 p-4 rounded ${
              result.type === 'scout' || result.type === 'forage' || result.type === 'rest'
                ? 'border-green-500 bg-green-900/20'
                : 'border-red-500 bg-red-900/20'
            }`}>
              <p className="text-[#d4c5a9] text-sm mb-2">{result.message}</p>
              {result.rewards && (
                <div className="text-xs text-[#b8a280] space-y-1">
                  {result.rewards.xp && <p>🔷 +{result.rewards.xp} Experience</p>}
                  {result.rewards.ryo && <p>💰 +{result.rewards.ryo} Ryo</p>}
                  {result.rewards.items && (
                    <p>📦 Items: {result.rewards.items.join(', ')}</p>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Action Buttons */}
          <div className="grid grid-cols-3 gap-3 sm:gap-4 border-t border-[#8b7355]/30 pt-6">
            <ActionButton
              icon={<Eye size={20} />}
              label="Scout"
              description="Observe and learn"
              onClick={() => handleAction('scout')}
              loading={loading}
              disabled={loading}
            />
            <ActionButton
              icon={<Pickaxe size={20} />}
              label="Forage"
              description="Gather resources"
              onClick={() => handleAction('forage')}
              loading={loading}
              disabled={loading || player.stamina < 10}
            />
            <ActionButton
              icon={<Tent size={20} />}
              label="Rest"
              description="Recover strength"
              onClick={() => handleAction('rest')}
              loading={loading}
              disabled={loading}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

interface ActionButtonProps {
  icon: React.ReactNode;
  label: string;
  description: string;
  onClick: () => void;
  loading?: boolean;
  disabled?: boolean;
}

function ActionButton({
  icon,
  label,
  description,
  onClick,
  loading = false,
  disabled = false
}: ActionButtonProps) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`flex flex-col items-center gap-2 p-3 sm:p-4 rounded border-2 transition-all ${
        disabled
          ? 'border-[#5c4d3a]/30 text-[#5c4d3a]/50 cursor-not-allowed'
          : 'border-[#8b7355] text-[#d4c5a9] hover:bg-[#8b7355]/20 hover:border-[#c9a564] active:scale-95'
      }`}
    >
      <div className={`${loading ? 'animate-spin' : ''}`}>{icon}</div>
      <div className="text-center">
        <div className="text-xs sm:text-sm font-bold uppercase tracking-wider">{label}</div>
        <div className="text-[10px] text-[#8b7355] hidden sm:block">{description}</div>
      </div>
    </button>
  );
}
