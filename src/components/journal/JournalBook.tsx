'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { format } from 'date-fns';
import { ChevronLeft, ChevronRight, Plus, Lock, Unlock, MessageSquarePlus, Bookmark } from 'lucide-react';
import { cn } from '@/lib/utils/cn';
import { db } from '@/lib/db/instant';
import { useJournal } from '@/hooks/useJournal';
import { useSettings } from '@/hooks/useSettings';
import { bindingColors, pageColors, dateColors } from '@/constants/themes';
import { fonts } from '@/constants/fonts';
import { moods } from '@/constants/moods';
import { RichTextEditor } from '../editor/RichTextEditor';
import { MoodSelector } from '../editor/MoodSelector';
import { AIReflection, type ReflectionQuestion } from '../editor/AIReflection';
import { ThoughtBubble } from '../editor/ThoughtBubble';
import { CalendarView } from '../navigation/CalendarView';
import { SettingsPanel } from '../settings/SettingsPanel';
import { MoodInsights } from '../navigation/MoodInsights';
import { SearchModal } from '../navigation/SearchModal';
import { TagsView } from '../navigation/TagsView';
import { BookmarksView } from '../navigation/BookmarksView';
import { PDFExport } from '../navigation/PDFExport';
import { NotebooksView } from '../navigation/NotebooksView';
import { Sidebar } from '../navigation/Sidebar';
import { WhyPage } from './WhyPage';
import { DailyPromptModal } from '../editor/DailyPromptModal';
import type { Mood } from '@/types/journal';
import type { JournalEntry } from '@/lib/db/instant';

export function JournalBook() {
  const [showCalendar, setShowCalendar] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showMoodInsights, setShowMoodInsights] = useState(false);
  const [showWhyPage, setShowWhyPage] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [showTags, setShowTags] = useState(false);
  const [showBookmarks, setShowBookmarks] = useState(false);
  const [showPDFExport, setShowPDFExport] = useState(false);
  const [showNotebooks, setShowNotebooks] = useState(false);
  const [showPromptModal, setShowPromptModal] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const [pinnedQuestion, setPinnedQuestion] = useState<ReflectionQuestion | null>(null);

  const [showUpdateInput, setShowUpdateInput] = useState(false);
  const [updateText, setUpdateText] = useState('');

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
    toggleBookmark,
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
  } = useSettings();

  // Handle dark mode
  useEffect(() => {
    if (darkMode) {
      document.body.classList.add('dark-mode');
    } else {
      document.body.classList.remove('dark-mode');
    }
  }, [darkMode]);

  const handleToggleDarkMode = () => {
    updateSetting('darkMode', !darkMode);
  };

  const handleSelectEntry = (entry: JournalEntry) => {
    setCurrentDate(new Date(entry.date));
    setSelectedEntryId(entry.id);
    setShowSearch(false);
    setShowTags(false);
    setShowBookmarks(false);
  };

  const handleUsePrompt = async (prompt: string) => {
    const promptHtml = `<p><em>${prompt}</em></p><p></p>`;

    if (!currentEntry) {
      // No entry exists, create one with the prompt
      await createEntry(currentDate, promptHtml, null, []);
    } else {
      // Entry exists - check if it's empty or has content
      const plainText = currentEntry.content?.replace(/<[^>]*>/g, '').trim() || '';
      if (!plainText) {
        // Entry is empty, update it with the prompt
        await updateEntry(currentEntry.id, promptHtml, currentEntry.mood as any, currentEntry.tags || []);
      } else {
        // Entry has content, append the prompt
        const newContent = currentEntry.content + `<p></p><p><em>${prompt}</em></p><p></p>`;
        await updateEntry(currentEntry.id, newContent, currentEntry.mood as any, currentEntry.tags || []);
      }
    }
  };

  const binding = bindingColors[bindingColor];
  const currentFont = fonts[fontFamily] || fonts.caveat;
  const pageBgColor = darkMode ? '#2a2520' : pageColors[pageColor];
  const currentDateColor = dateColors[dateColor] || dateColors.brown;

  // Dark mode adjusted colors
  const darkModeTextColor = darkMode ? '#e5c89b' : undefined;
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

  const handleMoodSelect = async (mood: Mood | null) => {
    if (currentEntry) {
      await updateEntry(currentEntry.id, currentEntry.content, mood, currentEntry.tags || []);
    } else {
      await createEntry(currentDate, '', mood, []);
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

  const handleAddUpdate = async () => {
    if (currentEntry && updateText.trim()) {
      await addEntryUpdate(currentEntry.id, updateText.trim());
      setUpdateText('');
      setShowUpdateInput(false);
    }
  };

  const formatEntryTime = (timestamp: number) => {
    return format(new Date(timestamp), 'h:mm a');
  };

  const handleLogout = () => {
    setIsClosing(true);
    setTimeout(() => {
      db.auth.signOut();
    }, 600);
  };

  const handlePrint = () => {
    // Create a print-friendly version
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    const entryContent = currentEntry?.content || '';
    const entryMood = currentEntry?.mood ? moods[currentEntry.mood as keyof typeof moods]?.label : '';
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
          @page {
            size: 8.5in 11in;
            margin: 1in;
          }

          * {
            box-sizing: border-box;
          }

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

          .content {
            font-size: inherit;
          }

          .content p {
            margin: 0 0 1em 0;
            line-height: 1.8;
          }

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
            body {
              -webkit-print-color-adjust: exact;
              print-color-adjust: exact;
            }
          }
        </style>
      </head>
      <body>
        <div class="header">
          <div class="day">— ${format(currentDate, 'EEEE')} —</div>
          <div class="date">${formatDate(currentDate)}</div>
          ${entryMood ? `<div class="mood">Mood: ${entryMood}</div>` : ''}
        </div>

        <div class="content">
          ${entryContent}
        </div>

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

    // Wait for fonts to load then print
    setTimeout(() => {
      printWindow.print();
    }, 500);
  };

  return (
    <div className="w-full flex items-center justify-center overflow-hidden py-4 pl-20">
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
          {/* Left Cover (Back of front cover visible) */}
          <div
            className="relative w-16 md:w-24 h-full rounded-l-2xl flex-shrink-0"
            style={{
              backgroundColor: binding.color,
              boxShadow: `
                inset -20px 0 40px rgba(0, 0, 0, 0.4),
                inset 0 0 60px rgba(0, 0, 0, 0.3),
                -8px 0 20px rgba(0, 0, 0, 0.2)
              `,
            }}
          >
            {/* Realistic leather texture */}
            <svg className="absolute inset-0 w-full h-full rounded-l-2xl pointer-events-none" preserveAspectRatio="none">
              <defs>
                <filter id="leatherLeft" x="0" y="0" width="100%" height="100%">
                  <feTurbulence type="fractalNoise" baseFrequency="0.03" numOctaves="6" seed="20" result="noise"/>
                  <feDiffuseLighting in="noise" lightingColor="#fff" surfaceScale="4" result="bump">
                    <feDistantLight azimuth="135" elevation="45"/>
                  </feDiffuseLighting>
                </filter>
                <filter id="grainLeft">
                  <feTurbulence type="turbulence" baseFrequency="0.8" numOctaves="3"/>
                  <feColorMatrix type="saturate" values="0"/>
                </filter>
              </defs>
              <rect width="100%" height="100%" filter="url(#leatherLeft)" opacity="0.25"/>
              <rect width="100%" height="100%" filter="url(#grainLeft)" opacity="0.08"/>
            </svg>

            {/* Spine binding */}
            <div
              className="absolute right-0 top-0 bottom-0 w-4"
              style={{
                background: 'linear-gradient(90deg, transparent 0%, rgba(0,0,0,0.5) 100%)',
              }}
            />
          </div>

          {/* Center Spine/Binding */}
          <div
            className="relative w-8 md:w-12 h-full flex-shrink-0"
            style={{
              background: `linear-gradient(90deg,
                ${binding.color} 0%,
                rgba(0,0,0,0.6) 20%,
                rgba(0,0,0,0.8) 50%,
                rgba(0,0,0,0.6) 80%,
                ${binding.color} 100%
              )`,
              boxShadow: 'inset 0 0 30px rgba(0,0,0,0.5)',
            }}
          >
            {/* Ring binding holes */}
            <div className="absolute inset-x-0 top-12 bottom-12 flex flex-col justify-around items-center">
              {[...Array(7)].map((_, i) => (
                <div
                  key={i}
                  className="w-4 h-4 md:w-5 md:h-5 rounded-full"
                  style={{
                    background: 'linear-gradient(135deg, #888 0%, #ccc 50%, #999 100%)',
                    boxShadow: 'inset 2px 2px 4px rgba(0,0,0,0.4), 0 2px 4px rgba(0,0,0,0.3)',
                  }}
                />
              ))}
            </div>
          </div>

          {/* Right Page - The Writing Area */}
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

            {/* Red margin line */}
            <div
              className="absolute top-0 bottom-0 w-px left-24 md:left-32 opacity-30"
              style={{ backgroundColor: '#e57373' }}
            />

            {/* Page Content */}
            <div className="relative h-full flex flex-col p-6 md:p-10 pl-28 md:pl-36 overflow-hidden">
              {/* Date Header */}
              <div className="flex items-center justify-between mb-6 md:mb-8">
                <button
                  onClick={goToPreviousDay}
                  className={cn(
                    'p-2 md:p-3 rounded-full transition-colors',
                    darkMode ? 'hover:bg-amber-500/20' : 'hover:bg-amber-100/50'
                  )}
                >
                  <ChevronLeft className={cn(
                    'w-6 h-6 md:w-8 md:h-8',
                    darkMode ? 'text-amber-400/60' : 'text-amber-800/60'
                  )} />
                </button>

                <button onClick={goToToday} className="text-center group">
                  <p
                    className="text-sm md:text-base transition-colors tracking-wider"
                    style={{ color: darkModeDayColor }}
                  >
                    — {format(currentDate, 'EEEE')} —
                  </p>
                  <p
                    className="text-xl md:text-2xl font-bold tracking-wide mt-1"
                    style={{ color: darkModeDateColor }}
                  >
                    {formatDate(currentDate)}
                  </p>
                </button>

                <button
                  onClick={goToNextDay}
                  className={cn(
                    'p-2 md:p-3 rounded-full transition-colors',
                    darkMode ? 'hover:bg-amber-500/20' : 'hover:bg-amber-100/50'
                  )}
                >
                  <ChevronRight className={cn(
                    'w-6 h-6 md:w-8 md:h-8',
                    darkMode ? 'text-amber-400/60' : 'text-amber-800/60'
                  )} />
                </button>
              </div>

              {/* Mood Selector - conditionally rendered */}
              {showMoodSelector && (
                <div className="mb-4 md:mb-6">
                  <MoodSelector
                    selectedMood={(currentEntry?.mood as Mood) || null}
                    onSelect={handleMoodSelect}
                  />
                </div>
              )}

              {/* Entry Tabs - show when multiple entries or to create new */}
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
                        onClick={() => setSelectedEntryId(entry.id)}
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
                <button
                  onClick={handleNewEntry}
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
                {currentEntry && (
                  <button
                    onClick={() => toggleBookmark(currentEntry.id)}
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
                {currentEntry && !currentEntry.isLocked && (
                  <button
                    onClick={handleLockEntry}
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
                {currentEntry?.isLocked && (
                  <div className={cn(
                    'p-2 rounded-lg',
                    darkMode ? 'bg-gray-700 text-gray-400' : 'bg-gray-100 text-gray-500'
                  )} title="Entry is locked">
                    <Lock className="w-4 h-4" />
                  </div>
                )}
              </div>

              {/* Journal Editor - The main writing area */}
              <div className="flex-1 overflow-y-auto overflow-x-hidden relative">
                {/* Pinned Thought Bubble */}
                <AnimatePresence>
                  {pinnedQuestion && (
                    <ThoughtBubble
                      question={pinnedQuestion}
                      onDismiss={() => setPinnedQuestion(null)}
                    />
                  )}
                </AnimatePresence>

                <RichTextEditor
                  entry={currentEntry}
                  date={currentDate}
                  isLocked={currentEntry?.isLocked || false}
                />

                {/* Updates Section for Locked Entries */}
                {currentEntry?.isLocked && (
                  <div className="mt-6 pt-4 border-t-2 border-dashed border-amber-300">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="text-sm font-semibold text-amber-800 flex items-center gap-2">
                        <MessageSquarePlus className="w-4 h-4" />
                        Updates
                      </h3>
                      {!showUpdateInput && (
                        <button
                          onClick={() => setShowUpdateInput(true)}
                          className="text-xs px-3 py-1 rounded-full bg-amber-100 hover:bg-amber-200 text-amber-700 transition-all"
                        >
                          + Add Update
                        </button>
                      )}
                    </div>

                    {/* Existing Updates */}
                    {currentEntry.updates && currentEntry.updates.length > 0 && (
                      <div className="space-y-3 mb-4">
                        {currentEntry.updates.map((update: { id: string; content: string; createdAt: number }) => (
                          <div
                            key={update.id}
                            className="p-3 bg-amber-50 rounded-lg border border-amber-200"
                          >
                            <p className="text-xs text-amber-500 mb-1">
                              {format(new Date(update.createdAt), 'MMM d, yyyy h:mm a')}
                            </p>
                            <p className={cn('text-amber-900', currentFont.className)}>
                              {update.content}
                            </p>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* New Update Input */}
                    {showUpdateInput && (
                      <div className="p-3 bg-white rounded-lg border-2 border-amber-300">
                        <textarea
                          value={updateText}
                          onChange={(e) => setUpdateText(e.target.value)}
                          placeholder="Add an update to this entry..."
                          className={cn(
                            'w-full min-h-[80px] p-2 rounded border border-amber-200 focus:outline-none focus:ring-2 focus:ring-amber-500 resize-none',
                            currentFont.className
                          )}
                        />
                        <div className="flex justify-end gap-2 mt-2">
                          <button
                            onClick={() => {
                              setShowUpdateInput(false);
                              setUpdateText('');
                            }}
                            className="px-3 py-1 text-sm text-amber-600 hover:text-amber-800"
                          >
                            Cancel
                          </button>
                          <button
                            onClick={handleAddUpdate}
                            disabled={!updateText.trim()}
                            className="px-4 py-1 text-sm bg-amber-500 text-white rounded-lg hover:bg-amber-600 disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            Save Update
                          </button>
                        </div>
                      </div>
                    )}

                    {!currentEntry.updates?.length && !showUpdateInput && (
                      <p className="text-sm text-amber-400 italic">
                        No updates yet. Add one to note how things changed.
                      </p>
                    )}
                  </div>
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

          {/* Right Cover Edge (visible part) */}
          <div
            className="relative w-4 md:w-6 h-full rounded-r-xl flex-shrink-0 overflow-hidden"
            style={{
              backgroundColor: binding.color,
              boxShadow: `
                inset 10px 0 20px rgba(0, 0, 0, 0.3),
                8px 0 20px rgba(0, 0, 0, 0.2)
              `,
            }}
          >
            {/* Realistic leather texture */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none" preserveAspectRatio="none">
              <defs>
                <filter id="leatherRight" x="0" y="0" width="100%" height="100%">
                  <feTurbulence type="fractalNoise" baseFrequency="0.03" numOctaves="6" seed="25" result="noise"/>
                  <feDiffuseLighting in="noise" lightingColor="#fff" surfaceScale="4" result="bump">
                    <feDistantLight azimuth="135" elevation="45"/>
                  </feDiffuseLighting>
                </filter>
                <filter id="grainRight">
                  <feTurbulence type="turbulence" baseFrequency="0.8" numOctaves="3"/>
                  <feColorMatrix type="saturate" values="0"/>
                </filter>
              </defs>
              <rect width="100%" height="100%" filter="url(#leatherRight)" opacity="0.25"/>
              <rect width="100%" height="100%" filter="url(#grainRight)" opacity="0.08"/>
            </svg>
          </div>
        </motion.div>

        {/* AI Reflection - only show when enabled */}
        {aiReflectionEnabled && (
          <div className="fixed top-6 right-6 z-50">
            <AIReflection
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
        onShowNotebooks={() => setShowNotebooks(true)}
        onShowPDFExport={() => setShowPDFExport(true)}
        onPrint={handlePrint}
        onShowSettings={() => setShowSettings(true)}
        onLogout={handleLogout}
        onShowPrompt={() => setShowPromptModal(true)}
        isLoggingOut={isClosing}
      />

      {/* Calendar Modal */}
      <AnimatePresence>
        {showCalendar && (
          <CalendarView
            selectedDate={currentDate}
            onSelectDate={(date) => {
              setCurrentDate(date);
              setShowCalendar(false);
            }}
            onClose={() => setShowCalendar(false)}
          />
        )}
      </AnimatePresence>

      {/* Settings Panel */}
      <AnimatePresence>
        {showSettings && (
          <SettingsPanel onClose={() => setShowSettings(false)} />
        )}
      </AnimatePresence>

      {/* Mood Insights */}
      <AnimatePresence>
        {showMoodInsights && (
          <MoodInsights onClose={() => setShowMoodInsights(false)} />
        )}
      </AnimatePresence>

      {/* Why Page */}
      <AnimatePresence>
        {showWhyPage && (
          <WhyPage onClose={() => setShowWhyPage(false)} />
        )}
      </AnimatePresence>

      {/* Search Modal */}
      <AnimatePresence>
        {showSearch && (
          <SearchModal
            onClose={() => setShowSearch(false)}
            onSelectEntry={handleSelectEntry}
          />
        )}
      </AnimatePresence>

      {/* Tags View */}
      <AnimatePresence>
        {showTags && (
          <TagsView
            onClose={() => setShowTags(false)}
            onSelectEntry={handleSelectEntry}
          />
        )}
      </AnimatePresence>

      {/* Bookmarks View */}
      <AnimatePresence>
        {showBookmarks && (
          <BookmarksView
            onClose={() => setShowBookmarks(false)}
            onSelectEntry={handleSelectEntry}
          />
        )}
      </AnimatePresence>

      {/* PDF Export */}
      <AnimatePresence>
        {showPDFExport && (
          <PDFExport onClose={() => setShowPDFExport(false)} />
        )}
      </AnimatePresence>

      {/* Notebooks View */}
      <AnimatePresence>
        {showNotebooks && (
          <NotebooksView
            onClose={() => setShowNotebooks(false)}
            onSelectNotebook={() => setShowNotebooks(false)}
          />
        )}
      </AnimatePresence>

      {/* Daily Prompt Modal */}
      <AnimatePresence>
        {showPromptModal && (
          <DailyPromptModal
            onClose={() => setShowPromptModal(false)}
            onUsePrompt={handleUsePrompt}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
