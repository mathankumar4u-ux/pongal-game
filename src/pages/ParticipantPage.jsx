import { useParticipant } from '../contexts/ParticipantContext';
import { useGameState } from '../contexts/GameContext';
import { JoinGame, WaitingRoom, QuestionDisplay, FinalLeaderboard, GameReady } from '../components/participant';
import { FullPageLoader } from '../components/common';
import { GAME_STATUS } from '../utils/constants';

export function ParticipantPage() {
  const { participant } = useParticipant();
  const { status, loading, currentQuestion, registrationOpen } = useGameState();

  // Show loading while fetching game state
  if (loading) {
    return <FullPageLoader message="Loading game..." />;
  }

  // If no participant, show join game
  if (!participant) {
    return <JoinGame />;
  }

  // Game has ended - show leaderboard
  if (status === GAME_STATUS.ENDED) {
    return <FinalLeaderboard />;
  }

  // Game is active with a current question - show question
  if (status === GAME_STATUS.ACTIVE && currentQuestion) {
    return <QuestionDisplay />;
  }

  // Registration closed, waiting for admin to start game - show "All Set!"
  if (status === GAME_STATUS.REGISTRATION && !registrationOpen) {
    return <GameReady />;
  }

  // Otherwise show waiting room
  return <WaitingRoom />;
}
