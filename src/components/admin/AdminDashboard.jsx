import { useAuth } from '../../contexts/AuthContext';
import { GameControls } from './GameControls';
import { QuestionManager } from './QuestionManager';
import { ParticipantCounter } from './ParticipantCounter';
import { LeaderboardView } from './LeaderboardView';
import { Button, Logo } from '../common';

export function AdminDashboard() {
  const { logoutAdmin } = useAuth();

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-maroon shadow-lg">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Logo size="small" />
            <h1 className="text-xl font-bold text-gold">Admin Dashboard</h1>
          </div>
          <Button
            variant="outline"
            size="small"
            onClick={logoutAdmin}
          >
            Logout
          </Button>
        </div>
      </header>

      {/* Main content */}
      <main className="max-w-6xl mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left column */}
          <div className="space-y-6">
            <GameControls />
            <ParticipantCounter />
          </div>

          {/* Right column */}
          <div className="space-y-6">
            <QuestionManager />
            <LeaderboardView />
          </div>
        </div>
      </main>
    </div>
  );
}
