"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState, useTransition } from "react";
import { ExercisePicker, type ExerciseOption } from "@/components/exercises/ExercisePicker";
import {
  addSessionExerciseAction,
  completeSessionAction,
  recordSetResultAction,
  removeSessionExerciseAction,
  updateSessionExerciseAction,
  type ActionResult,
} from "../actions";
import { DeleteSessionButton } from "./DeleteSessionButton";
import { SessionDetailsForm } from "./SessionDetailsForm";

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

interface SessionExerciseData {
  id: string;
  exerciseId: string;
  exerciseName: string;
  tracksReps: boolean;
  tracksLoad: boolean;
  tracksDuration: boolean;
  tracksDistance: boolean;
  setResults: SetResultData[];
  plannedSets: number | null;
  plannedReps: number | null;
  targetLoad: number | null;
}

interface SessionRunnerProps {
  sessionId: string;
  sessionName: string;
  sessionNotes: string | null;
  sessionExercises: SessionExerciseData[];
  exercises: ExerciseOption[];
  detailsAction: (previousState: ActionResult, formData: FormData) => Promise<ActionResult>;
  deleteAction: () => Promise<void>;
}

function formatPlanned(plannedSets: number | null, plannedReps: number | null, targetLoad: number | null): string | null {
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

export function SessionRunner({
  sessionId,
  sessionName,
  sessionNotes,
  sessionExercises,
  exercises,
  detailsAction,
  deleteAction,
}: SessionRunnerProps) {
  const router = useRouter();
  const [activeIndex, setActiveIndex] = useState(0);
  const [isResting, setIsResting] = useState(false);
  const [isPickingExercise, setIsPickingExercise] = useState(false);
  const [isAddingExercise, setIsAddingExercise] = useState(false);
  const [newExerciseId, setNewExerciseId] = useState("");
  const [showDetails, setShowDetails] = useState(false);
  const [availableExercises, setAvailableExercises] = useState<ExerciseOption[]>(exercises);
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const previousCount = useRef(sessionExercises.length);

  useEffect(() => {
    if (sessionExercises.length > previousCount.current) {
      setActiveIndex(sessionExercises.length - 1);
      setIsAddingExercise(false);
      setNewExerciseId("");
    } else if (activeIndex > sessionExercises.length - 1) {
      setActiveIndex(Math.max(sessionExercises.length - 1, 0));
    }
    previousCount.current = sessionExercises.length;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sessionExercises.length]);

  const activeExercise = sessionExercises[activeIndex] as SessionExerciseData | undefined;
  const isLast = activeIndex >= sessionExercises.length - 1;

  function goPrevious() {
    setActiveIndex((index) => Math.max(index - 1, 0));
    setIsPickingExercise(false);
  }

  function goNext() {
    setActiveIndex((index) => Math.min(index + 1, sessionExercises.length - 1));
    setIsPickingExercise(false);
  }

  function swapExercise(exerciseId: string) {
    if (!activeExercise) return;
    setError(null);
    startTransition(async () => {
      const result = await updateSessionExerciseAction(sessionId, activeExercise.id, { exerciseId });
      if (result.error) {
        setError(result.error);
        return;
      }
      setIsPickingExercise(false);
      router.refresh();
    });
  }

  function removeActiveExercise() {
    if (!activeExercise) return;
    setError(null);
    startTransition(async () => {
      const result = await removeSessionExerciseAction(sessionId, activeExercise.id);
      if (result.error) {
        setError(result.error);
        return;
      }
      router.refresh();
    });
  }

  function addExercise() {
    if (!newExerciseId) return;
    setError(null);
    startTransition(async () => {
      const result = await addSessionExerciseAction(sessionId, { exerciseId: newExerciseId });
      if (result.error) {
        setError(result.error);
        return;
      }
      router.refresh();
    });
  }

  function completeOrNext() {
    if (!isLast) {
      goNext();
      return;
    }
    setError(null);
    startTransition(async () => {
      const result = await completeSessionAction(sessionId);
      if (result.error) {
        setError(result.error);
        return;
      }
      router.refresh();
    });
  }

  return (
    <div className="fixed inset-0 z-[60] flex flex-col overflow-y-auto bg-[#e9e8f0]">
      <div className="sticky top-0 z-10 flex items-center justify-between bg-[#e9e8f0]/95 px-5 py-4 backdrop-blur">
        <div>
          <p className="text-xs font-bold uppercase tracking-wide text-primary">Sessione in corso</p>
          <h1 className="text-lg font-bold text-text-primary">{sessionName}</h1>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setShowDetails((value) => !value)}
            aria-label="Dettagli sessione"
            className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-text-primary shadow-sm"
          >
            <span className="material-symbols-outlined text-[20px]">tune</span>
          </button>
          <Link
            href="/dashboard"
            aria-label="Chiudi"
            className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-text-primary shadow-sm"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </Link>
        </div>
      </div>

      {showDetails && (
        <div className="mx-5 mb-2 flex flex-col gap-3 rounded-2xl bg-white p-4">
          <SessionDetailsForm action={detailsAction} initialName={sessionName} initialNotes={sessionNotes} />
          <DeleteSessionButton action={deleteAction} sessionName={sessionName} />
        </div>
      )}

      <div className="flex-1 px-5 pb-32">
        {sessionExercises.length === 0 || !activeExercise ? (
          <div className="mt-10 rounded-2xl bg-white/70 p-6 text-center text-text-secondary">
            Nessun esercizio in questa sessione ancora. Aggiungine uno per iniziare.
          </div>
        ) : (
          <>
            <div className="mt-4 flex items-center justify-between rounded-2xl bg-white/70 px-4 py-2.5 text-sm font-medium text-text-secondary">
              <button type="button" onClick={goPrevious} disabled={activeIndex === 0} className="disabled:opacity-30">
                ← Precedente
              </button>
              <span>
                Esercizio {activeIndex + 1} di {sessionExercises.length}
              </span>
              <button type="button" onClick={goNext} disabled={isLast} className="disabled:opacity-30">
                Successivo →
              </button>
            </div>

            <div className="mt-4">
              {isPickingExercise ? (
                <div className="rounded-2xl bg-white p-3">
                  <ExercisePicker
                    exercises={availableExercises}
                    value={activeExercise.exerciseId}
                    onChange={swapExercise}
                    onExerciseCreated={(exercise) =>
                      setAvailableExercises((current) =>
                        current.some((item) => item.id === exercise.id) ? current : [...current, exercise]
                      )
                    }
                  />
                  <button
                    type="button"
                    onClick={() => setIsPickingExercise(false)}
                    className="mt-2 text-xs font-medium text-text-muted"
                  >
                    Annulla
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => setIsPickingExercise(true)}
                  className="flex items-center gap-2 text-left text-2xl font-bold text-text-primary"
                >
                  {activeExercise.exerciseName}
                  <span className="material-symbols-outlined text-[18px] text-text-muted">edit</span>
                </button>
              )}
              <button
                type="button"
                onClick={removeActiveExercise}
                disabled={isPending}
                className="mt-1 block text-xs font-medium text-text-muted hover:text-red-600"
              >
                Rimuovi esercizio
              </button>
            </div>

            <ActiveExercisePanel key={activeExercise.id} sessionId={sessionId} sessionExercise={activeExercise} />
          </>
        )}

        {isAddingExercise ? (
          <div className="mt-4 rounded-2xl border-[1.5px] border-dashed border-primary p-4">
            <ExercisePicker
              exercises={availableExercises}
              value={newExerciseId}
              onChange={setNewExerciseId}
              onExerciseCreated={(exercise) =>
                setAvailableExercises((current) =>
                  current.some((item) => item.id === exercise.id) ? current : [...current, exercise]
                )
              }
            />
            <div className="mt-2 flex gap-2">
              <button
                type="button"
                onClick={addExercise}
                disabled={!newExerciseId || isPending}
                className="rounded-full bg-primary px-4 py-2 text-sm font-semibold text-white disabled:opacity-60"
              >
                Aggiungi
              </button>
              <button
                type="button"
                onClick={() => setIsAddingExercise(false)}
                className="rounded-full border border-border px-4 py-2 text-sm font-semibold text-text-secondary"
              >
                Annulla
              </button>
            </div>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => setIsAddingExercise(true)}
            className="mt-4 w-full rounded-2xl border-[1.5px] border-dashed border-primary py-3 text-sm font-semibold text-primary"
          >
            + Nuovo esercizio
          </button>
        )}

        {error && (
          <p role="alert" className="mt-3 text-sm text-red-600">
            {error}
          </p>
        )}
      </div>

      <div className="sticky bottom-0 z-10 flex items-center gap-3 border-t border-border/30 bg-white px-5 py-4">
        <button
          type="button"
          onClick={() => setIsResting((resting) => !resting)}
          className={`rounded-full px-4 py-2.5 text-sm font-semibold ${
            isResting ? "bg-primary text-white" : "border border-border text-text-secondary"
          }`}
        >
          {isResting ? "In pausa…" : "Riposo"}
        </button>
        <button
          type="button"
          onClick={completeOrNext}
          disabled={isPending || sessionExercises.length === 0}
          className="flex-1 rounded-full bg-primary px-5 py-2.5 text-sm font-bold text-white shadow-[0_10px_22px_-8px_rgba(83,64,228,0.6)] disabled:opacity-60"
        >
          {isLast ? "Termina allenamento" : "Prossimo esercizio"}
        </button>
      </div>
    </div>
  );
}

function ActiveExercisePanel({
  sessionId,
  sessionExercise,
}: {
  sessionId: string;
  sessionExercise: SessionExerciseData;
}) {
  const [rows, setRows] = useState<SetRow[]>(() =>
    sessionExercise.setResults.length > 0
      ? sessionExercise.setResults.map(toRow)
      : [{ setNumber: 1, reps: null, load: null, durationSeconds: null, distanceMeters: null, saved: false }]
  );
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const plannedLabel = formatPlanned(sessionExercise.plannedSets, sessionExercise.plannedReps, sessionExercise.targetLoad);
  const firstUnsavedIndex = rows.findIndex((row) => !row.saved);

  function updateRow(setNumber: number, changes: Partial<SetRow>) {
    setRows((current) =>
      current.map((row) => (row.setNumber === setNumber ? { ...row, ...changes, saved: false } : row))
    );
  }

  function removeUnsavedRow(setNumber: number) {
    setRows((current) => current.filter((row) => row.setNumber !== setNumber));
  }

  function saveRow(row: SetRow) {
    setError(null);
    startTransition(async () => {
      const result = await recordSetResultAction(sessionId, sessionExercise.id, {
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
    });
  }

  return (
    <div className="mt-4">
      {plannedLabel && <p className="text-xs text-text-muted">{plannedLabel}</p>}

      <ul className="mt-3 flex flex-col gap-2.5">
        {rows.map((row, index) => {
          const status = row.saved ? "completed" : index === firstUnsavedIndex ? "active" : "waiting";
          const statusClasses =
            status === "completed"
              ? "border-2 border-accent/60 bg-accent/10 opacity-85"
              : status === "active"
                ? "border-2 border-primary opacity-100"
                : "border border-border opacity-65";

          return (
            <li key={row.setNumber} className={`flex flex-wrap items-center gap-2.5 rounded-xl bg-white p-3 ${statusClasses}`}>
              <span
                className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-bold ${
                  row.saved ? "bg-accent text-dark-card" : "bg-surface-alt-2 text-text-muted"
                }`}
              >
                {row.saved ? <span className="material-symbols-outlined text-[16px]">check</span> : row.setNumber}
              </span>

              {sessionExercise.tracksReps && (
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
              {sessionExercise.tracksLoad && (
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
              {sessionExercise.tracksDuration && (
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
              {sessionExercise.tracksDistance && (
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
                className={`rounded-full px-3 py-1 text-xs font-semibold ${
                  row.saved ? "bg-surface-alt-2 text-text-secondary" : "bg-primary text-white hover:bg-primary-hover"
                }`}
              >
                {row.saved ? "Salvata" : "Salva"}
              </button>

              {!row.saved && rows.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeUnsavedRow(row.setNumber)}
                  aria-label="Rimuovi serie"
                  className="text-text-muted hover:text-red-600"
                >
                  <span className="material-symbols-outlined text-[18px]">delete</span>
                </button>
              )}
            </li>
          );
        })}
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
        className="mt-3 rounded-full border-[1.5px] border-dashed border-primary px-4 py-1.5 text-sm font-semibold text-primary"
      >
        + Aggiungi serie
      </button>

      {error && (
        <p role="alert" className="mt-2 text-sm text-red-600">
          {error}
        </p>
      )}
    </div>
  );
}
