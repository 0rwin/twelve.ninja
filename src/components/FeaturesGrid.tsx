import { Panel } from './UIKit';
import { Swords, Users, Map } from 'lucide-react';

export function FeaturesGrid() {
  return (
    <div className="max-w-5xl w-full grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
      <Panel className="text-center">
        <div className="w-16 h-16 bg-ink-900/50 border border-ink-700 rounded-full mx-auto flex items-center justify-center mb-4">
          <Map className="text-parchment-500 opacity-80" size={28} />
        </div>
        <h3 className="text-lg font-serif text-parchment-100 mb-2">Hex-Based Exploration</h3>
        <p className="text-sm text-parchment-200/70 leading-relaxed">
          Traverse a vast world rendered in traditional ink wash. Each hex tile holds secrets, danger, and opportunity.
        </p>
      </Panel>

      <Panel className="text-center">
        <div className="w-16 h-16 bg-ink-900/50 border border-ink-700 rounded-full mx-auto flex items-center justify-center mb-4">
          <Swords className="text-parchment-500 opacity-80" size={28} />
        </div>
        <h3 className="text-lg font-serif text-parchment-100 mb-2">Tactical Combat</h3>
        <p className="text-sm text-parchment-200/70 leading-relaxed">
          Engage in server-authoritative combat with deterministic outcomes. Every action recorded, every battle auditable.
        </p>
      </Panel>

      <Panel className="text-center">
        <div className="w-16 h-16 bg-ink-900/50 border border-ink-700 rounded-full mx-auto flex items-center justify-center mb-4">
          <Users className="text-parchment-500 opacity-80" size={28} />
        </div>
        <h3 className="text-lg font-serif text-parchment-100 mb-2">Twelve Codes</h3>
        <p className="text-sm text-parchment-200/70 leading-relaxed">
          Choose your allegiance from twelve ninja codes. Form alliances, betray rivals, and shape the political landscape.
        </p>
      </Panel>
    </div>
  );
}
