import MapShell from './MapShell';
import { GameHUD } from './GameHUD';

interface GameViewportProps {
  originX: number;
  originY: number;
  hexWidth: number;
  hexHeight: number;
  selectedWorld: any;
  onAction: (action: string) => void;
  onTileSelect?: (tileId: string) => void;
}

export default function GameViewport({
  originX,
  originY,
  hexWidth,
  hexHeight,
  selectedWorld,
  onAction,
  onTileSelect
}: GameViewportProps) {
  return (
    <div className="relative mx-auto w-full max-w-[1400px] min-w-[320px] h-full">
      {/* Map Layer */}
      <MapShell
        originX={originX}
        originY={originY}
        hexWidth={hexWidth}
        hexHeight={hexHeight}
        onTileSelect={onTileSelect}
      />

      {/* HUD Layer */}
      <GameHUD onAction={onAction} />
    </div>
  );
}
