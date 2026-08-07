"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { recordSetResultAction, removeSessionExerciseAction } from "../actions";

interface SetResultData {
  setNumber: number;
  reps: number | null;
  load: number | null;
  durationSeconds: number | null;
  distanceMeters: number | null;
}

interface SetRow extends SetResultData {
  saved: boolean;
}

interface SessionExercisePanelProps {
  sessionId: string;
  sessionExerciseId: string;
  exerciseName: string;
  tracksReps: boolean;
  tracksLoad: boolean;
  tracksDuration: boolean;
  tracksDistance: boolean;
  initialSets: SetResultData[];
  plannedSets?: number | null;
  plannedReps?: number | null;
  targetLoad?: number | null;
}

// Mostra ciò che il modello prevedeva, per confronto con i risultati
// realmente registrati sotto: pura visualizzazione, non modifica mai i dati
// del modello (boundaries.md, "Modello e sessione sono diversi").
function formatPlanned(plannedSets?: number | null, plannedReps?: number | null, targetLoad?: number | null): string | null {
  const parts: string[] = [];
  if (plannedSets) parts.push(`${plannedSets} serie`);
  if (plannedReps) parts.push(`${plannedReps} rip.`);
  if (targetLoad) parts.push(`${targetLoad} kg`);
  return parts.length > 0 ? `Previsto: ${parts.join(" · ")}` : null;
}

function toRow(data: SetResultData): SetRow {
  return { ...data, saved: true };
}

function nextSetNumber(rows: SetRow[]): number {
  return rows.reduce((max, row) => Math.max(max, row.setNumber), 0) + 1;
}

export function SessionExercisePanel({
  sessionId,
  sessionExerciseId,
  exerciseName,
  tracksReps,
  tracksLoad,
  tracksDuration,
  tracksDistance,
  initialSets,
  plannedSets,
  plannedReps,
  targetLoad,
}: SessionExercisePanelProps) {
  const router = useRouter();
  const plannedLabel = formatPlanned(plannedSets, plannedReps, targetLoad);
  const [rows, setRows] = useState<SetRow[]>(() =>
    initialSets.length > 0 ? initialSets.map(toRow) : [{ setNumber: 1, reps: null, load: null, durationSeconds: null, distanceMeters: null, saved: false }]
  );
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  function updateRow(setNumber: number, changes: Partial<SetRow>) {
    setRows((current) =>
      current.map((row) => (row.setNumber === setNumber ? { ...row, ...changes, saved: false } : row))
    );
  }

  function saveRow(row: SetRow) {
    setError(null);
    startTransition(async () => {
      const result = await recordSetResultAction(sessionId, sessionExerciseId, {
        setNumber: row.setNumber,
        reps: row.reps,
        load: row.load,
        durationSeconds: row.durationSeconds,
        distanceMeters: row.distanceMeters,
      });
      if (result.error) {
        setError(result.error);
        return;
      }
      setRows((current) =>
        current.map((item) => (item.setNumber === row.setNumber ? { ...item, saved: true } : item))
      );
      router.refresh();
    });
  }

  function removeExercise() {
    setError(null);
    startTransition(async () => {
      const result = await removeSessionExerciseAction(sessionId, sessionExerciseId);
      if (result.error) {
        setError(result.error);
        return;
      }
      router.refresh();
    });
  }

  return (
    <li className="rounded-2xl border border-border/50 p-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-semibold text-text-primary">{exerciseName}</h3>
          {plannedLabel && <p className="text-xs text-text-muted">{plannedLabel}</p>}
        </div>
        <button
          type="button"
          onClick={removeExercise}
          disabled={isPending}
          className="text-sm text-text-muted hover:text-red-600"
        >
          Rimuovi
        </button>
      </div>

      <ul className="mt-3 flex flex-col gap-2">
        {rows.map((row) => (
          <li key={row.setNumber} className="flex flex-wrap items-end gap-2">
            <span className="w-6 text-sm font-semibold text-text-muted">{row.setNumber}.</span>
            {tracksReps && (
              <label className="text-xs text-text-secondary">
                Rip.
                <input
                  type="number"
                  min={0}
                  value={row.reps ?? ""}
                  onChange={(event) =>
                    updateRow(row.setNumber, { reps: event.target.value ? Number(event.target.value) : null })
                  }
                  className="mt-1 block w-16 rounded-lg border border-border px-2 py-1 text-text-primary"
                />
              </label>
            )}
            {tracksLoad && (
              <label className="text-xs text-text-secondary">
                Carico (kg)
                <input
                  type="number"
                  min={0}
                  step="0.5"
                  value={row.load ?? ""}
                  onChange={(event) =>
                    updateRow(row.setNumber, { load: event.target.value ? Number(event.target.value) : null })
                  }
                  className="mt-1 block w-20 rounded-lg border border-border px-2 py-1 text-text-primary"
                />
              </label>
            )}
            {tracksDuration && (
              <label className="text-xs text-text-secondary">
                Durata (s)
                <input
                  type="number"
                  min={0}
                  value={row.durationSeconds ?? ""}
                  onChange={(event) =>
                    updateRow(row.setNumber, {
                      durationSeconds: event.target.value ? Number(event.target.value) : null,
                    })
                  }
                  className="mt-1 block w-20 rounded-lg border border-border px-2 py-1 text-text-primary"
                />
              </label>
            )}
            {tracksDistance && (
              <label className="text-xs text-text-secondary">
                Distanza (m)
                <input
                  type="number"
                  min={0}
                  value={row.distanceMeters ?? ""}
                  onChange={(event) =>
                    updateRow(row.setNumber, {
                      distanceMeters: event.target.value ? Number(event.target.value) : null,
                    })
                  }
                  className="mt-1 block w-24 rounded-lg border border-border px-2 py-1 text-text-primary"
                />
              </label>
            )}
            <button
              type="button"
              onClick={() => saveRow(row)}
              disabled={isPending}
              className={`rounded-full px-3 py-1 text-xs font-medium ${
                row.saved ? "bg-surface-alt-2 text-text-secondary" : "bg-primary text-white hover:bg-primary-hover"
              }`}
            >
              {row.saved ? "Salvata" : "Salva"}
            </button>
          </li>
        ))}
      </ul>

      <button
        type="button"
        onClick={() =>
          setRows((current) => [
            ...current,
            {
              setNumber: nextSetNumber(current),
              reps: null,
              load: null,
              durationSeconds: null,
              distanceMeters: null,
              saved: false,
            },
          ])
        }
        className="mt-2 text-sm font-medium text-primary hover:text-primary-hover"
      >
        + Aggiungi serie
      </button>

      {error && (
        <p role="alert" className="mt-2 text-sm text-red-600">
          {error}
        </p>
      )}
    </li>
  );
}
