'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { Check, Save } from 'lucide-react';
import { cn } from '@/lib/utils/cn';

interface ProgramEditorProps {
  initialContent: string;
  onSave: (content: string) => Promise<void>;
  onComplete: (content: string) => Promise<void>;
  isCompleted: boolean;
  isLastPrompt: boolean;
  fontClassName: string;
  darkMode: boolean;
}

export function ProgramEditor({
  initialContent,
  onSave,
  onComplete,
  isCompleted,
  isLastPrompt,
  fontClassName,
  darkMode,
}: ProgramEditorProps) {
  const [content, setContent] = useState(initialContent);
  const [isSaving, setIsSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Update content when initialContent changes (switching prompts)
  useEffect(() => {
    setContent(initialContent);
  }, [initialContent]);

  // Focus textarea on mount
  useEffect(() => {
    if (textareaRef.current && !isCompleted) {
      textareaRef.current.focus();
    }
  }, [isCompleted]);

  // Cleanup debounce timer on unmount
  useEffect(() => {
    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, []);

  // Auto-save with debounce
  const debouncedSave = useCallback((text: string) => {
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    debounceTimerRef.current = setTimeout(async () => {
      if (text.trim()) {
        setIsSaving(true);
        await onSave(text);
        setLastSaved(new Date());
        setIsSaving(false);
      }
    }, 1000);
  }, [onSave]);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newContent = e.target.value;
    setContent(newContent);
    debouncedSave(newContent);
  };

  const handleComplete = async () => {
    if (content.trim()) {
      setIsSaving(true);
      await onComplete(content);
      setIsSaving(false);
    }
  };

  const handleManualSave = async () => {
    if (content.trim()) {
      setIsSaving(true);
      await onSave(content);
      setLastSaved(new Date());
      setIsSaving(false);
    }
  };

  const wordCount = content.trim().split(/\s+/).filter(Boolean).length;

  return (
    <div className="flex flex-col h-full">
      {/* Textarea */}
      <div className="flex-1 relative">
        <textarea
          ref={textareaRef}
          value={content}
          onChange={handleChange}
          placeholder="Start writing your response..."
          className={cn(
            'w-full h-full resize-none outline-none p-4 rounded-lg',
            'text-lg leading-relaxed',
            fontClassName,
            darkMode
              ? 'bg-neutral-800/50 text-neutral-100 placeholder:text-neutral-500'
              : 'bg-white/50 text-neutral-800 placeholder:text-neutral-400',
            isCompleted && 'opacity-80'
          )}
          style={{ minHeight: '200px' }}
        />
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between pt-4">
        {/* Word count and save status */}
        <div className={cn(
          'flex items-center gap-4 text-sm',
          darkMode ? 'text-neutral-400' : 'text-neutral-500'
        )}>
          <span>{wordCount} words</span>
          {isSaving && <span className="text-amber-500">Saving...</span>}
          {lastSaved && !isSaving && (
            <span className="text-green-500 flex items-center gap-1">
              <Check className="w-3 h-3" />
              Saved
            </span>
          )}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleManualSave}
            disabled={!content.trim() || isSaving}
            className={cn(
              'flex items-center gap-2 px-4 py-2 rounded-lg transition-colors',
              'border',
              darkMode
                ? 'border-neutral-600 text-neutral-300 hover:bg-neutral-700'
                : 'border-neutral-300 text-neutral-700 hover:bg-neutral-100',
              (!content.trim() || isSaving) && 'opacity-50 cursor-not-allowed'
            )}
          >
            <Save className="w-4 h-4" />
            Save
          </button>

          {!isCompleted && (
            <button
              onClick={handleComplete}
              disabled={!content.trim() || isSaving}
              className={cn(
                'flex items-center gap-2 px-4 py-2 rounded-lg transition-colors',
                'bg-green-600 text-white hover:bg-green-700',
                (!content.trim() || isSaving) && 'opacity-50 cursor-not-allowed'
              )}
            >
              <Check className="w-4 h-4" />
              {isLastPrompt ? 'Complete Program' : 'Complete & Next'}
            </button>
          )}

          {isCompleted && (
            <div className={cn(
              'flex items-center gap-2 px-4 py-2 rounded-lg',
              'bg-green-100 text-green-700'
            )}>
              <Check className="w-4 h-4" />
              Completed
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
