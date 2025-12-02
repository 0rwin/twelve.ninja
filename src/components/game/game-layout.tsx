import { useState } from 'react';
import { Menu } from 'lucide-react';
import { SidebarPanel } from './sidebar-panel';
import { CombatPopup } from './combat-popup';
import type { CombatMessage } from './combat-popup';

interface GameLayoutProps {
  children: React.ReactNode;
  playerName: string;
  level: number;
  hp: number;
  maxHp: number;
  stamina: number;
  maxStamina: number;
  xp: number;
  ryo: number;
  locationName: string;
  locationDescription: string;
  entities: string[];
  onAction: (action: string) => void;
}

export function GameLayout({
  children,
  playerName,
  level,
  hp,
  maxHp,
  stamina,
  maxStamina,
  xp,
  ryo,
  locationName,
  locationDescription,
  entities,
  onAction
}: GameLayoutProps) {
  const [sidebarVisible, setSidebarVisible] = useState(true);
  const [combatActive, setCombatActive] = useState(false);
  const [combatLog, setCombatLog] = useState<CombatMessage[]>([]);
  const [isPlayerTurn, setIsPlayerTurn] = useState(true);
  const [enemyName, setEnemyName] = useState('Goblin');
  const [enemyHp, setEnemyHp] = useState(30);
  const [enemyMaxHp, setEnemyMaxHp] = useState(50);

  const handleBottomBarAction = (action: string) => {
    if (action === 'combat') {
      // Start a mock combat
      setCombatActive(true);
      setCombatLog([
        {
          id: '1',
          type: 'action',
          actor: 'System',
          message: `A wild ${enemyName} appears!`,
          timestamp: Date.now()
        }
      ]);
      setIsPlayerTurn(true);
    } else {
      onAction(action);
    }
  };

  const handleCombatAction = (action: string) => {
    const newMessage: CombatMessage = {
      id: Date.now().toString(),
      type: action === 'attack' ? 'damage' : 'action',
      actor: 'You',
      message: generateActionMessage(action),
      timestamp: Date.now()
    };

    setCombatLog(prev => [...prev, newMessage]);

    // Simulate damage
    if (action === 'attack') {
      const damage = Math.floor(Math.random() * 15) + 5;
      setEnemyHp(prev => Math.max(0, prev - damage));

      setTimeout(() => {
        setCombatLog(prev => [...prev, {
          id: Date.now().toString(),
          type: 'damage',
          actor: enemyName,
          message: `attacks you for ${Math.floor(Math.random() * 8) + 3} damage!`,
          timestamp: Date.now()
        }]);
      }, 1000);
    }

    setIsPlayerTurn(false);

    // Enemy turn (simplified)
    setTimeout(() => {
      setIsPlayerTurn(true);
    }, 2000);
  };

  const generateActionMessage = (action: string): string => {
    const messages: Record<string, string> = {
      attack: 'You strike with your blade!',
      defend: 'You take a defensive stance.',
      ability: 'You channel your energy...',
      item: 'You use an item from your inventory.'
    };
    return messages[action] || 'You perform an action.';
  };

  return (
    <div className="fixed inset-0 w-screen h-screen bg-ink-950 overflow-hidden">
      
      {/* Sidebar Panel */}
      {sidebarVisible && (
        <SidebarPanel
          playerName={playerName}
          level={level}
          hp={hp}
          maxHp={maxHp}
          stamina={stamina}
          maxStamina={maxStamina}
          xp={xp}
          ryo={ryo}
          onAction={handleBottomBarAction}
        />
      )}

      {/* Game Viewport - Main Content */}
      <main
        className={`absolute top-0 bottom-0 transition-all duration-300 ${
          sidebarVisible ? 'left-72' : 'left-0'
        } right-0`}
      >
        {children}
      </main>

      {/* Toggle Sidebar Button */}
      <button
        onClick={() => setSidebarVisible(!sidebarVisible)}
        className={`fixed top-4 z-50 p-2 bg-slate-900 border-2 border-amber-900 rounded hover:bg-slate-800 transition-all duration-300 ${
          sidebarVisible ? 'left-72' : 'left-4'
        }`}
        title={sidebarVisible ? 'Hide sidebar' : 'Show sidebar'}
      >
        <Menu size={20} className="text-amber-300" />
      </button>



      {/* Combat Popup */}
      <CombatPopup
        isOpen={combatActive}
        onClose={() => setCombatActive(false)}
        combatLog={combatLog}
        enemyName={enemyName}
        playerHp={hp}
        playerMaxHp={maxHp}
        enemyHp={enemyHp}
        enemyMaxHp={enemyMaxHp}
        onPlayerAction={handleCombatAction}
        isPlayerTurn={isPlayerTurn}
      />
    </div>
  );
}
