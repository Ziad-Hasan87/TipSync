import type { Route } from "./+types/home";
import Layout  from "~/components/layout";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "New React Router App" },
    { name: "description", content: "Welcome to React Router!" },
  ];
}

export default function Home() {
  return <Layout loginPage={true} leaderboardsPage={true} profilePage={true} gamePage={true}>
      <div className="flex-1 flex flex-col items-center justify-center gap-6">
        <button 
          className="text-white py-3 text-5xl px-3 rounded transition-colors duration-200 cursor-pointer bg-blue-400 hover:bg-blue-700 active:bg-blue-900"
          onClick={()=>window.location.href="/gamespeed"}
        >
          Play Speed Mode!
        </button>
        <button 
          className="text-white text-5xl py-3 px-3 rounded transition-colors duration-200 cursor-pointer bg-blue-400 hover:bg-blue-700 active:bg-blue-900"
          onClick={()=>window.location.href="/gamesync"}
        >
          Play Sync Mode!
        </button>
      </div>
    </Layout>;
}
