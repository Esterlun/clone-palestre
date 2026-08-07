import React, { useState, useEffect } from 'react';
import { WorkoutRoutine, ExerciseSet } from '../types';

interface ActiveWorkoutModalProps {
  routine: WorkoutRoutine;
  onClose: () => void;
  onFinishWorkout: (routineTitle: string, totalVolumeKg: number, durationMin: number) => void;
}

export const ActiveWorkoutModal: React.FC<ActiveWorkoutModalProps> = ({
  routine,
  onClose,
  onFinishWorkout
}) => {
  const [secondsElapsed, setSecondsElapsed] = useState(0);
  const [restTimerSeconds, setRestTimerSeconds] = useState<number | null>(null);
  const [exerciseSets, setExerciseSets] = useState<Record<string, ExerciseSet[]>>(() => {
    const initial: Record<string, ExerciseSet[]> = {};
    routine.exercises.forEach(ex => {
      initial[ex.id] = ex.sets.map(s => ({ ...s }));
    });
    return initial;
  });

  // Stopwatch timer
  useEffect(() => {
    const interval = setInterval(() => {
      setSecondsElapsed(prev => prev + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  // Rest Timer countdown
  useEffect(() => {
    if (restTimerSeconds === null) return;
    if (restTimerSeconds <= 0) {
      setRestTimerSeconds(null);
      return;
    }
    const timer = setTimeout(() => {
      setRestTimerSeconds(prev => (prev !== null ? prev - 1 : null));
    }, 1000);
    return () => clearTimeout(timer);
  }, [restTimerSeconds]);

  const formatTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const remainder = secs % 60;
    return `${mins.toString().padStart(2, '0')}:${remainder.toString().padStart(2, '0')}`;
  };

  const handleToggleSet = (exerciseId: string, setIndex: number) => {
    setExerciseSets(prev => {
      const currentSets = prev[exerciseId] ? [...prev[exerciseId]] : [];
      const isNowCompleted = !currentSets[setIndex].completed;
      currentSets[setIndex] = {
        ...currentSets[setIndex],
        completed: isNowCompleted
      };

      if (isNowCompleted) {
        // Start 60s rest timer on set completion
        setRestTimerSeconds(60);
      }

      return {
        ...prev,
        [exerciseId]: currentSets
      };
    });
  };

  const handleUpdateWeight = (exerciseId: string, setIndex: number, weight: number) => {
    setExerciseSets(prev => {
      const currentSets = prev[exerciseId] ? [...prev[exerciseId]] : [];
      currentSets[setIndex] = { ...currentSets[setIndex], weightKg: weight };
      return { ...prev, [exerciseId]: currentSets };
    });
  };

  const handleUpdateReps = (exerciseId: string, setIndex: number, reps: number) => {
    setExerciseSets(prev => {
      const currentSets = prev[exerciseId] ? [...prev[exerciseId]] : [];
      currentSets[setIndex] = { ...currentSets[setIndex], targetReps: reps };
      return { ...prev, [exerciseId]: currentSets };
    });
  };

  const calculateTotalVolume = () => {
    let total = 0;
    (Object.values(exerciseSets) as ExerciseSet[][]).forEach(sets => {
      sets.forEach(s => {
        if (s.completed) {
          total += s.weightKg * s.targetReps;
        }
      });
    });
    return total;
  };

  const totalSetsCount = (Object.values(exerciseSets) as ExerciseSet[][]).reduce((acc: number, sets: ExerciseSet[]) => acc + sets.length, 0);
  const completedSetsCount = (Object.values(exerciseSets) as ExerciseSet[][]).reduce(
    (acc: number, sets: ExerciseSet[]) => acc + sets.filter(s => s.completed).length,
    0
  );

  const handleFinish = () => {
    const totalVolume = calculateTotalVolume();
    const durationMin = Math.max(1, Math.round(secondsElapsed / 60));
    onFinishWorkout(routine.title, totalVolume, durationMin);
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#1b1b24]/70 backdrop-blur-md flex items-center justify-center p-3 md:p-6 overflow-y-auto">
      <div className="bg-[#fcf8ff] w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden border border-[#c8c4d8]/30 max-h-[92vh] flex flex-col">
        {/* Header */}
        <div className="bg-[#1A1B2E] text-white p-6 relative flex justify-between items-center border-b border-white/10">
          <div>
            <span className="text-xs font-semibold text-[#65f9e7] uppercase tracking-wider">Active Workout</span>
            <h2 className="text-2xl font-bold tracking-tight text-white">{routine.title}</h2>
            <p className="text-xs text-[#c5c0ff] mt-0.5">{routine.subtitle}</p>
          </div>

          <div className="flex items-center gap-4">
            <div className="bg-white/10 px-4 py-2 rounded-2xl border border-white/10 text-right">
              <span className="text-[10px] text-slate-300 font-semibold block uppercase">Duration</span>
              <span className="font-mono font-bold text-xl text-white">{formatTime(secondsElapsed)}</span>
            </div>

            <button 
              onClick={onClose}
              className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors"
            >
              <span className="material-symbols-outlined text-lg">close</span>
            </button>
          </div>
        </div>

        {/* Progress bar */}
        <div className="w-full bg-[#eae6f4] h-1.5">
          <div 
            className="bg-[#6d5dfe] h-1.5 transition-all duration-300"
            style={{ width: `${totalSetsCount ? (completedSetsCount / totalSetsCount) * 100 : 0}%` }}
          ></div>
        </div>

        {/* Exercises list */}
        <div className="p-5 md:p-6 overflow-y-auto space-y-6 flex-1">
          {routine.exercises.map((ex) => {
            const sets = exerciseSets[ex.id] || ex.sets;

            return (
              <div key={ex.id} className="bg-white rounded-2xl p-5 border border-[#c8c4d8]/20 shadow-xs">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="font-semibold text-lg text-[#1b1b24]">{ex.name}</h3>
                  <span className="text-xs font-medium bg-[#f0ecf9] text-[#5340e4] px-3 py-1 rounded-full">
                    {ex.category}
                  </span>
                </div>

                {/* Sets Table */}
                <div className="space-y-2.5">
                  <div className="grid grid-cols-12 text-[11px] font-semibold text-[#474555] uppercase tracking-wider px-2">
                    <span className="col-span-2">Set</span>
                    <span className="col-span-4 text-center">Kg</span>
                    <span className="col-span-4 text-center">Reps</span>
                    <span className="col-span-2 text-right">Done</span>
                  </div>

                  {sets.map((set, sIdx) => (
                    <div 
                      key={sIdx}
                      className={`grid grid-cols-12 items-center p-2 rounded-xl transition-colors ${
                        set.completed ? 'bg-[#65f9e7]/15 border border-[#65f9e7]/30' : 'bg-[#f6f1ff]'
                      }`}
                    >
                      <span className="col-span-2 font-bold text-sm text-[#1b1b24] pl-1">
                        #{set.setNumber}
                      </span>

                      <div className="col-span-4 flex justify-center">
                        <input 
                          type="number"
                          value={set.weightKg}
                          onChange={(e) => handleUpdateWeight(ex.id, sIdx, parseFloat(e.target.value) || 0)}
                          className="w-16 text-center font-bold text-sm bg-white border border-[#c8c4d8]/40 rounded-lg py-1 px-1 focus:ring-2 focus:ring-[#5340e4] outline-hidden text-[#1b1b24]"
                        />
                      </div>

                      <div className="col-span-4 flex justify-center">
                        <input 
                          type="number"
                          value={set.targetReps}
                          onChange={(e) => handleUpdateReps(ex.id, sIdx, parseInt(e.target.value) || 0)}
                          className="w-16 text-center font-bold text-sm bg-white border border-[#c8c4d8]/40 rounded-lg py-1 px-1 focus:ring-2 focus:ring-[#5340e4] outline-hidden text-[#1b1b24]"
                        />
                      </div>

                      <div className="col-span-2 flex justify-end pr-1">
                        <button
                          onClick={() => handleToggleSet(ex.id, sIdx)}
                          className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${
                            set.completed 
                              ? 'bg-[#006a61] text-white shadow-sm' 
                              : 'bg-white border-2 border-[#c8c4d8] text-transparent hover:border-[#5340e4]'
                          }`}
                        >
                          <span className="material-symbols-outlined text-sm font-bold">check</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        {/* Floating Rest Timer Notification if active */}
        {restTimerSeconds !== null && (
          <div className="bg-[#1A1B2E] text-white px-6 py-3 border-t border-white/10 flex justify-between items-center animate-bounce-short">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-[#65f9e7]">timer</span>
              <span className="text-xs font-semibold text-[#c5c0ff]">Rest Timer:</span>
              <span className="font-mono font-bold text-base text-[#65f9e7]">{restTimerSeconds}s</span>
            </div>
            <button 
              onClick={() => setRestTimerSeconds(null)}
              className="text-xs bg-white/10 hover:bg-white/20 px-3 py-1 rounded-full text-white font-medium"
            >
              Skip Rest
            </button>
          </div>
        )}

        {/* Footer actions */}
        <div className="p-4 bg-white border-t border-[#c8c4d8]/20 flex justify-between items-center">
          <div>
            <span className="text-xs text-[#474555] font-medium block">Sets Completed</span>
            <span className="font-bold text-base text-[#1b1b24]">
              {completedSetsCount} / {totalSetsCount}
            </span>
          </div>

          <button
            onClick={handleFinish}
            className="bg-gradient-to-r from-[#6d5dfe] to-[#5340e4] hover:from-[#7c6efe] text-white font-bold px-7 py-3 rounded-full shadow-md hover:shadow-lg active:scale-95 transition-all flex items-center gap-2"
          >
            <span className="material-symbols-outlined text-lg">check_circle</span>
            Finish Workout
          </button>
        </div>
      </div>
    </div>
  );
};
