import React from 'react';
import { Calendar, Trophy, Clock, Dumbbell, Flame, CheckCircle2, Trash2 } from 'lucide-react';
import { CompletedWorkout } from '../types';

interface HistoryViewProps {
  history: CompletedWorkout[];
  onClearHistory: () => void;
}

export const HistoryView: React.FC<HistoryViewProps> = ({ history, onClearHistory }) => {
  const totalVolume = history.reduce((sum, h) => sum + h.totalVolumeKg, 0);
  const totalWorkouts = history.length;
  const totalSets = history.reduce((sum, h) => sum + h.totalSetsCompleted, 0);

  return (
    <div className="min-h-screen bg-[#E9E8F0] pb-28 pt-6 px-4 md:px-8 max-w-2xl mx-auto font-sora">
      {/* Header */}
      <div className="mb-6 flex justify-between items-center">
        <div>
          <span className="text-xs font-bold uppercase tracking-widest text-[#5340e4]">
            Storico & Analitica
          </span>
          <h1 className="text-2xl font-extrabold text-[#1b1b24] font-sora">
            I Tuoi Progressi
          </h1>
        </div>

        {history.length > 0 && (
          <button
            onClick={onClearHistory}
            className="text-xs text-[#787587] hover:text-[#ba1a1a] flex items-center gap-1 transition-colors"
            title="Svuota storico"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Azzera</span>
          </button>
        )}
      </div>

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-3 gap-3 mb-6">
        <div className="bg-[#fcf8ff] rounded-2xl p-3.5 border border-[#c8c4d8]/40 shadow-xs flex flex-col items-center text-center">
          <Dumbbell className="w-5 h-5 text-[#5340e4] mb-1" />
          <span className="text-lg font-bold font-sora text-[#1b1b24]">{totalVolume} kg</span>
          <span className="text-[10px] font-semibold text-[#787587]">Volume Totale</span>
        </div>

        <div className="bg-[#fcf8ff] rounded-2xl p-3.5 border border-[#c8c4d8]/40 shadow-xs flex flex-col items-center text-center">
          <Calendar className="w-5 h-5 text-[#006a61] mb-1" />
          <span className="text-lg font-bold font-sora text-[#1b1b24]">{totalWorkouts}</span>
          <span className="text-[10px] font-semibold text-[#787587]">Workout</span>
        </div>

        <div className="bg-[#fcf8ff] rounded-2xl p-3.5 border border-[#c8c4d8]/40 shadow-xs flex flex-col items-center text-center">
          <CheckCircle2 className="w-5 h-5 text-[#6d5dfe] mb-1" />
          <span className="text-lg font-bold font-sora text-[#1b1b24]">{totalSets}</span>
          <span className="text-[10px] font-semibold text-[#787587]">Serie Totali</span>
        </div>
      </div>

      {/* Benchmark PR Box */}
      <div className="bg-gradient-to-r from-[#2d1b33] to-[#5340e4] text-white rounded-2xl p-5 shadow-lg mb-6 flex justify-between items-center">
        <div>
          <div className="flex items-center gap-1.5 text-[#65f9e7] font-bold text-xs uppercase tracking-wider mb-1">
            <Trophy className="w-4 h-4" />
            <span>Panca Piana PR</span>
          </div>
          <p className="text-2xl font-extrabold font-sora">90 kg x 6 Reps</p>
          <p className="text-xs text-white/70">Record registrato nell'ultimo Upper Body Power</p>
        </div>
        <div className="w-12 h-12 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center text-[#65f9e7] font-bold text-lg border border-white/20">
          🔥
        </div>
      </div>

      {/* Workout History Timeline */}
      <h2 className="text-xs font-bold uppercase tracking-wider text-[#787587] mb-3">
        Registro Sessioni
      </h2>

      <div className="space-y-4">
        {history.map((item) => (
          <div
            key={item.id}
            className="bg-[#fcf8ff] rounded-2xl p-5 shadow-sm border border-[#c8c4d8]/40 space-y-3"
          >
            <div className="flex justify-between items-start border-b border-[#e5e0ee] pb-2.5">
              <div>
                <span className="text-[11px] font-bold text-[#5340e4] uppercase tracking-wider">
                  {item.date}
                </span>
                <h3 className="font-bold text-lg text-[#1b1b24] font-sora">
                  {item.title}
                </h3>
              </div>

              <div className="flex items-center gap-3 text-xs text-[#474555]">
                <span className="flex items-center gap-1 font-semibold">
                  <Clock className="w-3.5 h-3.5 text-[#5340e4]" />
                  {Math.round(item.durationSeconds / 60)}m
                </span>
                <span className="flex items-center gap-1 font-semibold">
                  <Dumbbell className="w-3.5 h-3.5 text-[#006a61]" />
                  {item.totalVolumeKg}kg
                </span>
              </div>
            </div>

            {item.prsAchieved && item.prsAchieved.length > 0 && (
              <div className="bg-[#65f9e7]/20 text-[#005049] p-2 rounded-xl text-xs font-bold flex items-center gap-1.5">
                <Flame className="w-4 h-4 text-[#ff7d6b] fill-[#ff7d6b]" />
                <span>PR: {item.prsAchieved.join(', ')}</span>
              </div>
            )}

            {/* Exercises detail list */}
            <div className="space-y-1.5 pt-1">
              {item.exercises.map((ex, idx) => (
                <div key={idx} className="text-xs flex justify-between items-center text-[#474555]">
                  <span className="font-semibold text-[#1b1b24]">{ex.exerciseName}</span>
                  <span className="text-[#787587]">
                    {ex.sets.map((s) => `${s.weightKg}kg×${s.reps}`).join(' | ')}
                  </span>
                </div>
              ))}
            </div>
          </div>
        ))}

        {history.length === 0 && (
          <div className="text-center py-12 bg-white rounded-2xl border border-[#c8c4d8]/30">
            <Calendar className="w-10 h-10 text-[#787587] mx-auto mb-2 opacity-50" />
            <p className="text-sm font-bold text-[#1b1b24]">Nessun allenamento registrato</p>
            <p className="text-xs text-[#787587]">Completa una sessione per vederla comparire qui!</p>
          </div>
        )}
      </div>
    </div>
  );
};
