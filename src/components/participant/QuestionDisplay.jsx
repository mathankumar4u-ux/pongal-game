import { useState, useCallback, useEffect } from 'react';
import { useGameState } from '../../contexts/GameContext';
import { useParticipant } from '../../contexts/ParticipantContext';
import { submitAnswer, submitTimeout } from '../../services/responseService';
import { Timer, LoadingSpinner } from '../common';
import { AnswerOptions } from './AnswerOptions';
import { AnswerFeedback } from './AnswerFeedback';
import { WaitingRoom } from './WaitingRoom';
import { GAME_CONFIG } from '../../utils/constants';

export function QuestionDisplay() {
  const { currentQuestion, loading } = useGameState();
  const { participant, hasAnsweredQuestion, markQuestionAnswered } = useParticipant();
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState(null);

  // Reset state when question changes
  useEffect(() => {
    if (currentQuestion) {
      const alreadyAnswered = hasAnsweredQuestion(currentQuestion.questionNumber);
      if (!alreadyAnswered) {
        setSelectedAnswer(null);
        setSubmitted(false);
        setError(null);
      } else {
        setSubmitted(true);
      }
    }
  }, [currentQuestion?.questionNumber, hasAnsweredQuestion]);

  const handleSelectAnswer = async (answer) => {
    if (submitted || isSubmitting || !currentQuestion) return;
    if (hasAnsweredQuestion(currentQuestion.questionNumber)) return;

    setSelectedAnswer(answer);
    setIsSubmitting(true);
    setError(null);

    try {
      await submitAnswer({
        participantId: participant.participantId,
        participantDocId: participant.docId,
        questionId: currentQuestion.id,
        questionNumber: currentQuestion.questionNumber,
        selectedAnswer: answer,
        correctAnswer: currentQuestion.correctAnswer,
        questionReleasedAt: currentQuestion.releasedAt
      });

      markQuestionAnswered(currentQuestion.questionNumber);
      setSubmitted(true);
    } catch (err) {
      console.error('Failed to submit answer:', err);
      setError(err.message || 'Failed to submit. Please try again.');
      setSelectedAnswer(null);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleTimeout = useCallback(async () => {
    if (submitted || !currentQuestion) return;
    if (hasAnsweredQuestion(currentQuestion.questionNumber)) return;

    setIsSubmitting(true);

    try {
      await submitTimeout({
        participantId: participant.participantId,
        participantDocId: participant.docId,
        questionId: currentQuestion.id,
        questionNumber: currentQuestion.questionNumber
      });

      markQuestionAnswered(currentQuestion.questionNumber);
      setSubmitted(true);
    } catch (err) {
      console.error('Failed to submit timeout:', err);
    } finally {
      setIsSubmitting(false);
    }
  }, [currentQuestion, participant, submitted, hasAnsweredQuestion, markQuestionAnswered]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-maroon to-maroon-dark flex items-center justify-center">
        <LoadingSpinner size="large" />
      </div>
    );
  }

  if (!currentQuestion) {
    return <WaitingRoom />;
  }

  // Show feedback if already answered
  if (submitted || hasAnsweredQuestion(currentQuestion.questionNumber)) {
    return <AnswerFeedback selectedAnswer={selectedAnswer} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-maroon to-maroon-dark p-4 safe-area-top safe-area-bottom">
      <div className="max-w-lg mx-auto">
        {/* Question number badge */}
        <div className="text-center mb-4">
          <span className="inline-block px-4 py-1 bg-gold text-maroon-dark font-bold rounded-full">
            Question {currentQuestion.questionNumber}
          </span>
        </div>

        {/* Timer */}
        <div className="mb-6">
          <Timer
            duration={GAME_CONFIG.QUESTION_TIME_LIMIT}
            startTime={currentQuestion.releasedAt}
            onTimeout={handleTimeout}
            isPaused={submitted}
          />
        </div>

        {/* Question text */}
        <div className="bg-white rounded-xl p-6 mb-6 shadow-lg">
          <p className="text-lg text-gray-800 text-center font-medium">
            {currentQuestion.text}
          </p>
        </div>

        {/* Answer options */}
        <AnswerOptions
          options={currentQuestion.options}
          selectedAnswer={selectedAnswer}
          onSelect={handleSelectAnswer}
          disabled={isSubmitting}
        />

        {/* Error message */}
        {error && (
          <p className="mt-4 text-red-400 text-center text-sm">
            {error}
          </p>
        )}

        {/* Submitting indicator */}
        {isSubmitting && (
          <div className="mt-4 flex items-center justify-center gap-2 text-gold">
            <LoadingSpinner size="small" />
            <span>Submitting...</span>
          </div>
        )}
      </div>
    </div>
  );
}
