import { afterAll, beforeEach, describe, expect, it } from "vitest";
import { prisma } from "@/lib/prisma";
import { createTestExercise, resetDatabase } from "@/test/dbHelpers";
import { recordBodyMeasurement } from "@/modules/metrics/service";
import { createWorkoutTemplate } from "@/modules/workouts/templateService";
import { startFreeSession } from "@/modules/workouts/sessionService";
import { authenticateUser, changePassword, deleteUserAccount, registerUser } from "../service";
import { EmailAlreadyUsedError, InvalidCredentialsError } from "../errors";

beforeEach(async () => {
  await resetDatabase();
});

afterAll(async () => {
  await prisma.$disconnect();
});

describe("registerUser", () => {
  it("crea un nuovo utente con la password hashata, non salvata in chiaro", async () => {
    const user = await registerUser({ email: "Mario@Example.com", password: "password123" });

    expect(user.email).toBe("mario@example.com");

    const stored = await prisma.user.findUniqueOrThrow({ where: { id: user.id } });
    expect(stored.passwordHash).not.toBe("password123");
    expect(stored.passwordHash.length).toBeGreaterThan(20);
  });

  it("rifiuta la registrazione con un'email già utilizzata", async () => {
    await registerUser({ email: "mario@example.com", password: "password123" });

    await expect(
      registerUser({ email: "mario@example.com", password: "altraPassword1" })
    ).rejects.toBeInstanceOf(EmailAlreadyUsedError);
  });
});

describe("authenticateUser", () => {
  it("autentica un utente con credenziali corrette", async () => {
    await registerUser({ email: "anna@example.com", password: "password123" });

    const user = await authenticateUser({ email: "anna@example.com", password: "password123" });

    expect(user.email).toBe("anna@example.com");
  });

  it("rifiuta l'accesso con password errata", async () => {
    await registerUser({ email: "anna@example.com", password: "password123" });

    await expect(
      authenticateUser({ email: "anna@example.com", password: "sbagliata" })
    ).rejects.toBeInstanceOf(InvalidCredentialsError);
  });

  it("rifiuta l'accesso per un'email non registrata", async () => {
    await expect(
      authenticateUser({ email: "assente@example.com", password: "password123" })
    ).rejects.toBeInstanceOf(InvalidCredentialsError);
  });
});

describe("changePassword", () => {
  it("cambia la password quando quella attuale è corretta", async () => {
    const user = await registerUser({ email: "anna@example.com", password: "password123" });

    await changePassword(user.id, { currentPassword: "password123", newPassword: "nuovaPassword1" });

    await expect(
      authenticateUser({ email: "anna@example.com", password: "nuovaPassword1" })
    ).resolves.toMatchObject({ email: "anna@example.com" });
    await expect(
      authenticateUser({ email: "anna@example.com", password: "password123" })
    ).rejects.toBeInstanceOf(InvalidCredentialsError);
  });

  it("rifiuta il cambio password se la password attuale è sbagliata", async () => {
    const user = await registerUser({ email: "anna@example.com", password: "password123" });

    await expect(
      changePassword(user.id, { currentPassword: "sbagliata", newPassword: "nuovaPassword1" })
    ).rejects.toBeInstanceOf(InvalidCredentialsError);
  });
});

describe("deleteUserAccount", () => {
  it("rifiuta l'eliminazione se la password è sbagliata", async () => {
    const user = await registerUser({ email: "anna@example.com", password: "password123" });

    await expect(deleteUserAccount(user.id, "sbagliata")).rejects.toBeInstanceOf(
      InvalidCredentialsError
    );
    await expect(prisma.user.findUnique({ where: { id: user.id } })).resolves.not.toBeNull();
  });

  it("elimina l'account e tutti i dati di sua proprietà (modelli, sessioni, esercizi personalizzati, metriche)", async () => {
    const user = await registerUser({ email: "anna@example.com", password: "password123" });
    const customExercise = await createTestExercise({ name: "Esercizio personale", ownerId: user.id });
    const template = await createWorkoutTemplate(user.id, {
      name: "Push",
      exercises: [{ exerciseId: customExercise.id, order: 1, plannedReps: 10 }],
    });
    const session = await startFreeSession(user.id);
    const measurement = await recordBodyMeasurement(user.id, {
      date: new Date("2026-01-01"),
      weightKg: 80,
    });

    await deleteUserAccount(user.id, "password123");

    await expect(prisma.user.findUnique({ where: { id: user.id } })).resolves.toBeNull();
    await expect(prisma.exercise.findUnique({ where: { id: customExercise.id } })).resolves.toBeNull();
    await expect(
      prisma.workoutTemplate.findUnique({ where: { id: template.id } })
    ).resolves.toBeNull();
    await expect(prisma.session.findUnique({ where: { id: session.id } })).resolves.toBeNull();
    await expect(
      prisma.bodyMeasurement.findUnique({ where: { id: measurement.id } })
    ).resolves.toBeNull();
  });
});
