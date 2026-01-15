'use client';

import { motion } from 'framer-motion';
import { useSettings } from '@/hooks/useSettings';
import { bindingColors, claspStyles } from '@/constants/themes';

interface ClosedJournalProps {
  onClick?: () => void;
  isLocked?: boolean;
}

export function ClosedJournal({ onClick, isLocked = true }: ClosedJournalProps) {
  const { bindingColor, claspStyle, isLoading } = useSettings();

  const binding = bindingColors[bindingColor] || bindingColors.brown;
  const clasp = claspStyles[claspStyle] || claspStyles.gold;

  // Darken the binding color for shadows
  const darkenColor = (hex: string, amount: number) => {
    const num = parseInt(hex.replace('#', ''), 16);
    const r = Math.max(0, (num >> 16) - amount);
    const g = Math.max(0, ((num >> 8) & 0x00FF) - amount);
    const b = Math.max(0, (num & 0x0000FF) - amount);
    return `rgb(${r}, ${g}, ${b})`;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 1, ease: [0.25, 0.1, 0.25, 1] }}
      className="relative"
      onClick={onClick}
      style={{ perspective: '1200px' }}
    >
      {/* Realistic shadow beneath book */}
      <div
        className="absolute -bottom-6 left-6 right-6 h-16"
        style={{
          background: 'radial-gradient(ellipse at center, rgba(0, 0, 0, 0.6) 0%, transparent 70%)',
          filter: 'blur(12px)',
          transform: 'scaleY(0.3)',
        }}
      />

      {/* Secondary softer shadow */}
      <div
        className="absolute -bottom-2 left-12 right-12 h-8"
        style={{
          background: 'radial-gradient(ellipse at center, rgba(0, 0, 0, 0.4) 0%, transparent 60%)',
          filter: 'blur(8px)',
        }}
      />

      {/* Main journal body */}
      <motion.div
        className="relative w-[300px] h-[400px] md:w-[360px] md:h-[480px]"
        whileHover={!isLocked ? {
          y: -4,
          rotateX: 2,
          transition: { duration: 0.3 }
        } : {}}
        style={{
          transformStyle: 'preserve-3d',
          transform: 'rotateX(8deg) rotateY(-2deg)',
        }}
      >
        {/* Book cover - main surface */}
        <div
          className="absolute inset-0 rounded-sm rounded-r-md"
          style={{
            background: `linear-gradient(145deg,
              ${binding.color} 0%,
              ${darkenColor(binding.color, 20)} 50%,
              ${darkenColor(binding.color, 40)} 100%
            )`,
            boxShadow: `
              inset 0 1px 0 rgba(255, 255, 255, 0.1),
              inset 0 -2px 10px rgba(0, 0, 0, 0.3),
              0 15px 35px rgba(0, 0, 0, 0.4),
              0 5px 15px rgba(0, 0, 0, 0.3)
            `,
          }}
        />

        {/* Leather texture - realistic grain */}
        <div
          className="absolute inset-0 rounded-sm rounded-r-md opacity-60"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='leather'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.04' numOctaves='6' stitchTiles='stitch' result='noise'/%3E%3CfeDiffuseLighting in='noise' lightingColor='%23fff' surfaceScale='2' result='light'%3E%3CfeDistantLight azimuth='45' elevation='60'/%3E%3C/feDiffuseLighting%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23leather)'/%3E%3C/svg%3E")`,
            mixBlendMode: 'overlay',
          }}
        />

        {/* Fine leather pores */}
        <div
          className="absolute inset-0 rounded-sm rounded-r-md opacity-30"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='pores'%3E%3CfeTurbulence type='turbulence' baseFrequency='0.8' numOctaves='3'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23pores)'/%3E%3C/svg%3E")`,
            mixBlendMode: 'multiply',
          }}
        />

        {/* Spine - left edge */}
        <div
          className="absolute left-0 top-0 bottom-0 w-6 md:w-8 rounded-l-sm"
          style={{
            background: `linear-gradient(90deg,
              ${darkenColor(binding.color, 50)} 0%,
              ${darkenColor(binding.color, 30)} 30%,
              ${binding.color} 70%,
              ${darkenColor(binding.color, 20)} 100%
            )`,
            boxShadow: 'inset -4px 0 12px rgba(0, 0, 0, 0.4)',
          }}
        />

        {/* Spine raised bands */}
        {[18, 35, 52, 69, 86].map((top) => (
          <div
            key={top}
            className="absolute left-0 w-6 md:w-8 h-2"
            style={{
              top: `${top}%`,
              background: `linear-gradient(180deg,
                rgba(255,255,255,0.05) 0%,
                transparent 30%,
                rgba(0,0,0,0.15) 70%,
                rgba(0,0,0,0.2) 100%
              )`,
              borderRadius: '1px',
            }}
          />
        ))}

        {/* Subtle embossed border - single refined line */}
        <div
          className="absolute inset-6 md:inset-8 rounded pointer-events-none"
          style={{
            border: '1px solid rgba(212, 175, 55, 0.15)',
            boxShadow: `
              inset 0 0 0 1px rgba(0, 0, 0, 0.1),
              0 0 0 1px rgba(212, 175, 55, 0.08)
            `,
          }}
        />

        {/* Embossed title - subtle and elegant */}
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          <div
            className="text-center px-8"
            style={{
              transform: 'translateY(-20px)',
            }}
          >
            <h1
              className="text-2xl md:text-3xl font-serif tracking-[0.15em]"
              style={{
                color: 'transparent',
                backgroundImage: `linear-gradient(180deg,
                  rgba(212, 175, 55, 0.25) 0%,
                  rgba(212, 175, 55, 0.15) 100%
                )`,
                WebkitBackgroundClip: 'text',
                backgroundClip: 'text',
                textShadow: `
                  0 1px 0 rgba(255, 255, 255, 0.05),
                  0 -1px 0 rgba(0, 0, 0, 0.3)
                `,
                filter: 'drop-shadow(0 1px 1px rgba(0,0,0,0.2))',
              }}
            >
              BOUNDLESS
            </h1>
            <div
              className="w-16 h-px mx-auto mt-3 mb-2"
              style={{
                background: 'linear-gradient(90deg, transparent, rgba(212, 175, 55, 0.2), transparent)',
              }}
            />
            <p
              className="text-[10px] md:text-xs tracking-[0.3em] uppercase"
              style={{
                color: 'rgba(212, 175, 55, 0.18)',
              }}
            >
              Journal
            </p>
          </div>
        </div>

        {/* Page edges - right side */}
        <div
          className="absolute right-0 top-2 bottom-2 w-2 rounded-r-sm"
          style={{
            background: `linear-gradient(90deg,
              #d4cec4 0%,
              #e8e2d8 20%,
              #f0ebe3 50%,
              #e8e2d8 80%,
              #ccc6bc 100%
            )`,
            boxShadow: 'inset 3px 0 6px rgba(0, 0, 0, 0.1)',
          }}
        />

        {/* Individual page lines on edge */}
        <div className="absolute right-0 top-2 bottom-2 w-2 rounded-r-sm overflow-hidden">
          {[...Array(40)].map((_, i) => (
            <div
              key={i}
              className="absolute left-0 right-0"
              style={{
                top: `${2.5 * i}%`,
                height: '1px',
                background: 'rgba(0, 0, 0, 0.03)',
              }}
            />
          ))}
        </div>

        {/* Clasp strap */}
        <div
          className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-[60%]"
          style={{ zIndex: 10 }}
        >
          {/* Leather strap */}
          <div
            className="w-14 h-8 md:w-16 md:h-10"
            style={{
              background: `linear-gradient(180deg,
                ${binding.color} 0%,
                ${darkenColor(binding.color, 15)} 50%,
                ${darkenColor(binding.color, 25)} 100%
              )`,
              borderRadius: '0 4px 4px 0',
              boxShadow: `
                0 2px 6px rgba(0, 0, 0, 0.3),
                inset 0 1px 0 rgba(255, 255, 255, 0.1)
              `,
            }}
          />

          {/* Metal clasp */}
          <div
            className="absolute right-1 top-1/2 -translate-y-1/2 w-6 h-6 md:w-7 md:h-7 rounded-full"
            style={{
              background: `linear-gradient(145deg,
                ${clasp.highlight} 0%,
                ${clasp.color} 30%,
                ${clasp.color} 70%,
                rgba(0,0,0,0.2) 100%
              )`,
              boxShadow: `
                0 2px 4px rgba(0, 0, 0, 0.4),
                inset 0 1px 2px rgba(255, 255, 255, 0.3),
                inset 0 -1px 2px rgba(0, 0, 0, 0.2)
              `,
            }}
          >
            {/* Lock keyhole */}
            {isLocked && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div
                  className="w-2 h-3"
                  style={{
                    background: `linear-gradient(180deg,
                      rgba(0, 0, 0, 0.4) 0%,
                      rgba(0, 0, 0, 0.5) 40%,
                      rgba(0, 0, 0, 0.4) 100%
                    )`,
                    borderRadius: '50% 50% 2px 2px',
                    boxShadow: 'inset 0 1px 2px rgba(0, 0, 0, 0.3)',
                  }}
                />
              </div>
            )}
          </div>
        </div>

        {/* Bookmark ribbon */}
        <div
          className="absolute top-0 left-12 md:left-14 w-2.5 h-20 md:h-24"
          style={{
            background: 'linear-gradient(180deg, #6b1c1c 0%, #4a1414 100%)',
            boxShadow: '1px 2px 4px rgba(0, 0, 0, 0.3)',
            clipPath: 'polygon(0 0, 100% 0, 100% 85%, 50% 100%, 0 85%)',
          }}
        />

        {/* Top edge wear/highlight */}
        <div
          className="absolute top-0 left-0 right-0 h-px rounded-t-sm"
          style={{
            background: 'linear-gradient(90deg, transparent 10%, rgba(255, 255, 255, 0.08) 50%, transparent 90%)',
          }}
        />
      </motion.div>

      {/* Subtle glow when unlocked */}
      {!isLocked && (
        <motion.div
          className="absolute inset-0 pointer-events-none"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          style={{
            background: 'radial-gradient(ellipse at center, rgba(255, 200, 120, 0.1) 0%, transparent 60%)',
            filter: 'blur(20px)',
          }}
        />
      )}
    </motion.div>
  );
}
