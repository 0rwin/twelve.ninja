import { Scroll } from 'lucide-react';

export function CombatLog() {
  const logs = [
    { type: 'narrative', text: "The wind howls through the bamboo grove..." },
    { type: 'combat', text: "You strike the Ronin for 12 damage.", crit: false },
    { type: 'combat', text: "The Ronin deflects! (Parry)", highlight: true },
    { type: 'gain', text: "You gained +4 Mastery." },
  ];

  return (
    <div className="w-full max-w-md border-l-2 border-ink-800 pl-4 space-y-3 font-mono text-sm h-64 overflow-y-auto scrollbar-thin scrollbar-thumb-ink-700">
      <div className="flex items-center gap-2 text-parchment-500 opacity-50 mb-4">
        <Scroll size={14} />
        <span className="text-[10px] uppercase tracking-widest">Chronicle</span>
      </div>
      
      {logs.map((log, i) => (
        <div key={i} className={`
          p-2 border-b border-ink-800/50 
          ${log.highlight ? 'text-hanko-500 font-bold border-hanko-500/30 bg-hanko-500/5' : 'text-parchment-200'}
          ${log.type === 'narrative' ? 'italic text-gray-500' : ''}
          ${log.type === 'gain' ? 'text-parchment-500' : ''}
        `}>
          <span className="opacity-50 mr-2 text-[10px]">{`00:${10 + i}`}</span>
          {log.text}
        </div>
      ))}
    </div>
  );
}
