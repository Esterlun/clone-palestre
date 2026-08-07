import React from 'react';
import { ActiveTab, UserProfile } from '../types';

interface NavigationProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  userProfile: UserProfile;
  onOpenQuickStart?: () => void;
}

export const Navigation: React.FC<NavigationProps> = ({
  activeTab,
  setActiveTab,
  userProfile,
  onOpenQuickStart,
}) => {
  return (
    <>
      {/* Mobile Top App Bar */}
      <header className="fixed top-0 w-full z-40 bg-[#fcf8ff]/85 backdrop-blur-md flex justify-between items-center px-6 py-4 md:hidden border-b border-[#e5e0ee]/40 transition-transform duration-200">
        <div className="flex items-center gap-3">
          <img
            className="w-10 h-10 rounded-full object-cover shadow-sm ring-2 ring-[#5340e4]/20"
            src={userProfile.avatarUrl}
            alt={userProfile.name}
          />
          <span className="font-['Sora'] text-2xl font-bold tracking-tighter text-[#5340e4]">
            Aura Fit
          </span>
        </div>
        <button
          onClick={() => setActiveTab('settings')}
          className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-[#eae6f4] transition-colors text-[#5340e4] active:scale-95"
          aria-label="Settings"
        >
          <span className="material-symbols-outlined">settings</span>
        </button>
      </header>

      {/* Desktop Navigation Drawer */}
      <nav className="fixed left-0 top-0 h-full w-64 z-50 hidden md:flex flex-col bg-white shadow-2xl py-10 gap-2 border-r border-[#e5e0ee]/60">
        <div className="px-6 mb-8">
          <span className="font-['Sora'] text-4xl font-extrabold text-[#5340e4] tracking-tighter">
            Aura Fit
          </span>
        </div>

        <div className="px-6 mb-8 flex items-center gap-4">
          <img
            className="w-12 h-12 rounded-full object-cover shadow-md border border-[#5340e4]/20"
            src={userProfile.avatarUrl}
            alt={userProfile.name}
          />
          <div>
            <h3 className="font-['Sora'] text-[16px] font-semibold text-[#1b1b24] leading-tight">
              {userProfile.name}
            </h3>
            <p className="font-['Sora'] text-xs text-[#474555] font-medium">{userProfile.role}</p>
            <p className="font-['Sora'] text-[11px] text-[#5340e4] font-semibold mt-1 flex items-center gap-1">
              <span className="material-symbols-outlined text-[12px] text-[#5340e4]">local_fire_department</span>
              Daily Streak: {userProfile.dailyStreak}
            </p>
          </div>
        </div>

        <div className="flex flex-col gap-1.5 flex-grow">
          <button
            onClick={() => setActiveTab('home')}
            className={`flex items-center gap-4 px-6 py-3.5 transition-all duration-200 w-full text-left font-['Sora'] text-sm ${
              activeTab === 'home'
                ? 'text-[#5340e4] border-r-4 border-[#5340e4] font-bold bg-[#f6f1ff]/70'
                : 'text-[#474555] hover:bg-[#eae6f4] hover:translate-x-1'
            }`}
          >
            <span className={`material-symbols-outlined ${activeTab === 'home' ? 'fill text-[#5340e4]' : ''}`}>
              home
            </span>
            <span className="text-[15px]">Home</span>
          </button>

          <button
            onClick={() => setActiveTab('workouts')}
            className={`flex items-center gap-4 px-6 py-3.5 transition-all duration-200 w-full text-left font-['Sora'] text-sm ${
              activeTab === 'workouts'
                ? 'text-[#5340e4] border-r-4 border-[#5340e4] font-bold bg-[#f6f1ff]/70'
                : 'text-[#474555] hover:bg-[#eae6f4] hover:translate-x-1'
            }`}
          >
            <span className={`material-symbols-outlined ${activeTab === 'workouts' ? 'fill text-[#5340e4]' : ''}`}>
              fitness_center
            </span>
            <span className="text-[15px]">Workouts</span>
          </button>

          <button
            onClick={() => setActiveTab('start')}
            className={`flex items-center gap-4 px-6 py-3.5 transition-all duration-200 w-full text-left font-['Sora'] text-sm ${
              activeTab === 'start'
                ? 'text-[#5340e4] border-r-4 border-[#5340e4] font-bold bg-[#f6f1ff]/70'
                : 'text-[#474555] hover:bg-[#eae6f4] hover:translate-x-1'
            }`}
          >
            <span className={`material-symbols-outlined ${activeTab === 'start' ? 'fill text-[#5340e4]' : ''}`}>
              bolt
            </span>
            <span className="text-[15px]">Start Session</span>
          </button>

          <button
            onClick={() => setActiveTab('analytics')}
            className={`flex items-center gap-4 px-6 py-3.5 transition-all duration-200 w-full text-left font-['Sora'] text-sm ${
              activeTab === 'analytics'
                ? 'text-[#5340e4] border-r-4 border-[#5340e4] font-bold bg-[#f6f1ff]/70'
                : 'text-[#474555] hover:bg-[#eae6f4] hover:translate-x-1'
            }`}
          >
            <span className={`material-symbols-outlined ${activeTab === 'analytics' ? 'fill text-[#5340e4]' : ''}`}>
              monitoring
            </span>
            <span className="text-[15px]">Analytics</span>
          </button>

          <button
            onClick={() => setActiveTab('settings')}
            className={`flex items-center gap-4 px-6 py-3.5 transition-all duration-200 w-full text-left font-['Sora'] text-sm ${
              activeTab === 'settings'
                ? 'text-[#5340e4] border-r-4 border-[#5340e4] font-bold bg-[#f6f1ff]/70'
                : 'text-[#474555] hover:bg-[#eae6f4] hover:translate-x-1'
            }`}
          >
            <span className={`material-symbols-outlined ${activeTab === 'settings' ? 'fill text-[#5340e4]' : ''}`}>
              person
            </span>
            <span className="text-[15px]">User Settings</span>
          </button>
        </div>

        {/* Bottom Drawer Callout */}
        <div className="px-6 pt-4">
          <div className="p-4 rounded-2xl bg-[#6d5dfe]/10 border border-[#6d5dfe]/20 text-center">
            <p className="font-['Sora'] text-xs font-semibold text-[#5340e4]">Readiness Score</p>
            <p className="font-['Sora'] text-2xl font-bold text-[#1b1b24] my-1">{userProfile.readinessScore}%</p>
            <p className="font-['Sora'] text-[10px] text-[#474555]">Prime recovery state for heavy sets</p>
          </div>
        </div>
      </nav>

      {/* Mobile Bottom Nav Bar */}
      <nav className="fixed bottom-0 w-full z-50 h-20 bg-[#fcf8ff]/90 backdrop-blur-2xl bg-[#f6f1ff]/80 shadow-[0_-8px_30px_rgba(109,93,254,0.12)] flex justify-around items-center px-4 md:hidden border-t border-[#e5e0ee]/50">
        <button
          onClick={() => setActiveTab('home')}
          className={`flex flex-col items-center justify-center gap-1 w-16 transition-all duration-200 ${
            activeTab === 'home' ? 'text-[#5340e4] font-bold' : 'text-[#474555]/70 hover:text-[#5340e4]'
          }`}
        >
          <span className={`material-symbols-outlined text-[24px] ${activeTab === 'home' ? 'fill' : ''}`}>home</span>
          <span className="font-['Sora'] text-[10px]">Home</span>
        </button>

        <button
          onClick={() => setActiveTab('workouts')}
          className={`flex flex-col items-center justify-center gap-1 w-16 transition-all duration-200 ${
            activeTab === 'workouts' ? 'text-[#5340e4] font-bold' : 'text-[#474555]/70 hover:text-[#5340e4]'
          }`}
        >
          <span className={`material-symbols-outlined text-[24px] ${activeTab === 'workouts' ? 'fill' : ''}`}>fitness_center</span>
          <span className="font-['Sora'] text-[10px]">Workouts</span>
        </button>

        <button
          onClick={() => {
            if (onOpenQuickStart) onOpenQuickStart();
            setActiveTab('start');
          }}
          className="flex flex-col items-center justify-center gap-1 w-16 -mt-5"
          aria-label="Start Workout"
        >
          <div className="w-12 h-12 bg-[#6d5dfe] text-white rounded-full flex items-center justify-center shadow-lg bg-glow-primary active:scale-95 transition-transform">
            <span className="material-symbols-outlined text-[28px]">add</span>
          </div>
          <span className="font-['Sora'] text-[10px] text-[#5340e4] font-semibold mt-0.5">Start</span>
        </button>

        <button
          onClick={() => setActiveTab('analytics')}
          className={`flex flex-col items-center justify-center gap-1 w-16 transition-all duration-200 ${
            activeTab === 'analytics' ? 'text-[#5340e4] font-bold' : 'text-[#474555]/70 hover:text-[#5340e4]'
          }`}
        >
          <span className={`material-symbols-outlined text-[24px] ${activeTab === 'analytics' ? 'fill' : ''}`}>insights</span>
          <span className="font-['Sora'] text-[10px]">Progress</span>
        </button>

        <button
          onClick={() => setActiveTab('settings')}
          className={`flex flex-col items-center justify-center gap-1 w-16 transition-all duration-200 ${
            activeTab === 'settings' ? 'text-[#5340e4] font-bold' : 'text-[#474555]/70 hover:text-[#5340e4]'
          }`}
        >
          <span className={`material-symbols-outlined text-[24px] ${activeTab === 'settings' ? 'fill' : ''}`}>person</span>
          <span className="font-['Sora'] text-[10px]">Profile</span>
        </button>
      </nav>
    </>
  );
};
