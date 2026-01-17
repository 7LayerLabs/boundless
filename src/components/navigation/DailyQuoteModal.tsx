'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { X, Quote, RefreshCw, Pin } from 'lucide-react';
import { cn } from '@/lib/utils/cn';
import { getDailyQuote, getRandomQuote, type Quote as QuoteType } from '@/constants/quotes';

interface DailyQuoteModalProps {
  onClose: () => void;
  onPinQuote: (quote: QuoteType) => void;
}

export function DailyQuoteModal({ onClose, onPinQuote }: DailyQuoteModalProps) {
  const [currentQuote, setCurrentQuote] = useState<QuoteType>(getDailyQuote);
  const [isDaily, setIsDaily] = useState(true);

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
        <div className="px-6 py-4 border-b border-neutral-200 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-neutral-100 rounded-lg">
              <Quote className="w-5 h-5 text-neutral-700" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-neutral-900">Daily Quote</h2>
              <p className="text-sm text-neutral-500">
                {isDaily ? "Today's inspiration" : 'Random inspiration'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-neutral-100 transition-colors"
          >
            <X className="w-5 h-5 text-neutral-600" />
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
            <Quote className="w-8 h-8 mx-auto text-neutral-300 mb-4" />
            <p className="text-xl text-neutral-800 leading-relaxed mb-4 font-serif italic">
              "{currentQuote.text}"
            </p>
            <p className="text-neutral-600">
              — {currentQuote.author}
            </p>
          </motion.div>
        </div>

        {/* Actions */}
        <div className="px-6 py-4 border-t border-neutral-200 bg-neutral-50 flex justify-between items-center">
          <div className="flex gap-2">
            <button
              onClick={handleRefresh}
              className="flex items-center gap-2 px-4 py-2 text-neutral-700 hover:bg-neutral-200 rounded-lg text-sm font-medium transition-colors"
            >
              <RefreshCw className="w-4 h-4" />
              Random
            </button>
            {!isDaily && (
              <button
                onClick={handleResetToDaily}
                className="flex items-center gap-2 px-4 py-2 text-neutral-700 hover:bg-neutral-200 rounded-lg text-sm font-medium transition-colors"
              >
                Today's Quote
              </button>
            )}
          </div>
          <button
            onClick={handlePinQuote}
            className="flex items-center gap-2 px-4 py-2 bg-neutral-900 text-white rounded-lg text-sm font-medium hover:bg-neutral-800 transition-colors"
          >
            <Pin className="w-4 h-4" />
            Pin to Page
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}
