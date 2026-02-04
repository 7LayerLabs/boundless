'use client';

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { format, subYears, isSameDay } from 'date-fns';
import { X, Clock, ChevronLeft, ChevronRight, BookOpen, Heart } from 'lucide-react';
import { cn } from '@/lib/utils/cn';
import { useJournal } from '@/hooks/useJournal';
import { moods } from '@/constants/moods';
import type { Mood } from '@/types/journal';
import type { JournalEntry } from '@/lib/db/instant';

interface OnThisDayModalProps {
  onClose: () => void;
  onNavigateToEntry?: (date: string) => void;
}

export function OnThisDayModal({ onClose, onNavigateToEntry }: OnThisDayModalProps) {
  const { allEntries } = useJournal();
  const [currentYearIndex, setCurrentYearIndex] = useState(0);

  // Find all entries from this day in previous years
  const memoriesOnThisDay = useMemo(() => {
    const today = new Date();
    const memories: { year: number; entry: JournalEntry; yearsAgo: number }[] = [];

    // Check up to 10 years back
    for (let yearsAgo = 1; yearsAgo <= 10; yearsAgo++) {
      const targetDate = subYears(today, yearsAgo);
      
      const matchingEntry = allEntries.find((entry: JournalEntry) => {
        const entryDate = new Date(entry.date);
        return isSameDay(entryDate, targetDate);
      });

      if (matchingEntry) {
        memories.push({
          year: targetDate.getFullYear(),
          entry: matchingEntry,
          yearsAgo,
        });
      }
    }

    return memories;
  }, [allEntries]);

  const currentMemory = memoriesOnThisDay[currentYearIndex];
  const hasMemories = memoriesOnThisDay.length > 0;

  const navigatePrev = () => {
    if (currentYearIndex > 0) {
      setCurrentYearIndex(currentYearIndex - 1);
    }
  };

  const navigateNext = () => {
    if (currentYearIndex < memoriesOnThisDay.length - 1) {
      setCurrentYearIndex(currentYearIndex + 1);
    }
  };

  // Strip HTML tags and get plain text preview
  const getTextPreview = (html: string, maxLength: number = 300) => {
    const text = html.replace(/<[^>]*>/g, '').replace(/&nbsp;/g, ' ');
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength).trim() + '...';
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.95, opacity: 0, y: 20 }}
        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-lg bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl shadow-2xl overflow-hidden"
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full hover:bg-amber-100 transition-colors z-10"
        >
          <X className="w-5 h-5 text-amber-800" />
        </button>

        {/* Header */}
        <div className="px-6 pt-6 pb-4 text-center border-b border-amber-200/50">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-amber-100 text-amber-800 rounded-full text-sm font-medium mb-3">
            <Clock className="w-4 h-4" />
            <span>On This Day</span>
          </div>
          <h2 className="font-serif text-2xl font-bold text-amber-900">
            {format(new Date(), 'MMMM d')}
          </h2>
          <p className="text-sm text-amber-600 mt-1">
            {hasMemories ? `${memoriesOnThisDay.length} ${memoriesOnThisDay.length === 1 ? 'memory' : 'memories'} found` : 'Your future memories await'}
          </p>
        </div>

        {/* Content */}
        <div className="p-6 min-h-[300px]">
          {hasMemories ? (
            <AnimatePresence mode="wait">
              <motion.div
                key={currentYearIndex}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.2 }}
              >
                {/* Year indicator */}
                <div className="flex items-center justify-between mb-4">
                  <button
                    onClick={navigatePrev}
                    disabled={currentYearIndex === 0}
                    className={cn(
                      'p-2 rounded-lg transition-colors',
                      currentYearIndex === 0
                        ? 'opacity-30 cursor-not-allowed'
                        : 'hover:bg-amber-100'
                    )}
                  >
                    <ChevronLeft className="w-5 h-5 text-amber-700" />
                  </button>
                  
                  <div className="text-center">
                    <p className="text-3xl font-serif font-bold text-amber-800">
                      {currentMemory.year}
                    </p>
                    <p className="text-sm text-amber-600">
                      {currentMemory.yearsAgo} {currentMemory.yearsAgo === 1 ? 'year' : 'years'} ago
                    </p>
                  </div>
                  
                  <button
                    onClick={navigateNext}
                    disabled={currentYearIndex === memoriesOnThisDay.length - 1}
                    className={cn(
                      'p-2 rounded-lg transition-colors',
                      currentYearIndex === memoriesOnThisDay.length - 1
                        ? 'opacity-30 cursor-not-allowed'
                        : 'hover:bg-amber-100'
                    )}
                  >
                    <ChevronRight className="w-5 h-5 text-amber-700" />
                  </button>
                </div>

                {/* Memory card */}
                <div className="bg-white rounded-xl p-5 shadow-sm border border-amber-100">
                  {/* Mood if present */}
                  {currentMemory.entry.mood && (
                    <div className="flex items-center gap-2 mb-3">
                      <span className="text-2xl">
                        {moods[currentMemory.entry.mood as Mood]?.emoji || '📝'}
                      </span>
                      <span className="text-sm text-amber-600 capitalize">
                        Feeling {currentMemory.entry.mood}
                      </span>
                    </div>
                  )}

                  {/* Entry preview */}
                  <p className="text-amber-900 leading-relaxed font-serif italic">
                    "{getTextPreview(currentMemory.entry.content)}"
                  </p>

                  {/* Tags if present */}
                  {currentMemory.entry.tags && currentMemory.entry.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-4">
                      {(currentMemory.entry.tags as string[]).slice(0, 3).map((tag) => (
                        <span
                          key={tag}
                          className="px-2 py-0.5 bg-amber-50 text-amber-600 text-xs rounded-full"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Read full entry button */}
                  {onNavigateToEntry && (
                    <button
                      onClick={() => {
                        onNavigateToEntry(currentMemory.entry.date);
                        onClose();
                      }}
                      className="mt-4 w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-amber-100 hover:bg-amber-200 text-amber-800 rounded-lg transition-colors text-sm font-medium"
                    >
                      <BookOpen className="w-4 h-4" />
                      Read Full Entry
                    </button>
                  )}
                </div>

                {/* Dots indicator */}
                {memoriesOnThisDay.length > 1 && (
                  <div className="flex justify-center gap-1.5 mt-4">
                    {memoriesOnThisDay.map((_, index) => (
                      <button
                        key={index}
                        onClick={() => setCurrentYearIndex(index)}
                        className={cn(
                          'w-2 h-2 rounded-full transition-all',
                          index === currentYearIndex
                            ? 'bg-amber-600 scale-125'
                            : 'bg-amber-300 hover:bg-amber-400'
                        )}
                      />
                    ))}
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          ) : (
            /* Empty state */
            <div className="flex flex-col items-center justify-center h-full py-8 text-center">
              <div className="w-16 h-16 rounded-full bg-amber-100 flex items-center justify-center mb-4">
                <Heart className="w-8 h-8 text-amber-400" />
              </div>
              <h3 className="font-serif text-xl font-medium text-amber-800 mb-2">
                No memories yet
              </h3>
              <p className="text-amber-600 text-sm max-w-xs">
                Keep journaling! Next year, you'll see what you wrote on this day.
              </p>
              <p className="text-amber-500 text-xs mt-4 italic">
                "The best time to plant a tree was 20 years ago. The second best time is now."
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-amber-50/50 border-t border-amber-200/50 text-center">
          <p className="text-xs text-amber-500">
            💡 Memories help you see how far you've come
          </p>
        </div>
      </motion.div>
    </motion.div>
  );
}
