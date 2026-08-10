"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { startFreeSessionAction } from "@/app/(app)/sessions/actions";
import { NAV_ITEMS } from "./navItems";

const MIDPOINT = Math.ceil(NAV_ITEMS.length / 2);

function NavLink({ item, isActive }: { item: (typeof NAV_ITEMS)[number]; isActive: boolean }) {
  return (
    <Link
      href={item.href}
      className={`flex flex-1 flex-col items-center justify-center gap-0.5 ${
        isActive ? "font-bold text-primary" : "text-text-secondary"
      }`}
    >
      <span
        className="material-symbols-outlined text-[22px]"
        style={{ fontVariationSettings: isActive ? "'FILL' 1" : "'FILL' 0" }}
      >
        {item.icon}
      </span>
      <span className="text-[11px] leading-tight">{item.label}</span>
    </Link>
  );
}

export function BottomNav() {
  const pathname = usePathname();
  const firstHalf = NAV_ITEMS.slice(0, MIDPOINT);
  const secondHalf = NAV_ITEMS.slice(MIDPOINT);

  return (
    <nav className="fixed inset-x-0 bottom-0 z-50 flex h-16 items-center border-t border-border/30 bg-surface-alt/90 backdrop-blur-xl md:hidden">
      {firstHalf.map((item) => (
        <NavLink key={item.href} item={item} isActive={pathname.startsWith(item.href)} />
      ))}

      <form action={startFreeSessionAction} className="flex flex-1 items-center justify-center">
        <button
          type="submit"
          aria-label="Nuova sessione libera"
          className="flex h-14 w-14 -translate-y-4 items-center justify-center rounded-full bg-gradient-to-br from-primary-hover to-primary text-white shadow-[0_10px_22px_-6px_rgba(83,64,228,0.7)]"
        >
          <span className="material-symbols-outlined text-[26px]">add</span>
        </button>
      </form>

      {secondHalf.map((item) => (
        <NavLink key={item.href} item={item} isActive={pathname.startsWith(item.href)} />
      ))}
    </nav>
  );
}
