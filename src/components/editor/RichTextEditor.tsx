'use client';

import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { TextStyle } from '@tiptap/extension-text-style';
import { Color } from '@tiptap/extension-color';
import { FontFamily } from '@tiptap/extension-font-family';
import { Underline } from '@tiptap/extension-underline';
import { Placeholder } from '@tiptap/extension-placeholder';
import { useState, useEffect, useCallback, useRef } from 'react';
import {
  Bold,
  Italic,
  Underline as UnderlineIcon,
  Type,
  Palette,
  Minus,
  Plus,
  ChevronDown,
  Lock
} from 'lucide-react';
import { cn } from '@/lib/utils/cn';
import { useSettings } from '@/hooks/useSettings';
import { useJournal } from '@/hooks/useJournal';
import { fonts, fontCategories, fontsByCategory } from '@/constants/fonts';
import { inkColors } from '@/constants/themes';
import type { FontFamily as FontFamilyType, InkColor } from '@/types/settings';

interface RichTextEditorProps {
  entry?: {
    id: string;
    content: string;
    mood: string | null;
    tags: string[];
  };
  date: Date;
  isLocked?: boolean;
}

// Custom font size extension
const FontSize = TextStyle.extend({
  addAttributes() {
    return {
      ...this.parent?.(),
      fontSize: {
        default: null,
        parseHTML: element => element.style.fontSize?.replace(/['"]+/g, ''),
        renderHTML: attributes => {
          if (!attributes.fontSize) return {};
          return { style: `font-size: ${attributes.fontSize}` };
        },
      },
    };
  },
});

export function RichTextEditor({ entry, date, isLocked = false }: RichTextEditorProps) {
  const { fontFamily: defaultFont, inkColor: defaultInk, fontSize: defaultSize } = useSettings();
  const { createEntry, updateEntry } = useJournal();

  const defaultFontConfig = fonts[defaultFont] || fonts.caveat;
  const defaultInkConfig = inkColors[defaultInk] || inkColors.black;

  // Map size setting to pixel values
  const fontSizeMap: Record<string, number> = { small: 16, medium: 20, large: 26 };
  const baseFontSize = fontSizeMap[defaultSize] || 20;
  const lineHeightMap: Record<string, number> = { small: 26, medium: 32, large: 40 };
  const baseLineHeight = lineHeightMap[defaultSize] || 32;

  const [isSaving, setIsSaving] = useState(false);
  const [showFontPicker, setShowFontPicker] = useState(false);
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [showSizePicker, setShowSizePicker] = useState(false);
  const [currentFontSize, setCurrentFontSize] = useState(baseFontSize);
  const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const editor = useEditor({
    immediatelyRender: false,
    editable: !isLocked,
    extensions: [
      StarterKit.configure({
        heading: false,
        codeBlock: false,
        code: false,
        blockquote: false,
        horizontalRule: false,
      }),
      TextStyle,
      FontSize,
      Color,
      FontFamily,
      Underline,
      Placeholder.configure({
        placeholder: isLocked ? '' : 'Begin writing...',
      }),
    ],
    content: entry?.content || '',
    editorProps: {
      attributes: {
        class: 'outline-none min-h-full',
        style: `font-family: var(--font-${defaultFont.toLowerCase().replace(/\s/g, '')}), cursive; color: ${defaultInkConfig.color}; font-size: ${baseFontSize}px; line-height: ${baseLineHeight}px;`,
      },
    },
    onUpdate: ({ editor }) => {
      if (isLocked) return; // Don't save if locked

      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }

      saveTimeoutRef.current = setTimeout(() => {
        saveContent(editor.getHTML());
      }, 1500);
    },
  });

  // Update editor content when entry changes
  useEffect(() => {
    if (editor && entry?.content !== undefined) {
      const currentContent = editor.getHTML();
      if (currentContent !== entry.content) {
        editor.commands.setContent(entry.content || '');
      }
    }
  }, [editor, entry?.id]);

  // Update editable state when lock status changes
  useEffect(() => {
    if (editor) {
      editor.setEditable(!isLocked);
    }
  }, [editor, isLocked]);

  // Sync font size with settings
  useEffect(() => {
    setCurrentFontSize(baseFontSize);
  }, [baseFontSize]);

  const saveContent = useCallback(async (html: string) => {
    if (!html || html === '<p></p>') return;

    setIsSaving(true);
    try {
      if (entry) {
        await updateEntry(entry.id, html, entry.mood as any, entry.tags || []);
      } else {
        await createEntry(date, html, null, []);
      }
    } catch (error) {
      console.error('Error saving entry:', error);
    } finally {
      setIsSaving(false);
    }
  }, [entry, date, createEntry, updateEntry]);

  // Cleanup
  useEffect(() => {
    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
    };
  }, []);

  const closeAllPickers = () => {
    setShowFontPicker(false);
    setShowColorPicker(false);
    setShowSizePicker(false);
  };

  const setFontFamily = (fontKey: FontFamilyType) => {
    const fontConfig = fonts[fontKey];
    if (editor && fontConfig) {
      editor.chain().focus().setFontFamily(`var(--font-${fontKey.toLowerCase().replace(/([A-Z])/g, (m) => m.toLowerCase())}), cursive`).run();
    }
    closeAllPickers();
  };

  const setColor = (colorKey: InkColor) => {
    const colorConfig = inkColors[colorKey];
    if (editor && colorConfig) {
      editor.chain().focus().setColor(colorConfig.color).run();
    }
    closeAllPickers();
  };

  const setFontSizeValue = (size: number) => {
    if (editor) {
      editor.chain().focus().setMark('textStyle', { fontSize: `${size}px` }).run();
      setCurrentFontSize(size);
    }
  };

  const categories = ['neat', 'messy', 'elegant', 'bold', 'childlike', 'vintage'] as const;

  if (!editor) return null;

  return (
    <div className="h-full flex flex-col">
      {/* Locked Notice */}
      {isLocked && (
        <div className="flex items-center gap-2 mb-3 pb-3 border-b border-amber-200/50 text-amber-600">
          <Lock className="w-4 h-4" />
          <span className="text-sm">This entry is locked and cannot be edited. Add updates below.</span>
        </div>
      )}

      {/* Toolbar - Horizontal at top (hidden when locked) */}
      {!isLocked && (
      <div className="flex items-center gap-1 mb-3 pb-3 border-b border-amber-200/50 flex-wrap">
        {/* Bold */}
        <button
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={cn(
            'w-8 h-8 rounded-md flex items-center justify-center transition-all',
            'hover:bg-amber-100',
            editor.isActive('bold') ? 'bg-amber-200 text-amber-900' : 'text-amber-700'
          )}
          title="Bold"
        >
          <Bold className="w-4 h-4" />
        </button>

        {/* Italic */}
        <button
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={cn(
            'w-8 h-8 rounded-md flex items-center justify-center transition-all',
            'hover:bg-amber-100',
            editor.isActive('italic') ? 'bg-amber-200 text-amber-900' : 'text-amber-700'
          )}
          title="Italic"
        >
          <Italic className="w-4 h-4" />
        </button>

        {/* Underline */}
        <button
          onClick={() => editor.chain().focus().toggleUnderline().run()}
          className={cn(
            'w-8 h-8 rounded-md flex items-center justify-center transition-all',
            'hover:bg-amber-100',
            editor.isActive('underline') ? 'bg-amber-200 text-amber-900' : 'text-amber-700'
          )}
          title="Underline"
        >
          <UnderlineIcon className="w-4 h-4" />
        </button>

        <div className="w-px h-6 bg-amber-200 mx-1" />

        {/* Font Picker */}
        <div className="relative">
          <button
            onClick={() => {
              setShowFontPicker(!showFontPicker);
              setShowColorPicker(false);
              setShowSizePicker(false);
            }}
            className={cn(
              'h-8 px-2 rounded-md flex items-center gap-1 transition-all',
              'hover:bg-amber-100',
              showFontPicker ? 'bg-amber-200 text-amber-900' : 'text-amber-700'
            )}
            title="Font"
          >
            <Type className="w-4 h-4" />
            <ChevronDown className="w-3 h-3" />
          </button>

          {showFontPicker && (
            <div className="absolute left-0 top-10 w-72 max-h-80 overflow-y-auto bg-white rounded-xl shadow-2xl border border-amber-100 z-50">
              <div className="p-2">
                {categories.map((category) => (
                  <div key={category} className="mb-2">
                    <p className="text-xs text-amber-400 px-2 py-1 font-medium">{fontCategories[category].label}</p>
                    {fontsByCategory[category].map(([key, fontConfig]) => (
                      <button
                        key={key}
                        onClick={() => setFontFamily(key as FontFamilyType)}
                        className="w-full px-2 py-1.5 text-left hover:bg-amber-50 rounded-md transition-colors"
                      >
                        <span className={cn('text-base', fontConfig.className)} style={{ color: defaultInkConfig.color }}>
                          {fontConfig.displayName}
                        </span>
                      </button>
                    ))}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Color Picker */}
        <div className="relative">
          <button
            onClick={() => {
              setShowColorPicker(!showColorPicker);
              setShowFontPicker(false);
              setShowSizePicker(false);
            }}
            className={cn(
              'h-8 px-2 rounded-md flex items-center gap-1 transition-all',
              'hover:bg-amber-100',
              showColorPicker ? 'bg-amber-200 text-amber-900' : 'text-amber-700'
            )}
            title="Color"
          >
            <Palette className="w-4 h-4" />
            <ChevronDown className="w-3 h-3" />
          </button>

          {showColorPicker && (
            <div className="absolute left-0 top-10 bg-white rounded-xl shadow-2xl border border-amber-100 p-3 z-50">
              <p className="text-xs text-amber-500 mb-2 font-medium">Ink Color</p>
              <div className="flex gap-2">
                {(Object.keys(inkColors) as InkColor[]).map((colorKey) => {
                  const color = inkColors[colorKey];
                  return (
                    <button
                      key={colorKey}
                      onClick={() => setColor(colorKey)}
                      className="w-8 h-8 rounded-full transition-transform hover:scale-110 ring-2 ring-offset-1 ring-transparent hover:ring-amber-300"
                      style={{ backgroundColor: color.color }}
                      title={color.name}
                    />
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Size Picker */}
        <div className="relative">
          <button
            onClick={() => {
              setShowSizePicker(!showSizePicker);
              setShowFontPicker(false);
              setShowColorPicker(false);
            }}
            className={cn(
              'h-8 px-2 rounded-md flex items-center gap-1 transition-all',
              'hover:bg-amber-100',
              showSizePicker ? 'bg-amber-200 text-amber-900' : 'text-amber-700'
            )}
            title="Size"
          >
            <span className="text-xs font-bold">Aa</span>
            <ChevronDown className="w-3 h-3" />
          </button>

          {showSizePicker && (
            <div className="absolute left-0 top-10 bg-white rounded-xl shadow-2xl border border-amber-100 p-3 z-50">
              <p className="text-xs text-amber-500 mb-2 font-medium">Text Size</p>
              <div className="flex items-center gap-2 mb-2">
                <button
                  onClick={() => setFontSizeValue(Math.max(12, currentFontSize - 2))}
                  className="w-7 h-7 rounded-md bg-amber-50 hover:bg-amber-100 flex items-center justify-center"
                >
                  <Minus className="w-3 h-3 text-amber-700" />
                </button>
                <span className="w-10 text-center text-sm font-medium text-amber-800">{currentFontSize}</span>
                <button
                  onClick={() => setFontSizeValue(Math.min(48, currentFontSize + 2))}
                  className="w-7 h-7 rounded-md bg-amber-50 hover:bg-amber-100 flex items-center justify-center"
                >
                  <Plus className="w-3 h-3 text-amber-700" />
                </button>
              </div>
              <div className="flex gap-1">
                {[14, 18, 22, 28, 36].map((size) => (
                  <button
                    key={size}
                    onClick={() => setFontSizeValue(size)}
                    className={cn(
                      'px-2 py-1 rounded text-xs transition-colors',
                      currentFontSize === size ? 'bg-amber-500 text-white' : 'bg-amber-50 text-amber-700 hover:bg-amber-100'
                    )}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Save indicator */}
        {isSaving && (
          <div className="ml-auto flex items-center gap-1 text-amber-500 text-xs">
            <div className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
            Saving
          </div>
        )}
      </div>
      )}

      {/* Editor Content */}
      <div className="flex-1 min-h-0 overflow-y-auto">
        <EditorContent
          editor={editor}
          className="min-h-full prose prose-amber max-w-none"
        />
      </div>
    </div>
  );
}
