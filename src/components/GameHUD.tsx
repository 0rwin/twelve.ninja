import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Scroll, MapPin, Shield, Zap, Coins, Eye, Pickaxe, Tent, User } from 'lucide-react';

interface GameHUDProps {
    onAction: (action: string) => void;
}

export function GameHUD({ onAction }: GameHUDProps) {
    const navigate = useNavigate();

    // Mock State - In a real app, this would come from props or a store
    const [playerState] = useState({
        hp: 85,
        maxHp: 100,
        energy: 42,
        maxEnergy: 50,
        gold: 125,
        location: { x: 142, y: 88, name: "Dense Bamboo Thicket" },
        tileDescription: "The air is still here. You hear rustling to the east.",
        entities: ["Wild Berry Bush", "Traveling Merchant"]
    });

    const [logs] = useState([
        "You traveled North.",
        "You gathered 3 wood.",
        "You took 5 damage from a fall.",
        "You spotted a merchant nearby.",
        "Energy recovered by 10."
    ]);

    return (
        <div className="fixed inset-0 pointer-events-none z-50 flex flex-col justify-between p-4 font-serif text-[#d4c5a9]">

            {/* 1. Top Bar (Stats) */}
            <div className="flex justify-between items-start pointer-events-auto">
                {/* Left Stats: HP & Energy */}
                <div className="flex flex-col gap-2 bg-[#140f0a]/90 p-2 sm:p-3 rounded-lg border border-[#8b7355]/30 backdrop-blur-sm shadow-lg w-48 sm:w-56 md:w-64">

                    {/* HP Bar */}
                    <div className="flex items-center gap-1 sm:gap-2">
                        <Shield size={14} className="text-red-400 sm:w-4 sm:h-4" />
                        <div className="flex-1 h-2 sm:h-3 bg-[#2c1810] rounded-full overflow-hidden border border-[#5c4d3a]">
                            <div
                                className="h-full bg-gradient-to-r from-red-900 to-red-600 transition-all duration-500"
                                style={{ width: `${(playerState.hp / playerState.maxHp) * 100}%` }}
                            />
                        </div>
                        <span className="text-[10px] sm:text-xs font-bold w-10 sm:w-12 text-right">{playerState.hp}/{playerState.maxHp}</span>
                    </div>

                    {/* Energy Bar */}
                    <div className="flex items-center gap-1 sm:gap-2">
                        <Zap size={14} className="text-green-400 sm:w-4 sm:h-4" />
                        <div className="flex-1 h-2 sm:h-3 bg-[#2c1810] rounded-full overflow-hidden border border-[#5c4d3a]">
                            <div
                                className="h-full bg-gradient-to-r from-green-900 to-green-600 transition-all duration-500"
                                style={{ width: `${(playerState.energy / playerState.maxEnergy) * 100}%` }}
                            />
                        </div>
                        <span className="text-[10px] sm:text-xs font-bold w-10 sm:w-12 text-right">{playerState.energy}/{playerState.maxEnergy}</span>
                    </div>
                </div>

                {/* Center: Coordinates (Optional, or put in corner) */}
                <div className="hidden sm:block bg-[#140f0a]/80 px-3 sm:px-4 py-1 sm:py-2 rounded-full border border-[#8b7355]/30 backdrop-blur-sm text-xs sm:text-sm font-mono tracking-widest text-[#b8a280]">
                    X: {playerState.location.x} | Y: {playerState.location.y}
                </div>

                {/* Right Stats: Gold, Level & Profile */}
                <div className="flex items-center gap-2 sm:gap-4 bg-[#140f0a]/90 p-2 sm:p-3 rounded-lg border border-[#8b7355]/30 backdrop-blur-sm shadow-lg">
                    <div className="flex items-center gap-1 sm:gap-2 text-yellow-500">
                        <Coins size={16} className="sm:w-[18px] sm:h-[18px]" />
                        <span className="font-bold text-sm sm:text-base">{playerState.gold}</span>
                    </div>
                    <div className="h-4 sm:h-6 w-px bg-[#5c4d3a]" />
                    <div className="text-[10px] sm:text-xs text-[#8b7355] uppercase tracking-wider">
                        Lvl 1
                    </div>
                    <div className="h-4 sm:h-6 w-px bg-[#5c4d3a]" />
                    <button
                        onClick={() => navigate('/profile')}
                        className="p-1 sm:p-1.5 rounded hover:bg-[#2c241b] transition-colors"
                        title="View Profile"
                    >
                        <User size={16} className="text-[#8b7355] hover:text-[#d4c5a9] transition-colors sm:w-[18px] sm:h-[18px]" />
                    </button>
                </div>
            </div>

            {/* 2. Right Sidebar (Location Info) */}
            <div className="absolute right-2 sm:right-4 top-20 sm:top-24 w-52 sm:w-56 md:w-64 bg-[#140f0a]/95 border border-[#8b7355] p-3 sm:p-4 rounded-lg shadow-xl pointer-events-auto">
                <div className="flex items-center gap-2 mb-2 sm:mb-3 border-b border-[#8b7355]/50 pb-2">
                    <MapPin size={16} className="text-[#8b7355] sm:w-[18px] sm:h-[18px]" />
                    <h2 className="font-bold text-base sm:text-lg leading-none">{playerState.location.name}</h2>
                </div>

                <p className="text-xs sm:text-sm text-[#b8a280] italic mb-3 sm:mb-4 leading-relaxed">
                    "{playerState.tileDescription}"
                </p>

                <div className="space-y-2">
                    <h3 className="text-[10px] sm:text-xs font-bold uppercase tracking-widest text-[#5c4d3a]">Entities Detected</h3>
                    <ul className="text-xs sm:text-sm space-y-1">
                        {playerState.entities.map((entity, i) => (
                            <li key={i} className="flex items-center gap-2 text-[#d4c5a9]">
                                <span className="w-1.5 h-1.5 bg-[#8b7355] rounded-full" />
                                {entity}
                            </li>
                        ))}
                    </ul>
                </div>
            </div>

            {/* Bottom Area Container */}
            <div className="flex items-end justify-between gap-4 pointer-events-auto mt-auto">

                {/* 4. Bottom-Left (The Log) */}
                <div className="w-full sm:w-80 md:w-96 bg-[#140f0a]/80 border-t-2 border-r-2 border-[#8b7355]/30 rounded-tr-xl p-3 sm:p-4 backdrop-blur-sm h-36 sm:h-48 overflow-hidden flex flex-col justify-end mask-image-gradient">
                    <div className="flex items-center gap-2 text-[#5c4d3a] mb-2 opacity-70">
                        <Scroll size={12} className="sm:w-[14px] sm:h-[14px]" />
                        <span className="text-[9px] sm:text-[10px] uppercase tracking-widest">Journal</span>
                    </div>
                    <div className="space-y-1 font-mono text-[10px] sm:text-xs">
                        {logs.map((log, i) => (
                            <div key={i} className="text-[#b8a280]/80 border-l-2 border-[#5c4d3a]/30 pl-2 py-0.5">
                                <span className="opacity-50 mr-1 sm:mr-2">[{10 + i}:00]</span>
                                {log}
                            </div>
                        ))}
                    </div>
                </div>

                {/* 3. Bottom Action Bar (Controls) */}
                <div className="flex gap-2 sm:gap-3 mb-4 sm:mb-6 mr-2 sm:mr-4">
                    <ActionButton icon={<Eye size={18} />} label="Scout" onClick={() => onAction('Scout')} />
                    <ActionButton icon={<Pickaxe size={18} />} label="Forage" onClick={() => onAction('Forage')} />
                    <ActionButton icon={<Tent size={18} />} label="Rest" onClick={() => onAction('Rest')} />
                </div>
            </div>
        </div>
    );
}

function ActionButton({ icon, label, onClick }: { icon: React.ReactNode, label: string, onClick: () => void }) {
    return (
        <button
            onClick={onClick}
            className="flex flex-col items-center justify-center w-16 h-16 sm:w-20 sm:h-20 bg-[#1c1612] border-2 border-[#5c4d3a] rounded-lg hover:border-[#d4c5a9] hover:bg-[#2c241b] hover:scale-105 transition-all duration-200 group shadow-lg active:scale-95"
        >
            <div className="text-[#8b7355] group-hover:text-[#d4c5a9] mb-0.5 sm:mb-1 transition-colors">
                {icon}
            </div>
            <span className="text-[9px] sm:text-[10px] font-bold uppercase tracking-wider text-[#8b7355] group-hover:text-white transition-colors">
                {label}
            </span>
        </button>
    );
}
