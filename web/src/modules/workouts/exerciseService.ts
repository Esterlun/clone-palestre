import { prisma } from "@/lib/prisma";
import { WorkoutValidationError } from "./errors";

// Un esercizio è visibile all'utente se è predefinito (ownerId null) oppure
// se gli appartiene: un esercizio personalizzato non deve mai essere
// visibile a un utente diverso da chi lo ha creato (requirements.md,
// sezione 5; boundaries.md, "Gli esercizi possono essere predefiniti o
// personali").
export async function listExercisesForUser(userId: string) {
  return prisma.exercise.findMany({
    where: { OR: [{ ownerId: null }, { ownerId: userId }] },
    orderBy: { name: "asc" },
  });
}

export interface CreateExerciseInput {
  name: string;
  tracksSets?: boolean;
  tracksReps?: boolean;
  tracksLoad?: boolean;
  tracksDuration?: boolean;
  tracksDistance?: boolean;
}

export async function createCustomExercise(userId: string, input: CreateExerciseInput) {
  if (!input.name.trim()) {
    throw new WorkoutValidationError("Il nome dell'esercizio è obbligatorio.");
  }

  const tracksSets = input.tracksSets ?? false;
  const tracksReps = input.tracksReps ?? false;
  const tracksLoad = input.tracksLoad ?? false;
  const tracksDuration = input.tracksDuration ?? false;
  const tracksDistance = input.tracksDistance ?? false;

  if (!tracksSets && !tracksReps && !tracksLoad && !tracksDuration && !tracksDistance) {
    throw new WorkoutValidationError("Seleziona almeno un dato da registrare per l'esercizio.");
  }

  return prisma.exercise.create({
    data: {
      name: input.name.trim(),
      ownerId: userId,
      tracksSets,
      tracksReps,
      tracksLoad,
      tracksDuration,
      tracksDistance,
    },
  });
}
