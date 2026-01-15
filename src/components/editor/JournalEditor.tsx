'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { cn } from '@/lib/utils/cn';
import { useSettingsStore } from '@/stores/settingsStore';
import { useJournalStore } from '@/stores/journalStore';
import { fonts } from '@/constants/fonts';
import { inkColors } from '@/constants/themes';
import type { JournalEntry } from '@/types/journal';

interface JournalEditorProps {
  entry?: JournalEntry;
  date: Date;
}

export function JournalEditor({ entry, date }: JournalEditorProps) {
  const [content, setContent] = useState(entry?.content || '');
  const [isSaving, setIsSaving] = useState(false);
  const editorRef = useRef<HTMLTextAreaElement>(null);
  const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const { fontFamily, fontSize, pageLines, inkColor } = useSettingsStore();
  const { createEntry, updateEntry, markUnsaved, markSaved } = useJournalStore();

  const currentFont = fonts[fontFamily] || fonts.caveat; // Fallback if font doesn't exist
  const currentInk = inkColors[inkColor] || inkColors.black; // Fallback if ink doesn't exist

  // Font size mapping for larger text
  const fontSizeMap = {
    small: '1.125rem',
    medium: '1.375rem',
    large: '1.625rem',
  };

  // Update content when entry changes
  useEffect(() => {
    setContent(entry?.content || '');
  }, [entry?.id, entry?.content]);

  // Auto-save with debounce
  const saveContent = useCallback(async (text: string) => {
    if (!text.trim()) return;

    setIsSaving(true);
    try {
      if (entry) {
        await updateEntry(entry.id, text, entry.mood, entry.tags);
      } else {
        await createEntry(date, text, null, []);
      }
      markSaved();
    } catch (error) {
      console.error('Error saving entry:', error);
    } finally {
      setIsSaving(false);
    }
  }, [entry, date, createEntry, updateEntry, markSaved]);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newContent = e.target.value;
    setContent(newContent);
    markUnsaved();

    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }

    saveTimeoutRef.current = setTimeout(() => {
      saveContent(newContent);
    }, 1500);
  };

  const handleBlur = () => {
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }
    if (content.trim()) {
      saveContent(content);
    }
  };

  useEffect(() => {
    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
    };
  }, []);

  return (
    <div className="relative h-full flex flex-col">
      <textarea
        ref={editorRef}
        value={content}
        onChange={handleChange}
        onBlur={handleBlur}
        placeholder="Begin writing..."
        spellCheck={false}
        className={cn(
          'w-full h-full resize-none',
          'bg-transparent border-none outline-none',
          'placeholder:text-amber-400/40',
          currentFont.className
        )}
        style={{
          fontSize: fontSizeMap[fontSize],
          lineHeight: '32px',
          color: currentInk.color,
          caretColor: currentInk.caretColor,
        }}
      />

      {/* Subtle save indicator */}
      {isSaving && (
        <div className="absolute bottom-2 right-2 flex items-center gap-2 text-amber-600/50 text-sm">
          <div className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
          Saving...
        </div>
      )}
    </div>
  );
}
