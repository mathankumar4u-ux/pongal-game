import { useEffect, useState } from 'react';
import { collection, onSnapshot } from 'firebase/firestore';
import { db } from '../../services/firebase';
import { LoadingSpinner } from '../common';
import { clsx } from 'clsx';

export function LeaderboardView() {
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simple query without compound index requirement
    const unsubscribe = onSnapshot(
      collection(db, 'participants'),
      (snapshot) => {
        // Filter and sort in JavaScript to avoid index issues
        const rankings = snapshot.docs
          .map((doc) => ({
            id: doc.id,
            ...doc.data()
          }))
          .filter((p) => p.isActive === true)
          .sort((a, b) => (b.totalScore || 0) - (a.totalScore || 0))
          .map((entry, index) => ({
            ...entry,
            rank: index + 1
          }));
        setLeaderboard(rankings);
        setLoading(false);
      },
      (error) => {
        console.error('Leaderboard listener error:', error);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  return (
    <div className="bg-white rounded-xl p-6 shadow-lg">
      <h2 className="text-xl font-bold text-maroon mb-4">Leaderboard</h2>

      {loading ? (
        <LoadingSpinner className="py-8" />
      ) : leaderboard.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          <p>No participants yet.</p>
        </div>
      ) : (
        <div className="max-h-[400px] overflow-y-auto">
          <table className="w-full">
            <thead className="bg-gray-50 sticky top-0">
              <tr>
                <th className="px-3 py-2 text-left text-sm font-medium text-gray-600">Rank</th>
                <th className="px-3 py-2 text-left text-sm font-medium text-gray-600">ID</th>
                <th className="px-3 py-2 text-right text-sm font-medium text-gray-600">Score</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {leaderboard.map((entry) => (
                <tr key={entry.id} className="hover:bg-gray-50">
                  <td className="px-3 py-2">
                    <span className={clsx(
                      "inline-flex items-center justify-center w-8 h-8 rounded-full font-bold text-sm",
                      entry.rank === 1 && "bg-yellow-400 text-yellow-900",
                      entry.rank === 2 && "bg-gray-300 text-gray-700",
                      entry.rank === 3 && "bg-amber-600 text-white",
                      entry.rank > 3 && "bg-gray-100 text-gray-600"
                    )}>
                      {entry.rank}
                    </span>
                  </td>
                  <td className="px-3 py-2 font-medium text-gray-800">
                    {entry.participantId}
                  </td>
                  <td className="px-3 py-2 text-right font-bold text-maroon">
                    {entry.totalScore}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <div className="mt-4 text-center text-sm text-gray-500">
        Total: {leaderboard.length} participant{leaderboard.length !== 1 ? 's' : ''}
      </div>
    </div>
  );
}
