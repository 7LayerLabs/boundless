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
import type { ReflectionQuestion } from '../editor/JournalAICompanion';
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
  onDeleteEntry: (entryId: string) => void;

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
  formatDate,
  dayEntries,
  selectedEntryId,
  currentEntry,
  isPastDay,
  onSelectEntry,
  onNewEntry,
  onToggleBookmark,
  onLockEntry,
  onDeleteEntry,
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
      {/* Paper fiber texture - fine grain layer */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='fiber'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch' seed='1'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23fiber)' opacity='0.035'/%3E%3C/svg%3E")`,
          mixBlendMode: 'multiply',
        }}
      />

      {/* Paper texture - medium grain for depth */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 300 300' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='paper'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.04' numOctaves='5' stitchTiles='stitch' seed='5'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23paper)' opacity='0.025'/%3E%3C/svg%3E")`,
          mixBlendMode: 'multiply',
        }}
      />

      {/* Subtle color variation - warmer near edges */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: darkMode
            ? 'radial-gradient(ellipse at 70% 50%, transparent 30%, rgba(20, 15, 10, 0.08) 100%)'
            : 'radial-gradient(ellipse at 70% 50%, transparent 30%, rgba(245, 235, 220, 0.15) 100%)',
        }}
      />

      {/* Spine shadow - where pages meet binding */}
      <div
        className="absolute top-0 bottom-0 left-0 w-24 pointer-events-none"
        style={{
          background: darkMode
            ? 'linear-gradient(to right, rgba(0, 0, 0, 0.12) 0%, rgba(0, 0, 0, 0.04) 40%, transparent 100%)'
            : 'linear-gradient(to right, rgba(139, 119, 101, 0.08) 0%, rgba(139, 119, 101, 0.02) 40%, transparent 100%)',
        }}
      />

      {/* Top edge shadow - subtle binding crease */}
      <div
        className="absolute top-0 left-0 right-0 h-3 pointer-events-none"
        style={{
          background: darkMode
            ? 'linear-gradient(to bottom, rgba(0, 0, 0, 0.06) 0%, transparent 100%)'
            : 'linear-gradient(to bottom, rgba(139, 119, 101, 0.04) 0%, transparent 100%)',
        }}
      />

      {/* Bottom page edge - shows paper thickness */}
      <div
        className="absolute bottom-0 left-4 right-4 h-px pointer-events-none"
        style={{
          background: darkMode
            ? 'linear-gradient(to right, transparent 0%, rgba(80, 70, 60, 0.3) 10%, rgba(80, 70, 60, 0.3) 90%, transparent 100%)'
            : 'linear-gradient(to right, transparent 0%, rgba(210, 200, 185, 0.5) 10%, rgba(210, 200, 185, 0.5) 90%, transparent 100%)',
        }}
      />

      {/* Page lines - softer, more realistic ruled paper */}
      {pageLines && (
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage: `repeating-linear-gradient(
              transparent,
              transparent 30px,
              ${darkMode ? 'rgba(160, 145, 130, 0.12)' : 'rgba(175, 160, 145, 0.22)'} 30px,
              ${darkMode ? 'rgba(160, 145, 130, 0.08)' : 'rgba(175, 160, 145, 0.18)'} 31px,
              transparent 31.5px
            )`,
            backgroundPosition: '0 120px',
          }}
        />
      )}

      {/* Red margin line - hidden on mobile for more space */}
      <div
        className="absolute top-0 bottom-0 hidden md:block md:left-24 lg:left-32"
        style={{
          width: '1px',
          background: darkMode
            ? 'linear-gradient(to bottom, transparent 5%, rgba(180, 100, 100, 0.15) 15%, rgba(180, 100, 100, 0.18) 50%, rgba(180, 100, 100, 0.15) 85%, transparent 95%)'
            : 'linear-gradient(to bottom, transparent 5%, rgba(210, 120, 120, 0.25) 15%, rgba(210, 120, 120, 0.3) 50%, rgba(210, 120, 120, 0.25) 85%, transparent 95%)',
        }}
      />

      {/* Page Content */}
      <div className="relative h-full flex flex-col p-4 md:p-6 lg:p-10 pl-4 md:pl-28 lg:pl-36 overflow-hidden">
        {/* Journal Header - Date + Pinned Quote */}
        <JournalHeader
          currentDate={currentDate}
          onPreviousDay={onPreviousDay}
          onNextDay={onNextDay}
          onToday={onToday}
          formatDate={formatDate}
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
          onDeleteEntry={onDeleteEntry}
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

      {/* Page curl effect - subtle corner lift */}
      <div
        className="absolute bottom-0 right-0 w-16 h-16 pointer-events-none"
        style={{
          background: darkMode
            ? `linear-gradient(135deg,
                transparent 45%,
                rgba(60, 55, 50, 0.4) 48%,
                rgba(45, 40, 35, 0.95) 52%,
                rgba(50, 45, 40, 0.9) 55%,
                rgba(55, 50, 45, 0.85) 100%)`
            : `linear-gradient(135deg,
                transparent 45%,
                rgba(0, 0, 0, 0.04) 48%,
                rgba(255, 252, 245, 0.95) 52%,
                rgba(250, 245, 235, 0.9) 55%,
                rgba(245, 240, 230, 0.85) 100%)`,
          borderBottomRightRadius: '4px',
          boxShadow: darkMode
            ? '-2px -2px 4px rgba(0, 0, 0, 0.15)'
            : '-2px -2px 4px rgba(0, 0, 0, 0.06)',
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
