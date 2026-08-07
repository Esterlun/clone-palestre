import React, { useState, useEffect } from 'react';
import { ActiveTab, ExerciseSet, PRRecord, WorkoutRoutine } from '../types';
import { motion, AnimatePresence } from 'motion/react';

interface StartSessionViewProps {
  routine: WorkoutRoutine;
  onFinishSession: (loggedVolumeKg: number, durationMinutes: number) => void;
  onCheckPR: (exerciseName: string, weightKg: number) => void;
  setActiveTab: (tab: ActiveTab) => void;
}

export const StartSessionView: React.FC<StartSessionViewProps> = ({
  routine,
  onFinishSession,
  onCheckPR,
  setActiveTab,
}) => {
  const [exercises, setExercises] = useState(routine.exercises);
  const [activeExerciseIdx, setActiveExerciseIdx] = useState(0);
  const [sessionSeconds, setSessionSeconds] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  // Rest Timer State
  const [restSecondsLeft, setRestSecondsLeft] = useState<number | null>(null);
  const [isResting, setIsResting] = useState(false);

  // Celebration state
  const [celebrationPR, setCelebrationPR] = useState<{ exercise: string; weight: number } | null>(null);

  // Session Stopwatch
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (!isPaused) {
      timer = setInterval(() => {
        setSessionSeconds((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isPaused]);

  // Rest Countdown
  useEffect(() => {
    let restTimer: NodeJS.Timeout;
    if (isResting && restSecondsLeft !== null && restSecondsLeft > 0) {
      restTimer = setInterval(() => {
        setRestSecondsLeft((prev) => (prev !== null ? prev - 1 : 0));
      }, 1000);
    } else if (restSecondsLeft === 0) {
      setIsResting(false);
      setRestSecondsLeft(null);
    }
    return () => clearInterval(restTimer);
  }, [isResting, restSecondsLeft]);

  const activeExercise = exercises[activeExerciseIdx] || exercises[0];

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const handleToggleSet = (exIdx: number, setIdx: number) => {
    const updated = [...exercises];
    const targetSet = updated[exIdx].sets[setIdx];
    const wasCompleted = targetSet.completed;
    targetSet.completed = !wasCompleted;

    setExercises(updated);

    if (!wasCompleted) {
      // Check if this weight is a PR!
      if (targetSet.weightKg >= 185 && updated[exIdx].name.includes('Deadlift')) {
        setCelebrationPR({ exercise: updated[exIdx].name, weight: targetSet.weightKg });
      } else if (targetSet.weightKg >= 125 && updated[exIdx].name.includes('Bench')) {
        setCelebrationPR({ exercise: updated[exIdx].name, weight: targetSet.weightKg });
      }

      onCheckPR(updated[exIdx].name, targetSet.weightKg);

      // Start Rest Timer
      setRestSecondsLeft(updated[exIdx].restSeconds || 60);
      setIsResting(true);
    }
  };

  const handleUpdateSetWeight = (exIdx: number, setIdx: number, weight: number) => {
    const updated = [...exercises];
    updated[exIdx].sets[setIdx].weightKg = weight;
    setExercises(updated);
  };

  const handleUpdateSetReps = (exIdx: number, setIdx: number, reps: number) => {
    const updated = [...exercises];
    updated[exIdx].sets[setIdx].reps = reps;
    setExercises(updated);
  };

  const handleAddSet = (exIdx: number) => {
    const updated = [...exercises];
    const currentSets = updated[exIdx].sets;
    const lastSet = currentSets[currentSets.length - 1] || { weightKg: 60, reps: 10 };
    currentSets.push({
      setNumber: currentSets.length + 1,
      weightKg: lastSet.weightKg,
      reps: lastSet.reps,
      completed: false,
    });
    setExercises(updated);
  };

  const calculateTotalVolume = () => {
    let vol = 0;
    exercises.forEach((ex) => {
      ex.sets.forEach((s) => {
        if (s.completed) {
          vol += s.weightKg * s.reps;
        }
      });
    });
    return vol;
  };

  const handleCompleteSession = () => {
    const vol = calculateTotalVolume();
    const duration = Math.max(1, Math.round(sessionSeconds / 60));
    onFinishSession(vol, duration);
    setActiveTab('analytics');
  };

  return (
    <main className="pt-24 pb-28 px-6 md:pl-[calc(256px+40px)] md:pr-10 md:pt-12 md:pb-12 max-w-[1400px] mx-auto min-h-screen flex flex-col gap-6">
      {/* Session Top Status Header */}
      <div className="bg-[#1a1b2e] text-white p-6 rounded-3xl shadow-xl flex flex-col sm:flex-row justify-between items-center gap-4 border border-white/10">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2.5 h-2.5 rounded-full bg-[#65f9e7] animate-ping"></span>
            <span className="text-xs font-['Sora'] font-bold text-[#65f9e7] uppercase tracking-wider">
              Live Workout Session
            </span>
          </div>
          <h1 className="font-['Sora'] text-2xl font-bold text-white">{routine.title}</h1>
          <p className="text-xs text-white/60 mt-0.5">
            Logged Volume: <strong className="text-[#65f9e7]">{calculateTotalVolume().toLocaleString()} kg</strong>
          </p>
        </div>

        <div className="flex items-center gap-4">
          <div className="text-center sm:text-right">
            <div className="text-xs text-white/60 font-medium">Session Duration</div>
            <div className="font-mono text-3xl font-extrabold text-white tracking-wider">
              {formatTime(sessionSeconds)}
            </div>
          </div>

          <button
            onClick={() => setIsPaused(!isPaused)}
            className="w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors"
          >
            <span className="material-symbols-outlined text-[24px]">
              {isPaused ? 'play_arrow' : 'pause'}
            </span>
          </button>

          <button
            onClick={handleCompleteSession}
            className="px-6 py-3.5 rounded-full bg-[#65f9e7] text-[#00201d] font-['Sora'] font-extrabold text-sm hover:brightness-105 transition-all shadow-lg active:scale-95"
          >
            Finish Workout
          </button>
        </div>
      </div>

      {/* Rest Timer Banner */}
      <AnimatePresence>
        {isResting && restSecondsLeft !== null && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="bg-[#5340e4] text-white p-4 rounded-2xl flex items-center justify-between shadow-lg border border-[#6d5dfe]"
          >
            <div className="flex items-center gap-3">
              <span className="material-symbols-outlined text-[#65f9e7] animate-spin text-[24px]">
                timer
              </span>
              <div>
                <span className="text-xs text-[#e4dfff] font-semibold uppercase">Rest Interval</span>
                <p className="font-mono font-extrabold text-xl text-white">{restSecondsLeft}s remaining</p>
              </div>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => setRestSecondsLeft((prev) => (prev !== null ? prev + 30 : 30))}
                className="px-3 py-1.5 rounded-full bg-white/20 hover:bg-white/30 text-xs font-bold"
              >
                +30s
              </button>
              <button
                onClick={() => {
                  setIsResting(false);
                  setRestSecondsLeft(null);
                }}
                className="px-3 py-1.5 rounded-full bg-[#65f9e7] text-[#00201d] text-xs font-extrabold"
              >
                Skip Rest
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Exercises Switcher Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none">
        {exercises.map((ex, idx) => {
          const isCompleted = ex.sets.every((s) => s.completed);
          return (
            <button
              key={ex.id || idx}
              onClick={() => setActiveExerciseIdx(idx)}
              className={`px-5 py-3 rounded-2xl text-xs font-['Sora'] font-semibold whitespace-nowrap transition-all flex items-center gap-2 border ${
                activeExerciseIdx === idx
                  ? 'bg-[#5340e4] text-white border-[#5340e4] shadow-md'
                  : 'bg-white text-[#474555] border-[#e5e0ee] hover:bg-[#f6f1ff]'
              }`}
            >
              {isCompleted ? (
                <span className="material-symbols-outlined text-[#65f9e7] text-[16px]">check_circle</span>
              ) : (
                <span className="w-2 h-2 rounded-full bg-[#6d5dfe]"></span>
              )}
              {idx + 1}. {ex.name}
            </button>
          );
        })}
      </div>

      {/* Active Exercise Detail & Set Logger Card */}
      <div className="glass-panel p-6 md:p-8 rounded-3xl border border-white/60 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-3 py-1 bg-[#5340e4]/10 text-[#5340e4] text-xs font-bold rounded-full">
                {activeExercise.category}
              </span>
              <span className="text-xs text-[#787587]">Rest: {activeExercise.restSeconds}s</span>
            </div>
            <h2 className="font-['Sora'] text-2xl font-bold text-[#1b1b24]">{activeExercise.name}</h2>
            <p className="text-xs text-[#474555] mt-1">
              Target Muscles: {activeExercise.targetMuscles.join(', ')}
            </p>
          </div>

          <button
            onClick={() => handleAddSet(activeExerciseIdx)}
            className="px-5 py-2.5 rounded-full bg-[#eae6f4] hover:bg-[#dcd8e5] text-[#1b1b24] font-['Sora'] text-xs font-bold flex items-center gap-1.5 self-start sm:self-auto"
          >
            <span className="material-symbols-outlined text-[16px]">add</span>
            Add Set
          </button>
        </div>

        {/* Set Logger Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left font-['Sora'] text-xs">
            <thead>
              <tr className="border-b border-[#c8c4d8]/40 text-[#787587] uppercase font-bold text-[11px]">
                <th className="py-3 px-3">Set</th>
                <th className="py-3 px-3">Weight (kg)</th>
                <th className="py-3 px-3">Reps</th>
                <th className="py-3 px-3 text-center">Completed</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#c8c4d8]/20">
              {activeExercise.sets.map((set, sIdx) => (
                <tr
                  key={sIdx}
                  className={`transition-colors ${set.completed ? 'bg-[#65f9e7]/10' : 'hover:bg-[#f6f1ff]'}`}
                >
                  <td className="py-3.5 px-3 font-bold text-[#1b1b24]">Set {set.setNumber}</td>
                  <td className="py-3.5 px-3">
                    <input
                      type="number"
                      value={set.weightKg}
                      onChange={(e) => handleUpdateSetWeight(activeExerciseIdx, sIdx, Number(e.target.value))}
                      className="w-20 px-3 py-1.5 rounded-xl border border-[#c8c4d8] text-center font-bold text-sm outline-none focus:border-[#5340e4] bg-white"
                    />
                  </td>
                  <td className="py-3.5 px-3">
                    <input
                      type="number"
                      value={set.reps}
                      onChange={(e) => handleUpdateSetReps(activeExerciseIdx, sIdx, Number(e.target.value))}
                      className="w-20 px-3 py-1.5 rounded-xl border border-[#c8c4d8] text-center font-bold text-sm outline-none focus:border-[#5340e4] bg-white"
                    />
                  </td>
                  <td className="py-3.5 px-3 text-center">
                    <button
                      onClick={() => handleToggleSet(activeExerciseIdx, sIdx)}
                      className={`w-10 h-10 rounded-2xl flex items-center justify-center transition-all mx-auto ${
                        set.completed
                          ? 'bg-[#65f9e7] text-[#00201d] shadow-md scale-105'
                          : 'bg-[#eae6f4] text-[#787587] hover:bg-[#c8c4d8]'
                      }`}
                    >
                      <span className="material-symbols-outlined text-[22px]">
                        {set.completed ? 'check' : 'check_box_outline_blank'}
                      </span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* PR Celebration Popup */}
      <AnimatePresence>
        {celebrationPR && (
          <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-md flex items-center justify-center p-4">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="bg-gradient-to-b from-[#1a1b2e] to-[#2d1b33] text-white p-8 rounded-3xl max-w-sm w-full text-center shadow-2xl border border-[#65f9e7]/50"
            >
              <div className="w-20 h-20 rounded-full bg-[#65f9e7]/20 border border-[#65f9e7] flex items-center justify-center text-[#65f9e7] mx-auto mb-4 animate-bounce">
                <span className="material-symbols-outlined text-[40px]">military_tech</span>
              </div>

              <span className="px-3 py-1 bg-[#65f9e7] text-[#00201d] text-xs font-extrabold rounded-full uppercase tracking-wider">
                New Personal Record!
              </span>

              <h2 className="font-['Sora'] text-2xl font-extrabold text-white mt-3">
                {celebrationPR.exercise}
              </h2>

              <p className="font-['Sora'] text-5xl font-black text-[#65f9e7] my-3">
                {celebrationPR.weight} <span className="text-xl text-white/70">kg</span>
              </p>

              <p className="text-xs text-white/80 mb-6">
                You just pushed past your previous maximum record! Phenomenal power output.
              </p>

              <button
                onClick={() => setCelebrationPR(null)}
                className="w-full py-3.5 rounded-full bg-[#65f9e7] text-[#00201d] font-bold text-sm shadow-lg active:scale-95"
              >
                Continue Training 💥
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </main>
  );
};
