import React from 'react';
import { 
  X, 
  BookOpen, 
  ArrowRight, 
  CheckCircle2, 
  Clock, 
  FileCode2, 
  Sparkles,
  Layers
} from 'lucide-react';
import { ProgrammingLanguage, LabExercise } from '../../types/lab';
import { LAB_EXERCISES } from '../../data/labCurriculum';

interface ExerciseDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  language: ProgrammingLanguage;
  onSelectExercise: (exercise: LabExercise) => void;
  currentExerciseId?: string;
}

export const ExerciseDrawer: React.FC<ExerciseDrawerProps> = ({
  isOpen,
  onClose,
  language,
  onSelectExercise,
  currentExerciseId
}) => {
  if (!isOpen) return null;

  const filteredExercises = LAB_EXERCISES.filter(ex => ex.language === language);

  return (
    <div className="fixed inset-0 z-40 flex justify-end bg-black/60 backdrop-blur-sm">
      <div className="w-full max-w-md bg-neutral-900 border-l border-neutral-800 h-full flex flex-col text-neutral-100 shadow-2xl animate-in slide-in-from-right duration-200">
        {/* Drawer Header */}
        <div className="p-4 border-b border-neutral-800 flex items-center justify-between bg-neutral-950/70">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-blue-500/20 text-blue-400 flex items-center justify-center border border-blue-500/30">
              <BookOpen className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">
                {language === 'c' ? 'C Programming Lab Manual' : language === 'python' ? 'Python 3 Lab Manual' : 'Java OOP Lab Manual'}
              </h3>
              <p className="text-[11px] text-neutral-400">
                Official Department Curriculum Assignments
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Exercises List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {filteredExercises.map((ex) => {
            const isSelected = currentExerciseId === ex.id;
            return (
              <div
                key={ex.id}
                className={`p-3.5 rounded-xl border transition-all ${
                  isSelected
                    ? 'bg-emerald-950/30 border-emerald-500/60 ring-1 ring-emerald-500/30'
                    : 'bg-neutral-950/80 border-neutral-800 hover:border-neutral-700'
                }`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-neutral-800 text-neutral-300 font-bold">
                    LAB #{ex.labNumber}
                  </span>
                  <span className={`text-[10px] font-semibold px-2 py-0.5 rounded ${
                    ex.difficulty === 'Easy'
                      ? 'bg-emerald-500/10 text-emerald-400'
                      : ex.difficulty === 'Medium'
                      ? 'bg-amber-500/10 text-amber-400'
                      : 'bg-rose-500/10 text-rose-400'
                  }`}>
                    {ex.difficulty}
                  </span>
                </div>

                <h4 className="text-xs font-bold text-white mb-1">{ex.title}</h4>
                <p className="text-[11px] text-neutral-400 line-clamp-2 mb-2.5">
                  {ex.description}
                </p>

                {ex.testCases && ex.testCases.length > 0 && (
                  <div className="mb-3 p-2 rounded bg-neutral-900/90 border border-neutral-800/80 text-[10px] font-mono text-neutral-400">
                    <span className="text-neutral-500">Test Case: </span>
                    <span className="text-emerald-300">{ex.testCases[0].description}</span>
                  </div>
                )}

                <button
                  type="button"
                  onClick={() => {
                    onSelectExercise(ex);
                    onClose();
                  }}
                  className={`w-full py-2 px-3 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer ${
                    isSelected
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                      : 'bg-neutral-800 hover:bg-neutral-700 text-neutral-200'
                  }`}
                >
                  <FileCode2 className="w-3.5 h-3.5" />
                  <span>{isSelected ? 'Currently Loaded in Editor' : 'Load Problem to Editor'}</span>
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
