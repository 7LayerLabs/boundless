'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ChevronRight, 
  ChevronLeft, 
  BookOpen, 
  Sparkles, 
  Lock, 
  Palette,
  Target,
  Heart,
  Check
} from 'lucide-react';
import { cn } from '@/lib/utils/cn';
import { useSettings } from '@/hooks/useSettings';
import type { BindingColor, FontFamily, InkColor } from '@/types/settings';

interface OnboardingFlowProps {
  onComplete: () => void;
}

type OnboardingStep = 'welcome' | 'why' | 'customize' | 'features' | 'first-entry';

const BINDING_COLORS: { id: BindingColor; name: string; color: string }[] = [
  { id: 'brown', name: 'Classic Brown', color: '#5c3a21' },
  { id: 'black', name: 'Midnight Black', color: '#2c2c2c' },
  { id: 'burgundy', name: 'Deep Burgundy', color: '#722f37' },
  { id: 'forest', name: 'Forest Green', color: '#2d4a3e' },
  { id: 'navy', name: 'Navy Blue', color: '#1e3a5f' },
  { id: 'oxblood', name: 'Oxblood', color: '#4a0e0e' },
];

const FONT_OPTIONS: { id: FontFamily; name: string; sample: string }[] = [
  { id: 'caveat', name: 'Handwritten', sample: 'Your thoughts, beautifully written' },
  { id: 'garamond', name: 'Classic', sample: 'Your thoughts, beautifully written' },
  { id: 'merriweather', name: 'Modern', sample: 'Your thoughts, beautifully written' },
  { id: 'lora', name: 'Elegant', sample: 'Your thoughts, beautifully written' },
];

const INK_COLORS: { id: InkColor; name: string; color: string }[] = [
  { id: 'black', name: 'Black', color: '#1a1a1a' },
  { id: 'blue', name: 'Blue', color: '#1e3a5f' },
  { id: 'brown', name: 'Sepia', color: '#5c3d2e' },
  { id: 'green', name: 'Green', color: '#2d4a3e' },
];

const WHY_OPTIONS = [
  { emoji: '🧠', text: 'Process my thoughts and feelings' },
  { emoji: '🎯', text: 'Track goals and personal growth' },
  { emoji: '📖', text: 'Record memories and life stories' },
  { emoji: '🧘', text: 'Improve mental health and wellbeing' },
  { emoji: '✨', text: 'Spark creativity and ideas' },
  { emoji: '💭', text: 'Just want a space to write' },
];

export function OnboardingFlow({ onComplete }: OnboardingFlowProps) {
  const [currentStep, setCurrentStep] = useState<OnboardingStep>('welcome');
  const [selectedWhy, setSelectedWhy] = useState<string[]>([]);
  const [selectedBinding, setSelectedBinding] = useState<BindingColor>('brown');
  const [selectedFont, setSelectedFont] = useState<FontFamily>('caveat');
  const [selectedInk, setSelectedInk] = useState<InkColor>('black');
  const { updateSetting } = useSettings();

  const steps: OnboardingStep[] = ['welcome', 'why', 'customize', 'features', 'first-entry'];
  const currentIndex = steps.indexOf(currentStep);

  const nextStep = () => {
    const nextIndex = currentIndex + 1;
    if (nextIndex < steps.length) {
      setCurrentStep(steps[nextIndex]);
    }
  };

  const prevStep = () => {
    const prevIndex = currentIndex - 1;
    if (prevIndex >= 0) {
      setCurrentStep(steps[prevIndex]);
    }
  };

  const handleComplete = async () => {
    // Save all settings
    await updateSetting('bindingColor', selectedBinding);
    await updateSetting('fontFamily', selectedFont);
    await updateSetting('inkColor', selectedInk);
    if (selectedWhy.length > 0) {
      await updateSetting('journalWhy', selectedWhy.join(', '));
    }
    onComplete();
  };

  const toggleWhy = (why: string) => {
    setSelectedWhy((prev) =>
      prev.includes(why) ? prev.filter((w) => w !== why) : [...prev, why]
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 bg-gradient-to-br from-amber-50 via-orange-50 to-amber-100 flex items-center justify-center p-4"
    >
      {/* Paper texture overlay */}
      <div
        className="absolute inset-0 opacity-30 pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
        }}
      />

      <motion.div
        initial={{ scale: 0.95, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl overflow-hidden"
      >
        {/* Progress bar */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-amber-100">
          <motion.div
            className="h-full bg-gradient-to-r from-amber-500 to-orange-500"
            animate={{ width: `${((currentIndex + 1) / steps.length) * 100}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>

        <AnimatePresence mode="wait">
          {/* Welcome Step */}
          {currentStep === 'welcome' && (
            <motion.div
              key="welcome"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              className="p-8 md:p-12 text-center"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: 'spring' }}
                className="w-24 h-24 mx-auto mb-6 rounded-full bg-gradient-to-br from-amber-100 to-orange-100 flex items-center justify-center"
              >
                <BookOpen className="w-12 h-12 text-amber-600" />
              </motion.div>
              
              <h1 className="font-serif text-4xl md:text-5xl font-bold text-amber-900 mb-4">
                Welcome to Boundless
              </h1>
              
              <p className="text-lg text-amber-700 mb-8 max-w-md mx-auto">
                Your private space for reflection, growth, and self-discovery.
              </p>

              <div className="space-y-4 text-left max-w-sm mx-auto mb-8">
                {[
                  { icon: Lock, text: 'Your thoughts stay private' },
                  { icon: Sparkles, text: 'AI helps you reflect deeper' },
                  { icon: Heart, text: 'Build a meaningful habit' },
                ].map((item, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 + index * 0.1 }}
                    className="flex items-center gap-3"
                  >
                    <div className="w-10 h-10 rounded-full bg-amber-50 flex items-center justify-center">
                      <item.icon className="w-5 h-5 text-amber-600" />
                    </div>
                    <span className="text-amber-800">{item.text}</span>
                  </motion.div>
                ))}
              </div>

              <button
                onClick={nextStep}
                className="px-8 py-4 bg-gradient-to-r from-amber-600 to-orange-600 text-white font-medium rounded-xl hover:from-amber-700 hover:to-orange-700 transition-all shadow-lg hover:shadow-xl flex items-center gap-2 mx-auto"
              >
                Let's Get Started
                <ChevronRight className="w-5 h-5" />
              </button>
            </motion.div>
          )}

          {/* Why Step */}
          {currentStep === 'why' && (
            <motion.div
              key="why"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              className="p-8 md:p-12"
            >
              <div className="text-center mb-8">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-amber-100 flex items-center justify-center">
                  <Target className="w-8 h-8 text-amber-600" />
                </div>
                <h2 className="font-serif text-3xl font-bold text-amber-900 mb-2">
                  Why do you want to journal?
                </h2>
                <p className="text-amber-600">Select all that apply — this helps us personalize your experience</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-8">
                {WHY_OPTIONS.map((option) => (
                  <button
                    key={option.text}
                    onClick={() => toggleWhy(option.text)}
                    className={cn(
                      'p-4 rounded-xl border-2 text-left transition-all flex items-center gap-3',
                      selectedWhy.includes(option.text)
                        ? 'border-amber-500 bg-amber-50'
                        : 'border-amber-200 hover:border-amber-300 bg-white'
                    )}
                  >
                    <span className="text-2xl">{option.emoji}</span>
                    <span className="text-amber-800">{option.text}</span>
                    {selectedWhy.includes(option.text) && (
                      <Check className="w-5 h-5 text-amber-600 ml-auto" />
                    )}
                  </button>
                ))}
              </div>

              <div className="flex justify-between">
                <button
                  onClick={prevStep}
                  className="flex items-center gap-2 px-6 py-3 text-amber-600 hover:bg-amber-50 rounded-xl transition-colors"
                >
                  <ChevronLeft className="w-5 h-5" />
                  Back
                </button>
                <button
                  onClick={nextStep}
                  className="flex items-center gap-2 px-6 py-3 bg-amber-600 text-white rounded-xl hover:bg-amber-700 transition-colors"
                >
                  Continue
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </motion.div>
          )}

          {/* Customize Step */}
          {currentStep === 'customize' && (
            <motion.div
              key="customize"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              className="p-8 md:p-12"
            >
              <div className="text-center mb-8">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-amber-100 flex items-center justify-center">
                  <Palette className="w-8 h-8 text-amber-600" />
                </div>
                <h2 className="font-serif text-3xl font-bold text-amber-900 mb-2">
                  Make it yours
                </h2>
                <p className="text-amber-600">Choose your journal's look and feel</p>
              </div>

              {/* Binding color */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-amber-800 mb-3">
                  Journal Cover
                </label>
                <div className="flex gap-3 flex-wrap">
                  {BINDING_COLORS.map((binding) => (
                    <button
                      key={binding.id}
                      onClick={() => setSelectedBinding(binding.id)}
                      className={cn(
                        'w-12 h-16 rounded-lg transition-all',
                        selectedBinding === binding.id
                          ? 'ring-2 ring-amber-500 ring-offset-2 scale-110'
                          : 'hover:scale-105'
                      )}
                      style={{ backgroundColor: binding.color }}
                      title={binding.name}
                    />
                  ))}
                </div>
              </div>

              {/* Font style */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-amber-800 mb-3">
                  Writing Style
                </label>
                <div className="grid grid-cols-2 gap-3">
                  {FONT_OPTIONS.map((font) => (
                    <button
                      key={font.id}
                      onClick={() => setSelectedFont(font.id)}
                      className={cn(
                        'p-4 rounded-xl border-2 text-left transition-all',
                        selectedFont === font.id
                          ? 'border-amber-500 bg-amber-50'
                          : 'border-amber-200 hover:border-amber-300'
                      )}
                    >
                      <p className="text-sm text-amber-600 mb-1">{font.name}</p>
                      <p
                        className="text-amber-900"
                        style={{
                          fontFamily: font.id === 'caveat' ? 'Caveat, cursive' :
                                     font.id === 'garamond' ? 'EB Garamond, serif' :
                                     font.id === 'merriweather' ? 'Merriweather, serif' :
                                     'Lora, serif'
                        }}
                      >
                        {font.sample}
                      </p>
                    </button>
                  ))}
                </div>
              </div>

              {/* Ink color */}
              <div className="mb-8">
                <label className="block text-sm font-medium text-amber-800 mb-3">
                  Ink Color
                </label>
                <div className="flex gap-4">
                  {INK_COLORS.map((ink) => (
                    <button
                      key={ink.id}
                      onClick={() => setSelectedInk(ink.id)}
                      className={cn(
                        'flex items-center gap-2 px-4 py-2 rounded-lg border-2 transition-all',
                        selectedInk === ink.id
                          ? 'border-amber-500 bg-amber-50'
                          : 'border-amber-200 hover:border-amber-300'
                      )}
                    >
                      <span
                        className="w-4 h-4 rounded-full"
                        style={{ backgroundColor: ink.color }}
                      />
                      <span className="text-sm text-amber-800">{ink.name}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex justify-between">
                <button
                  onClick={prevStep}
                  className="flex items-center gap-2 px-6 py-3 text-amber-600 hover:bg-amber-50 rounded-xl transition-colors"
                >
                  <ChevronLeft className="w-5 h-5" />
                  Back
                </button>
                <button
                  onClick={nextStep}
                  className="flex items-center gap-2 px-6 py-3 bg-amber-600 text-white rounded-xl hover:bg-amber-700 transition-colors"
                >
                  Continue
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </motion.div>
          )}

          {/* Features Step */}
          {currentStep === 'features' && (
            <motion.div
              key="features"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              className="p-8 md:p-12"
            >
              <div className="text-center mb-8">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-amber-100 flex items-center justify-center">
                  <Sparkles className="w-8 h-8 text-amber-600" />
                </div>
                <h2 className="font-serif text-3xl font-bold text-amber-900 mb-2">
                  What you can do
                </h2>
                <p className="text-amber-600">Here are some ways to make the most of Boundless</p>
              </div>

              <div className="space-y-4 mb-8">
                {[
                  {
                    emoji: '📝',
                    title: 'Write freely',
                    description: 'Open your journal anytime and let your thoughts flow',
                  },
                  {
                    emoji: '😊',
                    title: 'Track your mood',
                    description: 'See patterns in how you feel over time',
                  },
                  {
                    emoji: '🧭',
                    title: 'Follow guided programs',
                    description: '42 journeys for growth, creativity, and self-discovery',
                  },
                  {
                    emoji: '✨',
                    title: 'Get AI reflections',
                    description: 'Questions that help you explore your thoughts deeper',
                  },
                  {
                    emoji: '🔥',
                    title: 'Build streaks',
                    description: 'Track your writing habit and reach milestones',
                  },
                ].map((feature, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-start gap-4 p-4 bg-amber-50 rounded-xl"
                  >
                    <span className="text-2xl">{feature.emoji}</span>
                    <div>
                      <p className="font-medium text-amber-900">{feature.title}</p>
                      <p className="text-sm text-amber-600">{feature.description}</p>
                    </div>
                  </motion.div>
                ))}
              </div>

              <div className="flex justify-between">
                <button
                  onClick={prevStep}
                  className="flex items-center gap-2 px-6 py-3 text-amber-600 hover:bg-amber-50 rounded-xl transition-colors"
                >
                  <ChevronLeft className="w-5 h-5" />
                  Back
                </button>
                <button
                  onClick={nextStep}
                  className="flex items-center gap-2 px-6 py-3 bg-amber-600 text-white rounded-xl hover:bg-amber-700 transition-colors"
                >
                  Almost there!
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </motion.div>
          )}

          {/* First Entry Step */}
          {currentStep === 'first-entry' && (
            <motion.div
              key="first-entry"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              className="p-8 md:p-12 text-center"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', delay: 0.2 }}
                className="w-24 h-24 mx-auto mb-6 rounded-full bg-gradient-to-br from-green-100 to-emerald-100 flex items-center justify-center"
              >
                <Check className="w-12 h-12 text-green-600" />
              </motion.div>

              <h2 className="font-serif text-3xl font-bold text-amber-900 mb-4">
                You're all set!
              </h2>
              
              <p className="text-lg text-amber-700 mb-8 max-w-md mx-auto">
                Your journal is ready. Start with a simple prompt, or just write whatever's on your mind.
              </p>

              <div className="bg-amber-50 rounded-xl p-6 mb-8 text-left max-w-md mx-auto">
                <p className="text-sm text-amber-600 mb-2">Try starting with:</p>
                <p className="font-serif text-lg text-amber-900 italic">
                  "Right now, I'm feeling..."
                </p>
              </div>

              <div className="space-y-3">
                <button
                  onClick={handleComplete}
                  className="w-full max-w-md mx-auto flex items-center justify-center gap-2 px-8 py-4 bg-gradient-to-r from-amber-600 to-orange-600 text-white font-medium rounded-xl hover:from-amber-700 hover:to-orange-700 transition-all shadow-lg hover:shadow-xl"
                >
                  <BookOpen className="w-5 h-5" />
                  Open My Journal
                </button>
                
                <p className="text-sm text-amber-500">
                  You can always change settings later
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Step indicators */}
        <div className="flex justify-center gap-2 pb-6">
          {steps.map((step, index) => (
            <div
              key={step}
              className={cn(
                'w-2 h-2 rounded-full transition-all',
                index <= currentIndex ? 'bg-amber-500' : 'bg-amber-200'
              )}
            />
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
}
