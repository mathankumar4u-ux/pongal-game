import { useParticipant } from '../contexts/ParticipantContext';
import { useGameState } from '../contexts/GameContext';
import { JoinGame, WaitingRoom, QuestionDisplay, FinalLeaderboard, GameReady } from '../components/participant';
import { FullPageLoader } from '../components/common';
import { GAME_STATUS } from '../utils/constants';

export function ParticipantPage() {
  const { participant } = useParticipant();
  const { status, loading, currentQuestion } = useGameState();

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

  // Game is active but question hasn't loaded yet - show interim screen
  if (status === GAME_STATUS.ACTIVE) {
    return <GameReady />;
  }

  // Otherwise show waiting room
  return <WaitingRoom />;
}
