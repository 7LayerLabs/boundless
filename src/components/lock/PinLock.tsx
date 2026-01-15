'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Lock, Check, X, Shield, LogOut } from 'lucide-react';
import { cn } from '@/lib/utils/cn';
import { db } from '@/lib/db/instant';
import { tx } from '@instantdb/react';

interface PinLockProps {
  settingsId: string | null;
  pinHash: string | null;
  onUnlock: () => void;
  userEmail?: string | null;
}

// Hash function using SHA-256
async function hashPin(pin: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(pin);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
}

export function PinLock({ settingsId, pinHash, onUnlock, userEmail }: PinLockProps) {
  const [pin, setPin] = useState('');
  const [confirmPin, setConfirmPin] = useState('');
  const [isSetupMode, setIsSetupMode] = useState(!pinHash);
  const [setupStep, setSetupStep] = useState<'create' | 'confirm'>('create');
  const [error, setError] = useState('');
  const [isUnlocking, setIsUnlocking] = useState(false);

  // Reset state when pinHash changes
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
        if (pin.length < 4) {
          setPin((prev) => prev + digit);
        }
      } else {
        if (confirmPin.length < 4) {
          setConfirmPin((prev) => prev + digit);
        }
      }
    } else {
      if (pin.length < 4) {
        setPin((prev) => prev + digit);
      }
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

  // Handle setup flow
  useEffect(() => {
    if (isSetupMode && pin.length === 4 && setupStep === 'create') {
      // Move to confirm step after a brief delay
      setTimeout(() => {
        setSetupStep('confirm');
      }, 300);
    }
  }, [isSetupMode, pin, setupStep]);

  // Handle confirm step
  useEffect(() => {
    const confirmPinSetup = async () => {
      if (isSetupMode && setupStep === 'confirm' && confirmPin.length === 4) {
        if (pin === confirmPin) {
          // PINs match - save the hash
          if (settingsId) {
            const hash = await hashPin(pin);
            await db.transact([
              tx.settings[settingsId].update({
                pinHash: hash,
                updatedAt: Date.now(),
              }),
            ]);
            setIsUnlocking(true);
            setTimeout(() => {
              onUnlock();
            }, 500);
          }
        } else {
          // PINs don't match
          setError("PINs don't match. Try again.");
          setPin('');
          setConfirmPin('');
          setSetupStep('create');
        }
      }
    };
    confirmPinSetup();
  }, [isSetupMode, setupStep, confirmPin, pin, settingsId, onUnlock]);

  // Handle unlock verification
  useEffect(() => {
    const verifyPin = async () => {
      if (!isSetupMode && pin.length === 4 && pinHash) {
        const enteredHash = await hashPin(pin);
        if (enteredHash === pinHash) {
          setIsUnlocking(true);
          setTimeout(() => {
            onUnlock();
          }, 500);
        } else {
          setError('Incorrect PIN');
          setPin('');
        }
      }
    };
    verifyPin();
  }, [isSetupMode, pin, pinHash, onUnlock]);

  const handleLogout = () => {
    db.auth.signOut();
  };

  const currentPin = isSetupMode && setupStep === 'confirm' ? confirmPin : pin;

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-amber-100 flex items-center justify-center p-4">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="relative"
      >
        {/* Leather texture background */}
        <div
          className="absolute inset-0 rounded-3xl"
          style={{
            background: 'linear-gradient(145deg, #8B4513, #654321)',
            boxShadow: `
              0 25px 50px -12px rgba(0, 0, 0, 0.5),
              inset 0 0 30px rgba(0, 0, 0, 0.3),
              inset 0 1px 0 rgba(255, 255, 255, 0.1)
            `,
          }}
        />

        <div className="relative bg-amber-50/95 rounded-2xl p-8 w-[340px] shadow-inner m-3">
          {/* Header */}
          <div className="text-center mb-6">
            <div className="mx-auto w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mb-4">
              {isSetupMode ? (
                <Shield className="w-8 h-8 text-amber-600" />
              ) : (
                <Lock className="w-8 h-8 text-amber-600" />
              )}
            </div>

            {isSetupMode ? (
              <>
                <h2 className="text-xl font-semibold text-amber-900">
                  {setupStep === 'create' ? 'Create Your PIN' : 'Confirm PIN'}
                </h2>
                <p className="text-sm text-amber-600 mt-1">
                  {setupStep === 'create'
                    ? 'Set a 4-digit PIN to protect your journal'
                    : 'Enter your PIN again to confirm'
                  }
                </p>
              </>
            ) : (
              <>
                <h2 className="text-xl font-semibold text-amber-900">Enter PIN</h2>
                <p className="text-sm text-amber-600 mt-1">
                  Enter your 4-digit PIN to unlock
                </p>
              </>
            )}
          </div>

          {/* User email indicator */}
          {userEmail && (
            <div className="text-center mb-4">
              <span className="text-xs text-amber-500">{userEmail}</span>
            </div>
          )}

          {/* PIN Display */}
          <div className="flex justify-center gap-4 mb-6">
            {[0, 1, 2, 3].map((i) => (
              <motion.div
                key={i}
                initial={false}
                animate={{
                  scale: currentPin.length > i ? 1.1 : 1,
                  backgroundColor: currentPin.length > i ? '#f59e0b' : '#fef3c7',
                }}
                className="w-4 h-4 rounded-full border-2 border-amber-400"
              />
            ))}
          </div>

          {/* Error Message */}
          <AnimatePresence mode="wait">
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="text-center mb-4"
              >
                <span className="text-sm text-red-500">{error}</span>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Success Animation */}
          <AnimatePresence>
            {isUnlocking && (
              <motion.div
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                className="absolute inset-0 flex items-center justify-center bg-amber-50/90 rounded-2xl"
              >
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: [0, 1.2, 1] }}
                  transition={{ duration: 0.5 }}
                  className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center"
                >
                  <Check className="w-8 h-8 text-green-600" />
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Number Pad */}
          <div className="grid grid-cols-3 gap-3">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
              <motion.button
                key={num}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleKeyPress(num.toString())}
                className={cn(
                  'h-14 rounded-xl text-xl font-medium transition-colors',
                  'bg-white hover:bg-amber-100 text-amber-800',
                  'border border-amber-200 shadow-sm'
                )}
              >
                {num}
              </motion.button>
            ))}

            {/* Bottom row */}
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={handleLogout}
              className={cn(
                'h-14 rounded-xl transition-colors',
                'bg-amber-100 hover:bg-amber-200 text-amber-600',
                'border border-amber-200'
              )}
              title="Sign out"
            >
              <LogOut className="w-5 h-5 mx-auto" />
            </motion.button>

            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => handleKeyPress('0')}
              className={cn(
                'h-14 rounded-xl text-xl font-medium transition-colors',
                'bg-white hover:bg-amber-100 text-amber-800',
                'border border-amber-200 shadow-sm'
              )}
            >
              0
            </motion.button>

            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={handleDelete}
              className={cn(
                'h-14 rounded-xl transition-colors',
                'bg-amber-100 hover:bg-amber-200 text-amber-600',
                'border border-amber-200'
              )}
            >
              <X className="w-5 h-5 mx-auto" />
            </motion.button>
          </div>

          {/* Privacy note */}
          <p className="text-xs text-amber-400 text-center mt-6">
            Your PIN is stored securely and never leaves your device unencrypted
          </p>
        </div>
      </motion.div>
    </div>
  );
}
