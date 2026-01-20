'use client';

import { useState, useEffect, useMemo, useCallback } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, Check, X, Home } from 'lucide-react';
import { cn } from '@/lib/utils/cn';
import { db, type ProgramEntry } from '@/lib/db/instant';
import { id, tx } from '@instantdb/react';
import { useSettings } from '@/hooks/useSettings';
import { bindingColors, pageColors } from '@/constants/themes';
import { fonts } from '@/constants/fonts';
import { ProgramEditor } from './ProgramEditor';
import type { GuidedProgram } from '@/constants/programs';

interface ProgramBookProps {
  program: GuidedProgram;
  onClose: () => void;
}

export function ProgramBook({ program, onClose }: ProgramBookProps) {
  const { user } = db.useAuth();
  const [currentPromptIndex, setCurrentPromptIndex] = useState(0);
  const [isClosing, setIsClosing] = useState(false);

  const {
    bindingColor,
    pageColor,
    pageLines,
    fontFamily,
    darkMode,
  } = useSettings();

  // Query program entries for this user and program
  const query = user
    ? {
        programEntries: {
          $: {
            where: {
              userId: user.id,
              programId: program.id,
            },
          },
        },
      }
    : null;

  const { data, isLoading } = db.useQuery(query);
  const entries = (data?.programEntries || []) as ProgramEntry[];

  // Find the current entry for this prompt
  const currentEntry = useMemo(() => {
    return entries.find(e => e.promptIndex === currentPromptIndex);
  }, [entries, currentPromptIndex]);

  // Get completed prompt indices
  const completedIndices = useMemo(() => {
    return new Set(entries.map(e => e.promptIndex));
  }, [entries]);

  // Find the first incomplete prompt on mount
  useEffect(() => {
    if (!isLoading && entries.length > 0) {
      // Find first incomplete prompt
      for (let i = 0; i < program.prompts.length; i++) {
        if (!completedIndices.has(i)) {
          setCurrentPromptIndex(i);
          return;
        }
      }
      // All complete, go to last
      setCurrentPromptIndex(program.prompts.length - 1);
    }
  }, [isLoading, entries.length, completedIndices, program.prompts.length]);

  const currentPrompt = program.prompts[currentPromptIndex];
  const isFirstPrompt = currentPromptIndex === 0;
  const isLastPrompt = currentPromptIndex === program.prompts.length - 1;
  const isCurrentCompleted = completedIndices.has(currentPromptIndex);

  // Styling
  const binding = bindingColors[bindingColor];
  const currentFont = fonts[fontFamily] || fonts.caveat;
  const pageBgColor = darkMode ? '#2a2520' : pageColors[pageColor];

  // Save entry
  const saveEntry = useCallback(async (content: string) => {
    if (!user) return;

    const wordCount = content.trim().split(/\s+/).filter(Boolean).length;
    const now = Date.now();

    if (currentEntry) {
      // Update existing
      await db.transact([
        tx.programEntries[currentEntry.id].update({
          content,
          wordCount,
          updatedAt: now,
        }),
      ]);
    } else {
      // Create new
      const entryId = id();
      await db.transact([
        tx.programEntries[entryId].update({
          userId: user.id,
          programId: program.id,
          promptIndex: currentPromptIndex,
          content,
          wordCount,
          completedAt: now,
          createdAt: now,
          updatedAt: now,
        }),
      ]);
    }
  }, [user, currentEntry, program.id, currentPromptIndex]);

  // Mark as complete and go to next
  const handleComplete = useCallback(async (content: string) => {
    await saveEntry(content);
    if (!isLastPrompt) {
      setCurrentPromptIndex(prev => prev + 1);
    }
  }, [saveEntry, isLastPrompt]);

  const handlePrevious = () => {
    if (!isFirstPrompt) {
      setCurrentPromptIndex(prev => prev - 1);
    }
  };

  const handleNext = () => {
    if (!isLastPrompt) {
      setCurrentPromptIndex(prev => prev + 1);
    }
  };

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(onClose, 300);
  };

  // Calculate progress
  const progressPercent = (completedIndices.size / program.prompts.length) * 100;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          className="w-10 h-10 border-3 border-amber-400 border-t-transparent rounded-full"
        />
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 1 }}
      animate={{ opacity: isClosing ? 0 : 1 }}
      className="relative"
    >
      {/* Book container */}
      <motion.div
        className="relative flex mx-auto"
        style={{
          maxWidth: '1100px',
          height: 'calc(100vh - 120px)',
          minHeight: '500px',
          perspective: '1500px',
        }}
      >
        {/* Left Cover / Navigation */}
        <div
          className="relative w-16 md:w-20 rounded-l-2xl flex flex-col items-center py-6"
          style={{ backgroundColor: binding.color }}
        >
          {/* Close button */}
          <button
            onClick={handleClose}
            className="p-2 mb-4 rounded-full bg-white/20 hover:bg-white/30 transition-colors"
            title="Back to Journal"
          >
            <Home className="w-5 h-5 text-white" />
          </button>

          {/* Program icon */}
          <span className="text-3xl mb-2">{program.icon}</span>

          {/* Progress dots - vertical */}
          <div className="flex-1 flex flex-col items-center gap-1 overflow-y-auto py-4">
            {program.prompts.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentPromptIndex(index)}
                className={cn(
                  'w-3 h-3 rounded-full transition-all',
                  index === currentPromptIndex
                    ? 'bg-white scale-125'
                    : completedIndices.has(index)
                    ? 'bg-green-400'
                    : 'bg-white/40 hover:bg-white/60'
                )}
                title={`Day ${index + 1}`}
              />
            ))}
          </div>

          {/* Progress percentage */}
          <div className="text-white/80 text-xs font-medium">
            {Math.round(progressPercent)}%
          </div>
        </div>

        {/* Main Page Content */}
        <div
          className="relative flex-1 rounded-r-2xl overflow-hidden"
          style={{
            backgroundColor: pageBgColor,
            boxShadow: `
              inset 20px 0 40px rgba(0, 0, 0, 0.08),
              8px 0 30px rgba(0, 0, 0, 0.15)
            `,
          }}
        >
          {/* Paper texture */}
          <div
            className="absolute inset-0 opacity-50 pointer-events-none"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='paper'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.04' numOctaves='5' stitchTiles='stitch'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23paper)' opacity='0.05'/%3E%3C/svg%3E")`,
            }}
          />

          {/* Page lines */}
          {pageLines && (
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                backgroundImage: `repeating-linear-gradient(
                  transparent,
                  transparent 31px,
                  ${darkMode ? 'rgba(180, 160, 140, 0.15)' : 'rgba(180, 160, 140, 0.3)'} 31px,
                  ${darkMode ? 'rgba(180, 160, 140, 0.15)' : 'rgba(180, 160, 140, 0.3)'} 32px
                )`,
                backgroundPosition: '0 180px',
              }}
            />
          )}

          {/* Content */}
          <div className="relative h-full flex flex-col p-6 md:p-10 overflow-hidden">
            {/* Header */}
            <div className="mb-6">
              {/* Program name and progress */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{program.icon}</span>
                  <div>
                    <h1 className={cn(
                      'text-lg font-semibold',
                      darkMode ? 'text-amber-200' : 'text-neutral-800'
                    )}>
                      {program.name}
                    </h1>
                    <p className={cn(
                      'text-sm',
                      darkMode ? 'text-neutral-400' : 'text-neutral-500'
                    )}>
                      Day {currentPromptIndex + 1} of {program.prompts.length}
                    </p>
                  </div>
                </div>

                {isCurrentCompleted && (
                  <div className={cn(
                    'flex items-center gap-1 px-3 py-1 rounded-full text-sm',
                    'bg-green-100 text-green-700'
                  )}>
                    <Check className="w-4 h-4" />
                    Completed
                  </div>
                )}
              </div>

              {/* Progress bar */}
              <div className="h-1.5 bg-neutral-200 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${progressPercent}%` }}
                  className="h-full bg-green-500 rounded-full"
                />
              </div>
            </div>

            {/* Prompt */}
            <div className={cn(
              'p-4 rounded-xl mb-6',
              program.color
            )}>
              <p className={cn(
                'text-lg font-medium',
                darkMode ? 'text-neutral-800' : 'text-neutral-900'
              )}>
                {currentPrompt}
              </p>
            </div>

            {/* Editor */}
            <div className="flex-1 overflow-hidden">
              <ProgramEditor
                key={`${program.id}-${currentPromptIndex}`}
                initialContent={currentEntry?.content || ''}
                onSave={saveEntry}
                onComplete={handleComplete}
                isCompleted={isCurrentCompleted}
                isLastPrompt={isLastPrompt}
                fontClassName={currentFont.className}
                darkMode={darkMode}
                prompt={currentPrompt}
                programName={program.name}
              />
            </div>

            {/* Navigation */}
            <div className="flex items-center justify-between pt-4 border-t border-neutral-200">
              <button
                onClick={handlePrevious}
                disabled={isFirstPrompt}
                className={cn(
                  'flex items-center gap-2 px-4 py-2 rounded-lg transition-colors',
                  isFirstPrompt
                    ? 'opacity-50 cursor-not-allowed'
                    : darkMode
                    ? 'hover:bg-neutral-700 text-neutral-300'
                    : 'hover:bg-neutral-100 text-neutral-700'
                )}
              >
                <ChevronLeft className="w-5 h-5" />
                Previous
              </button>

              <span className={cn(
                'text-sm',
                darkMode ? 'text-neutral-400' : 'text-neutral-500'
              )}>
                {completedIndices.size} of {program.prompts.length} completed
              </span>

              <button
                onClick={handleNext}
                disabled={isLastPrompt}
                className={cn(
                  'flex items-center gap-2 px-4 py-2 rounded-lg transition-colors',
                  isLastPrompt
                    ? 'opacity-50 cursor-not-allowed'
                    : darkMode
                    ? 'hover:bg-neutral-700 text-neutral-300'
                    : 'hover:bg-neutral-100 text-neutral-700'
                )}
              >
                Next
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Gold foil edge */}
          <div
            className="absolute right-0 top-4 bottom-4 w-1.5"
            style={{
              background: 'linear-gradient(180deg, #d4af37 0%, #f5e6a3 15%, #d4af37 30%, #c5a028 50%, #f5e6a3 70%, #d4af37 85%, #c5a028 100%)',
            }}
          />
        </div>
      </motion.div>
    </motion.div>
  );
}
