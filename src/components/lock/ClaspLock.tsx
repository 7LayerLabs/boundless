'use client';

import { motion } from 'framer-motion';
import { cn } from '@/lib/utils/cn';
import { useSettingsStore } from '@/stores/settingsStore';
import { claspStyles } from '@/constants/themes';

interface ClaspLockProps {
  isLocked: boolean;
  onClick?: () => void;
}

export function ClaspLock({ isLocked, onClick }: ClaspLockProps) {
  const claspStyle = useSettingsStore((state) => state.claspStyle);
  const clasp = claspStyles[claspStyle];

  return (
    <div
      className={cn(
        'relative w-10 h-20 cursor-pointer',
        'flex flex-col items-center'
      )}
      onClick={onClick}
    >
      {/* Clasp base attached to cover */}
      <div
        className="w-8 h-6 rounded-sm"
        style={{
          background: `linear-gradient(135deg, ${clasp.color} 0%, ${clasp.highlight} 40%, ${clasp.color} 100%)`,
          boxShadow: '2px 2px 4px rgba(0,0,0,0.3), inset 1px 1px 2px rgba(255,255,255,0.3)',
        }}
      />

      {/* Animated clasp latch */}
      <motion.div
        className="relative w-8 origin-top"
        animate={{
          rotateX: isLocked ? 0 : -120,
        }}
        transition={{
          duration: 0.4,
          ease: [0.645, 0.045, 0.355, 1],
        }}
        style={{
          transformStyle: 'preserve-3d',
          perspective: '500px',
        }}
      >
        {/* Latch body */}
        <div
          className="w-8 h-10 rounded-b-md"
          style={{
            background: `linear-gradient(135deg, ${clasp.color} 0%, ${clasp.highlight} 40%, ${clasp.color} 100%)`,
            boxShadow: '2px 2px 4px rgba(0,0,0,0.3), inset 1px 1px 2px rgba(255,255,255,0.3)',
          }}
        >
          {/* Decorative keyhole */}
          <div className="absolute top-3 left-1/2 -translate-x-1/2 flex flex-col items-center">
            <div
              className="w-2 h-2 rounded-full"
              style={{ backgroundColor: 'rgba(0,0,0,0.3)' }}
            />
            <div
              className="w-1 h-2 rounded-b-sm -mt-0.5"
              style={{ backgroundColor: 'rgba(0,0,0,0.3)' }}
            />
          </div>
        </div>

        {/* Hook at bottom */}
        <div
          className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-6 h-3"
          style={{
            background: `linear-gradient(to bottom, ${clasp.color}, ${clasp.highlight})`,
            borderRadius: '0 0 4px 4px',
            boxShadow: '1px 2px 3px rgba(0,0,0,0.3)',
          }}
        />
      </motion.div>

      {/* Catch plate on book edge */}
      <div
        className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-7 h-4 rounded-sm"
        style={{
          background: `linear-gradient(to bottom, ${clasp.highlight}, ${clasp.color})`,
          boxShadow: 'inset 1px 1px 2px rgba(0,0,0,0.2)',
        }}
      />
    </div>
  );
}
