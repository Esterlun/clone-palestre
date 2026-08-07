"use server";

import { requireCurrentUser } from "@/lib/auth";
import { WorkoutValidationError } from "@/modules/workouts/errors";
import { createCustomExercise, type CreateExerciseInput } from "@/modules/workouts/exerciseService";

export interface CreatedExercise {
  id: string;
  name: string;
  ownerId: string | null;
  tracksSets: boolean;
  tracksReps: boolean;
  tracksLoad: boolean;
  tracksDuration: boolean;
  tracksDistance: boolean;
}

export interface CreateExerciseActionResult {
  exercise?: CreatedExercise;
  error?: string;
}

// Azione condivisa (non legata a una singola route) perché il picker che la
// invoca sarà riusato sia dai modelli sia, in un passo successivo, dai flussi
// di sessione.
export async function createExerciseAction(input: CreateExerciseInput): Promise<CreateExerciseActionResult> {
  const user = await requireCurrentUser();

  try {
    const exercise = await createCustomExercise(user.id, input);
    return { exercise };
  } catch (error) {
    if (error instanceof WorkoutValidationError) {
      return { error: error.message };
    }
    return { error: "Non è stato possibile creare l'esercizio. Riprova." };
  }
}
