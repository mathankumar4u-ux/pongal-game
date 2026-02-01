// Game configuration
export const GAME_CONFIG = {
  QUESTION_TIME_LIMIT: 20, // seconds
  SCORE_CORRECT: 10,
  SCORE_WRONG: -5,
  SCORE_TIMEOUT: 0,
  PARTICIPANT_ID_PREFIX: 'qtmp_',
};

// Game status values
export const GAME_STATUS = {
  IDLE: 'idle',
  REGISTRATION: 'registration',
  ACTIVE: 'active',
  ENDED: 'ended',
};

// Answer options
export const ANSWER_OPTIONS = ['A', 'B', 'C', 'D'];
