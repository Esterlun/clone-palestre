import Link from "next/link";

export function Header() {
  return (
    <header className="fixed inset-x-0 top-0 z-40 flex h-16 items-center justify-between border-b border-border/30 bg-background/80 px-4 backdrop-blur-xl md:left-64 md:px-8">
      <span className="text-lg font-bold tracking-tight text-primary">Clone Palestre</span>
      <Link
        href="/settings"
        aria-label="Impostazioni"
        className="flex h-10 w-10 items-center justify-center rounded-full text-text-primary transition-colors hover:bg-surface-alt-2"
      >
        <span className="material-symbols-outlined text-[22px]">settings</span>
      </Link>
    </header>
  );
}
