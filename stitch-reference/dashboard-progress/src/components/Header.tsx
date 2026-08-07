import React from 'react';
import { UserProfile } from '../types';

interface HeaderProps {
  user: UserProfile;
  onOpenSettings: () => void;
  onOpenProfile: () => void;
}

export const Header: React.FC<HeaderProps> = ({ user, onOpenSettings, onOpenProfile }) => {
  return (
    <header className="fixed top-0 w-full z-40 bg-[#fcf8ff]/80 backdrop-blur-xl flex justify-between items-center px-6 py-4 border-b border-[#c8c4d8]/20">
      <div className="flex items-center gap-4">
        <button 
          onClick={onOpenProfile}
          className="w-10 h-10 rounded-full overflow-hidden border border-[#c8c4d8]/30 relative transition-transform hover:scale-105 active:scale-95"
          title="Open Profile"
        >
          <img 
            src={user.avatarUrl} 
            alt="User profile photo" 
            className="object-cover w-full h-full"
          />
        </button>
        <h1 className="font-bold text-2xl md:text-3xl tracking-tight text-[#5340e4]">
          Aura Fit
        </h1>
      </div>

      <button 
        onClick={onOpenSettings}
        className="w-10 h-10 rounded-full flex items-center justify-center text-[#1b1b24] hover:bg-[#e5e0ee] transition-colors active:scale-95 duration-200"
        aria-label="Settings"
      >
        <span className="material-symbols-outlined text-[24px]">settings</span>
      </button>
    </header>
  );
};
