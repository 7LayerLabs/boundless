'use client';

import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { X, Search, Calendar, Tag } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils/cn';
import { useJournal } from '@/hooks/useJournal';
import { useSettings } from '@/hooks/useSettings';
import { fonts } from '@/constants/fonts';
import { moods } from '@/constants/moods';
import { analytics } from '@/components/providers/PostHogProvider';
import type { JournalEntry } from '@/lib/db/instant';

interface SearchModalProps {
  onClose: () => void;
  onSelectEntry: (entry: JournalEntry) => void;
}

export function SearchModal({ onClose, onSelectEntry }: SearchModalProps) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<JournalEntry[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const { searchEntries } = useJournal();
  const { fontFamily, pageColor } = useSettings();
  const currentFont = fonts[fontFamily] || fonts.caveat;

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  useEffect(() => {
    if (query.trim()) {
      const searchResults = searchEntries(query);
      setResults(searchResults);
      analytics.searchPerformed(searchResults.length);
    } else {
      setResults([]);
    }
  }, [query, searchEntries]);

  const highlightMatch = (text: string, query: string) => {
    if (!query.trim()) return text;
    const regex = new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
    return text.replace(regex, '<mark class="bg-amber-200 text-amber-900 rounded px-0.5">$1</mark>');
  };

  const getPreviewText = (content: string) => {
    const plainText = content.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
    const lowerQuery = query.toLowerCase();
    const lowerText = plainText.toLowerCase();
    const index = lowerText.indexOf(lowerQuery);

    if (index === -1) return plainText.slice(0, 150);

    const start = Math.max(0, index - 50);
    const end = Math.min(plainText.length, index + query.length + 100);
    let preview = plainText.slice(start, end);

    if (start > 0) preview = '...' + preview;
    if (end < plainText.length) preview = preview + '...';

    return preview;
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-start justify-center bg-black/60 backdrop-blur-sm p-4 pt-20"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0, y: -20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.95, opacity: 0, y: -20 }}
        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
        className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Input */}
        <div className="flex items-center gap-3 p-4 border-b border-gray-100">
          <Search className="w-5 h-5 text-amber-500" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search your journal entries..."
            className="flex-1 text-lg outline-none placeholder-gray-400"
          />
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <X className="w-5 h-5 text-gray-400" />
          </button>
        </div>

        {/* Results */}
        <div className="max-h-[60vh] overflow-y-auto">
          {query.trim() === '' ? (
            <div className="p-8 text-center text-gray-400">
              <Search className="w-12 h-12 mx-auto mb-3 opacity-30" />
              <p>Start typing to search your entries</p>
            </div>
          ) : results.length === 0 ? (
            <div className="p-8 text-center text-gray-400">
              <p>No entries found matching "{query}"</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {results.map((entry) => {
                const moodData = entry.mood ? moods[entry.mood as keyof typeof moods] : null;
                const previewText = getPreviewText(entry.content);

                return (
                  <button
                    key={entry.id}
                    onClick={() => onSelectEntry(entry)}
                    className="w-full p-4 text-left hover:bg-amber-50 transition-colors"
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
                          {moodData.name}
                        </span>
                      )}
                      {entry.isBookmarked && (
                        <span className="text-xs text-amber-500">★</span>
                      )}
                    </div>
                    <p
                      className={cn('text-gray-700 text-sm leading-relaxed', currentFont.className)}
                      dangerouslySetInnerHTML={{ __html: highlightMatch(previewText, query) }}
                    />
                    {entry.tags && entry.tags.length > 0 && (
                      <div className="flex items-center gap-1 mt-2">
                        <Tag className="w-3 h-3 text-gray-400" />
                        {entry.tags.slice(0, 3).map((tag) => (
                          <span key={tag} className="text-xs text-gray-500">
                            #{tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer */}
        {results.length > 0 && (
          <div className="p-3 bg-gray-50 border-t border-gray-100 text-center">
            <span className="text-sm text-gray-500">
              {results.length} {results.length === 1 ? 'entry' : 'entries'} found
            </span>
          </div>
        )}
      </motion.div>
    </motion.div>
  );
}
