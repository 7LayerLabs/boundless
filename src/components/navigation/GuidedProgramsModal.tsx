'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Compass, Play, RotateCcw, ChevronLeft, Check, ExternalLink } from 'lucide-react';
import { cn } from '@/lib/utils/cn';
import {
  guidedPrograms,
  programCategories,
  getProgramProgress,
  startProgram,
  resetProgram,
  type GuidedProgram,
  type ProgramCategory,
} from '@/constants/programs';

interface GuidedProgramsModalProps {
  onClose: () => void;
  onUsePrompt: (prompt: string) => void;
}

type View = 'categories' | 'list' | 'program';

const categoryOrder: ProgramCategory[] = ['legacy', 'relationships', 'business', 'wellness'];

export function GuidedProgramsModal({ onClose, onUsePrompt }: GuidedProgramsModalProps) {
  const router = useRouter();
  const [view, setView] = useState<View>('categories');
  const [selectedCategory, setSelectedCategory] = useState<ProgramCategory | null>(null);
  const [selectedProgram, setSelectedProgram] = useState<GuidedProgram | null>(null);
  const [programProgress, setProgramProgress] = useState<Record<string, { startDate: string | null; currentDay: number }>>({});

  // Load progress for all programs
  useEffect(() => {
    const progress: Record<string, { startDate: string | null; currentDay: number }> = {};
    guidedPrograms.forEach((program) => {
      progress[program.id] = getProgramProgress(program.id);
    });
    setProgramProgress(progress);
  }, []);

  const handleStartProgram = (program: GuidedProgram) => {
    startProgram(program.id);
    setProgramProgress((prev) => ({
      ...prev,
      [program.id]: { startDate: new Date().toISOString(), currentDay: 1 },
    }));
  };

  const handleResetProgram = (program: GuidedProgram) => {
    resetProgram(program.id);
    setProgramProgress((prev) => ({
      ...prev,
      [program.id]: { startDate: null, currentDay: 0 },
    }));
  };

  const handleSelectCategory = (category: ProgramCategory) => {
    setSelectedCategory(category);
    setView('list');
  };

  const handleSelectProgram = (program: GuidedProgram) => {
    setSelectedProgram(program);
    setView('program');
  };

  const handleBack = () => {
    if (view === 'program') {
      setView('list');
      setSelectedProgram(null);
    } else if (view === 'list') {
      setView('categories');
      setSelectedCategory(null);
    }
  };

  const handleUseTodayPrompt = () => {
    if (selectedProgram) {
      const progress = programProgress[selectedProgram.id];
      const dayIndex = Math.min(progress.currentDay - 1, selectedProgram.prompts.length - 1);
      const prompt = selectedProgram.prompts[dayIndex];
      onUsePrompt(prompt);
      onClose();
    }
  };

  const handleOpenProgram = (program: GuidedProgram) => {
    // Make sure program is started
    if (!programProgress[program.id]?.startDate) {
      startProgram(program.id);
    }
    onClose();
    router.push(`/program/${program.id}`);
  };

  const getHeaderTitle = () => {
    if (view === 'program' && selectedProgram) return selectedProgram.name;
    if (view === 'list' && selectedCategory) return programCategories[selectedCategory].name;
    return 'Guided Programs';
  };

  const getHeaderSubtitle = () => {
    if (view === 'program' && selectedProgram) return selectedProgram.description;
    if (view === 'list' && selectedCategory) return programCategories[selectedCategory].description;
    return 'Meaningful journeys for life, love, and growth';
  };

  const getCategoryPrograms = (category: ProgramCategory) => {
    return guidedPrograms.filter(p => p.category === category);
  };

  const getActiveCount = (category: ProgramCategory) => {
    return getCategoryPrograms(category).filter(p => {
      const progress = programProgress[p.id];
      return progress?.startDate !== null;
    }).length;
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
        className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[85vh] overflow-hidden"
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-amber-200 flex items-center justify-between">
          <div className="flex items-center gap-3">
            {view !== 'categories' && (
              <button
                onClick={handleBack}
                className="p-2 -ml-2 rounded-lg hover:bg-amber-100 transition-colors"
              >
                <ChevronLeft className="w-5 h-5 text-stone-600" />
              </button>
            )}
            <div className="p-2 bg-amber-100 rounded-lg">
              <Compass className="w-5 h-5 text-stone-700" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-stone-800">
                {getHeaderTitle()}
              </h2>
              <p className="text-sm text-stone-600">
                {getHeaderSubtitle()}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-amber-100 transition-colors"
          >
            <X className="w-5 h-5 text-stone-600" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(85vh-80px)]">
          <AnimatePresence mode="wait">
            {/* Categories View */}
            {view === 'categories' && (
              <motion.div
                key="categories"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="grid grid-cols-2 gap-4"
              >
                {categoryOrder.map((categoryId) => {
                  const category = programCategories[categoryId];
                  const programCount = getCategoryPrograms(categoryId).length;
                  const activeCount = getActiveCount(categoryId);

                  return (
                    <button
                      key={categoryId}
                      onClick={() => handleSelectCategory(categoryId)}
                      className={cn(
                        'p-5 rounded-xl border-2 text-left transition-all hover:shadow-md',
                        'hover:scale-[1.02] active:scale-[0.98]',
                        categoryId === 'legacy' && 'bg-amber-50 border-amber-200 hover:border-amber-300',
                        categoryId === 'relationships' && 'bg-red-50 border-red-200 hover:border-red-300',
                        categoryId === 'business' && 'bg-blue-50 border-blue-200 hover:border-blue-300',
                        categoryId === 'wellness' && 'bg-green-50 border-green-200 hover:border-green-300',
                      )}
                    >
                      <span className="text-3xl">{category.icon}</span>
                      <h3 className="font-semibold text-stone-800 mt-2">{category.name}</h3>
                      <p className="text-sm text-stone-600 mt-1">{category.description}</p>
                      <div className="flex items-center gap-2 mt-3 text-xs text-stone-600">
                        <span>{programCount} programs</span>
                        {activeCount > 0 && (
                          <>
                            <span>•</span>
                            <span className="text-green-600 font-medium">{activeCount} active</span>
                          </>
                        )}
                      </div>
                    </button>
                  );
                })}
              </motion.div>
            )}

            {/* Programs List View */}
            {view === 'list' && selectedCategory && (
              <motion.div
                key="list"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-4"
              >
                {getCategoryPrograms(selectedCategory).map((program) => {
                  const progress = programProgress[program.id] || { startDate: null, currentDay: 0 };
                  const isActive = progress.startDate !== null;
                  const isCompleted = isActive && progress.currentDay > program.duration;
                  const progressPercent = isActive
                    ? Math.min((progress.currentDay / program.duration) * 100, 100)
                    : 0;

                  return (
                    <div
                      key={program.id}
                      className={cn(
                        'rounded-xl border-2 overflow-hidden transition-all',
                        program.color
                      )}
                    >
                      <div className="p-4">
                        <div className="flex items-start gap-3">
                          <span className="text-3xl">{program.icon}</span>
                          <div className="flex-1">
                            <h3 className="font-semibold text-stone-800">{program.name}</h3>
                            <p className="text-sm text-stone-600">{program.description}</p>
                            <p className="text-xs text-stone-600 mt-1">
                              {program.duration} days
                            </p>
                          </div>
                        </div>

                        {/* Progress bar */}
                        {isActive && (
                          <div className="mt-3">
                            <div className="flex justify-between text-xs text-stone-600 mb-1">
                              <span>Day {Math.min(progress.currentDay, program.duration)} of {program.duration}</span>
                              <span>{Math.round(progressPercent)}%</span>
                            </div>
                            <div className="h-2 bg-white/50 rounded-full overflow-hidden">
                              <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${progressPercent}%` }}
                                className="h-full bg-stone-800 rounded-full"
                              />
                            </div>
                          </div>
                        )}

                        {/* Actions */}
                        <div className="mt-4 flex gap-2">
                          {!isActive ? (
                            <button
                              onClick={() => handleOpenProgram(program)}
                              className="flex items-center gap-2 px-4 py-2 bg-stone-800 text-white rounded-lg text-sm font-medium hover:bg-stone-700 transition-colors"
                            >
                              <Play className="w-4 h-4" />
                              Start Program
                            </button>
                          ) : (
                            <>
                              <button
                                onClick={() => handleOpenProgram(program)}
                                className="flex items-center gap-2 px-4 py-2 bg-stone-800 text-white rounded-lg text-sm font-medium hover:bg-stone-700 transition-colors"
                              >
                                <ExternalLink className="w-4 h-4" />
                                {isCompleted ? 'Review' : 'Continue'}
                              </button>
                              <button
                                onClick={() => handleSelectProgram(program)}
                                className="flex items-center gap-2 px-4 py-2 border border-amber-300 text-stone-700 rounded-lg text-sm font-medium hover:bg-neutral-50 transition-colors"
                              >
                                View Prompts
                              </button>
                              <button
                                onClick={() => handleResetProgram(program)}
                                className="flex items-center gap-2 px-4 py-2 border border-amber-300 text-stone-700 rounded-lg text-sm font-medium hover:bg-neutral-50 transition-colors"
                              >
                                <RotateCcw className="w-4 h-4" />
                                Reset
                              </button>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </motion.div>
            )}

            {/* Program Detail View */}
            {view === 'program' && selectedProgram && (
              <motion.div
                key="program"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
              >
                {/* Open Program Button */}
                <button
                  onClick={() => handleOpenProgram(selectedProgram)}
                  className={cn(
                    'w-full flex items-center justify-center gap-2 py-3 mb-6 rounded-xl text-white font-medium transition-colors',
                    'bg-stone-800 hover:bg-stone-700'
                  )}
                >
                  <ExternalLink className="w-5 h-5" />
                  Open Program
                </button>

                {/* Today's Prompt Preview */}
                {programProgress[selectedProgram.id]?.startDate && (
                  <div className={cn('rounded-xl border-2 p-4 mb-6', selectedProgram.color)}>
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-lg">{selectedProgram.icon}</span>
                      <span className="text-sm font-medium text-stone-700">
                        Day {Math.min(programProgress[selectedProgram.id].currentDay, selectedProgram.duration)} Prompt
                      </span>
                    </div>
                    <p className="text-stone-800 font-medium">
                      {selectedProgram.prompts[
                        Math.min(
                          programProgress[selectedProgram.id].currentDay - 1,
                          selectedProgram.prompts.length - 1
                        )
                      ]}
                    </p>
                  </div>
                )}

                {/* All Prompts List */}
                <h3 className="text-lg font-medium text-stone-800 mb-3">All Prompts</h3>
                <div className="space-y-2">
                  {selectedProgram.prompts.map((prompt, index) => {
                    const progress = programProgress[selectedProgram.id];
                    const isCompleted = progress?.startDate && index < progress.currentDay - 1;
                    const isCurrent = progress?.startDate && index === progress.currentDay - 1;

                    return (
                      <div
                        key={index}
                        className={cn(
                          'flex items-start gap-3 p-3 rounded-lg border transition-all',
                          isCurrent
                            ? 'border-stone-800 bg-neutral-50'
                            : 'border-amber-200'
                        )}
                      >
                        <div
                          className={cn(
                            'w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5',
                            isCompleted
                              ? 'bg-green-500 text-white'
                              : isCurrent
                              ? 'bg-stone-800 text-white'
                              : 'bg-amber-200 text-stone-600'
                          )}
                        >
                          {isCompleted ? (
                            <Check className="w-4 h-4" />
                          ) : (
                            <span className="text-xs font-medium">{index + 1}</span>
                          )}
                        </div>
                        <p
                          className={cn(
                            'text-sm flex-1',
                            isCompleted ? 'text-stone-600' : 'text-stone-700'
                          )}
                        >
                          {prompt}
                        </p>
                      </div>
                    );
                  })}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </motion.div>
  );
}
