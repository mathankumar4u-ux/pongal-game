import { Logo, LoadingSpinner } from '../common';

export function AnswerFeedback({ selectedAnswer }) {
  return (
    <div className="min-h-screen bg-gradient-to-b from-maroon to-maroon-dark flex flex-col items-center justify-center p-6">
      <Logo size="medium" className="mb-6" />

      <div className="bg-white rounded-xl p-8 text-center max-w-sm w-full">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg
            className="w-8 h-8 text-green-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 13l4 4L19 7"
            />
          </svg>
        </div>

        <h2 className="text-xl font-bold text-gray-800 mb-2">
          Answer Submitted!
        </h2>

        {selectedAnswer ? (
          <p className="text-gray-600">
            You selected option <span className="font-bold text-maroon">{selectedAnswer}</span>
          </p>
        ) : (
          <p className="text-gray-600">
            Time ran out
          </p>
        )}

        <p className="text-gray-500 text-sm mt-4">
          Your score will be revealed at the end
        </p>
      </div>

      <div className="mt-8 text-center">
        <LoadingSpinner size="small" className="mb-2" />
        <p className="text-white/70 text-sm">
          Waiting for next question...
        </p>
      </div>
    </div>
  );
}
