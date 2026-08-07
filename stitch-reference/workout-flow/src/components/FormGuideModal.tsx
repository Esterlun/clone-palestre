import React from 'react';
import { X, Play, CheckCircle2, AlertCircle, Dumbbell } from 'lucide-react';
import { Exercise } from '../types';

interface FormGuideModalProps {
  exercise: Exercise;
  isOpen: boolean;
  onClose: () => void;
}

export const FormGuideModal: React.FC<FormGuideModalProps> = ({ exercise, isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-fadeIn">
      <div
        className="bg-[#fcf8ff] rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto shadow-2xl border border-[#c8c4d8]/40 flex flex-col relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="sticky top-0 z-20 bg-[#fcf8ff]/90 backdrop-blur-md px-6 py-4 border-b border-[#e5e0ee] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-lg bg-[#5340e4]/10 text-[#5340e4]">
              <Dumbbell className="w-5 h-5" />
            </span>
            <div>
              <h2 className="font-bold text-lg text-[#1b1b24] font-sora">{exercise.name}</h2>
              <p className="text-xs text-[#787587]">Guida alla Forma e Tecnica</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-[#eae6f4] hover:bg-[#e5e0ee] flex items-center justify-center transition-colors text-[#1b1b24]"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-6 space-y-6">
          {/* Media Banner */}
          <div className="relative rounded-xl overflow-hidden border border-[#c8c4d8]/30 shadow-md aspect-video bg-black/10">
            <img
              src={exercise.imageUrl}
              alt={exercise.name}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent flex items-end p-4">
              <div className="flex items-center gap-2 text-white bg-black/40 backdrop-blur-md px-3 py-1.5 rounded-full text-xs font-semibold">
                <Play className="w-3.5 h-3.5 fill-white text-white" />
                <span>Forma Corretta</span>
              </div>
            </div>
          </div>

          {/* Description */}
          <p className="text-sm text-[#474555] leading-relaxed">
            {exercise.description}
          </p>

          {/* Target Muscles */}
          <div className="space-y-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#787587]">Muscoli Coinvolti</h3>
            <div className="flex flex-wrap gap-2">
              {exercise.primaryMuscles.map((m, idx) => (
                <span key={idx} className="px-3 py-1 rounded-full bg-[#5340e4]/15 text-[#5340e4] text-xs font-semibold">
                  🎯 Primario: {m}
                </span>
              ))}
              {exercise.secondaryMuscles.map((m, idx) => (
                <span key={idx} className="px-3 py-1 rounded-full bg-[#65f9e7]/30 text-[#006a61] text-xs font-semibold">
                  ⚡ Secondario: {m}
                </span>
              ))}
            </div>
          </div>

          {/* Instructions */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#787587]">Esecuzione Passo-Passo</h3>
            <div className="space-y-2.5">
              {exercise.instructions.map((step, idx) => (
                <div key={idx} className="flex gap-3 items-start bg-white p-3 rounded-xl border border-[#c8c4d8]/30 shadow-xs">
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-[#6d5dfe] text-white font-bold text-xs flex items-center justify-center">
                    {idx + 1}
                  </span>
                  <p className="text-xs text-[#1b1b24] leading-normal pt-0.5">{step}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Pro Tips */}
          <div className="bg-[#f0ecf9] rounded-xl p-4 border border-[#5340e4]/20 space-y-2">
            <div className="flex items-center gap-2 text-[#5340e4] font-bold text-xs uppercase tracking-wider">
              <CheckCircle2 className="w-4 h-4" />
              <span>Consigli dei Pro per la Massima Resa</span>
            </div>
            <ul className="space-y-1.5 pl-6 list-disc text-xs text-[#474555]">
              {exercise.tips.map((tip, idx) => (
                <li key={idx}>{tip}</li>
              ))}
            </ul>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-[#e5e0ee] bg-[#fcf8ff] flex justify-end">
          <button
            onClick={onClose}
            className="w-full py-3 rounded-xl bg-[#6d5dfe] text-white font-bold text-sm shadow-md hover:bg-[#5340e4] transition-colors"
          >
            Ho Capito, Torna al Workout
          </button>
        </div>
      </div>
    </div>
  );
};
