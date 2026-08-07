import { UserProfile, PRRecord, VolumeDataPoint, WorkoutRoutine } from '../types';

export const initialUserProfile: UserProfile = {
  name: 'Aura Member',
  role: 'Pro Athlete',
  avatarUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBD3V226MBPpzkvToZ7Ug7AkkhYFGZixwFTDuy4tHF05TUz_NzPFMpJCSiczwJ-Vn6-oj19swAkFh3xfWE5o-vZklIAKUQcbu4yVAjATg7QcGxNiqrugkrvbDslAMudSX_xME9IBshW9MctfmabX7foWwfYyWePKnlyIc0tjyyOHkSIdQacErv2mpL3SngM1tNDNwz3e_kh0GlcIo0WVF-ni_R5Meo0FZymfKmevmVMpX-Nk44pwt8F',
  dailyStreak: 12,
  unit: 'kg',
  weeklyVolumeTargetKg: 50000,
  avgHeartRate: 142,
  energyKcal: 3200,
  activeMinutes: 402, // 6h 42m
  readinessScore: 88,
};

export const initialPRs: PRRecord[] = [
  {
    id: 'pr-1',
    exercise: 'Deadlift',
    weightKg: 185,
    date: '2026-08-04',
    incrementKg: 5,
    previousKg: 180,
    category: 'Lower Body',
    notes: 'Conventional stance, clean lock-out with belt.',
  },
  {
    id: 'pr-2',
    exercise: 'Barbell Bench Press',
    weightKg: 125,
    date: '2026-07-28',
    incrementKg: 2.5,
    previousKg: 122.5,
    category: 'Upper Body',
    notes: 'Controlled pause on chest.',
  },
  {
    id: 'pr-3',
    exercise: 'Back Squat',
    weightKg: 165,
    date: '2026-07-20',
    incrementKg: 5,
    previousKg: 160,
    category: 'Lower Body',
    notes: 'Depth achieved with knee sleeves.',
  },
  {
    id: 'pr-4',
    exercise: 'Strict Overhead Press',
    weightKg: 82.5,
    date: '2026-07-12',
    incrementKg: 2.5,
    previousKg: 80,
    category: 'Upper Body',
  },
];

export const weeklyVolumeData: VolumeDataPoint[] = [
  { day: 'Monday', shortDay: 'Mon', volumeKg: 2800, prevVolumeKg: 2400, setsCount: 16, peakExercise: 'Incline Dumbbell Press' },
  { day: 'Tuesday', shortDay: 'Tue', volumeKg: 4500, prevVolumeKg: 4100, setsCount: 18, peakExercise: 'Barbell Row' },
  { day: 'Wednesday', shortDay: 'Wed', volumeKg: 3800, prevVolumeKg: 3200, setsCount: 14, peakExercise: 'Front Squat' },
  { day: 'Thursday', shortDay: 'Thu', volumeKg: 6200, prevVolumeKg: 5500, setsCount: 20, peakExercise: 'Overhead Press' },
  { day: 'Friday', shortDay: 'Fri', volumeKg: 8900, prevVolumeKg: 7800, setsCount: 22, peakExercise: 'Romanian Deadlift' },
  { day: 'Saturday', shortDay: 'Sat', volumeKg: 11200, prevVolumeKg: 9800, setsCount: 24, peakExercise: 'Weighted Dips' },
  { day: 'Sunday', shortDay: 'Sun', volumeKg: 12450, prevVolumeKg: 10500, setsCount: 26, peakExercise: 'Conventional Deadlift' },
];

export const initialRoutines: WorkoutRoutine[] = [
  {
    id: 'routine-1',
    title: 'Aura Hypertrophy Alpha',
    category: 'Strength & Hypertrophy',
    difficulty: 'Pro Athlete',
    estimatedMinutes: 55,
    exerciseCount: 5,
    description: 'High-volume upper body hypertrophy focused on chest density, broad shoulders, and lock-out power.',
    image: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=800&q=80',
    exercises: [
      {
        id: 'ex-1',
        name: 'Barbell Bench Press',
        category: 'Upper Body',
        targetMuscles: ['Pectoralis Major', 'Triceps Brachii', 'Anterior Deltoid'],
        restSeconds: 90,
        sets: [
          { setNumber: 1, weightKg: 80, reps: 10, completed: true, rpe: 7 },
          { setNumber: 2, weightKg: 95, reps: 8, completed: true, rpe: 8 },
          { setNumber: 3, weightKg: 105, reps: 6, completed: true, rpe: 8.5 },
          { setNumber: 4, weightKg: 115, reps: 5, completed: false, rpe: 9 },
        ],
      },
      {
        id: 'ex-2',
        name: 'Incline Dumbbell Press',
        category: 'Upper Body',
        targetMuscles: ['Upper Chest', 'Anterior Deltoids'],
        restSeconds: 60,
        sets: [
          { setNumber: 1, weightKg: 32, reps: 10, completed: false, rpe: 8 },
          { setNumber: 2, weightKg: 36, reps: 8, completed: false, rpe: 8.5 },
          { setNumber: 3, weightKg: 40, reps: 8, completed: false, rpe: 9 },
        ],
      },
      {
        id: 'ex-3',
        name: 'Weighted Chest Dips',
        category: 'Upper Body',
        targetMuscles: ['Lower Chest', 'Triceps'],
        restSeconds: 60,
        sets: [
          { setNumber: 1, weightKg: 15, reps: 10, completed: false },
          { setNumber: 2, weightKg: 20, reps: 8, completed: false },
          { setNumber: 3, weightKg: 25, reps: 8, completed: false },
        ],
      },
      {
        id: 'ex-4',
        name: 'Cable Lateral Raise',
        category: 'Shoulders',
        targetMuscles: ['Lateral Deltoids'],
        restSeconds: 45,
        sets: [
          { setNumber: 1, weightKg: 12, reps: 15, completed: false },
          { setNumber: 2, weightKg: 14, reps: 12, completed: false },
          { setNumber: 3, weightKg: 16, reps: 10, completed: false },
        ],
      },
    ],
  },
  {
    id: 'routine-2',
    title: 'Posterior Chain & Deadlift',
    category: 'Max Power',
    difficulty: 'Advanced',
    estimatedMinutes: 60,
    exerciseCount: 4,
    description: 'Heavy hinge patterns, posterior chain development, and lat thickness designed for peak pull capacity.',
    image: 'https://images.unsplash.com/photo-1534367507873-d2d7e24c797f?auto=format&fit=crop&w=800&q=80',
    exercises: [
      {
        id: 'ex-201',
        name: 'Barbell Deadlift',
        category: 'Lower Body',
        targetMuscles: ['Erector Spinae', 'Gluteus Maximus', 'Hamstrings', 'Latissimus Dorsi'],
        restSeconds: 120,
        sets: [
          { setNumber: 1, weightKg: 140, reps: 5, completed: true, rpe: 7 },
          { setNumber: 2, weightKg: 165, reps: 3, completed: true, rpe: 8 },
          { setNumber: 3, weightKg: 185, reps: 1, completed: true, rpe: 9.5 },
        ],
      },
      {
        id: 'ex-202',
        name: 'Pendlay Barbell Row',
        category: 'Back',
        targetMuscles: ['Rhomboids', 'Lats', 'Rear Delts'],
        restSeconds: 90,
        sets: [
          { setNumber: 1, weightKg: 80, reps: 8, completed: false },
          { setNumber: 2, weightKg: 90, reps: 8, completed: false },
          { setNumber: 3, weightKg: 100, reps: 6, completed: false },
        ],
      },
    ],
  },
  {
    id: 'routine-3',
    title: 'Metabolic HIIT & Core Velocity',
    category: 'Conditioning',
    difficulty: 'Intermediate',
    estimatedMinutes: 35,
    exerciseCount: 6,
    description: 'Fast-paced high heart rate circuits with kettlebells, plyometrics, and core anti-rotation drills.',
    image: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&w=800&q=80',
    exercises: [
      {
        id: 'ex-301',
        name: 'Heavy Kettlebell Swings',
        category: 'Full Body',
        targetMuscles: ['Glutes', 'Hamstrings', 'Core'],
        restSeconds: 30,
        sets: [
          { setNumber: 1, weightKg: 28, reps: 20, completed: false },
          { setNumber: 2, weightKg: 32, reps: 20, completed: false },
          { setNumber: 3, weightKg: 32, reps: 20, completed: false },
        ],
      },
    ],
  },
];
