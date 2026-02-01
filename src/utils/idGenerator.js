import { GAME_CONFIG } from './constants';

export function generateParticipantId() {
  // Generate ID using timestamp + random for better uniqueness
  const timestamp = Date.now().toString(36);
  const random = Math.random().toString(36).substring(2, 8);

  // Format as qtmp_<timestamp><random> for uniqueness
  return `${GAME_CONFIG.PARTICIPANT_ID_PREFIX}${timestamp}${random}`;
}
