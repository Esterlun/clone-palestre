import React from 'react';
import { UserProfile } from '../types';

interface SidebarProps {
  user: UserProfile;
  activeTab: 'home' | 'workouts' | 'analytics' | 'profile';
  onSelectTab: (tab: 'home' | 'workouts' | 'analytics' | 'profile') => void;
  onStartSession: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ user, activeTab, onSelectTab, onStartSession }) => {
  return (
    <aside className="fixed left-0 top-0 h-full w-64 z-50 hidden md:flex flex-col bg-[#fcf8ff] shadow-xl py-10 gap-2 border-r border-[#c8c4d8]/20">
      <div className="px-6 mb-8">
        <h2 className="font-bold text-3xl text-[#5340e4] mb-8 tracking-tight">Aura Fit</h2>
        
        <div className="flex flex-col items-start">
          <div className="w-16 h-16 rounded-full overflow-hidden mb-4 border-2 border-[#5340e4]/20 relative shadow-sm">
            <img 
              src={user.sidebarAvatarUrl} 
              alt="User Profile" 
              className="object-cover w-full h-full"
            />
          </div>
          <h3 className="font-semibold text-lg text-[#1b1b24]">{user.name}</h3>
          <p className="text-sm font-medium text-[#5340e4] mt-0.5">{user.title}</p>
          <div className="flex items-center gap-1.5 text-xs font-semibold text-[#474555] mt-2.5 bg-[#f0ecf9] py-1 px-3 rounded-full">
            <span className="material-symbols-outlined text-amber-500 text-sm">local_fire_department</span>
            <span>Daily Streak: {user.streakDays}</span>
          </div>
        </div>
      </div>

      <nav className="flex flex-col flex-grow">
        <button
          onClick={() => onSelectTab('home')}
          className={`flex items-center gap-4 px-6 py-3.5 text-left font-medium transition-all duration-200 ${
            activeTab === 'home'
              ? 'text-[#5340e4] border-r-4 border-[#5340e4] font-bold bg-[#5340e4]/10'
              : 'text-[#474555] hover:bg-[#eae6f4] hover:translate-x-1'
          }`}
        >
          <span className="material-symbols-outlined text-[22px]" style={{ fontVariationSettings: activeTab === 'home' ? "'FILL' 1" : "'FILL' 0" }}>home</span>
          Home
        </button>

        <button
          onClick={() => onSelectTab('workouts')}
          className={`flex items-center gap-4 px-6 py-3.5 text-left font-medium transition-all duration-200 ${
            activeTab === 'workouts'
              ? 'text-[#5340e4] border-r-4 border-[#5340e4] font-bold bg-[#5340e4]/10'
              : 'text-[#474555] hover:bg-[#eae6f4] hover:translate-x-1'
          }`}
        >
          <span className="material-symbols-outlined text-[22px]" style={{ fontVariationSettings: activeTab === 'workouts' ? "'FILL' 1" : "'FILL' 0" }}>fitness_center</span>
          Workouts
        </button>

        <button
          onClick={onStartSession}
          className="flex items-center gap-4 px-6 py-3.5 text-left font-medium text-[#5340e4] hover:bg-[#6d5dfe]/15 transition-all hover:translate-x-1 duration-200"
        >
          <span className="material-symbols-outlined text-[22px]">bolt</span>
          Start Session
        </button>

        <button
          onClick={() => onSelectTab('analytics')}
          className={`flex items-center gap-4 px-6 py-3.5 text-left font-medium transition-all duration-200 ${
            activeTab === 'analytics'
              ? 'text-[#5340e4] border-r-4 border-[#5340e4] font-bold bg-[#5340e4]/10'
              : 'text-[#474555] hover:bg-[#eae6f4] hover:translate-x-1'
          }`}
        >
          <span className="material-symbols-outlined text-[22px]" style={{ fontVariationSettings: activeTab === 'analytics' ? "'FILL' 1" : "'FILL' 0" }}>monitoring</span>
          Analytics
        </button>

        <button
          onClick={() => onSelectTab('profile')}
          className={`flex items-center gap-4 px-6 py-3.5 text-left font-medium transition-all duration-200 ${
            activeTab === 'profile'
              ? 'text-[#5340e4] border-r-4 border-[#5340e4] font-bold bg-[#5340e4]/10'
              : 'text-[#474555] hover:bg-[#eae6f4] hover:translate-x-1'
          }`}
        >
          <span className="material-symbols-outlined text-[22px]" style={{ fontVariationSettings: activeTab === 'profile' ? "'FILL' 1" : "'FILL' 0" }}>person</span>
          User Settings
        </button>
      </nav>
    </aside>
  );
};
