import { BackgroundLayout } from '../components/layout/BackgroundLayout';
import { HeroSection } from '../components/HeroSection';
import { FeaturesGrid } from '../components/FeaturesGrid';

export default function LandingPage() {
  return (
    <BackgroundLayout>
      <div className="flex flex-col items-center justify-center min-h-screen px-6 py-12">
        <HeroSection />
        <FeaturesGrid />

        {/* Footer */}
        <div className="text-center text-parchment-200/50 text-xs font-mono mt-8">
          <p>A browser-based tactical RPG • Built with ink and shadow</p>
        </div>
      </div>
    </BackgroundLayout>
  );
}
