import { UserProfile, WorkoutRoutine, WeightRecord, BodyFatRecord, RecoveryMetric, DayVolume } from './types';

export const initialProfile: UserProfile = {
  name: "Aura Member",
  title: "Pro Athlete",
  avatarUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuCzRZyRhk0dZJgZo97BOc6AGP801-M2nZESt-9bJjwm_4Q54yIpGuMEl7qI1yb-wRG8-YjIk8hyAasrCDhi1K16XAHUMGwkgD20lIlPI2KRxyiLFXYhtss4k3P6hhf6C3cKcJFzPaAKS8zz1eNRVdRMiDEEsMQx-LUI8eCFU941qA4XRpFhxonacXO_NE6_oL8jFo1KI68nCrWtcyaCFdolemPsZtgb0TnAw9-j9kwL58FRC0rtcUhC",
  sidebarAvatarUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuBuadbfRiMgcWVOzPSYzP5JfWd01ZB0eX9i8YRdIR55Egn0WDut6AWds7bINW5TNkBUKqAUXozz7iStXDiT3ZNKmSJSBcifJ1opetxMPCuaYfuSqhoSzg8EWC_lKNemWDVOrCx5y1NQiW2UeLPr-IqtkQ1RvNZaFJwsMBOGiEumrxyIZ25fIvz8wIVysmxu4MxjBC-jeH8zLTT9aeuPtDBdgBL__0bPcDbq2QZwQ0Q9fAzvlUputL5o",
  streakDays: 12,
  targetWeightKg: 72.0,
  targetBodyFatPct: 12.5,
  unit: 'kg'
};

export const pullDayRoutine: WorkoutRoutine = {
  id: 'routine-pull-day',
  title: 'Pull Day',
  subtitle: 'Back, Biceps, and core stabilization.',
  category: 'Upper Body',
  estimatedTimeMin: 45,
  isTodayFocus: true,
  exercises: [
    {
      id: 'ex-1',
      name: 'Lat Pulldown Wide Grip',
      category: 'Back',
      sets: [
        { setNumber: 1, targetReps: 12, weightKg: 55, completed: false },
        { setNumber: 2, targetReps: 10, weightKg: 62.5, completed: false },
        { setNumber: 3, targetReps: 8, weightKg: 70, completed: false },
        { setNumber: 4, targetReps: 8, weightKg: 70, completed: false },
      ]
    },
    {
      id: 'ex-2',
      name: 'Seated Cable Row',
      category: 'Back',
      sets: [
        { setNumber: 1, targetReps: 12, weightKg: 50, completed: false },
        { setNumber: 2, targetReps: 10, weightKg: 57.5, completed: false },
        { setNumber: 3, targetReps: 10, weightKg: 65, completed: false },
      ]
    },
    {
      id: 'ex-3',
      name: 'Barbell Incline Bicep Curl',
      category: 'Biceps',
      sets: [
        { setNumber: 1, targetReps: 12, weightKg: 25, completed: false },
        { setNumber: 2, targetReps: 10, weightKg: 30, completed: false },
        { setNumber: 3, targetReps: 10, weightKg: 32.5, completed: false },
      ]
    },
    {
      id: 'ex-4',
      name: 'Hanging Leg Raises & Core Hold',
      category: 'Core',
      sets: [
        { setNumber: 1, targetReps: 15, weightKg: 0, completed: false },
        { setNumber: 2, targetReps: 15, weightKg: 0, completed: false },
        { setNumber: 3, targetReps: 12, weightKg: 0, completed: false },
      ]
    }
  ]
};

export const workoutRoutines: WorkoutRoutine[] = [
  pullDayRoutine,
  {
    id: 'routine-push-day',
    title: 'Push Day',
    subtitle: 'Chest, Shoulders, and Triceps drive.',
    category: 'Upper Body',
    estimatedTimeMin: 50,
    exercises: [
      {
        id: 'p-1',
        name: 'Incline Dumbbell Press',
        category: 'Chest',
        sets: [
          { setNumber: 1, targetReps: 12, weightKg: 28, completed: false },
          { setNumber: 2, targetReps: 10, weightKg: 32, completed: false },
          { setNumber: 3, targetReps: 8, weightKg: 36, completed: false },
        ]
      },
      {
        id: 'p-2',
        name: 'Overhead Shoulder Press',
        category: 'Shoulders',
        sets: [
          { setNumber: 1, targetReps: 10, weightKg: 40, completed: false },
          { setNumber: 2, targetReps: 10, weightKg: 45, completed: false },
          { setNumber: 3, targetReps: 8, weightKg: 50, completed: false },
        ]
      },
      {
        id: 'p-3',
        name: 'Tricep Rope Pushdown',
        category: 'Triceps',
        sets: [
          { setNumber: 1, targetReps: 15, weightKg: 22.5, completed: false },
          { setNumber: 2, targetReps: 12, weightKg: 27.5, completed: false },
          { setNumber: 3, targetReps: 10, weightKg: 30, completed: false },
        ]
      }
    ]
  },
  {
    id: 'routine-leg-day',
    title: 'Leg Day & Glutes',
    subtitle: 'Quad focus, Hamstring contraction & Calf raises.',
    category: 'Lower Body',
    estimatedTimeMin: 55,
    exercises: [
      {
        id: 'l-1',
        name: 'Barbell Back Squat',
        category: 'Legs',
        sets: [
          { setNumber: 1, targetReps: 10, weightKg: 80, completed: false },
          { setNumber: 2, targetReps: 8, weightKg: 100, completed: false },
          { setNumber: 3, targetReps: 6, weightKg: 115, completed: false },
        ]
      },
      {
        id: 'l-2',
        name: 'Romanian Deadlift',
        category: 'Legs',
        sets: [
          { setNumber: 1, targetReps: 12, weightKg: 70, completed: false },
          { setNumber: 2, targetReps: 10, weightKg: 85, completed: false },
          { setNumber: 3, targetReps: 10, weightKg: 95, completed: false },
        ]
      }
    ]
  },
  {
    id: 'routine-hiit-core',
    title: 'HIIT & Mobility',
    subtitle: 'High intensity aerobic interval & spinal decompression.',
    category: 'Cardio',
    estimatedTimeMin: 30,
    exercises: [
      {
        id: 'h-1',
        name: 'Assault Bike Intervals',
        category: 'Cardio',
        sets: [
          { setNumber: 1, targetReps: 30, weightKg: 0, completed: false },
          { setNumber: 2, targetReps: 30, weightKg: 0, completed: false },
          { setNumber: 3, targetReps: 30, weightKg: 0, completed: false },
        ]
      }
    ]
  }
];

export const initialWeightRecords: WeightRecord[] = [
  { id: 'w1', date: '2026-07-23', weightKg: 75.8 },
  { id: 'w2', date: '2026-07-27', weightKg: 75.1 },
  { id: 'w3', date: '2026-07-30', weightKg: 74.7 },
  { id: 'w4', date: '2026-08-02', weightKg: 74.5 },
  { id: 'w5', date: '2026-08-06', weightKg: 74.2 },
];

export const initialBodyFatRecords: BodyFatRecord[] = [
  { id: 'bf1', date: '2026-07-23', bodyFatPercentage: 15.2 },
  { id: 'bf2', date: '2026-07-27', bodyFatPercentage: 15.0 },
  { id: 'bf3', date: '2026-07-30', bodyFatPercentage: 14.8 },
  { id: 'bf4', date: '2026-08-02', bodyFatPercentage: 14.7 },
  { id: 'bf5', date: '2026-08-06', bodyFatPercentage: 14.5 },
];

export const initialRecovery: RecoveryMetric = {
  score: 85,
  statusText: "Ready for intense training",
  sleepHours: 7.8,
  hrvMs: 68,
  restingHeartRate: 52,
  muscleSoreness: "Low"
};

export const initialWeeklyVolume: DayVolume[] = [
  { day: 'M', fullDay: 'Monday', volumeKg: 5200, intensityPct: 40, workoutName: 'Light Cardio & Core' },
  { day: 'T', fullDay: 'Tuesday', volumeKg: 9800, intensityPct: 65, workoutName: 'Push Day' },
  { day: 'W', fullDay: 'Wednesday', volumeKg: 4100, intensityPct: 30, workoutName: 'Active Recovery' },
  { day: 'T', fullDay: 'Thursday', volumeKg: 14200, intensityPct: 90, isToday: true, workoutName: 'Pull Day (Heavy)' },
  { day: 'F', fullDay: 'Friday', volumeKg: 3200, intensityPct: 20, workoutName: 'Mobility' },
  { day: 'S', fullDay: 'Saturday', volumeKg: 8500, intensityPct: 50, workoutName: 'Leg Day' },
  { day: 'S', fullDay: 'Sunday', volumeKg: 1800, intensityPct: 10, workoutName: 'Rest' },
];
