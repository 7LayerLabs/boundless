'use client';

import { AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils/cn';
import { RichTextEditor } from '../editor/RichTextEditor';
import { ThoughtBubble } from '../editor/ThoughtBubble';
import { PromptBubble } from '../editor/PromptBubble';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { JournalHeader } from './JournalHeader';
import { EntryToolbar } from './EntryToolbar';
import { EntryUpdates } from './EntryUpdates';
import type { Mood } from '@/types/journal';
import type { JournalEntry } from '@/lib/db/instant';
import type { ReflectionQuestion } from '../editor/AIReflection';
import type { PromptSelection } from '../editor/DailyPromptModal';
import type { Quote } from '@/constants/quotes';

interface PageContentProps {
  // Date navigation
  currentDate: Date;
  onPreviousDay: () => void;
  onNextDay: () => void;
  onToday: () => void;
  dateColor: string;
  dayColor: string;
  formatDate: (date: Date) => string;

  // Entry management
  dayEntries: JournalEntry[];
  selectedEntryId: string | null;
  currentEntry: JournalEntry | null;
  isPastDay: boolean;
  onSelectEntry: (entryId: string) => void;
  onNewEntry: () => void;
  onToggleBookmark: (entryId: string) => void;
  onLockEntry: () => void;

  // Mood
  showMoodSelector: boolean;
  onMoodSelect: (mood: Mood | null) => void;

  // Tags
  allTags: string[];
  onTagsChange: (tags: string[]) => void;

  // Updates
  onAddUpdate: (text: string) => Promise<void>;

  // Styling
  darkMode: boolean;
  pageBgColor: string;
  pageLines: boolean;
  fontClassName: string;

  // AI Reflection
  pinnedQuestion: ReflectionQuestion | null;
  onDismissPinnedQuestion: () => void;

  // Writing Prompt
  pinnedPrompt: PromptSelection | null;
  onDismissPinnedPrompt: () => void;

  // Daily Quote
  pinnedQuote: Quote | null;
  onDismissPinnedQuote: () => void;
  isQuoteLocked?: boolean;
}

export function PageContent({
  currentDate,
  onPreviousDay,
  onNextDay,
  onToday,
  dateColor,
  dayColor,
  dayEntries,
  selectedEntryId,
  currentEntry,
  isPastDay,
  onSelectEntry,
  onNewEntry,
  onToggleBookmark,
  onLockEntry,
  showMoodSelector,
  onMoodSelect,
  allTags,
  onTagsChange,
  onAddUpdate,
  darkMode,
  pageBgColor,
  pageLines,
  fontClassName,
  pinnedQuestion,
  onDismissPinnedQuestion,
  pinnedPrompt,
  onDismissPinnedPrompt,
  pinnedQuote,
  onDismissPinnedQuote,
  isQuoteLocked = false,
}: PageContentProps) {
  return (
    <div
      className="relative flex-1 h-full rounded-r-2xl overflow-hidden"
      style={{
        backgroundColor: pageBgColor,
        boxShadow: `
          inset 20px 0 40px rgba(0, 0, 0, 0.08),
          8px 0 30px rgba(0, 0, 0, 0.15)
        `,
      }}
    >
      {/* Paper texture */}
      <div
        className="absolute inset-0 opacity-50 pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='paper'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.04' numOctaves='5' stitchTiles='stitch'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23paper)' opacity='0.05'/%3E%3C/svg%3E")`,
        }}
      />

      {/* Page lines */}
      {pageLines && (
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage: `repeating-linear-gradient(
              transparent,
              transparent 31px,
              ${darkMode ? 'rgba(180, 160, 140, 0.15)' : 'rgba(180, 160, 140, 0.3)'} 31px,
              ${darkMode ? 'rgba(180, 160, 140, 0.15)' : 'rgba(180, 160, 140, 0.3)'} 32px
            )`,
            backgroundPosition: '0 120px',
          }}
        />
      )}

      {/* Red margin line - hidden on mobile for more space */}
      <div
        className="absolute top-0 bottom-0 w-px hidden md:block md:left-24 lg:left-32 opacity-30"
        style={{ backgroundColor: '#e57373' }}
      />

      {/* Page Content */}
      <div className="relative h-full flex flex-col p-4 md:p-6 lg:p-10 pl-4 md:pl-28 lg:pl-36 overflow-hidden">
        {/* Journal Header - Date + Pinned Quote */}
        <JournalHeader
          currentDate={currentDate}
          onPreviousDay={onPreviousDay}
          onNextDay={onNextDay}
          onToday={onToday}
          dateColor={dateColor}
          dayColor={dayColor}
          darkMode={darkMode}
          pinnedQuote={pinnedQuote}
          onDismissQuote={onDismissPinnedQuote}
          isQuoteLocked={isQuoteLocked}
        />

        {/* Entry Toolbar - Mood, Entries, Tags, Actions */}
        <EntryToolbar
          showMoodSelector={showMoodSelector}
          selectedMood={(currentEntry?.mood as Mood) || null}
          onMoodSelect={onMoodSelect}
          dayEntries={dayEntries}
          selectedEntryId={selectedEntryId}
          currentEntry={currentEntry}
          isPastDay={isPastDay}
          onSelectEntry={onSelectEntry}
          onNewEntry={onNewEntry}
          onToggleBookmark={onToggleBookmark}
          onLockEntry={onLockEntry}
          tags={currentEntry?.tags || []}
          allTags={allTags}
          onTagsChange={onTagsChange}
          darkMode={darkMode}
        />

        {/* Journal Editor - The main writing area */}
        <div className="flex-1 overflow-y-auto overflow-x-hidden relative">
          {/* Pinned Writing Prompt Bubble */}
          <AnimatePresence>
            {pinnedPrompt && (
              <PromptBubble
                prompt={pinnedPrompt.prompt}
                category={pinnedPrompt.category}
                onDismiss={onDismissPinnedPrompt}
              />
            )}
          </AnimatePresence>

          {/* Pinned AI Reflection Bubble */}
          <AnimatePresence>
            {pinnedQuestion && !pinnedPrompt && (
              <ThoughtBubble
                question={pinnedQuestion}
                onDismiss={onDismissPinnedQuestion}
              />
            )}
          </AnimatePresence>

          <ErrorBoundary
            title="Editor error"
            description="We couldn't load the editor. Your entries are safe."
          >
            <RichTextEditor
              entry={currentEntry ? {
                id: currentEntry.id,
                content: currentEntry.content,
                mood: currentEntry.mood as Mood | null,
                tags: currentEntry.tags,
                images: currentEntry.images,
              } : undefined}
              date={currentDate}
              isLocked={isPastDay || currentEntry?.isLocked || false}
            />
          </ErrorBoundary>

          {/* Updates Section for Locked/Past Entries */}
          {(isPastDay || currentEntry?.isLocked) && currentEntry && (
            <EntryUpdates
              updates={currentEntry.updates || []}
              fontClassName={fontClassName}
              onAddUpdate={onAddUpdate}
            />
          )}
        </div>
      </div>

      {/* Page curl effect */}
      <div
        className="absolute bottom-0 right-0 w-20 h-20 pointer-events-none"
        style={{
          background: `linear-gradient(135deg, transparent 50%, rgba(0,0,0,0.03) 50%)`,
        }}
      />

      {/* Gold foil edge */}
      <div
        className="absolute right-0 top-4 bottom-4 w-1.5"
        style={{
          background: 'linear-gradient(180deg, #d4af37 0%, #f5e6a3 15%, #d4af37 30%, #c5a028 50%, #f5e6a3 70%, #d4af37 85%, #c5a028 100%)',
        }}
      />
    </div>
  );
}
