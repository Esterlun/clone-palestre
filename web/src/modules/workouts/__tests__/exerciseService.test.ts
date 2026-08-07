import { afterAll, beforeEach, describe, expect, it } from "vitest";
import { prisma } from "@/lib/prisma";
import { createTestExercise, createTestUser, resetDatabase } from "@/test/dbHelpers";
import { WorkoutValidationError } from "../errors";
import { createCustomExercise, listExercisesForUser } from "../exerciseService";

beforeEach(async () => {
  await resetDatabase();
});

afterAll(async () => {
  await prisma.$disconnect();
});

describe("listExercisesForUser", () => {
  it("include gli esercizi predefiniti e quelli personalizzati dell'utente, non quelli di altri utenti", async () => {
    const owner = await createTestUser("owner");
    const otherUser = await createTestUser("other");
    const predefined = await createTestExercise({ name: "Panca piana", ownerId: null });
    const own = await createTestExercise({ name: "Esercizio personalizzato", ownerId: owner.id });
    await createTestExercise({ name: "Esercizio di un altro utente", ownerId: otherUser.id });

    const result = await listExercisesForUser(owner.id);

    expect(result.map((exercise) => exercise.id).sort()).toEqual([predefined.id, own.id].sort());
  });
});

describe("createCustomExercise", () => {
  it("crea l'esercizio assegnato all'utente che lo ha creato", async () => {
    const user = await createTestUser();

    const exercise = await createCustomExercise(user.id, { name: "Affondi", tracksReps: true });

    expect(exercise.ownerId).toBe(user.id);
    expect(exercise.name).toBe("Affondi");
  });

  it("rifiuta un nome vuoto", async () => {
    const user = await createTestUser();

    await expect(createCustomExercise(user.id, { name: "   ", tracksReps: true })).rejects.toThrow(
      WorkoutValidationError
    );
  });

  it("rifiuta un esercizio che non traccia alcun dato", async () => {
    const user = await createTestUser();

    await expect(createCustomExercise(user.id, { name: "Esercizio vuoto" })).rejects.toThrow(
      WorkoutValidationError
    );
  });

  it("l'esercizio creato non è visibile ad altri utenti", async () => {
    const owner = await createTestUser("owner");
    const otherUser = await createTestUser("other");

    const exercise = await createCustomExercise(owner.id, { name: "Solo mio", tracksReps: true });
    const visibleToOther = await listExercisesForUser(otherUser.id);

    expect(visibleToOther.some((item) => item.id === exercise.id)).toBe(false);
  });
});
