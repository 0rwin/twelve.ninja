import { Link } from 'react-router-dom';
import { Scroll } from 'lucide-react';

export function HeroSection() {
  return (
    <div className="max-w-4xl w-full text-center mb-12">
      <div className="mb-6">
        <div className="w-24 h-24 bg-ink-800/50 border-2 border-parchment-500/30 rounded-full mx-auto flex items-center justify-center mb-4 backdrop-blur-sm">
          <Scroll className="text-parchment-500 opacity-80" size={48} />
        </div>
      </div>

      <h1 className="text-6xl font-serif text-parchment-100 mb-4 tracking-wide">
        Twelve Ninja
      </h1>

      <p className="text-xl text-parchment-200 mb-8 font-mono tracking-wide">
        十二忍者 • The Shadow War Begins
      </p>

      <p className="text-parchment-200/80 max-w-2xl mx-auto mb-12 leading-relaxed">
        Navigate a world of shifting allegiances where twelve ninja codes vie for dominance.
        Each tile conquered, each battle fought, each alliance forged shapes the fate of the realm.
      </p>

      {/* CTA Buttons */}
      <div className="flex gap-4 justify-center mb-16">
        <Link
          to="/signup"
          className="relative px-8 py-3 font-sans font-medium transition-all duration-300 border backdrop-blur-sm group overflow-hidden tracking-widest uppercase text-sm bg-hanko-500/10 border-hanko-500 text-hanko-500 hover:bg-hanko-500 hover:text-white hover:shadow-[0_0_20px_rgba(205,56,56,0.6)] active:scale-95"
        >
          <span className="relative z-10">Begin Your Journey</span>
        </Link>

        <Link
          to="/login"
          className="relative px-8 py-3 font-sans font-medium transition-all duration-300 border backdrop-blur-sm group overflow-hidden tracking-widest uppercase text-sm border-parchment-500/50 text-parchment-200 hover:border-parchment-500 hover:text-parchment-100 hover:bg-parchment-500/10"
        >
          <span className="relative z-10">Sign In</span>
        </Link>
      </div>
    </div>
  );
}
