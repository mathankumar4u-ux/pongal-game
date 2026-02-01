import {
  doc,
  setDoc,
  updateDoc,
  getDoc,
  collection,
  getDocs,
  query,
  where,
  orderBy,
  writeBatch,
  serverTimestamp,
  deleteDoc
} from 'firebase/firestore';
import { db } from './firebase';
import { GAME_STATUS } from '../utils/constants';

const gameSessionRef = doc(db, 'game_session', 'current');

// Initialize game session document if it doesn't exist
export async function initializeGameSession() {
  const sessionDoc = await getDoc(gameSessionRef);
  if (!sessionDoc.exists()) {
    await setDoc(gameSessionRef, {
      status: GAME_STATUS.IDLE,
      registrationOpen: false,
      currentQuestionIndex: -1,
      totalQuestions: 0,
      gameStartedAt: null,
      gameEndedAt: null,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });
  }
}

export async function openRegistration() {
  // Use setDoc with merge to create document if it doesn't exist
  await setDoc(gameSessionRef, {
    status: GAME_STATUS.REGISTRATION,
    registrationOpen: true,
    currentQuestionIndex: -1,
    totalQuestions: 0,
    gameStartedAt: null,
    gameEndedAt: null,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp()
  }, { merge: true });
}

export async function closeRegistrationAndStart() {
  // Get total questions count
  const questionsSnapshot = await getDocs(collection(db, 'questions'));
  const totalQuestions = questionsSnapshot.size;

  if (totalQuestions === 0) {
    throw new Error('No questions loaded. Please add questions first.');
  }

  // Update game session
  await updateDoc(gameSessionRef, {
    status: GAME_STATUS.ACTIVE,
    registrationOpen: false,
    currentQuestionIndex: 0,
    totalQuestions,
    gameStartedAt: serverTimestamp(),
    updatedAt: serverTimestamp()
  });

  // Release first question
  await releaseQuestion(1);
}

async function releaseQuestion(questionNumber) {
  const q = query(
    collection(db, 'questions'),
    where('questionNumber', '==', questionNumber)
  );

  const snapshot = await getDocs(q);
  if (snapshot.empty) return;

  await updateDoc(snapshot.docs[0].ref, {
    isActive: true,
    releasedAt: serverTimestamp()
  });
}

async function closeQuestion(questionNumber) {
  const q = query(
    collection(db, 'questions'),
    where('questionNumber', '==', questionNumber)
  );

  const snapshot = await getDocs(q);
  if (snapshot.empty) return;

  await updateDoc(snapshot.docs[0].ref, {
    isActive: false,
    closedAt: serverTimestamp()
  });
}

export async function releaseNextQuestion() {
  const sessionDoc = await getDoc(gameSessionRef);

  if (!sessionDoc.exists()) return;

  const session = sessionDoc.data();
  const currentIndex = session.currentQuestionIndex;
  const nextIndex = currentIndex + 1;

  // Close current question
  await closeQuestion(currentIndex + 1);

  // Release next question
  await releaseQuestion(nextIndex + 1);

  // Update game session
  await updateDoc(gameSessionRef, {
    currentQuestionIndex: nextIndex,
    updatedAt: serverTimestamp()
  });
}

export async function endGame() {
  // Get current session to close the last question
  const sessionDoc = await getDoc(gameSessionRef);

  if (sessionDoc.exists()) {
    const session = sessionDoc.data();
    await closeQuestion(session.currentQuestionIndex + 1);
  }

  // Calculate final scores for all participants
  await calculateFinalScores();

  // Update game session
  await updateDoc(gameSessionRef, {
    status: GAME_STATUS.ENDED,
    currentQuestionIndex: -1,
    gameEndedAt: serverTimestamp(),
    updatedAt: serverTimestamp()
  });
}

async function calculateFinalScores() {
  const participantsSnapshot = await getDocs(
    query(collection(db, 'participants'), where('isActive', '==', true))
  );

  const batch = writeBatch(db);

  for (const participantDoc of participantsSnapshot.docs) {
    const participantId = participantDoc.data().participantId;

    // Get all responses for this participant
    const responsesSnapshot = await getDocs(
      query(
        collection(db, 'responses'),
        where('participantId', '==', participantId)
      )
    );

    // Sum up scores
    const totalScore = responsesSnapshot.docs.reduce((sum, doc) => {
      return sum + (doc.data().score || 0);
    }, 0);

    batch.update(participantDoc.ref, { totalScore });
  }

  await batch.commit();
}

export async function resetGame() {
  // Reset game session
  await updateDoc(gameSessionRef, {
    status: GAME_STATUS.IDLE,
    registrationOpen: false,
    currentQuestionIndex: -1,
    totalQuestions: 0,
    gameStartedAt: null,
    gameEndedAt: null,
    updatedAt: serverTimestamp()
  });

  // Reset all questions
  const questionsSnapshot = await getDocs(collection(db, 'questions'));
  const batch = writeBatch(db);

  questionsSnapshot.docs.forEach((doc) => {
    batch.update(doc.ref, {
      isActive: false,
      releasedAt: null,
      closedAt: null
    });
  });

  await batch.commit();

  // Delete all participants
  const participantsSnapshot = await getDocs(collection(db, 'participants'));
  for (const doc of participantsSnapshot.docs) {
    await deleteDoc(doc.ref);
  }

  // Delete all responses
  const responsesSnapshot = await getDocs(collection(db, 'responses'));
  for (const doc of responsesSnapshot.docs) {
    await deleteDoc(doc.ref);
  }
}

// Question management
export async function addQuestion(questionData) {
  const questionsSnapshot = await getDocs(collection(db, 'questions'));
  const questionNumber = questionsSnapshot.size + 1;

  const newQuestion = {
    ...questionData,
    questionNumber,
    isActive: false,
    releasedAt: null,
    closedAt: null,
    createdAt: serverTimestamp()
  };

  const docRef = doc(collection(db, 'questions'));
  await setDoc(docRef, newQuestion);
  return { id: docRef.id, ...newQuestion };
}

export async function deleteQuestion(questionId) {
  await deleteDoc(doc(db, 'questions', questionId));

  // Renumber remaining questions
  const questionsSnapshot = await getDocs(
    query(collection(db, 'questions'), orderBy('questionNumber', 'asc'))
  );

  const batch = writeBatch(db);
  questionsSnapshot.docs.forEach((doc, index) => {
    batch.update(doc.ref, { questionNumber: index + 1 });
  });

  await batch.commit();
}

export async function updateQuestion(questionId, questionData) {
  await updateDoc(doc(db, 'questions', questionId), questionData);
}
