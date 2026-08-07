"use client";

import { useState, useTransition } from "react";
import { createExerciseAction, type CreatedExercise } from "@/lib/exerciseActions";

export type ExerciseOption = CreatedExercise;

interface ExercisePickerProps {
  exercises: ExerciseOption[];
  value: string;
  onChange: (exerciseId: string) => void;
  onExerciseCreated: (exercise: ExerciseOption) => void;
}

const TRACK_FIELDS = [
  { key: "tracksSets", label: "Serie" },
  { key: "tracksReps", label: "Ripetizioni" },
  { key: "tracksLoad", label: "Carico" },
  { key: "tracksDuration", label: "Durata" },
  { key: "tracksDistance", label: "Distanza" },
] as const;

type TrackKey = (typeof TRACK_FIELDS)[number]["key"];

const DEFAULT_TRACKS: Record<TrackKey, boolean> = {
  tracksSets: true,
  tracksReps: true,
  tracksLoad: true,
  tracksDuration: false,
  tracksDistance: false,
};

// Picker riutilizzabile per scegliere un esercizio (predefinito o
// personalizzato) o crearne uno nuovo al volo. Usato dal form dei modelli e,
// nei passi successivi, dai flussi di sessione.
export function ExercisePicker({ exercises, value, onChange, onExerciseCreated }: ExercisePickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [isCreating, setIsCreating] = useState(false);
  const [newName, setNewName] = useState("");
  const [newTracks, setNewTracks] = useState<Record<TrackKey, boolean>>(DEFAULT_TRACKS);
  const [createError, setCreateError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const selected = exercises.find((exercise) => exercise.id === value);
  const filtered = exercises.filter((exercise) =>
    exercise.name.toLowerCase().includes(search.trim().toLowerCase())
  );
  const predefined = filtered.filter((exercise) => exercise.ownerId === null);
  const custom = filtered.filter((exercise) => exercise.ownerId !== null);

  function selectExercise(exerciseId: string) {
    onChange(exerciseId);
    setIsOpen(false);
    setIsCreating(false);
    setSearch("");
  }

  function submitNewExercise() {
    setCreateError(null);
    startTransition(async () => {
      const result = await createExerciseAction({ name: newName, ...newTracks });
      if (result.error || !result.exercise) {
        setCreateError(result.error ?? "Non è stato possibile creare l'esercizio.");
        return;
      }
      onExerciseCreated(result.exercise);
      selectExercise(result.exercise.id);
      setNewName("");
      setNewTracks(DEFAULT_TRACKS);
    });
  }

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setIsOpen((open) => !open)}
        className="w-full rounded-xl border border-border px-3 py-2 text-left text-text-primary"
      >
        {selected ? selected.name : "Scegli un esercizio…"}
      </button>

      {isOpen && (
        <div className="absolute z-20 mt-1 w-full rounded-xl border border-border bg-background p-3 shadow-lg">
          <input
            type="text"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Cerca esercizio…"
            className="w-full rounded-lg border border-border px-2 py-1.5 text-sm text-text-primary"
          />

          <div className="mt-2 max-h-56 overflow-y-auto">
            {predefined.length > 0 && (
              <div>
                <p className="mt-2 text-xs font-semibold uppercase text-text-muted">Predefiniti</p>
                {predefined.map((exercise) => (
                  <button
                    key={exercise.id}
                    type="button"
                    onClick={() => selectExercise(exercise.id)}
                    className="block w-full rounded-lg px-2 py-1.5 text-left text-sm text-text-primary hover:bg-surface-alt-2"
                  >
                    {exercise.name}
                  </button>
                ))}
              </div>
            )}
            {custom.length > 0 && (
              <div>
                <p className="mt-2 text-xs font-semibold uppercase text-text-muted">Personalizzati</p>
                {custom.map((exercise) => (
                  <button
                    key={exercise.id}
                    type="button"
                    onClick={() => selectExercise(exercise.id)}
                    className="block w-full rounded-lg px-2 py-1.5 text-left text-sm text-text-primary hover:bg-surface-alt-2"
                  >
                    {exercise.name}
                  </button>
                ))}
              </div>
            )}
            {predefined.length === 0 && custom.length === 0 && (
              <p className="mt-2 text-sm text-text-secondary">Nessun esercizio trovato.</p>
            )}
          </div>

          <div className="mt-3 border-t border-border/50 pt-3">
            {!isCreating ? (
              <button
                type="button"
                onClick={() => setIsCreating(true)}
                className="text-sm font-medium text-primary hover:text-primary-hover"
              >
                + Crea esercizio personalizzato
              </button>
            ) : (
              <div className="flex flex-col gap-2">
                <input
                  type="text"
                  value={newName}
                  onChange={(event) => setNewName(event.target.value)}
                  placeholder="Nome esercizio"
                  className="w-full rounded-lg border border-border px-2 py-1.5 text-sm text-text-primary"
                />
                <div className="flex flex-wrap gap-3">
                  {TRACK_FIELDS.map((field) => (
                    <label key={field.key} className="flex items-center gap-1.5 text-sm text-text-secondary">
                      <input
                        type="checkbox"
                        checked={newTracks[field.key]}
                        onChange={(event) =>
                          setNewTracks((current) => ({ ...current, [field.key]: event.target.checked }))
                        }
                      />
                      {field.label}
                    </label>
                  ))}
                </div>
                {createError && (
                  <p role="alert" className="text-sm text-red-600">
                    {createError}
                  </p>
                )}
                <button
                  type="button"
                  onClick={submitNewExercise}
                  disabled={isPending || !newName.trim()}
                  className="self-start rounded-full bg-primary px-4 py-1.5 text-sm font-medium text-white hover:bg-primary-hover disabled:opacity-60"
                >
                  {isPending ? "Creazione…" : "Crea e seleziona"}
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
