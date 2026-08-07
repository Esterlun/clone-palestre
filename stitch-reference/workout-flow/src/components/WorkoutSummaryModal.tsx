import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { Trophy, Clock, Dumbbell, CheckCircle, Flame, ArrowRight } from 'lucide-react';
import { ActiveSessionState } from '../types';

interface WorkoutSummaryModalProps {
  isOpen: boolean;
  session: ActiveSessionState;
  onSaveAndClose: () => void;
}

export const WorkoutSummaryModal: React.FC<WorkoutSummaryModalProps> = ({
  isOpen,
  session,
  onSaveAndClose
}) => {
  useEffect(() => {
    if (isOpen) {
      // Trigger festive workout celebration confetti
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#6d5dfe', '#00c2b2', '#ff7d6b', '#65f9e7']
        });
      } catch {
        // Ignore if canvas-confetti fails
      }
    }
  }, [isOpen]);

  if (!isOpen) return null;

  // Calculate workout session summary statistics
  const durationMinutes = Math.max(1, Math.round((Date.now() - session.startTime) / (1000 * 60)));

  let totalVolumeKg = 0;
  let totalCompletedSets = 0;
  const prs: string[] = [];

  session.exercises.forEach((ex) => {
    ex.sets.forEach((s) => {
      if (s.isCompleted) {
        const w = Number(s.weightKg) || 0;
        const r = Number(s.reps) || 0;
        totalVolumeKg += w * r;
        totalCompletedSets += 1;

        if (w >= 90) {
          prs.push(`${ex.exercise.name} - ${w}kg x ${r}`);
        }
      }
    });
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-fadeIn">
      <div className="bg-[#fcf8ff] rounded-3xl w-full max-w-md p-6 shadow-2xl border border-[#c8c4d8]/40 flex flex-col items-center relative text-center max-h-[90vh] overflow-y-auto">
        {/* Top Trophy Icon */}
        <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-[#6d5dfe] to-[#65f9e7] p-1 shadow-lg mb-4 glow-active">
          <div className="w-full h-full rounded-full bg-[#2d1b33] flex items-center justify-center text-white">
            <Trophy className="w-10 h-10 text-[#65f9e7]" />
          </div>
        </div>

        <span className="text-xs font-bold uppercase tracking-widest text-[#5340e4] bg-[#5340e4]/10 px-3 py-1 rounded-full mb-2">
          Workout Completato!
        </span>

        <h2 className="text-2xl font-bold font-sora text-[#1b1b24] mb-1">
          {session.routineTitle}
        </h2>

        <p className="text-xs text-[#787587] mb-6">
          Ottimo lavoro! Hai spinto al massimo oggi.
        </p>

        {/* Stats Grid */}
        <div className="grid grid-cols-3 gap-3 w-full mb-6">
          <div className="bg-[#f0ecf9] rounded-2xl p-3 flex flex-col items-center border border-[#e5e0ee]">
            <Clock className="w-5 h-5 text-[#5340e4] mb-1" />
            <span className="text-lg font-bold font-sora text-[#1b1b24]">{durationMinutes}m</span>
            <span className="text-[10px] font-semibold text-[#787587]">Durata</span>
          </div>

          <div className="bg-[#f0ecf9] rounded-2xl p-3 flex flex-col items-center border border-[#e5e0ee]">
            <Dumbbell className="w-5 h-5 text-[#006a61] mb-1" />
            <span className="text-lg font-bold font-sora text-[#1b1b24]">{totalVolumeKg}kg</span>
            <span className="text-[10px] font-semibold text-[#787587]">Volume</span>
          </div>

          <div className="bg-[#f0ecf9] rounded-2xl p-3 flex flex-col items-center border border-[#e5e0ee]">
            <CheckCircle className="w-5 h-5 text-[#6d5dfe] mb-1" />
            <span className="text-lg font-bold font-sora text-[#1b1b24]">{totalCompletedSets}</span>
            <span className="text-[10px] font-semibold text-[#787587]">Serie Complete</span>
          </div>
        </div>

        {/* PR Achievement highlight if any */}
        {prs.length > 0 && (
          <div className="w-full bg-gradient-to-r from-[#6d5dfe]/15 to-[#65f9e7]/20 border border-[#6d5dfe]/30 rounded-2xl p-4 text-left mb-6 space-y-1">
            <div className="flex items-center gap-2 text-[#5340e4] font-bold text-xs uppercase tracking-wider">
              <Flame className="w-4 h-4 text-[#ff7d6b] fill-[#ff7d6b]" />
              <span>Nuovo Record Personale (PR)!</span>
            </div>
            {prs.map((pr, idx) => (
              <p key={idx} className="text-xs font-semibold text-[#1b1b24] pl-6">
                🏆 {pr}
              </p>
            ))}
          </div>
        )}

        {/* Exercises Breakdown */}
        <div className="w-full text-left bg-white rounded-2xl p-4 border border-[#c8c4d8]/30 mb-6 space-y-3">
          <span className="text-xs font-bold uppercase tracking-wider text-[#787587]">Riepilogo Esercizi</span>
          <div className="space-y-2 max-h-40 overflow-y-auto pr-1">
            {session.exercises.map((ex, idx) => {
              const completedCount = ex.sets.filter((s) => s.isCompleted).length;
              return (
                <div key={idx} className="flex justify-between items-center text-xs border-b border-[#e5e0ee] pb-1.5 last:border-0">
                  <span className="font-semibold text-[#1b1b24]">{ex.exercise.name}</span>
                  <span className="font-bold text-[#5340e4] bg-[#5340e4]/10 px-2 py-0.5 rounded-full text-[11px]">
                    {completedCount} / {ex.sets.length} serie
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Save Button */}
        <button
          onClick={onSaveAndClose}
          className="w-full py-4 rounded-xl bg-[#6d5dfe] text-white font-bold text-base shadow-lg hover:bg-[#5340e4] transition-all flex items-center justify-center gap-2 glow-button cursor-pointer"
        >
          <span>Salva Allenamento e Concludi</span>
          <ArrowRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};
