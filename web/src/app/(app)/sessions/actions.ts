"use server";

import { redirect } from "next/navigation";
import { requireCurrentUser } from "@/lib/auth";
import { WorkoutValidationError } from "@/modules/workouts/errors";
import {
  addSessionExercise,
  completeSession,
  deleteSession,
  recordSetResult,
  removeSessionExercise,
  startFreeSession,
  startSessionFromTemplate,
  updateSessionDetails,
  updateSessionExercise,
} from "@/modules/workouts/sessionService";
import type {
  AddSessionExerciseInput,
  RecordSetResultInput,
  UpdateSessionExerciseInput,
} from "@/modules/workouts/types";

export interface ActionResult {
  error?: string;
}

export async function startFreeSessionAction(): Promise<void> {
  const user = await requireCurrentUser();
  const session = await startFreeSession(user.id);
  redirect(`/sessions/${session.id}`);
}

// Copia i dati del modello nella nuova sessione (vedi sessionService): da qui
// in poi la sessione è indipendente, come richiesto da requirements.md
// sezione 4.
export async function startSessionFromTemplateAction(templateId: string): Promise<void> {
  const user = await requireCurrentUser();
  const session = await startSessionFromTemplate(user.id, templateId);
  redirect(`/sessions/${session.id}`);
}

export async function addSessionExerciseAction(
  sessionId: string,
  input: AddSessionExerciseInput
): Promise<ActionResult> {
  const user = await requireCurrentUser();
  try {
    await addSessionExercise(user.id, sessionId, input);
    return {};
  } catch (error) {
    if (error instanceof WorkoutValidationError) {
      return { error: error.message };
    }
    return { error: "Non è stato possibile aggiungere l'esercizio. Riprova." };
  }
}

export async function updateSessionExerciseAction(
  sessionId: string,
  sessionExerciseId: string,
  input: UpdateSessionExerciseInput
): Promise<ActionResult> {
  const user = await requireCurrentUser();
  try {
    await updateSessionExercise(user.id, sessionId, sessionExerciseId, input);
    return {};
  } catch (error) {
    if (error instanceof WorkoutValidationError) {
      return { error: error.message };
    }
    return { error: "Non è stato possibile cambiare l'esercizio. Riprova." };
  }
}

export async function removeSessionExerciseAction(
  sessionId: string,
  sessionExerciseId: string
): Promise<ActionResult> {
  const user = await requireCurrentUser();
  try {
    await removeSessionExercise(user.id, sessionId, sessionExerciseId);
    return {};
  } catch (error) {
    if (error instanceof WorkoutValidationError) {
      return { error: error.message };
    }
    return { error: "Non è stato possibile rimuovere l'esercizio. Riprova." };
  }
}

export async function recordSetResultAction(
  sessionId: string,
  sessionExerciseId: string,
  input: RecordSetResultInput
): Promise<ActionResult> {
  const user = await requireCurrentUser();
  try {
    await recordSetResult(user.id, sessionId, sessionExerciseId, input);
    return {};
  } catch (error) {
    if (error instanceof WorkoutValidationError) {
      return { error: error.message };
    }
    return { error: "Non è stato possibile salvare la serie. Riprova." };
  }
}

export async function completeSessionAction(sessionId: string): Promise<ActionResult> {
  const user = await requireCurrentUser();
  try {
    await completeSession(user.id, sessionId);
    return {};
  } catch (error) {
    if (error instanceof WorkoutValidationError) {
      return { error: error.message };
    }
    return { error: "Non è stato possibile completare la sessione. Riprova." };
  }
}

export async function updateSessionDetailsAction(
  sessionId: string,
  _previousState: ActionResult,
  formData: FormData
): Promise<ActionResult> {
  const user = await requireCurrentUser();
  const name = String(formData.get("name") ?? "");
  const notes = String(formData.get("notes") ?? "");

  try {
    await updateSessionDetails(user.id, sessionId, { name, notes: notes || null });
    return {};
  } catch (error) {
    if (error instanceof WorkoutValidationError) {
      return { error: error.message };
    }
    return { error: "Non è stato possibile salvare le modifiche. Riprova." };
  }
}

export async function deleteSessionAction(sessionId: string): Promise<void> {
  const user = await requireCurrentUser();
  await deleteSession(user.id, sessionId);
  redirect("/history");
}
