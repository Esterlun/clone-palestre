export interface WorkoutSet {
  id: string;
  setNumber: number;
  weightKg: number | string;
  reps: number | string;
  isCompleted: boolean;
  isPR?: boolean;
}

export interface Exercise {
  id: string;
  name: string;
  category: string; // e.g., "Strength"
  muscleGroup: 'Chest' | 'Back' | 'Legs' | 'Shoulders' | 'Arms' | 'Core';
  imageUrl: string;
  videoUrl?: string;
  description: string;
  instructions: string[];
  tips: string[];
  primaryMuscles: string[];
  secondaryMuscles: string[];
  defaultSets: { weightKg: number; reps: number }[];
}

export interface WorkoutExercise {
  exerciseId: string;
  exercise: Exercise;
  sets: WorkoutSet[];
  notes?: string;
}

export interface Routine {
  id: string;
  title: string;
  category: string; // e.g., "Upper Body", "Leg Day", "Push"
  durationMinutes: number;
  exerciseCount: number;
  exercises: {
    exerciseId: string;
    setsCount: number;
    targetReps: string;
  }[];
  description: string;
  tagColor?: string;
}

export interface ActiveSessionState {
  routineId?: string;
  routineTitle: string;
  startTime: number;
  exercises: WorkoutExercise[];
  currentExerciseIndex: number;
}

export interface CompletedWorkout {
  id: string;
  title: string;
  date: string;
  durationSeconds: number;
  totalVolumeKg: number;
  totalSetsCompleted: number;
  exercises: {
    exerciseName: string;
    sets: { weightKg: number; reps: number }[];
  }[];
  prsAchieved: string[];
}

export interface RestTimerState {
  isActive: boolean;
  totalDurationSeconds: number;
  remainingSeconds: number;
  exerciseName?: string;
}
