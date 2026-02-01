import { useGameState } from '../../contexts/GameContext';

export function ParticipantCounter() {
  const { participantCount } = useGameState();

  return (
    <div className="bg-white rounded-xl p-6 shadow-lg">
      <h2 className="text-xl font-bold text-maroon mb-4">Participants</h2>

      <div className="text-center">
        <p className="text-5xl font-bold text-gold mb-2">
          {participantCount}
        </p>
        <p className="text-gray-600">
          {participantCount === 1 ? 'participant' : 'participants'} joined
        </p>
      </div>
    </div>
  );
}
