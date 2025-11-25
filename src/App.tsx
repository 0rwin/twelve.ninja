import { Scroll, Sword, Ghost } from 'lucide-react';
import { Button } from './components/ui/Button';

function App() {
  return (
    <div className="min-h-screen bg-ink-900 text-parchment-100 flex flex-col items-center justify-center p-4 selection:bg-parchment-500 selection:text-ink-900">
      
      {/* The Aesthetic Container */}
      <div className="max-w-md w-full border border-ink-700 bg-ink-800/50 backdrop-blur-sm p-8 rounded-lg shadow-2xl relative overflow-hidden">
        
        {/* Decorative Top Border */}
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-parchment-500/50 to-transparent" />

        {/* Header */}
        <div className="text-center space-y-4 mb-8">
          <div className="w-16 h-16 bg-ink-900 border border-ink-700 rounded-full mx-auto flex items-center justify-center shadow-inner">
            <Ghost className="w-8 h-8 text-parchment-500 opacity-80" />
          </div>
          <h1 className="text-3xl font-bold tracking-widest uppercase text-transparent bg-clip-text bg-gradient-to-b from-parchment-100 to-parchment-500">
            Twelve.Ninja
          </h1>
          <p className="text-sm text-gray-500 font-mono">
            System Initialization...
          </p>
        </div>

        {/* Status Indicators */}
        <div className="space-y-3 font-mono text-xs">
          <div className="flex justify-between items-center p-2 bg-ink-900/50 rounded border border-ink-700/50">
            <span className="flex items-center gap-2 text-gray-400">
              <Scroll size={14} /> Narrative Engine
            </span>
            <span className="text-green-500">ONLINE</span>
          </div>
          <div className="flex justify-between items-center p-2 bg-ink-900/50 rounded border border-ink-700/50">
            <span className="flex items-center gap-2 text-gray-400">
              <Sword size={14} /> Combat Systems
            </span>
            <span className="text-yellow-500 animate-pulse">PENDING</span>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-8 text-center">
          <p className="text-[10px] text-gray-600 uppercase tracking-widest">
            The Ink Is Drying
          </p>
        </div>

        {/* Start Button */}
        <div className="mt-4">
          <Button variant="primary">Start</Button>
        </div>
      </div>
    </div>
  );
}

export default App;