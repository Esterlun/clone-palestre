"use client";

import { useActionState } from "react";
import { changePasswordAction, type ChangePasswordFormState } from "./actions";

const initialState: ChangePasswordFormState = { error: null, success: false };

export function ChangePasswordForm() {
  const [state, formAction, isPending] = useActionState(changePasswordAction, initialState);

  return (
    <form action={formAction} className="mt-4 flex flex-col gap-3 rounded-2xl bg-white p-4">
      <h2 className="font-bold text-text-primary">Cambia password</h2>
      <label className="text-sm text-text-secondary">
        Password attuale
        <input
          type="password"
          name="currentPassword"
          required
          autoComplete="current-password"
          className="mt-1 w-full rounded-lg border border-border px-3 py-2 text-text-primary"
        />
      </label>
      <label className="text-sm text-text-secondary">
        Nuova password
        <input
          type="password"
          name="newPassword"
          required
          minLength={8}
          autoComplete="new-password"
          className="mt-1 w-full rounded-lg border border-border px-3 py-2 text-text-primary"
        />
      </label>
      <label className="text-sm text-text-secondary">
        Conferma nuova password
        <input
          type="password"
          name="confirmPassword"
          required
          minLength={8}
          autoComplete="new-password"
          className="mt-1 w-full rounded-lg border border-border px-3 py-2 text-text-primary"
        />
      </label>
      {state.error && (
        <p role="alert" className="text-sm text-red-600">
          {state.error}
        </p>
      )}
      {state.success && <p className="text-sm text-success">Password aggiornata.</p>}
      <button
        type="submit"
        disabled={isPending}
        className="self-start rounded-full bg-primary px-4 py-2 text-sm font-semibold text-white hover:bg-primary-hover disabled:opacity-60"
      >
        {isPending ? "Salvataggio…" : "Salva"}
      </button>
    </form>
  );
}
