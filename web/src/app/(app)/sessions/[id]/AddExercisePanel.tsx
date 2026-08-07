"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { ExercisePicker, type ExerciseOption } from "@/components/exercises/ExercisePicker";
import { addSessionExerciseAction } from "../actions";

export function AddExercisePanel({
  sessionId,
  exercises,
}: {
  sessionId: string;
  exercises: ExerciseOption[];
}) {
  const router = useRouter();
  const [availableExercises, setAvailableExercises] = useState<ExerciseOption[]>(exercises);
  const [selectedId, setSelectedId] = useState("");
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  function addExercise() {
    if (!selectedId) {
      return;
    }
    setError(null);
    startTransition(async () => {
      const result = await addSessionExerciseAction(sessionId, { exerciseId: selectedId });
      if (result.error) {
        setError(result.error);
        return;
      }
      setSelectedId("");
      router.refresh();
    });
  }

  return (
    <div className="rounded-2xl border border-dashed border-border p-4">
      <p className="mb-2 text-sm font-semibold text-text-primary">Aggiungi esercizio</p>
      <div className="flex items-start gap-2">
        <div className="flex-1">
          <ExercisePicker
            exercises={availableExercises}
            value={selectedId}
            onChange={setSelectedId}
            onExerciseCreated={(exercise) =>
              setAvailableExercises((current) =>
                current.some((item) => item.id === exercise.id) ? current : [...current, exercise]
              )
            }
          />
        </div>
        <button
          type="button"
          onClick={addExercise}
          disabled={!selectedId || isPending}
          className="rounded-full bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary-hover disabled:opacity-60"
        >
          Aggiungi
        </button>
      </div>
      {error && (
        <p role="alert" className="mt-2 text-sm text-red-600">
          {error}
        </p>
      )}
    </div>
  );
}
