import React from 'react';
import { RecoveryMetric } from '../types';

interface MetricsRowProps {
  currentWeight: number;
  currentBodyFat: number;
  recovery: RecoveryMetric;
  unit: 'kg' | 'lbs';
  onOpenWeightModal: () => void;
  onOpenBodyFatModal: () => void;
  onOpenRecoveryModal: () => void;
}

export const MetricsRow: React.FC<MetricsRowProps> = ({
  currentWeight,
  currentBodyFat,
  recovery,
  unit,
  onOpenWeightModal,
  onOpenBodyFatModal,
  onOpenRecoveryModal
}) => {
  const displayWeight = unit === 'lbs' ? (currentWeight * 2.20462).toFixed(1) : currentWeight.toFixed(1);

  return (
    <section className="grid grid-cols-2 md:grid-cols-3 gap-4">
      {/* Weight Metric Card */}
      <div 
        onClick={onOpenWeightModal}
        className="bg-white rounded-2xl p-5 border border-[#c8c4d8]/20 shadow-sm relative overflow-hidden group cursor-pointer hover:border-[#5340e4]/40 transition-all duration-300"
      >
        <div className="absolute top-0 right-0 w-24 h-24 bg-[#65f9e7]/10 rounded-full blur-2xl group-hover:bg-[#65f9e7]/25 transition-all duration-500"></div>
        <div className="flex items-center gap-2 mb-3 text-[#474555]">
          <span className="material-symbols-outlined text-[#006a61] text-[20px]" style={{ fontVariationSettings: "'FILL' 1" }}>monitor_weight</span>
          <span className="text-xs font-semibold uppercase tracking-wider text-[#474555]">PESO</span>
        </div>

        <div className="flex items-baseline gap-1">
          <span className="font-semibold text-3xl text-[#1b1b24]">{displayWeight}</span>
          <span className="text-base text-[#474555] font-medium">{unit}</span>
        </div>

        <div className="mt-3 flex items-center gap-1 text-xs font-medium text-[#006a61]">
          <span className="material-symbols-outlined text-sm">arrow_downward</span>
          <span>0.5 {unit} this week</span>
        </div>
      </div>

      {/* Body Fat Metric Card */}
      <div 
        onClick={onOpenBodyFatModal}
        className="bg-white rounded-2xl p-5 border border-[#c8c4d8]/20 shadow-sm relative overflow-hidden group cursor-pointer hover:border-[#c55243]/40 transition-all duration-300"
      >
        <div className="absolute top-0 right-0 w-24 h-24 bg-[#c55243]/10 rounded-full blur-2xl group-hover:bg-[#c55243]/20 transition-all duration-500"></div>
        <div className="flex items-center gap-2 mb-3 text-[#474555]">
          <span className="material-symbols-outlined text-[#c55243] text-[20px]" style={{ fontVariationSettings: "'FILL' 1" }}>water_drop</span>
          <span className="text-xs font-semibold uppercase tracking-wider text-[#474555]">MASSA GRASSA</span>
        </div>

        <div className="flex items-baseline gap-1">
          <span className="font-semibold text-3xl text-[#1b1b24]">{currentBodyFat.toFixed(1)}</span>
          <span className="text-base text-[#474555] font-medium">%</span>
        </div>

        <div className="mt-3 flex items-center gap-1 text-xs font-medium text-[#c55243]">
          <span className="material-symbols-outlined text-sm">arrow_downward</span>
          <span>0.2% this week</span>
        </div>
      </div>

      {/* Recovery Status Card */}
      <div 
        onClick={onOpenRecoveryModal}
        className="col-span-2 md:col-span-1 bg-[#eae6f4]/80 rounded-2xl p-5 border border-[#c8c4d8]/20 relative overflow-hidden flex flex-col justify-between cursor-pointer hover:border-[#5340e4]/40 transition-all duration-300 group"
      >
        <div className="flex justify-between items-start mb-2">
          <span className="text-xs font-semibold uppercase tracking-wider text-[#474555]">RECOVERY</span>
          <span className="material-symbols-outlined text-[#6d5dfe] text-[22px]">battery_charging_full</span>
        </div>

        <div>
          <span className="font-semibold text-3xl text-[#1b1b24] block mb-0.5">{recovery.score}%</span>
          <span className="text-sm text-[#474555] font-medium block">{recovery.statusText}</span>
        </div>

        <div className="w-full h-2 bg-[#dcd8e5] rounded-full mt-4 overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-[#6d5dfe] to-[#5441e4] rounded-full transition-all duration-500"
            style={{ width: `${recovery.score}%` }}
          ></div>
        </div>
      </div>
    </section>
  );
};
