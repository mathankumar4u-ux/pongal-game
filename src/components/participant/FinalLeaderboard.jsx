import { useEffect, useState } from 'react';
import { collection, query, where, orderBy, onSnapshot } from 'firebase/firestore';
import { db } from '../../services/firebase';
import { useParticipant } from '../../contexts/ParticipantContext';
import { Logo, LoadingSpinner, Button } from '../common';
import { clsx } from 'clsx';

export function FinalLeaderboard() {
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);
  const { participant, clearParticipant } = useParticipant();

  useEffect(() => {
    const q = query(
      collection(db, 'participants'),
      where('isActive', '==', true),
      orderBy('totalScore', 'desc')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const rankings = snapshot.docs.map((doc, index) => ({
        id: doc.id,
        rank: index + 1,
        ...doc.data()
      }));
      setLeaderboard(rankings);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Find current participant's rank
  const myRank = leaderboard.find(
    (p) => p.participantId === participant?.participantId
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-maroon to-maroon-dark flex items-center justify-center">
        <LoadingSpinner size="large" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-maroon to-maroon-dark p-4 safe-area-bottom">
      <div className="max-w-lg mx-auto">
        {/* Header */}
        <div className="text-center mb-6 pt-4">
          <Logo size="small" />
          <h1 className="text-2xl font-bold text-gold mt-4">
            Final Results
          </h1>
          <p className="text-white/70 text-sm mt-1">
            Game Over! Here are the final standings
          </p>
        </div>

        {/* Your score highlight */}
        {myRank && (
          <div className="bg-gold rounded-xl p-6 mb-6 text-center">
            <p className="text-maroon-dark text-sm font-medium">Your Final Rank</p>
            <p className="text-5xl font-bold text-maroon my-2">#{myRank.rank}</p>
            <p className="text-maroon-dark text-lg">
              Score: <span className="font-bold">{myRank.totalScore}</span> points
            </p>
            <p className="text-maroon-dark/70 text-sm mt-2">
              ID: {myRank.participantId}
            </p>
          </div>
        )}

        {/* Top 3 Podium */}
        {leaderboard.length >= 3 && (
          <div className="flex justify-center items-end gap-2 mb-6">
            {/* 2nd Place */}
            <div className="text-center flex-1">
              <div className="bg-gray-300 rounded-t-lg p-3 h-20 flex flex-col items-center justify-end">
                <span className="text-2xl">🥈</span>
                <p className="text-xs text-gray-700 truncate w-full">
                  {leaderboard[1]?.participantId}
                </p>
                <p className="font-bold text-gray-800">{leaderboard[1]?.totalScore}</p>
              </div>
            </div>
            {/* 1st Place */}
            <div className="text-center flex-1">
              <div className="bg-yellow-400 rounded-t-lg p-3 h-28 flex flex-col items-center justify-end">
                <span className="text-3xl">🥇</span>
                <p className="text-xs text-yellow-900 truncate w-full">
                  {leaderboard[0]?.participantId}
                </p>
                <p className="font-bold text-yellow-900">{leaderboard[0]?.totalScore}</p>
              </div>
            </div>
            {/* 3rd Place */}
            <div className="text-center flex-1">
              <div className="bg-amber-600 rounded-t-lg p-3 h-16 flex flex-col items-center justify-end">
                <span className="text-xl">🥉</span>
                <p className="text-xs text-white truncate w-full">
                  {leaderboard[2]?.participantId}
                </p>
                <p className="font-bold text-white">{leaderboard[2]?.totalScore}</p>
              </div>
            </div>
          </div>
        )}

        {/* Full Leaderboard */}
        <div className="bg-white rounded-xl overflow-hidden shadow-lg">
          <div className="bg-maroon px-4 py-3">
            <h2 className="text-gold font-bold">Leaderboard</h2>
          </div>

          <div className="divide-y divide-gray-100 max-h-[400px] overflow-y-auto">
            {leaderboard.map((entry) => (
              <div
                key={entry.id}
                className={clsx(
                  "flex items-center px-4 py-3",
                  entry.participantId === participant?.participantId && "bg-gold/20"
                )}
              >
                {/* Rank */}
                <div className={clsx(
                  "w-10 h-10 rounded-full flex items-center justify-center font-bold flex-shrink-0",
                  entry.rank === 1 && "bg-yellow-400 text-yellow-900",
                  entry.rank === 2 && "bg-gray-300 text-gray-700",
                  entry.rank === 3 && "bg-amber-600 text-white",
                  entry.rank > 3 && "bg-gray-100 text-gray-600"
                )}>
                  {entry.rank}
                </div>

                {/* Participant ID */}
                <div className="flex-1 ml-4">
                  <p className={clsx(
                    "font-medium",
                    entry.participantId === participant?.participantId
                      ? "text-maroon"
                      : "text-gray-800"
                  )}>
                    {entry.participantId}
                    {entry.participantId === participant?.participantId && (
                      <span className="ml-2 text-xs bg-gold px-2 py-0.5 rounded">
                        YOU
                      </span>
                    )}
                  </p>
                </div>

                {/* Score */}
                <div className="text-right">
                  <p className="font-bold text-maroon">{entry.totalScore}</p>
                  <p className="text-xs text-gray-500">points</p>
                </div>
              </div>
            ))}
          </div>

          {/* Show count if more than visible */}
          {leaderboard.length > 10 && (
            <div className="px-4 py-3 bg-gray-50 text-center text-sm text-gray-600">
              Showing all {leaderboard.length} participants
            </div>
          )}
        </div>

        {/* Play Again */}
        <div className="mt-6 text-center">
          <Button
            variant="outline"
            onClick={clearParticipant}
          >
            Exit Game
          </Button>
        </div>

        {/* Thank you message */}
        <p className="text-center text-white/60 text-sm mt-4">
          Thank you for participating!
        </p>
      </div>
    </div>
  );
}
