import { useState } from 'react';
import { ActiveTab, PRRecord, UserProfile, VolumeDataPoint, WorkoutRoutine } from './types';
import { initialPRs, initialRoutines, initialUserProfile, weeklyVolumeData } from './data/mockData';
import { Navigation } from './components/Navigation';
import { AnalyticsView } from './components/AnalyticsView';
import { HomeView } from './components/HomeView';
import { WorkoutsView } from './components/WorkoutsView';
import { StartSessionView } from './components/StartSessionView';
import { UserSettingsView } from './components/UserSettingsView';

export default function App() {
  // Default tab set to 'analytics' to match the reference prototype image immediately!
  const [activeTab, setActiveTab] = useState<ActiveTab>('analytics');
  const [userProfile, setUserProfile] = useState<UserProfile>(initialUserProfile);
  const [prs, setPrs] = useState<PRRecord[]>(initialPRs);
  const [volumeData, setVolumeData] = useState<VolumeDataPoint[]>(weeklyVolumeData);
  const [routines, setRoutines] = useState<WorkoutRoutine[]>(initialRoutines);
  const [activeSessionRoutine, setActiveSessionRoutine] = useState<WorkoutRoutine>(initialRoutines[0]);

  const handleAddPR = (newPr: PRRecord) => {
    setPrs((prev) => [newPr, ...prev]);
  };

  const handleCheckPR = (exerciseName: string, weightKg: number) => {
    const existing = prs.find((p) => p.exercise.toLowerCase() === exerciseName.toLowerCase());
    if (existing && weightKg > existing.weightKg) {
      const updatedPr: PRRecord = {
        ...existing,
        previousKg: existing.weightKg,
        weightKg: weightKg,
        incrementKg: weightKg - existing.weightKg,
        date: new Date().toISOString().split('T')[0],
      };
      setPrs((prev) => [updatedPr, ...prev.filter((p) => p.id !== existing.id)]);
    } else if (!existing) {
      const brandNewPr: PRRecord = {
        id: `pr-${Date.now()}`,
        exercise: exerciseName,
        weightKg: weightKg,
        previousKg: weightKg - 5,
        incrementKg: 5,
        date: new Date().toISOString().split('T')[0],
        category: 'Upper Body',
      };
      setPrs((prev) => [brandNewPr, ...prev]);
    }
  };

  const handleFinishSession = (loggedVolumeKg: number, durationMinutes: number) => {
    // Update Volume on Sunday
    setVolumeData((prev) => {
      const updated = [...prev];
      const sunIdx = updated.length - 1;
      if (sunIdx >= 0) {
        updated[sunIdx] = {
          ...updated[sunIdx],
          volumeKg: updated[sunIdx].volumeKg + loggedVolumeKg,
          setsCount: updated[sunIdx].setsCount + 4,
        };
      }
      return updated;
    });

    // Update user active time & calories
    setUserProfile((prev) => ({
      ...prev,
      activeMinutes: prev.activeMinutes + durationMinutes,
      energyKcal: prev.energyKcal + Math.round(durationMinutes * 8.5),
    }));
  };

  const handleAddRoutine = (routine: WorkoutRoutine) => {
    setRoutines((prev) => [routine, ...prev]);
  };

  const handleUpdateProfile = (updated: Partial<UserProfile>) => {
    setUserProfile((prev) => ({ ...prev, ...updated }));
  };

  const handleResetDemoData = () => {
    setUserProfile(initialUserProfile);
    setPrs(initialPRs);
    setVolumeData(weeklyVolumeData);
    setRoutines(initialRoutines);
  };

  return (
    <div className="min-h-screen bg-[#fcf8ff] text-[#1b1b24] font-['Sora',sans-serif] selection:bg-[#6d5dfe] selection:text-white">
      {/* Navigation Bars */}
      <Navigation
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        userProfile={userProfile}
        onOpenQuickStart={() => setActiveSessionRoutine(routines[0])}
      />

      {/* Main Tab Views */}
      {activeTab === 'analytics' && (
        <AnalyticsView
          userProfile={userProfile}
          prs={prs}
          volumeData={volumeData}
          onAddPR={handleAddPR}
        />
      )}

      {activeTab === 'home' && (
        <HomeView
          userProfile={userProfile}
          prs={prs}
          routines={routines}
          setActiveTab={setActiveTab}
          onSelectRoutineToStart={(r) => setActiveSessionRoutine(r)}
        />
      )}

      {activeTab === 'workouts' && (
        <WorkoutsView
          routines={routines}
          onAddRoutine={handleAddRoutine}
          onSelectRoutineToStart={(r) => setActiveSessionRoutine(r)}
          setActiveTab={setActiveTab}
        />
      )}

      {activeTab === 'start' && (
        <StartSessionView
          routine={activeSessionRoutine}
          onFinishSession={handleFinishSession}
          onCheckPR={handleCheckPR}
          setActiveTab={setActiveTab}
        />
      )}

      {activeTab === 'settings' && (
        <UserSettingsView
          userProfile={userProfile}
          onUpdateProfile={handleUpdateProfile}
          onResetDemoData={handleResetDemoData}
        />
      )}
    </div>
  );
}
