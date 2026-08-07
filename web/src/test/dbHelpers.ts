// Utilità condivise dai test dei service layer. Non termina in "*.test.ts",
// quindi Vitest non la tratta come un file di test a sé stante.
import { prisma } from "@/lib/prisma";

/**
 * Svuota tutte le tabelle del database di test, nell'ordine che rispetta i
 * vincoli di chiave esterna (dalle entità dipendenti verso quelle di base).
 * Chiamata prima di ogni test per garantire che i test non interferiscano
 * tra loro.
 */
export async function resetDatabase(): Promise<void> {
  await prisma.setResult.deleteMany();
  await prisma.sessionExercise.deleteMany();
  await prisma.session.deleteMany();
  await prisma.templateExercise.deleteMany();
  await prisma.workoutTemplate.deleteMany();
  await prisma.bodyMeasurement.deleteMany();
  await prisma.exercise.deleteMany();
  await prisma.user.deleteMany();
}

export async function createTestUser(emailPrefix = "user"): Promise<{ id: string; email: string }> {
  const email = `${emailPrefix}-${Math.random().toString(36).slice(2)}@example.test`;
  return prisma.user.create({
    data: { email, passwordHash: "unused-in-these-tests" },
  });
}

interface TestExerciseOverrides {
  name?: string;
  ownerId?: string | null;
  tracksSets?: boolean;
  tracksReps?: boolean;
  tracksLoad?: boolean;
  tracksDuration?: boolean;
  tracksDistance?: boolean;
}

export async function createTestExercise(overrides: TestExerciseOverrides = {}) {
  return prisma.exercise.create({
    data: {
      name: overrides.name ?? "Panca piana",
      ownerId: overrides.ownerId ?? null,
      tracksSets: overrides.tracksSets ?? true,
      tracksReps: overrides.tracksReps ?? true,
      tracksLoad: overrides.tracksLoad ?? true,
      tracksDuration: overrides.tracksDuration ?? false,
      tracksDistance: overrides.tracksDistance ?? false,
    },
  });
}
