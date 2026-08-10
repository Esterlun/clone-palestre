"use client";

import { useActionState, useState } from "react";
import { deleteAccountAction, type DeleteAccountFormState } from "./actions";

const initialState: DeleteAccountFormState = { error: null };

export function DeleteAccountForm() {
  const [state, formAction, isPending] = useActionState(deleteAccountAction, initialState);
  const [isConfirming, setIsConfirming] = useState(false);

  return (
    <div className="mt-4 rounded-2xl border border-danger bg-danger-surface-soft p-4">
      <h2 className="font-bold text-danger">Elimina account</h2>
      <p className="mt-1 text-sm text-text-secondary">
        Questa operazione è irreversibile e cancella tutti i tuoi dati.
      </p>

      {!isConfirming ? (
        <button
          type="button"
          onClick={() => setIsConfirming(true)}
          className="mt-3 rounded-full bg-danger-surface px-4 py-2 text-sm font-semibold text-danger hover:bg-danger-surface/70"
        >
          Elimina account
        </button>
      ) : (
        <form action={formAction} className="mt-3 flex flex-col gap-3">
          <label className="text-sm text-text-secondary">
            Conferma la password
            <input
              type="password"
              name="password"
              required
              autoComplete="current-password"
              className="mt-1 w-full rounded-[12px] border-[1.5px] border-border px-3 py-2 text-text-primary"
            />
          </label>
          {state.error && (
            <p role="alert" className="text-sm text-red-600">
              {state.error}
            </p>
          )}
          <div className="flex gap-2">
            <button
              type="submit"
              disabled={isPending}
              className="rounded-full bg-danger px-4 py-2 text-sm font-semibold text-white hover:bg-danger/90 disabled:opacity-60"
            >
              {isPending ? "Eliminazione…" : "Conferma eliminazione"}
            </button>
            <button
              type="button"
              onClick={() => setIsConfirming(false)}
              className="rounded-full border border-border px-4 py-2 text-sm font-semibold text-text-secondary hover:bg-white"
            >
              Annulla
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
