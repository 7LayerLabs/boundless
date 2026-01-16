'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Lightbulb, RefreshCw, X, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils/cn';
import { useSettings } from '@/hooks/useSettings';
import { fonts } from '@/constants/fonts';

// Default prompts organized by category
const defaultPrompts = {
  gratitude: [
    "What are three things you're grateful for today?",
    "Who made a positive impact on your life recently?",
    "What simple pleasure brought you joy today?",
    "What challenge are you grateful for overcoming?",
    "What skill or ability are you thankful to have?",
  ],
  reflection: [
    "What did you learn about yourself today?",
    "What would you do differently if you could relive today?",
    "What's something you've been avoiding? Why?",
    "How are you different from who you were a year ago?",
    "What fear is holding you back right now?",
  ],
  goals: [
    "What's one small step you can take toward your biggest goal?",
    "Where do you see yourself in five years?",
    "What habit would you like to build or break?",
    "What would you attempt if you knew you couldn't fail?",
    "What does success look like to you?",
  ],
  creativity: [
    "If you could have dinner with anyone, who would it be and why?",
    "Describe your perfect day from start to finish.",
    "What would you do with an extra hour each day?",
    "If you could master any skill instantly, what would it be?",
    "Write about a place that feels like home to you.",
  ],
  emotions: [
    "What emotion have you felt most strongly today?",
    "What's weighing on your mind right now?",
    "When did you last feel truly at peace?",
    "What makes you feel most alive?",
    "What are you excited or nervous about?",
  ],
  relationships: [
    "Who do you need to reconnect with?",
    "What qualities do you value most in your closest relationships?",
    "How can you show appreciation for someone today?",
    "What boundaries do you need to set or maintain?",
    "Describe a meaningful conversation you had recently.",
  ],
};

const categories = Object.keys(defaultPrompts) as (keyof typeof defaultPrompts)[];

interface DailyPromptModalProps {
  onClose: () => void;
  onUsePrompt: (prompt: string) => void;
}

export function DailyPromptModal({ onClose, onUsePrompt }: DailyPromptModalProps) {
  const [currentPrompt, setCurrentPrompt] = useState('');
  const [currentCategory, setCurrentCategory] = useState<keyof typeof defaultPrompts>('reflection');
  const { fontFamily } = useSettings();
  const currentFont = fonts[fontFamily] || fonts.caveat;

  useEffect(() => {
    getRandomPrompt();
  }, []);

  const getRandomPrompt = (category?: keyof typeof defaultPrompts) => {
    const cat = category || categories[Math.floor(Math.random() * categories.length)];
    const prompts = defaultPrompts[cat];
    const prompt = prompts[Math.floor(Math.random() * prompts.length)];
    setCurrentPrompt(prompt);
    setCurrentCategory(cat);
  };

  const handleUsePrompt = () => {
    onUsePrompt(currentPrompt);
    onClose();
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
        className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 bg-gradient-to-r from-amber-50 to-amber-100 border-b border-amber-100">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-amber-600" />
            <span className="font-semibold text-amber-800">Writing Prompt</span>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-amber-200 transition-colors"
          >
            <X className="w-5 h-5 text-amber-600" />
          </button>
        </div>

        {/* Category Pills */}
        <div className="flex flex-wrap gap-2 p-4 border-b border-gray-100">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => getRandomPrompt(cat)}
              className={cn(
                'px-3 py-1.5 rounded-full text-sm capitalize transition-colors',
                currentCategory === cat
                  ? 'bg-amber-500 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              )}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Prompt Text */}
        <div className="p-6">
          <div className="flex items-start gap-3 mb-4">
            <Lightbulb className="w-6 h-6 text-amber-500 flex-shrink-0 mt-1" />
            <p className={cn('text-xl text-gray-800 leading-relaxed', currentFont.className)}>
              {currentPrompt}
            </p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3 p-4 bg-gray-50 border-t border-gray-100">
          <button
            onClick={() => getRandomPrompt()}
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-gray-600 hover:bg-gray-200 transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
            New Prompt
          </button>
          <button
            onClick={handleUsePrompt}
            className="flex-1 px-4 py-2 rounded-lg bg-amber-500 text-white font-medium hover:bg-amber-600 transition-colors"
          >
            Use This Prompt
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}
