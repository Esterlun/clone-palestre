export interface ExerciseSet {
  setNumber: number;
  targetReps: number;
  completedReps?: number;
  weightKg: number;
  completed: boolean;
}

export interface Exercise {
  id: string;
  name: string;
  category: 'Back' | 'Biceps' | 'Chest' | 'Triceps' | 'Legs' | 'Shoulders' | 'Core' | 'Cardio';
  sets: ExerciseSet[];
  notes?: string;
}

export interface WorkoutRoutine {
  id: string;
  title: string;
  subtitle: string;
  category: string;
  estimatedTimeMin: number;
  exercises: Exercise[];
  isTodayFocus?: boolean;
}

export interface WeightRecord {
  id: string;
  date: string; // YYYY-MM-DD
  weightKg: number;
}

export interface BodyFatRecord {
  id: string;
  date: string; // YYYY-MM-DD
  bodyFatPercentage: number;
}

export interface RecoveryMetric {
  score: number; // e.g. 85
  statusText: string; // "Ready for intense training"
  sleepHours: number;
  hrvMs: number;
  restingHeartRate: number;
  muscleSoreness: 'Low' | 'Moderate' | 'High';
}

export interface DayVolume {
  day: string; // 'M', 'T', 'W', 'T', 'F', 'S', 'S'
  fullDay: string; // 'Monday', 'Tuesday'...
  volumeKg: number;
  intensityPct: number;
  isToday?: boolean;
  workoutName?: string;
}

export interface UserProfile {
  name: string;
  title: string;
  avatarUrl: string;
  sidebarAvatarUrl: string;
  streakDays: number;
  targetWeightKg: number;
  targetBodyFatPct: number;
  unit: 'kg' | 'lbs';
}

export interface ActiveSession {
  routine: WorkoutRoutine;
  startTime: number;
  elapsedSeconds: number;
  completedExercises: Record<string, ExerciseSet[]>;
  isFinished: boolean;
}

export interface AICoachMessage {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  timestamp: string;
}
