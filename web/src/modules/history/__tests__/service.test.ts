import { afterAll, beforeEach, describe, expect, it } from "vitest";
import { prisma } from "@/lib/prisma";
import { createTestExercise, createTestUser, resetDatabase } from "@/test/dbHelpers";
import { addSessionExercise, startFreeSession } from "@/modules/workouts/sessionService";
import { recordBodyMeasurement } from "@/modules/metrics/service";
import { WorkoutNotFoundError } from "@/modules/workouts/errors";
import {
  getExercisePerformanceHistory,
  getSessionHistoryDetail,
  listComparableExercises,
  listMeasurementHistory,
  listSessionHistory,
} from "../service";

beforeEach(async () => {
  await resetDatabase();
});

afterAll(async () => {
  await prisma.$disconnect();
});

describe("isolamento tra utenti nello storico delle sessioni", () => {
  it("un utente non vede mai le sessioni di un altro utente", async () => {
    const userA = await createTestUser("a");
    const userB = await createTestUser("b");
    await startFreeSession(userA.id, { name: "Sessione di A" });
    await startFreeSession(userB.id, { name: "Sessione di B" });

    const historyA = await listSessionHistory(userA.id);

    expect(historyA).toHaveLength(1);
    expect(historyA[0].name).toBe("Sessione di A");
  });

  it("un utente non può leggere il dettaglio di una sessione di un altro utente", async () => {
    const userA = await createTestUser("a");
    const userB = await createTestUser("b");
    const sessionB = await startFreeSession(userB.id, { name: "Sessione di B" });

    await expect(getSessionHistoryDetail(userA.id, sessionB.id)).rejects.toBeInstanceOf(
      WorkoutNotFoundError
    );
  });
});

describe("isolamento tra utenti nello storico delle metriche", () => {
  it("un utente non vede mai le misurazioni di un altro utente", async () => {
    const userA = await createTestUser("a");
    const userB = await createTestUser("b");
    await recordBodyMeasurement(userA.id, { date: new Date("2026-01-01"), weightKg: 80 });

    const historyA = await listMeasurementHistory(userA.id);
    const historyB = await listMeasurementHistory(userB.id);

    expect(historyA).toHaveLength(1);
    expect(historyB).toHaveLength(0);
  });
});

describe("confronto delle prestazioni", () => {
  it("elenca solo gli esercizi svolti dall'utente e le loro occorrenze, isolati per utente", async () => {
    const userA = await createTestUser("a");
    const userB = await createTestUser("b");
    const exercise = await createTestExercise({ name: "Panca piana" });
    const sessionA = await startFreeSession(userA.id);
    await addSessionExercise(userA.id, sessionA.id, { exerciseId: exercise.id });

    const comparableForA = await listComparableExercises(userA.id);
    const comparableForB = await listComparableExercises(userB.id);
    const performanceForA = await getExercisePerformanceHistory(userA.id, exercise.id);
    const performanceForB = await getExercisePerformanceHistory(userB.id, exercise.id);

    expect(comparableForA).toHaveLength(1);
    expect(comparableForB).toHaveLength(0);
    expect(performanceForA).toHaveLength(1);
    expect(performanceForB).toHaveLength(0);
  });
});
