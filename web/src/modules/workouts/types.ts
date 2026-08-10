// Valori ammessi per Session.status (colonna String, SQLite non supporta
// enum in Prisma). Vedi prisma/schema.prisma per il motivo della scelta.
export type SessionStatus = "IN_PROGRESS" | "COMPLETED";

export const SESSION_STATUS = {
  IN_PROGRESS: "IN_PROGRESS",
  COMPLETED: "COMPLETED",
} as const satisfies Record<string, SessionStatus>;

export interface TemplateExerciseInput {
  exerciseId: string;
  order: number;
  plannedSets?: number | null;
  plannedReps?: number | null;
  targetLoad?: number | null;
  notes?: string | null;
}

export interface CreateWorkoutTemplateInput {
  name: string;
  notes?: string | null;
  exercises: TemplateExerciseInput[];
}

export interface UpdateWorkoutTemplateInput {
  name?: string;
  notes?: string | null;
  exercises?: TemplateExerciseInput[];
}

export interface StartSessionInput {
  name?: string;
}

export interface AddSessionExerciseInput {
  exerciseId: string;
  plannedSets?: number | null;
  plannedReps?: number | null;
  targetLoad?: number | null;
  notes?: string | null;
}

export interface UpdateSessionExerciseInput {
  exerciseId: string;
}

export interface RecordSetResultInput {
  setNumber: number;
  reps?: number | null;
  load?: number | null;
  durationSeconds?: number | null;
  distanceMeters?: number | null;
}

export interface UpdateSessionDetailsInput {
  name?: string;
  notes?: string | null;
}

export interface ListSessionsFilters {
  fromDate?: Date;
  toDate?: Date;
}
