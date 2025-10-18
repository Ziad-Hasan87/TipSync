import { useEffect, useState } from "react";
import Layout from "~/components/layout";

interface TopScoreEntry {
  id: number;
  accuracy: number;
  timestamp: string;
  game_mode: string;
  user_id: number;
  score: number;
}

export default function Profile() {
  const [topscore, setTopscore] = useState<TopScoreEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchTopScore() {
      try {
        const token = localStorage.getItem("access_token");

        if (!token) {
          setError("You must be logged in to view your scores.");
          setLoading(false);
          return;
        }

        const res = await fetch("http://127.0.0.1:8000/scores/", {
          headers: {
            "accept": "application/json",
            "Authorization": `Bearer ${token}`,
          },
        });

        if (res.status === 401) {
          setError("Unauthorized: Please log in again.");
          setLoading(false);
          return;
        }

        if (!res.ok) {
          throw new Error(`HTTP error! Status: ${res.status}`);
        }

        const data: TopScoreEntry[] = await res.json();
        setTopscore(data);
      } catch (err: any) {
        setError(err.message || "Failed to fetch top scores");
      } finally {
        setLoading(false);
      }
    }

    fetchTopScore();
  }, []);

  return (
    <Layout
      gamePage={true}
      loginPage={false}
      leaderboardsPage={true}
      profilePage={false}
    >
      <div className="flex flex-col items-center justify-center h-full w-full p-8 text-white">
        <h1 className="text-3xl text-blue-500 mb-6">Profile Page</h1>

        {loading && <p className="text-gray-400">Loading Profile...</p>}
        {error && <p className="text-red-400">{error}</p>}

        {!loading && !error && topscore.length > 0 && (
          <table className="min-w-[60%] bg-slate-800 rounded-lg shadow-md text-left">
            <thead>
              <tr className="bg-slate-700 text-blue-400">
                <th className="p-3">#</th>
                <th className="p-3">Score</th>
                <th className="p-3">Accuracy</th>
                <th className="p-3">Mode</th>
                <th className="p-3">Timestamp</th>
              </tr>
            </thead>
            <tbody>
              {topscore
                .sort((a, b) => b.score - a.score)
                .map((entry, index) => (
                  <tr
                    key={entry.id}
                    className="border-b border-slate-600 hover:bg-slate-700"
                  >
                    <td className="p-3">{index + 1}</td>
                    <td className="p-3">{entry.score}</td>
                    <td className="p-3">{entry.accuracy}%</td>
                    <td className="p-3 capitalize">{entry.game_mode}</td>
                    <td className="p-3">
                      {new Date(entry.timestamp).toLocaleString()}
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        )}

        {!loading && !error && topscore.length === 0 && (
          <p className="text-gray-400">No scores found yet.</p>
        )}
      </div>
    </Layout>
  );
}
