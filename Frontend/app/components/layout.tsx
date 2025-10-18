// components/Layout.tsx
import React from "react";
import type { ReactNode } from "react";

import Header from "./header";

export default function Layout({ children, gamePage, loginPage, leaderboardsPage, profilePage}: { children: ReactNode, gamePage?:boolean, loginPage?: boolean, leaderboardsPage?: boolean, profilePage?: boolean }) {
  return (
    <div className="flex flex-col min-h-screen">
      <Header gamePage = {gamePage} loginPage={loginPage} profilePage={profilePage} leaderboardsPage={leaderboardsPage}/>
      <main className="flex-grow">{children}</main>
    </div>
  );
}
