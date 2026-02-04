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
    <div className="mb-6 md:mb-8">
      {/* Date Navigation Row - More generous spacing */}
      <div className="flex items-center justify-between py-2">
        <motion.button
          onClick={onPreviousDay}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          className={cn(
            'p-2.5 md:p-3 rounded-full transition-all duration-200',
            darkMode 
              ? 'hover:bg-amber-500/20 active:bg-amber-500/30' 
              : 'hover:bg-amber-100/70 active:bg-amber-200/50'
          )}
        >
          <ChevronLeft className={cn(
            'w-5 h-5 md:w-6 md:h-6',
            darkMode ? 'text-amber-400/70' : 'text-amber-800/70'
          )} />
        </motion.button>

        <motion.button 
          onClick={onToday} 
          className="text-center group py-1"
          whileHover={{ scale: 1.02 }}
          transition={{ type: 'spring', stiffness: 400, damping: 17 }}
        >
          <p
            className="text-[10px] md:text-xs tracking-[0.2em] uppercase font-medium mb-1 transition-colors duration-200"
            style={{ color: dayColor }}
          >
            {format(currentDate, 'EEEE')}
          </p>
          <p
            className="text-lg md:text-2xl font-bold tracking-wide transition-colors duration-200"
            style={{ color: dateColor, letterSpacing: '0.02em' }}
          >
            {formatDate(currentDate)}
          </p>
        </motion.button>

        <motion.button
          onClick={onNextDay}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          className={cn(
            'p-2.5 md:p-3 rounded-full transition-all duration-200',
            darkMode 
              ? 'hover:bg-amber-500/20 active:bg-amber-500/30' 
              : 'hover:bg-amber-100/70 active:bg-amber-200/50'
          )}
        >
          <ChevronRight className={cn(
            'w-5 h-5 md:w-6 md:h-6',
            darkMode ? 'text-amber-400/70' : 'text-amber-800/70'
          )} />
        </motion.button>
      </div>

      {/* Pinned Quote - elegant centered blockquote with improved styling */}
      <AnimatePresence mode="wait">
        {pinnedQuote && (
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.98 }}
            transition={{ 
              duration: 0.3,
              ease: [0.4, 0, 0.2, 1]
            }}
            className="relative mt-4 md:mt-6"
            onMouseEnter={() => setIsHoveringQuote(true)}
            onMouseLeave={() => setIsHoveringQuote(false)}
          >
            <blockquote className={cn(
              'text-sm md:text-base italic text-center max-w-lg mx-auto px-8 py-4 rounded-lg',
              darkMode ? 'bg-amber-500/5' : 'bg-amber-50/50'
            )}>
              <p className={cn(
                'leading-relaxed font-serif',
                darkMode ? 'text-amber-200/80' : 'text-amber-900/70'
              )}>
                "{pinnedQuote.text}"
              </p>
              <cite className={cn(
                'block text-xs md:text-sm mt-3 not-italic flex items-center justify-center gap-2',
                darkMode ? 'text-amber-300/60' : 'text-amber-700/60'
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
                    'absolute top-2 right-2 p-1.5 rounded-full transition-all duration-200',
                    darkMode
                      ? 'hover:bg-neutral-700 text-neutral-500 hover:text-neutral-300'
                      : 'hover:bg-amber-100 text-amber-400 hover:text-amber-600'
                  )}
                  title="Dismiss quote"
                >
                  <X className="w-4 h-4" />
                </motion.button>
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
