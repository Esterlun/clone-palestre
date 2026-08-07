import React from 'react';
import { ActiveTab, PRRecord, UserProfile, WorkoutRoutine } from '../types';

interface HomeViewProps {
  userProfile: UserProfile;
  prs: PRRecord[];
  routines: WorkoutRoutine[];
  setActiveTab: (tab: ActiveTab) => void;
  onSelectRoutineToStart: (routine: WorkoutRoutine) => void;
}

export const HomeView: React.FC<HomeViewProps> = ({
  userProfile,
  prs,
  routines,
  setActiveTab,
  onSelectRoutineToStart,
}) => {
  return (
    <main className="pt-24 pb-28 px-6 md:pl-[calc(256px+40px)] md:pr-10 md:pt-12 md:pb-12 max-w-[1600px] mx-auto min-h-screen flex flex-col gap-8">
      {/* Welcome Hero Banner */}
      <section className="bg-gradient-to-r from-[#1a1b2e] via-[#2d1b33] to-[#1a1b2e] text-white rounded-3xl p-8 md:p-10 shadow-2xl relative overflow-hidden border border-white/10">
        <div className="absolute right-0 top-0 w-96 h-96 bg-[#6d5dfe] opacity-30 blur-3xl rounded-full pointer-events-none"></div>
        <div className="absolute bottom-0 left-1/3 w-64 h-64 bg-[#65f9e7] opacity-20 blur-2xl rounded-full pointer-events-none"></div>

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="max-w-xl">
            <div className="flex items-center gap-2 mb-2">
              <span className="px-3 py-1 rounded-full bg-[#65f9e7]/20 text-[#65f9e7] text-xs font-bold uppercase tracking-wider border border-[#65f9e7]/30">
                {userProfile.role}
              </span>
              <span className="text-xs text-white/60">Streak: {userProfile.dailyStreak} days active 🔥</span>
            </div>

            <h1 className="font-['Sora'] text-3xl md:text-5xl font-extrabold text-white tracking-tight leading-tight">
              Welcome back, <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-[#e4dfff] to-[#65f9e7]">
                {userProfile.name}
              </span>
            </h1>

            <p className="font-['Sora'] text-sm md:text-base text-white/80 mt-3 leading-relaxed">
              Your recovery score is <strong className="text-[#65f9e7]">88% (Optimal)</strong>. Today is ideal for heavy hypertrophy compound movements.
            </p>

            <div className="flex flex-wrap items-center gap-4 mt-6">
              <button
                onClick={() => {
                  onSelectRoutineToStart(routines[0]);
                  setActiveTab('start');
                }}
                className="px-6 py-3.5 rounded-full bg-[#6d5dfe] text-white font-['Sora'] font-bold text-sm hover:opacity-90 transition-all bg-glow-primary shadow-lg flex items-center gap-2 active:scale-95"
              >
                <span className="material-symbols-outlined text-[20px]">bolt</span>
                Start Today's Session
              </button>

              <button
                onClick={() => setActiveTab('analytics')}
                className="px-6 py-3.5 rounded-full bg-white/10 backdrop-blur-md text-white font-['Sora'] font-semibold text-sm hover:bg-white/20 transition-all border border-white/20 flex items-center gap-2"
              >
                <span className="material-symbols-outlined text-[20px]">monitoring</span>
                View Analytics
              </button>
            </div>
          </div>

          {/* Readiness Dial Card */}
          <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-3xl p-6 flex flex-col items-center justify-center text-center shrink-0 w-full md:w-64">
            <div className="relative w-28 h-28 flex items-center justify-center mb-2">
              <svg className="w-full h-full transform -rotate-90">
                <circle cx="56" cy="56" r="48" fill="none" stroke="rgba(255,255,255,0.15)" strokeWidth="8" />
                <circle
                  cx="56"
                  cy="56"
                  r="48"
                  fill="none"
                  stroke="#65f9e7"
                  strokeWidth="8"
                  strokeDasharray="301"
                  strokeDashoffset="36"
                  strokeLinecap="round"
                  className="drop-shadow-[0_0_10px_rgba(101,249,231,0.8)]"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="font-['Sora'] text-3xl font-extrabold text-white">{userProfile.readinessScore}%</span>
                <span className="text-[10px] text-[#65f9e7] font-semibold">READINESS</span>
              </div>
            </div>
            <p className="text-xs text-white/80 font-medium">High CNS Recovery</p>
            <p className="text-[10px] text-white/50 mt-1">HRV: 68 ms | Sleep: 7h 40m</p>
          </div>
        </div>
      </section>

      {/* Quick Metrics Bar */}
      <section className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="glass-panel p-5 rounded-2xl border border-white/60">
          <p className="text-xs text-[#787587] font-semibold uppercase">Daily Streak</p>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-2xl md:text-3xl font-bold text-[#1b1b24]">{userProfile.dailyStreak}</span>
            <span className="text-xs text-[#5340e4] font-bold">days</span>
          </div>
          <p className="text-[11px] text-[#006a61] mt-1 font-medium">Active streak 🔥</p>
        </div>

        <div className="glass-panel p-5 rounded-2xl border border-white/60">
          <p className="text-xs text-[#787587] font-semibold uppercase">Weekly Volume</p>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-2xl md:text-3xl font-bold text-[#1b1b24]">24.5k</span>
            <span className="text-xs text-[#787587] font-semibold">kg</span>
          </div>
          <p className="text-[11px] text-[#5340e4] mt-1 font-medium">+12% vs last week</p>
        </div>

        <div className="glass-panel p-5 rounded-2xl border border-white/60">
          <p className="text-xs text-[#787587] font-semibold uppercase">Top PR Lift</p>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-2xl md:text-3xl font-bold text-[#1b1b24]">{prs[0]?.weightKg || 185}</span>
            <span className="text-xs text-[#787587] font-semibold">kg</span>
          </div>
          <p className="text-[11px] text-[#a53a2d] mt-1 font-medium">{prs[0]?.exercise || 'Deadlift'}</p>
        </div>

        <div className="glass-panel p-5 rounded-2xl border border-white/60">
          <p className="text-xs text-[#787587] font-semibold uppercase">Avg Heart Rate</p>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-2xl md:text-3xl font-bold text-[#1b1b24]">{userProfile.avgHeartRate}</span>
            <span className="text-xs text-[#787587] font-semibold">bpm</span>
          </div>
          <p className="text-[11px] text-[#006a61] mt-1 font-medium">Optimal Cardio Zone</p>
        </div>
      </section>

      {/* Featured Routines */}
      <section className="mt-2">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h2 className="font-['Sora'] text-2xl font-bold text-[#1b1b24]">Recommended Routines</h2>
            <p className="text-xs text-[#474555]">Curated for your current recovery profile</p>
          </div>
          <button
            onClick={() => setActiveTab('workouts')}
            className="text-xs font-bold text-[#5340e4] hover:underline flex items-center gap-1"
          >
            View All Workouts
            <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {routines.map((routine) => (
            <div
              key={routine.id}
              className="glass-panel rounded-3xl overflow-hidden border border-white/60 hover:shadow-xl transition-all duration-300 flex flex-col justify-between group"
            >
              <div className="relative h-44 overflow-hidden">
                <img
                  src={routine.image}
                  alt={routine.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
                <div className="absolute top-3 left-3 flex gap-2">
                  <span className="px-3 py-1 bg-black/50 backdrop-blur-md text-white text-[10px] font-bold rounded-full">
                    {routine.category}
                  </span>
                  <span className="px-3 py-1 bg-[#65f9e7] text-[#00201d] text-[10px] font-bold rounded-full">
                    {routine.difficulty}
                  </span>
                </div>
                <div className="absolute bottom-3 left-3 text-white">
                  <h3 className="font-['Sora'] font-bold text-lg leading-tight">{routine.title}</h3>
                  <p className="text-xs text-white/80 mt-0.5">
                    {routine.estimatedMinutes} mins • {routine.exerciseCount} exercises
                  </p>
                </div>
              </div>

              <div className="p-5 flex-grow flex flex-col justify-between">
                <p className="text-xs text-[#474555] line-clamp-2 leading-relaxed mb-4">
                  {routine.description}
                </p>

                <button
                  onClick={() => {
                    onSelectRoutineToStart(routine);
                    setActiveTab('start');
                  }}
                  className="w-full py-3 rounded-full bg-[#5340e4] text-white font-['Sora'] font-bold text-xs hover:bg-[#6d5dfe] transition-colors flex items-center justify-center gap-2 bg-glow-primary"
                >
                  <span className="material-symbols-outlined text-[18px]">play_arrow</span>
                  Start Routine
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
};
