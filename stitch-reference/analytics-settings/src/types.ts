export type ActiveTab = 'home' | 'workouts' | 'start' | 'analytics' | 'settings';

export type TimePeriod = 'this_week' | 'last_week' | 'last_month' | 'ytd';

export interface VolumeDataPoint {
  day: string;
  shortDay: string;
  volumeKg: number;
  prevVolumeKg: number;
  setsCount: number;
  peakExercise: string;
}

export interface PRRecord {
  id: string;
  exercise: string;
  weightKg: number;
  date: string;
  incrementKg: number;
  previousKg: number;
  category: 'Lower Body' | 'Upper Body' | 'Core' | 'Olympic';
  notes?: string;
}

export interface ExerciseSet {
  setNumber: number;
  weightKg: number;
  reps: number;
  completed: boolean;
  rpe?: number;
}

export interface Exercise {
  id: string;
  name: string;
  category: string;
  targetMuscles: string[];
  sets: ExerciseSet[];
  restSeconds: number;
  notes?: string;
}

export interface WorkoutRoutine {
  id: string;
  title: string;
  category: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced' | 'Pro Athlete';
  estimatedMinutes: number;
  exerciseCount: number;
  exercises: Exercise[];
  description: string;
  image: string;
  isCustom?: boolean;
}

export interface UserProfile {
  name: string;
  role: string;
  avatarUrl: string;
  dailyStreak: number;
  unit: 'kg' | 'lbs';
  weeklyVolumeTargetKg: number;
  avgHeartRate: number;
  energyKcal: number;
  activeMinutes: number;
  readinessScore: number;
}

export interface AICoachResponse {
  advice: string;
  readinessScore: number;
  recommendation: string;
  keyTips?: string[];
}
