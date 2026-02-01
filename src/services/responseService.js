import {
  collection,
  addDoc,
  query,
  where,
  getDocs,
  serverTimestamp,
  doc,
  updateDoc,
  arrayUnion
} from 'firebase/firestore';
import { db } from './firebase';
import { GAME_CONFIG } from '../utils/constants';

export async function submitAnswer({
  participantId,
  participantDocId,
  questionId,
  questionNumber,
  selectedAnswer,
  correctAnswer,
  questionReleasedAt
}) {
  // Check if already answered
  const existingQuery = query(
    collection(db, 'responses'),
    where('participantId', '==', participantId),
    where('questionNumber', '==', questionNumber)
  );

  const existing = await getDocs(existingQuery);
  if (!existing.empty) {
    throw new Error('Already answered this question');
  }

  // Calculate score
  const isCorrect = selectedAnswer === correctAnswer;
  let score;
  if (selectedAnswer === null) {
    score = GAME_CONFIG.SCORE_TIMEOUT;
  } else if (isCorrect) {
    score = GAME_CONFIG.SCORE_CORRECT;
  } else {
    score = GAME_CONFIG.SCORE_WRONG;
  }

  // Calculate response time
  const responseTimeMs = questionReleasedAt
    ? Date.now() - questionReleasedAt.toMillis()
    : 0;

  // Submit response
  const response = {
    participantId,
    participantDocId,
    questionId,
    questionNumber,
    selectedAnswer,
    isCorrect,
    score,
    responseTimeMs,
    answeredAt: serverTimestamp()
  };

  const docRef = await addDoc(collection(db, 'responses'), response);

  // Update participant's answered questions
  await updateDoc(doc(db, 'participants', participantDocId), {
    answeredQuestions: arrayUnion(questionNumber)
  });

  return { id: docRef.id, ...response };
}

export async function submitTimeout({
  participantId,
  participantDocId,
  questionId,
  questionNumber
}) {
  return submitAnswer({
    participantId,
    participantDocId,
    questionId,
    questionNumber,
    selectedAnswer: null,
    correctAnswer: null,
    questionReleasedAt: null
  });
}

export async function hasAnsweredQuestion(participantId, questionNumber) {
  const q = query(
    collection(db, 'responses'),
    where('participantId', '==', participantId),
    where('questionNumber', '==', questionNumber)
  );

  const snapshot = await getDocs(q);
  return !snapshot.empty;
}
