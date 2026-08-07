import React from 'react';
import { RecoveryMetric } from '../types';

interface RecoveryDetailModalProps {
  recovery: RecoveryMetric;
  onClose: () => void;
}

export const RecoveryDetailModal: React.FC<RecoveryDetailModalProps> = ({ recovery, onClose }) => {
  return (
    <div className="fixed inset-0 z-50 bg-[#1b1b24]/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-md rounded-3xl p-6 shadow-2xl border border-[#c8c4d8]/30">
        <div className="flex justify-between items-center mb-5">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#6d5dfe] text-2xl">battery_charging_full</span>
            <h3 className="font-bold text-xl text-[#1b1b24]">Recovery Analysis</h3>
          </div>
          <button 
            onClick={onClose}
            className="w-8 h-8 rounded-full hover:bg-[#eae6f4] flex items-center justify-center text-[#474555]"
          >
            <span className="material-symbols-outlined text-lg">close</span>
          </button>
        </div>

        {/* Big score indicator */}
        <div className="bg-[#1A1B2E] text-white rounded-2xl p-6 text-center relative overflow-hidden mb-5">
          <div className="absolute -top-12 -right-12 w-40 h-40 bg-[#6d5dfe]/30 rounded-full blur-2xl"></div>
          <span className="text-xs font-semibold text-[#65f9e7] uppercase tracking-wider block mb-1">
            Overall Readiness
          </span>
          <span className="text-5xl font-extrabold text-white block">{recovery.score}%</span>
          <span className="text-sm text-[#c5c0ff] mt-1 block font-medium">{recovery.statusText}</span>
        </div>

        {/* Biometrics breakdown grid */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          <div className="bg-[#f6f1ff] p-4 rounded-2xl border border-[#c8c4d8]/20">
            <span className="text-xs text-[#787587] font-semibold block uppercase">Sleep Duration</span>
            <span className="text-xl font-bold text-[#1b1b24]">{recovery.sleepHours} hrs</span>
            <span className="text-[11px] text-[#006a61] font-semibold block mt-0.5">Optimal Deep Sleep</span>
          </div>

          <div className="bg-[#f6f1ff] p-4 rounded-2xl border border-[#c8c4d8]/20">
            <span className="text-xs text-[#787587] font-semibold block uppercase">Heart Rate Var.</span>
            <span className="text-xl font-bold text-[#1b1b24]">{recovery.hrvMs} ms</span>
            <span className="text-[11px] text-[#5340e4] font-semibold block mt-0.5">+5 ms vs baseline</span>
          </div>

          <div className="bg-[#f6f1ff] p-4 rounded-2xl border border-[#c8c4d8]/20">
            <span className="text-xs text-[#787587] font-semibold block uppercase">Resting HR</span>
            <span className="text-xl font-bold text-[#1b1b24]">{recovery.restingHeartRate} bpm</span>
            <span className="text-[11px] text-[#006a61] font-semibold block mt-0.5">Low Stress</span>
          </div>

          <div className="bg-[#f6f1ff] p-4 rounded-2xl border border-[#c8c4d8]/20">
            <span className="text-xs text-[#787587] font-semibold block uppercase">Muscle Soreness</span>
            <span className="text-xl font-bold text-[#1b1b24]">{recovery.muscleSoreness}</span>
            <span className="text-[11px] text-[#006a61] font-semibold block mt-0.5">Ready for Pull Day</span>
          </div>
        </div>

        <button
          onClick={onClose}
          className="w-full bg-[#5340e4] hover:bg-[#402dcd] text-white font-bold py-3 rounded-2xl shadow-md transition-all cursor-pointer"
        >
          Got It
        </button>
      </div>
    </div>
  );
};
