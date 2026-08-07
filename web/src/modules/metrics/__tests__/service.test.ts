import { afterAll, beforeEach, describe, expect, it } from "vitest";
import { prisma } from "@/lib/prisma";
import { createTestUser, resetDatabase } from "@/test/dbHelpers";
import { startFreeSession } from "@/modules/workouts/sessionService";
import {
  deleteBodyMeasurement,
  listBodyMeasurements,
  recordBodyMeasurement,
  updateBodyMeasurement,
} from "../service";
import { MetricNotFoundError, MetricValidationError } from "../errors";

beforeEach(async () => {
  await resetDatabase();
});

afterAll(async () => {
  await prisma.$disconnect();
});

describe("recordBodyMeasurement", () => {
  it("registra una misurazione con solo alcuni campi valorizzati, dato che sono tutti facoltativi", async () => {
    const user = await createTestUser();

    const measurement = await recordBodyMeasurement(user.id, {
      date: new Date("2026-01-01"),
      weightKg: 80,
    });

    expect(measurement.weightKg).toBe(80);
    expect(measurement.waistCm).toBeNull();
  });

  it("rifiuta una misurazione senza data", async () => {
    const user = await createTestUser();

    await expect(
      recordBodyMeasurement(user.id, { date: undefined as unknown as Date })
    ).rejects.toBeInstanceOf(MetricValidationError);
  });

  it("una misurazione è indipendente da qualunque sessione: non ha alcun legame con Session", async () => {
    const user = await createTestUser();
    const session = await startFreeSession(user.id, { name: "Allenamento" });

    const measurement = await recordBodyMeasurement(user.id, {
      date: new Date("2026-01-01"),
      weightKg: 80,
    });

    // Lo schema di BodyMeasurement non prevede alcun campo sessionId: la
    // misurazione esiste indipendentemente dalla sessione appena creata.
    expect(Object.keys(measurement)).not.toContain("sessionId");
    expect(measurement.userId).toBe(user.id);
    expect(session.id).toBeDefined();
  });
});

describe("modifica ed eliminazione di una misurazione", () => {
  it("modifica una misurazione esistente", async () => {
    const user = await createTestUser();
    const measurement = await recordBodyMeasurement(user.id, {
      date: new Date("2026-01-01"),
      weightKg: 80,
    });

    const updated = await updateBodyMeasurement(user.id, measurement.id, { weightKg: 78.5 });

    expect(updated.weightKg).toBe(78.5);
  });

  it("elimina una misurazione esistente", async () => {
    const user = await createTestUser();
    const measurement = await recordBodyMeasurement(user.id, { date: new Date("2026-01-01") });

    await deleteBodyMeasurement(user.id, measurement.id);

    const remaining = await listBodyMeasurements(user.id);
    expect(remaining).toHaveLength(0);
  });

  it("un utente non può modificare o eliminare la misurazione di un altro utente", async () => {
    const owner = await createTestUser("owner");
    const otherUser = await createTestUser("other");
    const measurement = await recordBodyMeasurement(owner.id, { date: new Date("2026-01-01") });

    await expect(
      updateBodyMeasurement(otherUser.id, measurement.id, { weightKg: 1 })
    ).rejects.toBeInstanceOf(MetricNotFoundError);
    await expect(deleteBodyMeasurement(otherUser.id, measurement.id)).rejects.toBeInstanceOf(
      MetricNotFoundError
    );

    const stillPresent = await prisma.bodyMeasurement.findUnique({ where: { id: measurement.id } });
    expect(stillPresent).not.toBeNull();
  });
});
