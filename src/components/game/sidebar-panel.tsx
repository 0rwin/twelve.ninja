import { useState } from 'react';
import { ChevronDown, Heart, Zap, Sword, BookOpen, Flame, Eye, Pickaxe, Home, ScrollText } from 'lucide-react';

interface SidebarPanelProps {
  playerName: string;
  level: number;
  hp: number;
  maxHp: number;
  stamina: number;
  maxStamina: number;
  xp: number;
  ryo: number;
  onAction?: (action: string) => void;
}

export function SidebarPanel({
  playerName,
  level,
  hp,
  maxHp,
  stamina,
  maxStamina,
  xp,
  ryo,
  onAction
}: SidebarPanelProps) {
  const hpPercent = (hp / maxHp) * 100;
  const staminaPercent = (stamina / maxStamina) * 100;
  const xpPercent = (xp % 100);

  return (
    <div className="fixed left-0 top-0 h-screen w-72 bg-slate-900 border-r-4 border-amber-900 flex flex-col shadow-2xl z-40">
      
      {/* Ornate Top Border */}
      <div className="h-2 bg-gradient-to-r from-transparent via-amber-600 to-transparent" />
      
      {/* Header - Character Name */}
      <div className="px-5 py-4 border-b-2 border-amber-900/60">
        <h2 className="text-xl font-serif text-amber-100 tracking-wide">{playerName}</h2>
        <div className="text-xs text-amber-200 uppercase tracking-widest mt-1">Lvl {level} Ninja</div>
      </div>

      {/* Stats Section - Compact */}
      <div className="px-5 py-3 space-y-3 border-b-2 border-amber-900/60">
        
        {/* HP Bar */}
        <div className="space-y-1">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1">
              <Heart size={14} className="text-red-500" />
              <span className="text-xs font-mono uppercase text-amber-100">Health</span>
            </div>
            <span className="text-xs font-mono text-amber-300">{hp}/{maxHp}</span>
          </div>
          <div className="h-2 bg-slate-800 rounded-full overflow-hidden border border-amber-900/40">
            <div
              className="h-full bg-gradient-to-r from-red-900 via-red-600 to-red-500 transition-all duration-300"
              style={{ width: `${hpPercent}%` }}
            />
          </div>
        </div>

        {/* Stamina Bar */}
        <div className="space-y-1">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1">
              <Zap size={14} className="text-yellow-400" />
              <span className="text-xs font-mono uppercase text-amber-100">Stamina</span>
            </div>
            <span className="text-xs font-mono text-amber-300">{stamina}/{maxStamina}</span>
          </div>
          <div className="h-2 bg-slate-800 rounded-full overflow-hidden border border-amber-900/40">
            <div
              className="h-full bg-gradient-to-r from-yellow-900 via-yellow-500 to-yellow-400 transition-all duration-300"
              style={{ width: `${staminaPercent}%` }}
            />
          </div>
        </div>

        {/* XP Bar */}
        <div className="space-y-1">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1">
              <Flame size={14} className="text-orange-400" />
              <span className="text-xs font-mono uppercase text-amber-100">Experience</span>
            </div>
            <span className="text-xs font-mono text-amber-300">{xpPercent}%</span>
          </div>
          <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden border border-amber-900/40">
            <div
              className="h-full bg-gradient-to-r from-orange-900 via-orange-500 to-amber-400 transition-all duration-300"
              style={{ width: `${xpPercent}%` }}
            />
          </div>
        </div>
      </div>

      {/* Resources */}
      <div className="px-5 py-3 grid grid-cols-2 gap-2 border-b-2 border-amber-900/60">
        <div className="bg-slate-800/60 border border-amber-900/40 rounded px-2 py-1.5">
          <div className="text-xs text-amber-200 uppercase tracking-widest mb-0.5">Ryo</div>
          <div className="text-base font-bold text-amber-300 font-mono">{ryo}</div>
        </div>
        <div className="bg-slate-800/60 border border-amber-900/40 rounded px-2 py-1.5">
          <div className="text-xs text-amber-200 uppercase tracking-widest mb-0.5">Skill</div>
          <div className="text-base font-bold text-amber-300 font-mono">3</div>
        </div>
      </div>

      {/* Navigation Buttons */}
      <div className="flex-1 px-4 py-4 space-y-2 flex flex-col">
        <NavButton icon={<Eye size={16} />} label="Scout" onClick={() => onAction?.('scout')} />
        <NavButton icon={<Pickaxe size={16} />} label="Gather" onClick={() => onAction?.('gather')} />
        <NavButton icon={<Sword size={16} />} label="Combat" onClick={() => onAction?.('combat')} />
        <NavButton icon={<Home size={16} />} label="Tavern" onClick={() => onAction?.('tavern')} variant="special" />
        <NavButton icon={<ScrollText size={16} />} label="Quests" onClick={() => onAction?.('quests')} variant="special" />
      </div>

      {/* Bottom Info */}
      <div className="px-5 py-3 bg-slate-800/40 border-t-2 border-amber-900/60 space-y-2 text-xs text-amber-200/70">
        <div className="flex justify-between">
          <span>Inventory</span>
          <span className="text-amber-300">12/20</span>
        </div>
        <div className="flex justify-between">
          <span>Location</span>
          <span className="text-amber-300">Dense Bamboo</span>
        </div>
      </div>

      {/* Ornate Bottom Border */}
      <div className="h-2 bg-gradient-to-r from-transparent via-amber-600 to-transparent" />
    </div>
  );
}

interface NavButtonProps {
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
  variant?: 'normal' | 'special';
}

function NavButton({ icon, label, onClick, variant = 'normal' }: NavButtonProps) {
  const baseStyle = 'w-full flex items-center gap-3 px-4 py-2.5 rounded border transition-all duration-200 active:scale-95 hover:scale-105 font-mono uppercase text-xs tracking-widest';
  
  if (variant === 'special') {
    return (
      <button
        onClick={onClick}
        className={`${baseStyle} bg-amber-900/40 border-amber-700/60 hover:bg-amber-900/60 hover:border-amber-600 text-amber-200 hover:text-amber-100`}
      >
        <span className="text-amber-300">{icon}</span>
        {label}
      </button>
    );
  }

  return (
    <button
      onClick={onClick}
      className={`${baseStyle} bg-slate-800/60 border-amber-900/40 hover:bg-slate-700/80 hover:border-amber-700/60 text-amber-300 hover:text-amber-100`}
    >
      <span>{icon}</span>
      {label}
    </button>
  );
}
