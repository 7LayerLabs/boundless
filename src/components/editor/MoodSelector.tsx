'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils/cn';
import { moodList } from '@/constants/moods';
import { analytics } from '@/components/providers/PostHogProvider';
import type { Mood } from '@/types/journal';

interface MoodSelectorProps {
  selectedMood: Mood | null;
  onSelect: (mood: Mood | null) => void;
}

export function MoodSelector({ selectedMood, onSelect }: MoodSelectorProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const selectedMoodData = selectedMood
    ? moodList.find((m) => m.id === selectedMood)
    : null;

  return (
    <div className="relative">
      {/* Current mood / expand button */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className={cn(
          'flex items-center gap-2 px-3 py-1.5 rounded-full',
          'text-sm transition-all',
          selectedMood
            ? 'bg-amber-100 hover:bg-amber-200'
            : 'bg-amber-50 hover:bg-amber-100 text-amber-600'
        )}
      >
        {selectedMoodData ? (
          <>
            <span className="text-lg">{selectedMoodData.emoji}</span>
            <span className="text-amber-800">{selectedMoodData.name}</span>
          </>
        ) : (
          <span>How are you feeling?</span>
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

            {/* Dropdown */}
            <motion.div
              initial={{ opacity: 0, y: -10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              transition={{ duration: 0.15 }}
              className={cn(
                'absolute top-full left-0 mt-2 z-20',
                'bg-white rounded-xl shadow-xl border border-amber-100',
                'p-3 min-w-[320px]'
              )}
            >
              <p className="text-xs text-amber-500 mb-2 px-1">
                How are you feeling today?
              </p>

              <div className="grid grid-cols-5 gap-2">
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
                      'flex flex-col items-center gap-1 p-2 rounded-lg',
                      'transition-all hover:scale-110',
                      mood.id === selectedMood
                        ? 'bg-amber-100 ring-2 ring-amber-400'
                        : 'hover:bg-amber-50'
                    )}
                    title={mood.name}
                  >
                    <span className="text-2xl">{mood.emoji}</span>
                    <span className="text-[10px] text-amber-700 truncate w-full text-center">
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
                  className="w-full mt-2 px-3 py-1.5 text-sm text-amber-600 hover:text-amber-800 hover:bg-amber-50 rounded-lg transition-colors"
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
