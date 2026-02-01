import { Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { GameProvider } from './contexts/GameContext';
import { ParticipantProvider } from './contexts/ParticipantContext';
import { ConnectionStatus } from './components/common';
import { AdminPage } from './pages/AdminPage';
import { ParticipantPage } from './pages/ParticipantPage';
import { NotFound } from './pages/NotFound';

function App() {
  return (
    <AuthProvider>
      <GameProvider>
        <ParticipantProvider>
          <ConnectionStatus />
          <Routes>
            <Route path="/" element={<ParticipantPage />} />
            <Route path="/admin" element={<AdminPage />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </ParticipantProvider>
      </GameProvider>
    </AuthProvider>
  );
}

export default App;
