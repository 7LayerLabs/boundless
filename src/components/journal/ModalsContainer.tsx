'use client';

import { AnimatePresence } from 'framer-motion';
import { CalendarView } from '../navigation/CalendarView';
import { SettingsPanel } from '../settings/SettingsPanel';
import { MoodInsights } from '../navigation/MoodInsights';
import { SearchModal } from '../navigation/SearchModal';
import { TagsView } from '../navigation/TagsView';
import { BookmarksView } from '../navigation/BookmarksView';
import { PDFExport } from '../navigation/PDFExport';
import { NotebooksView } from '../navigation/NotebooksView';
import { WhyPage } from './WhyPage';
import { DailyPromptModal, type PromptSelection } from '../editor/DailyPromptModal';
import { ErrorBoundary, CompactErrorFallback } from '@/components/ErrorBoundary';
import type { JournalEntry } from '@/lib/db/instant';

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
  showNotebooks: boolean;
  showPromptModal: boolean;

  // Modal close handlers
  onCloseCalendar: () => void;
  onCloseSettings: () => void;
  onCloseMoodInsights: () => void;
  onCloseWhyPage: () => void;
  onCloseSearch: () => void;
  onCloseTags: () => void;
  onCloseBookmarks: () => void;
  onClosePDFExport: () => void;
  onCloseNotebooks: () => void;
  onClosePromptModal: () => void;

  // Calendar specific
  currentDate: Date;
  onSelectDate: (date: Date) => void;

  // Entry selection for search/tags/bookmarks
  onSelectEntry: (entry: JournalEntry) => void;

  // Notebook selection
  onSelectNotebook: () => void;

  // Prompt modal
  onUsePrompt: (selection: PromptSelection) => void;
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
  showNotebooks,
  showPromptModal,
  onCloseCalendar,
  onCloseSettings,
  onCloseMoodInsights,
  onCloseWhyPage,
  onCloseSearch,
  onCloseTags,
  onCloseBookmarks,
  onClosePDFExport,
  onCloseNotebooks,
  onClosePromptModal,
  currentDate,
  onSelectDate,
  onSelectEntry,
  onSelectNotebook,
  onUsePrompt,
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

      {/* Notebooks View */}
      <AnimatePresence>
        {showNotebooks && (
          <NotebooksView
            onClose={onCloseNotebooks}
            onSelectNotebook={onSelectNotebook}
          />
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
    </>
  );
}
