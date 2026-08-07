import React, { useState } from 'react';
import { Play, Plus, Clock, Dumbbell, Sparkles, ChevronRight } from 'lucide-react';
import { Routine, ActiveSessionState, Exercise } from '../types';
import { EXERCISE_DATABASE } from '../data/initialData';

interface RoutinesViewProps {
  routines: Routine[];
  onStartRoutine: (routine: Routine) => void;
  onStartQuickWorkout: () => void;
  onCreateCustomRoutine: (routine: Routine) => void;
}

export const RoutinesView: React.FC<RoutinesViewProps> = ({
  routines,
  onStartRoutine,
  onStartQuickWorkout,
  onCreateCustomRoutine
}) => {
  const [isCreating, setIsCreating] = useState<boolean>(false);
  const [newTitle, setNewTitle] = useState<string>('');
  const [newCategory, setNewCategory] = useState<string>('Upper Body');
  const [selectedExIds, setSelectedExIds] = useState<string[]>(['panca-piana', 'spinte-manubri-inclinata']);

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const created: Routine = {
      id: `custom-${Date.now()}`,
      title: newTitle.trim(),
      category: newCategory,
      durationMinutes: selectedExIds.length * 15,
      exerciseCount: selectedExIds.length,
      description: 'Scheda personalizzata creata dall’utente.',
      tagColor: 'bg-[#5340e4]/10 text-[#5340e4]',
      exercises: selectedExIds.map((id) => ({
        exerciseId: id,
        setsCount: 3,
        targetReps: '8-10'
      }))
    };

    onCreateCustomRoutine(created);
    setIsCreating(false);
    setNewTitle('');
  };

  const toggleExerciseSelect = (id: string) => {
    setSelectedExIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  return (
    <div className="min-h-screen bg-[#E9E8F0] pb-28 pt-6 px-4 md:px-8 max-w-2xl mx-auto font-sora">
      {/* Top Banner */}
      <div className="mb-6 flex justify-between items-center">
        <div>
          <span className="text-xs font-bold uppercase tracking-widest text-[#5340e4]">
            Allenamenti & Schede
          </span>
          <h1 className="text-2xl font-extrabold text-[#1b1b24] font-sora">
            Inizia una Sessione
          </h1>
        </div>

        <button
          onClick={onStartQuickWorkout}
          className="px-4 py-2.5 rounded-xl bg-[#6d5dfe] text-white font-bold text-xs flex items-center gap-1.5 shadow-md hover:bg-[#5340e4] transition-all glow-button cursor-pointer"
        >
          <Play className="w-4 h-4 fill-white" />
          <span>Quick Workout</span>
        </button>
      </div>

      {/* Action Banner to create new routine */}
      {!isCreating ? (
        <button
          onClick={() => setIsCreating(true)}
          className="w-full mb-6 p-4 rounded-2xl bg-gradient-to-r from-[#2d1b33] to-[#5340e4] text-white flex items-center justify-between shadow-lg hover:opacity-95 transition-all cursor-pointer group"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/10 backdrop-blur-md flex items-center justify-center text-[#65f9e7]">
              <Plus className="w-6 h-6" />
            </div>
            <div className="text-left">
              <p className="font-bold text-sm">Crea Scheda Personalizzata</p>
              <p className="text-xs text-white/70">Aggiungi esercizi e imposta le tue serie target</p>
            </div>
          </div>
          <ChevronRight className="w-5 h-5 text-white/60 group-hover:translate-x-1 transition-transform" />
        </button>
      ) : (
        /* Create Routine Form */
        <form onSubmit={handleCreateSubmit} className="mb-6 bg-white p-5 rounded-2xl border border-[#c8c4d8]/40 shadow-md space-y-4">
          <div className="flex justify-between items-center border-b border-[#e5e0ee] pb-2">
            <h3 className="font-bold text-sm text-[#1b1b24]">Nuova Scheda Personalizzata</h3>
            <button
              type="button"
              onClick={() => setIsCreating(false)}
              className="text-xs text-[#787587] hover:text-[#1b1b24]"
            >
              Annulla
            </button>
          </div>

          <div>
            <label className="block text-xs font-bold text-[#474555] mb-1">Nome Scheda</label>
            <input
              type="text"
              required
              placeholder="es. Petto & Braccia Killer"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              className="w-full p-2.5 rounded-xl bg-[#f0ecf9] border border-[#c8c4d8] text-sm text-[#1b1b24] focus:outline-none focus:border-[#6d5dfe]"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-[#474555] mb-1">Categoria</label>
            <select
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value)}
              className="w-full p-2.5 rounded-xl bg-[#f0ecf9] border border-[#c8c4d8] text-sm text-[#1b1b24] focus:outline-none focus:border-[#6d5dfe]"
            >
              <option value="Upper Body">Upper Body</option>
              <option value="Lower Body">Lower Body</option>
              <option value="Push">Push</option>
              <option value="Pull">Pull</option>
              <option value="Full Body">Full Body</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-[#474555] mb-2">Seleziona Esercizi ({selectedExIds.length})</label>
            <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
              {EXERCISE_DATABASE.map((ex) => {
                const isSelected = selectedExIds.includes(ex.id);
                return (
                  <div
                    key={ex.id}
                    onClick={() => toggleExerciseSelect(ex.id)}
                    className={`p-2.5 rounded-xl text-xs font-semibold flex justify-between items-center cursor-pointer transition-colors ${
                      isSelected
                        ? 'bg-[#5340e4]/15 border border-[#5340e4] text-[#5340e4]'
                        : 'bg-[#f0ecf9] text-[#474555] hover:bg-[#eae6f4]'
                    }`}
                  >
                    <span>{ex.name} ({ex.muscleGroup})</span>
                    <span>{isSelected ? '✓ Incluso' : '+ Aggiungi'}</span>
                  </div>
                );
              })}
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-3 rounded-xl bg-[#6d5dfe] text-white font-bold text-xs shadow-md hover:bg-[#5340e4] transition-colors"
          >
            Salva Scheda
          </button>
        </form>
      )}

      {/* Routine Cards List */}
      <div className="space-y-4">
        {routines.map((routine) => (
          <div
            key={routine.id}
            className="bg-[#fcf8ff] rounded-2xl p-5 shadow-sm border border-[#c8c4d8]/40 hover:border-[#6d5dfe]/50 transition-all space-y-4 relative overflow-hidden"
          >
            <div className="flex justify-between items-start">
              <div>
                <span className={`px-2.5 py-0.5 rounded-full font-bold text-[10px] uppercase tracking-wider ${routine.tagColor || 'bg-[#5340e4]/10 text-[#5340e4]'}`}>
                  {routine.category}
                </span>
                <h2 className="text-xl font-bold text-[#1b1b24] font-sora mt-1">
                  {routine.title}
                </h2>
                <p className="text-xs text-[#787587] mt-0.5 line-clamp-2">
                  {routine.description}
                </p>
              </div>

              <button
                onClick={() => onStartRoutine(routine)}
                className="px-4 py-2.5 rounded-xl bg-[#6d5dfe] text-white font-bold text-xs flex items-center gap-1.5 shadow-md hover:bg-[#5340e4] active:scale-95 transition-all cursor-pointer glow-button shrink-0"
              >
                <Play className="w-3.5 h-3.5 fill-white" />
                <span>Avvia</span>
              </button>
            </div>

            {/* Quick stats badges */}
            <div className="flex items-center gap-4 text-xs font-semibold text-[#474555] pt-1 border-t border-[#e5e0ee]">
              <div className="flex items-center gap-1">
                <Clock className="w-4 h-4 text-[#5340e4]" />
                <span>~{routine.durationMinutes} min</span>
              </div>
              <div className="flex items-center gap-1">
                <Dumbbell className="w-4 h-4 text-[#006a61]" />
                <span>{routine.exerciseCount} esercizi</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
