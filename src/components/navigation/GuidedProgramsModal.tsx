'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Compass, Play, RotateCcw, ChevronLeft, Check, Circle } from 'lucide-react';
import { cn } from '@/lib/utils/cn';
import {
  guidedPrograms,
  getProgramProgress,
  startProgram,
  resetProgram,
  type GuidedProgram,
} from '@/constants/programs';

interface GuidedProgramsModalProps {
  onClose: () => void;
  onUsePrompt: (prompt: string) => void;
}

type View = 'list' | 'program';

export function GuidedProgramsModal({ onClose, onUsePrompt }: GuidedProgramsModalProps) {
  const [view, setView] = useState<View>('list');
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

  const handleSelectProgram = (program: GuidedProgram) => {
    setSelectedProgram(program);
    setView('program');
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
        <div className="px-6 py-4 border-b border-neutral-200 flex items-center justify-between">
          <div className="flex items-center gap-3">
            {view === 'program' && (
              <button
                onClick={() => setView('list')}
                className="p-2 -ml-2 rounded-lg hover:bg-neutral-100 transition-colors"
              >
                <ChevronLeft className="w-5 h-5 text-neutral-600" />
              </button>
            )}
            <div className="p-2 bg-neutral-100 rounded-lg">
              <Compass className="w-5 h-5 text-neutral-700" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-neutral-900">
                {view === 'list' ? 'Guided Programs' : selectedProgram?.name}
              </h2>
              <p className="text-sm text-neutral-500">
                {view === 'list' ? 'Structured journaling challenges' : selectedProgram?.description}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-neutral-100 transition-colors"
          >
            <X className="w-5 h-5 text-neutral-600" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(85vh-80px)]">
          <AnimatePresence mode="wait">
            {view === 'list' ? (
              <motion.div
                key="list"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-4"
              >
                {guidedPrograms.map((program) => {
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
                            <h3 className="font-semibold text-neutral-900">{program.name}</h3>
                            <p className="text-sm text-neutral-600">{program.description}</p>
                            <p className="text-xs text-neutral-500 mt-1">
                              {program.duration} days
                            </p>
                          </div>
                        </div>

                        {/* Progress bar */}
                        {isActive && (
                          <div className="mt-3">
                            <div className="flex justify-between text-xs text-neutral-600 mb-1">
                              <span>Day {Math.min(progress.currentDay, program.duration)} of {program.duration}</span>
                              <span>{Math.round(progressPercent)}%</span>
                            </div>
                            <div className="h-2 bg-white/50 rounded-full overflow-hidden">
                              <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${progressPercent}%` }}
                                className="h-full bg-neutral-900 rounded-full"
                              />
                            </div>
                          </div>
                        )}

                        {/* Actions */}
                        <div className="mt-4 flex gap-2">
                          {!isActive ? (
                            <button
                              onClick={() => handleStartProgram(program)}
                              className="flex items-center gap-2 px-4 py-2 bg-neutral-900 text-white rounded-lg text-sm font-medium hover:bg-neutral-800 transition-colors"
                            >
                              <Play className="w-4 h-4" />
                              Start Program
                            </button>
                          ) : (
                            <>
                              <button
                                onClick={() => handleSelectProgram(program)}
                                className="flex items-center gap-2 px-4 py-2 bg-neutral-900 text-white rounded-lg text-sm font-medium hover:bg-neutral-800 transition-colors"
                              >
                                {isCompleted ? 'View Prompts' : 'Continue'}
                              </button>
                              <button
                                onClick={() => handleResetProgram(program)}
                                className="flex items-center gap-2 px-4 py-2 border border-neutral-300 text-neutral-700 rounded-lg text-sm font-medium hover:bg-neutral-50 transition-colors"
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
            ) : (
              <motion.div
                key="program"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
              >
                {selectedProgram && (
                  <>
                    {/* Today's Prompt */}
                    {programProgress[selectedProgram.id]?.startDate && (
                      <div className={cn('rounded-xl border-2 p-4 mb-6', selectedProgram.color)}>
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-lg">{selectedProgram.icon}</span>
                          <span className="text-sm font-medium text-neutral-700">
                            Day {Math.min(programProgress[selectedProgram.id].currentDay, selectedProgram.duration)} Prompt
                          </span>
                        </div>
                        <p className="text-neutral-900 font-medium mb-4">
                          {selectedProgram.prompts[
                            Math.min(
                              programProgress[selectedProgram.id].currentDay - 1,
                              selectedProgram.prompts.length - 1
                            )
                          ]}
                        </p>
                        <button
                          onClick={handleUseTodayPrompt}
                          className="w-full py-2 bg-neutral-900 text-white rounded-lg text-sm font-medium hover:bg-neutral-800 transition-colors"
                        >
                          Use This Prompt
                        </button>
                      </div>
                    )}

                    {/* All Prompts List */}
                    <h3 className="text-lg font-medium text-neutral-900 mb-3">All Prompts</h3>
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
                                ? 'border-neutral-900 bg-neutral-50'
                                : 'border-neutral-200'
                            )}
                          >
                            <div
                              className={cn(
                                'w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5',
                                isCompleted
                                  ? 'bg-green-500 text-white'
                                  : isCurrent
                                  ? 'bg-neutral-900 text-white'
                                  : 'bg-neutral-200 text-neutral-500'
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
                                isCompleted ? 'text-neutral-500' : 'text-neutral-700'
                              )}
                            >
                              {prompt}
                            </p>
                          </div>
                        );
                      })}
                    </div>
                  </>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </motion.div>
  );
}
