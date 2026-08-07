"use client";

import { useActionState } from "react";
import type { ActionResult } from "../actions";

const initialState: ActionResult = {};

export function SessionDetailsForm({
  action,
  initialName,
  initialNotes,
}: {
  action: (previousState: ActionResult, formData: FormData) => Promise<ActionResult>;
  initialName: string;
  initialNotes: string | null;
}) {
  const [state, formAction, isPending] = useActionState(action, initialState);

  return (
    <form action={formAction} className="mt-4 flex flex-col gap-3 rounded-2xl border border-border/50 p-4">
      <label className="text-sm font-semibold text-text-primary">
        Nome sessione
        <input
          type="text"
          name="name"
          defaultValue={initialName}
          required
          className="mt-1 block w-full rounded-lg border border-border px-3 py-2 text-text-primary"
        />
      </label>
      <label className="text-sm font-semibold text-text-primary">
        Note
        <textarea
          name="notes"
          defaultValue={initialNotes ?? ""}
          rows={2}
          className="mt-1 block w-full rounded-lg border border-border px-3 py-2 text-text-primary"
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
        className="self-start rounded-full bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary-hover disabled:opacity-60"
      >
        {isPending ? "Salvataggio…" : "Salva"}
      </button>
    </form>
  );
}
