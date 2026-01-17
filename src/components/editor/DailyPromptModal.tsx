'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Lightbulb, RefreshCw, X, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils/cn';
import { useSettings } from '@/hooks/useSettings';
import { fonts } from '@/constants/fonts';
import { analytics } from '@/components/providers/PostHogProvider';

// Default prompts organized by category
const defaultPrompts = {
  timeframe: [
    "What happened today that you want to remember?",
    "How did today compare to yesterday?",
    "What was the highlight of your week?",
    "What challenged you this week?",
    "What's something from this month you're proud of?",
    "What surprised you recently?",
    "How are you feeling compared to last week?",
    "What's something you accomplished this week?",
    "What conversation stuck with you today?",
    "What did you learn this week?",
    "How has your mood shifted this month?",
    "What's been on repeat in your mind lately?",
  ],
  simple: [
    "What's on your mind?",
    "How are you feeling right now?",
    "What's one word to describe your day?",
    "What did you eat today?",
    "What's the weather like and how does it make you feel?",
    "What song is stuck in your head?",
    "What are you looking forward to?",
  ],
  deep: [
    "What gives your life meaning?",
    "What would you tell your younger self?",
    "What do you believe that most people don't?",
    "If today was your last day, what would you regret not doing?",
    "What part of yourself do you hide from others?",
    "What would you do if no one was watching?",
    "What truth have you been avoiding?",
  ],
  memories: [
    "Describe a moment that changed you.",
    "What's your earliest happy memory?",
    "What's a small moment you'll never forget?",
    "Who from your past do you think about often?",
    "What's a lesson you learned the hard way?",
    "Describe a place from your childhood.",
    "What's a conversation that stuck with you?",
  ],
  dreams: [
    "What does your ideal life look like?",
    "What adventure do you want to have?",
    "If money wasn't a factor, what would you do?",
    "What's a dream you've never told anyone?",
    "Where do you want to be in 10 years?",
    "What legacy do you want to leave behind?",
    "What would you create if you had no limitations?",
  ],
  selfCare: [
    "What do you need right now?",
    "How can you be kinder to yourself today?",
    "What's draining your energy lately?",
    "When did you last do something just for you?",
    "What would help you feel more at peace?",
    "What are you proud of yourself for?",
    "How can you rest more intentionally?",
  ],
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

export interface PromptSelection {
  prompt: string;
  category: string;
}

interface DailyPromptModalProps {
  onClose: () => void;
  onUsePrompt: (selection: PromptSelection) => void;
}

export function DailyPromptModal({ onClose, onUsePrompt }: DailyPromptModalProps) {
  const [currentPrompts, setCurrentPrompts] = useState<string[]>([]);
  const [currentCategory, setCurrentCategory] = useState<keyof typeof defaultPrompts>('gratitude');
  const { fontFamily } = useSettings();
  const currentFont = fonts[fontFamily] || fonts.caveat;

  // Get 3 random prompts from a category
  const getRandomPrompts = (category: keyof typeof defaultPrompts) => {
    const prompts = [...defaultPrompts[category]];
    const selected: string[] = [];

    // Pick up to 3 random prompts (or all if category has fewer)
    const count = Math.min(3, prompts.length);
    for (let i = 0; i < count; i++) {
      const randomIndex = Math.floor(Math.random() * prompts.length);
      selected.push(prompts[randomIndex]);
      prompts.splice(randomIndex, 1);
    }

    setCurrentPrompts(selected);
    setCurrentCategory(category);
  };

  // Initialize with gratitude category
  useEffect(() => {
    getRandomPrompts('gratitude');
  }, []);

  const handleSelectCategory = (category: keyof typeof defaultPrompts) => {
    getRandomPrompts(category);
  };

  const handleShuffle = () => {
    getRandomPrompts(currentCategory);
  };

  const handleUsePrompt = (prompt: string) => {
    analytics.promptUsed(currentCategory);
    onUsePrompt({ prompt, category: currentCategory });
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
              onClick={() => handleSelectCategory(cat)}
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

        {/* Category Header with Shuffle */}
        <div className="flex items-center justify-between px-6 pt-4 pb-2">
          <span className="text-sm font-medium text-gray-500 capitalize">
            {currentCategory} prompts
          </span>
          <button
            onClick={handleShuffle}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm text-amber-600 hover:bg-amber-50 transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
            Shuffle
          </button>
        </div>

        {/* 3 Prompt Cards */}
        <div className="px-6 pb-6 space-y-3">
          {currentPrompts.map((prompt, index) => (
            <motion.button
              key={`${currentCategory}-${index}-${prompt.slice(0, 20)}`}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              onClick={() => handleUsePrompt(prompt)}
              className={cn(
                'w-full p-4 rounded-xl border-2 text-left transition-all',
                'bg-gradient-to-br from-amber-50 to-white border-amber-200',
                'hover:border-amber-400 hover:shadow-md hover:scale-[1.01]',
                'cursor-pointer group'
              )}
            >
              <div className="flex items-start gap-3">
                <Lightbulb className="w-5 h-5 text-amber-500 flex-shrink-0 mt-1 group-hover:scale-110 transition-transform" />
                <p className={cn('text-lg text-gray-800 leading-relaxed', currentFont.className)}>
                  {prompt}
                </p>
              </div>
            </motion.button>
          ))}
        </div>

        {/* Footer hint */}
        <div className="px-6 pb-4">
          <p className="text-xs text-gray-400 text-center">
            Click a prompt to use it
          </p>
        </div>
      </motion.div>
    </motion.div>
  );
}
