import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './lib/auth';
import { ProtectedRoute } from './components/ProtectedRoute';

// Pages
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import SignUpPage from './pages/SignUpPage';
import RequestResetPage from './pages/RequestResetPage';
import UpdatePasswordPage from './pages/UpdatePasswordPage';
import VerifyEmailPage from './pages/VerifyEmailPage';
import ProfilePage from './pages/ProfilePage';

// Game Components
import WorldSelection from './components/WorldSelection';
import GameContainer from './components/GameContainer';
import { useState } from 'react';

function GameApp() {
  const [gameStarted, setGameStarted] = useState(false);
  const [selectedWorld, setSelectedWorld] = useState<any>(null);

  const handleWorldSelect = (world: any) => {
    setSelectedWorld(world);
    setGameStarted(true);
  };

  const handleAction = (action: string) => {
    console.log(`Action triggered: ${action}`);
    // Here we would update the game log or state
  };

  if (!gameStarted) {
    return <WorldSelection onSelect={handleWorldSelect} />;
  }

  return (
    <GameContainer
      selectedWorld={selectedWorld}
      onAction={handleAction}
    />
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignUpPage />} />
          <Route path="/reset-password" element={<RequestResetPage />} />
          <Route path="/update-password" element={<UpdatePasswordPage />} />
          <Route path="/verify-email" element={<VerifyEmailPage />} />

          {/* Protected Routes - Require Authentication */}
          <Route
            path="/game"
            element={
              <ProtectedRoute>
                <GameApp />
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <ProfilePage />
              </ProtectedRoute>
            }
          />

          {/* Catch-all redirect */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}
