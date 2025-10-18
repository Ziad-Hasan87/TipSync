import { useEffect, useState } from "react";
import Layout from "~/components/layout";

interface LeaderboardEntry {
  id: number;
  accuracy: number;
  timestamp: string;
  game_mode: string;
  user_email: string;
  score: number;
}

export default function Leaderboards() {
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchLeaderboard() {
      try {
        const res = await fetch(
          "http://127.0.0.1:8000/scores/leaderboard?game_mode=speed",
          {
            headers: {
              accept: "application/json",
            },
          }
        );

        if (!res.ok) {
          throw new Error(`Failed to fetch leaderboard (status ${res.status})`);
        }

        const data: LeaderboardEntry[] = await res.json();
        setLeaderboard(data);
      } catch (err: any) {
        setError(err.message || "Failed to load leaderboard");
      } finally {
        setLoading(false);
      }
    }

    fetchLeaderboard();
  }, []);

  return (
    <Layout
      gamePage={true}
      loginPage={false}
      leaderboardsPage={false}
      profilePage={true}
    >
      <div className="flex flex-col items-center justify-center h-full w-full p-8 text-white">
        <h1 className="text-3xl text-blue-500 mb-6">Leaderboard - Speed Mode</h1>

        {loading && <p className="text-gray-400">Loading leaderboard...</p>}
        {error && <p className="text-red-400">{error}</p>}

        {!loading && !error && leaderboard.length > 0 && (
          <table className="min-w-[70%] bg-slate-800 rounded-lg shadow-md text-left">
            <thead>
              <tr className="bg-slate-700 text-blue-400">
                <th className="p-3">#</th>
                <th className="p-3">Player</th>
                <th className="p-3">Score</th>
                <th className="p-3">Accuracy</th>
                <th className="p-3">Timestamp</th>
              </tr>
            </thead>
            <tbody>
              {leaderboard.map((entry, index) => (
                <tr
                  key={entry.id}
                  className="border-b border-slate-600 hover:bg-slate-700 transition-colors"
                >
                  <td className="p-3">{index + 1}</td>
                  <td className="p-3 font-semibold text-amber-300">{entry.user_email}</td>
                  <td className="p-3">{entry.score}</td>
                  <td className="p-3">{entry.accuracy}%</td>
                  <td className="p-3">{new Date(entry.timestamp).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {!loading && !error && leaderboard.length === 0 && (
          <p className="text-gray-400">No leaderboard data found.</p>
        )}
      </div>
    </Layout>
  );
}
