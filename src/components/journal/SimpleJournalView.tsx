'use client';

import { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { format, startOfDay, isAfter, isToday } from 'date-fns';
import {
  ChevronLeft,
  ChevronRight,
  Search,
  Bookmark,
  Plus,
  MoreHorizontal,
  Lock,
  Trash2,
  X,
} from 'lucide-react';
import { cn } from '@/lib/utils/cn';
import { db } from '@/lib/db/instant';
import { useJournal } from '@/hooks/useJournal';
import { useSettings } from '@/hooks/useSettings';
import { RichTextEditor } from '../editor/RichTextEditor';
import { MoodSelector } from '../editor/MoodSelector';
import { TagInput } from '../editor/TagInput';
import { Sidebar } from '../navigation/Sidebar';
import { ModalsContainer } from './ModalsContainer';
import { analytics } from '@/components/providers/PostHogProvider';
import { fonts } from '@/constants/fonts';
import { inkColors, dateColors } from '@/constants/themes';
import { moods } from '@/constants/moods';
import type { Mood } from '@/types/journal';
import type { JournalEntry } from '@/lib/db/instant';
import type { Quote } from '@/constants/quotes';
import type { EntryTemplate } from '@/constants/templates';
import type { PromptSelection } from '../editor/DailyPromptModal';

export function SimpleJournalView() {
  // Modal visibility states
  const [showSettings, setShowSettings] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [showCalendar, setShowCalendar] = useState(false);
  const [showTags, setShowTags] = useState(false);
  const [showBookmarks, setShowBookmarks] = useState(false);
  const [showMoodInsights, setShowMoodInsights] = useState(false);
  const [showWhyPage, setShowWhyPage] = useState(false);
  const [showPDFExport, setShowPDFExport] = useState(false);
  const [showPromptModal, setShowPromptModal] = useState(false);
  const [showOnThisDay, setShowOnThisDay] = useState(false);
  const [showWritingStats, setShowWritingStats] = useState(false);
  const [showEntryTemplates, setShowEntryTemplates] = useState(false);
  const [showGuidedPrograms, setShowGuidedPrograms] = useState(false);
  const [showDailyQuote, setShowDailyQuote] = useState(false);
  const [showEntryMenu, setShowEntryMenu] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const [pinnedPrompt, setPinnedPrompt] = useState<PromptSelection | null>(null);
  const [isHoveringQuote, setIsHoveringQuote] = useState(false);

  // Initialize pinned quotes from localStorage
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
    deleteEntry,
    toggleBookmark,
    updateEntryTags,
    allTags,
  } = useJournal();

  const {
    fontFamily,
    inkColor,
    showMoodSelector,
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

  // Handle dark mode
  useEffect(() => {
    if (darkMode) {
      document.body.classList.add('dark-mode');
    } else {
      document.body.classList.remove('dark-mode');
    }
  }, [darkMode]);

  // Check if current date is a past day (not today)
  const isPastDay = useMemo(() => {
    const today = startOfDay(new Date());
    const current = startOfDay(currentDate);
    return isAfter(today, current);
  }, [currentDate]);

  // Determine which quote to show for the current date
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
  const currentFont = fonts[fontFamily] || fonts.caveat;
  const currentInkColor = inkColors[inkColor] || inkColors.black;
  const currentDateColor = dateColors[dateColor] || dateColors.brown;

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
      setShowEntryMenu(false);
    }
  };

  const handleDeleteEntry = async () => {
    if (currentEntry) {
      await deleteEntry(currentEntry.id);
      setShowEntryMenu(false);
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

  const handleSelectTemplate = async (template: EntryTemplate) => {
    if (currentEntry) {
      const newContent = currentEntry.content
        ? `${currentEntry.content}${template.content}`
        : template.content;
      await updateEntry(currentEntry.id, newContent, currentEntry.mood as Mood | null, currentEntry.tags || []);
    } else {
      await createEntry(currentDate, template.content, null, []);
    }
  };

  const handleUsePrompt = (selection: PromptSelection) => {
    setPinnedPrompt(selection);
  };

  const handleUseProgramPrompt = (prompt: string) => {
    setPinnedPrompt({ prompt, category: 'guided program' });
  };

  // Handler for pinning a quote to a specific date
  const handlePinQuote = (quote: Quote) => {
    setPinnedQuotes(prev => ({
      ...prev,
      [currentDateStr]: quote,
    }));
  };

  // Handler for locking a quote (persists in settings, shows on all dates)
  const handleLockQuote = (quote: Quote) => {
    updateSetting('lockedQuote', quote);
    // Clear pinned quote for current date since locked quote takes priority
    setPinnedQuotes(prev => {
      const updated = { ...prev };
      delete updated[currentDateStr];
      return updated;
    });
  };

  // Handler for unlocking a quote
  const handleUnlockQuote = () => {
    updateSetting('lockedQuote', null);
  };

  // Handler to dismiss pinned quote for current date
  const handleDismissQuote = () => {
    setPinnedQuotes(prev => {
      const updated = { ...prev };
      delete updated[currentDateStr];
      return updated;
    });
  };

  // Print handler
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
        <link href="https://fonts.googleapis.com/css2?family=Caveat:wght@400;500;600;700&family=Patrick+Hand&family=Kalam:wght@300;400;700&display=swap" rel="stylesheet">
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

  const handleLogout = () => {
    setIsClosing(true);
    analytics.userLoggedOut();
    setTimeout(() => {
      db.auth.signOut();
    }, 600);
  };

  // Background color based on dark mode - warmer tones
  const bgColor = darkMode ? 'bg-[#1a1816]' : 'bg-[#faf8f5]';
  const textColor = darkMode ? 'text-amber-50' : 'text-stone-800';
  const mutedTextColor = darkMode ? 'text-amber-200/60' : 'text-stone-500';
  const borderColor = darkMode ? 'border-amber-900/30' : 'border-stone-200';
  const cardBgColor = darkMode ? 'bg-[#252220]' : 'bg-white';

  return (
    <>
      <motion.div
        className={cn('min-h-screen flex flex-col pl-0 md:pl-20', bgColor)}
        initial={{ opacity: 0 }}
        animate={{ opacity: isClosing ? 0 : 1 }}
        transition={{ duration: 0.3 }}
      >
        {/* Header */}
      <header className={cn('border-b', borderColor, darkMode ? 'bg-[#1f1d1a]' : 'bg-white/80 backdrop-blur-sm')}>
        <div className="max-w-4xl mx-auto px-6 py-5 flex items-center justify-between">
          {/* Date Navigation */}
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-1">
              <button
                onClick={goToPreviousDay}
                className={cn(
                  'p-2.5 rounded-full transition-all',
                  darkMode ? 'hover:bg-amber-900/30 active:bg-amber-900/50' : 'hover:bg-stone-100 active:bg-stone-200'
                )}
              >
                <ChevronLeft className={cn('w-5 h-5', mutedTextColor)} />
              </button>

              <button
                onClick={() => setShowCalendar(true)}
                className={cn(
                  'px-5 py-2 rounded-xl transition-all text-center min-w-[200px]',
                  darkMode ? 'hover:bg-amber-900/20' : 'hover:bg-stone-50'
                )}
              >
                <p className={cn('text-[11px] uppercase tracking-[0.2em] mb-0.5', mutedTextColor)}>
                  {format(currentDate, 'EEEE')}
                </p>
                <p
                  className={cn('text-xl font-medium tracking-wide')}
                  style={{
                    color: darkMode ? '#d4a574' : currentDateColor.color,
                    fontFamily: 'Georgia, serif'
                  }}
                >
                  {formatDate(currentDate)}
                </p>
              </button>

              <button
                onClick={goToNextDay}
                className={cn(
                  'p-2.5 rounded-full transition-all',
                  darkMode ? 'hover:bg-amber-900/30 active:bg-amber-900/50' : 'hover:bg-stone-100 active:bg-stone-200'
                )}
              >
                <ChevronRight className={cn('w-5 h-5', mutedTextColor)} />
              </button>

              {!isToday(currentDate) && (
                <button
                  onClick={goToToday}
                  className={cn(
                    'ml-2 px-4 py-2 text-sm rounded-full transition-all font-medium',
                    darkMode
                      ? 'bg-amber-900/40 hover:bg-amber-900/60 text-amber-200'
                      : 'bg-stone-100 hover:bg-stone-200 text-stone-600'
                  )}
                >
                  Today
                </button>
              )}
            </div>
          </div>

          {/* Quick Actions - just search, rest in sidebar */}
          <button
            onClick={() => setShowSearch(true)}
            className={cn(
              'p-2.5 rounded-full transition-all',
              darkMode ? 'hover:bg-amber-900/30' : 'hover:bg-stone-100'
            )}
            title="Search"
          >
            <Search className={cn('w-5 h-5', mutedTextColor)} />
          </button>
        </div>

        {/* Pinned Quote - elegant centered blockquote */}
        <AnimatePresence>
          {displayQuote && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="relative py-3 border-t"
              style={{ borderColor: darkMode ? 'rgba(180, 140, 100, 0.15)' : 'rgba(0,0,0,0.05)' }}
              onMouseEnter={() => setIsHoveringQuote(true)}
              onMouseLeave={() => setIsHoveringQuote(false)}
            >
              <blockquote className="text-sm italic text-center max-w-lg mx-auto px-8">
                <p className={cn(
                  'leading-relaxed',
                  darkMode ? 'text-amber-200/70' : 'text-stone-500'
                )}>
                  "{displayQuote.text}"
                </p>
                <cite className={cn(
                  'block text-xs mt-1.5 not-italic flex items-center justify-center gap-1.5',
                  darkMode ? 'text-amber-300/50' : 'text-stone-400'
                )}>
                  — {displayQuote.author}
                  {lockedQuote && displayQuote.text === lockedQuote.text && (
                    <Lock className="w-3 h-3 text-amber-500" />
                  )}
                </cite>
              </blockquote>

              {/* Dismiss button - appears on hover, only for non-locked quotes */}
              <AnimatePresence>
                {isHoveringQuote && !(lockedQuote && displayQuote.text === lockedQuote.text) && (
                  <motion.button
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    transition={{ duration: 0.15 }}
                    onClick={handleDismissQuote}
                    className={cn(
                      'absolute top-2 right-4 p-1 rounded-full transition-colors',
                      darkMode
                        ? 'hover:bg-neutral-700 text-neutral-500 hover:text-neutral-300'
                        : 'hover:bg-neutral-200 text-neutral-400 hover:text-neutral-600'
                    )}
                    title="Dismiss quote"
                  >
                    <X className="w-4 h-4" />
                  </motion.button>
                )}
              </AnimatePresence>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-4xl mx-auto w-full px-6 py-4">
        {/* Entry Tabs (if multiple entries for the day) */}
        {dayEntries.length > 1 && (
          <div className={cn('flex gap-3 mb-6 pb-4 border-b overflow-x-auto', borderColor)}>
            {dayEntries.map((entry, index) => (
              <button
                key={entry.id}
                onClick={() => setSelectedEntryId(entry.id)}
                className={cn(
                  'px-4 py-2 text-sm rounded-full whitespace-nowrap transition-all flex items-center gap-2',
                  selectedEntryId === entry.id
                    ? darkMode
                      ? 'bg-amber-900/50 text-amber-100 shadow-sm'
                      : 'bg-stone-800 text-white shadow-sm'
                    : darkMode
                    ? 'text-amber-200/60 hover:bg-amber-900/30'
                    : 'text-stone-500 hover:bg-stone-100'
                )}
              >
                Entry {index + 1}
                {entry.isLocked && <Lock className="w-3 h-3" />}
                {entry.isBookmarked && <Bookmark className="w-3 h-3 fill-current" />}
              </button>
            ))}
            <button
              onClick={handleNewEntry}
              className={cn(
                'px-4 py-2 text-sm rounded-full transition-all flex items-center gap-1.5',
                darkMode
                  ? 'text-amber-200/60 hover:bg-amber-900/30 border border-amber-800/30'
                  : 'text-stone-500 hover:bg-stone-100 border border-stone-200'
              )}
            >
              <Plus className="w-4 h-4" />
              New
            </button>
          </div>
        )}

        {/* Editor Card */}
        <div className={cn(
          'rounded-2xl border shadow-lg',
          cardBgColor,
          borderColor,
          darkMode ? 'shadow-black/20' : 'shadow-stone-200/50'
        )}>
          {/* Entry Toolbar */}
          <div className={cn('px-6 py-4 border-b flex items-center justify-between', borderColor)}>
            <div className="flex items-center gap-4">
              {/* Mood Selector */}
              {showMoodSelector && (
                <MoodSelector
                  selectedMood={currentEntry?.mood as Mood | null}
                  onSelect={handleMoodSelect}
                />
              )}

              {/* Tags */}
              <TagInput
                tags={currentEntry?.tags || []}
                allTags={allTags}
                onTagsChange={handleTagsChange}
                darkMode={darkMode}
              />
            </div>

            {/* Entry Actions */}
            <div className="flex items-center gap-1 relative">
              {currentEntry && (
                <>
                  <button
                    onClick={() => toggleBookmark(currentEntry.id)}
                    className={cn(
                      'p-2.5 rounded-full transition-all',
                      currentEntry.isBookmarked
                        ? 'text-amber-500'
                        : darkMode
                        ? 'text-amber-200/50 hover:bg-amber-900/30'
                        : 'text-stone-400 hover:bg-stone-100'
                    )}
                    title={currentEntry.isBookmarked ? 'Remove bookmark' : 'Bookmark'}
                  >
                    <Bookmark
                      className={cn('w-5 h-5', currentEntry.isBookmarked && 'fill-current')}
                    />
                  </button>
                  <button
                    onClick={() => setShowEntryMenu(!showEntryMenu)}
                    className={cn(
                      'p-2.5 rounded-full transition-all',
                      darkMode
                        ? 'text-amber-200/50 hover:bg-amber-900/30'
                        : 'text-stone-400 hover:bg-stone-100'
                    )}
                  >
                    <MoreHorizontal className="w-5 h-5" />
                  </button>

                  {/* Entry Menu Dropdown */}
                  <AnimatePresence>
                    {showEntryMenu && (
                      <motion.div
                        initial={{ opacity: 0, y: -10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -10, scale: 0.95 }}
                        className={cn(
                          'absolute right-0 top-full mt-2 py-2 rounded-xl shadow-xl border z-50 min-w-[160px]',
                          darkMode ? 'bg-[#2a2725] border-amber-900/30' : 'bg-white border-stone-200'
                        )}
                      >
                        {!currentEntry.isLocked && (
                          <button
                            onClick={handleLockEntry}
                            className={cn(
                              'w-full px-4 py-2.5 text-left text-sm flex items-center gap-3 transition-colors',
                              darkMode ? 'text-amber-100 hover:bg-amber-900/30' : 'text-stone-700 hover:bg-stone-50'
                            )}
                          >
                            <Lock className="w-4 h-4" />
                            Lock entry
                          </button>
                        )}
                        <button
                          onClick={handleDeleteEntry}
                          className={cn(
                            'w-full px-4 py-2.5 text-left text-sm flex items-center gap-3 transition-colors text-red-500',
                            darkMode ? 'hover:bg-red-900/20' : 'hover:bg-red-50'
                          )}
                        >
                          <Trash2 className="w-4 h-4" />
                          Delete entry
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </>
              )}

              {!currentEntry && dayEntries.length === 0 && (
                <button
                  onClick={handleNewEntry}
                  className={cn(
                    'px-5 py-2.5 text-sm rounded-full transition-all flex items-center gap-2 font-medium',
                    darkMode
                      ? 'bg-amber-900/50 hover:bg-amber-900/70 text-amber-100'
                      : 'bg-stone-800 hover:bg-stone-700 text-white'
                  )}
                >
                  <Plus className="w-4 h-4" />
                  Start writing
                </button>
              )}
            </div>
          </div>

          {/* Pinned Prompt - inline display */}
          <AnimatePresence>
            {pinnedPrompt && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="px-6 py-5"
              >
                <div className={cn(
                  'rounded-xl p-5 border-2 shadow-md',
                  darkMode
                    ? 'bg-gradient-to-r from-amber-900/40 to-amber-800/30 border-amber-700/50'
                    : 'bg-gradient-to-r from-stone-800 to-stone-700 border-stone-600'
                )}>
                  <div className="flex items-start gap-4">
                    <div className={cn(
                      'p-2.5 rounded-full flex-shrink-0',
                      darkMode ? 'bg-amber-500/20' : 'bg-white/10'
                    )}>
                      <span className="text-xl">💡</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      {pinnedPrompt.category && (
                        <span className={cn(
                          'text-xs uppercase tracking-wider mb-2 block',
                          darkMode ? 'text-amber-400/70' : 'text-amber-300'
                        )}>
                          {pinnedPrompt.category}
                        </span>
                      )}
                      <p className={cn(
                        'text-lg font-semibold leading-relaxed',
                        darkMode ? 'text-amber-100' : 'text-white'
                      )}>
                        {pinnedPrompt.prompt}
                      </p>
                    </div>
                    <button
                      onClick={() => setPinnedPrompt(null)}
                      className={cn(
                        'p-2 rounded-full transition-colors flex-shrink-0',
                        darkMode ? 'hover:bg-white/10 text-amber-300/60' : 'hover:bg-white/10 text-white/60'
                      )}
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Editor */}
          <div
            className="p-8 min-h-[600px] max-h-[calc(100vh-140px)] overflow-y-auto"
            style={{
              fontFamily: `var(--font-${fontFamily.toLowerCase().replace(/\s/g, '')}), cursive`,
            }}
          >
            <RichTextEditor
              entry={
                currentEntry
                  ? {
                      id: currentEntry.id,
                      content: currentEntry.content,
                      mood: currentEntry.mood as Mood | null,
                      tags: currentEntry.tags || [],
                      images: currentEntry.images,
                    }
                  : undefined
              }
              date={currentDate}
              isLocked={currentEntry?.isLocked}
            />
          </div>
        </div>
      </main>
      </motion.div>

      {/* Click outside to close entry menu */}
      {showEntryMenu && (
        <div className="fixed inset-0 z-40" onClick={() => setShowEntryMenu(false)} />
      )}

      {/* Sidebar */}
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
    </>
  );
}
