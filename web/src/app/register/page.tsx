"use client";

import { useActionState } from "react";
import Link from "next/link";
import { registerAction, type RegisterFormState } from "./actions";

const initialState: RegisterFormState = { error: null };

export default function RegisterPage() {
  const [state, formAction, isPending] = useActionState(registerAction, initialState);

  return (
    <main className="auth-page">
      <h1>Crea il tuo account</h1>
      <form action={formAction}>
        <label htmlFor="email">Email</label>
        <input id="email" name="email" type="email" required autoComplete="email" />

        <label htmlFor="password">Password</label>
        <input
          id="password"
          name="password"
          type="password"
          required
          minLength={8}
          autoComplete="new-password"
        />

        {state.error && <p role="alert">{state.error}</p>}

        <button type="submit" disabled={isPending}>
          {isPending ? "Creazione in corso…" : "Crea account"}
        </button>
      </form>
      <p>
        Hai già un account? <Link href="/login">Accedi</Link>
      </p>
    </main>
  );
}
