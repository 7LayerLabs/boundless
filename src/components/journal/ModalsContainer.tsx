'use client';

import { AnimatePresence } from 'framer-motion';
import { CalendarView } from '../navigation/CalendarView';
import { SettingsPanel } from '../settings/SettingsPanel';
import { MoodInsights } from '../navigation/MoodInsights';
import { SearchModal } from '../navigation/SearchModal';
import { TagsView } from '../navigation/TagsView';
import { BookmarksView } from '../navigation/BookmarksView';
import { PDFExport } from '../navigation/PDFExport';
import { WhyPage } from './WhyPage';
import { DailyPromptModal, type PromptSelection } from '../editor/DailyPromptModal';
import { WritingStatsModal } from '../navigation/WritingStatsModal';
import { EntryTemplatesModal } from '../editor/EntryTemplatesModal';
import { GuidedProgramsModal } from '../navigation/GuidedProgramsModal';
import { DailyQuoteModal } from '../navigation/DailyQuoteModal';
import { ErrorBoundary, CompactErrorFallback } from '@/components/ErrorBoundary';
import type { JournalEntry } from '@/lib/db/instant';
import type { EntryTemplate } from '@/constants/templates';
import type { Quote } from '@/constants/quotes';

interface ModalsContainerProps {
  // Modal visibility states
  showCalendar: boolean;
  showSettings: boolean;
  showMoodInsights: boolean;
  showWhyPage: boolean;
  showSearch: boolean;
  showTags: boolean;
  showBookmarks: boolean;
  showPDFExport: boolean;
  showPromptModal: boolean;
  showWritingStats: boolean;
  showEntryTemplates: boolean;
  showGuidedPrograms: boolean;
  showDailyQuote: boolean;

  // Modal close handlers
  onCloseCalendar: () => void;
  onCloseSettings: () => void;
  onCloseMoodInsights: () => void;
  onCloseWhyPage: () => void;
  onCloseSearch: () => void;
  onCloseTags: () => void;
  onCloseBookmarks: () => void;
  onClosePDFExport: () => void;
  onClosePromptModal: () => void;
  onCloseWritingStats: () => void;
  onCloseEntryTemplates: () => void;
  onCloseGuidedPrograms: () => void;
  onCloseDailyQuote: () => void;

  // Calendar specific
  currentDate: Date;
  onSelectDate: (date: Date) => void;

  // Entry selection for search/tags/bookmarks
  onSelectEntry: (entry: JournalEntry) => void;

  // Prompt modal
  onUsePrompt: (selection: PromptSelection) => void;

  // New feature handlers
  onSelectTemplate: (template: EntryTemplate) => void;
  onUseProgramPrompt: (prompt: string) => void;
  onPinQuote: (quote: Quote) => void;
  onLockQuote: (quote: Quote) => void;
  onUnlockQuote: () => void;
  lockedQuote: Quote | null;
}

function ModalErrorFallback({ error, onClose }: { error: Error; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
      <div className="bg-white rounded-2xl p-6 max-w-sm mx-4">
        <CompactErrorFallback
          error={error}
          resetErrorBoundary={onClose}
        />
      </div>
    </div>
  );
}

export function ModalsContainer({
  showCalendar,
  showSettings,
  showMoodInsights,
  showWhyPage,
  showSearch,
  showTags,
  showBookmarks,
  showPDFExport,
  showPromptModal,
  showWritingStats,
  showEntryTemplates,
  showGuidedPrograms,
  showDailyQuote,
  onCloseCalendar,
  onCloseSettings,
  onCloseMoodInsights,
  onCloseWhyPage,
  onCloseSearch,
  onCloseTags,
  onCloseBookmarks,
  onClosePDFExport,
  onClosePromptModal,
  onCloseWritingStats,
  onCloseEntryTemplates,
  onCloseGuidedPrograms,
  onCloseDailyQuote,
  currentDate,
  onSelectDate,
  onSelectEntry,
  onUsePrompt,
  onSelectTemplate,
  onUseProgramPrompt,
  onPinQuote,
  onLockQuote,
  onUnlockQuote,
  lockedQuote,
}: ModalsContainerProps) {
  return (
    <>
      {/* Calendar Modal */}
      <AnimatePresence>
        {showCalendar && (
          <CalendarView
            selectedDate={currentDate}
            onSelectDate={onSelectDate}
            onClose={onCloseCalendar}
          />
        )}
      </AnimatePresence>

      {/* Settings Panel */}
      <AnimatePresence>
        {showSettings && (
          <ErrorBoundary
            fallback={
              <ModalErrorFallback
                error={new Error('Settings failed to load')}
                onClose={onCloseSettings}
              />
            }
          >
            <SettingsPanel onClose={onCloseSettings} />
          </ErrorBoundary>
        )}
      </AnimatePresence>

      {/* Mood Insights */}
      <AnimatePresence>
        {showMoodInsights && (
          <MoodInsights onClose={onCloseMoodInsights} />
        )}
      </AnimatePresence>

      {/* Why Page */}
      <AnimatePresence>
        {showWhyPage && (
          <WhyPage onClose={onCloseWhyPage} />
        )}
      </AnimatePresence>

      {/* Search Modal */}
      <AnimatePresence>
        {showSearch && (
          <ErrorBoundary
            fallback={
              <ModalErrorFallback
                error={new Error('Search failed to load')}
                onClose={onCloseSearch}
              />
            }
          >
            <SearchModal
              onClose={onCloseSearch}
              onSelectEntry={onSelectEntry}
            />
          </ErrorBoundary>
        )}
      </AnimatePresence>

      {/* Tags View */}
      <AnimatePresence>
        {showTags && (
          <TagsView
            onClose={onCloseTags}
            onSelectEntry={onSelectEntry}
          />
        )}
      </AnimatePresence>

      {/* Bookmarks View */}
      <AnimatePresence>
        {showBookmarks && (
          <BookmarksView
            onClose={onCloseBookmarks}
            onSelectEntry={onSelectEntry}
          />
        )}
      </AnimatePresence>

      {/* PDF Export */}
      <AnimatePresence>
        {showPDFExport && (
          <PDFExport onClose={onClosePDFExport} />
        )}
      </AnimatePresence>

      {/* Daily Prompt Modal */}
      <AnimatePresence>
        {showPromptModal && (
          <ErrorBoundary
            fallback={
              <ModalErrorFallback
                error={new Error('Prompts failed to load')}
                onClose={onClosePromptModal}
              />
            }
          >
            <DailyPromptModal
              onClose={onClosePromptModal}
              onUsePrompt={onUsePrompt}
            />
          </ErrorBoundary>
        )}
      </AnimatePresence>

      {/* Writing Stats Modal */}
      <AnimatePresence>
        {showWritingStats && (
          <WritingStatsModal onClose={onCloseWritingStats} />
        )}
      </AnimatePresence>

      {/* Entry Templates Modal */}
      <AnimatePresence>
        {showEntryTemplates && (
          <EntryTemplatesModal
            onClose={onCloseEntryTemplates}
            onSelectTemplate={onSelectTemplate}
          />
        )}
      </AnimatePresence>

      {/* Guided Programs Modal */}
      <AnimatePresence>
        {showGuidedPrograms && (
          <GuidedProgramsModal
            onClose={onCloseGuidedPrograms}
            onUsePrompt={onUseProgramPrompt}
          />
        )}
      </AnimatePresence>

      {/* Daily Quote Modal */}
      <AnimatePresence>
        {showDailyQuote && (
          <DailyQuoteModal
            onClose={onCloseDailyQuote}
            onPinQuote={onPinQuote}
            onLockQuote={onLockQuote}
            onUnlockQuote={onUnlockQuote}
            lockedQuote={lockedQuote}
          />
        )}
      </AnimatePresence>
    </>
  );
}
