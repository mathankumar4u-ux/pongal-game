import { createContext, useContext, useState, useEffect } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../services/firebase';

const ParticipantContext = createContext(null);

export function ParticipantProvider({ children }) {
  const [participant, setParticipantState] = useState(() => {
    // Persist participant in localStorage (survives browser close)
    const saved = localStorage.getItem('quizParticipant');
    return saved ? JSON.parse(saved) : null;
  });

  const [answeredQuestions, setAnsweredQuestions] = useState(() => {
    const saved = localStorage.getItem('answeredQuestions');
    return saved ? JSON.parse(saved) : {};
  });

  // Wrapper to update both state and localStorage
  const setParticipant = (newParticipant) => {
    setParticipantState(newParticipant);
  };

  // Verify participant still exists in Firestore on mount
  useEffect(() => {
    async function verifyParticipant() {
      if (participant?.docId) {
        try {
          const docRef = doc(db, 'participants', participant.docId);
          const docSnap = await getDoc(docRef);
          if (!docSnap.exists()) {
            // Participant was deleted (game reset), clear local data
            console.log('Participant no longer exists, clearing session');
            localStorage.removeItem('quizParticipant');
            localStorage.removeItem('answeredQuestions');
            setParticipantState(null);
            setAnsweredQuestions({});
          }
        } catch (err) {
          console.error('Error verifying participant:', err);
        }
      }
    }
    verifyParticipant();
  }, []);

  // Persist participant to localStorage
  useEffect(() => {
    if (participant) {
      localStorage.setItem('quizParticipant', JSON.stringify(participant));
    } else {
      localStorage.removeItem('quizParticipant');
    }
  }, [participant]);

  // Persist answered questions to localStorage
  useEffect(() => {
    localStorage.setItem('answeredQuestions', JSON.stringify(answeredQuestions));
  }, [answeredQuestions]);

  const markQuestionAnswered = (questionNumber) => {
    setAnsweredQuestions(prev => ({ ...prev, [questionNumber]: true }));
  };

  const hasAnsweredQuestion = (questionNumber) => {
    return answeredQuestions[questionNumber] === true;
  };

  const clearParticipant = () => {
    localStorage.removeItem('quizParticipant');
    localStorage.removeItem('answeredQuestions');
    setParticipant(null);
    setAnsweredQuestions({});
  };

  return (
    <ParticipantContext.Provider value={{
      participant,
      setParticipant,
      answeredQuestions,
      markQuestionAnswered,
      hasAnsweredQuestion,
      clearParticipant
    }}>
      {children}
    </ParticipantContext.Provider>
  );
}

export function useParticipant() {
  const context = useContext(ParticipantContext);
  if (!context) {
    throw new Error('useParticipant must be used within ParticipantProvider');
  }
  return context;
}
