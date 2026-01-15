'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, LogOut } from 'lucide-react';
import { db } from '@/lib/db/instant';
import { tx } from '@instantdb/react';

interface PinModalProps {
  settingsId: string | null;
  pinHash: string | null;
  onUnlock: () => void;
  userEmail?: string | null;
}

async function hashPin(pin: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(pin);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
}

export function PinModal({ settingsId, pinHash, onUnlock, userEmail }: PinModalProps) {
  const [pin, setPin] = useState('');
  const [confirmPin, setConfirmPin] = useState('');
  const [isSetupMode, setIsSetupMode] = useState(!pinHash);
  const [setupStep, setSetupStep] = useState<'create' | 'confirm'>('create');
  const [error, setError] = useState('');
  const [isUnlocking, setIsUnlocking] = useState(false);

  useEffect(() => {
    setIsSetupMode(!pinHash);
    setPin('');
    setConfirmPin('');
    setError('');
    setSetupStep('create');
  }, [pinHash]);

  const handleKeyPress = useCallback((digit: string) => {
    setError('');
    if (isSetupMode) {
      if (setupStep === 'create') {
        if (pin.length < 4) setPin((prev) => prev + digit);
      } else {
        if (confirmPin.length < 4) setConfirmPin((prev) => prev + digit);
      }
    } else {
      if (pin.length < 4) setPin((prev) => prev + digit);
    }
  }, [isSetupMode, setupStep, pin.length, confirmPin.length]);

  const handleDelete = useCallback(() => {
    setError('');
    if (isSetupMode && setupStep === 'confirm') {
      setConfirmPin((prev) => prev.slice(0, -1));
    } else {
      setPin((prev) => prev.slice(0, -1));
    }
  }, [isSetupMode, setupStep]);

  // Keyboard support - type PIN from anywhere
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isUnlocking) return;
      if (/^[0-9]$/.test(e.key)) {
        e.preventDefault();
        handleKeyPress(e.key);
      } else if (e.key === 'Backspace' || e.key === 'Delete') {
        e.preventDefault();
        handleDelete();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyPress, handleDelete, isUnlocking]);

  useEffect(() => {
    if (isSetupMode && pin.length === 4 && setupStep === 'create') {
      setTimeout(() => setSetupStep('confirm'), 300);
    }
  }, [isSetupMode, pin, setupStep]);

  useEffect(() => {
    const confirmPinSetup = async () => {
      if (isSetupMode && setupStep === 'confirm' && confirmPin.length === 4) {
        if (pin === confirmPin) {
          if (settingsId) {
            const hash = await hashPin(pin);
            await db.transact([
              tx.settings[settingsId].update({ pinHash: hash, updatedAt: Date.now() }),
            ]);
            setIsUnlocking(true);
            setTimeout(() => onUnlock(), 500);
          }
        } else {
          setError("PINs don't match");
          setPin('');
          setConfirmPin('');
          setSetupStep('create');
        }
      }
    };
    confirmPinSetup();
  }, [isSetupMode, setupStep, confirmPin, pin, settingsId, onUnlock]);

  useEffect(() => {
    const verifyPin = async () => {
      if (!isSetupMode && pin.length === 4 && pinHash) {
        const enteredHash = await hashPin(pin);
        if (enteredHash === pinHash) {
          setIsUnlocking(true);
          setTimeout(() => onUnlock(), 500);
        } else {
          setError('Incorrect PIN');
          setPin('');
        }
      }
    };
    verifyPin();
  }, [isSetupMode, pin, pinHash, onUnlock]);

  const handleLogout = () => db.auth.signOut();

  const currentPin = isSetupMode && setupStep === 'confirm' ? confirmPin : pin;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-end pr-8 md:pr-16"
      style={{
        background: 'linear-gradient(90deg, rgba(0,0,0,0.1) 0%, rgba(0,0,0,0.5) 60%, rgba(0,0,0,0.7) 100%)',
        backdropFilter: 'blur(2px)',
      }}
    >
      <motion.div
        initial={{ x: 50, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        exit={{ x: 50, opacity: 0 }}
        transition={{ duration: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
        className="w-full max-w-xs"
      >
        <div
          className="relative overflow-hidden"
          style={{
            background: 'linear-gradient(180deg, #1a1816 0%, #14120f 100%)',
            borderRadius: '12px',
            boxShadow: `
              0 25px 50px rgba(0, 0, 0, 0.5),
              0 0 0 1px rgba(255, 255, 255, 0.05),
              inset 0 1px 0 rgba(255, 255, 255, 0.05)
            `,
          }}
        >
          {/* Subtle top accent */}
          <div
            className="absolute top-0 left-0 right-0 h-px"
            style={{
              background: 'linear-gradient(90deg, transparent 20%, rgba(212, 175, 55, 0.3) 50%, transparent 80%)',
            }}
          />

          {/* Header */}
          <div className="px-6 pt-8 pb-4 text-center">
            <h2
              className="text-lg font-serif tracking-wide"
              style={{ color: 'rgba(240, 230, 210, 0.9)' }}
            >
              {isSetupMode
                ? setupStep === 'create' ? 'Create PIN' : 'Confirm PIN'
                : 'Enter PIN'}
            </h2>
            <p
              className="text-xs mt-1"
              style={{ color: 'rgba(180, 170, 150, 0.5)' }}
            >
              {isSetupMode
                ? setupStep === 'create' ? 'Choose a 4-digit PIN' : 'Re-enter to confirm'
                : 'Enter your 4-digit PIN'}
            </p>
            {userEmail && (
              <p className="text-xs mt-2" style={{ color: 'rgba(160, 150, 130, 0.4)' }}>
                {userEmail}
              </p>
            )}
          </div>

          {/* PIN Display */}
          <div className="px-6 pb-4">
            <div className="flex justify-center gap-4">
              {[0, 1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="w-3 h-3 rounded-full transition-all duration-200"
                  style={{
                    backgroundColor: currentPin.length > i
                      ? 'rgba(212, 175, 55, 0.8)'
                      : 'rgba(255, 255, 255, 0.1)',
                    boxShadow: currentPin.length > i
                      ? '0 0 8px rgba(212, 175, 55, 0.4)'
                      : 'none',
                  }}
                />
              ))}
            </div>

            <AnimatePresence mode="wait">
              {error && (
                <motion.p
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -5 }}
                  className="text-xs text-center mt-3"
                  style={{ color: '#c47070' }}
                >
                  {error}
                </motion.p>
              )}
            </AnimatePresence>
          </div>

          {/* Success Animation */}
          <AnimatePresence>
            {isUnlocking && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="absolute inset-0 flex items-center justify-center rounded-xl"
                style={{ background: 'rgba(20, 18, 15, 0.95)' }}
              >
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: [0, 1.1, 1] }}
                  transition={{ duration: 0.4 }}
                  className="w-12 h-12 rounded-full flex items-center justify-center"
                  style={{
                    background: 'rgba(212, 175, 55, 0.2)',
                    border: '1px solid rgba(212, 175, 55, 0.4)',
                  }}
                >
                  <Check className="w-6 h-6" style={{ color: 'rgba(212, 175, 55, 0.9)' }} />
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Number Pad */}
          <div className="px-6 pb-6">
            <div className="grid grid-cols-3 gap-2">
              {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
                <button
                  key={num}
                  onClick={() => handleKeyPress(num.toString())}
                  className="h-12 rounded-lg text-lg font-light transition-all active:scale-95"
                  style={{
                    background: 'rgba(255, 255, 255, 0.03)',
                    border: '1px solid rgba(255, 255, 255, 0.08)',
                    color: 'rgba(240, 230, 210, 0.8)',
                  }}
                >
                  {num}
                </button>
              ))}

              <button
                onClick={handleLogout}
                className="h-12 rounded-lg transition-all active:scale-95 flex items-center justify-center"
                style={{
                  background: 'rgba(255, 255, 255, 0.02)',
                  border: '1px solid rgba(255, 255, 255, 0.05)',
                  color: 'rgba(180, 170, 150, 0.5)',
                }}
                title="Sign out"
              >
                <LogOut className="w-4 h-4" />
              </button>

              <button
                onClick={() => handleKeyPress('0')}
                className="h-12 rounded-lg text-lg font-light transition-all active:scale-95"
                style={{
                  background: 'rgba(255, 255, 255, 0.03)',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                  color: 'rgba(240, 230, 210, 0.8)',
                }}
              >
                0
              </button>

              <button
                onClick={handleDelete}
                className="h-12 rounded-lg transition-all active:scale-95 flex items-center justify-center"
                style={{
                  background: 'rgba(255, 255, 255, 0.02)',
                  border: '1px solid rgba(255, 255, 255, 0.05)',
                  color: 'rgba(180, 170, 150, 0.5)',
                }}
              >
                <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M12 9.75L14.25 12m0 0l2.25 2.25M14.25 12l2.25-2.25M14.25 12L12 14.25m-2.58 4.92l-6.375-6.375a1.125 1.125 0 010-1.59L9.42 4.83c.211-.211.498-.33.796-.33H19.5a2.25 2.25 0 012.25 2.25v10.5a2.25 2.25 0 01-2.25 2.25h-9.284c-.298 0-.585-.119-.796-.33z" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
