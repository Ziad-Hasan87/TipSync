// components/Header.tsx
import React from "react";
import { useAuth } from "../contexts/AuthContext";

export default function Header({
  gamePage,
  loginPage,
  leaderboardsPage,
  profilePage,
}: {
  gamePage?: boolean;
  loginPage?: boolean;
  leaderboardsPage?: boolean;
  profilePage?: boolean;
}) {
  const { user, logout } = useAuth();
  return (
    <header className="h-16 bg-[rgba(0,0,30,0.7)] flex items-center justify-between px-5">
      {/* Logo */}
      <button 
        className="h-full pl-2 pr-2 orbitron-regular bg-[wheat] text-3xl text-[black] flex items-center justify-center cursor-pointer"
        onClick={()=>window.location.href="/"}>
        TipSync
      </button>

      {/* Navigation buttons */}
      <div className="flex gap-4">
        {gamePage && (
          <button
            className="text-white py-3 px-3 rounded transition-colors duration-200 cursor-pointer bg-blue-400 hover:bg-white-700 active:bg-white-900"
            onClick={() => (window.location.href = "/")}
          >
            Play Now!
          </button>
        )}

        {/* Login / Logout */}
        {user ? (
          <>
            <div className="text-white flex items-center gap-3 px-3">{user.email}</div>
            <button
              className="text-white py-3 px-3 rounded transition-colors duration-200 cursor-pointer bg-blue-400 hover:bg-red-500"
              onClick={() => logout()}
            >
              Logout
            </button>
          </>
        ) : (
          <button
            className={`text-white py-3 px-3 rounded transition-colors duration-200 cursor-pointer
            ${
              loginPage
                ? "bg-indigo-500 hover:bg-white-700 active:bg-white-900"
                : "bg-indigo-900 hover:bg-white-700 active:bg-indigo-500"
            }`}
            onClick={() => (window.location.href = "/login")}
          >
            Login
          </button>
        )}

        {user && profilePage ? <button
          className="text-white bg-indigo-900 py-3 px-3 rounded hover:bg-indigo-700 active:bg-indigo-500 transition-colors duration-200 cursor-pointer"
          onClick={()=> (window.location.href = "/profile")}
        >
          Profile
        </button> : null}

        {leaderboardsPage && <button
          className="text-white bg-indigo-900 py-3 px-3 rounded hover:bg-indigo-700 active:bg-indigo-500 transition-colors duration-200 cursor-pointer"
          onClick={()=> window.location.href=("/leaderboards")}
        >
          Leaderboards
        </button>}
      </div>
    </header>
  );
}
