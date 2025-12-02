import { useState, useEffect, useRef } from 'react';
import { X, Sword } from 'lucide-react';

export interface CombatMessage {
  id: string;
  type: 'action' | 'damage' | 'heal' | 'status' | 'result';
  actor: string;
  message: string;
  timestamp: number;
}

interface CombatPopupProps {
  isOpen: boolean;
  onClose: () => void;
  combatLog: CombatMessage[];
  enemyName: string;
  playerHp: number;
  playerMaxHp: number;
  enemyHp: number;
  enemyMaxHp: number;
  onPlayerAction: (action: string) => void;
  isPlayerTurn: boolean;
}

export function CombatPopup({
  isOpen,
  onClose,
  combatLog,
  enemyName,
  playerHp,
  playerMaxHp,
  enemyHp,
  enemyMaxHp,
  onPlayerAction,
  isPlayerTurn
}: CombatPopupProps) {
  const logRef = useRef<HTMLDivElement>(null);
  const [selectedAction, setSelectedAction] = useState<string | null>(null);

  // Auto-scroll to bottom of log
  useEffect(() => {
    if (logRef.current) {
      logRef.current.scrollTop = logRef.current.scrollHeight;
    }
  }, [combatLog]);

  if (!isOpen) return null;

  const playerHpPercent = (playerHp / playerMaxHp) * 100;
  const enemyHpPercent = (enemyHp / enemyMaxHp) * 100;

  const handleAction = (action: string) => {
    setSelectedAction(action);
    onPlayerAction(action);
    setTimeout(() => setSelectedAction(null), 500);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 backdrop-blur-sm">
      
      {/* Combat Window */}
      <div className="w-11/12 max-w-2xl bg-gradient-to-b from-ink-900/95 to-ink-950/95 border-4 border-amber-900/60 rounded-lg shadow-2xl overflow-hidden">
        
        {/* Header */}
        <div className="relative bg-gradient-to-r from-amber-900/40 to-red-900/40 px-6 py-4 border-b-2 border-amber-900/60 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Sword size={24} className="text-red-500" />
            <h2 className="text-2xl font-serif font-bold text-amber-100 tracking-wide">Combat!</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 hover:bg-red-900/30 rounded transition-colors"
          >
            <X size={20} className="text-amber-300" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          
          {/* HP Bars Section */}
          <div className="grid grid-cols-2 gap-6">
            
            {/* Player HP */}
            <div className="space-y-2">
              <div className="text-sm font-serif font-bold text-amber-100 uppercase tracking-wide">You</div>
              <div className="space-y-1">
                <div className="h-4 bg-ink-800 rounded border-2 border-amber-900/40 overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-red-900 via-red-600 to-red-500 transition-all duration-500 shadow-lg shadow-red-600/50"
                    style={{ width: `${playerHpPercent}%` }}
                  />
                </div>
                <div className="text-xs text-amber-200/70 font-mono">{playerHp} / {playerMaxHp} HP</div>
              </div>
            </div>

            {/* Enemy HP */}
            <div className="space-y-2">
              <div className="text-sm font-serif font-bold text-amber-100 uppercase tracking-wide">{enemyName}</div>
              <div className="space-y-1">
                <div className="h-4 bg-ink-800 rounded border-2 border-amber-900/40 overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-orange-900 via-orange-600 to-red-500 transition-all duration-500 shadow-lg shadow-orange-600/50"
                    style={{ width: `${enemyHpPercent}%` }}
                  />
                </div>
                <div className="text-xs text-amber-200/70 font-mono">{enemyHp} / {enemyMaxHp} HP</div>
              </div>
            </div>
          </div>

          {/* Combat Log */}
          <div
            ref={logRef}
            className="bg-ink-900/60 border-2 border-amber-900/30 rounded p-4 h-48 overflow-y-auto space-y-2 font-mono text-sm"
          >
            {combatLog.length === 0 ? (
              <div className="text-amber-200/50 italic">Combat begins...</div>
            ) : (
              combatLog.map(msg => (
                <CombatLogMessage key={msg.id} message={msg} />
              ))
            )}
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-2 gap-3">
            {isPlayerTurn ? (
              <>
                <CombatActionButton
                  label="Attack"
                  onClick={() => handleAction('attack')}
                  disabled={selectedAction !== null}
                  variant="attack"
                />
                <CombatActionButton
                  label="Defend"
                  onClick={() => handleAction('defend')}
                  disabled={selectedAction !== null}
                  variant="defend"
                />
                <CombatActionButton
                  label="Ability"
                  onClick={() => handleAction('ability')}
                  disabled={selectedAction !== null}
                  variant="ability"
                />
                <CombatActionButton
                  label="Item"
                  onClick={() => handleAction('item')}
                  disabled={selectedAction !== null}
                  variant="item"
                />
              </>
            ) : (
              <div className="col-span-2 text-center py-3 bg-amber-900/20 border border-amber-700/40 rounded text-amber-200 text-sm font-mono uppercase tracking-widest">
                Enemy Turn...
              </div>
            )}
          </div>

          {/* Flee Option */}
          <button
            onClick={onClose}
            className="w-full py-2 bg-ink-800/60 border-2 border-amber-900/30 rounded hover:bg-ink-700/80 hover:border-amber-700/60 text-amber-200/80 hover:text-amber-100 text-sm uppercase tracking-widest transition-all"
          >
            Flee Combat
          </button>
        </div>
      </div>
    </div>
  );
}

function CombatLogMessage({ message }: { message: CombatMessage }) {
  const colorMap = {
    action: 'text-amber-300',
    damage: 'text-red-400',
    heal: 'text-green-400',
    status: 'text-blue-400',
    result: 'text-yellow-300 font-bold'
  };

  const color = colorMap[message.type];

  return (
    <div className={`${color} text-xs leading-relaxed`}>
      <span className="opacity-60 mr-2">[{new Date(message.timestamp).toLocaleTimeString()}]</span>
      <span className="font-bold">{message.actor}:</span> {message.message}
    </div>
  );
}

interface CombatActionButtonProps {
  label: string;
  onClick: () => void;
  disabled: boolean;
  variant: 'attack' | 'defend' | 'ability' | 'item';
}

function CombatActionButton({ label, onClick, disabled, variant }: CombatActionButtonProps) {
  const variantStyles = {
    attack: 'bg-red-900/40 border-red-700/60 hover:bg-red-900/60 hover:border-red-600 text-red-200 hover:text-red-100',
    defend: 'bg-blue-900/40 border-blue-700/60 hover:bg-blue-900/60 hover:border-blue-600 text-blue-200 hover:text-blue-100',
    ability: 'bg-purple-900/40 border-purple-700/60 hover:bg-purple-900/60 hover:border-purple-600 text-purple-200 hover:text-purple-100',
    item: 'bg-green-900/40 border-green-700/60 hover:bg-green-900/60 hover:border-green-600 text-green-200 hover:text-green-100'
  };

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`py-2 border-2 rounded font-bold uppercase tracking-widest text-sm transition-all ${variantStyles[variant]} ${disabled ? 'opacity-50 cursor-not-allowed' : 'active:scale-95 hover:scale-105'}`}
    >
      {label}
    </button>
  );
}
