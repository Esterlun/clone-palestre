import { prisma } from "@/lib/prisma";
import { WorkoutNotFoundError, WorkoutValidationError } from "./errors";
import { getWorkoutTemplateForUser } from "./templateService";
import { SESSION_STATUS } from "./types";
import type {
  AddSessionExerciseInput,
  ListSessionsFilters,
  RecordSetResultInput,
  StartSessionInput,
  UpdateSessionDetailsInput,
  UpdateSessionExerciseInput,
} from "./types";

const sessionInclude = {
  sessionExercises: {
    include: { exercise: true, setResults: { orderBy: { setNumber: "asc" as const } } },
    orderBy: { order: "asc" as const },
  },
};

/**
 * Avvia una sessione a partire da un modello. Copia i dati necessari
 * (nome, esercizi, serie/ripetizioni/carico previsti) in nuove righe
 * Session/SessionExercise: da questo momento la sessione è indipendente dal
 * modello. Una modifica successiva al modello (vedi templateService) non ha
 * alcun modo di raggiungere questi dati copiati.
 */
export async function startSessionFromTemplate(
  userId: string,
  templateId: string,
  input: StartSessionInput = {}
) {
  const template = await getWorkoutTemplateForUser(userId, templateId);

  return prisma.session.create({
    data: {
      userId,
      sourceTemplateId: template.id,
      name: input.name?.trim() || template.name,
      status: SESSION_STATUS.IN_PROGRESS,
      sessionExercises: {
        create: template.templateExercises.map((templateExercise) => ({
          exerciseId: templateExercise.exerciseId,
          order: templateExercise.order,
          plannedSets: templateExercise.plannedSets,
          plannedReps: templateExercise.plannedReps,
          targetLoad: templateExercise.targetLoad,
          notes: templateExercise.notes,
        })),
      },
    },
    include: sessionInclude,
  });
}

export async function startFreeSession(userId: string, input: StartSessionInput = {}) {
  return prisma.session.create({
    data: {
      userId,
      sourceTemplateId: null,
      name: input.name?.trim() || "Allenamento libero",
      status: SESSION_STATUS.IN_PROGRESS,
    },
    include: sessionInclude,
  });
}

export async function getSessionForUser(userId: string, sessionId: string) {
  const session = await prisma.session.findFirst({
    where: { id: sessionId, userId },
    include: sessionInclude,
  });
  if (!session) {
    throw new WorkoutNotFoundError("Sessione non trovata.");
  }
  return session;
}

// Aggiunge un esercizio a una sessione già avviata (libera o da modello):
// requirements.md, sezione 4, "Durante la sessione l'utente deve poter:
// aggiungere esercizi". L'ordine viene assegnato in coda, non richiesto dal
// chiamante, per evitare conflitti con gli esercizi già presenti.
export async function addSessionExercise(
  userId: string,
  sessionId: string,
  input: AddSessionExerciseInput
) {
  const session = await getSessionForUser(userId, sessionId);
  const nextOrder =
    session.sessionExercises.reduce((max, exercise) => Math.max(max, exercise.order), 0) + 1;

  return prisma.sessionExercise.create({
    data: {
      sessionId,
      exerciseId: input.exerciseId,
      order: nextOrder,
      plannedSets: input.plannedSets ?? null,
      plannedReps: input.plannedReps ?? null,
      targetLoad: input.targetLoad ?? null,
      notes: input.notes ?? null,
    },
    include: { exercise: true, setResults: true },
  });
}

// Cambia l'esercizio associato a una riga della sessione già avviata (es.
// l'utente ha selezionato l'esercizio sbagliato o vuole sostituirlo con una
// variante): le serie già registrate restano collegate alla stessa riga,
// dato che SetResult referenzia sessionExerciseId e non exerciseId.
export async function updateSessionExercise(
  userId: string,
  sessionId: string,
  sessionExerciseId: string,
  input: UpdateSessionExerciseInput
) {
  const session = await getSessionForUser(userId, sessionId);
  const target = session.sessionExercises.find((exercise) => exercise.id === sessionExerciseId);
  if (!target) {
    throw new WorkoutNotFoundError("Esercizio della sessione non trovato.");
  }

  return prisma.sessionExercise.update({
    where: { id: sessionExerciseId },
    data: { exerciseId: input.exerciseId },
    include: { exercise: true, setResults: { orderBy: { setNumber: "asc" } } },
  });
}

export async function removeSessionExercise(
  userId: string,
  sessionId: string,
  sessionExerciseId: string
): Promise<void> {
  const session = await getSessionForUser(userId, sessionId);
  const target = session.sessionExercises.find((exercise) => exercise.id === sessionExerciseId);
  if (!target) {
    throw new WorkoutNotFoundError("Esercizio della sessione non trovato.");
  }

  await prisma.sessionExercise.delete({ where: { id: sessionExerciseId } });
}

// Elenco degli esercizi effettivamente svolti almeno una volta dall'utente,
// usato per popolare il selettore di confronto (requirements.md, sezione 9).
// "distinct" da solo non garantisce un ordine alfabetico stabile con le
// relazioni in Prisma, quindi l'ordinamento per nome avviene qui in JS.
export async function listDistinctExercisesFromSessions(userId: string) {
  const rows = await prisma.sessionExercise.findMany({
    where: { session: { userId } },
    distinct: ["exerciseId"],
    include: { exercise: true },
  });
  return rows.map((row) => row.exercise).sort((a, b) => a.name.localeCompare(b.name));
}

// Tutte le volte in cui l'utente ha svolto un determinato esercizio, dalla
// più recente alla più vecchia: la base per il confronto "ultima prestazione
// vs precedente" (requirements.md, sezione 9; boundaries.md, "confrontare le
// prestazioni dello stesso esercizio").
export async function listSessionExerciseHistoryForExercise(userId: string, exerciseId: string) {
  return prisma.sessionExercise.findMany({
    where: { exerciseId, session: { userId } },
    include: {
      exercise: true,
      setResults: { orderBy: { setNumber: "asc" } },
      session: true,
    },
    orderBy: { session: { startedAt: "desc" } },
  });
}

export async function listSessionsForUser(userId: string, filters: ListSessionsFilters = {}) {
  return prisma.session.findMany({
    where: {
      userId,
      startedAt: {
        gte: filters.fromDate,
        lte: filters.toDate,
      },
    },
    include: sessionInclude,
    orderBy: { startedAt: "desc" },
  });
}

/**
 * Registra (o aggiorna, se già presente) il risultato di una singola serie
 * per un esercizio della sessione. L'upsert usa il vincolo unico
 * (sessionExerciseId, setNumber) dello schema.
 */
export async function recordSetResult(
  userId: string,
  sessionId: string,
  sessionExerciseId: string,
  input: RecordSetResultInput
) {
  const session = await getSessionForUser(userId, sessionId);

  const sessionExercise = session.sessionExercises.find(
    (candidate) => candidate.id === sessionExerciseId
  );
  if (!sessionExercise) {
    throw new WorkoutNotFoundError("Esercizio della sessione non trovato.");
  }

  return prisma.setResult.upsert({
    where: {
      sessionExerciseId_setNumber: {
        sessionExerciseId,
        setNumber: input.setNumber,
      },
    },
    create: {
      sessionExerciseId,
      setNumber: input.setNumber,
      reps: input.reps ?? null,
      load: input.load ?? null,
      durationSeconds: input.durationSeconds ?? null,
      distanceMeters: input.distanceMeters ?? null,
    },
    update: {
      reps: input.reps ?? null,
      load: input.load ?? null,
      durationSeconds: input.durationSeconds ?? null,
      distanceMeters: input.distanceMeters ?? null,
    },
  });
}

// Corregge nome/note della sessione (requirements.md, sezione 8: "modificare
// o eliminare una sessione" dallo storico). Non tocca esercizi o serie, che
// hanno le proprie funzioni dedicate.
export async function updateSessionDetails(
  userId: string,
  sessionId: string,
  input: UpdateSessionDetailsInput
) {
  await getSessionForUser(userId, sessionId);

  if (input.name !== undefined && !input.name.trim()) {
    throw new WorkoutValidationError("Il nome della sessione è obbligatorio.");
  }

  return prisma.session.update({
    where: { id: sessionId },
    data: {
      name: input.name?.trim(),
      notes: input.notes,
    },
    include: sessionInclude,
  });
}

export async function deleteSession(userId: string, sessionId: string): Promise<void> {
  await getSessionForUser(userId, sessionId);
  await prisma.session.delete({ where: { id: sessionId } });
}

export async function completeSession(userId: string, sessionId: string) {
  const session = await getSessionForUser(userId, sessionId);
  if (session.status === SESSION_STATUS.COMPLETED) {
    throw new WorkoutValidationError("La sessione è già stata completata.");
  }

  return prisma.session.update({
    where: { id: sessionId },
    data: { status: SESSION_STATUS.COMPLETED, completedAt: new Date() },
    include: sessionInclude,
  });
}
