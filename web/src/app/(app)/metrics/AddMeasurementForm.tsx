"use client";

import { useActionState, useEffect, useRef } from "react";
import { recordMeasurementAction, type MeasurementFormState } from "./actions";
import { MeasurementFormFields } from "./MeasurementFormFields";

const initialState: MeasurementFormState = { error: null };

function todayAsInputValue(): string {
  return new Date().toISOString().slice(0, 10);
}

export function AddMeasurementForm() {
  const [state, formAction, isPending] = useActionState(recordMeasurementAction, initialState);
  const formRef = useRef<HTMLFormElement>(null);
  const isFirstRender = useRef(true);

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    if (!state.error) {
      formRef.current?.reset();
    }
  }, [state]);

  return (
    <form ref={formRef} action={formAction} className="rounded-2xl border border-dashed border-border p-4">
      <p className="mb-3 text-sm font-semibold text-text-primary">Nuova misurazione</p>
      <MeasurementFormFields defaults={{ date: todayAsInputValue() }} />
      {state.error && (
        <p role="alert" className="mt-3 text-sm text-red-600">
          {state.error}
        </p>
      )}
      <button
        type="submit"
        disabled={isPending}
        className="mt-3 rounded-full bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary-hover disabled:opacity-60"
      >
        {isPending ? "Salvataggio…" : "Registra misurazione"}
      </button>
    </form>
  );
}
