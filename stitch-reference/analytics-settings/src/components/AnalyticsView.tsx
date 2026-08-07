import React, { useState } from 'react';
import { PRRecord, TimePeriod, UserProfile, VolumeDataPoint, AICoachResponse } from '../types';
import { motion, AnimatePresence } from 'motion/react';

interface AnalyticsViewProps {
  userProfile: UserProfile;
  prs: PRRecord[];
  volumeData: VolumeDataPoint[];
  onAddPR: (pr: PRRecord) => void;
}

export const AnalyticsView: React.FC<AnalyticsViewProps> = ({
  userProfile,
  prs,
  volumeData,
  onAddPR,
}) => {
  const [selectedPeriod, setSelectedPeriod] = useState<TimePeriod>('this_week');
  const [metricType, setMetricType] = useState<'volume' | 'sets' | 'reps'>('volume');
  const [activePointIndex, setActivePointIndex] = useState<number>(6); // Default Sunday
  const [selectedPRIndex, setSelectedPRIndex] = useState<number>(0);
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [isAddPRModalOpen, setIsAddPRModalOpen] = useState(false);
  
  // AI Coach state
  const [aiCoach, setAiCoach] = useState<AICoachResponse | null>(null);
  const [isLoadingAI, setIsLoadingAI] = useState(false);

  // Form state for adding PR
  const [newExercise, setNewExercise] = useState('Deadlift');
  const [newWeight, setNewWeight] = useState(190);
  const [newIncrement, setNewIncrement] = useState(5);
  const [newCategory, setNewCategory] = useState<'Lower Body' | 'Upper Body' | 'Core' | 'Olympic'>('Lower Body');

  const activeDataPoint = volumeData[activePointIndex] || volumeData[volumeData.length - 1];
  const activePR = prs[selectedPRIndex] || prs[0];

  const handleFetchAICoach = async () => {
    setIsLoadingAI(true);
    try {
      const res = await fetch('/api/ai/coach', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userMetrics: {
            volume: activeDataPoint.volumeKg * 2,
            pr: `${activePR.exercise} ${activePR.weightKg} kg`,
            avgHr: userProfile.avgHeartRate,
            activeTime: `${Math.floor(userProfile.activeMinutes / 60)}h ${userProfile.activeMinutes % 60}m`,
            energy: userProfile.energyKcal,
            streak: userProfile.dailyStreak,
          },
          question: 'Analyze my performance this week and recommend today\'s target focus.',
        }),
      });
      const data = await res.json();
      setAiCoach(data);
    } catch (e) {
      console.error(e);
      setAiCoach({
        advice: 'Volume load is up 12% week-over-week. Recovery metrics align with high CNS readiness.',
        readinessScore: 92,
        recommendation: 'Target Heavy Lower Body power work (85% 1RM) with 2-minute rest sets.',
        keyTips: ['Maintain electrolyte balance', 'Keep warm-up ramps gradual'],
      });
    } finally {
      setIsLoadingAI(false);
    }
  };

  const handleCreatePR = (e: React.FormEvent) => {
    e.preventDefault();
    const newPrObj: PRRecord = {
      id: `pr-${Date.now()}`,
      exercise: newExercise,
      weightKg: Number(newWeight),
      date: new Date().toISOString().split('T')[0],
      incrementKg: Number(newIncrement),
      previousKg: Number(newWeight) - Number(newIncrement),
      category: newCategory,
    };
    onAddPR(newPrObj);
    setIsAddPRModalOpen(false);
    setSelectedPRIndex(0);
  };

  const handleExportData = () => {
    const csvContent = "data:text/csv;charset=utf-8," +
      "Day,Volume_KG,Sets,Peak_Exercise\n" +
      volumeData.map(v => `${v.day},${v.volumeKg},${v.setsCount},"${v.peakExercise}"`).join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `aura_fit_analytics_${selectedPeriod}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Convert points for SVG rendering
  // Max volume approx 14,000 for scaling
  const points = volumeData.map((d, i) => {
    const x = (i / (volumeData.length - 1)) * 100;
    // inverse y for SVG (0 is top, 100 is bottom)
    const val = metricType === 'volume' ? d.volumeKg : d.setsCount * 250;
    const y = 90 - (val / 14000) * 80;
    return { x, y, day: d.shortDay, data: d };
  });

  const pathD = points.reduce((acc, p, i) => {
    if (i === 0) return `M ${p.x},${p.y}`;
    // smooth curve
    const prev = points[i - 1];
    const cx1 = prev.x + (p.x - prev.x) / 2;
    const cy1 = prev.y;
    const cx2 = prev.x + (p.x - prev.x) / 2;
    const cy2 = p.y;
    return `${acc} C ${cx1},${cy1} ${cx2},${cy2} ${p.x},${p.y}`;
  }, '');

  const areaD = `${pathD} L 100,100 L 0,100 Z`;

  return (
    <main className="pt-24 pb-28 px-6 md:pl-[calc(256px+40px)] md:pr-10 md:pt-12 md:pb-12 max-w-[1600px] mx-auto min-h-screen flex flex-col gap-10">
      {/* Header Section */}
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 w-full">
        <div className="w-full md:w-2/3">
          <div className="flex items-center gap-2 mb-2">
            <span className="px-3 py-1 rounded-full bg-[#5340e4]/10 text-[#5340e4] text-xs font-bold uppercase tracking-wider">
              Weekly Overview
            </span>
            <span className="text-xs text-[#787587] font-medium">Updated 5m ago</span>
          </div>
          <h1 className="font-['Sora'] text-3xl md:text-5xl font-bold text-[#1b1b24] tracking-tight mb-2">
            Performance Analytics
          </h1>
          <p className="font-['Sora'] text-base md:text-lg text-[#474555] max-w-2xl leading-relaxed">
            Your weekly breakdown. Volume is up, recovery metrics are stable. Ready to push.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={() => setIsExportModalOpen(true)}
            className="px-6 py-3 rounded-full bg-[#eae6f4] text-[#1b1b24] font-['Sora'] font-bold text-sm hover:bg-[#f0ecf9] transition-colors border border-[#c8c4d8]/30 flex items-center gap-2 active:scale-95"
          >
            <span className="material-symbols-outlined text-[18px]">download</span>
            Export
          </button>

          {/* Period dropdown */}
          <div className="relative group">
            <button className="px-6 py-3 rounded-full bg-[#6d5dfe] text-white font-['Sora'] font-bold text-sm hover:opacity-90 transition-opacity bg-glow-primary flex items-center gap-2 shadow-lg">
              <span className="material-symbols-outlined text-[18px]">calendar_month</span>
              {selectedPeriod === 'this_week' && 'This Week'}
              {selectedPeriod === 'last_week' && 'Last Week'}
              {selectedPeriod === 'last_month' && 'Last Month'}
              {selectedPeriod === 'ytd' && 'Year to Date'}
              <span className="material-symbols-outlined text-[18px]">expand_more</span>
            </button>

            <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-2xl shadow-xl border border-[#e5e0ee] py-2 z-30 hidden group-hover:block transition-all">
              <button
                onClick={() => setSelectedPeriod('this_week')}
                className={`w-full text-left px-4 py-2.5 text-xs font-['Sora'] font-semibold hover:bg-[#f6f1ff] ${selectedPeriod === 'this_week' ? 'text-[#5340e4]' : 'text-[#1b1b24]'}`}
              >
                This Week (Mon-Sun)
              </button>
              <button
                onClick={() => setSelectedPeriod('last_week')}
                className={`w-full text-left px-4 py-2.5 text-xs font-['Sora'] font-semibold hover:bg-[#f6f1ff] ${selectedPeriod === 'last_week' ? 'text-[#5340e4]' : 'text-[#1b1b24]'}`}
              >
                Last Week
              </button>
              <button
                onClick={() => setSelectedPeriod('last_month')}
                className={`w-full text-left px-4 py-2.5 text-xs font-['Sora'] font-semibold hover:bg-[#f6f1ff] ${selectedPeriod === 'last_month' ? 'text-[#5340e4]' : 'text-[#1b1b24]'}`}
              >
                Last Month
              </button>
              <button
                onClick={() => setSelectedPeriod('ytd')}
                className={`w-full text-left px-4 py-2.5 text-xs font-['Sora'] font-semibold hover:bg-[#f6f1ff] ${selectedPeriod === 'ytd' ? 'text-[#5340e4]' : 'text-[#1b1b24]'}`}
              >
                Year to Date
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Bento Grid Layout */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-8 auto-rows-min">
        {/* Main Chart Area (Spans 8 cols on desktop) */}
        <div className="md:col-span-8 bg-[#E9E8F0] rounded-3xl p-6 md:p-8 flex flex-col relative overflow-hidden group shadow-sm border border-[#c8c4d8]/20">
          {/* Decorative background blur elements */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-[#e4dfff] opacity-40 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-[#65f9e7] opacity-25 rounded-full blur-2xl translate-y-1/3 -translate-x-1/3 pointer-events-none"></div>

          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8 relative z-10">
            <div>
              <h2 className="font-['Sora'] text-xl md:text-2xl font-semibold text-[#1b1b24] mb-1">
                Volume Load Progression
              </h2>
              <p className="font-['Sora'] text-sm text-[#474555]">
                {selectedPeriod === 'this_week' ? 'Last 7 Days vs Previous' : 'Historical Load Trend'}
              </p>
            </div>

            <div className="flex items-center gap-2 bg-white/80 backdrop-blur-sm px-3.5 py-1.5 rounded-full border border-white/50 shadow-xs">
              <button
                onClick={() => setMetricType('volume')}
                className={`flex items-center gap-1.5 text-xs font-['Sora'] font-semibold px-2 py-0.5 rounded-full transition-colors ${
                  metricType === 'volume' ? 'bg-[#6d5dfe] text-white' : 'text-[#474555] hover:text-[#1b1b24]'
                }`}
              >
                <span className={`w-2 h-2 rounded-full ${metricType === 'volume' ? 'bg-white' : 'bg-[#6d5dfe]'}`}></span>
                Total KG
              </button>
              <button
                onClick={() => setMetricType('sets')}
                className={`flex items-center gap-1.5 text-xs font-['Sora'] font-semibold px-2 py-0.5 rounded-full transition-colors ${
                  metricType === 'sets' ? 'bg-[#6d5dfe] text-white' : 'text-[#474555] hover:text-[#1b1b24]'
                }`}
              >
                Sets
              </button>
            </div>
          </div>

          {/* Interactive Chart Area */}
          <div className="flex-grow w-full h-[320px] relative z-10 flex flex-col justify-end pt-8">
            {/* Y Axis Labels */}
            <div className="absolute left-0 top-0 h-full flex flex-col justify-between text-[11px] font-['Sora'] text-[#787587] pb-10 pt-2 font-medium">
              <span>{metricType === 'volume' ? '12k' : '30'}</span>
              <span>{metricType === 'volume' ? '9k' : '22'}</span>
              <span>{metricType === 'volume' ? '6k' : '15'}</span>
              <span>{metricType === 'volume' ? '3k' : '8'}</span>
              <span>0</span>
            </div>

            {/* Horizontal Grid Lines */}
            <div className="absolute left-8 right-0 top-2 h-[calc(100%-2.5rem)] flex flex-col justify-between z-0 pointer-events-none">
              <div className="w-full h-px bg-[#c8c4d8]/30"></div>
              <div className="w-full h-px bg-[#c8c4d8]/30"></div>
              <div className="w-full h-px bg-[#c8c4d8]/30"></div>
              <div className="w-full h-px bg-[#c8c4d8]/30"></div>
              <div className="w-full h-px bg-[#c8c4d8]/30"></div>
            </div>

            {/* Chart SVG Canvas */}
            <div className="absolute left-8 right-4 bottom-10 top-2 z-10">
              <svg className="w-full h-full overflow-visible" preserveAspectRatio="none" viewBox="0 0 100 100">
                <defs>
                  <linearGradient id="chartGradient" x1="0%" x2="0%" y1="0%" y2="100%">
                    <stop offset="0%" stopColor="#6d5dfe" stopOpacity="0.45"></stop>
                    <stop offset="100%" stopColor="#6d5dfe" stopOpacity="0.0"></stop>
                  </linearGradient>
                  <linearGradient id="lineGradient" x1="0%" x2="100%" y1="0%" y2="0%">
                    <stop offset="0%" stopColor="#5340e4"></stop>
                    <stop offset="100%" stopColor="#65f9e7"></stop>
                  </linearGradient>
                </defs>

                {/* Area under curve */}
                <path d={areaD} fill="url(#chartGradient)"></path>

                {/* Electric Periwinkle to Teal Smooth Line */}
                <path
                  className="drop-shadow-[0_0_10px_rgba(109,93,254,0.6)]"
                  d={pathD}
                  fill="none"
                  stroke="url(#lineGradient)"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="3.5"
                ></path>

                {/* Interactive Points */}
                {points.map((pt, idx) => {
                  const isActive = idx === activePointIndex;
                  return (
                    <g key={pt.day} className="cursor-pointer" onClick={() => setActivePointIndex(idx)}>
                      <circle
                        cx={pt.x}
                        cy={pt.y}
                        r={isActive ? "5" : "3"}
                        fill={isActive ? "#65f9e7" : "#ffffff"}
                        stroke="#5340e4"
                        strokeWidth={isActive ? "2.5" : "1.8"}
                        className="transition-all duration-200 hover:scale-125 drop-shadow-md"
                      />
                      {isActive && (
                        <circle
                          cx={pt.x}
                          cy={pt.y}
                          r="9"
                          fill="none"
                          stroke="#65f9e7"
                          strokeWidth="1.5"
                          className="animate-ping opacity-75"
                        />
                      )}
                    </g>
                  );
                })}
              </svg>

              {/* Hover/Active Tooltip */}
              <div
                className="absolute z-30 transition-all duration-300 pointer-events-none"
                style={{
                  left: `${Math.min(Math.max(points[activePointIndex]?.x || 0, 10), 85)}%`,
                  top: `${Math.max((points[activePointIndex]?.y || 0) - 20, 5)}%`,
                  transform: 'translate(-50%, -100%)',
                }}
              >
                <div className="bg-[#1a1b2e] text-white p-3 rounded-2xl shadow-2xl border border-white/20 text-xs font-['Sora'] whitespace-nowrap backdrop-blur-md">
                  <div className="flex items-center justify-between gap-3 mb-1">
                    <span className="text-[#65f9e7] font-bold">{activeDataPoint.day}</span>
                    <span className="text-[10px] text-white/60">{activeDataPoint.setsCount} sets</span>
                  </div>
                  <div className="text-base font-extrabold text-white">
                    {activeDataPoint.volumeKg.toLocaleString()} kg
                  </div>
                  <div className="text-[10px] text-white/70 mt-0.5">
                    Peak: <span className="text-white font-medium">{activeDataPoint.peakExercise}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* X Axis Labels */}
            <div className="w-full flex justify-between px-2 ml-6 relative z-20 mt-auto pt-2 border-t border-[#c8c4d8]/20">
              {volumeData.map((d, i) => (
                <button
                  key={d.day}
                  onClick={() => setActivePointIndex(i)}
                  className={`text-xs font-['Sora'] font-semibold transition-all px-2 py-1 rounded-lg ${
                    i === activePointIndex
                      ? 'text-[#5340e4] bg-white font-bold shadow-xs scale-105'
                      : 'text-[#787587] hover:text-[#1b1b24]'
                  }`}
                >
                  {d.shortDay}
                </button>
              ))}
            </div>
          </div>

          {/* Active Day Detail Strip */}
          <div className="mt-6 pt-4 border-t border-[#c8c4d8]/30 flex flex-wrap items-center justify-between gap-4 text-xs font-['Sora']">
            <div className="flex items-center gap-3">
              <span className="w-2.5 h-2.5 rounded-full bg-[#65f9e7]"></span>
              <span className="font-semibold text-[#1b1b24]">
                {activeDataPoint.day} Load Summary:
              </span>
              <span className="text-[#474555]">
                <strong className="text-[#5340e4]">{activeDataPoint.volumeKg.toLocaleString()} kg</strong> lifted across {activeDataPoint.setsCount} working sets.
              </span>
            </div>
            <div className="flex items-center gap-2 text-[#5340e4] font-bold">
              <span className="material-symbols-outlined text-[16px]">trending_up</span>
              +14% vs Previous Week
            </div>
          </div>
        </div>

        {/* Deep Indigo Highlight Card (Spans 4 cols on desktop) */}
        <div className="md:col-span-4 dark-glass-panel rounded-3xl p-6 md:p-8 flex flex-col justify-between relative overflow-hidden bg-glow-primary shadow-2xl border border-white/10 min-h-[380px]">
          {/* Atmospheric glow */}
          <div className="absolute top-0 right-0 w-40 h-40 bg-[#6d5dfe] opacity-40 blur-[50px] rounded-full mix-blend-screen pointer-events-none"></div>
          <div className="absolute bottom-0 left-0 w-32 h-32 bg-[#65f9e7] opacity-20 blur-[40px] rounded-full pointer-events-none"></div>

          <div className="relative z-10 flex justify-between items-start mb-6">
            <div className="w-12 h-12 rounded-full bg-[#5340e4]/30 border border-[#5340e4]/40 flex items-center justify-center text-[#c5c0ff] shadow-inner">
              <span className="material-symbols-outlined text-[24px]">military_tech</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 bg-white/10 backdrop-blur-md rounded-full text-[10px] font-['Sora'] font-bold text-[#e4dfff] tracking-wider uppercase border border-white/10">
                New PR
              </span>
              <button
                onClick={() => setIsAddPRModalOpen(true)}
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors"
                title="Log new PR"
              >
                <span className="material-symbols-outlined text-[18px]">add</span>
              </button>
            </div>
          </div>

          {/* PR Selector Carousel if multiple */}
          <div className="relative z-10 my-auto">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-['Sora'] text-[#c5c0ff] font-medium uppercase tracking-wider">
                {activePR.category} Record
              </span>
              <div className="flex gap-1">
                {prs.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedPRIndex(idx)}
                    className={`w-2 h-2 rounded-full transition-all ${
                      idx === selectedPRIndex ? 'bg-[#65f9e7] w-4' : 'bg-white/30'
                    }`}
                  />
                ))}
              </div>
            </div>

            <h3 className="font-['Sora'] text-2xl md:text-3xl font-semibold text-white/80 mb-2">
              {activePR.exercise}
            </h3>

            <div className="flex items-baseline gap-2 my-2">
              <span className="font-['Sora'] text-5xl md:text-6xl font-extrabold text-white tracking-tighter text-glow-primary">
                {activePR.weightKg}
              </span>
              <span className="font-['Sora'] text-xl text-white/50 font-medium">kg</span>
            </div>

            <p className="font-['Sora'] text-sm text-[#65f9e7] font-semibold mt-3 flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[18px]">trending_up</span>
              +{activePR.incrementKg}kg from last record ({activePR.previousKg}kg)
            </p>

            {activePR.notes && (
              <p className="font-['Sora'] text-xs text-white/60 italic mt-2 line-clamp-2">
                "{activePR.notes}"
              </p>
            )}
          </div>

          <div className="relative z-10 pt-4 border-t border-white/10 flex items-center justify-between text-xs text-white/60 font-['Sora']">
            <span>Achieved on {activePR.date}</span>
            <button
              onClick={() => setSelectedPRIndex((selectedPRIndex + 1) % prs.length)}
              className="text-[#65f9e7] hover:underline font-semibold flex items-center gap-1"
            >
              Next PR
              <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
            </button>
          </div>
        </div>

        {/* Secondary Stats Grid (Spans 12 cols, contains 3 smaller cards) */}
        <div className="md:col-span-12 grid grid-cols-1 sm:grid-cols-3 gap-6 md:gap-8 mt-2">
          {/* Misty Ivory Card 1: AVG HR */}
          <div className="glass-panel rounded-2xl p-6 flex items-center gap-6 hover:shadow-xl transition-all duration-300 border border-white/60 relative group">
            <div className="relative">
              <svg className="w-16 h-16 transform -rotate-90">
                <circle cx="32" cy="32" fill="none" r="28" stroke="#e5e0ee" strokeWidth="6"></circle>
                <circle
                  className="drop-shadow-[0_0_6px_rgba(101,249,231,0.5)]"
                  cx="32"
                  cy="32"
                  fill="none"
                  r="28"
                  stroke="url(#tealGradient)"
                  strokeDasharray="175"
                  strokeDashoffset="40"
                  strokeLinecap="round"
                  strokeWidth="6"
                ></circle>
                <defs>
                  <linearGradient id="tealGradient" x1="0%" x2="100%" y1="0%" y2="100%">
                    <stop offset="0%" stopColor="#006a61"></stop>
                    <stop offset="100%" stopColor="#65f9e7"></stop>
                  </linearGradient>
                </defs>
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="material-symbols-outlined text-[#006a61] text-[24px] animate-pulse">favorite</span>
              </div>
            </div>

            <div>
              <p className="font-['Sora'] text-xs font-semibold text-[#474555] uppercase tracking-widest mb-1">
                AVG HR
              </p>
              <div className="flex items-baseline gap-1.5">
                <span className="font-['Sora'] text-3xl font-extrabold text-[#1b1b24]">
                  {userProfile.avgHeartRate}
                </span>
                <span className="font-['Sora'] text-xs text-[#787587] font-semibold">bpm</span>
              </div>
              <p className="font-['Sora'] text-[11px] text-[#007167] font-medium mt-1">
                Zone 3: Aerobic Endurance
              </p>
            </div>
          </div>

          {/* Misty Ivory Card 2: ENERGY */}
          <div className="glass-panel rounded-2xl p-6 flex items-center gap-6 hover:shadow-xl transition-all duration-300 border border-white/60 relative group">
            <div className="relative">
              <svg className="w-16 h-16 transform -rotate-90">
                <circle cx="32" cy="32" fill="none" r="28" stroke="#e5e0ee" strokeWidth="6"></circle>
                <circle
                  className="drop-shadow-[0_0_6px_rgba(165,58,45,0.4)]"
                  cx="32"
                  cy="32"
                  fill="none"
                  r="28"
                  stroke="url(#plumGradient)"
                  strokeDasharray="175"
                  strokeDashoffset="65"
                  strokeLinecap="round"
                  strokeWidth="6"
                ></circle>
                <defs>
                  <linearGradient id="plumGradient" x1="0%" x2="100%" y1="0%" y2="100%">
                    <stop offset="0%" stopColor="#a53a2d"></stop>
                    <stop offset="100%" stopColor="#ffb4a8"></stop>
                  </linearGradient>
                </defs>
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="material-symbols-outlined text-[#a53a2d] text-[24px]">local_fire_department</span>
              </div>
            </div>

            <div>
              <p className="font-['Sora'] text-xs font-semibold text-[#474555] uppercase tracking-widest mb-1">
                ENERGY
              </p>
              <div className="flex items-baseline gap-1.5">
                <span className="font-['Sora'] text-3xl font-extrabold text-[#1b1b24]">
                  {(userProfile.energyKcal / 1000).toFixed(1)}k
                </span>
                <span className="font-['Sora'] text-xs text-[#787587] font-semibold">kcal</span>
              </div>
              <p className="font-['Sora'] text-[11px] text-[#a53a2d] font-medium mt-1">
                +450 kcal vs Daily Goal
              </p>
            </div>
          </div>

          {/* Highlight Card 3: ACTIVE TIME */}
          <div className="bg-[#eae6f4] border border-[#c8c4d8]/30 rounded-2xl p-6 flex flex-col justify-center hover:bg-[#dcd8e5] transition-colors duration-300 relative group shadow-xs">
            <div className="flex justify-between items-start mb-2">
              <p className="font-['Sora'] text-xs font-semibold text-[#474555] uppercase tracking-widest">
                ACTIVE TIME
              </p>
              <span className="material-symbols-outlined text-[#6d5dfe] text-[20px]">timer</span>
            </div>

            <div className="flex items-baseline gap-1">
              <span className="font-['Sora'] text-3xl font-extrabold text-[#1b1b24]">
                {Math.floor(userProfile.activeMinutes / 60)}h {userProfile.activeMinutes % 60}m
              </span>
            </div>

            <div className="w-full bg-[#c8c4d8]/40 h-2 rounded-full mt-3 overflow-hidden">
              <div className="bg-[#6d5dfe] h-full rounded-full w-[85%] transition-all duration-500"></div>
            </div>
            <p className="font-['Sora'] text-[11px] text-[#5340e4] font-semibold mt-2">
              85% of Weekly Active Goal (8h)
            </p>
          </div>
        </div>

        {/* AI Performance Coach Section */}
        <div className="md:col-span-12 mt-4 bg-gradient-to-r from-[#5340e4] to-[#6d5dfe] text-white rounded-3xl p-6 md:p-8 shadow-xl relative overflow-hidden">
          <div className="absolute right-0 top-0 w-80 h-80 bg-[#65f9e7] opacity-20 blur-3xl pointer-events-none"></div>

          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
            <div className="flex items-start gap-4">
              <div className="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center text-[#65f9e7] shrink-0 border border-white/30 shadow-md">
                <span className="material-symbols-outlined text-[32px]">auto_awesome</span>
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-['Sora'] text-xs font-bold uppercase tracking-wider text-[#65f9e7]">
                    Aura AI Performance Coach
                  </span>
                  <span className="bg-white/20 text-white text-[10px] px-2 py-0.5 rounded-full font-medium">
                    Gemini Powered
                  </span>
                </div>
                <h3 className="font-['Sora'] text-xl md:text-2xl font-bold">
                  Instant Load & Readiness Advisor
                </h3>
                <p className="font-['Sora'] text-sm text-white/80 mt-1 max-w-xl">
                  Get real-time AI guidance based on your 12.4k volume load, 142 bpm average heart rate, and PR trends.
                </p>
              </div>
            </div>

            <button
              onClick={handleFetchAICoach}
              disabled={isLoadingAI}
              className="px-6 py-3.5 rounded-full bg-[#65f9e7] text-[#00201d] font-['Sora'] font-extrabold text-sm hover:brightness-105 transition-all shadow-lg shrink-0 flex items-center justify-center gap-2 active:scale-95 disabled:opacity-60"
            >
              {isLoadingAI ? (
                <>
                  <span className="material-symbols-outlined animate-spin text-[20px]">sync</span>
                  Analyzing Metrics...
                </>
              ) : (
                <>
                  <span className="material-symbols-outlined text-[20px]">psychology</span>
                  Generate AI Insight
                </>
              )}
            </button>
          </div>

          {/* AI Response Display */}
          <AnimatePresence>
            {aiCoach && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="mt-6 pt-6 border-t border-white/20 relative z-10"
              >
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/15">
                    <p className="text-xs text-[#65f9e7] font-bold uppercase mb-1">Recovery Advice</p>
                    <p className="text-sm text-white leading-relaxed">{aiCoach.advice}</p>
                  </div>

                  <div className="bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/15">
                    <p className="text-xs text-[#65f9e7] font-bold uppercase mb-1">Target Focus</p>
                    <p className="text-sm font-semibold text-white">{aiCoach.recommendation}</p>
                    <div className="mt-2 text-xs text-white/70">
                      Readiness Index: <span className="text-[#65f9e7] font-bold">{aiCoach.readinessScore}/100</span>
                    </div>
                  </div>

                  <div className="bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/15">
                    <p className="text-xs text-[#65f9e7] font-bold uppercase mb-1">Pro Tips</p>
                    <ul className="text-xs text-white/90 space-y-1.5 list-disc list-inside">
                      {aiCoach.keyTips?.map((tip, i) => (
                        <li key={i}>{tip}</li>
                      )) || <li>Keep hydration high during heavy compound sets</li>}
                    </ul>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Export Preview Modal */}
      {isExportModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 md:p-8 max-w-md w-full shadow-2xl border border-[#e5e0ee]">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-['Sora'] text-xl font-bold text-[#1b1b24]">Export Analytics</h3>
              <button
                onClick={() => setIsExportModalOpen(false)}
                className="w-8 h-8 rounded-full bg-[#eae6f4] flex items-center justify-center text-[#1b1b24]"
              >
                <span className="material-symbols-outlined text-[18px]">close</span>
              </button>
            </div>
            <p className="text-sm text-[#474555] mb-4">
              Download your full weekly volume breakdown, exercise peak loads, and heart rate metrics in CSV format.
            </p>
            <div className="bg-[#f6f1ff] p-4 rounded-2xl border border-[#e5e0ee] text-xs font-mono text-[#1b1b24] mb-6 overflow-x-auto">
              <div>Period: {selectedPeriod}</div>
              <div>Data Points: {volumeData.length} Days</div>
              <div>Peak Volume: {Math.max(...volumeData.map(v => v.volumeKg))} kg</div>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setIsExportModalOpen(false)}
                className="w-1/2 py-3 rounded-full bg-[#eae6f4] text-[#1b1b24] font-bold text-sm"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  handleExportData();
                  setIsExportModalOpen(false);
                }}
                className="w-1/2 py-3 rounded-full bg-[#5340e4] text-white font-bold text-sm bg-glow-primary"
              >
                Download CSV
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add PR Record Modal */}
      {isAddPRModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <form onSubmit={handleCreatePR} className="bg-white rounded-3xl p-6 md:p-8 max-w-md w-full shadow-2xl border border-[#e5e0ee]">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-['Sora'] text-xl font-bold text-[#1b1b24]">Log New Personal Record</h3>
              <button
                type="button"
                onClick={() => setIsAddPRModalOpen(false)}
                className="w-8 h-8 rounded-full bg-[#eae6f4] flex items-center justify-center text-[#1b1b24]"
              >
                <span className="material-symbols-outlined text-[18px]">close</span>
              </button>
            </div>

            <div className="space-y-4 text-sm font-['Sora']">
              <div>
                <label className="block text-xs font-semibold text-[#474555] mb-1">Exercise Name</label>
                <input
                  type="text"
                  required
                  value={newExercise}
                  onChange={e => setNewExercise(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-[#c8c4d8] focus:border-[#5340e4] outline-none"
                  placeholder="e.g. Conventional Deadlift"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-[#474555] mb-1">Weight ({userProfile.unit})</label>
                  <input
                    type="number"
                    required
                    value={newWeight}
                    onChange={e => setNewWeight(Number(e.target.value))}
                    className="w-full px-4 py-2.5 rounded-xl border border-[#c8c4d8] focus:border-[#5340e4] outline-none font-bold"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#474555] mb-1">Increment ({userProfile.unit})</label>
                  <input
                    type="number"
                    required
                    value={newIncrement}
                    onChange={e => setNewIncrement(Number(e.target.value))}
                    className="w-full px-4 py-2.5 rounded-xl border border-[#c8c4d8] focus:border-[#5340e4] outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#474555] mb-1">Category</label>
                <select
                  value={newCategory}
                  onChange={e => setNewCategory(e.target.value as any)}
                  className="w-full px-4 py-2.5 rounded-xl border border-[#c8c4d8] focus:border-[#5340e4] outline-none"
                >
                  <option value="Lower Body">Lower Body</option>
                  <option value="Upper Body">Upper Body</option>
                  <option value="Core">Core</option>
                  <option value="Olympic">Olympic</option>
                </select>
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                type="button"
                onClick={() => setIsAddPRModalOpen(false)}
                className="w-1/2 py-3 rounded-full bg-[#eae6f4] text-[#1b1b24] font-bold text-sm"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="w-1/2 py-3 rounded-full bg-[#5340e4] text-white font-bold text-sm bg-glow-primary"
              >
                Save Record
              </button>
            </div>
          </form>
        </div>
      )}
    </main>
  );
};
