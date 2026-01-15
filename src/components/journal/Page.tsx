'use client';

import { forwardRef } from 'react';
import { cn } from '@/lib/utils/cn';
import { useSettingsStore } from '@/stores/settingsStore';
import { pageColors } from '@/constants/themes';

interface PageProps {
  children?: React.ReactNode;
  className?: string;
  isFlipped?: boolean;
  zIndex?: number;
}

export const Page = forwardRef<HTMLDivElement, PageProps>(
  ({ children, className, isFlipped = false, zIndex = 1 }, ref) => {
    const pageColor = useSettingsStore((state) => state.pageColor);
    const pageLines = useSettingsStore((state) => state.pageLines);

    const bgColor = pageColors[pageColor];

    return (
      <div
        ref={ref}
        className={cn(
          'absolute w-full h-full page-flip preserve-3d',
          isFlipped && 'page-turning',
          className
        )}
        style={{ zIndex }}
      >
        {/* Front of page */}
        <div
          className={cn(
            'absolute w-full h-full backface-hidden rounded-r-md',
            'shadow-[2px_0_10px_rgba(0,0,0,0.1)]',
            pageLines && 'page-lined'
          )}
          style={{
            backgroundColor: bgColor,
            backfaceVisibility: 'hidden',
          }}
        >
          {/* Paper texture */}
          <div
            className="absolute inset-0 pointer-events-none rounded-r-md paper-texture"
            style={{ opacity: 0.5 }}
          />

          {/* Page content */}
          <div className="relative h-full p-8 overflow-auto journal-scrollbar">
            {children}
          </div>

          {/* Page edge shadow */}
          <div
            className="absolute right-0 top-0 bottom-0 w-2 pointer-events-none"
            style={{
              background: 'linear-gradient(90deg, transparent, rgba(0,0,0,0.05))',
            }}
          />

          {/* Page fold indicator at top right */}
          <div
            className="absolute top-0 right-0 w-6 h-6 pointer-events-none"
            style={{
              background: `linear-gradient(135deg, transparent 50%, rgba(0,0,0,0.03) 50%)`,
            }}
          />
        </div>

        {/* Back of page (visible when flipped) */}
        <div
          className={cn(
            'absolute w-full h-full backface-hidden rounded-l-md',
            pageLines && 'page-lined'
          )}
          style={{
            backgroundColor: bgColor,
            transform: 'rotateY(180deg)',
            backfaceVisibility: 'hidden',
          }}
        >
          {/* Paper texture */}
          <div
            className="absolute inset-0 pointer-events-none rounded-l-md paper-texture"
            style={{ opacity: 0.5 }}
          />

          {/* Left edge shadow */}
          <div
            className="absolute left-0 top-0 bottom-0 w-2 pointer-events-none"
            style={{
              background: 'linear-gradient(-90deg, transparent, rgba(0,0,0,0.08))',
            }}
          />
        </div>
      </div>
    );
  }
);

Page.displayName = 'Page';
