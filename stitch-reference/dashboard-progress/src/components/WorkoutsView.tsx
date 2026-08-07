import React, { useState } from 'react';
import { WorkoutRoutine } from '../types';

interface WorkoutsViewProps {
  routines: WorkoutRoutine[];
  onStartRoutine: (routine: WorkoutRoutine) => void;
  onAddNewRoutine: (newRoutine: WorkoutRoutine) => void;
}

export const WorkoutsView: React.FC<WorkoutsViewProps> = ({
  routines,
  onStartRoutine,
  onAddNewRoutine
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newSubtitle, setNewSubtitle] = useState('');
  const [newCategory, setNewCategory] = useState('Upper Body');
  const [newEstTime, setNewEstTime] = useState(45);

  const categories = ['All', 'Upper Body', 'Lower Body', 'Cardio'];

  const filteredRoutines = selectedCategory === 'All'
    ? routines
    : routines.filter(r => r.category === selectedCategory);

  const handleCreateRoutine = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const created: WorkoutRoutine = {
      id: `custom-${Date.now()}`,
      title: newTitle,
      subtitle: newSubtitle || 'Custom created routine',
      category: newCategory,
      estimatedTimeMin: newEstTime,
      exercises: [
        {
          id: `ex-c1`,
          name: 'Main Exercise 1',
          category: 'Back',
          sets: [
            { setNumber: 1, targetReps: 10, weightKg: 20, completed: false },
            { setNumber: 2, targetReps: 10, weightKg: 25, completed: false },
            { setNumber: 3, targetReps: 8, weightKg: 30, completed: false },
          ]
        }
      ]
    };

    onAddNewRoutine(created);
    setShowCreateModal(false);
    setNewTitle('');
    setNewSubtitle('');
  };

  return (
    <div className="space-y-6">
      {/* Header banner */}
      <div className="bg-[#1A1B2E] rounded-3xl p-6 md:p-8 text-white relative overflow-hidden border border-white/10 shadow-lg">
        <div className="absolute top-0 right-0 w-64 h-64 bg-[#6d5dfe]/20 rounded-full blur-3xl pointer-events-none"></div>
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <span className="text-xs font-semibold text-[#65f9e7] uppercase tracking-wider">Routine Library</span>
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-white mt-1">
              Workout Routines
            </h2>
            <p className="text-sm text-[#c5c0ff] mt-1 max-w-lg">
              Explore your targeted training programs or create custom splits designed for maximum hypertrophy and athletic progression.
            </p>
          </div>

          <button 
            onClick={() => setShowCreateModal(true)}
            className="bg-gradient-to-r from-[#6d5dfe] to-[#5340e4] hover:from-[#7c6efe] text-white font-bold px-6 py-3 rounded-full shadow-md hover:shadow-lg transition-all active:scale-95 flex items-center gap-2 self-start md:self-auto cursor-pointer"
          >
            <span className="material-symbols-outlined text-lg">add</span>
            New Routine
          </button>
        </div>
      </div>

      {/* Category Filter Pills */}
      <div className="flex gap-2.5 overflow-x-auto pb-1">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-5 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-all duration-200 cursor-pointer ${
              selectedCategory === cat
                ? 'bg-[#5340e4] text-white shadow-sm'
                : 'bg-white text-[#474555] hover:bg-[#eae6f4] border border-[#c8c4d8]/30'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Routine Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {filteredRoutines.map((routine) => (
          <div 
            key={routine.id}
            className="bg-white rounded-3xl p-6 border border-[#c8c4d8]/20 shadow-xs hover:shadow-md transition-all duration-300 flex flex-col justify-between group"
          >
            <div>
              <div className="flex justify-between items-start mb-3">
                <span className="text-[11px] font-bold uppercase tracking-wider px-3 py-1 bg-[#f0ecf9] text-[#5340e4] rounded-full">
                  {routine.category}
                </span>
                <span className="text-xs font-medium text-[#787587] flex items-center gap-1">
                  <span className="material-symbols-outlined text-sm">schedule</span>
                  {routine.estimatedTimeMin} min
                </span>
              </div>

              <h3 className="font-bold text-2xl text-[#1b1b24] group-hover:text-[#5340e4] transition-colors">
                {routine.title}
              </h3>
              <p className="text-sm text-[#474555] mt-1 mb-4 leading-relaxed">
                {routine.subtitle}
              </p>

              {/* Exercise tags */}
              <div className="space-y-2 mb-6">
                <span className="text-[11px] font-semibold text-[#787587] uppercase tracking-wider block">Exercises Included:</span>
                <div className="flex flex-wrap gap-1.5">
                  {routine.exercises.map((ex, idx) => (
                    <span key={idx} className="text-xs bg-[#f6f1ff] text-[#1b1b24] px-2.5 py-1 rounded-lg border border-[#c8c4d8]/20 font-medium">
                      {ex.name}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <button
              onClick={() => onStartRoutine(routine)}
              className="w-full bg-[#1A1B2E] hover:bg-[#282a45] text-white font-bold py-3.5 rounded-2xl transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer group-hover:bg-[#5340e4]"
            >
              Start Routine
              <span className="material-symbols-outlined text-sm">play_arrow</span>
            </button>
          </div>
        ))}
      </div>

      {/* Create New Routine Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 bg-[#1b1b24]/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-md rounded-3xl p-6 shadow-2xl border border-[#c8c4d8]/30">
            <div className="flex justify-between items-center mb-5">
              <h3 className="font-bold text-xl text-[#1b1b24]">Create Custom Routine</h3>
              <button 
                onClick={() => setShowCreateModal(false)}
                className="w-8 h-8 rounded-full hover:bg-[#eae6f4] flex items-center justify-center text-[#474555]"
              >
                <span className="material-symbols-outlined text-lg">close</span>
              </button>
            </div>

            <form onSubmit={handleCreateRoutine} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-[#474555] mb-1 uppercase">Title</label>
                <input 
                  type="text"
                  required
                  placeholder="e.g. Upper Body Hypertrophy"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full bg-[#f6f1ff] border border-[#c8c4d8]/40 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-[#5340e4] outline-hidden font-medium text-[#1b1b24]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#474555] mb-1 uppercase">Subtitle / Focus</label>
                <input 
                  type="text"
                  placeholder="e.g. Chest, Lats, and Arm density"
                  value={newSubtitle}
                  onChange={(e) => setNewSubtitle(e.target.value)}
                  className="w-full bg-[#f6f1ff] border border-[#c8c4d8]/40 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-[#5340e4] outline-hidden font-medium text-[#1b1b24]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-[#474555] mb-1 uppercase">Category</label>
                  <select 
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                    className="w-full bg-[#f6f1ff] border border-[#c8c4d8]/40 rounded-xl px-3 py-2.5 text-sm focus:ring-2 focus:ring-[#5340e4] outline-hidden font-medium text-[#1b1b24]"
                  >
                    <option value="Upper Body">Upper Body</option>
                    <option value="Lower Body">Lower Body</option>
                    <option value="Cardio">Cardio</option>
                    <option value="Full Body">Full Body</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#474555] mb-1 uppercase">Est. Minutes</label>
                  <input 
                    type="number"
                    value={newEstTime}
                    onChange={(e) => setNewEstTime(parseInt(e.target.value) || 30)}
                    className="w-full bg-[#f6f1ff] border border-[#c8c4d8]/40 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-[#5340e4] outline-hidden font-medium text-[#1b1b24]"
                  />
                </div>
              </div>

              <div className="pt-3 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-5 py-2.5 rounded-xl border border-[#c8c4d8]/50 text-sm font-semibold text-[#474555] hover:bg-[#eae6f4]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-[#5340e4] hover:bg-[#402dcd] text-white text-sm font-bold shadow-md"
                >
                  Save Routine
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
