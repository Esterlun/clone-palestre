import React from 'react';
import { X, MoreVertical, Dumbbell } from 'lucide-react';

interface HeaderProps {
  title: string;
  subtitle?: string;
  onClose?: () => void;
  onMenuClick?: () => void;
  showSessionBadge?: boolean;
  elapsedTimeString?: string;
}

export const Header: React.FC<HeaderProps> = ({
  title,
  subtitle = 'ACTIVE SESSION',
  onClose,
  onMenuClick,
  showSessionBadge = true,
  elapsedTimeString
}) => {
  return (
    <>
      {/* Atmospheric Header Gradient from prompt design system */}
      <div className="fixed top-0 left-0 w-full h-48 bg-gradient-to-b from-[#2D1B33] to-transparent z-0 opacity-80 pointer-events-none" />

      {/* Header bar */}
      <header className="fixed top-0 w-full z-40 px-6 py-4 flex justify-between items-center bg-transparent backdrop-blur-sm">
        {onClose ? (
          <button
            onClick={onClose}
            className="w-10 h-10 flex items-center justify-center rounded-full bg-white/60 dark:bg-surface/50 backdrop-blur-md border border-[#c8c4d8]/50 hover:bg-white text-[#1b1b24] transition-colors cursor-pointer shadow-sm"
            title="Chiudi / Minimizza"
            aria-label="Close"
          >
            <X className="w-5 h-5 text-[#1b1b24]" />
          </button>
        ) : (
          <div className="w-10 h-10 flex items-center justify-center rounded-full bg-[#5340e4]/10 text-[#5340e4]">
            <Dumbbell className="w-5 h-5" />
          </div>
        )}

        <div className="flex flex-col items-center text-center">
          {showSessionBadge && (
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#00c2b2] animate-pulse" />
              <span className="font-bold text-[#5441e4] uppercase tracking-widest text-[11px]">
                {subtitle}
              </span>
            </div>
          )}
          <h1 className="font-semibold text-lg md:text-xl text-[#1b1b24] font-sora leading-tight">
            {title}
          </h1>
          {elapsedTimeString && (
            <span className="text-xs text-[#787587] font-medium mt-0.5">
              ⏱ {elapsedTimeString}
            </span>
          )}
        </div>

        <button
          onClick={onMenuClick}
          className="w-10 h-10 flex items-center justify-center rounded-full bg-white/60 backdrop-blur-md border border-[#c8c4d8]/50 hover:bg-white text-[#1b1b24] transition-colors cursor-pointer shadow-sm"
          title="Opzioni"
          aria-label="More options"
        >
          <MoreVertical className="w-5 h-5 text-[#1b1b24]" />
        </button>
      </header>
    </>
  );
};
