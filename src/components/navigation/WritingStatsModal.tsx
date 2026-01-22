'use client';

import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import {
  X,
  BarChart2,
  FileText,
  Flame,
  TrendingUp,
  Calendar,
} from 'lucide-react';
import {
  format,
  subDays,
  subMonths,
  startOfWeek,
  endOfWeek,
  startOfMonth,
  endOfMonth,
  isWithinInterval,
  differenceInDays,
  eachDayOfInterval,
  isSameDay,
} from 'date-fns';
import { cn } from '@/lib/utils/cn';
import { useJournal } from '@/hooks/useJournal';
import type { JournalEntry } from '@/lib/db/instant';

interface WritingStatsModalProps {
  onClose: () => void;
}

type TimeRange = '7days' | '30days' | 'thisWeek' | 'thisMonth' | 'allTime';

export function WritingStatsModal({ onClose }: WritingStatsModalProps) {
  const [timeRange, setTimeRange] = useState<TimeRange>('30days');
  const { allEntries } = useJournal();

  // Calculate date range
  const dateRange = useMemo(() => {
    const now = new Date();
    switch (timeRange) {
      case '7days':
        return { start: subDays(now, 7), end: now };
      case '30days':
        return { start: subDays(now, 30), end: now };
      case 'thisWeek':
        return { start: startOfWeek(now), end: endOfWeek(now) };
      case 'thisMonth':
        return { start: startOfMonth(now), end: endOfMonth(now) };
      case 'allTime':
        return { start: new Date(0), end: now };
      default:
        return { start: subDays(now, 30), end: now };
    }
  }, [timeRange]);

  // Filter entries for the date range
  const filteredEntries = useMemo(() => {
    if (timeRange === 'allTime') return allEntries;
    return allEntries.filter((entry: JournalEntry) => {
      const entryDate = new Date(entry.date);
      return isWithinInterval(entryDate, { start: dateRange.start, end: dateRange.end });
    });
  }, [allEntries, dateRange, timeRange]);

  // Calculate stats
  const stats = useMemo(() => {
    const totalWords = filteredEntries.reduce((sum: number, entry: JournalEntry) => sum + (entry.wordCount || 0), 0);
    const totalEntries = filteredEntries.length;
    const avgWordsPerEntry = totalEntries > 0 ? Math.round(totalWords / totalEntries) : 0;

    // Calculate writing streak
    let currentStreak = 0;
    let longestStreak = 0;
    let tempStreak = 0;
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Get all unique dates with entries
    const entryDates = new Set(
      allEntries.map((e: JournalEntry) => {
        const d = new Date(e.date);
        d.setHours(0, 0, 0, 0);
        return d.getTime();
      })
    );

    // Check current streak (consecutive days from today/yesterday)
    let checkDate = new Date(today);
    // If no entry today, start from yesterday
    if (!entryDates.has(checkDate.getTime())) {
      checkDate.setDate(checkDate.getDate() - 1);
    }

    while (entryDates.has(checkDate.getTime())) {
      currentStreak++;
      checkDate.setDate(checkDate.getDate() - 1);
    }

    // Calculate longest streak (from all entries)
    const sortedDates = Array.from(entryDates).sort((a, b) => a - b);
    for (let i = 0; i < sortedDates.length; i++) {
      if (i === 0) {
        tempStreak = 1;
      } else {
        const diff = differenceInDays(new Date(sortedDates[i]), new Date(sortedDates[i - 1]));
        if (diff === 1) {
          tempStreak++;
        } else {
          tempStreak = 1;
        }
      }
      longestStreak = Math.max(longestStreak, tempStreak);
    }

    // Entries this month
    const monthStart = startOfMonth(new Date());
    const monthEnd = endOfMonth(new Date());
    const entriesThisMonth = allEntries.filter((e: JournalEntry) => {
      const entryDate = new Date(e.date);
      return isWithinInterval(entryDate, { start: monthStart, end: monthEnd });
    }).length;

    return {
      totalWords,
      totalEntries,
      avgWordsPerEntry,
      currentStreak,
      longestStreak,
      entriesThisMonth,
    };
  }, [filteredEntries, allEntries]);

  // Daily word counts for chart
  const dailyWordCounts = useMemo(() => {
    if (timeRange === 'allTime') return [];

    const days = eachDayOfInterval({ start: dateRange.start, end: dateRange.end });
    return days.map((day) => {
      const dayEntries = filteredEntries.filter((e: JournalEntry) =>
        isSameDay(new Date(e.date), day)
      );
      const wordCount = dayEntries.reduce((sum: number, e: JournalEntry) => sum + (e.wordCount || 0), 0);
      return { date: day, wordCount };
    });
  }, [filteredEntries, dateRange, timeRange]);

  const maxWordCount = Math.max(...dailyWordCounts.map((d) => d.wordCount), 1);

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
        <div className="px-6 py-4 border-b border-amber-200 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-amber-100 rounded-lg">
              <BarChart2 className="w-5 h-5 text-stone-700" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-stone-800">Writing Stats</h2>
              <p className="text-sm text-stone-600">Track your journaling journey</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-amber-100 transition-colors"
          >
            <X className="w-5 h-5 text-stone-600" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(85vh-80px)]">
          {/* Time Range Selector */}
          <div className="flex flex-wrap gap-2 mb-6">
            {[
              { value: '7days', label: 'Last 7 Days' },
              { value: '30days', label: 'Last 30 Days' },
              { value: 'thisWeek', label: 'This Week' },
              { value: 'thisMonth', label: 'This Month' },
              { value: 'allTime', label: 'All Time' },
            ].map((option) => (
              <button
                key={option.value}
                onClick={() => setTimeRange(option.value as TimeRange)}
                className={cn(
                  'px-4 py-2 rounded-lg text-sm font-medium transition-all',
                  timeRange === option.value
                    ? 'bg-stone-800 text-white'
                    : 'bg-amber-100 text-stone-700 hover:bg-amber-200'
                )}
              >
                {option.label}
              </button>
            ))}
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-blue-50 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-1">
                <TrendingUp className="w-4 h-4 text-blue-600" />
                <p className="text-sm text-blue-600">Total Words</p>
              </div>
              <p className="text-3xl font-bold text-blue-900">{stats.totalWords.toLocaleString()}</p>
            </div>

            <div className="bg-green-50 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-1">
                <FileText className="w-4 h-4 text-green-600" />
                <p className="text-sm text-green-600">Total Entries</p>
              </div>
              <p className="text-3xl font-bold text-green-900">{stats.totalEntries}</p>
            </div>

            <div className="bg-purple-50 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-1">
                <BarChart2 className="w-4 h-4 text-purple-600" />
                <p className="text-sm text-purple-600">Avg Words/Entry</p>
              </div>
              <p className="text-3xl font-bold text-purple-900">{stats.avgWordsPerEntry}</p>
            </div>

            <div className="bg-orange-50 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-1">
                <Flame className="w-4 h-4 text-orange-600" />
                <p className="text-sm text-orange-600">Current Streak</p>
              </div>
              <p className="text-3xl font-bold text-orange-900">{stats.currentStreak} days</p>
            </div>

            <div className="bg-red-50 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-1">
                <Flame className="w-4 h-4 text-red-600" />
                <p className="text-sm text-red-600">Longest Streak</p>
              </div>
              <p className="text-3xl font-bold text-red-900">{stats.longestStreak} days</p>
            </div>

            <div className="bg-amber-50 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-1">
                <Calendar className="w-4 h-4 text-amber-600" />
                <p className="text-sm text-amber-600">This Month</p>
              </div>
              <p className="text-3xl font-bold text-amber-900">{stats.entriesThisMonth} entries</p>
            </div>
          </div>

          {/* Word Count Chart */}
          {timeRange !== 'allTime' && dailyWordCounts.length > 0 && (
            <div>
              <h3 className="text-lg font-medium text-stone-800 mb-3">Daily Words</h3>
              <div className="bg-neutral-50 rounded-xl p-4">
                <div className="flex items-end gap-1 h-32">
                  {dailyWordCounts.map((day, index) => (
                    <div
                      key={index}
                      className="flex-1 flex flex-col items-center gap-1"
                    >
                      <motion.div
                        initial={{ height: 0 }}
                        animate={{ height: `${(day.wordCount / maxWordCount) * 100}%` }}
                        transition={{ duration: 0.5, delay: index * 0.02 }}
                        className={cn(
                          'w-full rounded-t',
                          day.wordCount > 0 ? 'bg-stone-800' : 'bg-amber-200'
                        )}
                        style={{ minHeight: day.wordCount > 0 ? '4px' : '2px' }}
                        title={`${format(day.date, 'MMM d')}: ${day.wordCount} words`}
                      />
                    </div>
                  ))}
                </div>
                <div className="flex justify-between mt-2 text-xs text-stone-600">
                  <span>{format(dateRange.start, 'MMM d')}</span>
                  <span>{format(dateRange.end, 'MMM d')}</span>
                </div>
              </div>
            </div>
          )}

          {/* Motivational message */}
          <div className="mt-6 bg-amber-100 rounded-xl p-4">
            <p className="text-stone-700 text-center">
              {stats.currentStreak > 0
                ? `You're on a ${stats.currentStreak}-day streak! Keep it going!`
                : stats.totalEntries > 0
                ? "Write today to start a new streak!"
                : "Start your journaling journey today!"}
            </p>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
