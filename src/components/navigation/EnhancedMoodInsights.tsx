'use client';

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  format,
  subDays,
  startOfWeek,
  getDay,
  getHours,
  isWithinInterval,
} from 'date-fns';
import { X, TrendingUp, Calendar, Clock, Lightbulb, ChevronRight, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils/cn';
import { useJournal } from '@/hooks/useJournal';
import { moods, moodList } from '@/constants/moods';
import type { Mood } from '@/types/journal';
import type { JournalEntry } from '@/lib/db/instant';

interface EnhancedMoodInsightsProps {
  onClose: () => void;
}

// Mood energy levels for analysis
const moodEnergy: Record<Mood, 'positive' | 'neutral' | 'negative'> = {
  happy: 'positive',
  excited: 'positive',
  grateful: 'positive',
  calm: 'positive',
  creative: 'positive',
  energetic: 'positive',
  hopeful: 'positive',
  proud: 'positive',
  loved: 'positive',
  content: 'positive',
  thoughtful: 'neutral',
  confused: 'neutral',
  tired: 'negative',
  numb: 'negative',
  lonely: 'negative',
  anxious: 'negative',
  sad: 'negative',
  angry: 'negative',
  frustrated: 'negative',
  defeated: 'negative',
  stressed: 'negative',
};

const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const timeSlots = ['Morning (6-12)', 'Afternoon (12-18)', 'Evening (18-24)', 'Night (0-6)'];

export function EnhancedMoodInsights({ onClose }: EnhancedMoodInsightsProps) {
  const [activeTab, setActiveTab] = useState<'overview' | 'patterns' | 'insights'>('overview');
  const { allEntries } = useJournal();

  // Get entries from last 30 days
  const recentEntries = useMemo(() => {
    const thirtyDaysAgo = subDays(new Date(), 30);
    return allEntries.filter((entry: JournalEntry) => {
      const entryDate = new Date(entry.date);
      return isWithinInterval(entryDate, { start: thirtyDaysAgo, end: new Date() }) && entry.mood;
    });
  }, [allEntries]);

  // Calculate mood statistics
  const moodStats = useMemo(() => {
    const counts: Record<string, number> = {};
    const byDay: Record<number, { positive: number; neutral: number; negative: number; total: number }> = {};
    const byTime: Record<number, { positive: number; neutral: number; negative: number; total: number }> = {};
    
    // Initialize
    for (let i = 0; i < 7; i++) byDay[i] = { positive: 0, neutral: 0, negative: 0, total: 0 };
    for (let i = 0; i < 4; i++) byTime[i] = { positive: 0, neutral: 0, negative: 0, total: 0 };

    recentEntries.forEach((entry: JournalEntry) => {
      const mood = entry.mood as Mood;
      counts[mood] = (counts[mood] || 0) + 1;
      
      const date = new Date(entry.date);
      const dayOfWeek = getDay(date);
      const hour = getHours(date);
      
      const energy = moodEnergy[mood];
      
      // By day of week
      byDay[dayOfWeek][energy]++;
      byDay[dayOfWeek].total++;
      
      // By time of day
      let timeSlot = 0;
      if (hour >= 6 && hour < 12) timeSlot = 0;
      else if (hour >= 12 && hour < 18) timeSlot = 1;
      else if (hour >= 18 && hour < 24) timeSlot = 2;
      else timeSlot = 3;
      
      byTime[timeSlot][energy]++;
      byTime[timeSlot].total++;
    });

    // Calculate positivity percentage
    let totalPositive = 0;
    let totalNegative = 0;
    let totalNeutral = 0;
    
    Object.values(counts).forEach((_, index) => {
      const mood = Object.keys(counts)[index] as Mood;
      const count = counts[mood];
      const energy = moodEnergy[mood];
      if (energy === 'positive') totalPositive += count;
      else if (energy === 'negative') totalNegative += count;
      else totalNeutral += count;
    });

    const total = totalPositive + totalNegative + totalNeutral;
    const positivityRate = total > 0 ? Math.round((totalPositive / total) * 100) : 0;

    return {
      counts,
      byDay,
      byTime,
      positivityRate,
      totalEntries: recentEntries.length,
      totalPositive,
      totalNegative,
      totalNeutral,
    };
  }, [recentEntries]);

  // Generate insights
  const insights = useMemo(() => {
    const results: { icon: string; title: string; description: string; type: 'positive' | 'neutral' | 'actionable' }[] = [];

    // Best day analysis
    let bestDay = 0;
    let bestDayRate = 0;
    Object.entries(moodStats.byDay).forEach(([day, data]) => {
      if (data.total >= 2) {
        const rate = data.positive / data.total;
        if (rate > bestDayRate) {
          bestDayRate = rate;
          bestDay = parseInt(day);
        }
      }
    });
    
    if (bestDayRate > 0.5) {
      results.push({
        icon: '📅',
        title: `${dayNames[bestDay]}s are your best days`,
        description: `You tend to feel more positive on ${dayNames[bestDay]}s. Consider why that might be.`,
        type: 'positive',
      });
    }

    // Worst day analysis
    let worstDay = 0;
    let worstDayRate = 1;
    Object.entries(moodStats.byDay).forEach(([day, data]) => {
      if (data.total >= 2) {
        const rate = data.negative / data.total;
        if (rate > (moodStats.byDay[worstDay]?.negative || 0) / (moodStats.byDay[worstDay]?.total || 1)) {
          worstDayRate = rate;
          worstDay = parseInt(day);
        }
      }
    });
    
    if (worstDayRate > 0.3) {
      results.push({
        icon: '🔍',
        title: `${dayNames[worstDay]}s might need attention`,
        description: `You often feel more challenged on ${dayNames[worstDay]}s. What could make these days easier?`,
        type: 'actionable',
      });
    }

    // Time of day analysis
    let bestTime = 0;
    let bestTimeRate = 0;
    Object.entries(moodStats.byTime).forEach(([time, data]) => {
      if (data.total >= 2) {
        const rate = data.positive / data.total;
        if (rate > bestTimeRate) {
          bestTimeRate = rate;
          bestTime = parseInt(time);
        }
      }
    });
    
    if (bestTimeRate > 0.5) {
      results.push({
        icon: '⏰',
        title: `${timeSlots[bestTime]} is your sweet spot`,
        description: 'Consider doing important tasks during this time when your mood is typically better.',
        type: 'positive',
      });
    }

    // Overall positivity
    if (moodStats.positivityRate >= 70) {
      results.push({
        icon: '🌟',
        title: 'You\'re thriving!',
        description: `${moodStats.positivityRate}% positive moods this month. Keep doing what you're doing!`,
        type: 'positive',
      });
    } else if (moodStats.positivityRate >= 50) {
      results.push({
        icon: '⚖️',
        title: 'Balanced emotional range',
        description: `You're experiencing a healthy mix of emotions. That's completely normal.`,
        type: 'neutral',
      });
    } else if (moodStats.positivityRate < 40 && moodStats.totalEntries >= 7) {
      results.push({
        icon: '💙',
        title: 'Consider reaching out',
        description: 'Your recent moods suggest you might benefit from extra support. That\'s okay.',
        type: 'actionable',
      });
    }

    // Most common mood
    const topMood = Object.entries(moodStats.counts).sort((a, b) => b[1] - a[1])[0];
    if (topMood) {
      const moodData = moods[topMood[0] as Mood];
      results.push({
        icon: moodData.emoji,
        title: `"${moodData.name}" is your signature mood`,
        description: `You felt ${moodData.name.toLowerCase()} ${topMood[1]} times this month.`,
        type: moodEnergy[topMood[0] as Mood] === 'positive' ? 'positive' : 'neutral',
      });
    }

    // Streak insight
    if (moodStats.totalEntries >= 14) {
      results.push({
        icon: '🔥',
        title: 'Great tracking consistency!',
        description: 'Tracking your mood regularly helps you understand patterns and make positive changes.',
        type: 'positive',
      });
    } else if (moodStats.totalEntries < 7) {
      results.push({
        icon: '📝',
        title: 'Track more to unlock insights',
        description: 'Log your mood daily for a week to see meaningful patterns emerge.',
        type: 'actionable',
      });
    }

    return results;
  }, [moodStats]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4"
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
            <div className="p-2 bg-gradient-to-br from-purple-100 to-pink-100 rounded-xl">
              <Sparkles className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-800">Mood Insights</h2>
              <p className="text-sm text-gray-500">Last 30 days • {moodStats.totalEntries} entries</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-100">
          {[
            { id: 'overview', label: 'Overview', icon: TrendingUp },
            { id: 'patterns', label: 'Patterns', icon: Calendar },
            { id: 'insights', label: 'Insights', icon: Lightbulb },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as typeof activeTab)}
              className={cn(
                'flex-1 flex items-center justify-center gap-2 px-4 py-3 text-sm font-medium transition-all',
                activeTab === tab.id
                  ? 'text-purple-600 border-b-2 border-purple-600 bg-purple-50/50'
                  : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
              )}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(85vh-150px)]">
          <AnimatePresence mode="wait">
            {activeTab === 'overview' && (
              <motion.div
                key="overview"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-6"
              >
                {/* Positivity meter */}
                <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-6">
                  <h3 className="text-sm font-medium text-purple-700 mb-4">Positivity Rate</h3>
                  <div className="flex items-center gap-6">
                    <div className="relative w-32 h-32">
                      <svg className="w-full h-full transform -rotate-90">
                        <circle
                          cx="64"
                          cy="64"
                          r="56"
                          fill="none"
                          stroke="#e9d5ff"
                          strokeWidth="12"
                        />
                        <motion.circle
                          cx="64"
                          cy="64"
                          r="56"
                          fill="none"
                          stroke="url(#gradient)"
                          strokeWidth="12"
                          strokeLinecap="round"
                          strokeDasharray={`${moodStats.positivityRate * 3.52} 352`}
                          initial={{ strokeDasharray: '0 352' }}
                          animate={{ strokeDasharray: `${moodStats.positivityRate * 3.52} 352` }}
                          transition={{ duration: 1, ease: 'easeOut' }}
                        />
                        <defs>
                          <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                            <stop offset="0%" stopColor="#a855f7" />
                            <stop offset="100%" stopColor="#ec4899" />
                          </linearGradient>
                        </defs>
                      </svg>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-3xl font-bold text-purple-700">{moodStats.positivityRate}%</span>
                      </div>
                    </div>
                    <div className="flex-1 space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Positive</span>
                        <span className="font-medium text-green-600">{moodStats.totalPositive}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Neutral</span>
                        <span className="font-medium text-amber-600">{moodStats.totalNeutral}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Challenging</span>
                        <span className="font-medium text-purple-600">{moodStats.totalNegative}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Top moods */}
                <div>
                  <h3 className="text-sm font-medium text-gray-700 mb-3">Your Top Moods</h3>
                  <div className="space-y-2">
                    {Object.entries(moodStats.counts)
                      .sort((a, b) => b[1] - a[1])
                      .slice(0, 5)
                      .map(([moodId, count], index) => {
                        const mood = moods[moodId as Mood];
                        const percentage = Math.round((count / moodStats.totalEntries) * 100);
                        return (
                          <div key={moodId} className="flex items-center gap-3">
                            <span className="text-2xl">{mood.emoji}</span>
                            <div className="flex-1">
                              <div className="flex items-center justify-between mb-1">
                                <span className="text-sm font-medium text-gray-700">{mood.name}</span>
                                <span className="text-xs text-gray-500">{count} times ({percentage}%)</span>
                              </div>
                              <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                                <motion.div
                                  initial={{ width: 0 }}
                                  animate={{ width: `${percentage}%` }}
                                  transition={{ duration: 0.5, delay: index * 0.1 }}
                                  className="h-full rounded-full"
                                  style={{ backgroundColor: mood.color }}
                                />
                              </div>
                            </div>
                          </div>
                        );
                      })}
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === 'patterns' && (
              <motion.div
                key="patterns"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-6"
              >
                {/* By day of week */}
                <div>
                  <h3 className="text-sm font-medium text-gray-700 mb-3 flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    By Day of Week
                  </h3>
                  <div className="grid grid-cols-7 gap-2">
                    {dayNames.map((day, index) => {
                      const data = moodStats.byDay[index];
                      const positiveRate = data.total > 0 ? Math.round((data.positive / data.total) * 100) : 0;
                      return (
                        <div key={day} className="text-center">
                          <p className="text-xs text-gray-500 mb-2">{day.slice(0, 3)}</p>
                          <div
                            className={cn(
                              'h-16 rounded-lg flex items-end justify-center p-1 transition-all',
                              data.total === 0
                                ? 'bg-gray-100'
                                : positiveRate >= 60
                                ? 'bg-green-100'
                                : positiveRate >= 40
                                ? 'bg-amber-100'
                                : 'bg-purple-100'
                            )}
                          >
                            {data.total > 0 && (
                              <div
                                className={cn(
                                  'w-full rounded',
                                  positiveRate >= 60 ? 'bg-green-400' : positiveRate >= 40 ? 'bg-amber-400' : 'bg-purple-400'
                                )}
                                style={{ height: `${Math.max(positiveRate, 10)}%` }}
                              />
                            )}
                          </div>
                          <p className="text-xs text-gray-600 mt-1">
                            {data.total > 0 ? `${positiveRate}%` : '-'}
                          </p>
                        </div>
                      );
                    })}
                  </div>
                  <p className="text-xs text-gray-400 text-center mt-2">% positive moods by day</p>
                </div>

                {/* By time of day */}
                <div>
                  <h3 className="text-sm font-medium text-gray-700 mb-3 flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    By Time of Day
                  </h3>
                  <div className="space-y-3">
                    {timeSlots.map((slot, index) => {
                      const data = moodStats.byTime[index];
                      const positiveRate = data.total > 0 ? Math.round((data.positive / data.total) * 100) : 0;
                      return (
                        <div key={slot} className="flex items-center gap-4">
                          <span className="text-sm text-gray-600 w-36">{slot}</span>
                          <div className="flex-1 h-6 bg-gray-100 rounded-full overflow-hidden">
                            {data.total > 0 ? (
                              <div className="h-full flex">
                                <div
                                  className="bg-green-400 transition-all"
                                  style={{ width: `${(data.positive / data.total) * 100}%` }}
                                />
                                <div
                                  className="bg-amber-400 transition-all"
                                  style={{ width: `${(data.neutral / data.total) * 100}%` }}
                                />
                                <div
                                  className="bg-purple-400 transition-all"
                                  style={{ width: `${(data.negative / data.total) * 100}%` }}
                                />
                              </div>
                            ) : (
                              <div className="h-full flex items-center justify-center text-xs text-gray-400">
                                No data
                              </div>
                            )}
                          </div>
                          <span className="text-sm text-gray-600 w-8">{data.total}</span>
                        </div>
                      );
                    })}
                  </div>
                  <div className="flex items-center justify-center gap-4 mt-3 text-xs text-gray-500">
                    <span className="flex items-center gap-1">
                      <span className="w-3 h-3 rounded bg-green-400" /> Positive
                    </span>
                    <span className="flex items-center gap-1">
                      <span className="w-3 h-3 rounded bg-amber-400" /> Neutral
                    </span>
                    <span className="flex items-center gap-1">
                      <span className="w-3 h-3 rounded bg-purple-400" /> Challenging
                    </span>
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === 'insights' && (
              <motion.div
                key="insights"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-4"
              >
                {insights.length > 0 ? (
                  insights.map((insight, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className={cn(
                        'p-4 rounded-xl border-2',
                        insight.type === 'positive'
                          ? 'bg-green-50 border-green-200'
                          : insight.type === 'actionable'
                          ? 'bg-amber-50 border-amber-200'
                          : 'bg-gray-50 border-gray-200'
                      )}
                    >
                      <div className="flex items-start gap-3">
                        <span className="text-2xl">{insight.icon}</span>
                        <div className="flex-1">
                          <p className="font-medium text-gray-800">{insight.title}</p>
                          <p className="text-sm text-gray-600 mt-1">{insight.description}</p>
                        </div>
                        {insight.type === 'actionable' && (
                          <ChevronRight className="w-5 h-5 text-amber-500 flex-shrink-0" />
                        )}
                      </div>
                    </motion.div>
                  ))
                ) : (
                  <div className="text-center py-12">
                    <Lightbulb className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500">Track more moods to unlock personalized insights</p>
                    <p className="text-sm text-gray-400 mt-2">
                      We need at least 7 entries to find patterns
                    </p>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </motion.div>
  );
}
