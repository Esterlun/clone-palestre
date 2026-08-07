import React, { useState, useEffect } from 'react';
import { ActiveSessionState, Routine, CompletedWorkout, WorkoutExercise } from './types';
import {
  INITIAL_ACTIVE_SESSION,
  ROUTINES_LIST,
  PAST_WORKOUT_HISTORY,
  EXERCISE_DATABASE
} from './data/initialData';
import { ActiveSession } from './components/ActiveSession';
import { RoutinesView } from './components/RoutinesView';
import { ExerciseLibraryView } from './components/ExerciseLibraryView';
import { HistoryView } from './components/HistoryView';
import { Navbar, TabType } from './components/Navbar';

export default function App() {
  const [activeTab, setActiveTab] = useState<TabType>('active');

  // Load state from localStorage or use defaults
  const [session, setSession] = useState<ActiveSessionState>(() => {
    try {
      const saved = localStorage.getItem('aurafit_active_session');
      return saved ? JSON.parse(saved) : INITIAL_ACTIVE_SESSION;
    } catch {
      return INITIAL_ACTIVE_SESSION;
    }
  });

  const [routines, setRoutines] = useState<Routine[]>(() => {
    try {
      const saved = localStorage.getItem('aurafit_routines');
      return saved ? JSON.parse(saved) : ROUTINES_LIST;
    } catch {
      return ROUTINES_LIST;
    }
  });

  const [history, setHistory] = useState<CompletedWorkout[]>(() => {
    try {
      const saved = localStorage.getItem('aurafit_history');
      return saved ? JSON.parse(saved) : PAST_WORKOUT_HISTORY;
    } catch {
      return PAST_WORKOUT_HISTORY;
    }
  });

  // Save session changes to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('aurafit_active_session', JSON.stringify(session));
    } catch {
      // Ignore
    }
  }, [session]);

  // Save routines to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('aurafit_routines', JSON.stringify(routines));
    } catch {
      // Ignore
    }
  }, [routines]);

  // Save history to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('aurafit_history', JSON.stringify(history));
    } catch {
      // Ignore
    }
  }, [history]);

  // Handler to start a specific routine
  const handleStartRoutine = (routine: Routine) => {
    const workoutExercises: WorkoutExercise[] = routine.exercises.map((item) => {
      const foundEx = EXERCISE_DATABASE.find((e) => e.id === item.exerciseId) || EXERCISE_DATABASE[0];
      return {
        exerciseId: foundEx.id,
        exercise: foundEx,
        sets: foundEx.defaultSets.map((ds, idx) => ({
          id: `set-${Date.now()}-${idx}-${Math.random()}`,
          setNumber: idx + 1,
          weightKg: ds.weightKg,
          reps: ds.reps,
          isCompleted: false
        }))
      };
    });

    const newSession: ActiveSessionState = {
      routineId: routine.id,
      routineTitle: routine.title,
      startTime: Date.now(),
      currentExerciseIndex: 0,
      exercises: workoutExercises
    };

    setSession(newSession);
    setActiveTab('active');
  };

  // Handler to start quick workout
  const handleStartQuickWorkout = () => {
    const newSession: ActiveSessionState = {
      routineId: 'quick-workout',
      routineTitle: 'Workout Libero',
      startTime: Date.now(),
      currentExerciseIndex: 0,
      exercises: [
        {
          exerciseId: EXERCISE_DATABASE[0].id,
          exercise: EXERCISE_DATABASE[0],
          sets: [
            { id: `set-${Date.now()}-1`, setNumber: 1, weightKg: 80, reps: 10, isCompleted: false },
            { id: `set-${Date.now()}-2`, setNumber: 2, weightKg: 85, reps: 8, isCompleted: false }
          ]
        }
      ]
    };

    setSession(newSession);
    setActiveTab('active');
  };

  // Handler for creating a custom routine
  const handleCreateCustomRoutine = (newRoutine: Routine) => {
    setRoutines((prev) => [newRoutine, ...prev]);
  };

  // Handler for finishing a workout session
  const handleWorkoutCompleted = () => {
    const durationSeconds = Math.max(60, Math.round((Date.now() - session.startTime) / 1000));

    let totalVolumeKg = 0;
    let totalSetsCompleted = 0;
    const prs: string[] = [];

    const summaryExercises = session.exercises.map((ex) => {
      const completedSets = ex.sets.filter((s) => s.isCompleted);
      completedSets.forEach((s) => {
        const w = Number(s.weightKg) || 0;
        const r = Number(s.reps) || 0;
        totalVolumeKg += w * r;
        totalSetsCompleted += 1;
        if (w >= 90) {
          prs.push(`${ex.exercise.name} - ${w}kg x ${r}`);
        }
      });

      return {
        exerciseName: ex.exercise.name,
        sets: completedSets.map((s) => ({
          weightKg: Number(s.weightKg) || 0,
          reps: Number(s.reps) || 0
        }))
      };
    });

    const newHistoryRecord: CompletedWorkout = {
      id: `hist-${Date.now()}`,
      title: session.routineTitle,
      date: new Date().toISOString().split('T')[0],
      durationSeconds,
      totalVolumeKg,
      totalSetsCompleted,
      exercises: summaryExercises,
      prsAchieved: Array.from(new Set(prs))
    };

    setHistory((prev) => [newHistoryRecord, ...prev]);

    // Reset active session to default fresh state
    setSession(INITIAL_ACTIVE_SESSION);
    setActiveTab('history');
  };

  // Handler to clear workout history
  const handleClearHistory = () => {
    if (window.confirm('Sei sicuro di voler cancellare la cronologia degli allenamenti?')) {
      setHistory([]);
    }
  };

  return (
    <div className="min-h-screen bg-[#E9E8F0] font-sora relative">
      {activeTab === 'active' && (
        <ActiveSession
          session={session}
          setSession={setSession}
          onCloseSession={() => setActiveTab('routines')}
          onWorkoutCompleted={handleWorkoutCompleted}
        />
      )}

      {activeTab === 'routines' && (
        <RoutinesView
          routines={routines}
          onStartRoutine={handleStartRoutine}
          onStartQuickWorkout={handleStartQuickWorkout}
          onCreateCustomRoutine={handleCreateCustomRoutine}
        />
      )}

      {activeTab === 'exercises' && <ExerciseLibraryView />}

      {activeTab === 'history' && (
        <HistoryView history={history} onClearHistory={handleClearHistory} />
      )}

      {/* Global Navigation Bar */}
      <Navbar
        activeTab={activeTab}
        onTabChange={setActiveTab}
        hasActiveSession={true}
      />
    </div>
  );
}
