'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { cn } from '@/lib/utils/cn';

interface PinInputProps {
  onComplete: (pin: string) => void;
  error?: string | null;
  disabled?: boolean;
  resetKey?: number;
}

export function PinInput({ onComplete, error, disabled, resetKey = 0 }: PinInputProps) {
  const [digits, setDigits] = useState(['', '', '', '']);
  const [shake, setShake] = useState(false);
  const [focusedIndex, setFocusedIndex] = useState(0);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const hasSubmitted = useRef(false);

  // Auto-focus first input on mount and keep focus
  useEffect(() => {
    const focusInput = () => {
      inputRefs.current[0]?.focus();
    };

    // Focus immediately and after a short delay
    focusInput();
    const timer1 = setTimeout(focusInput, 100);
    const timer2 = setTimeout(focusInput, 300);

    // Also focus when window/document gets focus
    window.addEventListener('focus', focusInput);
    document.addEventListener('click', focusInput);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      window.removeEventListener('focus', focusInput);
      document.removeEventListener('click', focusInput);
    };
  }, []);

  // Reset when resetKey changes
  useEffect(() => {
    if (resetKey > 0) {
      setDigits(['', '', '', '']);
      setFocusedIndex(0);
      hasSubmitted.current = false;
      setTimeout(() => {
        inputRefs.current[0]?.focus();
      }, 50);
    }
  }, [resetKey]);

  // Handle error - shake and reset
  useEffect(() => {
    if (error && hasSubmitted.current) {
      setShake(true);
      const timer = setTimeout(() => {
        setShake(false);
        setDigits(['', '', '', '']);
        setFocusedIndex(0);
        hasSubmitted.current = false;
        inputRefs.current[0]?.focus();
      }, 600);
      return () => clearTimeout(timer);
    }
  }, [error]);

  const handleInput = (index: number, value: string) => {
    if (disabled || hasSubmitted.current) return;

    // Only allow single digit
    const digit = value.replace(/\D/g, '').slice(-1);

    const newDigits = [...digits];
    newDigits[index] = digit;
    setDigits(newDigits);

    if (digit) {
      // Move to next input
      if (index < 3) {
        setFocusedIndex(index + 1);
        inputRefs.current[index + 1]?.focus();
      }

      // Check if complete
      const pin = newDigits.join('');
      if (pin.length === 4 && !hasSubmitted.current) {
        hasSubmitted.current = true;
        setTimeout(() => {
          onComplete(pin);
        }, 150);
      }
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (disabled || hasSubmitted.current) return;

    if (e.key === 'Backspace') {
      e.preventDefault();
      const newDigits = [...digits];

      if (digits[index]) {
        // Clear current
        newDigits[index] = '';
        setDigits(newDigits);
      } else if (index > 0) {
        // Move back and clear previous
        newDigits[index - 1] = '';
        setDigits(newDigits);
        setFocusedIndex(index - 1);
        inputRefs.current[index - 1]?.focus();
      }
    } else if (e.key === 'ArrowLeft' && index > 0) {
      setFocusedIndex(index - 1);
      inputRefs.current[index - 1]?.focus();
    } else if (e.key === 'ArrowRight' && index < 3) {
      setFocusedIndex(index + 1);
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleFocus = (index: number) => {
    setFocusedIndex(index);
  };

  const handleContainerClick = () => {
    // Focus the first empty input or the last one
    const firstEmpty = digits.findIndex(d => !d);
    const targetIndex = firstEmpty === -1 ? 3 : firstEmpty;
    inputRefs.current[targetIndex]?.focus();
  };

  return (
    <div className="flex flex-col items-center gap-4">
      {/* PIN input boxes */}
      <div
        className={cn('flex gap-4', shake && 'animate-shake')}
        onClick={handleContainerClick}
      >
        {digits.map((digit, index) => (
          <div
            key={index}
            className={cn(
              'relative w-16 h-20 rounded-xl overflow-hidden',
              'bg-gradient-to-b from-stone-100 to-stone-200',
              'border-2',
              'shadow-lg shadow-stone-400/30',
              'transition-all duration-150',
              focusedIndex === index && !disabled ? 'border-amber-500 scale-105' : 'border-stone-300',
              disabled && 'opacity-50'
            )}
          >
            <input
              ref={el => { inputRefs.current[index] = el; }}
              type="text"
              inputMode="numeric"
              pattern="[0-9]*"
              maxLength={1}
              value={digit}
              onChange={e => handleInput(index, e.target.value)}
              onKeyDown={e => handleKeyDown(index, e)}
              onFocus={() => handleFocus(index)}
              disabled={disabled}
              autoComplete="off"
              autoFocus={index === 0}
              className={cn(
                'absolute inset-0 w-full h-full',
                'bg-transparent text-center text-3xl font-bold',
                'text-transparent caret-amber-600',
                'focus:outline-none',
                'select-none'
              )}
              style={{ caretColor: 'transparent' }}
            />
            {/* Visual dot when filled */}
            {digit && (
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="w-4 h-4 rounded-full bg-amber-800 animate-fadeIn" />
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Error message */}
      {error && (
        <p className="text-red-600 text-sm font-semibold animate-fadeIn">
          {error}
        </p>
      )}
    </div>
  );
}
