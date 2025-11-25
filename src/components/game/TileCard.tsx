import { Mountain, Users } from 'lucide-react';
import { Button } from '../ui/Button';

export function TileCard() {
  return (
    <div className="w-64 bg-ink-900 border border-ink-700 p-4 shadow-2xl relative">
      {/* Decorative Corner Seals */}
      <div className="absolute top-0 right-0 w-8 h-8 border-t border-r border-parchment-500/30" />
      <div className="absolute bottom-0 left-0 w-8 h-8 border-b border-l border-parchment-500/30" />

      {/* Header */}
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="font-serif text-lg text-parchment-100">Iron Peaks</h3>
          <p className="text-[10px] text-hanko-500 uppercase tracking-widest">Danger Zone</p>
        </div>
        <Mountain className="text-ink-700" />
      </div>

      {/* Stats */}
      <div className="space-y-2 mb-6">
        <div className="flex justify-between text-xs text-parchment-200 border-b border-ink-800 pb-1">
          <span>Control</span>
          <span className="text-gray-500">Neutral</span>
        </div>
        <div className="flex justify-between text-xs text-parchment-200 border-b border-ink-800 pb-1">
          <span>Resources</span>
          <span>Iron, Stone</span>
        </div>
        <div className="flex justify-between text-xs text-parchment-200 pb-1">
          <span className="flex items-center gap-1"><Users size={10}/> Players</span>
          <span>3 Active</span>
        </div>
      </div>

      {/* Actions */}
      <div className="grid grid-cols-2 gap-2">
        <Button variant="ghost" className="text-[10px]">Scout</Button>
        <Button variant="primary" className="text-[10px]">Travel</Button>
      </div>
    </div>
  );
}
