'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Lightbulb, RefreshCw, X, Sparkles, ChevronLeft, List } from 'lucide-react';
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
    "What made you laugh today?",
    "What was the most unexpected part of your day?",
    "What decision did you make today that felt right?",
    "How did you spend your morning compared to your evening?",
    "What's different about this week compared to last month?",
    "What moment today would you want to relive?",
    "What did you notice today that you usually overlook?",
    "How has your energy changed throughout this week?",
    "What's something you did today for the first time?",
    "What patterns have you noticed in yourself this month?",
    "What was the best thing someone said to you today?",
    "How did today shape your plans for tomorrow?",
    "What's something this week that you want to do again?",
  ],
  simple: [
    "What's on your mind?",
    "How are you feeling right now?",
    "What's one word to describe your day?",
    "What did you eat today?",
    "What's the weather like and how does it make you feel?",
    "What song is stuck in your head?",
    "What are you looking forward to?",
    "What's the first thing you thought about this morning?",
    "What are you wearing and why did you choose it?",
    "What sounds can you hear right now?",
    "What's in your line of sight at this moment?",
    "What did you drink today?",
    "How many hours did you sleep last night?",
    "What's the last thing that made you smile?",
    "What's something small that annoyed you today?",
    "What time did you wake up and how did you feel?",
    "What's the temperature where you are?",
    "What's the last text message you sent?",
    "What's playing in the background right now?",
    "What are you procrastinating on?",
    "What's the last photo you took?",
    "What did you have for breakfast?",
    "What's the view from your window?",
    "Who was the last person you talked to?",
    "What's something you bought recently?",
  ],
  deep: [
    "What gives your life meaning?",
    "What would you tell your younger self?",
    "What do you believe that most people don't?",
    "If today was your last day, what would you regret not doing?",
    "What part of yourself do you hide from others?",
    "What would you do if no one was watching?",
    "What truth have you been avoiding?",
    "What are you most afraid of and why?",
    "What do you think happens after we die?",
    "What's the hardest thing you've ever had to accept?",
    "If you could change one decision from your past, would you?",
    "What makes you feel truly understood?",
    "What do you think your purpose is?",
    "What would you sacrifice everything for?",
    "What's the most important lesson life has taught you?",
    "Who has shaped who you are more than anyone else?",
    "What do you want to be remembered for?",
    "What's the difference between who you are and who you pretend to be?",
    "What would it take for you to feel truly fulfilled?",
    "What question do you wish someone would ask you?",
    "What's something you've never forgiven yourself for?",
    "What does unconditional love mean to you?",
    "What would you do differently if you could live your life over?",
    "What have you lost that still affects you today?",
    "What does it mean to live a good life?",
  ],
  memories: [
    "Describe a moment that changed you.",
    "What's your earliest happy memory?",
    "What's a small moment you'll never forget?",
    "Who from your past do you think about often?",
    "What's a lesson you learned the hard way?",
    "Describe a place from your childhood.",
    "What's a conversation that stuck with you?",
    "What's your favorite memory with a grandparent or elder?",
    "Describe the home you grew up in.",
    "What was your favorite toy or possession as a child?",
    "What's a family tradition you remember fondly?",
    "Who was your best friend growing up and where are they now?",
    "What's the bravest thing you ever did?",
    "Describe a meal that holds special meaning to you.",
    "What's a trip or vacation you'll always remember?",
    "What was your favorite hiding spot as a kid?",
    "Describe a teacher who made a difference in your life.",
    "What's a smell that instantly takes you back?",
    "What was your first job and what did it teach you?",
    "Describe a moment when you felt truly proud of yourself.",
    "What's a song that reminds you of a specific time in your life?",
    "What's your earliest memory of feeling loved?",
    "What's a book that changed your perspective?",
    "Describe a birthday you'll never forget.",
    "What's a photograph that tells an important story?",
  ],
  dreams: [
    "What does your ideal life look like?",
    "What adventure do you want to have?",
    "If money wasn't a factor, what would you do?",
    "What's a dream you've never told anyone?",
    "Where do you want to be in 10 years?",
    "What legacy do you want to leave behind?",
    "What would you create if you had no limitations?",
    "What country or place do you dream of visiting?",
    "What would your dream home look like?",
    "What career would you pursue if you could start over?",
    "What skill do you wish you had mastered?",
    "What does your ideal morning routine look like?",
    "If you could live in any era, when would it be?",
    "What's something wild you want to try before you die?",
    "What would you do if you won the lottery tomorrow?",
    "Who would you want to meet, living or dead?",
    "What does retirement look like in your dreams?",
    "What business would you start if you knew it would succeed?",
    "What's a cause you'd dedicate your life to?",
    "Where would you live if you could live anywhere?",
    "What would you want written on your tombstone?",
    "What does your perfect weekend look like?",
    "What talent do you wish you were born with?",
    "What would your ideal relationship look like?",
    "What experience would you pay any amount of money for?",
  ],
  selfCare: [
    "What do you need right now?",
    "How can you be kinder to yourself today?",
    "What's draining your energy lately?",
    "When did you last do something just for you?",
    "What would help you feel more at peace?",
    "What are you proud of yourself for?",
    "How can you rest more intentionally?",
    "What boundaries do you need to protect your peace?",
    "What's one thing you can let go of today?",
    "How have you been sleeping lately?",
    "What self-care practice have you been neglecting?",
    "What would your body thank you for doing today?",
    "What negative self-talk do you need to release?",
    "How can you move your body in a way that feels good?",
    "What's one small comfort you can give yourself right now?",
    "When do you feel most relaxed?",
    "What's something you've been putting off that would feel good to complete?",
    "How can you nourish yourself better this week?",
    "What permission do you need to give yourself?",
    "What's one thing you can say no to this week?",
    "How can you make tomorrow morning easier for yourself?",
    "What brings you comfort when you're struggling?",
    "What's one way you can slow down today?",
    "What activity helps you recharge the most?",
    "What would you do if you had a whole day to yourself?",
  ],
  gratitude: [
    "What are three things you're grateful for today?",
    "Who made a positive impact on your life recently?",
    "What simple pleasure brought you joy today?",
    "What challenge are you grateful for overcoming?",
    "What skill or ability are you thankful to have?",
    "What's something in your home you're grateful for?",
    "What part of your body are you thankful for?",
    "What technology are you grateful exists?",
    "What's a small convenience you often take for granted?",
    "Who in your life always shows up for you?",
    "What's something beautiful you saw recently?",
    "What food are you grateful to have access to?",
    "What memory are you thankful for?",
    "What's something about your job or work you appreciate?",
    "What freedom do you have that others might not?",
    "What's a lesson you're grateful to have learned?",
    "What opportunity are you thankful for?",
    "Who has believed in you when you didn't believe in yourself?",
    "What's something from nature you're grateful for?",
    "What about today specifically are you thankful for?",
    "What's a book, show, or song you're grateful exists?",
    "What comfort or luxury would past-you be amazed you have?",
    "What mistake are you grateful for because of what it taught you?",
    "What stranger has shown you unexpected kindness?",
    "What place are you grateful to have visited or lived in?",
  ],
  reflection: [
    "What did you learn about yourself today?",
    "What would you do differently if you could relive today?",
    "What's something you've been avoiding? Why?",
    "How are you different from who you were a year ago?",
    "What fear is holding you back right now?",
    "What pattern in your life would you like to change?",
    "What's working well in your life right now?",
    "What's not working that you've been tolerating?",
    "What advice would you give yourself right now?",
    "How aligned are your actions with your values?",
    "What's a belief you've changed your mind about?",
    "What role do you play that doesn't feel authentic?",
    "What are you most proud of this year?",
    "What's something you need to accept?",
    "How do you typically respond to stress?",
    "What's a strength you don't give yourself credit for?",
    "What's a weakness you've been working on?",
    "When do you feel most like yourself?",
    "What's a hard truth you've had to face?",
    "How do you handle disappointment?",
    "What story do you tell yourself that might not be true?",
    "What would your best friend say is your best quality?",
    "What have you outgrown that you're still holding onto?",
    "What does your current struggle reveal about what you value?",
    "How has your definition of success changed over time?",
  ],
  goals: [
    "What's one small step you can take toward your biggest goal?",
    "Where do you see yourself in five years?",
    "What habit would you like to build or break?",
    "What would you attempt if you knew you couldn't fail?",
    "What does success look like to you?",
    "What goal have you been putting off starting?",
    "What's standing between you and what you want?",
    "What's a goal you achieved that once seemed impossible?",
    "What would make this year a success?",
    "What skill do you want to develop this month?",
    "What's a goal you've outgrown?",
    "How can you break your biggest goal into smaller pieces?",
    "What's one thing you can do today to move forward?",
    "Who can help you achieve your goals?",
    "What goal scares you the most?",
    "What would you regret not trying?",
    "What deadline do you need to set for yourself?",
    "What resources do you need to reach your goal?",
    "What's a goal you're working on that excites you?",
    "How will you celebrate when you achieve your next goal?",
    "What's something you want to learn this year?",
    "What would achieving your biggest goal change about your life?",
    "What goal would you set if you had unlimited resources?",
    "What's a goal you've given up on that deserves another try?",
    "What's the next milestone you're working toward?",
  ],
  creativity: [
    "If you could have dinner with anyone, who would it be and why?",
    "Describe your perfect day from start to finish.",
    "What would you do with an extra hour each day?",
    "If you could master any skill instantly, what would it be?",
    "Write about a place that feels like home to you.",
    "If you were a color, what would you be and why?",
    "What would you name your autobiography?",
    "If you could time travel, where and when would you go?",
    "What fictional world would you want to live in?",
    "If you could have any superpower, what would it be?",
    "Describe a stranger you noticed today and imagine their story.",
    "What invention do you wish existed?",
    "If your life was a movie, what genre would it be?",
    "What would you do if you were invisible for a day?",
    "Write a letter to your future self.",
    "If you could only eat one meal forever, what would it be?",
    "What three items would you bring to a deserted island?",
    "If you could witness any historical event, what would it be?",
    "What would you do if you had a clone for a week?",
    "Describe your dream vacation in vivid detail.",
    "If animals could talk, which would you want to have a conversation with?",
    "What would you put in a time capsule for someone to open in 100 years?",
    "If you could swap lives with anyone for a day, who would it be?",
    "What would you build if you had unlimited materials?",
    "If you could create a holiday, what would it celebrate?",
  ],
  emotions: [
    "What emotion have you felt most strongly today?",
    "What's weighing on your mind right now?",
    "When did you last feel truly at peace?",
    "What makes you feel most alive?",
    "What are you excited or nervous about?",
    "What triggered your strongest reaction today?",
    "How do you feel about the current season of your life?",
    "What emotion do you try to avoid feeling?",
    "When did you last cry and why?",
    "What makes you feel safe?",
    "What's making you anxious right now?",
    "When did you last feel genuinely happy?",
    "What are you angry about that you haven't expressed?",
    "What brings you the most joy?",
    "How do you feel about getting older?",
    "What emotion do you wish you felt more often?",
    "What's something that always makes you emotional?",
    "How do you typically process difficult emotions?",
    "What's an emotion you don't let yourself feel often enough?",
    "When do you feel most vulnerable?",
    "What's bringing you peace right now?",
    "How do you feel about where you are in life?",
    "What emotion surprised you today?",
    "What's something you're secretly hopeful about?",
    "What feeling have you been suppressing lately?",
  ],
  relationships: [
    "Who do you need to reconnect with?",
    "What qualities do you value most in your closest relationships?",
    "How can you show appreciation for someone today?",
    "What boundaries do you need to set or maintain?",
    "Describe a meaningful conversation you had recently.",
    "Who has had the biggest influence on who you are?",
    "What relationship in your life needs more attention?",
    "Who do you feel most yourself around?",
    "What's something you wish you could tell someone but haven't?",
    "How have your friendships changed over the years?",
    "Who do you admire and why?",
    "What's a relationship you're grateful for?",
    "Who challenges you to be better?",
    "What do you wish people understood about you?",
    "How do you show love to the people you care about?",
    "What relationship has taught you the most about yourself?",
    "Who do you need to forgive?",
    "What makes you feel connected to others?",
    "Who would you call in an emergency?",
    "What's a friendship that has stood the test of time?",
    "How do you handle conflict in relationships?",
    "Who makes you feel truly seen and heard?",
    "What's the best advice someone has given you about relationships?",
    "Who from your past do you wish you could thank?",
    "What's one way you could be a better friend, partner, or family member?",
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
  const [showAllPrompts, setShowAllPrompts] = useState(false);
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
    setShowAllPrompts(false);
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
        <div className="flex items-center justify-between p-4 bg-amber-50 border-b border-amber-100">
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

        <AnimatePresence mode="wait">
          {!showAllPrompts ? (
            <motion.div
              key="random-prompts"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
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
                      'bg-amber-50 border-amber-200',
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

              {/* Footer hint with See All button */}
              <div className="px-6 pb-4 flex items-center justify-between">
                <p className="text-xs text-gray-400">
                  Click a prompt to use it
                </p>
                <button
                  onClick={() => setShowAllPrompts(true)}
                  className="flex items-center gap-1.5 text-xs text-amber-600 hover:text-amber-700 transition-colors"
                >
                  <List className="w-3.5 h-3.5" />
                  See all {defaultPrompts[currentCategory].length} prompts
                </button>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="all-prompts"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              {/* Back button */}
              <div className="px-6 pt-2 pb-3">
                <button
                  onClick={() => setShowAllPrompts(false)}
                  className="flex items-center gap-1 text-sm text-amber-600 hover:text-amber-700 transition-colors"
                >
                  <ChevronLeft className="w-4 h-4" />
                  Back to suggestions
                </button>
              </div>

              {/* All Prompts List */}
              <div className="px-6 pb-6 max-h-[400px] overflow-y-auto space-y-2">
                {defaultPrompts[currentCategory].map((prompt, index) => (
                  <motion.button
                    key={`all-${currentCategory}-${index}`}
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.02 }}
                    onClick={() => handleUsePrompt(prompt)}
                    className={cn(
                      'w-full p-3 rounded-lg border text-left transition-all',
                      'bg-white border-gray-200',
                      'hover:border-amber-300 hover:bg-amber-50',
                      'cursor-pointer group'
                    )}
                  >
                    <div className="flex items-start gap-2">
                      <span className="text-xs text-gray-400 mt-0.5 w-5 flex-shrink-0">{index + 1}.</span>
                      <p className={cn('text-base text-gray-700 leading-relaxed', currentFont.className)}>
                        {prompt}
                      </p>
                    </div>
                  </motion.button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
}
