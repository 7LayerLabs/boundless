'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { X, Pen, Check, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils/cn';
import { useSettings } from '@/hooks/useSettings';
import { fonts } from '@/constants/fonts';
import { pageColors, inkColors } from '@/constants/themes';

interface WhyPageProps {
  onClose: () => void;
}

const writingIdeas = [
  {
    type: 'Dedication',
    example: '"For my future self, who I hope will look back on these pages with kindness..."',
  },
  {
    type: 'Prologue',
    example: '"This journal begins in the middle of my story—not the beginning, not the end..."',
  },
  {
    type: 'Letter to Self',
    example: '"Dear me, I\'m starting this journal because I want to remember who I am right now..."',
  },
  {
    type: 'Intention',
    example: '"I write to understand. I write to heal. I write to remember what matters..."',
  },
];

export function WhyPage({ onClose }: WhyPageProps) {
  const { journalWhy, fontFamily, pageColor, inkColor, updateSetting } = useSettings();
  const [isEditing, setIsEditing] = useState(false);
  const [whyText, setWhyText] = useState(journalWhy || '');
  const [showIdeas, setShowIdeas] = useState(false);

  const currentFont = fonts[fontFamily] || fonts.caveat;
  const pageBgColor = pageColors[pageColor];
  const currentInkColor = inkColors[inkColor] || inkColors.black;

  useEffect(() => {
    setWhyText(journalWhy || '');
  }, [journalWhy]);

  const handleSave = async () => {
    await updateSetting('journalWhy', whyText);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setWhyText(journalWhy || '');
    setIsEditing(false);
  };

  const useIdea = (example: string) => {
    // Remove the surrounding quotes from the example
    const cleanExample = example.replace(/^"|"$/g, '');
    setWhyText(cleanExample);
    setShowIdeas(false);
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
        initial={{ scale: 0.9, opacity: 0, rotateY: -30 }}
        animate={{ scale: 1, opacity: 1, rotateY: 0 }}
        exit={{ scale: 0.9, opacity: 0, rotateY: 30 }}
        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
        className="relative w-full max-w-2xl"
        onClick={(e) => e.stopPropagation()}
        style={{ perspective: '1000px' }}
      >
        {/* The Page */}
        <div
          className="relative rounded-2xl shadow-2xl overflow-hidden"
          style={{
            backgroundColor: pageBgColor,
            boxShadow: `
              0 25px 50px -12px rgba(0, 0, 0, 0.4),
              inset 0 0 60px rgba(0, 0, 0, 0.03)
            `,
          }}
        >
          {/* Paper texture */}
          <div
            className="absolute inset-0 opacity-50 pointer-events-none"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='paper'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.04' numOctaves='5' stitchTiles='stitch'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23paper)' opacity='0.05'/%3E%3C/svg%3E")`,
            }}
          />

          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full hover:bg-neutral-100 transition-colors z-10"
          >
            <X className="w-5 h-5 text-neutral-500" />
          </button>

          {/* Content */}
          <div className="relative p-8 md:p-12 min-h-[500px] flex flex-col">
            {/* Header */}
            <div className="text-center mb-8">
              <h2
                className={cn('text-3xl md:text-4xl font-bold mb-2', currentFont.className)}
                style={{ color: currentInkColor.color }}
              >
                My Purpose
              </h2>
              <p className="text-neutral-500 text-sm">
                Your dedication, prologue, or intention for this journal
              </p>
            </div>

            {/* Decorative line */}
            <div className="flex items-center justify-center gap-4 mb-8">
              <div className="h-px flex-1 bg-neutral-300" />
              <div className="w-2 h-2 rounded-full bg-neutral-400" />
              <div className="h-px flex-1 bg-neutral-300" />
            </div>

            {/* Why Content */}
            <div className="flex-1">
              {isEditing ? (
                <div className="h-full">
                  <textarea
                    value={whyText}
                    onChange={(e) => setWhyText(e.target.value)}
                    placeholder="Write your dedication, prologue, or purpose here..."
                    className={cn(
                      'w-full h-64 p-4 rounded-xl border-2 border-neutral-200 focus:border-neutral-400 focus:outline-none resize-none transition-colors',
                      currentFont.className
                    )}
                    style={{
                      backgroundColor: `${pageBgColor}dd`,
                      color: currentInkColor.color,
                      fontSize: '1.25rem',
                      lineHeight: '2',
                    }}
                    autoFocus
                  />

                  {/* Writing Ideas Toggle */}
                  <div className="mt-4">
                    <button
                      onClick={() => setShowIdeas(!showIdeas)}
                      className="flex items-center gap-2 text-sm text-neutral-500 hover:text-neutral-700 transition-colors"
                    >
                      <Sparkles className="w-4 h-4" />
                      {showIdeas ? 'Hide ideas' : 'Need inspiration?'}
                    </button>

                    {showIdeas && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="mt-3 space-y-2"
                      >
                        {writingIdeas.map((idea) => (
                          <button
                            key={idea.type}
                            onClick={() => useIdea(idea.example)}
                            className="w-full text-left p-3 rounded-lg border border-neutral-200 hover:border-neutral-400 hover:bg-neutral-50 transition-all"
                          >
                            <p className="text-xs font-medium text-neutral-500 uppercase tracking-wide mb-1">
                              {idea.type}
                            </p>
                            <p className="text-sm text-neutral-600 italic">
                              {idea.example}
                            </p>
                          </button>
                        ))}
                      </motion.div>
                    )}
                  </div>

                  <div className="flex justify-end gap-3 mt-4">
                    <button
                      onClick={handleCancel}
                      className="px-4 py-2 rounded-lg text-neutral-600 hover:bg-neutral-100 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleSave}
                      className="px-4 py-2 rounded-lg bg-neutral-900 text-white hover:bg-neutral-800 transition-colors flex items-center gap-2"
                    >
                      <Check className="w-4 h-4" />
                      Save
                    </button>
                  </div>
                </div>
              ) : (
                <div className="relative">
                  {whyText ? (
                    <div
                      className={cn(
                        'text-xl md:text-2xl leading-relaxed whitespace-pre-wrap',
                        currentFont.className
                      )}
                      style={{
                        color: currentInkColor.color,
                        lineHeight: '2.2',
                      }}
                    >
                      {whyText}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <p className="text-neutral-400 italic mb-6 text-lg">
                        Every great journal begins with intention.
                      </p>
                      <div className="space-y-4 text-left max-w-md mx-auto">
                        <p className="text-neutral-500 text-sm">
                          This is your front page—the first thing you'll see when you open your journal. Consider writing:
                        </p>
                        <ul className="text-neutral-500 text-sm space-y-2">
                          <li className="flex items-start gap-2">
                            <span className="text-neutral-400">•</span>
                            <span><strong>A dedication</strong> — who or what this journal is for</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <span className="text-neutral-400">•</span>
                            <span><strong>A prologue</strong> — where you are in your story right now</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <span className="text-neutral-400">•</span>
                            <span><strong>A letter to your future self</strong> — what you want to remember</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <span className="text-neutral-400">•</span>
                            <span><strong>Your intention</strong> — why you're journaling and what you hope to discover</span>
                          </li>
                        </ul>
                      </div>
                    </div>
                  )}

                  {/* Edit button */}
                  <button
                    onClick={() => setIsEditing(true)}
                    className="absolute -bottom-2 right-0 p-3 rounded-full bg-neutral-100 hover:bg-neutral-200 text-neutral-700 transition-all shadow-md hover:shadow-lg"
                    title="Edit your purpose"
                  >
                    <Pen className="w-5 h-5" />
                  </button>
                </div>
              )}
            </div>

            {/* Footer quote */}
            {!isEditing && whyText && (
              <div className="mt-8 pt-6 border-t border-neutral-200 text-center">
                <p className="text-neutral-400 text-sm italic">
                  "The first page sets the tone for everything that follows."
                </p>
              </div>
            )}
          </div>

          {/* Page edge effect */}
          <div
            className="absolute right-0 top-4 bottom-4 w-1"
            style={{
              background: 'linear-gradient(180deg, #d4af37 0%, #f5e6a3 15%, #d4af37 30%, #c5a028 50%, #f5e6a3 70%, #d4af37 85%, #c5a028 100%)',
            }}
          />
        </div>
      </motion.div>
    </motion.div>
  );
}
