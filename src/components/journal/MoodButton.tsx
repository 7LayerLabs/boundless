'use client';

import { useState } from 'react';
import { Smile } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils/cn';
import { moods, moodList } from '@/constants/moods';
import { analytics } from '@/components/providers/PostHogProvider';
import type { Mood } from '@/types/journal';

interface MoodButtonProps {
  selectedMood: Mood | null;
  onSelect: (mood: Mood | null) => void;
  disabled?: boolean;
  darkMode?: boolean;
}

export function MoodButton({ selectedMood, onSelect, disabled = false, darkMode = false }: MoodButtonProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const selectedMoodData = selectedMood ? moods[selectedMood] : null;
  const moodColor = selectedMoodData?.color || (darkMode ? '#9ca3af' : '#d1d5db');

  return (
    <div className="relative">
      {/* Compact mood button - 32x32 circle */}
      <button
        onClick={() => !disabled && setIsExpanded(!isExpanded)}
        disabled={disabled}
        className={cn(
          'w-8 h-8 rounded-full flex items-center justify-center transition-all',
          disabled && 'cursor-default opacity-70'
        )}
        style={{
          backgroundColor: `${moodColor}20`,
        }}
        title={selectedMoodData ? selectedMoodData.name : (disabled ? 'No mood recorded' : 'Set mood')}
      >
        {selectedMoodData ? (
          <span className="text-base">{selectedMoodData.emoji}</span>
        ) : (
          <Smile className={cn(
            'w-4 h-4',
            darkMode ? 'text-neutral-500' : 'text-neutral-400'
          )} />
        )}
      </button>

      {/* Mood picker dropdown */}
      <AnimatePresence>
        {isExpanded && (
          <>
            {/* Backdrop */}
            <div
              className="fixed inset-0 z-10"
              onClick={() => setIsExpanded(false)}
            />

            {/* Dropdown - grid layout */}
            <motion.div
              initial={{ opacity: 0, y: -10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              transition={{ duration: 0.15 }}
              className={cn(
                'absolute top-full left-0 mt-2 z-20',
                'rounded-xl shadow-xl border',
                'p-3 min-w-[280px]',
                darkMode
                  ? 'bg-neutral-800 border-neutral-700'
                  : 'bg-white border-neutral-200'
              )}
            >
              <p className={cn(
                'text-xs mb-2 px-1',
                darkMode ? 'text-neutral-400' : 'text-neutral-500'
              )}>
                How are you feeling?
              </p>

              <div className="grid grid-cols-5 gap-1.5">
                {moodList.map((mood) => (
                  <button
                    key={mood.id}
                    onClick={() => {
                      const newMood = mood.id === selectedMood ? null : mood.id;
                      if (newMood) {
                        analytics.moodSelected(newMood);
                      }
                      onSelect(newMood);
                      setIsExpanded(false);
                    }}
                    className={cn(
                      'flex flex-col items-center gap-0.5 p-1.5 rounded-lg',
                      'transition-all hover:scale-110',
                      mood.id === selectedMood
                        ? darkMode
                          ? 'bg-neutral-700 ring-2 ring-neutral-500'
                          : 'bg-neutral-100 ring-2 ring-neutral-400'
                        : darkMode
                          ? 'hover:bg-neutral-700'
                          : 'hover:bg-neutral-50'
                    )}
                    title={mood.name}
                  >
                    <span className="text-xl">{mood.emoji}</span>
                    <span className={cn(
                      'text-[9px] truncate w-full text-center',
                      darkMode ? 'text-neutral-400' : 'text-neutral-600'
                    )}>
                      {mood.name}
                    </span>
                  </button>
                ))}
              </div>

              {selectedMood && (
                <button
                  onClick={() => {
                    onSelect(null);
                    setIsExpanded(false);
                  }}
                  className={cn(
                    'w-full mt-2 px-3 py-1.5 text-xs rounded-lg transition-colors',
                    darkMode
                      ? 'text-neutral-400 hover:text-neutral-200 hover:bg-neutral-700'
                      : 'text-neutral-600 hover:text-neutral-800 hover:bg-neutral-100'
                  )}
                >
                  Clear mood
                </button>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
