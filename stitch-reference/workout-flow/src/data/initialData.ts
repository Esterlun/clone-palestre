import { Exercise, Routine, ActiveSessionState, CompletedWorkout } from '../types';

export const EXERCISE_DATABASE: Exercise[] = [
  {
    id: 'panca-piana',
    name: 'Panca Piana',
    category: 'Strength',
    muscleGroup: 'Chest',
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBSQhbFz3r6_-I-Fuwo59fFPDCfg-ylEtPSdGUme8qZgI9DRUJHIHM1cR0JLPz3bIPixTe5-IzZ7RMu46kul6awZcOeFvvWPShuyTfhuyLXHYkUbO-KPsj6MI7tWZOB3voo-xr_AR3nYMBl5afRbgggYnLF2XNq6orG6pPqUqs3Z-qNfGvNDHZmCbwd8jdc7geVxr_EgOqfwTSFkOdD7FfT25_8jX-Mct1XSul5GI-EjhV_DfIFcw8Z',
    description: 'Il re degli esercizi per la parte superiore del corpo. Sviluppa forza e ipertrofia per pettorali, tricipiti e deltoidi anteriori.',
    instructions: [
      'Sdraiati sulla panca con i piedi ben piantati a terra e le scapole addotte.',
      'Afferra il bilanciere poco più largo delle spalle con presa solida.',
      'Stacca il bilanciere e abbassalo controllatamente verso la parte media del petto.',
      'Spingi in alto in modo esplosivo senza sollevare i glutei dalla panca.'
    ],
    tips: [
      'Mantieni i gomiti a circa 45° rispetto al busto.',
      'Non far rimbalzare il bilanciere sul petto.',
      'Respira dentro mentre scendi, espira mentre spingi.'
    ],
    primaryMuscles: ['Pettorale Grande', 'Tricipite'],
    secondaryMuscles: ['Deltoide Anteriore', 'Serrato'],
    defaultSets: [
      { weightKg: 80, reps: 10 },
      { weightKg: 85, reps: 8 },
      { weightKg: 90, reps: 6 },
      { weightKg: 95, reps: 4 }
    ]
  },
  {
    id: 'spinte-manubri-inclinata',
    name: 'Spinte Manubri Panca Inclinata',
    category: 'Hypertrophy',
    muscleGroup: 'Chest',
    imageUrl: 'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?auto=format&fit=crop&q=80&w=800',
    description: 'Esercizio fondamentale per lo sviluppo del fascio clavicolare (petto alto).',
    instructions: [
      'Imposta la panca a un’inclinazione di 30-45 gradi.',
      'Porta i manubri sulle cosce e spingili in posizione con le ginocchia.',
      'Abbatte i manubri ai lati del petto avvertendo un buono allungamento.',
      'Spingi verso l’alto senza far toccare i manubri alla fine.'
    ],
    tips: [
      'Mantieni l’arco lombare naturale.',
      'Controlla l’eccentrica per 2-3 secondi.'
    ],
    primaryMuscles: ['Petto Alto (Clavicolare)'],
    secondaryMuscles: ['Deltoide Anteriore', 'Tricipite'],
    defaultSets: [
      { weightKg: 28, reps: 10 },
      { weightKg: 30, reps: 10 },
      { weightKg: 32, reps: 8 }
    ]
  },
  {
    id: 'croci-ai-cavi',
    name: 'Croci ai Cavi Alti',
    category: 'Isolation',
    muscleGroup: 'Chest',
    imageUrl: 'https://images.unsplash.com/photo-1534367610401-9f5ed68180aa?auto=format&fit=crop&q=80&w=800',
    description: 'Tensione continua su tutto il range di movimento per la massima rifinitura del petto.',
    instructions: [
      'Posiziona le carrucole in alto e afferra le maniglie.',
      'Fai un passo in avanti mantenendo un leggero piegamento dei gomiti.',
      'Chiudi le mani davanti all’ombelico spremendo il petto.'
    ],
    tips: [
      'Non piegare eccessivamente i gomiti.',
      'Mantieni il petto ben in fuori durante l’esecuzione.'
    ],
    primaryMuscles: ['Pettorale Grande (Fascio Basso)'],
    secondaryMuscles: ['Deltoide Anteriore'],
    defaultSets: [
      { weightKg: 15, reps: 12 },
      { weightKg: 17.5, reps: 12 },
      { weightKg: 20, reps: 10 }
    ]
  },
  {
    id: 'military-press',
    name: 'Military Press Bilanciere',
    category: 'Strength',
    muscleGroup: 'Shoulders',
    imageUrl: 'https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?auto=format&fit=crop&q=80&w=800',
    description: 'Esercizio multiarticolare in piedi per la massima massa e forza delle spalle e stabilità del core.',
    instructions: [
      'Piedi a larghezza spalle, impugna il bilanciere appena all’esterno delle spalle.',
      'Contrai glutei e addome, spingi il bilanciere sopra la testa fino al lockout.',
      'Ritorna alla clavicola in modo controllato.'
    ],
    tips: [
      'Evita di inarcare eccessivamente la schiena.',
      'Sposta la testa leggermente indietro mentre il bilanciere sale.'
    ],
    primaryMuscles: ['Deltoide Anteriore', 'Deltoide Laterale'],
    secondaryMuscles: ['Tricipite', 'Core', 'Trapezio'],
    defaultSets: [
      { weightKg: 50, reps: 8 },
      { weightKg: 55, reps: 6 },
      { weightKg: 60, reps: 5 }
    ]
  },
  {
    id: 'french-press-panca',
    name: 'French Press su Panca',
    category: 'Hypertrophy',
    muscleGroup: 'Arms',
    imageUrl: 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?auto=format&fit=crop&q=80&w=800',
    description: 'Isolamento intenso per il capo lungo e laterale dei tricipiti con bilanciere EZ.',
    instructions: [
      'Sdraiati sulla panca impugnando il bilanciere EZ.',
      'Fletti i gomiti portando il bilanciere verso la fronte/sopra la testa.',
      'Estendi i gomiti mantenendo la parte superiore delle braccia immobile.'
    ],
    tips: [
      'Non allargare troppo i gomiti verso l’esterno.',
      'Lavora con movimento fluido e controllato.'
    ],
    primaryMuscles: ['Tricipite Brachiale'],
    secondaryMuscles: ['Anconeo'],
    defaultSets: [
      { weightKg: 35, reps: 10 },
      { weightKg: 40, reps: 8 },
      { weightKg: 40, reps: 8 }
    ]
  },
  {
    id: 'squat-bilanciere',
    name: 'Squat con Bilanciere',
    category: 'Strength',
    muscleGroup: 'Legs',
    imageUrl: 'https://images.unsplash.com/photo-1574680096145-d05b474e2155?auto=format&fit=crop&q=80&w=800',
    description: 'Esercizio fondamentale per la parte inferiore del corpo e lo sviluppo dei quadricipiti.',
    instructions: [
      'Posiziona il bilanciere sul trapezio, stacca dal rack e fai 2 passi indietro.',
      'Piedi poco più larghi delle anche, punte leggermente ruotate all’esterno.',
      'Scendi rompendo il parallelo mantenendo il petto aperto.',
      'Spingi sui talloni per tornare in posizione eretta.'
    ],
    tips: [
      'Spingi le ginocchia verso l’esterno in linea con i piedi.',
      'Mantieni il core ben ingaggiato.'
    ],
    primaryMuscles: ['Quadricipiti', 'Glutei'],
    secondaryMuscles: ['Flessori della gamba', 'Erettori spinali'],
    defaultSets: [
      { weightKg: 100, reps: 8 },
      { weightKg: 110, reps: 6 },
      { weightKg: 120, reps: 4 }
    ]
  },
  {
    id: 'stacco-rumeno',
    name: 'Stacco Rumeno',
    category: 'Hypertrophy',
    muscleGroup: 'Legs',
    imageUrl: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&q=80&w=800',
    description: 'Sviluppo mirato della catena posteriore, femorali e glutei.',
    instructions: [
      'Impugna il bilanciere eretto con piedi a larghezza anche.',
      'Spingi il bacino all’indietro mantenendo le ginocchia leggermente flesse.',
      'Fai scivolare il bilanciere lungo le cosce fin sotto il ginocchio.',
      'Contrai i glutei per tornare in posizione eretta.'
    ],
    tips: [
      'Schiena sempre dritta e neutra.',
      'Senti un forte allungamento nei femorali.'
    ],
    primaryMuscles: ['Femorali', 'Glutei'],
    secondaryMuscles: ['Erettori Spinali', 'Trapezi'],
    defaultSets: [
      { weightKg: 90, reps: 10 },
      { weightKg: 100, reps: 8 },
      { weightKg: 105, reps: 8 }
    ]
  },
  {
    id: 'lat-machine-avanti',
    name: 'Lat Machine Avanti',
    category: 'Hypertrophy',
    muscleGroup: 'Back',
    imageUrl: 'https://images.unsplash.com/photo-1605296867304-46d5465a13f1?auto=format&fit=crop&q=80&w=800',
    description: 'Sviluppo della larghezza del dorso (gran dorsale).',
    instructions: [
      'Afferra la sbarra con presa larga e siediti ancorando le cosce.',
      'Tira la sbarra verso la parte alta del petto inclinando leggermente il busto.',
      'Rilascia lentamente avvertendo la trazione del gran dorsale.'
    ],
    tips: [
      'Immagina di guidare il movimento con i gomiti.',
      'Non dondolare eccessivamente con il tronco.'
    ],
    primaryMuscles: ['Gran Dorsale', 'Gran Rotondo'],
    secondaryMuscles: ['Bicipiti', 'Brachiale', 'Romboide'],
    defaultSets: [
      { weightKg: 60, reps: 10 },
      { weightKg: 65, reps: 10 },
      { weightKg: 70, reps: 8 }
    ]
  }
];

export const ROUTINES_LIST: Routine[] = [
  {
    id: 'upper-body-power',
    title: 'Upper Body Power',
    category: 'Upper Body',
    durationMinutes: 55,
    exerciseCount: 4,
    description: 'Sessione ad alta intensità incentrata sulla forza di spinta e trazione per il tronco.',
    tagColor: 'bg-primary/10 text-primary',
    exercises: [
      { exerciseId: 'panca-piana', setsCount: 4, targetReps: '10-4' },
      { exerciseId: 'spinte-manubri-inclinata', setsCount: 3, targetReps: '8-10' },
      { exerciseId: 'military-press', setsCount: 3, targetReps: '6-8' },
      { exerciseId: 'croci-ai-cavi', setsCount: 3, targetReps: '10-12' }
    ]
  },
  {
    id: 'leg-day-hypertrophy',
    title: 'Leg Day Hypertrophy',
    category: 'Lower Body',
    durationMinutes: 60,
    exerciseCount: 4,
    description: 'Volume elevato per quadricipiti, femorali e glutei per la massima crescita muscolare.',
    tagColor: 'bg-tertiary/10 text-tertiary',
    exercises: [
      { exerciseId: 'squat-bilanciere', setsCount: 4, targetReps: '8-12' },
      { exerciseId: 'stacco-rumeno', setsCount: 3, targetReps: '8-10' }
    ]
  },
  {
    id: 'push-chest-shoulders',
    title: 'Push - Chest & Shoulders',
    category: 'Push',
    durationMinutes: 50,
    exerciseCount: 3,
    description: 'Lavoro mirato di spinta per pettorali esplosivi e spalle tridimensionali.',
    tagColor: 'bg-secondary/10 text-secondary',
    exercises: [
      { exerciseId: 'panca-piana', setsCount: 4, targetReps: '8-10' },
      { exerciseId: 'military-press', setsCount: 3, targetReps: '8' },
      { exerciseId: 'french-press-panca', setsCount: 3, targetReps: '10' }
    ]
  }
];

export const INITIAL_ACTIVE_SESSION: ActiveSessionState = {
  routineId: 'upper-body-power',
  routineTitle: 'Upper Body Power',
  startTime: Date.now() - 22 * 60 * 1000, // 22 minutes elapsed
  currentExerciseIndex: 0,
  exercises: [
    {
      exerciseId: 'panca-piana',
      exercise: EXERCISE_DATABASE[0],
      sets: [
        { id: 'set-1', setNumber: 1, weightKg: 80, reps: 10, isCompleted: true },
        { id: 'set-2', setNumber: 2, weightKg: 85, reps: 8, isCompleted: true },
        { id: 'set-3', setNumber: 3, weightKg: 90, reps: 6, isCompleted: false },
        { id: 'set-4', setNumber: 4, weightKg: '', reps: '', isCompleted: false }
      ]
    },
    {
      exerciseId: 'spinte-manubri-inclinata',
      exercise: EXERCISE_DATABASE[1],
      sets: [
        { id: 'set-i1', setNumber: 1, weightKg: 28, reps: 10, isCompleted: false },
        { id: 'set-i2', setNumber: 2, weightKg: 30, reps: 10, isCompleted: false },
        { id: 'set-i3', setNumber: 3, weightKg: 32, reps: 8, isCompleted: false }
      ]
    },
    {
      exerciseId: 'croci-ai-cavi',
      exercise: EXERCISE_DATABASE[2],
      sets: [
        { id: 'set-c1', setNumber: 1, weightKg: 15, reps: 12, isCompleted: false },
        { id: 'set-c2', setNumber: 2, weightKg: 17.5, reps: 12, isCompleted: false },
        { id: 'set-c3', setNumber: 3, weightKg: 20, reps: 10, isCompleted: false }
      ]
    },
    {
      exerciseId: 'french-press-panca',
      exercise: EXERCISE_DATABASE[4],
      sets: [
        { id: 'set-f1', setNumber: 1, weightKg: 35, reps: 10, isCompleted: false },
        { id: 'set-f2', setNumber: 2, weightKg: 40, reps: 8, isCompleted: false }
      ]
    }
  ]
};

export const PAST_WORKOUT_HISTORY: CompletedWorkout[] = [
  {
    id: 'hist-1',
    title: 'Upper Body Power',
    date: '2026-08-04',
    durationSeconds: 3120, // 52m
    totalVolumeKg: 4850,
    totalSetsCompleted: 14,
    prsAchieved: ['Panca Piana - 90kg x 6'],
    exercises: [
      { exerciseName: 'Panca Piana', sets: [{ weightKg: 80, reps: 10 }, { weightKg: 85, reps: 8 }, { weightKg: 90, reps: 6 }] },
      { exerciseName: 'Spinte Manubri Panca Inclinata', sets: [{ weightKg: 28, reps: 10 }, { weightKg: 30, reps: 10 }] }
    ]
  },
  {
    id: 'hist-2',
    title: 'Leg Day Hypertrophy',
    date: '2026-08-02',
    durationSeconds: 3480, // 58m
    totalVolumeKg: 6420,
    totalSetsCompleted: 12,
    prsAchieved: ['Squat con Bilanciere - 120kg x 4'],
    exercises: [
      { exerciseName: 'Squat con Bilanciere', sets: [{ weightKg: 100, reps: 8 }, { weightKg: 110, reps: 6 }, { weightKg: 120, reps: 4 }] },
      { exerciseName: 'Stacco Rumeno', sets: [{ weightKg: 90, reps: 10 }, { weightKg: 100, reps: 8 }] }
    ]
  },
  {
    id: 'hist-3',
    title: 'Push - Chest & Shoulders',
    date: '2026-07-30',
    durationSeconds: 2850,
    totalVolumeKg: 4120,
    totalSetsCompleted: 11,
    prsAchieved: [],
    exercises: [
      { exerciseName: 'Panca Piana', sets: [{ weightKg: 80, reps: 10 }, { weightKg: 85, reps: 8 }] },
      { exerciseName: 'Military Press Bilanciere', sets: [{ weightKg: 50, reps: 8 }, { weightKg: 55, reps: 6 }] }
    ]
  }
];
