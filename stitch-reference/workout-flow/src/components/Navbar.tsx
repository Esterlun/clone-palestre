import React from 'react';
import { Play, Dumbbell, BookOpen, History } from 'lucide-react';

export type TabType = 'active' | 'routines' | 'exercises' | 'history';

interface NavbarProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
  hasActiveSession?: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  onTabChange,
  hasActiveSession = true
}) => {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-[#fcf8ff]/95 backdrop-blur-lg border-t border-[#c8c4d8]/40 px-4 py-2 flex justify-around items-center max-w-2xl mx-auto rounded-t-2xl shadow-lg">
      <button
        onClick={() => onTabChange('active')}
        className={`flex flex-col items-center gap-1 py-1 px-3 rounded-xl transition-all cursor-pointer ${
          activeTab === 'active'
            ? 'text-[#5340e4] font-bold'
            : 'text-[#787587] hover:text-[#1b1b24]'
        }`}
      >
        <div className="relative">
          <Play className={`w-5 h-5 ${activeTab === 'active' ? 'fill-[#5340e4]' : ''}`} />
          {hasActiveSession && (
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-[#00c2b2] rounded-full border-2 border-white animate-pulse" />
          )}
        </div>
        <span className="text-[10px] tracking-tight">Sessione</span>
      </button>

      <button
        onClick={() => onTabChange('routines')}
        className={`flex flex-col items-center gap-1 py-1 px-3 rounded-xl transition-all cursor-pointer ${
          activeTab === 'routines'
            ? 'text-[#5340e4] font-bold'
            : 'text-[#787587] hover:text-[#1b1b24]'
        }`}
      >
        <Dumbbell className="w-5 h-5" />
        <span className="text-[10px] tracking-tight">Schede</span>
      </button>

      <button
        onClick={() => onTabChange('exercises')}
        className={`flex flex-col items-center gap-1 py-1 px-3 rounded-xl transition-all cursor-pointer ${
          activeTab === 'exercises'
            ? 'text-[#5340e4] font-bold'
            : 'text-[#787587] hover:text-[#1b1b24]'
        }`}
      >
        <BookOpen className="w-5 h-5" />
        <span className="text-[10px] tracking-tight">Libreria</span>
      </button>

      <button
        onClick={() => onTabChange('history')}
        className={`flex flex-col items-center gap-1 py-1 px-3 rounded-xl transition-all cursor-pointer ${
          activeTab === 'history'
            ? 'text-[#5340e4] font-bold'
            : 'text-[#787587] hover:text-[#1b1b24]'
        }`}
      >
        <History className="w-5 h-5" />
        <span className="text-[10px] tracking-tight">Storico</span>
      </button>
    </nav>
  );
};
