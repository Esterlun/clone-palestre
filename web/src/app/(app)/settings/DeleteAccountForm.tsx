"use client";

import { useActionState } from "react";
import { deleteAccountAction, type DeleteAccountFormState } from "./actions";

const initialState: DeleteAccountFormState = { error: null };

export function DeleteAccountForm() {
  const [state, formAction, isPending] = useActionState(deleteAccountAction, initialState);

  return (
    <form
      action={formAction}
      onSubmit={(event) => {
        if (
          !window.confirm(
            "Eliminare definitivamente il tuo account? Tutti i modelli, le sessioni e le metriche verranno persi. L'operazione non è reversibile."
          )
        ) {
          event.preventDefault();
        }
      }}
      className="mt-4 flex flex-col gap-3 rounded-2xl border border-red-200 p-4"
    >
      <h2 className="font-semibold text-red-700">Elimina account</h2>
      <p className="text-sm text-text-secondary">
        Questa operazione è irreversibile e cancella tutti i tuoi dati.
      </p>
      <label className="text-sm text-text-secondary">
        Conferma la password
        <input
          type="password"
          name="password"
          required
          autoComplete="current-password"
          className="mt-1 w-full rounded-lg border border-border px-3 py-2 text-text-primary"
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
        className="self-start rounded-full border border-red-300 px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50 disabled:opacity-60"
      >
        {isPending ? "Eliminazione…" : "Elimina account"}
      </button>
    </form>
  );
}
