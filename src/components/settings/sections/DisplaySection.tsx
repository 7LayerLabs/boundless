'use client';

import { cn } from '@/lib/utils/cn';
import { dateColors } from '@/constants/themes';
import type { DateFormat, DateColor } from '@/types/settings';

const dateFormats: Record<DateFormat, { label: string; example: string }> = {
  full: { label: 'Full', example: 'JANUARY 16, 2026' },
  short: { label: 'Short', example: 'Jan 16, 2026' },
  numeric: { label: 'Numeric', example: '1/16/2026' },
  dots: { label: 'Dots', example: '1.16.26' },
};

interface DisplaySectionProps {
  dateFormat: DateFormat;
  dateColor: DateColor;
  updateSetting: (key: any, value: any) => Promise<void> | void;
}

export function DisplaySection({
  dateFormat,
  dateColor,
  updateSetting,
}: DisplaySectionProps) {
  return (
    <section className="pb-6 border-b border-neutral-200">
      <h3 className="text-sm font-medium text-neutral-500 uppercase tracking-wide mb-4">Display</h3>

      {/* Date Format */}
      <div className="space-y-3 mb-6">
        <p className="text-sm text-neutral-600">Date Format</p>
        <div className="grid grid-cols-2 gap-2">
          {(Object.keys(dateFormats) as DateFormat[]).map((format) => {
            const formatConfig = dateFormats[format];
            return (
              <button
                key={format}
                onClick={() => updateSetting('dateFormat', format)}
                className={cn(
                  'px-3 py-2 rounded-lg border text-left transition-all',
                  dateFormat === format
                    ? 'border-neutral-900 bg-neutral-50'
                    : 'border-neutral-200 hover:border-neutral-400 bg-white'
                )}
              >
                <p className="text-xs text-neutral-500">{formatConfig.label}</p>
                <p className="text-sm font-medium text-neutral-800">{formatConfig.example}</p>
              </button>
            );
          })}
        </div>
      </div>

      {/* Date Color */}
      <div className="space-y-3">
        <p className="text-sm text-neutral-600">Date Color</p>
        <div className="grid grid-cols-3 gap-2">
          {(Object.keys(dateColors) as DateColor[]).map((color) => {
            const colorConfig = dateColors[color];
            return (
              <button
                key={color}
                onClick={() => updateSetting('dateColor', color)}
                className={cn(
                  'px-3 py-3 rounded-lg border text-center transition-all',
                  dateColor === color
                    ? 'border-neutral-900 bg-neutral-50'
                    : 'border-neutral-200 hover:border-neutral-400 bg-white'
                )}
              >
                <p
                  className="text-sm font-bold"
                  style={{ color: colorConfig.color }}
                >
                  Aa
                </p>
                <p className="text-xs text-neutral-500 mt-1">{colorConfig.name}</p>
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}
