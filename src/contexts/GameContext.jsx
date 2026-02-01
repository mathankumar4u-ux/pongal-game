import { createContext, useContext, useReducer, useEffect } from 'react';
import { onSnapshot, doc, collection, query, where, orderBy } from 'firebase/firestore';
import { db } from '../services/firebase';
import { GAME_STATUS } from '../utils/constants';

// Initial state
const initialState = {
  status: GAME_STATUS.IDLE,
  registrationOpen: false,
  currentQuestionIndex: -1,
  totalQuestions: 0,
  currentQuestion: null,
  participantCount: 0,
  loading: true,
  error: null,
  fromCache: false
};

// Action types
const GAME_ACTIONS = {
  SET_GAME_SESSION: 'SET_GAME_SESSION',
  SET_CURRENT_QUESTION: 'SET_CURRENT_QUESTION',
  SET_PARTICIPANT_COUNT: 'SET_PARTICIPANT_COUNT',
  SET_LOADING: 'SET_LOADING',
  SET_ERROR: 'SET_ERROR',
  RESET_GAME: 'RESET_GAME'
};

// Reducer function
function gameReducer(state, action) {
  switch (action.type) {
    case GAME_ACTIONS.SET_GAME_SESSION:
      return {
        ...state,
        ...action.payload,
        loading: false
      };
    case GAME_ACTIONS.SET_CURRENT_QUESTION:
      return {
        ...state,
        currentQuestion: action.payload
      };
    case GAME_ACTIONS.SET_PARTICIPANT_COUNT:
      return {
        ...state,
        participantCount: action.payload
      };
    case GAME_ACTIONS.SET_LOADING:
      return { ...state, loading: action.payload };
    case GAME_ACTIONS.SET_ERROR:
      return { ...state, error: action.payload, loading: false };
    case GAME_ACTIONS.RESET_GAME:
      return { ...initialState, loading: false };
    default:
      return state;
  }
}

// Context creation
const GameStateContext = createContext(null);
const GameDispatchContext = createContext(null);

// Provider component
export function GameProvider({ children }) {
  const [state, dispatch] = useReducer(gameReducer, initialState);

  // Real-time listener for game session
  useEffect(() => {
    const unsubscribe = onSnapshot(
      doc(db, 'game_session', 'current'),
      (snapshot) => {
        if (snapshot.exists()) {
          dispatch({
            type: GAME_ACTIONS.SET_GAME_SESSION,
            payload: {
              ...snapshot.data(),
              fromCache: snapshot.metadata.fromCache
            }
          });
        } else {
          dispatch({
            type: GAME_ACTIONS.SET_LOADING,
            payload: false
          });
        }
      },
      (error) => {
        console.error('Game session listener error:', error);
        dispatch({
          type: GAME_ACTIONS.SET_ERROR,
          payload: error.message
        });
      }
    );

    return () => unsubscribe();
  }, []);

  // Real-time listener for current question
  useEffect(() => {
    if (state.status !== GAME_STATUS.ACTIVE || state.currentQuestionIndex < 0) {
      dispatch({ type: GAME_ACTIONS.SET_CURRENT_QUESTION, payload: null });
      return;
    }

    const q = query(
      collection(db, 'questions'),
      where('isActive', '==', true),
      where('questionNumber', '==', state.currentQuestionIndex + 1)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      if (!snapshot.empty) {
        const questionDoc = snapshot.docs[0];
        dispatch({
          type: GAME_ACTIONS.SET_CURRENT_QUESTION,
          payload: { id: questionDoc.id, ...questionDoc.data() }
        });
      } else {
        dispatch({ type: GAME_ACTIONS.SET_CURRENT_QUESTION, payload: null });
      }
    });

    return () => unsubscribe();
  }, [state.status, state.currentQuestionIndex]);

  // Real-time listener for participant count
  useEffect(() => {
    const q = query(
      collection(db, 'participants'),
      where('isActive', '==', true)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      dispatch({
        type: GAME_ACTIONS.SET_PARTICIPANT_COUNT,
        payload: snapshot.size
      });
    });

    return () => unsubscribe();
  }, []);

  return (
    <GameStateContext.Provider value={state}>
      <GameDispatchContext.Provider value={dispatch}>
        {children}
      </GameDispatchContext.Provider>
    </GameStateContext.Provider>
  );
}

// Custom hooks for consuming context
export function useGameState() {
  const context = useContext(GameStateContext);
  if (context === null) {
    throw new Error('useGameState must be used within GameProvider');
  }
  return context;
}

export function useGameDispatch() {
  const context = useContext(GameDispatchContext);
  if (context === null) {
    throw new Error('useGameDispatch must be used within GameProvider');
  }
  return context;
}
