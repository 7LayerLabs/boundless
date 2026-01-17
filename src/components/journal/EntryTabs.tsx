'use client';

import { format } from 'date-fns';
import { Plus, Lock, Unlock, Bookmark } from 'lucide-react';
import { cn } from '@/lib/utils/cn';
import { moods } from '@/constants/moods';
import type { JournalEntry } from '@/lib/db/instant';

interface EntryTabsProps {
  dayEntries: JournalEntry[];
  selectedEntryId: string | null;
  currentEntry: JournalEntry | null;
  isPastDay: boolean;
  darkMode: boolean;
  onSelectEntry: (entryId: string) => void;
  onNewEntry: () => void;
  onToggleBookmark: (entryId: string) => void;
  onLockEntry: () => void;
}

export function EntryTabs({
  dayEntries,
  selectedEntryId,
  currentEntry,
  isPastDay,
  darkMode,
  onSelectEntry,
  onNewEntry,
  onToggleBookmark,
  onLockEntry,
}: EntryTabsProps) {
  const formatEntryTime = (timestamp: number) => {
    return format(new Date(timestamp), 'h:mm a');
  };

  return (
    <div className={cn(
      'flex items-center gap-2 mb-4 pb-3 border-b',
      darkMode ? 'border-amber-500/20' : 'border-amber-200/50'
    )}>
      <div className="flex-1 flex items-center gap-1 overflow-x-auto">
        {dayEntries.map((entry, index) => {
          const moodColor = entry.mood && moods[entry.mood as keyof typeof moods]?.color;
          const isSelected = selectedEntryId === entry.id;

          return (
            <button
              key={entry.id}
              onClick={() => onSelectEntry(entry.id)}
              className={cn(
                'px-3 py-1.5 rounded-lg text-sm font-medium whitespace-nowrap transition-all flex items-center gap-1.5',
                isSelected
                  ? 'text-white shadow-md'
                  : 'hover:opacity-80'
              )}
              style={{
                backgroundColor: isSelected
                  ? (moodColor || '#f59e0b')
                  : moodColor
                    ? `${moodColor}30`
                    : '#fef3c7',
                color: isSelected
                  ? 'white'
                  : moodColor || '#b45309',
                borderLeft: moodColor && !isSelected ? `3px solid ${moodColor}` : undefined,
              }}
            >
              {entry.isLocked && <Lock className="w-3 h-3" />}
              Entry {dayEntries.length - index}
              <span className="text-xs opacity-70">
                {formatEntryTime(entry.createdAt)}
              </span>
            </button>
          );
        })}
        {dayEntries.length === 0 && (
          <span className={cn(
            'text-sm italic',
            darkMode ? 'text-amber-400/70' : 'text-amber-500'
          )}>No entries yet</span>
        )}
      </div>

      {!isPastDay && (
        <button
          onClick={onNewEntry}
          className={cn(
            'p-2 rounded-lg transition-all flex items-center gap-1',
            darkMode
              ? 'bg-amber-500/20 hover:bg-amber-500/30 text-amber-300'
              : 'bg-amber-100 hover:bg-amber-200 text-amber-700'
          )}
          title="New Entry"
        >
          <Plus className="w-4 h-4" />
        </button>
      )}

      {currentEntry && (
        <button
          onClick={() => onToggleBookmark(currentEntry.id)}
          className={cn(
            'p-2 rounded-lg transition-all',
            currentEntry.isBookmarked
              ? darkMode ? 'bg-amber-500/30 text-amber-400' : 'bg-amber-100 text-amber-600'
              : darkMode
                ? 'bg-gray-700 hover:bg-amber-500/20 text-gray-400 hover:text-amber-400'
                : 'bg-gray-100 hover:bg-amber-50 text-gray-400 hover:text-amber-500'
          )}
          title={currentEntry.isBookmarked ? 'Remove Bookmark' : 'Bookmark Entry'}
        >
          <Bookmark className={cn('w-4 h-4', currentEntry.isBookmarked && 'fill-current')} />
        </button>
      )}

      {currentEntry && !currentEntry.isLocked && !isPastDay && (
        <button
          onClick={onLockEntry}
          className={cn(
            'p-2 rounded-lg transition-all',
            darkMode
              ? 'bg-red-500/20 hover:bg-red-500/30 text-red-400'
              : 'bg-red-100 hover:bg-red-200 text-red-700'
          )}
          title="Lock Entry (prevents editing)"
        >
          <Unlock className="w-4 h-4" />
        </button>
      )}

      {(currentEntry?.isLocked || isPastDay) && currentEntry && (
        <div
          className={cn(
            'p-2 rounded-lg',
            darkMode ? 'bg-gray-700 text-gray-400' : 'bg-gray-100 text-gray-500'
          )}
          title={isPastDay ? "Past entries are read-only" : "Entry is locked"}
        >
          <Lock className="w-4 h-4" />
        </div>
      )}
    </div>
  );
}
