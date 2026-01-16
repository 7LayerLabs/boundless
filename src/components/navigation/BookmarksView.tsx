'use client';

import { motion } from 'framer-motion';
import { X, Bookmark, Calendar, Tag } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils/cn';
import { useJournal } from '@/hooks/useJournal';
import { useSettings } from '@/hooks/useSettings';
import { fonts } from '@/constants/fonts';
import { moods } from '@/constants/moods';
import type { JournalEntry } from '@/lib/db/instant';

interface BookmarksViewProps {
  onClose: () => void;
  onSelectEntry: (entry: JournalEntry) => void;
}

export function BookmarksView({ onClose, onSelectEntry }: BookmarksViewProps) {
  const { bookmarkedEntries, toggleBookmark } = useJournal();
  const { fontFamily } = useSettings();
  const currentFont = fonts[fontFamily] || fonts.caveat;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
        className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl overflow-hidden max-h-[80vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 border-b border-gray-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Bookmark className="w-5 h-5 text-amber-600 fill-amber-600" />
            <h2 className="font-semibold text-gray-800">Bookmarked Entries</h2>
            <span className="text-sm text-gray-400">
              ({bookmarkedEntries.length})
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <X className="w-5 h-5 text-gray-400" />
          </button>
        </div>

        {/* Entries List */}
        <div className="flex-1 overflow-y-auto">
          {bookmarkedEntries.length === 0 ? (
            <div className="p-8 text-center text-gray-400">
              <Bookmark className="w-12 h-12 mx-auto mb-3 opacity-30" />
              <p className="mb-2">No bookmarked entries yet</p>
              <p className="text-sm">Click the bookmark icon on an entry to save it here</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {bookmarkedEntries.map((entry) => {
                const moodData = entry.mood ? moods[entry.mood as keyof typeof moods] : null;
                const plainText = entry.content.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
                const preview = plainText.slice(0, 200) + (plainText.length > 200 ? '...' : '');

                return (
                  <div
                    key={entry.id}
                    className="p-4 hover:bg-amber-50 transition-colors group"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <button
                        onClick={() => onSelectEntry(entry)}
                        className="flex-1 text-left"
                      >
                        <div className="flex items-center gap-2 mb-2">
                          <Calendar className="w-4 h-4 text-amber-500" />
                          <span className="text-sm font-medium text-amber-700">
                            {format(new Date(entry.date), 'MMMM d, yyyy')}
                          </span>
                          {moodData && (
                            <span
                              className="text-xs px-2 py-0.5 rounded-full"
                              style={{ backgroundColor: `${moodData.color}20`, color: moodData.color }}
                            >
                              {moodData.label}
                            </span>
                          )}
                        </div>
                        <p className={cn('text-gray-700 text-sm leading-relaxed', currentFont.className)}>
                          {preview}
                        </p>
                        {entry.tags && entry.tags.length > 0 && (
                          <div className="flex items-center gap-1 mt-2">
                            <Tag className="w-3 h-3 text-gray-400" />
                            {entry.tags.map((tag) => (
                              <span key={tag} className="text-xs text-gray-500">
                                #{tag}
                              </span>
                            ))}
                          </div>
                        )}
                      </button>
                      <button
                        onClick={() => toggleBookmark(entry.id)}
                        className="p-2 rounded-lg hover:bg-amber-100 transition-colors opacity-0 group-hover:opacity-100"
                        title="Remove bookmark"
                      >
                        <Bookmark className="w-4 h-4 text-amber-500 fill-amber-500" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}
