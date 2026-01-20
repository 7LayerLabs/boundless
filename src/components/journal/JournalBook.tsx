'use client';

import { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { format, startOfDay, isAfter } from 'date-fns';
import { db } from '@/lib/db/instant';
import { useJournal } from '@/hooks/useJournal';
import { useSettings } from '@/hooks/useSettings';
import { bindingColors, pageColors, dateColors } from '@/constants/themes';
import { fonts } from '@/constants/fonts';
import { moods } from '@/constants/moods';
import { JournalAICompanion, type ReflectionQuestion } from '../editor/JournalAICompanion';
import type { PromptSelection } from '../editor/DailyPromptModal';
import { Sidebar } from '../navigation/Sidebar';
import { BookCover } from './BookCover';
import { BookSpine } from './BookSpine';
import { PageContent } from './PageContent';
import { ModalsContainer } from './ModalsContainer';
import { analytics } from '@/components/providers/PostHogProvider';
import type { Mood } from '@/types/journal';
import type { JournalEntry } from '@/lib/db/instant';
import type { Quote } from '@/constants/quotes';
import type { EntryTemplate } from '@/constants/templates';

export function JournalBook() {
  // Modal visibility states
  const [showCalendar, setShowCalendar] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showMoodInsights, setShowMoodInsights] = useState(false);
  const [showWhyPage, setShowWhyPage] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [showTags, setShowTags] = useState(false);
  const [showBookmarks, setShowBookmarks] = useState(false);
  const [showPDFExport, setShowPDFExport] = useState(false);
  const [showPromptModal, setShowPromptModal] = useState(false);
  const [showOnThisDay, setShowOnThisDay] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const [pinnedQuestion, setPinnedQuestion] = useState<ReflectionQuestion | null>(null);
  const [pinnedPrompt, setPinnedPrompt] = useState<PromptSelection | null>(null);

  // New optional feature modals
  const [showWritingStats, setShowWritingStats] = useState(false);
  const [showEntryTemplates, setShowEntryTemplates] = useState(false);
  const [showGuidedPrograms, setShowGuidedPrograms] = useState(false);
  const [showDailyQuote, setShowDailyQuote] = useState(false);

  // Initialize pinned quotes from localStorage (avoids race conditions)
  const [pinnedQuotes, setPinnedQuotes] = useState<Record<string, Quote>>(() => {
    if (typeof window === 'undefined') return {};
    try {
      const stored = localStorage.getItem('boundless-pinned-quotes');
      return stored ? JSON.parse(stored) : {};
    } catch {
      return {};
    }
  });

  // Save pinned quotes to localStorage when they change
  useEffect(() => {
    localStorage.setItem('boundless-pinned-quotes', JSON.stringify(pinnedQuotes));
  }, [pinnedQuotes]);

  // Use InstantDB hooks
  const {
    currentDate,
    setCurrentDate,
    currentEntry,
    dayEntries,
    selectedEntryId,
    setSelectedEntryId,
    createEntry,
    updateEntry,
    lockEntry,
    addEntryUpdate,
    deleteEntry,
    toggleBookmark,
    updateEntryTags,
    allTags,
  } = useJournal();

  const {
    bindingColor,
    pageColor,
    pageLines,
    fontFamily,
    showMoodSelector,
    aiReflectionEnabled,
    dateFormat,
    dateColor,
    darkMode,
    updateSetting,
    showWritingStats: showWritingStatsSetting,
    showEntryTemplates: showEntryTemplatesSetting,
    showGuidedPrograms: showGuidedProgramsSetting,
    showDailyQuote: showDailyQuoteSetting,
    lockedQuote,
  } = useSettings();

  // Check if current date is a past day (not today)
  const isPastDay = useMemo(() => {
    const today = startOfDay(new Date());
    const current = startOfDay(currentDate);
    return isAfter(today, current);
  }, [currentDate]);

  // Handle dark mode
  useEffect(() => {
    if (darkMode) {
      document.body.classList.add('dark-mode');
    } else {
      document.body.classList.remove('dark-mode');
    }
  }, [darkMode]);

  // Determine which quote to show for the current date
  // - Locked quote: shows on all dates
  // - Pinned quote: only shows on the date it was pinned for
  const currentDateStr = format(currentDate, 'yyyy-MM-dd');
  const displayQuote = useMemo(() => {
    // Locked quote takes priority and shows on all dates
    if (lockedQuote) {
      return lockedQuote;
    }
    // Pinned quote only shows on the date it was pinned for
    const pinnedForDate = pinnedQuotes[currentDateStr];
    if (pinnedForDate) {
      return pinnedForDate;
    }
    return null;
  }, [lockedQuote, pinnedQuotes, currentDateStr]);

  // Derived values
  const binding = bindingColors[bindingColor];
  const currentFont = fonts[fontFamily] || fonts.caveat;
  const pageBgColor = darkMode ? '#2a2520' : pageColors[pageColor];
  const currentDateColor = dateColors[dateColor] || dateColors.brown;
  const darkModeDateColor = darkMode ? '#d4a76a' : currentDateColor.color;
  const darkModeDayColor = darkMode ? '#b89860' : currentDateColor.dayColor;

  // Format date based on user preference
  const formatDate = (date: Date) => {
    switch (dateFormat) {
      case 'full':
        return format(date, 'MMMM d, yyyy').toUpperCase();
      case 'short':
        return format(date, 'MMM d, yyyy');
      case 'numeric':
        return format(date, 'M/d/yyyy');
      case 'dots':
        return format(date, 'M.d.yy');
      default:
        return format(date, 'MMMM d, yyyy').toUpperCase();
    }
  };

  // Navigation handlers
  const goToPreviousDay = () => {
    const prevDay = new Date(currentDate);
    prevDay.setDate(prevDay.getDate() - 1);
    setCurrentDate(prevDay);
  };

  const goToNextDay = () => {
    const nextDay = new Date(currentDate);
    nextDay.setDate(nextDay.getDate() + 1);
    setCurrentDate(nextDay);
  };

  const goToToday = () => {
    setCurrentDate(new Date());
  };

  // Entry handlers
  const handleMoodSelect = async (mood: Mood | null) => {
    if (currentEntry) {
      await updateEntry(currentEntry.id, currentEntry.content, mood, currentEntry.tags || []);
    } else {
      await createEntry(currentDate, '', mood, []);
    }
  };

  const handleTagsChange = async (tags: string[]) => {
    if (currentEntry) {
      await updateEntryTags(currentEntry.id, tags);
    }
  };

  const handleNewEntry = async () => {
    await createEntry(currentDate, '', null, []);
  };

  const handleLockEntry = async () => {
    if (currentEntry) {
      await lockEntry(currentEntry.id);
    }
  };

  const handleAddUpdate = async (text: string) => {
    if (currentEntry) {
      await addEntryUpdate(currentEntry.id, text);
    }
  };

  const handleToggleDarkMode = () => {
    const newMode = !darkMode;
    updateSetting('darkMode', newMode);
    analytics.themeChanged(newMode ? 'dark' : 'light');
  };

  const handleSelectEntry = (entry: JournalEntry) => {
    setCurrentDate(new Date(entry.date));
    setSelectedEntryId(entry.id);
    setShowSearch(false);
    setShowTags(false);
    setShowBookmarks(false);
  };

  const handleUsePrompt = (selection: PromptSelection) => {
    // Show prompt in floating bubble instead of inserting into notes
    setPinnedPrompt(selection);
  };

  // Handler for template selection - inserts template content into current entry
  const handleSelectTemplate = async (template: EntryTemplate) => {
    if (currentEntry) {
      // Append template content to existing entry
      const newContent = currentEntry.content
        ? `${currentEntry.content}${template.content}`
        : template.content;
      await updateEntry(currentEntry.id, newContent, currentEntry.mood as Mood | null, currentEntry.tags || []);
    } else {
      // Create new entry with template content
      await createEntry(currentDate, template.content, null, []);
    }
  };

  // Handler for program prompt selection
  const handleUseProgramPrompt = (prompt: string) => {
    // Show prompt in floating bubble
    setPinnedPrompt({ prompt, category: 'program' });
  };

  // Handler for pinning a quote (for the current date only)
  const handlePinQuote = (quote: Quote) => {
    setPinnedQuotes(prev => ({
      ...prev,
      [currentDateStr]: quote,
    }));
  };

  // Handler for locking a quote (persists in settings)
  const handleLockQuote = (quote: Quote) => {
    updateSetting('lockedQuote', quote);
    // Clear pinned quote for current date since locked quote takes priority
    setPinnedQuotes(prev => {
      const updated = { ...prev };
      delete updated[currentDateStr];
      return updated;
    });
  };

  // Handler for unlocking a quote (removes from settings)
  const handleUnlockQuote = () => {
    updateSetting('lockedQuote', null);
  };

  const handleLogout = () => {
    setIsClosing(true);
    analytics.userLoggedOut();
    setTimeout(() => {
      db.auth.signOut();
    }, 600);
  };

  const handlePrint = () => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    const entryContent = currentEntry?.content || '';
    const entryMood = currentEntry?.mood ? moods[currentEntry.mood as keyof typeof moods]?.name : '';
    const updates = currentEntry?.updates || [];

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>Journal Entry - ${formatDate(currentDate)}</title>
        <link rel="preconnect" href="https://fonts.googleapis.com">
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
        <link href="https://fonts.googleapis.com/css2?family=Caveat:wght@400;500;600;700&family=Patrick+Hand&family=Kalam:wght@300;400;700&family=Dancing+Script:wght@400;500;600;700&family=Shadows+Into+Light&family=Indie+Flower&family=Permanent+Marker&family=Gloria+Hallelujah&family=Homemade+Apple&family=Satisfy&family=Great+Vibes&family=Alex+Brush&family=Allura&family=Tangerine:wght@400;700&family=Architects+Daughter&family=Amatic+SC:wght@400;700&family=Short+Stack&family=Gochi+Hand&family=Annie+Use+Your+Telescope&family=Nothing+You+Could+Do&family=Marck+Script&family=Reenie+Beanie&family=Just+Another+Hand&family=Coming+Soon&family=Covered+By+Your+Grace&display=swap" rel="stylesheet">
        <style>
          @page { size: 8.5in 11in; margin: 1in; }
          * { box-sizing: border-box; }
          body {
            font-family: '${currentFont.displayName}', cursive;
            color: #1a1a1a;
            background: white;
            padding: 0;
            margin: 0;
            line-height: 1.8;
          }
          .header {
            text-align: center;
            margin-bottom: 2rem;
            padding-bottom: 1rem;
            border-bottom: 1px solid #e5e5e5;
          }
          .day {
            font-size: 0.875rem;
            color: ${currentDateColor.dayColor};
            letter-spacing: 0.1em;
            margin-bottom: 0.25rem;
          }
          .date {
            font-size: 1.5rem;
            font-weight: bold;
            color: ${currentDateColor.color};
          }
          .mood {
            font-size: 0.875rem;
            color: #666;
            margin-top: 0.5rem;
          }
          .content { font-size: inherit; }
          .content p { margin: 0 0 1em 0; line-height: 1.8; }
          .updates {
            margin-top: 2rem;
            padding-top: 1rem;
            border-top: 1px dashed #ccc;
          }
          .updates-title {
            font-size: 0.875rem;
            font-weight: 600;
            color: #666;
            margin-bottom: 1rem;
          }
          .update {
            margin-bottom: 1rem;
            padding: 0.75rem;
            background: #f9f9f9;
            border-radius: 4px;
          }
          .update-date {
            font-size: 0.75rem;
            color: #999;
            margin-bottom: 0.25rem;
          }
          @media print {
            body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
          }
        </style>
      </head>
      <body>
        <div class="header">
          <div class="day">— ${format(currentDate, 'EEEE')} —</div>
          <div class="date">${formatDate(currentDate)}</div>
          ${entryMood ? `<div class="mood">Mood: ${entryMood}</div>` : ''}
        </div>
        <div class="content">${entryContent}</div>
        ${updates.length > 0 ? `
          <div class="updates">
            <div class="updates-title">Updates</div>
            ${updates.map((update: { id: string; content: string; createdAt: number }) => `
              <div class="update">
                <div class="update-date">${format(new Date(update.createdAt), 'MMM d, yyyy h:mm a')}</div>
                <div>${update.content}</div>
              </div>
            `).join('')}
          </div>
        ` : ''}
      </body>
      </html>
    `);

    printWindow.document.close();
    setTimeout(() => {
      printWindow.print();
      analytics.entryPrinted();
    }, 500);
  };

  return (
    <div className="w-full flex items-center justify-center overflow-hidden py-4 pl-0 md:pl-20">
      {/* The Open Journal */}
      <div className="relative w-full max-w-[1400px] flex items-center justify-center px-4">
        {/* Book shadow on desk */}
        <div
          className="absolute w-full h-[600px] md:h-[700px] rounded-3xl blur-3xl opacity-50"
          style={{
            backgroundColor: binding.shadowColor,
            transform: 'translateY(40px)'
          }}
        />

        {/* The Book Container */}
        <motion.div
          className="relative w-full h-[600px] md:h-[700px] flex"
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{
            scale: isClosing ? 0.85 : 1,
            opacity: isClosing ? 0 : 1,
            rotateY: isClosing ? 30 : 0,
          }}
          transition={{ duration: 0.6 }}
          style={{ perspective: '1500px' }}
        >
          {/* Left Cover */}
          <BookCover bindingColor={binding.color} position="left" />

          {/* Center Spine/Binding */}
          <BookSpine bindingColor={binding.color} />

          {/* Right Page - The Writing Area */}
          <PageContent
            currentDate={currentDate}
            onPreviousDay={goToPreviousDay}
            onNextDay={goToNextDay}
            onToday={goToToday}
            dateColor={darkModeDateColor}
            dayColor={darkModeDayColor}
            formatDate={formatDate}
            dayEntries={dayEntries}
            selectedEntryId={selectedEntryId}
            currentEntry={currentEntry}
            isPastDay={isPastDay}
            onSelectEntry={(entryId) => setSelectedEntryId(entryId)}
            onNewEntry={handleNewEntry}
            onToggleBookmark={(entryId) => toggleBookmark(entryId)}
            onLockEntry={handleLockEntry}
            onDeleteEntry={deleteEntry}
            showMoodSelector={showMoodSelector}
            onMoodSelect={handleMoodSelect}
            allTags={allTags}
            onTagsChange={handleTagsChange}
            onAddUpdate={handleAddUpdate}
            darkMode={darkMode}
            pageBgColor={pageBgColor}
            pageLines={pageLines}
            fontClassName={currentFont.className}
            pinnedQuestion={pinnedQuestion}
            onDismissPinnedQuestion={() => setPinnedQuestion(null)}
            pinnedPrompt={pinnedPrompt}
            onDismissPinnedPrompt={() => setPinnedPrompt(null)}
            pinnedQuote={displayQuote}
            onDismissPinnedQuote={() => {
              setPinnedQuotes(prev => {
                const updated = { ...prev };
                delete updated[currentDateStr];
                return updated;
              });
            }}
            isQuoteLocked={!!lockedQuote && displayQuote?.text === lockedQuote.text}
          />

          {/* Right Cover Edge */}
          <BookCover bindingColor={binding.color} position="right" />
        </motion.div>

        {/* AI Writing Companion - only show when enabled */}
        {aiReflectionEnabled && (
          <div className="fixed top-6 right-6 z-50">
            <JournalAICompanion
              content={currentEntry?.content?.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim() || ''}
              onSelectQuestion={setPinnedQuestion}
            />
          </div>
        )}
      </div>

      {/* Left Sidebar */}
      <Sidebar
        darkMode={darkMode}
        onToggleDarkMode={handleToggleDarkMode}
        onShowSearch={() => setShowSearch(true)}
        onShowWhyPage={() => setShowWhyPage(true)}
        onShowBookmarks={() => setShowBookmarks(true)}
        onShowTags={() => setShowTags(true)}
        onShowMoodInsights={() => setShowMoodInsights(true)}
        onShowCalendar={() => setShowCalendar(true)}
        onShowPDFExport={() => setShowPDFExport(true)}
        onPrint={handlePrint}
        onShowSettings={() => setShowSettings(true)}
        onLogout={handleLogout}
        onShowPrompt={() => setShowPromptModal(true)}
        onShowOnThisDay={() => setShowOnThisDay(true)}
        showMoodSelector={showMoodSelector}
        isLoggingOut={isClosing}
        // Optional sidebar features
        showWritingStats={showWritingStatsSetting}
        showEntryTemplates={showEntryTemplatesSetting}
        showGuidedPrograms={showGuidedProgramsSetting}
        showDailyQuote={showDailyQuoteSetting}
        onShowWritingStats={() => setShowWritingStats(true)}
        onShowEntryTemplates={() => setShowEntryTemplates(true)}
        onShowGuidedPrograms={() => setShowGuidedPrograms(true)}
        onShowDailyQuote={() => setShowDailyQuote(true)}
      />

      {/* All Modals */}
      <ModalsContainer
        showCalendar={showCalendar}
        showSettings={showSettings}
        showMoodInsights={showMoodInsights}
        showWhyPage={showWhyPage}
        showSearch={showSearch}
        showTags={showTags}
        showBookmarks={showBookmarks}
        showOnThisDay={showOnThisDay}
        showPDFExport={showPDFExport}
        showPromptModal={showPromptModal}
        showWritingStats={showWritingStats}
        showEntryTemplates={showEntryTemplates}
        showGuidedPrograms={showGuidedPrograms}
        showDailyQuote={showDailyQuote}
        onCloseCalendar={() => setShowCalendar(false)}
        onCloseSettings={() => setShowSettings(false)}
        onCloseMoodInsights={() => setShowMoodInsights(false)}
        onCloseWhyPage={() => setShowWhyPage(false)}
        onCloseSearch={() => setShowSearch(false)}
        onCloseTags={() => setShowTags(false)}
        onCloseBookmarks={() => setShowBookmarks(false)}
        onCloseOnThisDay={() => setShowOnThisDay(false)}
        onClosePDFExport={() => setShowPDFExport(false)}
        onClosePromptModal={() => setShowPromptModal(false)}
        onCloseWritingStats={() => setShowWritingStats(false)}
        onCloseEntryTemplates={() => setShowEntryTemplates(false)}
        onCloseGuidedPrograms={() => setShowGuidedPrograms(false)}
        onCloseDailyQuote={() => setShowDailyQuote(false)}
        currentDate={currentDate}
        onSelectDate={(date) => {
          setCurrentDate(date);
          setShowCalendar(false);
        }}
        onSelectEntry={handleSelectEntry}
        onUsePrompt={handleUsePrompt}
        onSelectTemplate={handleSelectTemplate}
        onUseProgramPrompt={handleUseProgramPrompt}
        onPinQuote={handlePinQuote}
        onLockQuote={handleLockQuote}
        onUnlockQuote={handleUnlockQuote}
        lockedQuote={lockedQuote}
      />
    </div>
  );
}
