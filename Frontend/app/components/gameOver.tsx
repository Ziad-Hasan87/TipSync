import { useEffect, useRef } from "react";
import Difficulty from "~/routes/difficulty";
import { BACKENDAPI } from "~/utils";

export default function GameOver({ score, accuracy=100, mode, difficulty}: { score: number, accuracy:number, mode:string, difficulty:string}) {
  const hasSent = useRef(false);

  async function setScore() {
    const token = localStorage.getItem("access_token");
    const body = { score: score, accuracy: accuracy, game_mode: mode,  difficulty:difficulty};

    try {
      const res = await fetch(`${BACKENDAPI}/scores/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
          "accept": "application/json",
        },
        body: JSON.stringify(body),
      });

      if (res.ok) {
        const data = await res.json();
        console.log("Score submitted:", data);
      } else {
        const err = await res.text();
        console.error("Failed to submit score:", err);
      }
    } catch (error) {
      console.error("Error submitting score:", error);
    }
  }

  useEffect(() => {
    if (!hasSent.current) {
      hasSent.current = true;
      setScore();
    }
  }, []);

  return (
    <div className="flex flex-col justify-center content-center absolute text-3xl text-[lightgrey] -translate-x-2/4 -translate-y-2/4 left-2/4 top-2/4 gap-5">
      Game Over! Your Score: {score}
      <button
        onClick={() => window.location.reload()}
        className="ml-4 p-2 bg-[wheat] text-black rounded"
      >
        Restart
      </button>
    </div>
  );
}
