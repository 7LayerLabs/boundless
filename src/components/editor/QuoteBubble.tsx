'use client';

import { motion } from 'framer-motion';
import { X, Quote } from 'lucide-react';
import { cn } from '@/lib/utils/cn';
import type { Quote as QuoteType } from '@/constants/quotes';

interface QuoteBubbleProps {
  quote: QuoteType;
  onDismiss: () => void;
}

export function QuoteBubble({ quote, onDismiss }: QuoteBubbleProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -20, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -20, scale: 0.9 }}
      transition={{ type: 'spring', damping: 20, stiffness: 300 }}
      className={cn(
        'absolute top-4 left-1/2 -translate-x-1/2 z-40',
        'max-w-md w-full mx-4'
      )}
    >
      <div
        className={cn(
          'relative rounded-2xl border-2 shadow-lg',
          'p-4 pr-10',
          'bg-neutral-50 border-neutral-200'
        )}
      >
        {/* Speech bubble tail */}
        <div
          className={cn(
            'absolute -bottom-2 left-1/2 -translate-x-1/2',
            'w-4 h-4 rotate-45 border-r-2 border-b-2',
            'bg-neutral-50 border-neutral-200'
          )}
        />

        {/* Close button */}
        <button
          onClick={onDismiss}
          className="absolute top-2 right-2 p-1.5 rounded-full hover:bg-neutral-200/50 transition-colors"
        >
          <X className="w-4 h-4 text-neutral-500" />
        </button>

        {/* Content */}
        <div className="flex items-start gap-3">
          <Quote className="w-5 h-5 text-neutral-400 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-neutral-700 leading-relaxed text-sm font-medium italic">
              "{quote.text}"
            </p>
            <p className="text-xs text-neutral-500 mt-1">
              — {quote.author}
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
