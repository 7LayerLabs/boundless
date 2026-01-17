'use client';

import { useState, useRef, useEffect } from 'react';
import { X, Tag, Plus } from 'lucide-react';
import { cn } from '@/lib/utils/cn';
import { starterTags, getTagColor } from '@/constants/tags';

interface TagInputProps {
  tags: string[];
  onTagsChange: (tags: string[]) => void;
  allTags: string[]; // For suggestions
  disabled?: boolean;
  darkMode?: boolean;
}

export function TagInput({ tags, onTagsChange, allTags, disabled = false, darkMode = false }: TagInputProps) {
  const [inputValue, setInputValue] = useState('');
  const [showInput, setShowInput] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Use starter tags for suggestions
  const starterTagNames = starterTags.map(t => t.name);
  const combinedTags = [...new Set([...starterTagNames, ...allTags])];

  // Filter suggestions based on input
  const suggestions = inputValue.trim()
    ? combinedTags.filter(
        (tag) =>
          tag.toLowerCase().includes(inputValue.toLowerCase()) &&
          !tags.includes(tag)
      )
    : combinedTags.filter((tag) => !tags.includes(tag)).slice(0, 8);

  // Focus input when shown
  useEffect(() => {
    if (showInput && inputRef.current) {
      inputRef.current.focus();
    }
  }, [showInput]);

  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setShowSuggestions(false);
        if (!inputValue.trim()) {
          setShowInput(false);
        }
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [inputValue]);

  const addTag = (tag: string) => {
    const trimmedTag = tag.trim().toLowerCase();
    if (trimmedTag && !tags.includes(trimmedTag)) {
      onTagsChange([...tags, trimmedTag]);
    }
    setInputValue('');
    setShowSuggestions(false);
    inputRef.current?.focus();
  };

  const removeTag = (tagToRemove: string) => {
    onTagsChange(tags.filter((tag) => tag !== tagToRemove));
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      if (inputValue.trim()) {
        addTag(inputValue);
      }
    } else if (e.key === 'Backspace' && !inputValue && tags.length > 0) {
      removeTag(tags[tags.length - 1]);
    } else if (e.key === 'Escape') {
      setShowInput(false);
      setShowSuggestions(false);
      setInputValue('');
    }
  };

  if (disabled) {
    return tags.length > 0 ? (
      <div className="flex items-center gap-1.5 flex-wrap">
        <Tag className={cn('w-3.5 h-3.5', darkMode ? 'text-amber-400/60' : 'text-amber-500/60')} />
        {tags.map((tag) => {
          const color = getTagColor(tag);
          return (
            <span
              key={tag}
              className="px-2 py-0.5 rounded-full text-xs flex items-center gap-1"
              style={{
                backgroundColor: `${color}20`,
                color: color,
              }}
            >
              <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: color }} />
              #{tag}
            </span>
          );
        })}
      </div>
    ) : null;
  }

  return (
    <div ref={containerRef} className="relative">
      <div className="flex items-center gap-1.5 flex-wrap">
        <Tag className={cn('w-3.5 h-3.5', darkMode ? 'text-amber-400/60' : 'text-amber-500/60')} />

        {/* Existing tags */}
        {tags.map((tag) => {
          const color = getTagColor(tag);
          return (
            <span
              key={tag}
              className="group flex items-center gap-1 px-2 py-0.5 rounded-full text-xs transition-all"
              style={{
                backgroundColor: `${color}20`,
                color: color,
              }}
            >
              <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: color }} />
              #{tag}
              <button
                onClick={() => removeTag(tag)}
                className="opacity-60 hover:opacity-100 transition-opacity hover:text-red-500"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          );
        })}

        {/* Add tag button / input */}
        {showInput ? (
          <div className="relative">
            <input
              ref={inputRef}
              type="text"
              value={inputValue}
              onChange={(e) => {
                setInputValue(e.target.value);
                setShowSuggestions(true);
              }}
              onFocus={() => setShowSuggestions(true)}
              onKeyDown={handleKeyDown}
              placeholder="Add tag..."
              className={cn(
                'w-24 px-2 py-0.5 text-xs rounded-full border outline-none transition-all focus:w-32',
                darkMode
                  ? 'bg-amber-500/10 border-amber-500/30 text-amber-200 placeholder:text-amber-400/50 focus:border-amber-500/50'
                  : 'bg-white border-amber-200 text-amber-800 placeholder:text-amber-400 focus:border-amber-400'
              )}
            />

            {/* Suggestions dropdown */}
            {showSuggestions && suggestions.length > 0 && (
              <div
                className={cn(
                  'absolute top-full left-0 mt-1 w-44 max-h-48 overflow-y-auto rounded-lg shadow-lg border z-50',
                  darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-amber-100'
                )}
              >
                {suggestions.map((suggestion) => {
                  const color = getTagColor(suggestion);
                  return (
                    <button
                      key={suggestion}
                      onClick={() => addTag(suggestion)}
                      className={cn(
                        'w-full px-3 py-1.5 text-left text-xs transition-colors flex items-center gap-2',
                        darkMode
                          ? 'hover:bg-gray-700'
                          : 'hover:bg-gray-50'
                      )}
                    >
                      <span
                        className="w-2 h-2 rounded-full flex-shrink-0"
                        style={{ backgroundColor: color }}
                      />
                      <span style={{ color }}>#{suggestion}</span>
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        ) : (
          <button
            onClick={() => setShowInput(true)}
            className={cn(
              'flex items-center gap-1 px-2 py-0.5 rounded-full text-xs transition-all',
              darkMode
                ? 'text-amber-400/60 hover:text-amber-300 hover:bg-amber-500/20'
                : 'text-amber-400 hover:text-amber-600 hover:bg-amber-100'
            )}
          >
            <Plus className="w-3 h-3" />
            {tags.length === 0 ? 'Add tags' : 'Add'}
          </button>
        )}
      </div>
    </div>
  );
}
