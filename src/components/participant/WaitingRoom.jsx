import { useParticipant } from '../../contexts/ParticipantContext';
import { useGameState } from '../../contexts/GameContext';
import { Logo, LoadingSpinner } from '../common';
import { GAME_STATUS } from '../../utils/constants';

export function WaitingRoom() {
  const { participant } = useParticipant();
  const { status, participantCount } = useGameState();

  return (
    <div className="min-h-screen bg-gradient-to-b from-maroon to-maroon-dark flex flex-col items-center justify-center p-6">
      <Logo size="large" className="mb-6" />

      {/* Participant ID Display */}
      <div className="bg-gold rounded-xl p-6 text-center mb-8 w-full max-w-sm">
        <p className="text-maroon-dark text-sm font-medium mb-1">
          Your Participant ID
        </p>
        <p className="text-3xl font-bold text-maroon">
          {participant?.participantId}
        </p>
        <p className="text-maroon-dark/70 text-xs mt-2">
          Save this ID for reference
        </p>
      </div>

      {/* Status Messages */}
      <div className="text-center">
        {status === GAME_STATUS.REGISTRATION && (
          <>
            <LoadingSpinner className="mb-4" />
            <h2 className="text-xl font-semibold text-white mb-2">
              Waiting for game to start...
            </h2>
            <p className="text-white/70">
              {participantCount} participant{participantCount !== 1 ? 's' : ''} joined
            </p>
          </>
        )}

        {status === GAME_STATUS.ACTIVE && (
          <>
            <LoadingSpinner className="mb-4" />
            <h2 className="text-xl font-semibold text-white mb-2">
              Get ready!
            </h2>
            <p className="text-white/70">
              Next question coming soon...
            </p>
          </>
        )}

        {status === GAME_STATUS.IDLE && (
          <>
            <h2 className="text-xl font-semibold text-gold mb-2">
              Game not started
            </h2>
            <p className="text-white/70">
              Please wait for the host
            </p>
          </>
        )}
      </div>

      {/* Tips */}
      <div className="mt-8 bg-white/10 rounded-xl p-4 max-w-sm">
        <h3 className="text-gold font-semibold mb-2">Quick Tips:</h3>
        <ul className="text-white/80 text-sm space-y-1">
          <li>• Each question has 20 seconds</li>
          <li>• Correct answer: +10 points</li>
          <li>• Wrong answer: -5 points</li>
          <li>• Keep your screen on</li>
        </ul>
      </div>
    </div>
  );
}
