import React, { useState } from 'react';
import { ActiveTab, WorkoutRoutine } from '../types';

interface WorkoutsViewProps {
  routines: WorkoutRoutine[];
  onAddRoutine: (routine: WorkoutRoutine) => void;
  onSelectRoutineToStart: (routine: WorkoutRoutine) => void;
  setActiveTab: (tab: ActiveTab) => void;
}

export const WorkoutsView: React.FC<WorkoutsViewProps> = ({
  routines,
  onAddRoutine,
  onSelectRoutineToStart,
  setActiveTab,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedRoutineModal, setSelectedRoutineModal] = useState<WorkoutRoutine | null>(null);

  // AI Workout Generator Modal State
  const [isAIGeneratorOpen, setIsAIGeneratorOpen] = useState(false);
  const [aiGoal, setAiGoal] = useState('Hypertrophy & Upper Body');
  const [aiEquipment, setAiEquipment] = useState('Full Commercial Gym');
  const [aiMuscles, setAiMuscles] = useState('Chest, Shoulders & Triceps');
  const [aiDuration, setAiDuration] = useState(45);
  const [isGenerating, setIsGenerating] = useState(false);

  const categories = ['All', 'Strength & Hypertrophy', 'Max Power', 'Conditioning', 'Custom'];

  const filteredRoutines = routines.filter((r) => {
    const matchesCat = selectedCategory === 'All' || r.category === selectedCategory || (selectedCategory === 'Custom' && r.isCustom);
    const matchesSearch = r.title.toLowerCase().includes(searchTerm.toLowerCase()) || r.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCat && matchesSearch;
  });

  const handleGenerateAIWorkout = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsGenerating(true);
    try {
      const res = await fetch('/api/ai/generate-workout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          goal: aiGoal,
          equipment: aiEquipment,
          targetMuscles: aiMuscles,
          durationMinutes: aiDuration,
        }),
      });
      const data = await res.json();

      const generatedRoutine: WorkoutRoutine = {
        id: `routine-ai-${Date.now()}`,
        title: data.title || 'Aura AI Custom Routine',
        category: 'Custom',
        difficulty: 'Pro Athlete',
        estimatedMinutes: aiDuration,
        exerciseCount: data.exercises?.length || 4,
        description: `AI generated custom routine targeting ${aiMuscles} using ${aiEquipment}.`,
        image: 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?auto=format&fit=crop&w=800&q=80',
        isCustom: true,
        exercises: (data.exercises || []).map((ex: any, idx: number) => ({
          id: `ex-gen-${idx}`,
          name: ex.name,
          category: aiMuscles,
          targetMuscles: [aiMuscles],
          restSeconds: parseInt(ex.rest) || 60,
          sets: Array.from({ length: ex.sets || 3 }).map((_, sIdx) => ({
            setNumber: sIdx + 1,
            weightKg: ex.targetKg || 60,
            reps: parseInt(ex.reps) || 10,
            completed: false,
            rpe: ex.rpe || 8,
          })),
        })),
      };

      onAddRoutine(generatedRoutine);
      setIsAIGeneratorOpen(false);
      onSelectRoutineToStart(generatedRoutine);
      setActiveTab('start');
    } catch (err) {
      console.error(err);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <main className="pt-24 pb-28 px-6 md:pl-[calc(256px+40px)] md:pr-10 md:pt-12 md:pb-12 max-w-[1600px] mx-auto min-h-screen flex flex-col gap-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="font-['Sora'] text-3xl md:text-5xl font-bold text-[#1b1b24] tracking-tight mb-2">
            Workout Library
          </h1>
          <p className="font-['Sora'] text-base text-[#474555]">
            Choose a preset elite routine or generate an AI personalized session.
          </p>
        </div>

        <button
          onClick={() => setIsAIGeneratorOpen(true)}
          className="px-6 py-3.5 rounded-full bg-[#5340e4] text-white font-['Sora'] font-bold text-sm hover:bg-[#6d5dfe] transition-all bg-glow-primary shadow-lg flex items-center gap-2 active:scale-95"
        >
          <span className="material-symbols-outlined text-[20px]">auto_awesome</span>
          AI Custom Workout Generator
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col md:flex-row gap-4 justify-between items-center bg-white p-4 rounded-2xl shadow-sm border border-[#e5e0ee]">
        <div className="relative w-full md:w-80">
          <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-[#787587]">
            search
          </span>
          <input
            type="text"
            placeholder="Search exercises, routines..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#f6f1ff] border border-transparent focus:border-[#5340e4] text-sm outline-none"
          />
        </div>

        {/* Categories */}
        <div className="flex flex-wrap gap-2 w-full md:w-auto">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-full text-xs font-['Sora'] font-semibold transition-all ${
                selectedCategory === cat
                  ? 'bg-[#5340e4] text-white shadow-xs'
                  : 'bg-[#f0ecf9] text-[#474555] hover:bg-[#eae6f4]'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Routines Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredRoutines.map((routine) => (
          <div
            key={routine.id}
            className="glass-panel rounded-3xl overflow-hidden border border-white/60 hover:shadow-2xl transition-all duration-300 flex flex-col justify-between group"
          >
            <div className="relative h-48 overflow-hidden">
              <img
                src={routine.image}
                alt={routine.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
              <div className="absolute top-3 left-3 flex gap-2">
                <span className="px-3 py-1 bg-black/60 backdrop-blur-md text-white text-[10px] font-bold rounded-full">
                  {routine.category}
                </span>
                {routine.isCustom && (
                  <span className="px-3 py-1 bg-[#65f9e7] text-[#00201d] text-[10px] font-bold rounded-full">
                    AI Custom
                  </span>
                )}
              </div>
              <div className="absolute bottom-3 left-3 right-3 text-white">
                <h3 className="font-['Sora'] font-bold text-xl leading-tight">{routine.title}</h3>
                <div className="flex items-center gap-3 text-xs text-white/80 mt-1">
                  <span>⏱️ {routine.estimatedMinutes} mins</span>
                  <span>🏋️ {routine.exerciseCount} exercises</span>
                </div>
              </div>
            </div>

            <div className="p-6 flex-grow flex flex-col justify-between">
              <p className="text-xs text-[#474555] line-clamp-2 leading-relaxed mb-6">
                {routine.description}
              </p>

              <div className="flex gap-3">
                <button
                  onClick={() => setSelectedRoutineModal(routine)}
                  className="w-1/2 py-3 rounded-full bg-[#eae6f4] text-[#1b1b24] font-['Sora'] font-bold text-xs hover:bg-[#dcd8e5] transition-colors"
                >
                  View Details
                </button>
                <button
                  onClick={() => {
                    onSelectRoutineToStart(routine);
                    setActiveTab('start');
                  }}
                  className="w-1/2 py-3 rounded-full bg-[#5340e4] text-white font-['Sora'] font-bold text-xs hover:bg-[#6d5dfe] transition-colors flex items-center justify-center gap-1.5 bg-glow-primary"
                >
                  <span className="material-symbols-outlined text-[16px]">play_arrow</span>
                  Start Session
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Routine Details Modal */}
      {selectedRoutineModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 md:p-8 max-w-2xl w-full max-h-[85vh] overflow-y-auto shadow-2xl border border-[#e5e0ee]">
            <div className="flex justify-between items-start mb-4">
              <div>
                <span className="px-3 py-1 bg-[#5340e4]/10 text-[#5340e4] text-xs font-bold rounded-full uppercase">
                  {selectedRoutineModal.category}
                </span>
                <h2 className="font-['Sora'] text-2xl font-bold text-[#1b1b24] mt-2">
                  {selectedRoutineModal.title}
                </h2>
                <p className="text-xs text-[#787587] mt-0.5">
                  Duration: {selectedRoutineModal.estimatedMinutes} mins | Difficulty: {selectedRoutineModal.difficulty}
                </p>
              </div>
              <button
                onClick={() => setSelectedRoutineModal(null)}
                className="w-8 h-8 rounded-full bg-[#eae6f4] flex items-center justify-center text-[#1b1b24]"
              >
                <span className="material-symbols-outlined text-[18px]">close</span>
              </button>
            </div>

            <p className="text-xs text-[#474555] mb-6 leading-relaxed">
              {selectedRoutineModal.description}
            </p>

            <h3 className="font-['Sora'] text-sm font-bold text-[#1b1b24] mb-3 uppercase tracking-wider">
              Exercise Breakdown ({selectedRoutineModal.exercises.length})
            </h3>

            <div className="space-y-3 mb-6">
              {selectedRoutineModal.exercises.map((ex, idx) => (
                <div key={ex.id || idx} className="p-4 rounded-2xl bg-[#f6f1ff] border border-[#e5e0ee]">
                  <div className="flex justify-between items-center mb-1">
                    <span className="font-['Sora'] font-bold text-sm text-[#1b1b24]">
                      {idx + 1}. {ex.name}
                    </span>
                    <span className="text-xs text-[#5340e4] font-semibold">{ex.sets.length} sets</span>
                  </div>
                  <p className="text-xs text-[#787587]">
                    Target: {ex.targetMuscles.join(', ')} | Rest: {ex.restSeconds}s
                  </p>
                </div>
              ))}
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setSelectedRoutineModal(null)}
                className="w-1/2 py-3 rounded-full bg-[#eae6f4] text-[#1b1b24] font-bold text-sm"
              >
                Close
              </button>
              <button
                onClick={() => {
                  onSelectRoutineToStart(selectedRoutineModal);
                  setSelectedRoutineModal(null);
                  setActiveTab('start');
                }}
                className="w-1/2 py-3 rounded-full bg-[#5340e4] text-white font-bold text-sm bg-glow-primary"
              >
                Start Session Now
              </button>
            </div>
          </div>
        </div>
      )}

      {/* AI Workout Generator Modal */}
      {isAIGeneratorOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <form
            onSubmit={handleGenerateAIWorkout}
            className="bg-white rounded-3xl p-6 md:p-8 max-w-lg w-full shadow-2xl border border-[#e5e0ee]"
          >
            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[#5340e4] text-[24px]">auto_awesome</span>
                <h3 className="font-['Sora'] text-xl font-bold text-[#1b1b24]">AI Custom Routine Builder</h3>
              </div>
              <button
                type="button"
                onClick={() => setIsAIGeneratorOpen(false)}
                className="w-8 h-8 rounded-full bg-[#eae6f4] flex items-center justify-center text-[#1b1b24]"
              >
                <span className="material-symbols-outlined text-[18px]">close</span>
              </button>
            </div>

            <div className="space-y-4 text-sm font-['Sora']">
              <div>
                <label className="block text-xs font-semibold text-[#474555] mb-1">Training Goal</label>
                <input
                  type="text"
                  value={aiGoal}
                  onChange={(e) => setAiGoal(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-[#c8c4d8] focus:border-[#5340e4] outline-none"
                  placeholder="e.g. Hypertrophy, Max Strength, Explosive Power"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#474555] mb-1">Target Muscle Groups</label>
                <input
                  type="text"
                  value={aiMuscles}
                  onChange={(e) => setAiMuscles(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-[#c8c4d8] focus:border-[#5340e4] outline-none"
                  placeholder="e.g. Chest, Shoulders & Triceps"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-[#474555] mb-1">Available Equipment</label>
                  <select
                    value={aiEquipment}
                    onChange={(e) => setAiEquipment(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-[#c8c4d8] focus:border-[#5340e4] outline-none"
                  >
                    <option value="Full Commercial Gym">Commercial Gym</option>
                    <option value="Dumbbells & Bench">Dumbbells & Bench</option>
                    <option value="Kettlebells & Bodyweight">Kettlebells & Bodyweight</option>
                    <option value="Barbell Rack Only">Barbell & Rack</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#474555] mb-1">Duration (Minutes)</label>
                  <input
                    type="number"
                    value={aiDuration}
                    onChange={(e) => setAiDuration(Number(e.target.value))}
                    className="w-full px-4 py-2.5 rounded-xl border border-[#c8c4d8] focus:border-[#5340e4] outline-none font-bold"
                  />
                </div>
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                type="button"
                onClick={() => setIsAIGeneratorOpen(false)}
                className="w-1/2 py-3 rounded-full bg-[#eae6f4] text-[#1b1b24] font-bold text-sm"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isGenerating}
                className="w-1/2 py-3 rounded-full bg-[#5340e4] text-white font-bold text-sm bg-glow-primary flex items-center justify-center gap-2"
              >
                {isGenerating ? (
                  <>
                    <span className="material-symbols-outlined animate-spin text-[18px]">sync</span>
                    Generating...
                  </>
                ) : (
                  <>
                    <span className="material-symbols-outlined text-[18px]">bolt</span>
                    Create Routine
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      )}
    </main>
  );
};
