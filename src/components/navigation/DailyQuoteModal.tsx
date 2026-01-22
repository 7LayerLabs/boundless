'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { X, Quote, RefreshCw, Pin, Lock, Unlock } from 'lucide-react';
import { cn } from '@/lib/utils/cn';
import { getDailyQuote, getRandomQuote, type Quote as QuoteType } from '@/constants/quotes';

interface DailyQuoteModalProps {
  onClose: () => void;
  onPinQuote: (quote: QuoteType) => void;
  onLockQuote: (quote: QuoteType) => void;
  onUnlockQuote: () => void;
  lockedQuote: QuoteType | null;
}

export function DailyQuoteModal({
  onClose,
  onPinQuote,
  onLockQuote,
  onUnlockQuote,
  lockedQuote
}: DailyQuoteModalProps) {
  const [currentQuote, setCurrentQuote] = useState<QuoteType>(
    lockedQuote || getDailyQuote()
  );
  const [isDaily, setIsDaily] = useState(!lockedQuote);

  const isCurrentQuoteLocked = lockedQuote &&
    lockedQuote.text === currentQuote.text &&
    lockedQuote.author === currentQuote.author;

  const handleRefresh = () => {
    setCurrentQuote(getRandomQuote());
    setIsDaily(false);
  };

  const handleResetToDaily = () => {
    setCurrentQuote(getDailyQuote());
    setIsDaily(true);
  };

  const handlePinQuote = () => {
    onPinQuote(currentQuote);
    onClose();
  };

  const handleLockQuote = () => {
    onLockQuote(currentQuote);
    onClose();
  };

  const handleUnlockQuote = () => {
    onUnlockQuote();
    setCurrentQuote(getDailyQuote());
    setIsDaily(true);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
        className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden"
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-amber-200 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-amber-100 rounded-lg">
              <Quote className="w-5 h-5 text-amber-700" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-amber-900">Daily Quote</h2>
              <p className="text-sm text-stone-600">
                {isCurrentQuoteLocked
                  ? 'Locked quote (persists daily)'
                  : isDaily
                    ? "Today's inspiration"
                    : 'Random inspiration'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-amber-100 transition-colors"
          >
            <X className="w-5 h-5 text-stone-600" />
          </button>
        </div>

        {/* Quote Content */}
        <div className="p-8">
          <motion.div
            key={currentQuote.text}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="text-center"
          >
            <div className="relative inline-block">
              <Quote className="w-8 h-8 mx-auto text-neutral-300 mb-4" />
              {isCurrentQuoteLocked && (
                <Lock className="w-4 h-4 absolute -top-1 -right-5 text-amber-500" />
              )}
            </div>
            <p className="text-xl text-stone-800 leading-relaxed mb-4 font-serif italic">
              "{currentQuote.text}"
            </p>
            <p className="text-stone-600">
              — {currentQuote.author}
            </p>
          </motion.div>
        </div>

        {/* Actions */}
        <div className="px-6 py-4 border-t border-amber-200 bg-neutral-50">
          {/* Top row - refresh controls */}
          <div className="flex gap-2 mb-3">
            <button
              onClick={handleRefresh}
              className="flex items-center gap-2 px-4 py-2 text-amber-700 hover:bg-amber-200 rounded-lg text-sm font-medium transition-colors"
            >
              <RefreshCw className="w-4 h-4" />
              Random
            </button>
            {!isDaily && !isCurrentQuoteLocked && (
              <button
                onClick={handleResetToDaily}
                className="flex items-center gap-2 px-4 py-2 text-amber-700 hover:bg-amber-200 rounded-lg text-sm font-medium transition-colors"
              >
                Today's Quote
              </button>
            )}
            {lockedQuote && !isCurrentQuoteLocked && (
              <button
                onClick={() => setCurrentQuote(lockedQuote)}
                className="flex items-center gap-2 px-4 py-2 text-amber-700 hover:bg-amber-100 rounded-lg text-sm font-medium transition-colors"
              >
                <Lock className="w-4 h-4" />
                Locked Quote
              </button>
            )}
          </div>

          {/* Bottom row - pin/lock actions */}
          <div className="flex justify-between items-center">
            {isCurrentQuoteLocked ? (
              <button
                onClick={handleUnlockQuote}
                className="flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg text-sm font-medium transition-colors"
              >
                <Unlock className="w-4 h-4" />
                Unlock Quote
              </button>
            ) : (
              <div className="text-xs text-stone-600">
                Pin: today only | Lock: every day
              </div>
            )}

            <div className="flex gap-2">
              {!isCurrentQuoteLocked && (
                <>
                  <button
                    onClick={handlePinQuote}
                    className="flex items-center gap-2 px-4 py-2 bg-amber-200 text-stone-800 rounded-lg text-sm font-medium hover:bg-neutral-300 transition-colors"
                  >
                    <Pin className="w-4 h-4" />
                    Pin to Page
                  </button>
                  <button
                    onClick={handleLockQuote}
                    className="flex items-center gap-2 px-4 py-2 bg-amber-500 text-white rounded-lg text-sm font-medium hover:bg-amber-600 transition-colors"
                  >
                    <Lock className="w-4 h-4" />
                    Lock Quote
                  </button>
                </>
              )}
              {isCurrentQuoteLocked && (
                <button
                  onClick={onClose}
                  className="flex items-center gap-2 px-4 py-2 bg-stone-800 text-white rounded-lg text-sm font-medium hover:bg-stone-700 transition-colors"
                >
                  Done
                </button>
              )}
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
