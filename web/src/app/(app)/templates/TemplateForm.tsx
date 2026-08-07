"use client";

import { useActionState, useState } from "react";
import { ExercisePicker, type ExerciseOption } from "@/components/exercises/ExercisePicker";
import type { TemplateFormState } from "./actions";

export type { ExerciseOption };

interface ExerciseRow {
  key: string;
  exerciseId: string;
  plannedSets: string;
  plannedReps: string;
  targetLoad: string;
  notes: string;
}

interface InitialTemplateExercise {
  exerciseId: string;
  plannedSets: number | null;
  plannedReps: number | null;
  targetLoad: number | null;
  notes: string | null;
}

interface TemplateFormProps {
  action: (previousState: TemplateFormState, formData: FormData) => Promise<TemplateFormState>;
  exercises: ExerciseOption[];
  initialName?: string;
  initialNotes?: string | null;
  initialExercises?: InitialTemplateExercise[];
  submitLabel: string;
}

let nextRowKey = 0;

function makeRow(source?: InitialTemplateExercise): ExerciseRow {
  nextRowKey += 1;
  return {
    key: `row-${nextRowKey}`,
    exerciseId: source?.exerciseId ?? "",
    plannedSets: source?.plannedSets != null ? String(source.plannedSets) : "",
    plannedReps: source?.plannedReps != null ? String(source.plannedReps) : "",
    targetLoad: source?.targetLoad != null ? String(source.targetLoad) : "",
    notes: source?.notes ?? "",
  };
}

const initialState: TemplateFormState = { error: null };

export function TemplateForm({
  action,
  exercises,
  initialName = "",
  initialNotes = "",
  initialExercises = [],
  submitLabel,
}: TemplateFormProps) {
  const [state, formAction, isPending] = useActionState(action, initialState);
  const [rows, setRows] = useState<ExerciseRow[]>(() =>
    initialExercises.length > 0 ? initialExercises.map(makeRow) : [makeRow()]
  );
  const [availableExercises, setAvailableExercises] = useState<ExerciseOption[]>(exercises);

  function updateRow(key: string, changes: Partial<ExerciseRow>) {
    setRows((current) => current.map((row) => (row.key === key ? { ...row, ...changes } : row)));
  }

  function removeRow(key: string) {
    setRows((current) => current.filter((row) => row.key !== key));
  }

  function exerciseFor(exerciseId: string): ExerciseOption | undefined {
    return availableExercises.find((exercise) => exercise.id === exerciseId);
  }

  function addCreatedExercise(exercise: ExerciseOption) {
    setAvailableExercises((current) =>
      current.some((item) => item.id === exercise.id) ? current : [...current, exercise]
    );
  }

  const hasEmptyRow = rows.some((row) => !row.exerciseId);

  return (
    <form action={formAction} className="mt-6 flex flex-col gap-6">
      <input type="hidden" name="exercisesJson" value={JSON.stringify(rows)} />

      <div>
        <label htmlFor="name" className="text-sm font-semibold text-text-primary">
          Nome del modello
        </label>
        <input
          id="name"
          name="name"
          defaultValue={initialName}
          required
          className="mt-1 w-full rounded-xl border border-border px-3 py-2 text-text-primary"
        />
      </div>

      <div>
        <label htmlFor="notes" className="text-sm font-semibold text-text-primary">
          Note (facoltative)
        </label>
        <textarea
          id="notes"
          name="notes"
          defaultValue={initialNotes ?? ""}
          rows={2}
          className="mt-1 w-full rounded-xl border border-border px-3 py-2 text-text-primary"
        />
      </div>

      <div>
        <div className="flex items-center justify-between">
          <h2 className="font-semibold text-text-primary">Esercizi</h2>
          <button
            type="button"
            onClick={() => setRows((current) => [...current, makeRow()])}
            className="text-sm font-medium text-primary hover:text-primary-hover"
          >
            + Aggiungi esercizio
          </button>
        </div>

        {rows.length === 0 && (
          <p className="mt-3 text-sm text-text-secondary">Aggiungi almeno un esercizio.</p>
        )}

        <ul className="mt-3 flex flex-col gap-4">
          {rows.map((row, index) => {
            const selected = exerciseFor(row.exerciseId);
            return (
              <li key={row.key} className="rounded-2xl border border-border/50 p-4">
                <div className="flex items-start gap-3">
                  <span className="mt-2 text-sm font-semibold text-text-muted">{index + 1}.</span>
                  <div className="flex-1">
                    <ExercisePicker
                      exercises={availableExercises}
                      value={row.exerciseId}
                      onChange={(exerciseId) => updateRow(row.key, { exerciseId })}
                      onExerciseCreated={addCreatedExercise}
                    />

                    <div className="mt-3 grid grid-cols-3 gap-2">
                      {(!selected || selected.tracksSets) && (
                        <label className="text-xs text-text-secondary">
                          Serie previste
                          <input
                            type="number"
                            min={0}
                            value={row.plannedSets}
                            onChange={(event) => updateRow(row.key, { plannedSets: event.target.value })}
                            className="mt-1 w-full rounded-lg border border-border px-2 py-1.5 text-text-primary"
                          />
                        </label>
                      )}
                      {(!selected || selected.tracksReps) && (
                        <label className="text-xs text-text-secondary">
                          Ripetizioni previste
                          <input
                            type="number"
                            min={0}
                            value={row.plannedReps}
                            onChange={(event) => updateRow(row.key, { plannedReps: event.target.value })}
                            className="mt-1 w-full rounded-lg border border-border px-2 py-1.5 text-text-primary"
                          />
                        </label>
                      )}
                      {(!selected || selected.tracksLoad) && (
                        <label className="text-xs text-text-secondary">
                          Carico obiettivo (kg)
                          <input
                            type="number"
                            min={0}
                            step="0.5"
                            value={row.targetLoad}
                            onChange={(event) => updateRow(row.key, { targetLoad: event.target.value })}
                            className="mt-1 w-full rounded-lg border border-border px-2 py-1.5 text-text-primary"
                          />
                        </label>
                      )}
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => removeRow(row.key)}
                    aria-label="Rimuovi esercizio"
                    className="mt-1 text-text-muted hover:text-text-primary"
                  >
                    <span className="material-symbols-outlined text-[20px]">close</span>
                  </button>
                </div>
              </li>
            );
          })}
        </ul>
      </div>

      {hasEmptyRow && (
        <p className="text-sm text-text-secondary">Scegli un esercizio per ogni riga prima di salvare.</p>
      )}

      {state.error && (
        <p role="alert" className="text-sm text-red-600">
          {state.error}
        </p>
      )}

      <button
        type="submit"
        disabled={isPending || rows.length === 0 || hasEmptyRow}
        className="self-start rounded-full bg-primary px-5 py-2.5 font-medium text-white hover:bg-primary-hover disabled:opacity-60"
      >
        {isPending ? "Salvataggio…" : submitLabel}
      </button>
    </form>
  );
}
