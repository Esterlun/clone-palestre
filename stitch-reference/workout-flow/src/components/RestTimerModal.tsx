import React, { useEffect, useState } from 'react';
import { Play, Pause, RotateCcw, Volume2, VolumeX, Plus, Minus, X, Minimize2, Maximize2 } from 'lucide-react';
import { sounds } from '../utils/audio';

interface RestTimerModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultTimeSeconds?: number;
}

export const RestTimerModal: React.FC<RestTimerModalProps> = ({
  isOpen,
  onClose,
  defaultTimeSeconds = 90
}) => {
  const [totalSeconds, setTotalSeconds] = useState<number>(defaultTimeSeconds);
  const [secondsLeft, setSecondsLeft] = useState<number>(defaultTimeSeconds);
  const [isRunning, setIsRunning] = useState<boolean>(true);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [isMinimized, setIsMinimized] = useState<boolean>(false);

  useEffect(() => {
    if (isOpen) {
      setTotalSeconds(defaultTimeSeconds);
      setSecondsLeft(defaultTimeSeconds);
      setIsRunning(true);
      setIsMinimized(false);
    }
  }, [isOpen, defaultTimeSeconds]);

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;

    if (isOpen && isRunning && secondsLeft > 0) {
      interval = setInterval(() => {
        setSecondsLeft((prev) => {
          if (prev <= 1) {
            setIsRunning(false);
            if (!isMuted) {
              sounds.playTimerFinished();
            }
            return 0;
          }
          if (prev <= 4 && prev > 1 && !isMuted) {
            sounds.playTick();
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isOpen, isRunning, secondsLeft, isMuted]);

  if (!isOpen) return null;

  const formatTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const remaining = secs % 60;
    return `${mins}:${remaining < 10 ? '0' : ''}${remaining}`;
  };

  const addSeconds = (amount: number) => {
    setSecondsLeft((prev) => Math.max(0, prev + amount));
    setTotalSeconds((prev) => Math.max(prev, secondsLeft + amount));
  };

  const progressPercent = totalSeconds > 0 ? (secondsLeft / totalSeconds) * 100 : 0;

  // Floating Minimized Bar
  if (isMinimized) {
    return (
      <div className="fixed bottom-24 right-4 z-50 bg-[#2d1b33] text-white p-3 rounded-2xl shadow-2xl border border-[#6d5dfe]/40 flex items-center gap-3 animate-slideUp">
        <div className="relative w-9 h-9 flex items-center justify-center">
          <svg className="w-full h-full transform -rotate-90">
            <circle cx="18" cy="18" r="15" stroke="#474555" strokeWidth="3" fill="transparent" />
            <circle
              cx="18"
              cy="18"
              r="15"
              stroke="#65f9e7"
              strokeWidth="3"
              fill="transparent"
              strokeDasharray={2 * Math.PI * 15}
              strokeDashoffset={(2 * Math.PI * 15 * (100 - progressPercent)) / 100}
              className="transition-all duration-300"
            />
          </svg>
          <span className="absolute text-[10px] font-bold">{secondsLeft}s</span>
        </div>

        <div className="flex flex-col">
          <span className="text-[10px] text-[#c8c4d8] uppercase tracking-wider font-bold">Pausa Recupero</span>
          <span className="text-sm font-bold font-sora">{formatTime(secondsLeft)}</span>
        </div>

        <div className="flex items-center gap-1 ml-1">
          <button
            onClick={() => setIsRunning(!isRunning)}
            className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors"
          >
            {isRunning ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
          </button>
          <button
            onClick={() => setIsMinimized(false)}
            className="p-1.5 rounded-lg bg-[#6d5dfe] text-white hover:bg-[#5340e4] transition-colors"
            title="Espandi"
          >
            <Maximize2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    );
  }

  // Full Rest Timer Modal
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-fadeIn">
      <div className="bg-[#fcf8ff] rounded-2xl w-full max-w-sm p-6 shadow-2xl border border-[#c8c4d8]/40 flex flex-col items-center relative text-center">
        {/* Controls top bar */}
        <div className="w-full flex justify-between items-center mb-4">
          <button
            onClick={() => setIsMuted(!isMuted)}
            className="p-2 rounded-full bg-[#f0ecf9] text-[#5340e4] hover:bg-[#eae6f4] transition-colors"
            title={isMuted ? 'Attiva Audio' : 'Disattiva Audio'}
          >
            {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
          </button>

          <span className="font-bold text-xs uppercase tracking-widest text-[#5340e4]">
            Timer di Recupero
          </span>

          <div className="flex items-center gap-1">
            <button
              onClick={() => setIsMinimized(true)}
              className="p-2 rounded-full bg-[#f0ecf9] text-[#1b1b24] hover:bg-[#eae6f4] transition-colors"
              title="Riduci a icona"
            >
              <Minimize2 className="w-4 h-4" />
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-full bg-[#f0ecf9] text-[#1b1b24] hover:bg-[#eae6f4] transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Circular Countdown Gauge */}
        <div className="relative w-48 h-48 my-4 flex items-center justify-center">
          <svg className="w-full h-full transform -rotate-90">
            <circle
              cx="96"
              cy="96"
              r="84"
              stroke="#eae6f4"
              strokeWidth="12"
              fill="transparent"
            />
            <circle
              cx="96"
              cy="96"
              r="84"
              stroke="#6d5dfe"
              strokeWidth="12"
              fill="transparent"
              strokeDasharray={2 * Math.PI * 84}
              strokeDashoffset={(2 * Math.PI * 84 * (100 - progressPercent)) / 100}
              strokeLinecap="round"
              className="transition-all duration-1000 ease-linear glow-active"
            />
          </svg>

          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-4xl font-extrabold font-sora text-[#1b1b24]">
              {formatTime(secondsLeft)}
            </span>
            <span className="text-xs text-[#787587] font-medium mt-1">
              {secondsLeft === 0 ? 'Recupero Completato!' : 'Riposati e respira'}
            </span>
          </div>
        </div>

        {/* Quick Adjust Buttons */}
        <div className="flex items-center gap-3 my-4">
          <button
            onClick={() => addSeconds(-10)}
            className="px-3 py-2 rounded-xl bg-[#f0ecf9] text-[#1b1b24] hover:bg-[#eae6f4] font-semibold text-xs flex items-center gap-1 transition-colors"
          >
            <Minus className="w-3.5 h-3.5" /> 10s
          </button>
          <button
            onClick={() => addSeconds(30)}
            className="px-3 py-2 rounded-xl bg-[#5340e4]/10 text-[#5340e4] hover:bg-[#5340e4]/20 font-bold text-xs flex items-center gap-1 transition-colors"
          >
            <Plus className="w-3.5 h-3.5" /> 30s
          </button>
          <button
            onClick={() => {
              setSecondsLeft(90);
              setTotalSeconds(90);
            }}
            className="px-3 py-2 rounded-xl bg-[#f0ecf9] text-[#1b1b24] hover:bg-[#eae6f4] font-semibold text-xs transition-colors"
          >
            90s
          </button>
        </div>

        {/* Action Controls */}
        <div className="w-full flex gap-3 mt-2">
          <button
            onClick={() => {
              setSecondsLeft(totalSeconds);
              setIsRunning(true);
            }}
            className="p-3.5 rounded-xl bg-[#eae6f4] text-[#1b1b24] hover:bg-[#e5e0ee] flex items-center justify-center transition-colors"
            title="Azzera"
          >
            <RotateCcw className="w-5 h-5" />
          </button>

          <button
            onClick={() => setIsRunning(!isRunning)}
            className="flex-1 py-3.5 rounded-xl bg-[#6d5dfe] text-white font-bold text-sm shadow-md hover:bg-[#5340e4] transition-colors flex items-center justify-center gap-2 glow-button"
          >
            {isRunning ? (
              <>
                <Pause className="w-5 h-5" /> Pausa
              </>
            ) : (
              <>
                <Play className="w-5 h-5 fill-white" /> Riprendi
              </>
            )}
          </button>

          <button
            onClick={onClose}
            className="px-4 py-3.5 rounded-xl bg-[#006a61]/10 text-[#006a61] font-bold text-xs hover:bg-[#006a61]/20 transition-colors"
          >
            Salta
          </button>
        </div>
      </div>
    </div>
  );
};
