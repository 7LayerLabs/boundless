'use client';

import { useState, useRef, useEffect } from 'react';
import { format } from 'date-fns';
import { Plus, Lock, Unlock, Bookmark, X, Tag, Trash2 } from 'lucide-react';
import { cn } from '@/lib/utils/cn';
import { moods } from '@/constants/moods';
import { starterTags, getTagColor } from '@/constants/tags';
import { MoodButton } from './MoodButton';
import type { Mood } from '@/types/journal';
import type { JournalEntry } from '@/lib/db/instant';

interface EntryToolbarProps {
  // Mood
  showMoodSelector: boolean;
  selectedMood: Mood | null;
  onMoodSelect: (mood: Mood | null) => void;

  // Entries
  dayEntries: JournalEntry[];
  selectedEntryId: string | null;
  currentEntry: JournalEntry | null;
  isPastDay: boolean;
  onSelectEntry: (entryId: string) => void;
  onNewEntry: () => void;
  onToggleBookmark: (entryId: string) => void;
  onLockEntry: () => void;
  onDeleteEntry: (entryId: string) => void;

  // Tags
  tags: string[];
  allTags: string[];
  onTagsChange: (tags: string[]) => void;

  // Styling
  darkMode: boolean;
}

export function EntryToolbar({
  showMoodSelector,
  selectedMood,
  onMoodSelect,
  dayEntries,
  selectedEntryId,
  currentEntry,
  isPastDay,
  onSelectEntry,
  onNewEntry,
  onToggleBookmark,
  onLockEntry,
  onDeleteEntry,
  tags,
  allTags,
  onTagsChange,
  darkMode,
}: EntryToolbarProps) {
  const [showTagInput, setShowTagInput] = useState(false);
  const [tagInputValue, setTagInputValue] = useState('');
  const [showTagSuggestions, setShowTagSuggestions] = useState(false);
  const tagInputRef = useRef<HTMLInputElement>(null);
  const tagContainerRef = useRef<HTMLDivElement>(null);

  // Tags should ALWAYS be editable - never locked
  const tagsDisabled = false;
  const moodDisabled = isPastDay; // Mood is still locked for past days
  const maxVisibleTags = 3;
  const visibleTags = tags.slice(0, maxVisibleTags);
  const hiddenTagCount = tags.length - maxVisibleTags;

  // Use starter tags for suggestions
  const starterTagNames = starterTags.map(t => t.name);
  const combinedTags = [...new Set([...starterTagNames, ...allTags])];
  const tagSuggestions = tagInputValue.trim()
    ? combinedTags.filter(
        (tag) =>
          tag.toLowerCase().includes(tagInputValue.toLowerCase()) &&
          !tags.includes(tag)
      )
    : combinedTags.filter((tag) => !tags.includes(tag)).slice(0, 6);

  const formatEntryTime = (timestamp: number) => {
    return format(new Date(timestamp), 'h:mm a');
  };

  // Focus input when shown
  useEffect(() => {
    if (showTagInput && tagInputRef.current) {
      tagInputRef.current.focus();
    }
  }, [showTagInput]);

  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (tagContainerRef.current && !tagContainerRef.current.contains(e.target as Node)) {
        setShowTagSuggestions(false);
        if (!tagInputValue.trim()) {
          setShowTagInput(false);
        }
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [tagInputValue]);

  const addTag = (tag: string) => {
    const trimmedTag = tag.trim().toLowerCase();
    if (trimmedTag && !tags.includes(trimmedTag)) {
      onTagsChange([...tags, trimmedTag]);
    }
    setTagInputValue('');
    setShowTagSuggestions(false);
    tagInputRef.current?.focus();
  };

  const removeTag = (tagToRemove: string) => {
    onTagsChange(tags.filter((tag) => tag !== tagToRemove));
  };

  const handleTagKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      if (tagInputValue.trim()) {
        addTag(tagInputValue);
      }
    } else if (e.key === 'Backspace' && !tagInputValue && tags.length > 0) {
      removeTag(tags[tags.length - 1]);
    } else if (e.key === 'Escape') {
      setShowTagInput(false);
      setShowTagSuggestions(false);
      setTagInputValue('');
    }
  };

  return (
    <div className={cn(
      'flex items-center gap-2 py-2 border-b mb-3',
      darkMode ? 'border-amber-500/20' : 'border-neutral-200'
    )}>
      {/* Mood Button */}
      {showMoodSelector && (
        <MoodButton
          selectedMood={selectedMood}
          onSelect={onMoodSelect}
          disabled={moodDisabled}
          darkMode={darkMode}
        />
      )}

      {/* Divider after mood */}
      {showMoodSelector && (
        <div className={cn(
          'w-px h-5',
          darkMode ? 'bg-amber-500/20' : 'bg-neutral-200'
        )} />
      )}

      {/* Entry Tabs - horizontal scroll */}
      <div className="flex-1 flex items-center gap-1 overflow-x-auto scrollbar-hide">
        {dayEntries.map((entry, index) => {
          const moodColor = entry.mood && moods[entry.mood as keyof typeof moods]?.color;
          const isSelected = selectedEntryId === entry.id;

          return (
            <button
              key={entry.id}
              onClick={() => onSelectEntry(entry.id)}
              className={cn(
                'px-2 py-1 rounded-md text-xs font-medium whitespace-nowrap transition-all flex items-center gap-1',
                isSelected
                  ? 'text-white shadow-sm'
                  : 'hover:opacity-80'
              )}
              style={{
                backgroundColor: isSelected
                  ? (moodColor || (darkMode ? '#525252' : '#a3a3a3'))
                  : moodColor
                    ? `${moodColor}25`
                    : darkMode ? '#404040' : '#f5f5f5',
                color: isSelected
                  ? 'white'
                  : moodColor || (darkMode ? '#d4d4d4' : '#525252'),
              }}
            >
              {entry.isLocked && <Lock className="w-2.5 h-2.5" />}
              <span className="opacity-80">
                {formatEntryTime(entry.createdAt)}
              </span>
            </button>
          );
        })}

        {dayEntries.length === 0 && (
          <span className={cn(
            'text-xs italic',
            darkMode ? 'text-neutral-500' : 'text-neutral-400'
          )}>No entries yet</span>
        )}
      </div>

      {/* New Entry Button */}
      {!isPastDay && (
        <button
          onClick={onNewEntry}
          className={cn(
            'p-1.5 rounded-md transition-all',
            darkMode
              ? 'bg-neutral-700 hover:bg-neutral-600 text-neutral-300'
              : 'bg-neutral-100 hover:bg-neutral-200 text-neutral-600'
          )}
          title="New Entry"
        >
          <Plus className="w-3.5 h-3.5" />
        </button>
      )}

      {/* Divider */}
      <div className={cn(
        'w-px h-5',
        darkMode ? 'bg-amber-500/20' : 'bg-neutral-200'
      )} />

      {/* Tag Pills - compact inline */}
      {currentEntry && (
        <div ref={tagContainerRef} className="relative flex items-center gap-1">
          {/* Visible tags */}
          {visibleTags.map((tag) => {
            const color = getTagColor(tag);
            return (
              <span
                key={tag}
                className="group flex items-center gap-0.5 px-1.5 py-0.5 rounded text-[10px] transition-all"
                style={{
                  backgroundColor: `${color}15`,
                  color: color,
                }}
              >
                #{tag}
                {!tagsDisabled && (
                  <button
                    onClick={() => removeTag(tag)}
                    className="opacity-0 group-hover:opacity-100 transition-opacity hover:text-red-500 ml-0.5"
                  >
                    <X className="w-2.5 h-2.5" />
                  </button>
                )}
              </span>
            );
          })}

          {/* Hidden tag count */}
          {hiddenTagCount > 0 && (
            <span className={cn(
              'text-[10px] px-1.5 py-0.5 rounded',
              darkMode ? 'bg-neutral-700 text-neutral-400' : 'bg-neutral-100 text-neutral-500'
            )}>
              +{hiddenTagCount}
            </span>
          )}

          {/* Add tag button / input */}
          {!tagsDisabled && (
            showTagInput ? (
              <div className="relative">
                <input
                  ref={tagInputRef}
                  type="text"
                  value={tagInputValue}
                  onChange={(e) => {
                    setTagInputValue(e.target.value);
                    setShowTagSuggestions(true);
                  }}
                  onFocus={() => setShowTagSuggestions(true)}
                  onKeyDown={handleTagKeyDown}
                  placeholder="tag..."
                  className={cn(
                    'w-16 px-1.5 py-0.5 text-[10px] rounded border outline-none transition-all focus:w-20',
                    darkMode
                      ? 'bg-neutral-800 border-neutral-700 text-neutral-200 placeholder:text-neutral-500 focus:border-neutral-600'
                      : 'bg-white border-neutral-200 text-neutral-800 placeholder:text-neutral-400 focus:border-neutral-400'
                  )}
                />

                {/* Suggestions dropdown */}
                {showTagSuggestions && tagSuggestions.length > 0 && (
                  <div
                    className={cn(
                      'absolute top-full right-0 mt-1 w-32 max-h-36 overflow-y-auto rounded-lg shadow-lg border z-50',
                      darkMode ? 'bg-neutral-800 border-neutral-700' : 'bg-white border-neutral-200'
                    )}
                  >
                    {tagSuggestions.map((suggestion) => {
                      const color = getTagColor(suggestion);
                      return (
                        <button
                          key={suggestion}
                          onClick={() => addTag(suggestion)}
                          className={cn(
                            'w-full px-2 py-1 text-left text-[10px] transition-colors flex items-center gap-1.5',
                            darkMode ? 'hover:bg-neutral-700' : 'hover:bg-neutral-50'
                          )}
                        >
                          <span
                            className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                            style={{ backgroundColor: color }}
                          />
                          <span style={{ color }}>#{suggestion}</span>
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            ) : (
              <button
                onClick={() => setShowTagInput(true)}
                className={cn(
                  'p-1 rounded transition-all',
                  darkMode
                    ? 'text-neutral-500 hover:text-neutral-300 hover:bg-neutral-700'
                    : 'text-neutral-400 hover:text-neutral-600 hover:bg-neutral-100'
                )}
                title="Add tag"
              >
                <Tag className="w-3 h-3" />
              </button>
            )
          )}

          {/* Show tags in read-only mode */}
          {tagsDisabled && tags.length === 0 && (
            <span className={cn(
              'text-[10px] italic',
              darkMode ? 'text-neutral-600' : 'text-neutral-400'
            )}>no tags</span>
          )}
        </div>
      )}

      {/* Divider */}
      <div className={cn(
        'w-px h-5',
        darkMode ? 'bg-amber-500/20' : 'bg-neutral-200'
      )} />

      {/* Actions - Bookmark, Lock */}
      <div className="flex items-center gap-1">
        {currentEntry && (
          <button
            onClick={() => onToggleBookmark(currentEntry.id)}
            className={cn(
              'p-1.5 rounded-md transition-all',
              currentEntry.isBookmarked
                ? darkMode ? 'bg-amber-500/30 text-amber-400' : 'bg-amber-100 text-amber-600'
                : darkMode
                  ? 'text-neutral-500 hover:text-amber-400 hover:bg-neutral-700'
                  : 'text-neutral-400 hover:text-amber-500 hover:bg-neutral-100'
            )}
            title={currentEntry.isBookmarked ? 'Remove Bookmark' : 'Bookmark Entry'}
          >
            <Bookmark className={cn('w-3.5 h-3.5', currentEntry.isBookmarked && 'fill-current')} />
          </button>
        )}

        {currentEntry && !currentEntry.isLocked && !isPastDay && (
          <button
            onClick={onLockEntry}
            className={cn(
              'p-1.5 rounded-md transition-all',
              darkMode
                ? 'text-neutral-500 hover:text-red-400 hover:bg-neutral-700'
                : 'text-neutral-400 hover:text-red-500 hover:bg-neutral-100'
            )}
            title="Lock Entry (prevents editing)"
          >
            <Unlock className="w-3.5 h-3.5" />
          </button>
        )}

        {(currentEntry?.isLocked || isPastDay) && currentEntry && (
          <div
            className={cn(
              'p-1.5 rounded-md',
              darkMode ? 'text-neutral-600' : 'text-neutral-400'
            )}
            title={isPastDay ? "Past entries are read-only" : "Entry is locked"}
          >
            <Lock className="w-3.5 h-3.5" />
          </div>
        )}

        {/* Delete button - shows for non-locked entries */}
        {currentEntry && !currentEntry.isLocked && !isPastDay && (
          <button
            onClick={() => onDeleteEntry(currentEntry.id)}
            className={cn(
              'p-1.5 rounded-md transition-all',
              darkMode
                ? 'text-neutral-500 hover:text-red-400 hover:bg-neutral-700'
                : 'text-neutral-400 hover:text-red-500 hover:bg-neutral-100'
            )}
            title="Delete Entry"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        )}
      </div>
    </div>
  );
}
