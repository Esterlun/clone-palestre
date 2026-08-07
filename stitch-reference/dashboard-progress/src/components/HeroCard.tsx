import React from 'react';
import { WorkoutRoutine } from '../types';

interface HeroCardProps {
  routine: WorkoutRoutine;
  onStartWorkout: () => void;
}

export const HeroCard: React.FC<HeroCardProps> = ({ routine, onStartWorkout }) => {
  return (
    <section className="w-full dusk-card rounded-[32px] p-7 md:p-9 text-white relative overflow-hidden flex flex-col min-h-[290px] border border-white/10">
      {/* Abstract aura glow background elements */}
      <div className="absolute -top-32 -right-32 w-96 h-96 bg-[#6d5dfe]/35 rounded-full blur-[80px] pointer-events-none"></div>
      <div className="absolute -bottom-32 -left-32 w-80 h-80 bg-[#65f9e7]/20 rounded-full blur-[60px] pointer-events-none"></div>

      <div className="relative z-10 flex flex-col h-full justify-between">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/10 backdrop-blur-md rounded-full text-xs font-medium mb-4 border border-white/10 text-slate-200">
            <span className="w-1.5 h-1.5 rounded-full bg-[#65f9e7] animate-pulse"></span>
            Today's Focus
          </div>

          <h2 className="font-bold text-3xl md:text-5xl leading-tight mb-2 tracking-tight text-white">
            {routine.title}
          </h2>

          <p className="text-base md:text-lg text-[#c5c0ff] max-w-[280px] md:max-w-md font-normal leading-relaxed">
            {routine.subtitle}
          </p>
        </div>

        <div className="mt-8 flex justify-between items-end">
          <div className="flex flex-col">
            <span className="text-xs text-[#e5e0ee]/80 font-medium uppercase tracking-wider">Est. Time</span>
            <span className="font-semibold text-2xl md:text-3xl text-white">{routine.estimatedTimeMin} min</span>
          </div>

          <button 
            onClick={onStartWorkout}
            className="bg-gradient-to-r from-[#6d5dfe] to-[#5441e4] hover:from-[#7c6efe] hover:to-[#604ce8] text-white font-bold text-base px-8 py-3.5 rounded-full glow-button active:scale-95 transition-all duration-200 flex items-center gap-2.5 cursor-pointer"
          >
            Inizia
            <span className="material-symbols-outlined text-lg">arrow_forward</span>
          </button>
        </div>
      </div>
    </section>
  );
};
