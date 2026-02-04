'use client';

import { useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Flame, Trophy, Star, Zap, Crown, X } from 'lucide-react';
import { differenceInDays } from 'date-fns';
import { cn } from '@/lib/utils/cn';
import { useJournal } from '@/hooks/useJournal';
import type { JournalEntry } from '@/lib/db/instant';

// Milestone definitions with rewards
const MILESTONES = [
  { days: 3, emoji: '🌱', title: 'Seedling', description: 'You planted the seed!', color: 'from-green-400 to-green-600' },
  { days: 7, emoji: '🔥', title: 'Week Warrior', description: 'One full week!', color: 'from-orange-400 to-red-500' },
  { days: 14, emoji: '⭐', title: 'Rising Star', description: 'Two weeks strong!', color: 'from-yellow-400 to-amber-500' },
  { days: 21, emoji: '🧠', title: 'Habit Formed', description: '21 days - officially a habit!', color: 'from-purple-400 to-purple-600' },
  { days: 30, emoji: '💎', title: 'Diamond Mind', description: 'One month milestone!', color: 'from-cyan-400 to-blue-500' },
  { days: 50, emoji: '🚀', title: 'Momentum Master', description: '50 days of growth!', color: 'from-pink-400 to-rose-500' },
  { days: 75, emoji: '👑', title: 'Journal Royalty', description: '75 days - you\'re dedicated!', color: 'from-amber-400 to-yellow-500' },
  { days: 100, emoji: '🏆', title: 'Century Club', description: '100 days! Incredible!', color: 'from-indigo-400 to-purple-500' },
  { days: 180, emoji: '🌟', title: 'Half-Year Hero', description: '6 months of journaling!', color: 'from-teal-400 to-emerald-500' },
  { days: 365, emoji: '🎯', title: 'Year Champion', description: 'A full year! Legendary!', color: 'from-rose-400 to-red-600' },
];

interface StreakDisplayProps {
  compact?: boolean;
  className?: string;
}

export function StreakDisplay({ compact = false, className }: StreakDisplayProps) {
  const { allEntries } = useJournal();
  const [showMilestones, setShowMilestones] = useState(false);

  // Calculate current streak
  const streakData = useMemo(() => {
    if (!allEntries || allEntries.length === 0) {
      return { currentStreak: 0, longestStreak: 0, totalEntries: 0 };
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Get unique dates with entries
    const entryDates = new Set(
      allEntries.map((e: JournalEntry) => {
        const d = new Date(e.date);
        d.setHours(0, 0, 0, 0);
        return d.getTime();
      })
    );

    // Calculate current streak
    let currentStreak = 0;
    let checkDate = new Date(today);
    
    // If no entry today, start from yesterday
    if (!entryDates.has(checkDate.getTime())) {
      checkDate.setDate(checkDate.getDate() - 1);
    }

    while (entryDates.has(checkDate.getTime())) {
      currentStreak++;
      checkDate.setDate(checkDate.getDate() - 1);
    }

    // Calculate longest streak
    let longestStreak = 0;
    let tempStreak = 0;
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

    return { currentStreak, longestStreak, totalEntries: allEntries.length };
  }, [allEntries]);

  // Find current milestone and next milestone
  const currentMilestone = useMemo(() => {
    const achieved = MILESTONES.filter(m => streakData.currentStreak >= m.days);
    return achieved.length > 0 ? achieved[achieved.length - 1] : null;
  }, [streakData.currentStreak]);

  const nextMilestone = useMemo(() => {
    return MILESTONES.find(m => m.days > streakData.currentStreak) || null;
  }, [streakData.currentStreak]);

  const progressToNext = useMemo(() => {
    if (!nextMilestone) return 100;
    const prevMilestone = currentMilestone?.days || 0;
    const range = nextMilestone.days - prevMilestone;
    const progress = streakData.currentStreak - prevMilestone;
    return Math.round((progress / range) * 100);
  }, [currentMilestone, nextMilestone, streakData.currentStreak]);

  // Compact version for sidebar/header
  if (compact) {
    return (
      <button
        onClick={() => setShowMilestones(true)}
        className={cn(
          'flex items-center gap-2 px-3 py-2 rounded-xl transition-all',
          'bg-gradient-to-r from-amber-100 to-orange-100',
          'hover:from-amber-200 hover:to-orange-200',
          'border border-amber-200/50',
          className
        )}
      >
        <div className="relative">
          <Flame className={cn(
            'w-5 h-5',
            streakData.currentStreak > 0 ? 'text-orange-500' : 'text-amber-300'
          )} />
          {streakData.currentStreak >= 7 && (
            <motion.div
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full"
            />
          )}
        </div>
        <span className={cn(
          'font-bold text-lg',
          streakData.currentStreak > 0 ? 'text-orange-600' : 'text-amber-400'
        )}>
          {streakData.currentStreak}
        </span>
        {currentMilestone && (
          <span className="text-lg">{currentMilestone.emoji}</span>
        )}
      </button>
    );
  }

  return (
    <>
      {/* Full streak display */}
      <div className={cn(
        'bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl p-6 border border-amber-200/50',
        className
      )}>
        {/* Main streak count */}
        <div className="text-center mb-6">
          <div className="relative inline-block">
            <motion.div
              animate={streakData.currentStreak > 0 ? { 
                scale: [1, 1.05, 1],
              } : {}}
              transition={{ duration: 2, repeat: Infinity }}
              className="relative"
            >
              {streakData.currentStreak > 0 ? (
                <Flame className="w-16 h-16 text-orange-500 mx-auto" />
              ) : (
                <Flame className="w-16 h-16 text-amber-200 mx-auto" />
              )}
              {currentMilestone && (
                <span className="absolute -top-2 -right-2 text-3xl">
                  {currentMilestone.emoji}
                </span>
              )}
            </motion.div>
          </div>
          <p className="text-5xl font-bold text-amber-900 mt-2">
            {streakData.currentStreak}
          </p>
          <p className="text-amber-600 font-medium">
            {streakData.currentStreak === 1 ? 'day streak' : 'day streak'}
          </p>
          {currentMilestone && (
            <p className="text-sm text-amber-500 mt-1">
              {currentMilestone.title}
            </p>
          )}
        </div>

        {/* Progress to next milestone */}
        {nextMilestone && (
          <div className="mb-6">
            <div className="flex items-center justify-between text-sm mb-2">
              <span className="text-amber-600">Next: {nextMilestone.title}</span>
              <span className="text-amber-500">{nextMilestone.days - streakData.currentStreak} days to go</span>
            </div>
            <div className="h-3 bg-amber-100 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${progressToNext}%` }}
                transition={{ duration: 0.5 }}
                className={cn(
                  'h-full rounded-full bg-gradient-to-r',
                  nextMilestone.color
                )}
              />
            </div>
          </div>
        )}

        {/* Stats row */}
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="bg-white/50 rounded-xl p-3 text-center">
            <div className="flex items-center justify-center gap-1 mb-1">
              <Trophy className="w-4 h-4 text-amber-500" />
              <span className="text-xs text-amber-600">Best Streak</span>
            </div>
            <p className="text-2xl font-bold text-amber-800">{streakData.longestStreak}</p>
          </div>
          <div className="bg-white/50 rounded-xl p-3 text-center">
            <div className="flex items-center justify-center gap-1 mb-1">
              <Star className="w-4 h-4 text-amber-500" />
              <span className="text-xs text-amber-600">Total Entries</span>
            </div>
            <p className="text-2xl font-bold text-amber-800">{streakData.totalEntries}</p>
          </div>
        </div>

        {/* View all milestones button */}
        <button
          onClick={() => setShowMilestones(true)}
          className="w-full py-2.5 bg-amber-100 hover:bg-amber-200 text-amber-700 rounded-xl transition-colors text-sm font-medium flex items-center justify-center gap-2"
        >
          <Crown className="w-4 h-4" />
          View All Milestones
        </button>
      </div>

      {/* Milestones modal */}
      <AnimatePresence>
        {showMilestones && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4"
            onClick={() => setShowMilestones(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-2xl shadow-2xl w-full max-w-md max-h-[80vh] overflow-hidden"
            >
              {/* Header */}
              <div className="px-6 py-4 border-b border-amber-100 flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-semibold text-amber-900">Milestones</h2>
                  <p className="text-sm text-amber-600">Your journaling journey</p>
                </div>
                <button
                  onClick={() => setShowMilestones(false)}
                  className="p-2 rounded-lg hover:bg-amber-100 transition-colors"
                >
                  <X className="w-5 h-5 text-amber-600" />
                </button>
              </div>

              {/* Milestones list */}
              <div className="p-4 overflow-y-auto max-h-[60vh]">
                <div className="space-y-3">
                  {MILESTONES.map((milestone, index) => {
                    const isAchieved = streakData.currentStreak >= milestone.days;
                    const isCurrent = currentMilestone?.days === milestone.days;
                    const isNext = nextMilestone?.days === milestone.days;

                    return (
                      <motion.div
                        key={milestone.days}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className={cn(
                          'relative p-4 rounded-xl border-2 transition-all',
                          isAchieved
                            ? 'bg-gradient-to-r ' + milestone.color + ' border-transparent text-white'
                            : isNext
                            ? 'bg-amber-50 border-amber-300 border-dashed'
                            : 'bg-gray-50 border-gray-200'
                        )}
                      >
                        <div className="flex items-center gap-4">
                          <span className={cn(
                            'text-3xl',
                            !isAchieved && 'grayscale opacity-50'
                          )}>
                            {milestone.emoji}
                          </span>
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <p className={cn(
                                'font-bold',
                                isAchieved ? 'text-white' : 'text-gray-700'
                              )}>
                                {milestone.title}
                              </p>
                              {isCurrent && (
                                <span className="px-2 py-0.5 bg-white/20 text-white text-xs rounded-full">
                                  Current
                                </span>
                              )}
                              {isNext && (
                                <span className="px-2 py-0.5 bg-amber-200 text-amber-700 text-xs rounded-full">
                                  Next
                                </span>
                              )}
                            </div>
                            <p className={cn(
                              'text-sm',
                              isAchieved ? 'text-white/80' : 'text-gray-500'
                            )}>
                              {milestone.description}
                            </p>
                          </div>
                          <div className={cn(
                            'text-right',
                            isAchieved ? 'text-white/80' : 'text-gray-400'
                          )}>
                            <p className="text-lg font-bold">{milestone.days}</p>
                            <p className="text-xs">days</p>
                          </div>
                        </div>

                        {/* Checkmark for achieved */}
                        {isAchieved && (
                          <div className="absolute -top-2 -right-2 w-6 h-6 bg-white rounded-full flex items-center justify-center shadow-md">
                            <Zap className="w-4 h-4 text-amber-500" />
                          </div>
                        )}
                      </motion.div>
                    );
                  })}
                </div>
              </div>

              {/* Footer */}
              <div className="px-6 py-4 bg-amber-50 border-t border-amber-100">
                <p className="text-center text-sm text-amber-600">
                  🔥 Keep your streak alive by writing daily
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
