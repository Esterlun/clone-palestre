export interface BodyMeasurementInput {
  date: Date;
  weightKg?: number | null;
  bodyFatPercentage?: number | null;
  waistCm?: number | null;
  chestCm?: number | null;
  armsCm?: number | null;
  thighsCm?: number | null;
}

export type UpdateBodyMeasurementInput = Partial<BodyMeasurementInput>;
