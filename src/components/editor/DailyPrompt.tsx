'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Lightbulb, RefreshCw, X, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils/cn';
import { useSettings } from '@/hooks/useSettings';
import { fonts } from '@/constants/fonts';

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

interface DailyPromptProps {
  onUsePrompt: (prompt: string) => void;
}

export function DailyPrompt({ onUsePrompt }: DailyPromptProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [currentPrompt, setCurrentPrompt] = useState('');
  const [currentCategory, setCurrentCategory] = useState<keyof typeof defaultPrompts>('reflection');
  const { fontFamily, inkColor } = useSettings();
  const currentFont = fonts[fontFamily] || fonts.caveat;

  useEffect(() => {
    // Pick a random prompt on mount
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
    setIsExpanded(false);
  };

  return (
    <div className="relative">
      {/* Collapsed State - Small Icon Button */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className={cn(
          'p-2.5 rounded-xl transition-all',
          isExpanded
            ? 'bg-amber-500 text-white shadow-lg'
            : 'bg-amber-100 hover:bg-amber-200 text-amber-700'
        )}
        title="Writing Prompt"
      >
        <Lightbulb className="w-5 h-5" />
      </button>

      {/* Expanded State - Prompt Card */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: -10 }}
            className="absolute right-0 top-12 w-80 bg-white rounded-xl shadow-2xl border border-amber-100 overflow-hidden z-50"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-3 bg-amber-50 border-b border-amber-100">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-600" />
                <span className="text-sm font-medium text-amber-800">Writing Prompt</span>
              </div>
              <button
                onClick={() => setIsExpanded(false)}
                className="p-1 rounded hover:bg-amber-200 transition-colors"
              >
                <X className="w-4 h-4 text-amber-600" />
              </button>
            </div>

            {/* Category Pills */}
            <div className="flex flex-wrap gap-1 p-3 border-b border-gray-100">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => getRandomPrompt(cat)}
                  className={cn(
                    'px-2 py-1 rounded-full text-xs capitalize transition-colors',
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
            <div className="p-4">
              <p className={cn('text-lg text-gray-800 leading-relaxed', currentFont.className)}>
                {currentPrompt}
              </p>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2 p-3 bg-gray-50 border-t border-gray-100">
              <button
                onClick={() => getRandomPrompt()}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm text-gray-600 hover:bg-gray-200 transition-colors"
              >
                <RefreshCw className="w-4 h-4" />
                New Prompt
              </button>
              <button
                onClick={handleUsePrompt}
                className="flex-1 px-3 py-1.5 rounded-lg text-sm bg-amber-500 text-white hover:bg-amber-600 transition-colors"
              >
                Use This Prompt
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
