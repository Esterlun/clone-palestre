import React, { useState } from 'react';
import { Search, Dumbbell, PlayCircle, Filter } from 'lucide-react';
import { Exercise } from '../types';
import { EXERCISE_DATABASE } from '../data/initialData';
import { FormGuideModal } from './FormGuideModal';

export const ExerciseLibraryView: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedMuscle, setSelectedMuscle] = useState<string>('Tutti');
  const [selectedExerciseModal, setSelectedExerciseModal] = useState<Exercise | null>(null);

  const muscleFilterOptions = ['Tutti', 'Chest', 'Back', 'Legs', 'Shoulders', 'Arms'];

  const filteredExercises = EXERCISE_DATABASE.filter((ex) => {
    const matchesSearch =
      ex.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ex.category.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesMuscle =
      selectedMuscle === 'Tutti' || ex.muscleGroup === selectedMuscle;

    return matchesSearch && matchesMuscle;
  });

  return (
    <div className="min-h-screen bg-[#E9E8F0] pb-28 pt-6 px-4 md:px-8 max-w-2xl mx-auto font-sora">
      <div className="mb-4">
        <span className="text-xs font-bold uppercase tracking-widest text-[#5340e4]">
          Libreria Esercizi
        </span>
        <h1 className="text-2xl font-extrabold text-[#1b1b24] font-sora">
          Enciclopedia della Forma
        </h1>
      </div>

      {/* Search Input Bar */}
      <div className="relative mb-4">
        <Search className="w-5 h-5 absolute left-3.5 top-3.5 text-[#787587]" />
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Cerca esercizio (es. Panca, Squat, Lat)..."
          className="w-full pl-11 pr-4 py-3 rounded-2xl bg-white border border-[#c8c4d8]/40 shadow-xs text-sm text-[#1b1b24] placeholder-[#787587] focus:outline-none focus:border-[#6d5dfe]"
        />
      </div>

      {/* Muscle Group Filter Chips */}
      <div className="flex gap-2 overflow-x-auto pb-3 mb-4 scrollbar-none">
        {muscleFilterOptions.map((muscle) => {
          const isActive = selectedMuscle === muscle;
          return (
            <button
              key={muscle}
              onClick={() => setSelectedMuscle(muscle)}
              className={`px-3.5 py-1.5 rounded-full font-bold text-xs whitespace-nowrap transition-all cursor-pointer ${
                isActive
                  ? 'bg-[#5340e4] text-white shadow-md'
                  : 'bg-white text-[#474555] hover:bg-[#eae6f4] border border-[#c8c4d8]/30'
              }`}
            >
              {muscle}
            </button>
          );
        })}
      </div>

      {/* Exercises Cards Grid */}
      <div className="space-y-4">
        {filteredExercises.map((exercise) => (
          <div
            key={exercise.id}
            onClick={() => setSelectedExerciseModal(exercise)}
            className="bg-[#fcf8ff] rounded-2xl p-4 shadow-sm border border-[#c8c4d8]/40 hover:border-[#6d5dfe]/60 transition-all flex gap-4 items-center cursor-pointer group"
          >
            <div className="w-20 h-20 rounded-xl overflow-hidden shrink-0 border border-[#c8c4d8]/30 relative bg-black/10">
              <img
                src={exercise.imageUrl}
                alt={exercise.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <PlayCircle className="w-6 h-6 text-white" />
              </div>
            </div>

            <div className="flex-1">
              <div className="flex gap-1.5 mb-1">
                <span className="px-2 py-0.5 rounded-full bg-[#5340e4]/10 text-[#5340e4] font-semibold text-[10px]">
                  {exercise.category}
                </span>
                <span className="px-2 py-0.5 rounded-full bg-[#006a61]/10 text-[#006a61] font-semibold text-[10px]">
                  {exercise.muscleGroup}
                </span>
              </div>
              <h3 className="font-bold text-base text-[#1b1b24] font-sora">
                {exercise.name}
              </h3>
              <p className="text-xs text-[#787587] line-clamp-1 mt-0.5">
                {exercise.description}
              </p>
            </div>
          </div>
        ))}

        {filteredExercises.length === 0 && (
          <div className="text-center py-12 bg-white rounded-2xl border border-[#c8c4d8]/30">
            <Dumbbell className="w-10 h-10 text-[#787587] mx-auto mb-2 opacity-50" />
            <p className="text-sm font-bold text-[#1b1b24]">Nessun esercizio trovato</p>
            <p className="text-xs text-[#787587]">Rimuovi i filtri o cerca un altro termine.</p>
          </div>
        )}
      </div>

      {selectedExerciseModal && (
        <FormGuideModal
          exercise={selectedExerciseModal}
          isOpen={!!selectedExerciseModal}
          onClose={() => setSelectedExerciseModal(null)}
        />
      )}
    </div>
  );
};
