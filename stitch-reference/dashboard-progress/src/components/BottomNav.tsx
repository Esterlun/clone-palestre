import React from 'react';

interface BottomNavProps {
  activeTab: 'home' | 'workouts' | 'analytics' | 'profile';
  onSelectTab: (tab: 'home' | 'workouts' | 'analytics' | 'profile') => void;
  onStartSession: () => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({ activeTab, onSelectTab, onStartSession }) => {
  return (
    <nav className="fixed bottom-0 left-0 right-0 w-full z-50 h-20 bg-[#f6f1ff]/90 backdrop-blur-2xl border-t border-[#c8c4d8]/30 shadow-[0_-8px_30px_rgba(109,93,254,0.12)] flex justify-around items-center px-4 max-w-md mx-auto md:hidden">
      <button 
        onClick={() => onSelectTab('home')}
        className={`flex flex-col items-center justify-center transition-transform active:scale-90 duration-200 ${
          activeTab === 'home' ? 'text-[#5340e4] font-bold' : 'text-[#474555]/70 hover:text-[#5340e4]'
        }`}
      >
        <span className="material-symbols-outlined mb-0.5 text-[24px]" style={{ fontVariationSettings: activeTab === 'home' ? "'FILL' 1" : "'FILL' 0" }}>home</span>
        <span className="text-[12px] leading-tight font-medium">Home</span>
      </button>

      <button 
        onClick={() => onSelectTab('workouts')}
        className={`flex flex-col items-center justify-center transition-transform active:scale-90 duration-200 ${
          activeTab === 'workouts' ? 'text-[#5340e4] font-bold' : 'text-[#474555]/70 hover:text-[#5340e4]'
        }`}
      >
        <span className="material-symbols-outlined mb-0.5 text-[24px]" style={{ fontVariationSettings: activeTab === 'workouts' ? "'FILL' 1" : "'FILL' 0" }}>fitness_center</span>
        <span className="text-[12px] leading-tight font-medium">Workouts</span>
      </button>

      <button 
        onClick={onStartSession}
        className="flex flex-col items-center justify-center relative -top-3 group"
        title="Start Active Workout"
      >
        <div className="w-13 h-13 rounded-full bg-gradient-to-tr from-[#5340e4] to-[#6d5dfe] text-white flex items-center justify-center shadow-lg shadow-[#5340e4]/40 group-active:scale-95 transition-transform duration-200 border-2 border-white">
          <span className="material-symbols-outlined text-3xl">add</span>
        </div>
      </button>

      <button 
        onClick={() => onSelectTab('analytics')}
        className={`flex flex-col items-center justify-center transition-transform active:scale-90 duration-200 ${
          activeTab === 'analytics' ? 'text-[#5340e4] font-bold' : 'text-[#474555]/70 hover:text-[#5340e4]'
        }`}
      >
        <span className="material-symbols-outlined mb-0.5 text-[24px]" style={{ fontVariationSettings: activeTab === 'analytics' ? "'FILL' 1" : "'FILL' 0" }}>insights</span>
        <span className="text-[12px] leading-tight font-medium">Progress</span>
      </button>

      <button 
        onClick={() => onSelectTab('profile')}
        className={`flex flex-col items-center justify-center transition-transform active:scale-90 duration-200 ${
          activeTab === 'profile' ? 'text-[#5340e4] font-bold' : 'text-[#474555]/70 hover:text-[#5340e4]'
        }`}
      >
        <span className="material-symbols-outlined mb-0.5 text-[24px]" style={{ fontVariationSettings: activeTab === 'profile' ? "'FILL' 1" : "'FILL' 0" }}>person</span>
        <span className="text-[12px] leading-tight font-medium">Profile</span>
      </button>
    </nav>
  );
};
