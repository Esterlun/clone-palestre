import React, { useState } from 'react';
import {
  PlayCircle,
  Plus,
  Timer,
  ArrowRight,
  Check,
  ChevronLeft,
  ChevronRight,
  Trash2
} from 'lucide-react';
import { ActiveSessionState, WorkoutSet } from '../types';
import { Header } from './Header';
import { FormGuideModal } from './FormGuideModal';
import { RestTimerModal } from './RestTimerModal';
import { WorkoutSummaryModal } from './WorkoutSummaryModal';
import { sounds } from '../utils/audio';

interface ActiveSessionProps {
  session: ActiveSessionState;
  setSession: React.Dispatch<React.SetStateAction<ActiveSessionState>>;
  onCloseSession: () => void;
  onWorkoutCompleted: () => void;
}

export const ActiveSession: React.FC<ActiveSessionProps> = ({
  session,
  setSession,
  onCloseSession,
  onWorkoutCompleted
}) => {
  const [currentExIdx, setCurrentExIdx] = useState<number>(session.currentExerciseIndex || 0);
  const [isFormModalOpen, setIsFormModalOpen] = useState<boolean>(false);
  const [isRestTimerOpen, setIsRestTimerOpen] = useState<boolean>(false);
  const [isSummaryOpen, setIsSummaryOpen] = useState<boolean>(false);

  const currentExerciseData = session.exercises[currentExIdx];
  const exercise = currentExerciseData?.exercise;

  if (!currentExerciseData || !exercise) {
    return (
      <div className="p-8 text-center">
        <p>Nessun esercizio presente nella sessione.</p>
        <button onClick={onCloseSession} className="mt-4 px-4 py-2 bg-[#6d5dfe] text-white rounded-xl">
          Torna all'Home
        </button>
      </div>
    );
  }

  // Toggle completion of a set
  const toggleSetComplete = (setId: string) => {
    setSession((prev) => {
      const updatedExercises = [...prev.exercises];
      const ex = updatedExercises[currentExIdx];
      if (!ex) return prev;

      const setIndex = ex.sets.findIndex((s) => s.id === setId);
      if (setIndex === -1) return prev;

      const targetSet = ex.sets[setIndex];
      const nextCompleted = !targetSet.isCompleted;

      // Play audio chime if completing set
      if (nextCompleted) {
        sounds.playSetComplete();
        // Automatically launch rest timer if user completed a set
        setIsRestTimerOpen(true);
      }

      ex.sets[setIndex] = {
        ...targetSet,
        isCompleted: nextCompleted
      };

      return {
        ...prev,
        exercises: updatedExercises
      };
    });
  };

  // Update set weight or reps
  const updateSetField = (setId: string, field: 'weightKg' | 'reps', value: string) => {
    setSession((prev) => {
      const updatedExercises = [...prev.exercises];
      const ex = updatedExercises[currentExIdx];
      if (!ex) return prev;

      const setIndex = ex.sets.findIndex((s) => s.id === setId);
      if (setIndex === -1) return prev;

      ex.sets[setIndex] = {
        ...ex.sets[setIndex],
        [field]: value === '' ? '' : Math.max(0, Number(value))
      };

      return {
        ...prev,
        exercises: updatedExercises
      };
    });
  };

  // Add new set to exercise
  const addSet = () => {
    setSession((prev) => {
      const updatedExercises = [...prev.exercises];
      const ex = updatedExercises[currentExIdx];
      if (!ex) return prev;

      const lastSet = ex.sets[ex.sets.length - 1];
      const newSetNumber = ex.sets.length + 1;
      const defaultWeight = lastSet ? lastSet.weightKg : 80;
      const defaultReps = lastSet ? lastSet.reps : 10;

      const newSet: WorkoutSet = {
        id: `set-${Date.now()}-${Math.random()}`,
        setNumber: newSetNumber,
        weightKg: defaultWeight,
        reps: defaultReps,
        isCompleted: false
      };

      ex.sets.push(newSet);

      return {
        ...prev,
        exercises: updatedExercises
      };
    });
  };

  // Delete a set
  const removeSet = (setId: string) => {
    setSession((prev) => {
      const updatedExercises = [...prev.exercises];
      const ex = updatedExercises[currentExIdx];
      if (!ex || ex.sets.length <= 1) return prev;

      ex.sets = ex.sets.filter((s) => s.id !== setId).map((s, idx) => ({ ...s, setNumber: idx + 1 }));

      return {
        ...prev,
        exercises: updatedExercises
      };
    });
  };

  // Determine which set is currently "Active" (first non-completed set or the last one if all done)
  const firstUncompletedSetIndex = currentExerciseData.sets.findIndex((s) => !s.isCompleted);
  const activeSetId =
    firstUncompletedSetIndex !== -1
      ? currentExerciseData.sets[firstUncompletedSetIndex].id
      : currentExerciseData.sets[currentExerciseData.sets.length - 1]?.id;

  const totalExercises = session.exercises.length;

  return (
    <div className="min-h-screen bg-[#E9E8F0] text-[#1b1b24] font-sora relative flex flex-col selection:bg-[#6d5dfe] selection:text-white">
      {/* Top Bar Header */}
      <Header
        title={session.routineTitle}
        subtitle="ACTIVE SESSION"
        onClose={onCloseSession}
      />

      {/* Main Canvas Area */}
      <main className="flex-grow pt-28 pb-36 px-6 z-10 relative flex flex-col md:max-w-2xl md:mx-auto w-full">
        {/* Exercise Pagination Switcher */}
        <div className="flex items-center justify-between mb-3 bg-white/60 backdrop-blur-md px-4 py-2 rounded-xl border border-[#c8c4d8]/40 shadow-xs">
          <button
            disabled={currentExIdx === 0}
            onClick={() => setCurrentExIdx((prev) => Math.max(0, prev - 1))}
            className="p-1.5 rounded-lg text-[#1b1b24] hover:bg-white disabled:opacity-30 disabled:hover:bg-transparent transition-colors flex items-center gap-1 text-xs font-semibold cursor-pointer"
          >
            <ChevronLeft className="w-4 h-4" /> Precedente
          </button>

          <span className="text-xs font-bold text-[#5340e4] font-sora">
            Esercizio {currentExIdx + 1} di {totalExercises}
          </span>

          <button
            disabled={currentExIdx === totalExercises - 1}
            onClick={() => setCurrentExIdx((prev) => Math.min(totalExercises - 1, prev + 1))}
            className="p-1.5 rounded-lg text-[#1b1b24] hover:bg-white disabled:opacity-30 disabled:hover:bg-transparent transition-colors flex items-center gap-1 text-xs font-semibold cursor-pointer"
          >
            Successivo <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {/* Exercise Title & Media Section */}
        <div className="mb-6 flex flex-col items-start w-full">
          <h1 className="text-3xl md:text-4xl font-extrabold text-[#1b1b24] mb-2 font-sora tracking-tight">
            {exercise.name}
          </h1>

          <div className="flex gap-2 mb-3">
            <span className="px-3 py-1 rounded-full bg-[#5340e4]/15 text-[#5340e4] font-semibold text-xs">
              {exercise.category}
            </span>
            <span className="px-3 py-1 rounded-full bg-[#006a61]/15 text-[#006a61] font-semibold text-xs">
              {exercise.muscleGroup}
            </span>
          </div>

          {/* Contextual Media Card */}
          <div className="w-full h-44 rounded-2xl overflow-hidden relative border border-[#c8c4d8]/40 shadow-sm mt-1 group">
            <img
              src={exercise.imageUrl}
              alt={exercise.name}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent flex items-end p-4">
              <button
                onClick={() => setIsFormModalOpen(true)}
                className="flex items-center gap-2 text-[#5340e4] font-bold text-xs bg-white/95 hover:bg-white px-4 py-2 rounded-full backdrop-blur-md shadow-md transition-all active:scale-95 cursor-pointer"
              >
                <PlayCircle className="w-4 h-4 text-[#5340e4] fill-[#5340e4]/20" />
                <span>View Form</span>
              </button>
            </div>
          </div>
        </div>

        {/* Sets Container */}
        <div className="flex flex-col gap-3">
          {currentExerciseData.sets.map((set) => {
            const isActive = set.id === activeSetId;
            const isCompleted = set.isCompleted;

            if (isCompleted) {
              // Completed Set State
              return (
                <div
                  key={set.id}
                  className="bg-[#fcf8ff] rounded-2xl p-4 shadow-sm border border-[#c8c4d8]/50 flex items-center gap-4 transition-all opacity-75 hover:opacity-100"
                >
                  <div className="flex flex-col items-center justify-center w-10">
                    <span className="text-xs font-semibold text-[#787587]">Set {set.setNumber}</span>
                  </div>

                  <div className="flex-grow flex gap-4">
                    <div className="flex-1">
                      <label className="block text-[11px] font-medium text-[#474555] mb-0.5">kg</label>
                      <div className="text-2xl font-semibold text-[#1b1b24] font-sora">{set.weightKg || '-'}</div>
                    </div>
                    <div className="flex-1">
                      <label className="block text-[11px] font-medium text-[#474555] mb-0.5">Reps</label>
                      <div className="text-2xl font-semibold text-[#1b1b24] font-sora">{set.reps || '-'}</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => toggleSetComplete(set.id)}
                      className="w-12 h-12 rounded-full bg-[#65f9e7] text-[#007167] flex items-center justify-center glow-complete transition-transform active:scale-90 cursor-pointer shadow-sm"
                      title="Contrassegna come incompleto"
                    >
                      <Check className="w-6 h-6 stroke-[3]" />
                    </button>
                  </div>
                </div>
              );
            }

            if (isActive) {
              // Active Set State (Highlighted with periwinkle glow)
              return (
                <div
                  key={set.id}
                  className="bg-[#fcf8ff] rounded-2xl p-4 shadow-md border-2 border-[#6d5dfe] glow-active flex items-center gap-4 transition-all relative overflow-hidden transform scale-[1.01]"
                >
                  {/* Subtle background glow */}
                  <div className="absolute inset-0 bg-[#5340e4]/5 pointer-events-none" />

                  <div className="flex flex-col items-center justify-center w-10 z-10">
                    <span className="text-xs font-bold text-[#5340e4]">Set {set.setNumber}</span>
                  </div>

                  <div className="flex-grow flex gap-4 z-10">
                    <div className="flex-1 relative">
                      <label className="block text-[11px] font-bold text-[#5340e4] mb-0.5">kg</label>
                      <input
                        type="number"
                        value={set.weightKg}
                        onChange={(e) => updateSetField(set.id, 'weightKg', e.target.value)}
                        placeholder="0"
                        className="w-full bg-transparent border-0 border-b-2 border-[#5340e4] focus:outline-none focus:border-[#6d5dfe] text-2xl font-bold text-[#1b1b24] p-0 pb-1 font-sora"
                      />
                    </div>
                    <div className="flex-1 relative">
                      <label className="block text-[11px] font-bold text-[#5340e4] mb-0.5">Reps</label>
                      <input
                        type="number"
                        value={set.reps}
                        onChange={(e) => updateSetField(set.id, 'reps', e.target.value)}
                        placeholder="0"
                        className="w-full bg-transparent border-0 border-b-2 border-[#5340e4] focus:outline-none focus:border-[#6d5dfe] text-2xl font-bold text-[#1b1b24] p-0 pb-1 font-sora"
                      />
                    </div>
                  </div>

                  <div className="flex items-center gap-1 z-10">
                    <button
                      onClick={() => toggleSetComplete(set.id)}
                      className="w-13 h-13 rounded-full bg-[#eae6f4] border-2 border-[#c8c4d8] text-[#787587] flex items-center justify-center hover:bg-[#65f9e7] hover:text-[#007167] hover:border-[#65f9e7] transition-all cursor-pointer shadow-sm group"
                      title="Completa Serie"
                    >
                      <Check className="w-6 h-6 stroke-[2.5]" />
                    </button>
                    {currentExerciseData.sets.length > 1 && (
                      <button
                        onClick={() => removeSet(set.id)}
                        className="p-1 text-[#787587] hover:text-[#ba1a1a] transition-colors"
                        title="Rimuovi serie"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              );
            }

            // Upcoming / Incomplete Set State
            return (
              <div
                key={set.id}
                className="bg-[#ffffff]/80 rounded-2xl p-4 shadow-xs border border-[#c8c4d8]/40 flex items-center gap-4 transition-all opacity-60 hover:opacity-90"
              >
                <div className="flex flex-col items-center justify-center w-10">
                  <span className="text-xs font-semibold text-[#787587]">Set {set.setNumber}</span>
                </div>

                <div className="flex-grow flex gap-4">
                  <div className="flex-1">
                    <label className="block text-[11px] font-medium text-[#787587] mb-0.5">kg</label>
                    <input
                      type="number"
                      value={set.weightKg}
                      onChange={(e) => updateSetField(set.id, 'weightKg', e.target.value)}
                      placeholder="-"
                      className="w-full bg-transparent border-0 text-xl font-medium text-[#474555] p-0 focus:outline-none font-sora"
                    />
                  </div>
                  <div className="flex-1">
                    <label className="block text-[11px] font-medium text-[#787587] mb-0.5">Reps</label>
                    <input
                      type="number"
                      value={set.reps}
                      onChange={(e) => updateSetField(set.id, 'reps', e.target.value)}
                      placeholder="-"
                      className="w-full bg-transparent border-0 text-xl font-medium text-[#474555] p-0 focus:outline-none font-sora"
                    />
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => toggleSetComplete(set.id)}
                    className="w-12 h-12 rounded-full border border-dashed border-[#c8c4d8] text-[#787587] hover:border-[#6d5dfe] hover:text-[#6d5dfe] flex items-center justify-center transition-colors cursor-pointer"
                  >
                    <Check className="w-5 h-5 opacity-40" />
                  </button>
                </div>
              </div>
            );
          })}

          {/* Add Set Button */}
          <button
            onClick={addSet}
            className="mt-2 w-full py-3.5 rounded-2xl border-2 border-dashed border-[#5340e4]/50 text-[#5340e4] font-bold text-sm flex items-center justify-center gap-2 hover:bg-[#5340e4]/5 active:scale-98 transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Add Set</span>
          </button>
        </div>
      </main>

      {/* One-Handed Controls (Fixed Bottom Action Bar) */}
      <div className="fixed bottom-0 w-full z-40 p-4 bg-gradient-to-t from-[#E9E8F0] via-[#E9E8F0]/95 to-transparent pb-safe flex justify-center pointer-events-none">
        <div className="pointer-events-auto flex gap-3 w-full md:max-w-md mx-auto">
          {/* Rest Button */}
          <button
            onClick={() => setIsRestTimerOpen(true)}
            className="flex-1 bg-[#eae6f4] text-[#1b1b24] font-bold text-sm py-4 rounded-2xl shadow-sm border border-[#c8c4d8]/50 hover:bg-[#e5e0ee] active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer font-sora"
          >
            <Timer className="w-5 h-5 text-[#5340e4]" />
            <span>Rest</span>
          </button>

          {/* Finish Exercise / Finish Workout Button */}
          <button
            onClick={() => {
              if (currentExIdx < totalExercises - 1) {
                setCurrentExIdx((prev) => prev + 1);
              } else {
                setIsSummaryOpen(true);
              }
            }}
            className="flex-[2] bg-[#6d5dfe] text-white font-bold text-base py-4 rounded-2xl shadow-[0_4px_20px_rgba(109,93,254,0.35)] hover:bg-[#5340e4] active:scale-95 transition-all flex items-center justify-center gap-2 relative overflow-hidden cursor-pointer font-sora glow-button"
          >
            <div className="absolute inset-0 bg-white/20 blur-md rounded-2xl pointer-events-none" />
            <span>
              {currentExIdx < totalExercises - 1 ? 'Prossimo Esercizio' : 'Finish Exercise'}
            </span>
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Modals */}
      <FormGuideModal
        exercise={exercise}
        isOpen={isFormModalOpen}
        onClose={() => setIsFormModalOpen(false)}
      />

      <RestTimerModal
        isOpen={isRestTimerOpen}
        onClose={() => setIsRestTimerOpen(false)}
        defaultTimeSeconds={90}
      />

      <WorkoutSummaryModal
        isOpen={isSummaryOpen}
        session={session}
        onSaveAndClose={() => {
          setIsSummaryOpen(false);
          onWorkoutCompleted();
        }}
      />
    </div>
  );
};
