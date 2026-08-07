"use client";

import { useActionState } from "react";
import Link from "next/link";
import { loginAction, type LoginFormState } from "./actions";

const initialState: LoginFormState = { error: null };

export default function LoginPage() {
  const [state, formAction, isPending] = useActionState(loginAction, initialState);

  return (
    <main className="auth-page">
      <h1>Accedi</h1>
      <form action={formAction}>
        <label htmlFor="email">Email</label>
        <input id="email" name="email" type="email" required autoComplete="email" />

        <label htmlFor="password">Password</label>
        <input
          id="password"
          name="password"
          type="password"
          required
          autoComplete="current-password"
        />

        {state.error && <p role="alert">{state.error}</p>}

        <button type="submit" disabled={isPending}>
          {isPending ? "Accesso in corso…" : "Accedi"}
        </button>
      </form>
      <p>
        Non hai ancora un account? <Link href="/register">Crea account</Link>
      </p>
    </main>
  );
}
