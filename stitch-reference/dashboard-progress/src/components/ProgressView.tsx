import React, { useState } from 'react';
import { WeightRecord, BodyFatRecord } from '../types';

interface ProgressViewProps {
  weightRecords: WeightRecord[];
  bodyFatRecords: BodyFatRecord[];
  unit: 'kg' | 'lbs';
}

export const ProgressView: React.FC<ProgressViewProps> = ({
  weightRecords,
  bodyFatRecords,
  unit
}) => {
  const [metricTab, setMetricTab] = useState<'weight' | 'bodyFat'>('weight');

  // Convert weights if lbs selected
  const weights = weightRecords.map(r => ({
    ...r,
    value: unit === 'lbs' ? r.weightKg * 2.20462 : r.weightKg
  }));

  const minWeight = Math.min(...weights.map(w => w.value));
  const maxWeight = Math.max(...weights.map(w => w.value));
  const weightRange = Math.max(maxWeight - minWeight, 1);

  const minBf = Math.min(...bodyFatRecords.map(b => b.bodyFatPercentage));
  const maxBf = Math.max(...bodyFatRecords.map(b => b.bodyFatPercentage));
  const bfRange = Math.max(maxBf - minBf, 0.5);

  return (
    <div className="space-y-6">
      {/* Analytics Banner */}
      <div className="bg-[#1A1B2E] rounded-3xl p-6 md:p-8 text-white relative overflow-hidden border border-white/10 shadow-lg">
        <div className="absolute -top-20 -right-20 w-64 h-64 bg-[#65f9e7]/20 rounded-full blur-3xl pointer-events-none"></div>
        <div className="relative z-10">
          <span className="text-xs font-semibold text-[#65f9e7] uppercase tracking-wider">Body & Volume Progression</span>
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-white mt-1">
            Analytics & Progress
          </h2>
          <p className="text-sm text-[#c5c0ff] mt-1 max-w-lg">
            Track body composition changes, volume progressive overload, and milestone personal records.
          </p>
        </div>
      </div>

      {/* Metric Selector Tabs */}
      <div className="flex bg-[#e5e0ee] p-1 rounded-2xl max-w-xs">
        <button
          onClick={() => setMetricTab('weight')}
          className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all ${
            metricTab === 'weight'
              ? 'bg-white text-[#5340e4] shadow-sm'
              : 'text-[#474555] hover:text-[#1b1b24]'
          }`}
        >
          Peso ({unit})
        </button>
        <button
          onClick={() => setMetricTab('bodyFat')}
          className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all ${
            metricTab === 'bodyFat'
              ? 'bg-white text-[#c55243] shadow-sm'
              : 'text-[#474555] hover:text-[#1b1b24]'
          }`}
        >
          Massa Grassa (%)
        </button>
      </div>

      {/* Main Chart Card */}
      <div className="bg-white rounded-3xl p-6 md:p-8 border border-[#c8c4d8]/20 shadow-xs">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h3 className="font-bold text-xl text-[#1b1b24]">
              {metricTab === 'weight' ? `Weight Trend (${unit})` : 'Body Fat Trend (%)'}
            </h3>
            <p className="text-xs text-[#787587]">Last 30 days recorded entries</p>
          </div>

          <div className="text-right">
            <span className="text-2xl font-bold text-[#1b1b24]">
              {metricTab === 'weight'
                ? `${weights[weights.length - 1].value.toFixed(1)} ${unit}`
                : `${bodyFatRecords[bodyFatRecords.length - 1].bodyFatPercentage.toFixed(1)}%`}
            </span>
            <span className="block text-xs font-semibold text-[#006a61]">
              ↓ Consistent Deficit
            </span>
          </div>
        </div>

        {/* SVG Trend Line Graph */}
        <div className="relative w-full h-48 pt-4 pb-6">
          <svg className="w-full h-full overflow-visible">
            {/* Grid lines */}
            <line x1="0" y1="0%" x2="100%" y2="0%" stroke="#e5e0ee" strokeWidth="1" strokeDasharray="4 4" />
            <line x1="0" y1="50%" x2="100%" y2="50%" stroke="#e5e0ee" strokeWidth="1" strokeDasharray="4 4" />
            <line x1="0" y1="100%" x2="100%" y2="100%" stroke="#e5e0ee" strokeWidth="1" />

            {/* Render chart line points */}
            {metricTab === 'weight' ? (
              (() => {
                const points = weights.map((w, idx) => {
                  const x = (idx / (weights.length - 1)) * 100;
                  const y = 100 - ((w.value - minWeight) / weightRange) * 80 - 10;
                  return `${x}%,${y}%`;
                }).join(' ');

                return (
                  <>
                    <polyline
                      fill="none"
                      stroke="#5340e4"
                      strokeWidth="3.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      points={points}
                    />
                    {weights.map((w, idx) => {
                      const cx = `${(idx / (weights.length - 1)) * 100}%`;
                      const cy = `${100 - ((w.value - minWeight) / weightRange) * 80 - 10}%`;
                      return (
                        <g key={idx}>
                          <circle cx={cx} cy={cy} r="6" fill="#5340e4" stroke="#ffffff" strokeWidth="2" />
                          <text x={cx} y={cy} dy="-12" textAnchor="middle" className="text-[10px] font-bold fill-[#5340e4]">
                            {w.value.toFixed(1)}
                          </text>
                        </g>
                      );
                    })}
                  </>
                );
              })()
            ) : (
              (() => {
                const points = bodyFatRecords.map((bf, idx) => {
                  const x = (idx / (bodyFatRecords.length - 1)) * 100;
                  const y = 100 - ((bf.bodyFatPercentage - minBf) / bfRange) * 80 - 10;
                  return `${x}%,${y}%`;
                }).join(' ');

                return (
                  <>
                    <polyline
                      fill="none"
                      stroke="#c55243"
                      strokeWidth="3.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      points={points}
                    />
                    {bodyFatRecords.map((bf, idx) => {
                      const cx = `${(idx / (bodyFatRecords.length - 1)) * 100}%`;
                      const cy = `${100 - ((bf.bodyFatPercentage - minBf) / bfRange) * 80 - 10}%`;
                      return (
                        <g key={idx}>
                          <circle cx={cx} cy={cy} r="6" fill="#c55243" stroke="#ffffff" strokeWidth="2" />
                          <text x={cx} y={cy} dy="-12" textAnchor="middle" className="text-[10px] font-bold fill-[#c55243]">
                            {bf.bodyFatPercentage.toFixed(1)}%
                          </text>
                        </g>
                      );
                    })}
                  </>
                );
              })()
            )}
          </svg>
        </div>

        {/* Dates row */}
        <div className="flex justify-between text-xs text-[#787587] font-medium pt-2 border-t border-[#e5e0ee]">
          {(metricTab === 'weight' ? weightRecords : bodyFatRecords).map((r, i) => (
            <span key={i}>{r.date.slice(5)}</span>
          ))}
        </div>
      </div>

      {/* Muscle Group Split Breakdown */}
      <div className="bg-white rounded-3xl p-6 border border-[#c8c4d8]/20 shadow-xs">
        <h3 className="font-bold text-xl text-[#1b1b24] mb-4">Muscle Group Split</h3>
        
        <div className="space-y-3">
          {[
            { group: 'Back (Lat & Traps)', pct: 35, color: 'bg-[#5340e4]' },
            { group: 'Chest (Pectorals)', pct: 25, color: 'bg-[#6d5dfe]' },
            { group: 'Legs (Quads & Hams)', pct: 20, color: 'bg-[#006a61]' },
            { group: 'Biceps & Forearms', pct: 12, color: 'bg-[#65f9e7]' },
            { group: 'Core Stabilization', pct: 8, color: 'bg-[#c55243]' },
          ].map((item, index) => (
            <div key={index} className="space-y-1">
              <div className="flex justify-between text-xs font-semibold text-[#1b1b24]">
                <span>{item.group}</span>
                <span>{item.pct}%</span>
              </div>
              <div className="w-full bg-[#f6f1ff] h-2.5 rounded-full overflow-hidden">
                <div className={`h-full ${item.color} rounded-full`} style={{ width: `${item.pct}%` }}></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
