'use client';

import { motion } from 'framer-motion';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils/cn';
import type { ReflectionQuestion } from './AIReflection';

interface ThoughtBubbleProps {
  question: ReflectionQuestion;
  onDismiss: () => void;
}

export function ThoughtBubble({ question, onDismiss }: ThoughtBubbleProps) {
  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'emotion': return '💭';
      case 'insight': return '💡';
      case 'action': return '🎯';
      case 'connection': return '🔗';
      default: return '✨';
    }
  };

  const getTypeGradient = (type: string) => {
    switch (type) {
      case 'emotion': return 'from-pink-100 to-pink-50 border-pink-200';
      case 'insight': return 'from-amber-100 to-amber-50 border-amber-200';
      case 'action': return 'from-green-100 to-green-50 border-green-200';
      case 'connection': return 'from-blue-100 to-blue-50 border-blue-200';
      default: return 'from-purple-100 to-purple-50 border-purple-200';
    }
  };

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
          'relative bg-gradient-to-br rounded-2xl border-2 shadow-lg',
          'p-4 pr-10',
          getTypeGradient(question.type)
        )}
      >
        {/* Speech bubble tail */}
        <div
          className={cn(
            'absolute -bottom-2 left-1/2 -translate-x-1/2',
            'w-4 h-4 rotate-45 border-r-2 border-b-2',
            'bg-gradient-to-br',
            getTypeGradient(question.type)
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
          <span className="text-2xl flex-shrink-0">{getTypeIcon(question.type)}</span>
          <p className="text-gray-700 leading-relaxed text-sm font-medium">
            {question.question}
          </p>
        </div>
      </div>
    </motion.div>
  );
}
