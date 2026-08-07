import { afterAll, beforeEach, describe, expect, it } from "vitest";
import { prisma } from "@/lib/prisma";
import { createTestExercise, createTestUser, resetDatabase } from "@/test/dbHelpers";
import { createWorkoutTemplate } from "../templateService";
import {
  addSessionExercise,
  completeSession,
  deleteSession,
  getSessionForUser,
  listDistinctExercisesFromSessions,
  listSessionExerciseHistoryForExercise,
  recordSetResult,
  removeSessionExercise,
  startFreeSession,
  startSessionFromTemplate,
  updateSessionDetails,
} from "../sessionService";
import { WorkoutNotFoundError, WorkoutValidationError } from "../errors";

beforeEach(async () => {
  await resetDatabase();
});

afterAll(async () => {
  await prisma.$disconnect();
});

describe("startFreeSession", () => {
  it("avvia una sessione libera senza modello di origine", async () => {
    const user = await createTestUser();

    const session = await startFreeSession(user.id, { name: "Allenamento di oggi" });

    expect(session.sourceTemplateId).toBeNull();
    expect(session.name).toBe("Allenamento di oggi");
    expect(session.sessionExercises).toHaveLength(0);
  });

  it("assegna un nome predefinito se non specificato", async () => {
    const user = await createTestUser();

    const session = await startFreeSession(user.id);

    expect(session.name).toBe("Allenamento libero");
  });
});

describe("recordSetResult", () => {
  it("registra il risultato di una serie per un esercizio della sessione", async () => {
    const user = await createTestUser();
    const exercise = await createTestExercise();
    const template = await createWorkoutTemplate(user.id, {
      name: "Push",
      exercises: [{ exerciseId: exercise.id, order: 1, plannedSets: 3, plannedReps: 10 }],
    });
    const session = await startSessionFromTemplate(user.id, template.id);
    const sessionExerciseId = session.sessionExercises[0].id;

    const result = await recordSetResult(user.id, session.id, sessionExerciseId, {
      setNumber: 1,
      reps: 10,
      load: 50,
    });

    expect(result.reps).toBe(10);
    expect(result.load).toBe(50);
  });

  it("aggiorna il risultato già registrato per la stessa serie invece di duplicarlo", async () => {
    const user = await createTestUser();
    const exercise = await createTestExercise();
    const template = await createWorkoutTemplate(user.id, {
      name: "Push",
      exercises: [{ exerciseId: exercise.id, order: 1, plannedSets: 3, plannedReps: 10 }],
    });
    const session = await startSessionFromTemplate(user.id, template.id);
    const sessionExerciseId = session.sessionExercises[0].id;

    await recordSetResult(user.id, session.id, sessionExerciseId, { setNumber: 1, reps: 10, load: 50 });
    await recordSetResult(user.id, session.id, sessionExerciseId, { setNumber: 1, reps: 9, load: 52.5 });

    const updatedSession = await prisma.session.findUniqueOrThrow({
      where: { id: session.id },
      include: { sessionExercises: { include: { setResults: true } } },
    });

    expect(updatedSession.sessionExercises[0].setResults).toHaveLength(1);
    expect(updatedSession.sessionExercises[0].setResults[0].reps).toBe(9);
    expect(updatedSession.sessionExercises[0].setResults[0].load).toBe(52.5);
  });
});

describe("completeSession", () => {
  it("completa una sessione impostando stato e data di completamento", async () => {
    const user = await createTestUser();
    const session = await startFreeSession(user.id);

    const completed = await completeSession(user.id, session.id);

    expect(completed.status).toBe("COMPLETED");
    expect(completed.completedAt).not.toBeNull();
  });

  it("rifiuta di completare due volte la stessa sessione", async () => {
    const user = await createTestUser();
    const session = await startFreeSession(user.id);
    await completeSession(user.id, session.id);

    await expect(completeSession(user.id, session.id)).rejects.toBeInstanceOf(WorkoutValidationError);
  });
});

describe("addSessionExercise", () => {
  it("aggiunge un esercizio a una sessione libera assegnando l'ordine successivo", async () => {
    const user = await createTestUser();
    const exerciseA = await createTestExercise({ name: "Panca piana" });
    const exerciseB = await createTestExercise({ name: "Squat" });
    const session = await startFreeSession(user.id);

    const first = await addSessionExercise(user.id, session.id, { exerciseId: exerciseA.id });
    const second = await addSessionExercise(user.id, session.id, { exerciseId: exerciseB.id });

    expect(first.order).toBe(1);
    expect(second.order).toBe(2);
  });
});

describe("removeSessionExercise", () => {
  it("rimuove un esercizio dalla sessione", async () => {
    const user = await createTestUser();
    const exercise = await createTestExercise();
    const session = await startFreeSession(user.id);
    const sessionExercise = await addSessionExercise(user.id, session.id, { exerciseId: exercise.id });

    await removeSessionExercise(user.id, session.id, sessionExercise.id);

    const updatedSession = await getSessionForUser(user.id, session.id);
    expect(updatedSession.sessionExercises).toHaveLength(0);
  });

  it("rifiuta di rimuovere un esercizio che non appartiene alla sessione", async () => {
    const user = await createTestUser();
    const session = await startFreeSession(user.id);

    await expect(removeSessionExercise(user.id, session.id, "non-existent-id")).rejects.toBeInstanceOf(
      WorkoutNotFoundError
    );
  });
});

describe("updateSessionDetails", () => {
  it("corregge nome e note di una sessione già completata", async () => {
    const user = await createTestUser();
    const session = await startFreeSession(user.id);
    await completeSession(user.id, session.id);

    const updated = await updateSessionDetails(user.id, session.id, {
      name: "Allenamento corretto",
      notes: "Errore di battitura corretto dopo il completamento",
    });

    expect(updated.name).toBe("Allenamento corretto");
    expect(updated.notes).toBe("Errore di battitura corretto dopo il completamento");
  });

  it("rifiuta un nome vuoto", async () => {
    const user = await createTestUser();
    const session = await startFreeSession(user.id);

    await expect(updateSessionDetails(user.id, session.id, { name: "   " })).rejects.toBeInstanceOf(
      WorkoutValidationError
    );
  });
});

describe("deleteSession", () => {
  it("elimina la sessione e gli esercizi/serie collegati", async () => {
    const user = await createTestUser();
    const exercise = await createTestExercise();
    const session = await startFreeSession(user.id);
    const sessionExercise = await addSessionExercise(user.id, session.id, { exerciseId: exercise.id });
    await recordSetResult(user.id, session.id, sessionExercise.id, { setNumber: 1, reps: 10 });

    await deleteSession(user.id, session.id);

    await expect(getSessionForUser(user.id, session.id)).rejects.toBeInstanceOf(WorkoutNotFoundError);
    const remainingSetResults = await prisma.setResult.findMany({
      where: { sessionExerciseId: sessionExercise.id },
    });
    expect(remainingSetResults).toHaveLength(0);
  });

  it("non permette di eliminare la sessione di un altro utente", async () => {
    const owner = await createTestUser("owner");
    const otherUser = await createTestUser("other");
    const session = await startFreeSession(owner.id);

    await expect(deleteSession(otherUser.id, session.id)).rejects.toBeInstanceOf(WorkoutNotFoundError);
  });
});

describe("listDistinctExercisesFromSessions", () => {
  it("elenca ogni esercizio una sola volta, anche se svolto in più sessioni", async () => {
    const user = await createTestUser();
    const exercise = await createTestExercise({ name: "Panca piana" });
    const sessionOne = await startFreeSession(user.id);
    const sessionTwo = await startFreeSession(user.id);
    await addSessionExercise(user.id, sessionOne.id, { exerciseId: exercise.id });
    await addSessionExercise(user.id, sessionTwo.id, { exerciseId: exercise.id });

    const result = await listDistinctExercisesFromSessions(user.id);

    expect(result).toHaveLength(1);
    expect(result[0].id).toBe(exercise.id);
  });

  it("non include gli esercizi svolti solo da un altro utente", async () => {
    const owner = await createTestUser("owner");
    const otherUser = await createTestUser("other");
    const exercise = await createTestExercise();
    const session = await startFreeSession(otherUser.id);
    await addSessionExercise(otherUser.id, session.id, { exerciseId: exercise.id });

    const result = await listDistinctExercisesFromSessions(owner.id);

    expect(result).toHaveLength(0);
  });
});

describe("listSessionExerciseHistoryForExercise", () => {
  it("elenca le occorrenze di un esercizio dalla più recente alla più vecchia", async () => {
    const user = await createTestUser();
    const exercise = await createTestExercise();
    const older = await startFreeSession(user.id, { name: "Sessione vecchia" });
    const olderExercise = await addSessionExercise(user.id, older.id, { exerciseId: exercise.id });
    await recordSetResult(user.id, older.id, olderExercise.id, { setNumber: 1, reps: 8, load: 60 });

    const newer = await startFreeSession(user.id, { name: "Sessione recente" });
    const newerExercise = await addSessionExercise(user.id, newer.id, { exerciseId: exercise.id });
    await recordSetResult(user.id, newer.id, newerExercise.id, { setNumber: 1, reps: 8, load: 62 });

    const history = await listSessionExerciseHistoryForExercise(user.id, exercise.id);

    expect(history).toHaveLength(2);
    expect(history[0].session.name).toBe("Sessione recente");
    expect(history[0].setResults[0].load).toBe(62);
    expect(history[1].session.name).toBe("Sessione vecchia");
    expect(history[1].setResults[0].load).toBe(60);
  });

  it("non include le occorrenze registrate da un altro utente", async () => {
    const owner = await createTestUser("owner");
    const otherUser = await createTestUser("other");
    const exercise = await createTestExercise();
    const session = await startFreeSession(otherUser.id);
    await addSessionExercise(otherUser.id, session.id, { exerciseId: exercise.id });

    const history = await listSessionExerciseHistoryForExercise(owner.id, exercise.id);

    expect(history).toHaveLength(0);
  });
});
