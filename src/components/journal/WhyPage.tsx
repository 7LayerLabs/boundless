'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { X, Pen, Check } from 'lucide-react';
import { cn } from '@/lib/utils/cn';
import { useSettings } from '@/hooks/useSettings';
import { fonts } from '@/constants/fonts';
import { pageColors, inkColors } from '@/constants/themes';

interface WhyPageProps {
  onClose: () => void;
}

export function WhyPage({ onClose }: WhyPageProps) {
  const { journalWhy, fontFamily, pageColor, inkColor, updateSetting } = useSettings();
  const [isEditing, setIsEditing] = useState(false);
  const [whyText, setWhyText] = useState(journalWhy || '');

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
            className="absolute top-4 right-4 p-2 rounded-full hover:bg-amber-100/50 transition-colors z-10"
          >
            <X className="w-5 h-5 text-amber-800/60" />
          </button>

          {/* Content */}
          <div className="relative p-8 md:p-12 min-h-[500px] flex flex-col">
            {/* Header */}
            <div className="text-center mb-8">
              <h2
                className={cn('text-3xl md:text-4xl font-bold mb-2', currentFont.className)}
                style={{ color: currentInkColor.color }}
              >
                My Why
              </h2>
              <p className="text-amber-600/70 text-sm">
                The reason I write in this journal
              </p>
            </div>

            {/* Decorative line */}
            <div className="flex items-center justify-center gap-4 mb-8">
              <div className="h-px flex-1 bg-gradient-to-r from-transparent via-amber-300 to-transparent" />
              <div className="w-2 h-2 rounded-full bg-amber-300" />
              <div className="h-px flex-1 bg-gradient-to-r from-transparent via-amber-300 to-transparent" />
            </div>

            {/* Why Content */}
            <div className="flex-1">
              {isEditing ? (
                <div className="h-full">
                  <textarea
                    value={whyText}
                    onChange={(e) => setWhyText(e.target.value)}
                    placeholder="Why do you write? What brings you to this journal? What do you hope to discover, remember, or create?..."
                    className={cn(
                      'w-full h-64 p-4 rounded-xl border-2 border-amber-200 focus:border-amber-400 focus:outline-none resize-none transition-colors',
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
                  <div className="flex justify-end gap-3 mt-4">
                    <button
                      onClick={handleCancel}
                      className="px-4 py-2 rounded-lg text-amber-700 hover:bg-amber-100 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleSave}
                      className="px-4 py-2 rounded-lg bg-amber-500 text-white hover:bg-amber-600 transition-colors flex items-center gap-2"
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
                    <div className="text-center py-12">
                      <p className="text-amber-400 italic mb-6">
                        You haven't written your "why" yet.
                      </p>
                      <p className="text-amber-500/70 text-sm max-w-md mx-auto">
                        Take a moment to reflect on why you're starting this journal.
                        What do you hope to gain? What story do you want to tell?
                      </p>
                    </div>
                  )}

                  {/* Edit button */}
                  <button
                    onClick={() => setIsEditing(true)}
                    className="absolute -bottom-2 right-0 p-3 rounded-full bg-amber-100 hover:bg-amber-200 text-amber-700 transition-all shadow-md hover:shadow-lg"
                    title="Edit your why"
                  >
                    <Pen className="w-5 h-5" />
                  </button>
                </div>
              )}
            </div>

            {/* Footer quote */}
            {!isEditing && (
              <div className="mt-8 pt-6 border-t border-amber-200/50 text-center">
                <p className="text-amber-500/60 text-sm italic">
                  "The act of writing is the act of discovering what you believe."
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
