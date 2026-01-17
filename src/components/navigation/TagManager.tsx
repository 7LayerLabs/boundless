'use client';

import { motion } from 'framer-motion';
import { X, Tag, Check } from 'lucide-react';
import { cn } from '@/lib/utils/cn';
import { useJournal } from '@/hooks/useJournal';
import { starterTags } from '@/constants/tags';

interface TagManagerProps {
  onClose: () => void;
}

export function TagManager({ onClose }: TagManagerProps) {
  const { allTags, allEntries } = useJournal();

  // Get entry count for each tag
  const getTagCount = (tag: string) => {
    return allEntries.filter(e => (e.tags || []).includes(tag)).length;
  };

  // Check if a starter tag has been used
  const isStarterTagUsed = (tagName: string) => {
    return allTags.includes(tagName);
  };

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
        className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 border-b border-gray-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Tag className="w-5 h-5 text-amber-600" />
            <h2 className="font-semibold text-gray-800">Available Tags</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <X className="w-5 h-5 text-gray-400" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 max-h-[60vh] overflow-y-auto">
          <p className="text-sm text-gray-500 mb-4">
            Use these tags to organize your journal entries. Add them to any entry using the tag input below each entry.
          </p>
          <div className="flex flex-wrap gap-2">
            {starterTags.map((tag) => {
              const count = getTagCount(tag.name);
              const isUsed = isStarterTagUsed(tag.name);
              return (
                <div
                  key={tag.name}
                  className={cn(
                    'flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm transition-all',
                    isUsed ? 'opacity-100' : 'opacity-60 hover:opacity-100'
                  )}
                  style={{
                    backgroundColor: `${tag.color}20`,
                    color: tag.color,
                    border: `1px solid ${tag.color}40`,
                  }}
                >
                  <span
                    className="w-2 h-2 rounded-full"
                    style={{ backgroundColor: tag.color }}
                  />
                  #{tag.name}
                  {count > 0 && (
                    <span className="text-xs opacity-70">({count})</span>
                  )}
                  {isUsed && (
                    <Check className="w-3 h-3 ml-1" />
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
