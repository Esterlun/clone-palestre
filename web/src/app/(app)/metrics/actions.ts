"use server";

import { requireCurrentUser } from "@/lib/auth";
import { MetricValidationError } from "@/modules/metrics/errors";
import { deleteBodyMeasurement, recordBodyMeasurement, updateBodyMeasurement } from "@/modules/metrics/service";

export interface MeasurementFormState {
  error: string | null;
}

const initialState: MeasurementFormState = { error: null };

function parseOptionalNumber(value: FormDataEntryValue | null): number | null {
  if (!value) {
    return null;
  }
  const parsed = Number(value);
  return Number.isNaN(parsed) ? null : parsed;
}

function parseDate(value: FormDataEntryValue | null): Date | undefined {
  if (!value) {
    return undefined;
  }
  const date = new Date(String(value));
  return Number.isNaN(date.getTime()) ? undefined : date;
}

export async function recordMeasurementAction(
  _previousState: MeasurementFormState,
  formData: FormData
): Promise<MeasurementFormState> {
  const user = await requireCurrentUser();
  const date = parseDate(formData.get("date"));

  try {
    if (!date) {
      throw new MetricValidationError("La data della misurazione è obbligatoria.");
    }
    await recordBodyMeasurement(user.id, {
      date,
      weightKg: parseOptionalNumber(formData.get("weightKg")),
      bodyFatPercentage: parseOptionalNumber(formData.get("bodyFatPercentage")),
      waistCm: parseOptionalNumber(formData.get("waistCm")),
      chestCm: parseOptionalNumber(formData.get("chestCm")),
      armsCm: parseOptionalNumber(formData.get("armsCm")),
      thighsCm: parseOptionalNumber(formData.get("thighsCm")),
    });
    return initialState;
  } catch (error) {
    if (error instanceof MetricValidationError) {
      return { error: error.message };
    }
    return { error: "Non è stato possibile registrare la misurazione. Riprova." };
  }
}

export async function updateMeasurementAction(
  measurementId: string,
  _previousState: MeasurementFormState,
  formData: FormData
): Promise<MeasurementFormState> {
  const user = await requireCurrentUser();
  const date = parseDate(formData.get("date"));

  try {
    await updateBodyMeasurement(user.id, measurementId, {
      date,
      weightKg: parseOptionalNumber(formData.get("weightKg")),
      bodyFatPercentage: parseOptionalNumber(formData.get("bodyFatPercentage")),
      waistCm: parseOptionalNumber(formData.get("waistCm")),
      chestCm: parseOptionalNumber(formData.get("chestCm")),
      armsCm: parseOptionalNumber(formData.get("armsCm")),
      thighsCm: parseOptionalNumber(formData.get("thighsCm")),
    });
    return initialState;
  } catch (error) {
    if (error instanceof MetricValidationError) {
      return { error: error.message };
    }
    return { error: "Non è stato possibile salvare le modifiche. Riprova." };
  }
}

export async function deleteMeasurementAction(measurementId: string): Promise<void> {
  const user = await requireCurrentUser();
  await deleteBodyMeasurement(user.id, measurementId);
}
