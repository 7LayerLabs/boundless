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
  Book,
  FileDown,
  Printer,
  Moon,
  Sun,
  Settings,
  LogOut,
  ChevronRight,
  ChevronLeft,
} from 'lucide-react';
import { cn } from '@/lib/utils/cn';

interface SidebarProps {
  darkMode: boolean;
  onToggleDarkMode: () => void;
  onShowSearch: () => void;
  onShowWhyPage: () => void;
  onShowBookmarks: () => void;
  onShowTags: () => void;
  onShowMoodInsights: () => void;
  onShowCalendar: () => void;
  onShowNotebooks: () => void;
  onShowPDFExport: () => void;
  onPrint: () => void;
  onShowSettings: () => void;
  onLogout: () => void;
  onShowPrompt: () => void;
  isLoggingOut: boolean;
}

interface SidebarItem {
  id: string;
  icon: React.ReactNode;
  label: string;
  description: string;
  onClick: () => void;
  variant?: 'default' | 'accent';
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
  onShowNotebooks,
  onShowPDFExport,
  onPrint,
  onShowSettings,
  onLogout,
  onShowPrompt,
  isLoggingOut,
}: SidebarProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const mainItems: SidebarItem[] = [
    {
      id: 'prompt',
      icon: <Lightbulb className="w-5 h-5" />,
      label: 'Writing Prompt',
      description: 'Get inspired with a prompt',
      onClick: onShowPrompt,
    },
    {
      id: 'search',
      icon: <Search className="w-5 h-5" />,
      label: 'Search',
      description: 'Find entries by content',
      onClick: onShowSearch,
    },
    {
      id: 'why',
      icon: <BookHeart className="w-5 h-5" />,
      label: 'My Why',
      description: 'Your journaling purpose',
      onClick: onShowWhyPage,
    },
    {
      id: 'bookmarks',
      icon: <Bookmark className="w-5 h-5" />,
      label: 'Bookmarks',
      description: 'Starred entries',
      onClick: onShowBookmarks,
    },
    {
      id: 'tags',
      icon: <Tag className="w-5 h-5" />,
      label: 'Tags',
      description: 'Browse by tags',
      onClick: onShowTags,
    },
    {
      id: 'insights',
      icon: <BarChart3 className="w-5 h-5" />,
      label: 'Mood Insights',
      description: 'Track your moods',
      onClick: onShowMoodInsights,
    },
    {
      id: 'calendar',
      icon: <Calendar className="w-5 h-5" />,
      label: 'Calendar',
      description: 'Navigate by date',
      onClick: onShowCalendar,
    },
  ];

  const toolItems: SidebarItem[] = [
    {
      id: 'notebooks',
      icon: <Book className="w-5 h-5" />,
      label: 'Notebooks',
      description: 'Manage journals',
      onClick: onShowNotebooks,
    },
    {
      id: 'export',
      icon: <FileDown className="w-5 h-5" />,
      label: 'Export PDF',
      description: 'Download as PDF',
      onClick: onShowPDFExport,
    },
    {
      id: 'print',
      icon: <Printer className="w-5 h-5" />,
      label: 'Print',
      description: 'Print current entry',
      onClick: onPrint,
    },
    {
      id: 'darkmode',
      icon: darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />,
      label: darkMode ? 'Light Mode' : 'Dark Mode',
      description: 'Toggle theme',
      onClick: onToggleDarkMode,
    },
    {
      id: 'settings',
      icon: <Settings className="w-5 h-5" />,
      label: 'Settings',
      description: 'Customize journal',
      onClick: onShowSettings,
    },
  ];

  const renderItem = (item: SidebarItem) => (
    <button
      key={item.id}
      onClick={item.onClick}
      className={cn(
        'w-full flex items-center gap-3 p-3 rounded-xl transition-all group',
        darkMode
          ? 'hover:bg-amber-500/20 text-amber-300'
          : 'hover:bg-amber-100/80 text-amber-800',
        !isExpanded && 'justify-center'
      )}
      title={!isExpanded ? item.label : undefined}
    >
      <div className="flex-shrink-0">{item.icon}</div>
      {isExpanded && (
        <motion.div
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex-1 text-left overflow-hidden"
        >
          <p className="font-medium text-sm truncate">{item.label}</p>
          <p className={cn(
            'text-xs truncate',
            darkMode ? 'text-amber-400/70' : 'text-amber-600/70'
          )}>{item.description}</p>
        </motion.div>
      )}
    </button>
  );

  return (
    <motion.div
      initial={false}
      animate={{ width: isExpanded ? 240 : 72 }}
      transition={{ type: 'spring', damping: 25, stiffness: 300 }}
      className={cn(
        'fixed left-0 top-0 bottom-0 z-50 flex flex-col backdrop-blur-sm shadow-xl border-r',
        darkMode
          ? 'bg-gray-900/95 border-gray-700'
          : 'bg-white/95 border-amber-100'
      )}
    >
      {/* Logo */}
      <div className={cn(
        'p-4 border-b flex items-center',
        darkMode ? 'border-gray-700' : 'border-amber-100',
        isExpanded ? 'justify-between' : 'justify-center'
      )}>
        <div className="flex items-center gap-3">
          <div className={cn(
            'w-10 h-10 rounded-full flex items-center justify-center shadow-md',
            darkMode
              ? 'bg-gradient-to-br from-amber-500 to-amber-700'
              : 'bg-gradient-to-br from-amber-400 to-amber-600'
          )}>
            <span className="text-white font-bold text-lg">B</span>
          </div>
          {isExpanded && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <p className={cn(
                'font-bold',
                darkMode ? 'text-amber-300' : 'text-amber-900'
              )}>Boundless</p>
              <p className={cn(
                'text-xs',
                darkMode ? 'text-amber-400/70' : 'text-amber-600'
              )}>Write Without Limits</p>
            </motion.div>
          )}
        </div>
      </div>

      {/* Toggle Button */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className={cn(
          'absolute -right-3 top-20 w-6 h-6 text-white rounded-full flex items-center justify-center shadow-md transition-colors',
          darkMode
            ? 'bg-amber-600 hover:bg-amber-500'
            : 'bg-amber-500 hover:bg-amber-600'
        )}
      >
        {isExpanded ? (
          <ChevronLeft className="w-4 h-4" />
        ) : (
          <ChevronRight className="w-4 h-4" />
        )}
      </button>

      {/* Main Navigation */}
      <div className="flex-1 overflow-y-auto p-2 space-y-1">
        {isExpanded && (
          <p className={cn(
            'px-3 py-2 text-xs font-semibold uppercase tracking-wider',
            darkMode ? 'text-amber-500/70' : 'text-amber-400'
          )}>
            Navigate
          </p>
        )}
        {mainItems.map(renderItem)}

        <div className={cn(
          'my-3 border-t',
          darkMode ? 'border-gray-700' : 'border-amber-100'
        )} />

        {isExpanded && (
          <p className={cn(
            'px-3 py-2 text-xs font-semibold uppercase tracking-wider',
            darkMode ? 'text-amber-500/70' : 'text-amber-400'
          )}>
            Tools
          </p>
        )}
        {toolItems.map(renderItem)}
      </div>

      {/* Logout */}
      <div className={cn(
        'p-2 border-t',
        darkMode ? 'border-gray-700' : 'border-amber-100'
      )}>
        <button
          onClick={onLogout}
          disabled={isLoggingOut}
          className={cn(
            'w-full flex items-center gap-3 p-3 rounded-xl transition-all text-white disabled:opacity-50',
            darkMode
              ? 'bg-amber-600 hover:bg-amber-500'
              : 'bg-amber-500 hover:bg-amber-600',
            !isExpanded && 'justify-center'
          )}
          title={!isExpanded ? 'Sign Out' : undefined}
        >
          <LogOut className="w-5 h-5 flex-shrink-0" />
          {isExpanded && (
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
    </motion.div>
  );
}
