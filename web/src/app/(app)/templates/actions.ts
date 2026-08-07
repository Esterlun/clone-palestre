"use server";

import { redirect } from "next/navigation";
import { requireCurrentUser } from "@/lib/auth";
import {
  createWorkoutTemplate,
  deleteWorkoutTemplate,
  getWorkoutTemplateForUser,
  updateWorkoutTemplate,
} from "@/modules/workouts/templateService";
import { WorkoutValidationError } from "@/modules/workouts/errors";
import type { TemplateExerciseInput } from "@/modules/workouts/types";

export interface TemplateFormState {
  error: string | null;
}

interface RawExerciseRow {
  exerciseId: string;
  plannedSets: string;
  plannedReps: string;
  targetLoad: string;
  notes: string;
}

// Il form invia le righe di esercizio come un unico campo JSON (vedi
// TemplateForm) invece di indici FormData annidati: più semplice da
// costruire/validare per un numero di righe che cambia dinamicamente.
function parseExerciseRows(raw: string): TemplateExerciseInput[] {
  let rows: RawExerciseRow[];
  try {
    rows = JSON.parse(raw);
  } catch {
    throw new WorkoutValidationError("Elenco esercizi non valido.");
  }
  if (!Array.isArray(rows)) {
    throw new WorkoutValidationError("Elenco esercizi non valido.");
  }

  return rows
    .filter((row) => row.exerciseId)
    .map((row, index) => ({
      exerciseId: row.exerciseId,
      order: index + 1,
      plannedSets: row.plannedSets ? Number(row.plannedSets) : null,
      plannedReps: row.plannedReps ? Number(row.plannedReps) : null,
      targetLoad: row.targetLoad ? Number(row.targetLoad) : null,
      notes: row.notes || null,
    }));
}

export async function createTemplateAction(
  _previousState: TemplateFormState,
  formData: FormData
): Promise<TemplateFormState> {
  const user = await requireCurrentUser();
  const name = String(formData.get("name") ?? "");
  const notes = String(formData.get("notes") ?? "");

  let templateId: string;
  try {
    const exercises = parseExerciseRows(String(formData.get("exercisesJson") ?? "[]"));
    const template = await createWorkoutTemplate(user.id, { name, notes: notes || null, exercises });
    templateId = template.id;
  } catch (error) {
    if (error instanceof WorkoutValidationError) {
      return { error: error.message };
    }
    return { error: "Non è stato possibile creare il modello. Riprova." };
  }

  redirect(`/templates/${templateId}`);
}

export async function updateTemplateAction(
  templateId: string,
  _previousState: TemplateFormState,
  formData: FormData
): Promise<TemplateFormState> {
  const user = await requireCurrentUser();
  const name = String(formData.get("name") ?? "");
  const notes = String(formData.get("notes") ?? "");

  try {
    const exercises = parseExerciseRows(String(formData.get("exercisesJson") ?? "[]"));
    await updateWorkoutTemplate(user.id, templateId, { name, notes: notes || null, exercises });
  } catch (error) {
    if (error instanceof WorkoutValidationError) {
      return { error: error.message };
    }
    return { error: "Non è stato possibile salvare le modifiche. Riprova." };
  }

  redirect(`/templates/${templateId}`);
}

export async function deleteTemplateAction(templateId: string): Promise<void> {
  const user = await requireCurrentUser();
  await deleteWorkoutTemplate(user.id, templateId);
  redirect("/templates");
}

// Copia gli esercizi del modello originale in un nuovo modello indipendente:
// non è un riferimento condiviso, coerente con la stessa regola di
// indipendenza applicata a modello→sessione (requirements.md, sezione 3).
export async function duplicateTemplateAction(templateId: string): Promise<void> {
  const user = await requireCurrentUser();
  const original = await getWorkoutTemplateForUser(user.id, templateId);

  const duplicate = await createWorkoutTemplate(user.id, {
    name: `${original.name} (copia)`,
    notes: original.notes,
    exercises: original.templateExercises.map((exercise) => ({
      exerciseId: exercise.exerciseId,
      order: exercise.order,
      plannedSets: exercise.plannedSets,
      plannedReps: exercise.plannedReps,
      targetLoad: exercise.targetLoad,
      notes: exercise.notes,
    })),
  });

  redirect(`/templates/${duplicate.id}`);
}
