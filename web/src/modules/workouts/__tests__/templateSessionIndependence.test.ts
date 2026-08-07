import { afterAll, beforeEach, describe, expect, it } from "vitest";
import { prisma } from "@/lib/prisma";
import { createTestExercise, createTestUser, resetDatabase } from "@/test/dbHelpers";
import { createWorkoutTemplate, deleteWorkoutTemplate, updateWorkoutTemplate } from "../templateService";
import { getSessionForUser, startSessionFromTemplate } from "../sessionService";

// Questa regola di dominio è ripetuta in product.md, requirements.md,
// architecture.md, boundaries.md e development-guidelines.md: una sessione
// creata da un modello deve diventare indipendente da esso. Le merita un
// file di test dedicato invece che essere solo un caso tra tanti.

beforeEach(async () => {
  await resetDatabase();
});

afterAll(async () => {
  await prisma.$disconnect();
});

describe("indipendenza tra modello e sessione", () => {
  it("modificare il modello dopo aver avviato una sessione non altera la sessione già creata", async () => {
    const user = await createTestUser();
    const exercise = await createTestExercise();

    const template = await createWorkoutTemplate(user.id, {
      name: "Push originale",
      exercises: [{ exerciseId: exercise.id, order: 1, plannedSets: 3, plannedReps: 10, targetLoad: 50 }],
    });

    const session = await startSessionFromTemplate(user.id, template.id);

    await updateWorkoutTemplate(user.id, template.id, {
      name: "Push modificato",
      exercises: [{ exerciseId: exercise.id, order: 1, plannedSets: 5, plannedReps: 5, targetLoad: 100 }],
    });

    const sessionAfterTemplateUpdate = await getSessionForUser(user.id, session.id);

    expect(sessionAfterTemplateUpdate.name).toBe("Push originale");
    expect(sessionAfterTemplateUpdate.sessionExercises).toHaveLength(1);
    expect(sessionAfterTemplateUpdate.sessionExercises[0].plannedSets).toBe(3);
    expect(sessionAfterTemplateUpdate.sessionExercises[0].plannedReps).toBe(10);
    expect(sessionAfterTemplateUpdate.sessionExercises[0].targetLoad).toBe(50);
  });

  it("eliminare il modello non elimina né altera le sessioni già registrate", async () => {
    const user = await createTestUser();
    const exercise = await createTestExercise();

    const template = await createWorkoutTemplate(user.id, {
      name: "Push",
      exercises: [{ exerciseId: exercise.id, order: 1, plannedSets: 3, plannedReps: 10 }],
    });

    const session = await startSessionFromTemplate(user.id, template.id);

    await deleteWorkoutTemplate(user.id, template.id);

    const sessionAfterTemplateDeletion = await getSessionForUser(user.id, session.id);

    expect(sessionAfterTemplateDeletion.id).toBe(session.id);
    expect(sessionAfterTemplateDeletion.name).toBe("Push");
    expect(sessionAfterTemplateDeletion.sessionExercises).toHaveLength(1);
    // Il riferimento informativo al modello viene azzerato, ma i dati copiati restano.
    expect(sessionAfterTemplateDeletion.sourceTemplateId).toBeNull();
  });
});
