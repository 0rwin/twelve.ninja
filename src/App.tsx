import WorldSelection from './components/WorldSelection';

export default function App() {
  // For now, we can render MapPage directly or inside AppShell if we want to test it.
  // The user asked to "Wire components into a MapPage route".
  // Let's assume we want to show MapPage for now to verify it.
  return <WorldSelection />;
}
