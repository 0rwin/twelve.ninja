import { useState, useEffect, useRef } from 'react';
import { executeAction, fetchPlayerState } from '../lib/gameActions';
import type { ActionType } from '../lib/gameActions';
import { worldData } from '../data/worldData';

interface PlayerState {
  hp: number;
  maxHp: number;
  stamina: number;
  maxStamina: number;
  ryo: number;
}

interface UseGameLogicProps {
  playerId?: string;
  onAction: (action: string) => void;
}

const calculateHexSize = (viewportWidth: number) => {
  if (viewportWidth < 640) {
    // Mobile: smaller hexes
    return { width: 25, height: 28 };
  } else if (viewportWidth < 1024) {
    // Tablet: medium hexes
    return { width: 40, height: 46 };
  } else {
    // Desktop: larger hexes (cap at reasonable size)
    return { width: 55, height: 63 };
  }
};

const calculateOriginPoints = (containerWidth: number, containerHeight: number) => {
  return {
    originX: containerWidth / 2,
    originY: containerHeight / 2
  };
};

export function useGameLogic({ playerId, onAction }: UseGameLogicProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const [hexSize, setHexSize] = useState({ width: 55, height: 63 });

  // Screen state
  const [currentScreen, setCurrentScreen] = useState<'map' | 'exploration'>('map');
  const [selectedTileId, setSelectedTileId] = useState<string | null>(null);
  const [playerState, setPlayerState] = useState<PlayerState>({
    hp: 85,
    maxHp: 100,
    stamina: 42,
    maxStamina: 50,
    ryo: 125
  });

  // Handle viewport resizing and hex size calculations
  useEffect(() => {
    const updateDimensions = () => {
      if (containerRef.current) {
        const { clientWidth, clientHeight } = containerRef.current;
        setDimensions({ width: clientWidth, height: clientHeight });
        setHexSize(calculateHexSize(clientWidth));
      }
    };

    // Initial dimensions
    updateDimensions();

    // Use ResizeObserver for efficient viewport tracking
    const resizeObserver = new ResizeObserver(updateDimensions);

    if (containerRef.current) {
      resizeObserver.observe(containerRef.current);
    }

    // Fallback to window resize event
    window.addEventListener('resize', updateDimensions);

    return () => {
      resizeObserver.disconnect();
      window.removeEventListener('resize', updateDimensions);
    };
  }, []);

  // Fetch player state when component mounts or playerId changes
  useEffect(() => {
    if (playerId) {
      refreshPlayerState();
    }
  }, [playerId]);

  const refreshPlayerState = async () => {
    if (!playerId) return;

    try {
      const result = await fetchPlayerState(playerId);
      if (result.success && result.player) {
        setPlayerState({
          hp: result.player.hp || 85,
          maxHp: result.player.max_hp || 100,
          stamina: result.player.stamina || 42,
          maxStamina: result.player.max_stamina || 50,
          ryo: result.player.ryo || 0
        });
      }
    } catch (error) {
      console.error('Error refreshing player state:', error);
    }
  };

  const handleTileSelect = (tileId: string) => {
    setSelectedTileId(tileId);
    setCurrentScreen('exploration');
  };

  const handleBackToMap = () => {
    setCurrentScreen('map');
    setSelectedTileId(null);
    refreshPlayerState(); // Refresh stats when returning to map
  };

  const handleTileAction = async (action: ActionType, tileId: string) => {
    if (!playerId) {
      console.error('No player ID available');
      return;
    }

    try {
      const result = await executeAction(playerId, action, tileId);

      if (result.success && result.newStats) {
        // Update local player state with new stats from server
        setPlayerState({
          hp: result.newStats.hp ?? playerState.hp,
          maxHp: playerState.maxHp,
          stamina: result.newStats.stamina ?? playerState.stamina,
          maxStamina: playerState.maxStamina,
          ryo: result.newStats.ryo ?? playerState.ryo
        });
      }

      onAction(`${action} on tile ${tileId}: ${result.message}`);
    } catch (error) {
      console.error('Error performing tile action:', error);
      onAction(`Error: Failed to perform ${action} action`);
    }
  };

  // Calculate origin points for hex rendering
  const originPoints = calculateOriginPoints(dimensions.width, dimensions.height);

  // Get the selected tile object
  const selectedTile = selectedTileId
    ? worldData.find(t => t.id.toString() === selectedTileId)
      ? {
          ...worldData.find(t => t.id.toString() === selectedTileId)!,
          id: worldData.find(t => t.id.toString() === selectedTileId)!.id.toString()
        }
      : null
    : null;

  return {
    containerRef,
    dimensions,
    hexSize,
    currentScreen,
    selectedTileId,
    playerState,
    originPoints,
    selectedTile,
    handleTileSelect,
    handleBackToMap,
    handleTileAction
  };
}
