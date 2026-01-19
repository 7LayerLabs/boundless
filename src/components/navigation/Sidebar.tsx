'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  BookHeart,
  Bookmark,
  Tag,
  BarChart3,
  Calendar,
  Lightbulb,
  FileDown,
  Printer,
  Moon,
  Sun,
  Settings,
  LogOut,
  ChevronRight,
  ChevronLeft,
  Menu,
  X,
  BarChart2,
  FileText,
  Compass,
  Quote,
  Star,
  Clock,
} from 'lucide-react';
import { cn } from '@/lib/utils/cn';
import { useIsMobile } from '@/hooks/useMediaQuery';

interface SidebarProps {
  darkMode: boolean;
  onToggleDarkMode: () => void;
  onShowSearch: () => void;
  onShowWhyPage: () => void;
  onShowBookmarks: () => void;
  onShowTags: () => void;
  onShowMoodInsights: () => void;
  onShowCalendar: () => void;
  onShowPDFExport: () => void;
  onPrint: () => void;
  onShowSettings: () => void;
  onLogout: () => void;
  onShowPrompt: () => void;
  onShowOnThisDay: () => void;
  showMoodSelector: boolean;
  isLoggingOut: boolean;
  // Optional sidebar features
  showWritingStats?: boolean;
  showEntryTemplates?: boolean;
  showGuidedPrograms?: boolean;
  showDailyQuote?: boolean;
  onShowWritingStats?: () => void;
  onShowEntryTemplates?: () => void;
  onShowGuidedPrograms?: () => void;
  onShowDailyQuote?: () => void;
}

interface SidebarItem {
  id: string;
  icon: React.ReactNode;
  label: string;
  description: string;
  onClick: () => void;
  variant?: 'default' | 'accent';
  isPro?: boolean;
}

export function Sidebar({
  darkMode,
  onToggleDarkMode,
  onShowSearch,
  onShowWhyPage,
  onShowBookmarks,
  onShowTags,
  onShowMoodInsights,
  onShowCalendar,
  onShowPDFExport,
  onPrint,
  onShowSettings,
  onLogout,
  onShowPrompt,
  onShowOnThisDay,
  showMoodSelector,
  isLoggingOut,
  showWritingStats,
  showEntryTemplates,
  showGuidedPrograms,
  showDailyQuote,
  onShowWritingStats,
  onShowEntryTemplates,
  onShowGuidedPrograms,
  onShowDailyQuote,
}: SidebarProps) {
  const [isExpanded, setIsExpanded] = useState(true);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const isMobile = useIsMobile();

  // Free features - core journal functionality
  const mainItems: SidebarItem[] = [
    {
      id: 'calendar',
      icon: <Calendar className="w-5 h-5" />,
      label: 'Calendar',
      description: 'Navigate by date',
      onClick: onShowCalendar,
    },
    {
      id: 'search',
      icon: <Search className="w-5 h-5" />,
      label: 'Search',
      description: 'Find entries by content',
      onClick: onShowSearch,
    },
    {
      id: 'bookmarks',
      icon: <Bookmark className="w-5 h-5" />,
      label: 'Bookmarks',
      description: 'Starred entries',
      onClick: onShowBookmarks,
    },
    {
      id: 'on-this-day',
      icon: <Clock className="w-5 h-5" />,
      label: 'On This Day',
      description: 'Memories from past years',
      onClick: onShowOnThisDay,
    },
    {
      id: 'tags',
      icon: <Tag className="w-5 h-5" />,
      label: 'Tags',
      description: 'Browse by tags',
      onClick: onShowTags,
    },
    {
      id: 'prompt',
      icon: <Lightbulb className="w-5 h-5" />,
      label: 'Writing Prompt',
      description: 'Get inspired with a prompt',
      onClick: onShowPrompt,
    },
    {
      id: 'purpose',
      icon: <BookHeart className="w-5 h-5" />,
      label: 'My Purpose',
      description: 'Your dedication & intention',
      onClick: onShowWhyPage,
    },
    // Only show Mood Insights if mood tracking is enabled
    ...(showMoodSelector ? [{
      id: 'insights',
      icon: <BarChart3 className="w-5 h-5" />,
      label: 'Mood Insights',
      description: 'Track your moods',
      onClick: onShowMoodInsights,
    }] : []),
  ];

  // Pro features - premium functionality (conditionally rendered)
  const proItems: SidebarItem[] = [
    ...(showWritingStats && onShowWritingStats ? [{
      id: 'writing-stats',
      icon: <BarChart2 className="w-5 h-5" />,
      label: 'Writing Stats',
      description: 'Words, entries & streaks',
      onClick: onShowWritingStats,
      isPro: true,
    }] : []),
    ...(showEntryTemplates && onShowEntryTemplates ? [{
      id: 'templates',
      icon: <FileText className="w-5 h-5" />,
      label: 'Entry Templates',
      description: 'Quick-start formats',
      onClick: onShowEntryTemplates,
      isPro: true,
    }] : []),
    ...(showGuidedPrograms && onShowGuidedPrograms ? [{
      id: 'programs',
      icon: <Compass className="w-5 h-5" />,
      label: 'Guided Programs',
      description: 'Multi-day journeys',
      onClick: onShowGuidedPrograms,
      isPro: true,
    }] : []),
    ...(showDailyQuote && onShowDailyQuote ? [{
      id: 'quote',
      icon: <Quote className="w-5 h-5" />,
      label: 'Daily Quote',
      description: 'Inspiring words',
      onClick: onShowDailyQuote,
      isPro: true,
    }] : []),
  ];

  const toolItems: SidebarItem[] = [
    {
      id: 'darkmode',
      icon: darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />,
      label: darkMode ? 'Light Mode' : 'Dark Mode',
      description: 'Toggle theme',
      onClick: onToggleDarkMode,
    },
    {
      id: 'print',
      icon: <Printer className="w-5 h-5" />,
      label: 'Print',
      description: 'Print current entry',
      onClick: onPrint,
    },
    {
      id: 'export',
      icon: <FileDown className="w-5 h-5" />,
      label: 'Export PDF',
      description: 'Download as PDF',
      onClick: onShowPDFExport,
      isPro: true,
    },
    {
      id: 'settings',
      icon: <Settings className="w-5 h-5" />,
      label: 'Settings',
      description: 'Customize journal',
      onClick: onShowSettings,
    },
  ];

  // Determine if sidebar content should be expanded (always expanded on mobile when open)
  const shouldShowExpanded = isMobile ? isMobileOpen : isExpanded;

  const handleItemClick = (item: SidebarItem) => {
    item.onClick();
    // Close mobile sidebar after clicking an item
    if (isMobile) {
      setIsMobileOpen(false);
    }
  };

  const renderItem = (item: SidebarItem) => (
    <button
      key={item.id}
      onClick={() => handleItemClick(item)}
      className={cn(
        'w-full flex items-center gap-3 p-3 rounded-xl transition-all group',
        darkMode
          ? 'hover:bg-neutral-700/50 text-neutral-300'
          : 'hover:bg-neutral-100 text-neutral-700',
        !shouldShowExpanded && 'justify-center'
      )}
      title={!shouldShowExpanded ? item.label : undefined}
    >
      <div className="flex-shrink-0 relative">
        {item.icon}
        {item.isPro && !shouldShowExpanded && (
          <Star className="w-2.5 h-2.5 absolute -top-1 -right-1 text-amber-500 fill-amber-500" />
        )}
      </div>
      {shouldShowExpanded && (
        <motion.div
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex-1 text-left overflow-hidden"
        >
          <div className="flex items-center gap-1.5">
            <p className="font-medium text-sm truncate">{item.label}</p>
            {item.isPro && (
              <Star className="w-3 h-3 text-amber-500 fill-amber-500 flex-shrink-0" />
            )}
          </div>
          <p className={cn(
            'text-xs truncate',
            darkMode ? 'text-neutral-500' : 'text-neutral-500'
          )}>{item.description}</p>
        </motion.div>
      )}
    </button>
  );

  // Sidebar content component (shared between mobile and desktop)
  const sidebarContent = (
    <>
      {/* Logo */}
      <div className={cn(
        'p-4 border-b flex items-center',
        darkMode ? 'border-neutral-700' : 'border-neutral-200',
        shouldShowExpanded ? 'justify-between' : 'justify-center'
      )}>
        <div className="flex items-center gap-3">
          <div className={cn(
            'w-10 h-10 rounded-full flex items-center justify-center shadow-md',
            darkMode
              ? 'bg-neutral-700'
              : 'bg-neutral-900'
          )}>
            <span className="text-white font-bold text-lg">B</span>
          </div>
          {shouldShowExpanded && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <p className={cn(
                'font-bold',
                darkMode ? 'text-neutral-200' : 'text-neutral-900'
              )}>Boundless</p>
              <p className={cn(
                'text-xs',
                darkMode ? 'text-neutral-500' : 'text-neutral-500'
              )}>Write Without Limits</p>
            </motion.div>
          )}
        </div>
        {/* Close button for mobile */}
        {isMobile && isMobileOpen && (
          <button
            onClick={() => setIsMobileOpen(false)}
            className={cn(
              'p-2 rounded-lg transition-colors',
              darkMode
                ? 'hover:bg-neutral-700/50 text-neutral-400'
                : 'hover:bg-neutral-100 text-neutral-600'
            )}
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Toggle Button - Desktop only */}
      {!isMobile && (
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className={cn(
            'absolute -right-3 top-20 w-6 h-6 text-white rounded-full flex items-center justify-center shadow-md transition-colors',
            darkMode
              ? 'bg-neutral-600 hover:bg-neutral-500'
              : 'bg-neutral-900 hover:bg-neutral-700'
          )}
        >
          {isExpanded ? (
            <ChevronLeft className="w-4 h-4" />
          ) : (
            <ChevronRight className="w-4 h-4" />
          )}
        </button>
      )}

      {/* Main Navigation */}
      <div className="flex-1 overflow-y-auto p-2 space-y-1">
        {shouldShowExpanded && (
          <p className={cn(
            'px-3 py-2 text-xs font-semibold uppercase tracking-wider',
            darkMode ? 'text-neutral-500' : 'text-neutral-400'
          )}>
            Navigate
          </p>
        )}
        {mainItems.map(renderItem)}

        {/* Pro Features Section */}
        {proItems.length > 0 && (
          <>
            <div className={cn(
              'my-3 border-t',
              darkMode ? 'border-neutral-700' : 'border-neutral-200'
            )} />

            {shouldShowExpanded && (
              <p className={cn(
                'px-3 py-2 text-xs font-semibold uppercase tracking-wider flex items-center gap-1.5',
                darkMode ? 'text-neutral-500' : 'text-neutral-400'
              )}>
                <Star className="w-3 h-3 text-amber-500 fill-amber-500" />
                Pro
              </p>
            )}
            {proItems.map(renderItem)}
          </>
        )}

        <div className={cn(
          'my-3 border-t',
          darkMode ? 'border-neutral-700' : 'border-neutral-200'
        )} />

        {shouldShowExpanded && (
          <p className={cn(
            'px-3 py-2 text-xs font-semibold uppercase tracking-wider',
            darkMode ? 'text-neutral-500' : 'text-neutral-400'
          )}>
            Tools
          </p>
        )}
        {toolItems.map(renderItem)}
      </div>

      {/* Logout */}
      <div className={cn(
        'p-2 border-t',
        darkMode ? 'border-neutral-700' : 'border-neutral-200'
      )}>
        <button
          onClick={() => {
            onLogout();
            if (isMobile) setIsMobileOpen(false);
          }}
          disabled={isLoggingOut}
          className={cn(
            'w-full flex items-center gap-3 p-3 rounded-xl transition-all text-white disabled:opacity-50',
            darkMode
              ? 'bg-neutral-700 hover:bg-neutral-600'
              : 'bg-neutral-900 hover:bg-neutral-800',
            !shouldShowExpanded && 'justify-center'
          )}
          title={!shouldShowExpanded ? 'Sign Out' : undefined}
        >
          <LogOut className="w-5 h-5 flex-shrink-0" />
          {shouldShowExpanded && (
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="font-medium text-sm"
            >
              Sign Out
            </motion.span>
          )}
        </button>
      </div>
    </>
  );

  // Mobile: Hamburger button + slide-out drawer
  if (isMobile) {
    return (
      <>
        {/* Hamburger Menu Button - Fixed in top-left corner */}
        <button
          onClick={() => setIsMobileOpen(true)}
          className={cn(
            'fixed left-4 top-4 z-50 p-3 rounded-xl shadow-lg transition-all',
            darkMode
              ? 'bg-neutral-800/95 text-neutral-300 hover:bg-neutral-700'
              : 'bg-white/95 text-neutral-700 hover:bg-neutral-50',
            isMobileOpen && 'opacity-0 pointer-events-none'
          )}
          aria-label="Open menu"
        >
          <Menu className="w-6 h-6" />
        </button>

        {/* Mobile Sidebar Overlay */}
        <AnimatePresence>
          {isMobileOpen && (
            <>
              {/* Backdrop */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                onClick={() => setIsMobileOpen(false)}
                className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm"
              />

              {/* Sidebar Drawer */}
              <motion.div
                initial={{ x: '-100%' }}
                animate={{ x: 0 }}
                exit={{ x: '-100%' }}
                transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                className={cn(
                  'fixed left-0 top-0 bottom-0 z-50 w-72 flex flex-col shadow-xl border-r',
                  darkMode
                    ? 'bg-neutral-900 border-neutral-700'
                    : 'bg-white border-neutral-200'
                )}
              >
                {sidebarContent}
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </>
    );
  }

  // Desktop: Original fixed sidebar behavior
  return (
    <motion.div
      initial={false}
      animate={{ width: isExpanded ? 240 : 72 }}
      transition={{ type: 'spring', damping: 25, stiffness: 300 }}
      className={cn(
        'fixed left-0 top-0 bottom-0 z-50 flex flex-col backdrop-blur-sm shadow-xl border-r',
        darkMode
          ? 'bg-neutral-900/95 border-neutral-700'
          : 'bg-white/95 border-neutral-200'
      )}
    >
      {sidebarContent}
    </motion.div>
  );
}
