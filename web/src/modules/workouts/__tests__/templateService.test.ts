import { afterAll, beforeEach, describe, expect, it } from "vitest";
import { prisma } from "@/lib/prisma";
import { createTestExercise, createTestUser, resetDatabase } from "@/test/dbHelpers";
import { createWorkoutTemplate, deleteWorkoutTemplate, updateWorkoutTemplate } from "../templateService";
import { WorkoutNotFoundError, WorkoutValidationError } from "../errors";

beforeEach(async () => {
  await resetDatabase();
});

afterAll(async () => {
  await prisma.$disconnect();
});

describe("createWorkoutTemplate", () => {
  it("crea un modello di allenamento con esercizi ordinati", async () => {
    const user = await createTestUser();
    const squat = await createTestExercise({ name: "Squat" });
    const pressaPetto = await createTestExercise({ name: "Panca piana" });

    const template = await createWorkoutTemplate(user.id, {
      name: "Push",
      exercises: [
        { exerciseId: pressaPetto.id, order: 1, plannedSets: 3, plannedReps: 10, targetLoad: 50 },
        { exerciseId: squat.id, order: 2, plannedSets: 4, plannedReps: 8 },
      ],
    });

    expect(template.name).toBe("Push");
    expect(template.templateExercises).toHaveLength(2);
    expect(template.templateExercises.map((te) => te.order)).toEqual([1, 2]);
    expect(template.templateExercises[0].exercise.name).toBe("Panca piana");
  });

  it("rifiuta un modello con ordini di esercizio duplicati", async () => {
    const user = await createTestUser();
    const exercise = await createTestExercise();

    await expect(
      createWorkoutTemplate(user.id, {
        name: "Push",
        exercises: [
          { exerciseId: exercise.id, order: 1 },
          { exerciseId: exercise.id, order: 1 },
        ],
      })
    ).rejects.toBeInstanceOf(WorkoutValidationError);
  });

  it("rifiuta un modello senza nome", async () => {
    const user = await createTestUser();

    await expect(createWorkoutTemplate(user.id, { name: "  ", exercises: [] })).rejects.toBeInstanceOf(
      WorkoutValidationError
    );
  });
});

describe("modifica ed eliminazione di un modello", () => {
  it("modifica nome, note ed esercizi di un modello esistente", async () => {
    const user = await createTestUser();
    const exercise = await createTestExercise();
    const template = await createWorkoutTemplate(user.id, {
      name: "Push",
      exercises: [{ exerciseId: exercise.id, order: 1, plannedSets: 3, plannedReps: 10 }],
    });

    const updated = await updateWorkoutTemplate(user.id, template.id, {
      name: "Push aggiornato",
      exercises: [{ exerciseId: exercise.id, order: 1, plannedSets: 5, plannedReps: 5 }],
    });

    expect(updated.name).toBe("Push aggiornato");
    expect(updated.templateExercises[0].plannedSets).toBe(5);
  });

  it("un utente non può modificare il modello di un altro utente", async () => {
    const owner = await createTestUser("owner");
    const otherUser = await createTestUser("other");
    const exercise = await createTestExercise();
    const template = await createWorkoutTemplate(owner.id, {
      name: "Push",
      exercises: [{ exerciseId: exercise.id, order: 1 }],
    });

    await expect(
      updateWorkoutTemplate(otherUser.id, template.id, { name: "Rubato" })
    ).rejects.toBeInstanceOf(WorkoutNotFoundError);
  });

  it("elimina un modello esistente", async () => {
    const user = await createTestUser();
    const template = await createWorkoutTemplate(user.id, { name: "Push", exercises: [] });

    await deleteWorkoutTemplate(user.id, template.id);

    await expect(updateWorkoutTemplate(user.id, template.id, { name: "x" })).rejects.toBeInstanceOf(
      WorkoutNotFoundError
    );
  });
});
