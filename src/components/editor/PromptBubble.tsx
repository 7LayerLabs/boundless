'use client';

import { motion } from 'framer-motion';
import { X, Lightbulb } from 'lucide-react';
import { cn } from '@/lib/utils/cn';

interface PromptBubbleProps {
  prompt: string;
  category?: string;
  onDismiss: () => void;
}

const categoryColors: Record<string, string> = {
  timeframe: 'bg-blue-50 border-blue-200',
  simple: 'bg-gray-50 border-gray-200',
  deep: 'bg-purple-50 border-purple-200',
  memories: 'bg-rose-50 border-rose-200',
  dreams: 'bg-indigo-50 border-indigo-200',
  selfCare: 'bg-green-50 border-green-200',
  gratitude: 'bg-amber-50 border-amber-200',
  reflection: 'bg-teal-50 border-teal-200',
  goals: 'bg-orange-50 border-orange-200',
  creativity: 'bg-pink-50 border-pink-200',
  emotions: 'bg-red-50 border-red-200',
  relationships: 'bg-cyan-50 border-cyan-200',
};

export function PromptBubble({ prompt, category, onDismiss }: PromptBubbleProps) {
  const colorClass = category && categoryColors[category]
    ? categoryColors[category]
    : 'bg-amber-50 border-amber-200';

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
          colorClass
        )}
      >
        {/* Speech bubble tail */}
        <div
          className={cn(
            'absolute -bottom-2 left-1/2 -translate-x-1/2',
            'w-4 h-4 rotate-45 border-r-2 border-b-2',
            colorClass
          )}
        />

        {/* Close button */}
        <button
          onClick={onDismiss}
          className="absolute top-2 right-2 p-1.5 rounded-full hover:bg-white/50 transition-colors"
        >
          <X className="w-4 h-4 text-gray-500" />
        </button>

        {/* Content */}
        <div className="flex items-start gap-3">
          <Lightbulb className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
          <div>
            {category && (
              <span className="text-xs text-gray-500 capitalize mb-1 block">
                {category}
              </span>
            )}
            <p className="text-gray-700 leading-relaxed text-sm font-medium">
              {prompt}
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
