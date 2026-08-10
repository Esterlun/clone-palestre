"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { logoutAction } from "@/lib/authActions";
import { startFreeSessionAction } from "@/app/(app)/sessions/actions";
import { NAV_ITEMS } from "./navItems";

export function Sidebar({ userEmail }: { userEmail: string }) {
  const pathname = usePathname();

  return (
    <aside className="fixed inset-y-0 left-0 z-50 hidden w-64 flex-col border-r border-border/20 bg-background py-8 md:flex">
      <h2 className="mb-6 px-6 text-2xl font-bold tracking-tight text-primary">Clone Palestre</h2>

      <form action={startFreeSessionAction} className="px-6">
        <button
          type="submit"
          className="flex w-full items-center justify-center gap-1.5 rounded-full bg-gradient-to-br from-primary-hover to-primary px-4 py-2.5 text-sm font-bold text-white shadow-[0_8px_20px_-8px_rgba(83,64,228,0.6)]"
        >
          <span className="material-symbols-outlined text-[18px]">add</span>
          Nuova sessione libera
        </button>
      </form>

      <nav className="mt-6 flex flex-1 flex-col">
        {NAV_ITEMS.map((item) => {
          const isActive = pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-4 px-6 py-3.5 font-medium transition-colors ${
                isActive
                  ? "border-r-4 border-primary bg-primary/10 font-bold text-primary"
                  : "text-text-secondary hover:bg-surface-alt-2"
              }`}
            >
              <span
                className="material-symbols-outlined text-[22px]"
                style={{ fontVariationSettings: isActive ? "'FILL' 1" : "'FILL' 0" }}
              >
                {item.icon}
              </span>
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-border/20 px-6 pt-4">
        <p className="mb-3 truncate text-sm text-text-muted">{userEmail}</p>
        <form action={logoutAction}>
          <button
            type="submit"
            className="flex items-center gap-2 rounded-full px-3 py-2 text-sm font-medium text-text-secondary hover:bg-surface-alt-2"
          >
            <span className="material-symbols-outlined text-[20px]">logout</span>
            Esci
          </button>
        </form>
      </div>
    </aside>
  );
}
