"use client";

import { useActionState } from "react";
import Link from "next/link";
import { loginAction, type LoginFormState } from "./actions";

const initialState: LoginFormState = { error: null };

export default function LoginPage() {
  const [state, formAction, isPending] = useActionState(loginAction, initialState);

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-gradient-to-b from-background to-surface-alt-2 px-4 py-10">
      <div className="pointer-events-none absolute -left-16 -top-16 h-72 w-72 rounded-full bg-primary/25 blur-[80px]" />
      <div className="pointer-events-none absolute -bottom-16 -right-16 h-64 w-64 rounded-full bg-accent/20 blur-[70px]" />

      <div className="relative w-full max-w-[400px] rounded-[28px] bg-white p-8 shadow-[0_24px_60px_-20px_rgba(83,64,228,0.25)]">
        <div className="flex items-center gap-2.5">
          <span className="flex h-[34px] w-[34px] items-center justify-center rounded-[10px] bg-gradient-to-br from-primary-hover to-primary text-sm font-black text-white">
            CP
          </span>
          <span className="text-sm font-bold tracking-tight text-text-primary">Clone Palestre</span>
        </div>

        <h1 className="mt-6 text-[26px] font-bold text-text-primary">Accedi</h1>

        <form action={formAction} className="mt-6 flex flex-col gap-3.5">
          <label className="text-sm font-medium text-text-secondary" htmlFor="email">
            Email
            <input
              id="email"
              name="email"
              type="email"
              required
              autoComplete="email"
              className="mt-1 w-full rounded-[12px] border-[1.5px] border-border px-3.5 py-2.5 text-text-primary"
            />
          </label>

          <label className="text-sm font-medium text-text-secondary" htmlFor="password">
            Password
            <input
              id="password"
              name="password"
              type="password"
              required
              autoComplete="current-password"
              className="mt-1 w-full rounded-[12px] border-[1.5px] border-border px-3.5 py-2.5 text-text-primary"
            />
          </label>

          {state.error && (
            <p role="alert" className="text-sm text-red-600">
              {state.error}
            </p>
          )}

          <button
            type="submit"
            disabled={isPending}
            className="mt-2 w-full rounded-full bg-gradient-to-br from-primary-hover to-primary px-5 py-3 text-sm font-bold text-white shadow-[0_12px_26px_-8px_rgba(83,64,228,0.7)] disabled:opacity-60"
          >
            {isPending ? "Accesso in corso…" : "Accedi"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-text-secondary">
          Non hai ancora un account?{" "}
          <Link href="/register" className="font-semibold text-primary hover:text-primary-hover">
            Crea account
          </Link>
        </p>
      </div>
    </main>
  );
}
