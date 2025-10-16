// components/Layout.tsx
import React from "react";
import type { ReactNode } from "react";

import Header from "./header";

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow">{children}</main>
    </div>
  );
}
