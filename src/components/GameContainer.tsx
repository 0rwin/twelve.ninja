import GameViewport from './GameViewport';
import TileExploration from './TileExploration';
import { BackgroundLayout } from '../components/layout/BackgroundLayout';
import { GameLayout } from './game/game-layout';
import { useGameLogic } from '../hooks/useGameLogic';

interface GameContainerProps {
  selectedWorld: any;
  onAction: (action: string) => void;
  playerId?: string;
}

export default function GameContainer({ selectedWorld, onAction, playerId }: GameContainerProps) {
  const {
    containerRef,
    hexSize,
    currentScreen,
    playerState,
    originPoints,
    selectedTile,
    handleTileSelect,
    handleBackToMap,
    handleTileAction
  } = useGameLogic({ playerId, onAction });

  return (
    <BackgroundLayout>
      <GameLayout
        playerName="Shadow Blade"
        level={1}
        hp={playerState.hp}
        maxHp={playerState.maxHp}
        stamina={playerState.stamina}
        maxStamina={playerState.maxStamina}
        xp={35}
        ryo={playerState.ryo}
        locationName={selectedTile?.name || 'Unknown Location'}
        locationDescription={selectedTile?.description || 'You find yourself in an unknown place.'}
        entities={['Wild Berry Bush', 'Traveling Merchant']}
        onAction={onAction}
      >
        <div
          ref={containerRef}
          className="relative w-full h-screen overflow-hidden"
        >
          {currentScreen === 'map' ? (
            <GameViewport
              originX={originPoints.originX}
              originY={originPoints.originY}
              hexWidth={hexSize.width}
              hexHeight={hexSize.height}
              selectedWorld={selectedWorld}
              onAction={onAction}
              onTileSelect={handleTileSelect}
            />
          ) : (
            selectedTile && (
              <TileExploration
                tile={selectedTile}
                player={playerState}
                onBack={handleBackToMap}
                onAction={handleTileAction}
              />
            )
          )}
        </div>
      </GameLayout>
    </BackgroundLayout>
  );
}
