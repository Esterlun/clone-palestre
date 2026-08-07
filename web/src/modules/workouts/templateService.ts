import { prisma } from "@/lib/prisma";
import { WorkoutNotFoundError, WorkoutValidationError } from "./errors";
import type { CreateWorkoutTemplateInput, UpdateWorkoutTemplateInput } from "./types";

const templateInclude = {
  templateExercises: { include: { exercise: true }, orderBy: { order: "asc" as const } },
};

function assertUniqueExerciseOrder(exercises: { order: number }[]): void {
  const uniqueOrders = new Set(exercises.map((exercise) => exercise.order));
  if (uniqueOrders.size !== exercises.length) {
    throw new WorkoutValidationError("Ogni esercizio del modello deve avere un ordine univoco.");
  }
}

export async function createWorkoutTemplate(userId: string, input: CreateWorkoutTemplateInput) {
  if (!input.name.trim()) {
    throw new WorkoutValidationError("Il nome del modello è obbligatorio.");
  }
  assertUniqueExerciseOrder(input.exercises);

  return prisma.workoutTemplate.create({
    data: {
      userId,
      name: input.name.trim(),
      notes: input.notes ?? null,
      templateExercises: {
        create: input.exercises.map((exercise) => ({
          exerciseId: exercise.exerciseId,
          order: exercise.order,
          plannedSets: exercise.plannedSets ?? null,
          plannedReps: exercise.plannedReps ?? null,
          targetLoad: exercise.targetLoad ?? null,
          notes: exercise.notes ?? null,
        })),
      },
    },
    include: templateInclude,
  });
}

/**
 * Legge un modello verificando che appartenga all'utente indicato. Usata sia
 * come lettura pubblica sia come controllo di appartenenza prima di
 * modificare/eliminare (evita di duplicare il controllo in ogni funzione).
 */
export async function getWorkoutTemplateForUser(userId: string, templateId: string) {
  const template = await prisma.workoutTemplate.findFirst({
    where: { id: templateId, userId },
    include: templateInclude,
  });
  if (!template) {
    throw new WorkoutNotFoundError("Modello non trovato.");
  }
  return template;
}

export async function listWorkoutTemplates(userId: string) {
  return prisma.workoutTemplate.findMany({
    where: { userId },
    include: templateInclude,
    orderBy: { createdAt: "desc" },
  });
}

export async function updateWorkoutTemplate(
  userId: string,
  templateId: string,
  input: UpdateWorkoutTemplateInput
) {
  await getWorkoutTemplateForUser(userId, templateId);

  if (input.exercises) {
    assertUniqueExerciseOrder(input.exercises);
  }

  // In una transazione: se la sostituzione degli esercizi fallisse a metà,
  // il modello non deve restare in uno stato incoerente.
  return prisma.$transaction(async (tx) => {
    if (input.exercises) {
      await tx.templateExercise.deleteMany({ where: { templateId } });
      await tx.templateExercise.createMany({
        data: input.exercises.map((exercise) => ({
          templateId,
          exerciseId: exercise.exerciseId,
          order: exercise.order,
          plannedSets: exercise.plannedSets ?? null,
          plannedReps: exercise.plannedReps ?? null,
          targetLoad: exercise.targetLoad ?? null,
          notes: exercise.notes ?? null,
        })),
      });
    }

    return tx.workoutTemplate.update({
      where: { id: templateId },
      data: {
        name: input.name?.trim(),
        notes: input.notes,
      },
      include: templateInclude,
    });
  });
}

export async function deleteWorkoutTemplate(userId: string, templateId: string): Promise<void> {
  await getWorkoutTemplateForUser(userId, templateId);

  // Le sessioni già avviate da questo modello non vengono toccate: non hanno
  // alcuna chiave esterna verso TemplateExercise, e sourceTemplateId su
  // Session viene solo azzerato (onDelete: SetNull in schema.prisma).
  await prisma.workoutTemplate.delete({ where: { id: templateId } });
}
