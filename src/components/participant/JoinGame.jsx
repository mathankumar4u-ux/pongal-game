import { useState } from 'react';
import { useParticipant } from '../../contexts/ParticipantContext';
import { useGameState } from '../../contexts/GameContext';
import { registerParticipant } from '../../services/participantService';
import { Button, Logo } from '../common';
import { GAME_STATUS } from '../../utils/constants';

export function JoinGame() {
  const { setParticipant } = useParticipant();
  const { status, registrationOpen } = useGameState();
  const [error, setError] = useState(null);

  const handleJoinGame = async () => {
    setError(null);
    try {
      const participant = await registerParticipant();
      setParticipant(participant);
    } catch (err) {
      console.error('Failed to join game:', err);
      setError(err.message || 'Failed to join game. Please try again.');
    }
  };

  const isRegistrationClosed = status !== GAME_STATUS.REGISTRATION || !registrationOpen;

  return (
    <div className="min-h-screen bg-gradient-to-b from-maroon to-maroon-dark flex flex-col items-center justify-center p-6">
      <Logo size="xlarge" className="mb-8" />

      <h1 className="text-3xl font-bold text-gold text-center mb-2">
        Pongal Quiz
      </h1>
      <p className="text-white/80 text-center mb-8">
        Test your knowledge of Pongal traditions!
      </p>

      {isRegistrationClosed ? (
        <div className="bg-white/10 rounded-xl p-6 text-center max-w-sm">
          <p className="text-gold text-lg font-medium mb-2">
            {status === GAME_STATUS.IDLE && "Registration hasn't started yet"}
            {status === GAME_STATUS.ACTIVE && "Game is in progress"}
            {status === GAME_STATUS.ENDED && "Game has ended"}
          </p>
          <p className="text-white/70 text-sm">
            Please wait for the host to open registration.
          </p>
        </div>
      ) : (
        <div className="w-full max-w-sm">
          <Button
            onClick={handleJoinGame}
            fullWidth
            size="large"
          >
            Join Game
          </Button>

          {error && (
            <p className="mt-4 text-red-400 text-center text-sm">
              {error}
            </p>
          )}

          <p className="mt-6 text-white/60 text-center text-sm">
            You'll receive a unique participant ID
          </p>
        </div>
      )}
    </div>
  );
}
