import { useState } from 'react';
import { useGameState } from '../../contexts/GameContext';
import {
  openRegistration,
  closeRegistration,
  startGame,
  releaseNextQuestion,
  endGame,
  resetGame,
  initializeGameSession
} from '../../services/adminService';
import { Button } from '../common';
import { GAME_STATUS } from '../../utils/constants';
import { clsx } from 'clsx';

export function GameControls() {
  const { status, currentQuestionIndex, totalQuestions, registrationOpen } = useGameState();
  const [error, setError] = useState(null);

  const handleAction = async (action, confirmMessage = null) => {
    if (confirmMessage && !confirm(confirmMessage)) return;

    setError(null);

    try {
      await action();
    } catch (err) {
      console.error('Action failed:', err);
      setError(err.message || 'Action failed');
    }
  };

  const statusColors = {
    [GAME_STATUS.IDLE]: 'bg-gray-300 text-gray-700',
    [GAME_STATUS.REGISTRATION]: 'bg-blue-100 text-blue-700',
    [GAME_STATUS.ACTIVE]: 'bg-green-100 text-green-700',
    [GAME_STATUS.ENDED]: 'bg-red-100 text-red-700'
  };

  return (
    <div className="bg-white rounded-xl p-6 shadow-lg">
      <h2 className="text-xl font-bold text-maroon mb-4">Game Controls</h2>

      {/* Status indicator */}
      <div className="mb-6 p-4 bg-gray-50 rounded-lg">
        <div className="flex items-center justify-between mb-2">
          <span className="text-gray-600">Status:</span>
          <span className={clsx(
            "px-3 py-1 rounded-full font-medium text-sm",
            statusColors[status] || statusColors[GAME_STATUS.IDLE]
          )}>
            {status ? status.charAt(0).toUpperCase() + status.slice(1) : 'Unknown'}
          </span>
        </div>

        {status === GAME_STATUS.ACTIVE && (
          <div className="flex items-center justify-between">
            <span className="text-gray-600">Question:</span>
            <span className="font-bold text-maroon">
              {currentQuestionIndex + 1} / {totalQuestions}
            </span>
          </div>
        )}
      </div>

      {/* Error display */}
      {error && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg text-sm">
          {error}
        </div>
      )}

      {/* Control buttons */}
      <div className="space-y-3">
        {/* Initialize button (if no session exists) */}
        {!status && (
          <Button
            onClick={() => handleAction(initializeGameSession)}
            fullWidth
          >
            Initialize Game
          </Button>
        )}

        {/* Open Registration */}
        {status === GAME_STATUS.IDLE && (
          <Button
            onClick={() => handleAction(openRegistration)}
            fullWidth
          >
            Open Registration
          </Button>
        )}

        {/* Close Registration */}
        {status === GAME_STATUS.REGISTRATION && registrationOpen && (
          <Button
            onClick={() => handleAction(
              closeRegistration,
              'This will close registration. Continue?'
            )}
            variant="warning"
            fullWidth
          >
            Close Registration
          </Button>
        )}

        {/* Registration closed - waiting to start game */}
        {status === GAME_STATUS.REGISTRATION && !registrationOpen && (
          <>
            <div className="p-4 bg-green-50 border border-green-200 rounded-lg text-center mb-3">
              <p className="text-green-800 font-semibold text-lg">All Set!</p>
              <p className="text-green-600 text-sm mt-1">
                Registration is closed. Participants are seeing the ready screen.
                Start the game when everyone is ready.
              </p>
            </div>
            <Button
              onClick={() => handleAction(startGame)}
              fullWidth
            >
              Start Game - Release Question 1
            </Button>
          </>
        )}

        {/* Release Next Question / End Game */}
        {status === GAME_STATUS.ACTIVE && (
          <>
            {currentQuestionIndex < totalQuestions - 1 ? (
              <Button
                onClick={() => handleAction(releaseNextQuestion)}
                fullWidth
              >
                Release Question {currentQuestionIndex + 2}
              </Button>
            ) : (
              <Button
                onClick={() => handleAction(
                  endGame,
                  'This will end the game and reveal final scores. Continue?'
                )}
                variant="danger"
                fullWidth
              >
                End Game & Show Results
              </Button>
            )}
          </>
        )}

        {/* Reset Game */}
        {status === GAME_STATUS.ENDED && (
          <Button
            onClick={() => handleAction(
              resetGame,
              'This will reset all data (participants, responses). Continue?'
            )}
            variant="secondary"
            fullWidth
          >
            Reset Game
          </Button>
        )}
      </div>

      {/* Instructions */}
      <div className="mt-6 p-4 bg-gold/10 rounded-lg">
        <h3 className="font-semibold text-maroon mb-2">Game Flow:</h3>
        <ol className="text-sm text-gray-700 space-y-1 list-decimal list-inside">
          <li>Add questions before starting</li>
          <li>Open registration for participants</li>
          <li>Close registration to start the game</li>
          <li>Release questions one by one</li>
          <li>End game to show final scores</li>
        </ol>
      </div>
    </div>
  );
}
