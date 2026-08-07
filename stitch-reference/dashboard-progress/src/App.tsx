import React, { useState } from 'react';
import { 
  initialProfile, 
  workoutRoutines, 
  pullDayRoutine, 
  initialWeightRecords, 
  initialBodyFatRecords, 
  initialRecovery, 
  initialWeeklyVolume 
} from './data';
import { UserProfile, WorkoutRoutine, WeightRecord, BodyFatRecord, DayVolume } from './types';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { BottomNav } from './components/BottomNav';
import { HeroCard } from './components/HeroCard';
import { MetricsRow } from './components/MetricsRow';
import { WeeklyVolumeChart } from './components/WeeklyVolumeChart';
import { ActiveWorkoutModal } from './components/ActiveWorkoutModal';
import { WorkoutsView } from './components/WorkoutsView';
import { ProgressView } from './components/ProgressView';
import { ProfileView } from './components/ProfileView';
import { WeightLogModal } from './components/WeightLogModal';
import { RecoveryDetailModal } from './components/RecoveryDetailModal';

export default function App() {
  const [activeTab, setActiveTab] = useState<'home' | 'workouts' | 'analytics' | 'profile'>('home');
  const [user, setUser] = useState<UserProfile>(initialProfile);
  const [routines, setRoutines] = useState<WorkoutRoutine[]>(workoutRoutines);
  const [weightRecords, setWeightRecords] = useState<WeightRecord[]>(initialWeightRecords);
  const [bodyFatRecords, setBodyFatRecords] = useState<BodyFatRecord[]>(initialBodyFatRecords);
  const [weeklyVolume, setWeeklyVolume] = useState<DayVolume[]>(initialWeeklyVolume);
  const [recovery] = useState(initialRecovery);

  // Active workout runner state
  const [activeWorkout, setActiveWorkout] = useState<WorkoutRoutine | null>(null);

  // Modal triggers
  const [activeModal, setActiveModal] = useState<'weight' | 'bodyFat' | 'recovery' | null>(null);

  // Toast notification state
  const [toast, setToast] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => {
      setToast(null);
    }, 4000);
  };

  const currentWeight = weightRecords[weightRecords.length - 1].weightKg;
  const currentBodyFat = bodyFatRecords[bodyFatRecords.length - 1].bodyFatPercentage;

  const handleFinishWorkout = (routineTitle: string, totalVolumeKg: number, durationMin: number) => {
    setActiveWorkout(null);

    // Update Thursday / Today's volume
    setWeeklyVolume(prev => prev.map(d => {
      if (d.isToday) {
        return {
          ...d,
          volumeKg: d.volumeKg + totalVolumeKg
        };
      }
      return d;
    }));

    // Update user streak
    setUser(prev => ({
      ...prev,
      streakDays: prev.streakDays + 1
    }));

    showToast(`Great job! Completed ${routineTitle} (${durationMin} min, ${totalVolumeKg.toLocaleString()} kg total volume). Streak +1!`);
  };

  const handleSaveWeight = (newWeightKg: number) => {
    const todayStr = new Date().toISOString().split('T')[0];
    setWeightRecords(prev => [
      ...prev,
      { id: `w-${Date.now()}`, date: todayStr, weightKg: Number(newWeightKg.toFixed(1)) }
    ]);
    showToast(`Logged new weight: ${newWeightKg.toFixed(1)} ${user.unit}`);
  };

  const handleSaveBodyFat = (newBfPct: number) => {
    const todayStr = new Date().toISOString().split('T')[0];
    setBodyFatRecords(prev => [
      ...prev,
      { id: `bf-${Date.now()}`, date: todayStr, bodyFatPercentage: Number(newBfPct.toFixed(1)) }
    ]);
    showToast(`Logged new body fat: ${newBfPct.toFixed(1)}%`);
  };

  const handleAddNewRoutine = (newRoutine: WorkoutRoutine) => {
    setRoutines(prev => [newRoutine, ...prev]);
    showToast(`Custom routine "${newRoutine.title}" created!`);
  };

  return (
    <div className="min-h-screen bg-[#F4F3FB] text-[#1b1b24] pb-28 pt-20">
      {/* Header */}
      <Header 
        user={user} 
        onOpenSettings={() => setActiveTab('profile')} 
        onOpenProfile={() => setActiveTab('profile')} 
      />

      {/* Main Container */}
      <main className="px-6 md:px-0 md:max-w-4xl mx-auto md:grid md:grid-cols-12 gap-6 mt-4">
        {/* Sidebar Navigation (Desktop) */}
        <Sidebar 
          user={user}
          activeTab={activeTab}
          onSelectTab={setActiveTab}
          onStartSession={() => setActiveWorkout(pullDayRoutine)}
        />

        {/* Dynamic View Content Area */}
        <div className="md:col-span-12 md:pl-72 flex flex-col gap-6">
          {activeTab === 'home' && (
            <>
              {/* Today's Focus Hero Card */}
              <HeroCard 
                routine={pullDayRoutine} 
                onStartWorkout={() => setActiveWorkout(pullDayRoutine)} 
              />

              {/* Peso, Massa Grassa, Recovery Cards */}
              <MetricsRow 
                currentWeight={currentWeight}
                currentBodyFat={currentBodyFat}
                recovery={recovery}
                unit={user.unit}
                onOpenWeightModal={() => setActiveModal('weight')}
                onOpenBodyFatModal={() => setActiveModal('bodyFat')}
                onOpenRecoveryModal={() => setActiveModal('recovery')}
              />

              {/* Weekly Volume Bar Chart */}
              <WeeklyVolumeChart volumeData={weeklyVolume} />
            </>
          )}

          {activeTab === 'workouts' && (
            <WorkoutsView 
              routines={routines}
              onStartRoutine={(routine) => setActiveWorkout(routine)}
              onAddNewRoutine={handleAddNewRoutine}
            />
          )}

          {activeTab === 'analytics' && (
            <ProgressView 
              weightRecords={weightRecords}
              bodyFatRecords={bodyFatRecords}
              unit={user.unit}
            />
          )}

          {activeTab === 'profile' && (
            <ProfileView 
              user={user}
              onUpdateUser={setUser}
              currentWeight={currentWeight}
              currentBodyFat={currentBodyFat}
              recoveryScore={recovery.score}
            />
          )}
        </div>
      </main>

      {/* Mobile Bottom Navigation */}
      <BottomNav 
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        onStartSession={() => setActiveWorkout(pullDayRoutine)}
      />

      {/* Active Workout Session Runner Modal */}
      {activeWorkout && (
        <ActiveWorkoutModal 
          routine={activeWorkout}
          onClose={() => setActiveWorkout(null)}
          onFinishWorkout={handleFinishWorkout}
        />
      )}

      {/* Weight or Body Fat Entry Modal */}
      {(activeModal === 'weight' || activeModal === 'bodyFat') && (
        <WeightLogModal 
          mode={activeModal}
          currentWeight={currentWeight}
          currentBodyFat={currentBodyFat}
          unit={user.unit}
          onClose={() => setActiveModal(null)}
          onSaveWeight={handleSaveWeight}
          onSaveBodyFat={handleSaveBodyFat}
        />
      )}

      {/* Recovery Detail Modal */}
      {activeModal === 'recovery' && (
        <RecoveryDetailModal 
          recovery={recovery}
          onClose={() => setActiveModal(null)}
        />
      )}

      {/* Global Toast Banner */}
      {toast && (
        <div className="fixed top-20 right-4 z-50 bg-[#1A1B2E] text-white px-5 py-3 rounded-2xl shadow-xl border border-[#65f9e7]/30 flex items-center gap-3 animate-fade-in text-xs font-semibold">
          <span className="material-symbols-outlined text-[#65f9e7]">check_circle</span>
          <span>{toast}</span>
        </div>
      )}
    </div>
  );
}
