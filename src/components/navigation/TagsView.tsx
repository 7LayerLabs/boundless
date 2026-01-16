'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Tag, Calendar, ChevronRight, Settings2 } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils/cn';
import { useJournal } from '@/hooks/useJournal';
import { useSettings } from '@/hooks/useSettings';
import { fonts } from '@/constants/fonts';
import { moods } from '@/constants/moods';
import { starterTags, getTagColor } from '@/constants/tags';
import { TagManager } from './TagManager';
import type { JournalEntry } from '@/lib/db/instant';

interface TagsViewProps {
  onClose: () => void;
  onSelectEntry: (entry: JournalEntry) => void;
}

export function TagsView({ onClose, onSelectEntry }: TagsViewProps) {
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [showTagManager, setShowTagManager] = useState(false);
  const { allTags, getEntriesByTag, allEntries } = useJournal();
  const { fontFamily } = useSettings();
  const currentFont = fonts[fontFamily] || fonts.caveat;

  const tagEntries = selectedTag ? getEntriesByTag(selectedTag) : [];

  // Combine starter tags with user tags (no duplicates)
  const starterTagNames = starterTags.map(t => t.name);
  const combinedTags = [...new Set([...starterTagNames, ...allTags])].sort();

  // Count entries per tag
  const tagCounts = combinedTags.reduce((acc, tag) => {
    acc[tag] = allEntries.filter((e) => (e.tags || []).includes(tag)).length;
    return acc;
  }, {} as Record<string, number>);

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
        className="relative w-full max-w-3xl bg-white rounded-2xl shadow-2xl overflow-hidden max-h-[80vh] flex"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Tags List */}
        <div className="w-1/3 border-r border-gray-100 bg-gray-50 overflow-y-auto">
          <div className="p-4 border-b border-gray-100 sticky top-0 bg-gray-50">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Tag className="w-5 h-5 text-amber-600" />
                <h2 className="font-semibold text-gray-800">Tags</h2>
              </div>
              <button
                onClick={() => setShowTagManager(true)}
                className="p-1.5 rounded-lg hover:bg-gray-200 transition-colors text-gray-500 hover:text-gray-700"
                title="Manage Tags"
              >
                <Settings2 className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="p-2">
            {combinedTags.map((tag) => {
              const color = getTagColor(tag);
              const count = tagCounts[tag] || 0;
              return (
                <button
                  key={tag}
                  onClick={() => setSelectedTag(tag)}
                  className={cn(
                    'w-full flex items-center justify-between p-3 rounded-lg transition-colors text-left',
                    selectedTag === tag
                      ? 'bg-amber-100 text-amber-900'
                      : count > 0
                        ? 'hover:bg-gray-100 text-gray-700'
                        : 'hover:bg-gray-100 text-gray-400'
                  )}
                >
                  <span className="flex items-center gap-2">
                    <span
                      className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                      style={{ backgroundColor: color }}
                    />
                    <span className={count === 0 ? 'italic' : ''}>#{tag}</span>
                  </span>
                  <span className="flex items-center gap-1">
                    <span className="text-xs text-gray-400">{count}</span>
                    <ChevronRight className="w-4 h-4 text-gray-400" />
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Entries List */}
        <div className="flex-1 flex flex-col overflow-hidden">
          <div className="p-4 border-b border-gray-100 flex items-center justify-between sticky top-0 bg-white">
            <h3 className="font-semibold text-gray-800">
              {selectedTag ? (
                <span className="flex items-center gap-2">
                  <span className="text-amber-500">#</span>
                  {selectedTag}
                  <span className="text-sm font-normal text-gray-400">
                    ({tagEntries.length} {tagEntries.length === 1 ? 'entry' : 'entries'})
                  </span>
                </span>
              ) : (
                'Select a tag'
              )}
            </h3>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <X className="w-5 h-5 text-gray-400" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto">
            {!selectedTag ? (
              <div className="p-8 text-center text-gray-400">
                <Tag className="w-12 h-12 mx-auto mb-3 opacity-30" />
                <p>Select a tag to view entries</p>
              </div>
            ) : tagEntries.length === 0 ? (
              <div className="p-8 text-center text-gray-400">
                <p>No entries with this tag</p>
              </div>
            ) : (
              <div className="divide-y divide-gray-100">
                {tagEntries.map((entry) => {
                  const moodData = entry.mood ? moods[entry.mood as keyof typeof moods] : null;
                  const plainText = entry.content.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
                  const preview = plainText.slice(0, 150) + (plainText.length > 150 ? '...' : '');

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
                      <p className={cn('text-gray-700 text-sm leading-relaxed', currentFont.className)}>
                        {preview}
                      </p>
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </motion.div>

      {/* Tag Manager Modal */}
      <AnimatePresence>
        {showTagManager && (
          <TagManager onClose={() => setShowTagManager(false)} />
        )}
      </AnimatePresence>
    </motion.div>
  );
}
