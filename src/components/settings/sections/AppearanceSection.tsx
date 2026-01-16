'use client';

import { PenTool, Type, Sparkles, Monitor, Coffee, Umbrella, BookOpen } from 'lucide-react';
import { cn } from '@/lib/utils/cn';
import { bindingColors, claspStyles, pageColors, inkColors } from '@/constants/themes';
import { fonts, fontsByCategory, fontCategories } from '@/constants/fonts';
import type { BindingColor, ClaspStyle, PageColor, FontFamily, FontSize, InkColor, SceneType } from '@/types/settings';

const scenes: { id: SceneType; name: string; description: string; icon: React.ReactNode; preview: string }[] = [
  { id: 'desk', name: 'Cozy Desk', description: 'Warm lamp, dark wood', icon: <Monitor className="w-5 h-5" />, preview: '#1a1714' },
  { id: 'cafe', name: 'Coffee Shop', description: 'Afternoon cafe vibes', icon: <Coffee className="w-5 h-5" />, preview: '#2d2520' },
  { id: 'beach', name: 'Beach Sunset', description: 'Golden hour by the ocean', icon: <Umbrella className="w-5 h-5" />, preview: '#c49a6c' },
  { id: 'library', name: 'Classic Library', description: 'Green lamp, bookshelves', icon: <BookOpen className="w-5 h-5" />, preview: '#1e1a18' },
];

interface AppearanceSectionProps {
  bindingColor: BindingColor;
  claspStyle: ClaspStyle;
  pageColor: PageColor;
  pageLines: boolean;
  fontFamily: FontFamily;
  fontSize: FontSize;
  inkColor: InkColor;
  scene: SceneType;
  updateSetting: (key: any, value: any) => Promise<void> | void;
}

export function AppearanceSection({
  bindingColor,
  claspStyle,
  pageColor,
  pageLines,
  fontFamily,
  fontSize,
  inkColor,
  scene,
  updateSetting,
}: AppearanceSectionProps) {
  const categories = ['neat', 'messy', 'bold', 'childlike', 'vintage'] as const;

  return (
    <>
      {/* Scene/Environment */}
      <section className="pb-6 border-b border-amber-100">
        <div className="flex items-center gap-2 mb-3">
          <Monitor className="w-4 h-4 text-amber-700" />
          <h3 className="text-sm font-medium text-amber-800">Environment</h3>
        </div>
        <div className="grid grid-cols-2 gap-3">
          {scenes.map((s) => (
            <button
              key={s.id}
              onClick={() => updateSetting('scene', s.id)}
              className={cn(
                'relative p-4 rounded-lg border-2 transition-all text-left',
                scene === s.id
                  ? 'border-amber-500 bg-amber-50'
                  : 'border-amber-100 hover:border-amber-300 bg-white'
              )}
            >
              <div
                className="w-full h-16 rounded-md mb-3 flex items-center justify-center"
                style={{ backgroundColor: s.preview }}
              >
                <span className="text-white/70">{s.icon}</span>
              </div>
              <p className="text-sm font-medium text-amber-800">{s.name}</p>
              <p className="text-xs text-amber-500">{s.description}</p>
            </button>
          ))}
        </div>
      </section>

      {/* Ink Color */}
      <section className="pb-6 border-b border-amber-100">
        <div className="flex items-center gap-2 mb-3">
          <PenTool className="w-4 h-4 text-amber-700" />
          <h3 className="text-sm font-medium text-amber-800">Ink Color</h3>
        </div>
        <div className="flex gap-3">
          {(Object.keys(inkColors) as InkColor[]).map((color) => {
            const ink = inkColors[color];
            return (
              <button
                key={color}
                onClick={() => updateSetting('inkColor', color)}
                className={cn(
                  'relative w-12 h-12 rounded-full transition-all',
                  'ring-2 ring-offset-2',
                  inkColor === color
                    ? 'ring-amber-500 scale-110'
                    : 'ring-transparent hover:ring-amber-300'
                )}
                style={{ backgroundColor: ink.color }}
                title={ink.name}
              >
                <div className="absolute inset-0 rounded-full overflow-hidden">
                  <div
                    className="absolute top-1 left-1 w-3 h-3 rounded-full opacity-30"
                    style={{ backgroundColor: 'white' }}
                  />
                </div>
              </button>
            );
          })}
        </div>
        <p className="mt-2 text-xs text-amber-500">
          {inkColors[inkColor].name}
        </p>
      </section>

      {/* Font Family */}
      <section className="pb-6 border-b border-amber-100">
        <div className="flex items-center gap-2 mb-4">
          <Type className="w-4 h-4 text-amber-700" />
          <h3 className="text-sm font-medium text-amber-800">Handwriting Style</h3>
        </div>

        {categories.map((category) => (
          <div key={category} className="mb-5">
            <div className="mb-2">
              <p className="text-sm font-medium text-amber-700">
                {fontCategories[category].label}
              </p>
              <p className="text-xs text-amber-400">
                {fontCategories[category].description}
              </p>
            </div>
            <div className="space-y-2">
              {fontsByCategory[category].map(([key, fontConfig]) => (
                <button
                  key={key}
                  onClick={() => updateSetting('fontFamily', key as FontFamily)}
                  className={cn(
                    'w-full px-4 py-3 rounded-lg border-2 text-left transition-all',
                    fontFamily === key
                      ? 'border-amber-500 bg-amber-50'
                      : 'border-amber-100 hover:border-amber-300 bg-white'
                  )}
                >
                  <span
                    className={cn(
                      fontConfig.className,
                      category === 'vintage' ? 'text-2xl' : 'text-xl'
                    )}
                    style={{ color: inkColors[inkColor].color }}
                  >
                    {fontConfig.sampleText}
                  </span>
                  <span className="block text-xs text-amber-400 mt-1">
                    {fontConfig.displayName}
                  </span>
                </button>
              ))}
            </div>
          </div>
        ))}
      </section>

      {/* Font Size */}
      <section className="pb-6 border-b border-amber-100">
        <h3 className="text-sm font-medium text-amber-800 mb-3">Text Size</h3>
        <div className="flex gap-3">
          {(['small', 'medium', 'large'] as FontSize[]).map((size) => (
            <button
              key={size}
              onClick={() => updateSetting('fontSize', size)}
              className={cn(
                'flex-1 py-3 rounded-lg border-2 transition-all capitalize',
                fontSize === size
                  ? 'border-amber-500 bg-amber-50'
                  : 'border-amber-200 hover:border-amber-400'
              )}
            >
              <span
                className={cn(
                  'text-amber-800',
                  size === 'small' && 'text-sm',
                  size === 'medium' && 'text-base',
                  size === 'large' && 'text-lg'
                )}
              >
                {size}
              </span>
            </button>
          ))}
        </div>
      </section>

      {/* Binding Color */}
      <section className="pb-6 border-b border-amber-100">
        <div className="flex items-center gap-2 mb-3">
          <Sparkles className="w-4 h-4 text-amber-700" />
          <h3 className="text-sm font-medium text-amber-800">Binding Color</h3>
        </div>
        <div className="grid grid-cols-4 gap-3">
          {(Object.keys(bindingColors) as BindingColor[]).map((color) => {
            const theme = bindingColors[color];
            return (
              <button
                key={color}
                onClick={() => updateSetting('bindingColor', color)}
                className={cn(
                  'relative aspect-square rounded-lg transition-all',
                  'ring-2 ring-offset-2',
                  bindingColor === color
                    ? 'ring-amber-500 scale-105'
                    : 'ring-transparent hover:ring-amber-300'
                )}
                style={{ backgroundColor: theme.color }}
                title={theme.name}
              >
                <div
                  className="absolute inset-0 rounded-lg opacity-30"
                  style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
                    mixBlendMode: 'overlay',
                  }}
                />
              </button>
            );
          })}
        </div>
        <p className="mt-2 text-xs text-amber-500">
          {bindingColors[bindingColor].name}
        </p>
      </section>

      {/* Clasp Style */}
      <section className="pb-6 border-b border-amber-100">
        <h3 className="text-sm font-medium text-amber-800 mb-3">Clasp Style</h3>
        <div className="flex gap-3">
          {(Object.keys(claspStyles) as ClaspStyle[]).map((style) => {
            const clasp = claspStyles[style];
            return (
              <button
                key={style}
                onClick={() => updateSetting('claspStyle', style)}
                className={cn(
                  'flex-1 py-3 rounded-lg transition-all',
                  'ring-2 ring-offset-2',
                  claspStyle === style
                    ? 'ring-amber-500'
                    : 'ring-transparent hover:ring-amber-300'
                )}
                style={{
                  background: `linear-gradient(135deg, ${clasp.color}, ${clasp.highlight})`,
                }}
              >
                <span className="text-sm font-medium text-white drop-shadow">
                  {clasp.name}
                </span>
              </button>
            );
          })}
        </div>
      </section>

      {/* Page Color */}
      <section className="pb-6 border-b border-amber-100">
        <h3 className="text-sm font-medium text-amber-800 mb-3">Page Color</h3>
        <div className="flex gap-3">
          {(['white', 'cream'] as PageColor[]).map((color) => (
            <button
              key={color}
              onClick={() => updateSetting('pageColor', color)}
              className={cn(
                'flex-1 py-6 rounded-lg border-2 transition-all',
                pageColor === color
                  ? 'border-amber-500 ring-2 ring-amber-200'
                  : 'border-amber-200 hover:border-amber-400'
              )}
              style={{ backgroundColor: pageColors[color] }}
            >
              <span className="text-sm text-amber-800 capitalize">{color}</span>
            </button>
          ))}
        </div>
      </section>

      {/* Page Lines */}
      <section>
        <h3 className="text-sm font-medium text-amber-800 mb-3">Page Style</h3>
        <div className="flex gap-3">
          <button
            onClick={() => updateSetting('pageLines', true)}
            className={cn(
              'flex-1 py-4 rounded-lg border-2 transition-all',
              'bg-amber-50',
              pageLines
                ? 'border-amber-500 ring-2 ring-amber-200'
                : 'border-amber-200 hover:border-amber-400'
            )}
          >
            <div className="space-y-1">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-px mx-4 bg-amber-300" />
              ))}
            </div>
            <span className="text-sm text-amber-800 mt-2 block">Lined</span>
          </button>

          <button
            onClick={() => updateSetting('pageLines', false)}
            className={cn(
              'flex-1 py-4 rounded-lg border-2 transition-all',
              'bg-amber-50',
              !pageLines
                ? 'border-amber-500 ring-2 ring-amber-200'
                : 'border-amber-200 hover:border-amber-400'
            )}
          >
            <div className="h-8" />
            <span className="text-sm text-amber-800 mt-2 block">Unlined</span>
          </button>
        </div>
      </section>
    </>
  );
}
