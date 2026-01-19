'use client';

import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { X, Clock, Calendar, Tag, Sparkles } from 'lucide-react';
import { format, getMonth, getDate, differenceInYears } from 'date-fns';
import { cn } from '@/lib/utils/cn';
import { useJournal } from '@/hooks/useJournal';
import { useSettings } from '@/hooks/useSettings';
import { fonts } from '@/constants/fonts';
import { moods } from '@/constants/moods';
import type { JournalEntry } from '@/lib/db/instant';

interface OnThisDayModalProps {
  onClose: () => void;
  onSelectEntry: (entry: JournalEntry) => void;
  currentDate?: Date;
}

export function OnThisDayModal({ onClose, onSelectEntry, currentDate = new Date() }: OnThisDayModalProps) {
  const { allEntries } = useJournal();
  const { fontFamily, darkMode } = useSettings();
  const currentFont = fonts[fontFamily] || fonts.caveat;

  // Find entries from the same month/day in previous years
  const memories = useMemo(() => {
    const targetMonth = getMonth(currentDate);
    const targetDay = getDate(currentDate);
    const currentYear = currentDate.getFullYear();

    return allEntries
      .filter((entry) => {
        const entryDate = new Date(entry.date);
        const entryMonth = getMonth(entryDate);
        const entryDay = getDate(entryDate);
        const entryYear = entryDate.getFullYear();

        // Same month and day, but different (earlier) year
        return entryMonth === targetMonth && entryDay === targetDay && entryYear < currentYear;
      })
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [allEntries, currentDate]);

  // Group memories by years ago
  const groupedMemories = useMemo(() => {
    const groups: Record<number, JournalEntry[]> = {};

    memories.forEach((entry) => {
      const entryDate = new Date(entry.date);
      const yearsAgo = differenceInYears(currentDate, entryDate);

      if (!groups[yearsAgo]) {
        groups[yearsAgo] = [];
      }
      groups[yearsAgo].push(entry);
    });

    return Object.entries(groups)
      .map(([years, entries]) => ({ yearsAgo: parseInt(years), entries }))
      .sort((a, b) => a.yearsAgo - b.yearsAgo);
  }, [memories, currentDate]);

  const getYearsAgoText = (yearsAgo: number) => {
    if (yearsAgo === 1) return '1 year ago';
    return `${yearsAgo} years ago`;
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.95, opacity: 0, y: 20 }}
        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
        className={cn(
          'relative w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden max-h-[80vh] flex flex-col',
          darkMode ? 'bg-neutral-900' : 'bg-white'
        )}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className={cn(
          'p-5 border-b flex items-center justify-between',
          darkMode ? 'border-neutral-700 bg-neutral-800/50' : 'border-gray-100 bg-amber-50/50'
        )}>
          <div className="flex items-center gap-3">
            <div className={cn(
              'w-10 h-10 rounded-full flex items-center justify-center',
              darkMode ? 'bg-amber-500/20' : 'bg-amber-100'
            )}>
              <Clock className={cn('w-5 h-5', darkMode ? 'text-amber-400' : 'text-amber-600')} />
            </div>
            <div>
              <h2 className={cn(
                'font-semibold',
                darkMode ? 'text-neutral-100' : 'text-gray-800'
              )}>
                On This Day
              </h2>
              <p className={cn(
                'text-sm',
                darkMode ? 'text-neutral-400' : 'text-gray-500'
              )}>
                {format(currentDate, 'MMMM d')} — memories from years past
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className={cn(
              'p-2 rounded-lg transition-colors',
              darkMode ? 'hover:bg-neutral-700 text-neutral-400' : 'hover:bg-gray-100 text-gray-400'
            )}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto">
          {memories.length === 0 ? (
            <div className={cn(
              'p-12 text-center',
              darkMode ? 'text-neutral-400' : 'text-gray-400'
            )}>
              <div className={cn(
                'w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center',
                darkMode ? 'bg-neutral-800' : 'bg-gray-100'
              )}>
                <Sparkles className="w-8 h-8 opacity-40" />
              </div>
              <p className="font-medium mb-2">No memories on this day yet</p>
              <p className="text-sm opacity-75">
                Keep journaling! Your future self will love looking back at this day.
              </p>
            </div>
          ) : (
            <div className="p-4 space-y-6">
              {groupedMemories.map(({ yearsAgo, entries }) => (
                <div key={yearsAgo}>
                  {/* Year header */}
                  <div className={cn(
                    'flex items-center gap-2 mb-3 px-2',
                    darkMode ? 'text-amber-400' : 'text-amber-600'
                  )}>
                    <div className={cn(
                      'w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold',
                      darkMode ? 'bg-amber-500/20' : 'bg-amber-100'
                    )}>
                      {yearsAgo}
                    </div>
                    <span className="text-sm font-medium">
                      {getYearsAgoText(yearsAgo)}
                    </span>
                    <div className={cn(
                      'flex-1 h-px',
                      darkMode ? 'bg-neutral-700' : 'bg-gray-200'
                    )} />
                  </div>

                  {/* Entries for this year */}
                  <div className="space-y-2">
                    {entries.map((entry) => {
                      const moodData = entry.mood ? moods[entry.mood as keyof typeof moods] : null;
                      const plainText = entry.content.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
                      const preview = plainText.slice(0, 200) + (plainText.length > 200 ? '...' : '');
                      const entryDate = new Date(entry.date);

                      return (
                        <button
                          key={entry.id}
                          onClick={() => onSelectEntry(entry)}
                          className={cn(
                            'w-full text-left p-4 rounded-xl transition-all',
                            darkMode
                              ? 'bg-neutral-800/50 hover:bg-neutral-800 border border-neutral-700'
                              : 'bg-gray-50 hover:bg-amber-50 border border-gray-100 hover:border-amber-200'
                          )}
                        >
                          <div className="flex items-center gap-2 mb-2">
                            <Calendar className={cn(
                              'w-4 h-4',
                              darkMode ? 'text-amber-400' : 'text-amber-500'
                            )} />
                            <span className={cn(
                              'text-sm font-medium',
                              darkMode ? 'text-amber-400' : 'text-amber-700'
                            )}>
                              {format(entryDate, 'MMMM d, yyyy')}
                            </span>
                            {moodData && (
                              <span
                                className="text-xs px-2 py-0.5 rounded-full"
                                style={{
                                  backgroundColor: `${moodData.color}20`,
                                  color: moodData.color,
                                }}
                              >
                                {moodData.name}
                              </span>
                            )}
                            {entry.isBookmarked && (
                              <span className="text-amber-500 text-xs">★</span>
                            )}
                          </div>

                          {preview ? (
                            <p className={cn(
                              'text-sm leading-relaxed',
                              darkMode ? 'text-neutral-300' : 'text-gray-700',
                              currentFont.className
                            )}>
                              {preview}
                            </p>
                          ) : (
                            <p className={cn(
                              'text-sm italic',
                              darkMode ? 'text-neutral-500' : 'text-gray-400'
                            )}>
                              No content written
                            </p>
                          )}

                          {entry.tags && entry.tags.length > 0 && (
                            <div className="flex items-center gap-1 mt-2">
                              <Tag className={cn(
                                'w-3 h-3',
                                darkMode ? 'text-neutral-500' : 'text-gray-400'
                              )} />
                              {entry.tags.slice(0, 3).map((tag) => (
                                <span
                                  key={tag}
                                  className={cn(
                                    'text-xs',
                                    darkMode ? 'text-neutral-500' : 'text-gray-500'
                                  )}
                                >
                                  #{tag}
                                </span>
                              ))}
                              {entry.tags.length > 3 && (
                                <span className={cn(
                                  'text-xs',
                                  darkMode ? 'text-neutral-500' : 'text-gray-400'
                                )}>
                                  +{entry.tags.length - 3}
                                </span>
                              )}
                            </div>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {memories.length > 0 && (
          <div className={cn(
            'p-3 border-t text-center text-sm',
            darkMode
              ? 'bg-neutral-800/50 border-neutral-700 text-neutral-400'
              : 'bg-gray-50 border-gray-100 text-gray-500'
          )}>
            {memories.length} {memories.length === 1 ? 'memory' : 'memories'} from {format(currentDate, 'MMMM d')}
          </div>
        )}
      </motion.div>
    </motion.div>
  );
}
