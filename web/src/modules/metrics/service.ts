import { prisma } from "@/lib/prisma";
import { MetricNotFoundError, MetricValidationError } from "./errors";
import type { BodyMeasurementInput, UpdateBodyMeasurementInput } from "./types";

// Nessuna funzione di questo modulo fa mai riferimento a Session o a un
// suo id: una misurazione personale non dipende da alcun allenamento
// (boundaries.md, "una misurazione non deve dipendere da una sessione").

export async function recordBodyMeasurement(userId: string, input: BodyMeasurementInput) {
  if (!input.date) {
    throw new MetricValidationError("La data della misurazione è obbligatoria.");
  }

  return prisma.bodyMeasurement.create({
    data: {
      userId,
      date: input.date,
      weightKg: input.weightKg ?? null,
      bodyFatPercentage: input.bodyFatPercentage ?? null,
      waistCm: input.waistCm ?? null,
      chestCm: input.chestCm ?? null,
      armsCm: input.armsCm ?? null,
      thighsCm: input.thighsCm ?? null,
    },
  });
}

async function getBodyMeasurementForUser(userId: string, measurementId: string) {
  const measurement = await prisma.bodyMeasurement.findFirst({
    where: { id: measurementId, userId },
  });
  if (!measurement) {
    throw new MetricNotFoundError();
  }
  return measurement;
}

export async function updateBodyMeasurement(
  userId: string,
  measurementId: string,
  input: UpdateBodyMeasurementInput
) {
  await getBodyMeasurementForUser(userId, measurementId);

  return prisma.bodyMeasurement.update({
    where: { id: measurementId },
    data: {
      date: input.date,
      weightKg: input.weightKg,
      bodyFatPercentage: input.bodyFatPercentage,
      waistCm: input.waistCm,
      chestCm: input.chestCm,
      armsCm: input.armsCm,
      thighsCm: input.thighsCm,
    },
  });
}

export async function deleteBodyMeasurement(userId: string, measurementId: string): Promise<void> {
  await getBodyMeasurementForUser(userId, measurementId);
  await prisma.bodyMeasurement.delete({ where: { id: measurementId } });
}

export async function listBodyMeasurements(userId: string) {
  return prisma.bodyMeasurement.findMany({ where: { userId }, orderBy: { date: "desc" } });
}
