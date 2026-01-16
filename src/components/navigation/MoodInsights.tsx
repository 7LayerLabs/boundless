'use client';

import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import {
  format,
  subDays,
  subMonths,
  startOfWeek,
  endOfWeek,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  isSameDay,
  isWithinInterval,
} from 'date-fns';
import { X, TrendingUp, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils/cn';
import { useJournal } from '@/hooks/useJournal';
import { moods, moodList } from '@/constants/moods';
import type { Mood } from '@/types/journal';
import type { JournalEntry } from '@/lib/db/instant';

interface MoodInsightsProps {
  onClose: () => void;
}

type TimeRange = '7days' | '30days' | 'thisWeek' | 'thisMonth' | 'lastMonth';

export function MoodInsights({ onClose }: MoodInsightsProps) {
  const [timeRange, setTimeRange] = useState<TimeRange>('7days');
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
      case 'lastMonth':
        const lastMonth = subMonths(now, 1);
        return { start: startOfMonth(lastMonth), end: endOfMonth(lastMonth) };
      default:
        return { start: subDays(now, 7), end: now };
    }
  }, [timeRange]);

  // Filter entries for the date range
  const entries = useMemo(() => {
    return allEntries.filter((entry: JournalEntry) => {
      const entryDate = new Date(entry.date);
      return isWithinInterval(entryDate, { start: dateRange.start, end: dateRange.end });
    });
  }, [allEntries, dateRange]);

  // Calculate mood statistics
  const stats = useMemo(() => {
    if (!entries || entries.length === 0) {
      return {
        totalEntries: 0,
        entriesWithMood: 0,
        moodCounts: {} as Record<Mood, number>,
        topMood: null as Mood | null,
        moodTrend: [] as { date: Date; mood: Mood | null }[],
        averageMoodScore: 0,
      };
    }

    const moodCounts: Record<string, number> = {};
    const moodTrend: { date: Date; mood: Mood | null }[] = [];
    let entriesWithMood = 0;

    // Mood scores for calculating average (positive = higher)
    const moodScores: Record<Mood, number> = {
      happy: 5,
      excited: 5,
      grateful: 4,
      calm: 4,
      creative: 4,
      energetic: 4,
      hopeful: 4,
      proud: 4,
      loved: 5,
      content: 4,
      thoughtful: 3,
      confused: 2,
      tired: 2,
      numb: 2,
      lonely: 2,
      anxious: 1,
      sad: 1,
      angry: 1,
      frustrated: 1,
      defeated: 1,
      stressed: 1,
    };

    let totalScore = 0;

    entries.forEach((entry: JournalEntry) => {
      if (entry.mood) {
        moodCounts[entry.mood] = (moodCounts[entry.mood] || 0) + 1;
        entriesWithMood++;
        totalScore += moodScores[entry.mood as Mood] || 3;
      }
      moodTrend.push({ date: new Date(entry.date), mood: entry.mood as Mood | null });
    });

    // Find top mood
    let topMood: Mood | null = null;
    let maxCount = 0;
    Object.entries(moodCounts).forEach(([mood, count]) => {
      if (count > maxCount) {
        maxCount = count;
        topMood = mood as Mood;
      }
    });

    return {
      totalEntries: entries.length,
      entriesWithMood,
      moodCounts: moodCounts as Record<Mood, number>,
      topMood,
      moodTrend: moodTrend.sort((a, b) => a.date.getTime() - b.date.getTime()),
      averageMoodScore: entriesWithMood > 0 ? totalScore / entriesWithMood : 0,
    };
  }, [entries]);

  // Generate insight message
  const insight = useMemo(() => {
    if (stats.entriesWithMood === 0) {
      return "Start tracking your moods to see insights here!";
    }

    const topMoodName = stats.topMood ? moods[stats.topMood].name : '';
    const percentage = Math.round((stats.entriesWithMood / stats.totalEntries) * 100);

    if (stats.averageMoodScore >= 4) {
      return `Great week! You've been feeling mostly ${topMoodName.toLowerCase()}. Keep up the positive energy!`;
    } else if (stats.averageMoodScore >= 3) {
      return `A balanced period with ${topMoodName.toLowerCase()} being your most common mood. ${percentage}% of your entries have mood tracking.`;
    } else {
      return `It's been a challenging time. Remember, it's okay to have tough days. Your most common mood was ${topMoodName.toLowerCase()}.`;
    }
  }, [stats]);

  // Days in range for the mood grid
  const daysInRange = useMemo(() => {
    return eachDayOfInterval({ start: dateRange.start, end: dateRange.end });
  }, [dateRange]);

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
        <div className="px-6 py-4 border-b border-amber-100 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-amber-100 rounded-lg">
              <Sparkles className="w-5 h-5 text-amber-700" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-amber-900">Mood Insights</h2>
              <p className="text-sm text-amber-600">Track your emotional journey</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-amber-100 transition-colors"
          >
            <X className="w-5 h-5 text-amber-600" />
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
              { value: 'lastMonth', label: 'Last Month' },
            ].map((option) => (
              <button
                key={option.value}
                onClick={() => setTimeRange(option.value as TimeRange)}
                className={cn(
                  'px-4 py-2 rounded-lg text-sm font-medium transition-all',
                  timeRange === option.value
                    ? 'bg-amber-500 text-white'
                    : 'bg-amber-50 text-amber-700 hover:bg-amber-100'
                )}
              >
                {option.label}
              </button>
            ))}
          </div>

          {/* Summary Cards */}
          <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl p-4">
              <p className="text-sm text-amber-600 mb-1">Total Entries</p>
              <p className="text-3xl font-bold text-amber-900">{stats.totalEntries}</p>
            </div>
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-4">
              <p className="text-sm text-green-600 mb-1">Moods Tracked</p>
              <p className="text-3xl font-bold text-green-900">{stats.entriesWithMood}</p>
            </div>
            <div className="bg-gradient-to-br from-purple-50 to-violet-50 rounded-xl p-4">
              <p className="text-sm text-purple-600 mb-1">Top Mood</p>
              <p className="text-3xl font-bold text-purple-900">
                {stats.topMood ? moods[stats.topMood].emoji : '—'}
              </p>
            </div>
          </div>

          {/* Insight Message */}
          <div className="bg-gradient-to-r from-amber-100 to-orange-100 rounded-xl p-4 mb-6">
            <div className="flex items-start gap-3">
              <TrendingUp className="w-5 h-5 text-amber-700 mt-0.5 flex-shrink-0" />
              <p className="text-amber-800">{insight}</p>
            </div>
          </div>

          {/* Mood Distribution */}
          {stats.entriesWithMood > 0 && (
            <div className="mb-6">
              <h3 className="text-lg font-medium text-amber-900 mb-3">Mood Distribution</h3>
              <div className="space-y-2">
                {moodList
                  .filter((mood) => stats.moodCounts[mood.id])
                  .sort((a, b) => (stats.moodCounts[b.id] || 0) - (stats.moodCounts[a.id] || 0))
                  .map((mood) => {
                    const count = stats.moodCounts[mood.id] || 0;
                    const percentage = Math.round((count / stats.entriesWithMood) * 100);
                    return (
                      <div key={mood.id} className="flex items-center gap-3">
                        <span className="text-2xl w-8">{mood.emoji}</span>
                        <span className="text-sm text-amber-700 w-24">{mood.name}</span>
                        <div className="flex-1 bg-amber-100 rounded-full h-4 overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${percentage}%` }}
                            transition={{ duration: 0.5, delay: 0.1 }}
                            className="h-full rounded-full"
                            style={{ backgroundColor: mood.color }}
                          />
                        </div>
                        <span className="text-sm font-medium text-amber-800 w-12 text-right">
                          {percentage}%
                        </span>
                      </div>
                    );
                  })}
              </div>
            </div>
          )}

          {/* Mood Calendar Grid */}
          <div>
            <h3 className="text-lg font-medium text-amber-900 mb-3">Daily Moods</h3>
            <div className="grid grid-cols-7 gap-1">
              {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day, i) => (
                <div key={i} className="text-center text-xs text-amber-500 py-1">
                  {day}
                </div>
              ))}
              {daysInRange.map((day) => {
                const entry = entries?.find((e: JournalEntry) => isSameDay(new Date(e.date), day));
                const mood = entry?.mood as Mood | null;
                const moodData = mood ? moods[mood] : null;

                return (
                  <div
                    key={day.toISOString()}
                    className={cn(
                      'aspect-square rounded-lg flex items-center justify-center text-sm',
                      'transition-all hover:scale-110',
                      moodData ? 'cursor-default' : 'bg-stone-100'
                    )}
                    style={{
                      backgroundColor: moodData ? `${moodData.color}30` : undefined,
                    }}
                    title={`${format(day, 'MMM d')}: ${moodData?.name || 'No mood'}`}
                  >
                    {moodData ? (
                      <span className="text-lg">{moodData.emoji}</span>
                    ) : (
                      <span className="text-stone-400 text-xs">{format(day, 'd')}</span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
