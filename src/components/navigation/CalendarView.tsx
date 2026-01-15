'use client';

import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import {
  format,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  isSameMonth,
  isSameDay,
  addMonths,
  subMonths,
  startOfWeek,
  endOfWeek,
} from 'date-fns';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';
import { cn } from '@/lib/utils/cn';
import { useJournal } from '@/hooks/useJournal';
import type { JournalEntry } from '@/lib/db/instant';

interface CalendarViewProps {
  selectedDate: Date;
  onSelectDate: (date: Date) => void;
  onClose: () => void;
}

export function CalendarView({ selectedDate, onSelectDate, onClose }: CalendarViewProps) {
  const [currentMonth, setCurrentMonth] = useState(selectedDate);
  const { allEntries } = useJournal();

  // Get entry dates as formatted strings for quick lookup
  const entryDates = useMemo(() => {
    return allEntries.map((e: JournalEntry) => format(new Date(e.date), 'yyyy-MM-dd'));
  }, [allEntries]);

  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const calendarStart = startOfWeek(monthStart);
  const calendarEnd = endOfWeek(monthEnd);

  const days = eachDayOfInterval({ start: calendarStart, end: calendarEnd });

  const goToPreviousMonth = () => setCurrentMonth(subMonths(currentMonth, 1));
  const goToNextMonth = () => setCurrentMonth(addMonths(currentMonth, 1));

  const hasEntry = (date: Date) => {
    return entryDates?.includes(format(date, 'yyyy-MM-dd'));
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
        className="bg-white rounded-2xl shadow-2xl p-6 w-[360px]"
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <button
            onClick={goToPreviousMonth}
            className="p-2 rounded-lg hover:bg-amber-100 transition-colors"
          >
            <ChevronLeft className="w-5 h-5 text-amber-700" />
          </button>

          <h2 className="text-lg font-medium text-amber-900">
            {format(currentMonth, 'MMMM yyyy')}
          </h2>

          <button
            onClick={goToNextMonth}
            className="p-2 rounded-lg hover:bg-amber-100 transition-colors"
          >
            <ChevronRight className="w-5 h-5 text-amber-700" />
          </button>
        </div>

        {/* Day headers */}
        <div className="grid grid-cols-7 gap-1 mb-2">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
            <div
              key={day}
              className="text-center text-xs font-medium text-amber-500 py-1"
            >
              {day}
            </div>
          ))}
        </div>

        {/* Calendar grid */}
        <div className="grid grid-cols-7 gap-1">
          {days.map((day) => {
            const isCurrentMonth = isSameMonth(day, currentMonth);
            const isSelected = isSameDay(day, selectedDate);
            const isToday = isSameDay(day, new Date());
            const hasEntryOnDay = hasEntry(day);

            return (
              <button
                key={day.toISOString()}
                onClick={() => onSelectDate(day)}
                disabled={!isCurrentMonth}
                className={cn(
                  'relative aspect-square flex items-center justify-center',
                  'text-sm rounded-lg transition-all',
                  isCurrentMonth
                    ? 'hover:bg-amber-100'
                    : 'text-amber-300 cursor-default',
                  isSelected && 'bg-amber-500 text-white hover:bg-amber-600',
                  isToday && !isSelected && 'ring-2 ring-amber-400'
                )}
              >
                {format(day, 'd')}

                {/* Entry indicator dot */}
                {hasEntryOnDay && !isSelected && (
                  <span className="absolute bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-amber-400" />
                )}
              </button>
            );
          })}
        </div>

        {/* Today button */}
        <div className="mt-4 flex justify-center">
          <button
            onClick={() => {
              setCurrentMonth(new Date());
              onSelectDate(new Date());
            }}
            className="px-4 py-2 text-sm text-amber-700 hover:text-amber-900 hover:bg-amber-100 rounded-lg transition-colors"
          >
            Go to Today
          </button>
        </div>

        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1 rounded-lg hover:bg-amber-100 transition-colors"
        >
          <X className="w-5 h-5 text-amber-600" />
        </button>
      </motion.div>
    </motion.div>
  );
}
