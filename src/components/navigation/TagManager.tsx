'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { X, Tag, Plus, Trash2, Check } from 'lucide-react';
import { cn } from '@/lib/utils/cn';
import { useJournal } from '@/hooks/useJournal';
import { starterTags, tagColors, getTagColor } from '@/constants/tags';

interface TagManagerProps {
  onClose: () => void;
}

export function TagManager({ onClose }: TagManagerProps) {
  const { allTags, allEntries } = useJournal();
  const [newTagName, setNewTagName] = useState('');
  const [newTagColor, setNewTagColor] = useState(tagColors[0]);
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);

  // Combine starter tags with user-created tags
  const starterTagNames = starterTags.map(t => t.name);
  const userCreatedTags = allTags.filter(t => !starterTagNames.includes(t));

  // Get entry count for each tag
  const getTagCount = (tag: string) => {
    return allEntries.filter(e => (e.tags || []).includes(tag)).length;
  };

  // Check if a starter tag has been used
  const isStarterTagUsed = (tagName: string) => {
    return allTags.includes(tagName);
  };

  const handleAddTag = () => {
    const trimmed = newTagName.trim().toLowerCase();
    if (trimmed && !allTags.includes(trimmed) && !starterTagNames.includes(trimmed)) {
      // Tags are created when first used on an entry
      // For now, we just show them in the list
      setNewTagName('');
      setShowColorPicker(false);
    }
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
            <h2 className="font-semibold text-gray-800">Tag Manager</h2>
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
          {/* Starter Tags Section */}
          <div className="mb-6">
            <h3 className="text-sm font-medium text-gray-500 mb-3">Starter Tags</h3>
            <p className="text-xs text-gray-400 mb-3">
              Click a tag to use it on your entries. These are always available.
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

          {/* User Created Tags */}
          <div className="mb-6">
            <h3 className="text-sm font-medium text-gray-500 mb-3">Your Tags</h3>
            {userCreatedTags.length === 0 ? (
              <p className="text-sm text-gray-400 italic">
                Tags you create will appear here. Add tags to entries using the tag input below each entry.
              </p>
            ) : (
              <div className="space-y-2">
                {userCreatedTags.map((tag) => {
                  const count = getTagCount(tag);
                  const color = getTagColor(tag);
                  return (
                    <div
                      key={tag}
                      className="flex items-center justify-between p-2 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors"
                    >
                      <div className="flex items-center gap-2">
                        <span
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: color }}
                        />
                        <span className="text-sm text-gray-700">#{tag}</span>
                        <span className="text-xs text-gray-400">
                          {count} {count === 1 ? 'entry' : 'entries'}
                        </span>
                      </div>

                      {confirmDelete === tag ? (
                        <div className="flex items-center gap-1">
                          <span className="text-xs text-red-500 mr-2">Delete?</span>
                          <button
                            onClick={() => setConfirmDelete(null)}
                            className="px-2 py-1 text-xs text-gray-500 hover:text-gray-700"
                          >
                            No
                          </button>
                          <button
                            onClick={() => {
                              // Note: Deleting a tag would require removing it from all entries
                              // For now, we just hide the confirmation
                              setConfirmDelete(null);
                            }}
                            className="px-2 py-1 text-xs text-red-500 hover:text-red-700"
                          >
                            Yes
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => setConfirmDelete(tag)}
                          className="p-1.5 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors"
                          title="Delete tag"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Quick Add Tag */}
          <div className="pt-4 border-t border-gray-100">
            <h3 className="text-sm font-medium text-gray-500 mb-3">Quick Add Tag</h3>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <input
                  type="text"
                  value={newTagName}
                  onChange={(e) => setNewTagName(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ''))}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleAddTag();
                  }}
                  placeholder="Type new tag name..."
                  className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>

              {/* Color Picker */}
              <div className="relative">
                <button
                  onClick={() => setShowColorPicker(!showColorPicker)}
                  className="w-10 h-10 rounded-lg border border-gray-200 flex items-center justify-center"
                  style={{ backgroundColor: newTagColor }}
                />
                {showColorPicker && (
                  <div className="absolute right-0 top-12 bg-white rounded-lg shadow-xl border border-gray-100 p-2 z-10">
                    <div className="grid grid-cols-4 gap-1">
                      {tagColors.map((color) => (
                        <button
                          key={color}
                          onClick={() => {
                            setNewTagColor(color);
                            setShowColorPicker(false);
                          }}
                          className={cn(
                            'w-6 h-6 rounded-full transition-transform hover:scale-110',
                            newTagColor === color && 'ring-2 ring-offset-1 ring-gray-400'
                          )}
                          style={{ backgroundColor: color }}
                        />
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <button
                onClick={handleAddTag}
                disabled={!newTagName.trim()}
                className="px-4 py-2 bg-amber-500 text-white rounded-lg hover:bg-amber-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-1"
              >
                <Plus className="w-4 h-4" />
                Add
              </button>
            </div>
            <p className="text-xs text-gray-400 mt-2">
              Tip: You can also create tags directly when writing entries using the tag input.
            </p>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
