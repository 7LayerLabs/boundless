'use client';

import { useState } from 'react';
import { format } from 'date-fns';
import { ChevronLeft, ChevronRight, X, Lock } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils/cn';
import type { Quote } from '@/constants/quotes';

interface JournalHeaderProps {
  currentDate: Date;
  onPreviousDay: () => void;
  onNextDay: () => void;
  onToday: () => void;
  formatDate: (date: Date) => string;
  dateColor: string;
  dayColor: string;
  darkMode: boolean;
  pinnedQuote: Quote | null;
  onDismissQuote: () => void;
  isQuoteLocked?: boolean;
}

export function JournalHeader({
  currentDate,
  onPreviousDay,
  onNextDay,
  onToday,
  formatDate,
  dateColor,
  dayColor,
  darkMode,
  pinnedQuote,
  onDismissQuote,
  isQuoteLocked = false,
}: JournalHeaderProps) {
  const [isHoveringQuote, setIsHoveringQuote] = useState(false);

  return (
    <div className="mb-4">
      {/* Date Navigation Row */}
      <div className="flex items-center justify-between">
        <button
          onClick={onPreviousDay}
          className={cn(
            'p-2 rounded-full transition-colors',
            darkMode ? 'hover:bg-amber-500/20' : 'hover:bg-amber-100/50'
          )}
        >
          <ChevronLeft className={cn(
            'w-5 h-5 md:w-6 md:h-6',
            darkMode ? 'text-amber-400/60' : 'text-amber-800/60'
          )} />
        </button>

        <button onClick={onToday} className="text-center group">
          <p
            className="text-xs md:text-sm transition-colors tracking-wider"
            style={{ color: dayColor }}
          >
            — {format(currentDate, 'EEEE')} —
          </p>
          <p
            className="text-lg md:text-xl font-bold tracking-wide"
            style={{ color: dateColor }}
          >
            {formatDate(currentDate)}
          </p>
        </button>

        <button
          onClick={onNextDay}
          className={cn(
            'p-2 rounded-full transition-colors',
            darkMode ? 'hover:bg-amber-500/20' : 'hover:bg-amber-100/50'
          )}
        >
          <ChevronRight className={cn(
            'w-5 h-5 md:w-6 md:h-6',
            darkMode ? 'text-amber-400/60' : 'text-amber-800/60'
          )} />
        </button>
      </div>

      {/* Pinned Quote - elegant centered blockquote */}
      <AnimatePresence>
        {pinnedQuote && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="relative mt-3"
            onMouseEnter={() => setIsHoveringQuote(true)}
            onMouseLeave={() => setIsHoveringQuote(false)}
          >
            <blockquote className="text-sm italic text-center max-w-md mx-auto px-6">
              <p className={cn(
                'leading-relaxed',
                darkMode ? 'text-neutral-400' : 'text-neutral-500'
              )}>
                "{pinnedQuote.text}"
              </p>
              <cite className={cn(
                'block text-xs mt-1 not-italic flex items-center justify-center gap-1.5',
                darkMode ? 'text-neutral-500' : 'text-neutral-400'
              )}>
                — {pinnedQuote.author}
                {isQuoteLocked && (
                  <Lock className="w-3 h-3 text-amber-500" />
                )}
              </cite>
            </blockquote>

            {/* Dismiss button - appears on hover, only for non-locked quotes */}
            <AnimatePresence>
              {isHoveringQuote && !isQuoteLocked && (
                <motion.button
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{ duration: 0.15 }}
                  onClick={onDismissQuote}
                  className={cn(
                    'absolute -top-1 right-0 p-1 rounded-full transition-colors',
                    darkMode
                      ? 'hover:bg-neutral-700 text-neutral-500 hover:text-neutral-300'
                      : 'hover:bg-neutral-200 text-neutral-400 hover:text-neutral-600'
                  )}
                  title="Dismiss quote"
                >
                  <X className="w-3.5 h-3.5" />
                </motion.button>
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
