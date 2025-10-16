// components/Layout.tsx
import React from "react";
import type { ReactNode } from "react";

import Header from "./header";

export default function Layout({ children, gamePage, loginPage, leaderboardsPage, username }: { children: ReactNode, gamePage?:boolean, loginPage?: boolean, leaderboardsPage?: boolean, username?: string }) {
  return (
    <div className="flex flex-col min-h-screen">
      <Header gamePage = {gamePage} loginPage={loginPage} leaderboardsPage={leaderboardsPage} username={username} />
      <main className="flex-grow">{children}</main>
    </div>
  );
}
