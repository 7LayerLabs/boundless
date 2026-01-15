'use client';

import { cn } from '@/lib/utils/cn';
import { useSettingsStore } from '@/stores/settingsStore';
import { bindingColors } from '@/constants/themes';

interface BookCoverProps {
  side: 'front' | 'back';
  className?: string;
}

export function BookCover({ side, className }: BookCoverProps) {
  const bindingColor = useSettingsStore((state) => state.bindingColor);
  const binding = bindingColors[bindingColor];

  return (
    <div
      className={cn(
        'absolute w-full h-full',
        side === 'front' ? 'rounded-r-lg rounded-l-sm' : 'rounded-l-lg rounded-r-sm',
        className
      )}
      style={{
        backgroundColor: binding.color,
        boxShadow: `
          inset 0 0 60px rgba(0, 0, 0, 0.3),
          inset ${side === 'front' ? '-5px' : '5px'} 0 20px rgba(0, 0, 0, 0.2)
        `,
      }}
    >
      {/* Leather texture overlay */}
      <div
        className={cn(
          'absolute inset-0 opacity-30 pointer-events-none',
          side === 'front' ? 'rounded-r-lg rounded-l-sm' : 'rounded-l-lg rounded-r-sm'
        )}
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
          mixBlendMode: 'overlay',
        }}
      />

      {/* Embossed border frame */}
      <div
        className="absolute inset-5 rounded pointer-events-none"
        style={{
          border: '2px solid rgba(255, 255, 255, 0.1)',
          boxShadow: `
            inset 0 0 0 1px rgba(0, 0, 0, 0.2),
            0 0 0 1px rgba(255, 255, 255, 0.05)
          `,
        }}
      />

      {/* Gold foil edge (only on front cover, right side) */}
      {side === 'front' && (
        <div
          className="absolute right-0 top-4 bottom-4 w-1 rounded-r"
          style={{
            background: 'linear-gradient(180deg, #d4af37 0%, #f5e6a3 25%, #d4af37 50%, #c5a028 75%, #d4af37 100%)',
          }}
        />
      )}

      {/* Gold foil edge (only on back cover, left side) */}
      {side === 'back' && (
        <div
          className="absolute left-0 top-4 bottom-4 w-1 rounded-l"
          style={{
            background: 'linear-gradient(180deg, #d4af37 0%, #f5e6a3 25%, #d4af37 50%, #c5a028 75%, #d4af37 100%)',
          }}
        />
      )}

      {/* Spine edge shadow */}
      <div
        className={cn(
          'absolute top-0 bottom-0 w-4',
          side === 'front' ? 'left-0 rounded-l-sm' : 'right-0 rounded-r-sm'
        )}
        style={{
          background: side === 'front'
            ? 'linear-gradient(90deg, rgba(0,0,0,0.35), transparent)'
            : 'linear-gradient(-90deg, rgba(0,0,0,0.35), transparent)',
        }}
      />

      {/* Engraved "Boundless" logo - only on front cover */}
      {side === 'front' && (
        <div className="absolute bottom-6 right-8">
          <span
            className="font-playfair text-xl italic tracking-wider select-none"
            style={{
              color: 'transparent',
              textShadow: `
                1px 1px 1px rgba(255, 255, 255, 0.12),
                -1px -1px 1px rgba(0, 0, 0, 0.35)
              `,
              WebkitBackgroundClip: 'text',
              backgroundClip: 'text',
              background: `linear-gradient(145deg, rgba(0, 0, 0, 0.2), rgba(0, 0, 0, 0.08))`,
            }}
          >
            Boundless
          </span>
        </div>
      )}

      {/* Inner decorative corner flourishes - front cover only */}
      {side === 'front' && (
        <>
          {/* Top left corner */}
          <div
            className="absolute top-7 left-7 w-8 h-8 pointer-events-none"
            style={{
              borderTop: '2px solid rgba(212, 175, 55, 0.25)',
              borderLeft: '2px solid rgba(212, 175, 55, 0.25)',
              borderRadius: '2px 0 0 0',
            }}
          />
          {/* Top right corner */}
          <div
            className="absolute top-7 right-7 w-8 h-8 pointer-events-none"
            style={{
              borderTop: '2px solid rgba(212, 175, 55, 0.25)',
              borderRight: '2px solid rgba(212, 175, 55, 0.25)',
              borderRadius: '0 2px 0 0',
            }}
          />
          {/* Bottom left corner */}
          <div
            className="absolute bottom-7 left-7 w-8 h-8 pointer-events-none"
            style={{
              borderBottom: '2px solid rgba(212, 175, 55, 0.25)',
              borderLeft: '2px solid rgba(212, 175, 55, 0.25)',
              borderRadius: '0 0 0 2px',
            }}
          />
          {/* Bottom right corner */}
          <div
            className="absolute bottom-7 right-7 w-8 h-8 pointer-events-none"
            style={{
              borderBottom: '2px solid rgba(212, 175, 55, 0.25)',
              borderRight: '2px solid rgba(212, 175, 55, 0.25)',
              borderRadius: '0 0 2px 0',
            }}
          />
        </>
      )}
    </div>
  );
}
