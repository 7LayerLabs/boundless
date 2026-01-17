'use client';

import { format } from 'date-fns';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils/cn';

interface DateNavigationProps {
  currentDate: Date;
  onPreviousDay: () => void;
  onNextDay: () => void;
  onToday: () => void;
  dateColor: string;
  dayColor: string;
  darkMode: boolean;
  formatDate: (date: Date) => string;
}

export function DateNavigation({
  currentDate,
  onPreviousDay,
  onNextDay,
  onToday,
  dateColor,
  dayColor,
  darkMode,
}: DateNavigationProps) {
  const formatDisplayDate = (date: Date) => {
    return format(date, 'MMMM d, yyyy').toUpperCase();
  };

  return (
    <div className="flex items-center justify-between mb-6 md:mb-8">
      <button
        onClick={onPreviousDay}
        className={cn(
          'p-2 md:p-3 rounded-full transition-colors',
          darkMode ? 'hover:bg-amber-500/20' : 'hover:bg-amber-100/50'
        )}
      >
        <ChevronLeft className={cn(
          'w-6 h-6 md:w-8 md:h-8',
          darkMode ? 'text-amber-400/60' : 'text-amber-800/60'
        )} />
      </button>

      <button onClick={onToday} className="text-center group">
        <p
          className="text-sm md:text-base transition-colors tracking-wider"
          style={{ color: dayColor }}
        >
          — {format(currentDate, 'EEEE')} —
        </p>
        <p
          className="text-xl md:text-2xl font-bold tracking-wide mt-1"
          style={{ color: dateColor }}
        >
          {formatDisplayDate(currentDate)}
        </p>
      </button>

      <button
        onClick={onNextDay}
        className={cn(
          'p-2 md:p-3 rounded-full transition-colors',
          darkMode ? 'hover:bg-amber-500/20' : 'hover:bg-amber-100/50'
        )}
      >
        <ChevronRight className={cn(
          'w-6 h-6 md:w-8 md:h-8',
          darkMode ? 'text-amber-400/60' : 'text-amber-800/60'
        )} />
      </button>
    </div>
  );
}
