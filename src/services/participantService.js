import {
  doc,
  setDoc,
  collection,
  query,
  where,
  getDocs,
  serverTimestamp
} from 'firebase/firestore';
import { db } from './firebase';
import { generateParticipantId } from '../utils/idGenerator';

export async function registerParticipant() {
  // Generate unique participant ID (synchronous now)
  const participantId = generateParticipantId();

  // Create participant document
  const participantData = {
    participantId,
    totalScore: 0,
    isActive: true,
    joinedAt: serverTimestamp(),
    lastActiveAt: serverTimestamp(),
    answeredQuestions: []
  };

  const docRef = doc(collection(db, 'participants'));

  // Wait for the database write to complete before returning
  try {
    await setDoc(docRef, participantData);
  } catch (err) {
    console.error('Failed to save participant:', err);
    throw new Error('Registration failed. Please check your connection and try again.');
  }

  return {
    docId: docRef.id,
    participantId,
    totalScore: 0,
    isActive: true
  };
}

export async function getParticipantByDisplayId(participantId) {
  const q = query(
    collection(db, 'participants'),
    where('participantId', '==', participantId)
  );

  const snapshot = await getDocs(q);
  if (snapshot.empty) {
    return null;
  }

  const doc = snapshot.docs[0];
  return {
    docId: doc.id,
    ...doc.data()
  };
}

export async function updateParticipantActivity(docId) {
  const participantRef = doc(db, 'participants', docId);
  await setDoc(participantRef, {
    lastActiveAt: serverTimestamp()
  }, { merge: true });
}
