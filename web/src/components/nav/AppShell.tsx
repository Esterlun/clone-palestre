import type { ReactNode } from "react";
import { Header } from "./Header";
import { Sidebar } from "./Sidebar";
import { BottomNav } from "./BottomNav";

export function AppShell({ userEmail, children }: { userEmail: string; children: ReactNode }) {
  return (
    <div className="min-h-screen bg-background">
      <Sidebar userEmail={userEmail} />
      <Header />
      <main className="min-h-screen pb-20 pt-16 md:ml-64 md:pb-8">
        <div className="mx-auto max-w-2xl px-4 py-6 md:px-8">{children}</div>
      </main>
      <BottomNav />
    </div>
  );
}
