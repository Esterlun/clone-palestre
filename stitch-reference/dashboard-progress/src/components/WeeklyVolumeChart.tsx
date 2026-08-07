import React, { useState } from 'react';
import { DayVolume } from '../types';

interface WeeklyVolumeChartProps {
  volumeData: DayVolume[];
}

export const WeeklyVolumeChart: React.FC<WeeklyVolumeChartProps> = ({ volumeData }) => {
  const [selectedDay, setSelectedDay] = useState<DayVolume | null>(
    volumeData.find(d => d.isToday) || volumeData[3]
  );

  const maxVolume = Math.max(...volumeData.map(d => d.volumeKg), 15000);

  return (
    <section className="bg-[#f6f1ff] rounded-3xl p-6 md:p-8 border border-[#c8c4d8]/30 mb-8 shadow-xs">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h3 className="font-semibold text-2xl text-[#1b1b24] tracking-tight">Weekly Volume</h3>
          {selectedDay && (
            <p className="text-xs font-medium text-[#5340e4] mt-0.5">
              {selectedDay.fullDay}: <span className="font-bold">{selectedDay.volumeKg.toLocaleString()} kg</span> • {selectedDay.workoutName}
            </p>
          )}
        </div>

        <button 
          className="w-9 h-9 rounded-full border border-[#c8c4d8]/50 flex items-center justify-center text-[#474555] hover:bg-[#e5e0ee] transition-colors"
          title="Volume Options"
        >
          <span className="material-symbols-outlined text-lg">more_horiz</span>
        </button>
      </div>

      {/* Bar Chart Container */}
      <div className="relative w-full h-36 flex items-end justify-between px-2 pb-4 border-b border-[#e5e0ee]">
        {/* Background Grid Lines */}
        <div className="absolute inset-0 flex flex-col justify-between pointer-events-none opacity-20">
          <div className="w-full border-t border-[#787587]"></div>
          <div className="w-full border-t border-[#787587]"></div>
          <div className="w-full border-t border-[#787587]"></div>
        </div>

        {/* Chart Bars */}
        {volumeData.map((d, index) => {
          const heightPct = Math.round((d.volumeKg / maxVolume) * 100);
          const isSelected = selectedDay?.fullDay === d.fullDay;

          return (
            <div 
              key={index}
              onClick={() => setSelectedDay(d)}
              className="group relative flex flex-col items-center cursor-pointer"
            >
              {/* Tooltip on hover */}
              <div className="absolute -top-10 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-[#312f39] text-[#f3effc] text-[11px] font-medium py-1 px-2.5 rounded shadow-md pointer-events-none whitespace-nowrap z-20">
                {d.fullDay}: {d.volumeKg.toLocaleString()} kg
              </div>

              {/* Bar */}
              <div 
                className={`w-7 md:w-9 rounded-t-md transition-all duration-300 ${
                  d.isToday 
                    ? 'bg-[#65f9e7] shadow-[0_0_15px_rgba(101,249,231,0.6)]' 
                    : isSelected 
                    ? 'bg-[#6d5dfe]' 
                    : 'bg-[#e5e0ee] hover:bg-[#c5c0ff]'
                }`}
                style={{ height: `${Math.max(heightPct, 8)}%` }}
              ></div>
            </div>
          );
        })}
      </div>

      {/* Day Labels */}
      <div className="flex justify-between mt-3 px-2 text-xs font-medium text-[#474555]">
        {volumeData.map((d, index) => (
          <span 
            key={index} 
            className={`w-7 md:w-9 text-center font-bold transition-colors ${
              d.isToday ? 'text-[#006a61] font-bold text-sm' : selectedDay?.fullDay === d.fullDay ? 'text-[#5340e4]' : ''
            }`}
          >
            {d.day}
          </span>
        ))}
      </div>
    </section>
  );
};
