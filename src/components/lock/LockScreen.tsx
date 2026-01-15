'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuthStore } from '@/stores/authStore';
import { useSettingsStore } from '@/stores/settingsStore';
import { PinInput } from './PinInput';
import { bindingColors } from '@/constants/themes';

interface LockScreenProps {
  onUnlock: () => void;
}

export function LockScreen({ onUnlock }: LockScreenProps) {
  const { isPinSetup, isLoading, error, checkPinSetup, setupPin, unlock, clearError } =
    useAuthStore();
  const { bindingColor, loadSettings } = useSettingsStore();
  const [isSetupMode, setIsSetupMode] = useState(false);
  const [confirmPin, setConfirmPin] = useState('');
  const [setupStep, setSetupStep] = useState<'enter' | 'confirm'>('enter');
  const [setupError, setSetupError] = useState<string | null>(null);
  const [isUnlocking, setIsUnlocking] = useState(false);
  const [resetKey, setResetKey] = useState(0);

  const binding = bindingColors[bindingColor];

  useEffect(() => {
    checkPinSetup();
    loadSettings();
  }, [checkPinSetup, loadSettings]);

  useEffect(() => {
    if (!isLoading && !isPinSetup) {
      setIsSetupMode(true);
    }
  }, [isLoading, isPinSetup]);

  const handlePinComplete = async (pin: string) => {
    clearError();
    setSetupError(null);

    if (isSetupMode) {
      if (setupStep === 'enter') {
        setConfirmPin(pin);
        setSetupStep('confirm');
        setResetKey(k => k + 1); // Reset PIN input for confirmation
      } else {
        if (pin === confirmPin) {
          const success = await setupPin(pin);
          if (success) {
            setIsUnlocking(true);
            setTimeout(onUnlock, 800);
          }
        } else {
          setSetupError("PINs don't match. Try again.");
          setSetupStep('enter');
          setConfirmPin('');
          setResetKey(k => k + 1);
        }
      }
    } else {
      const success = await unlock(pin);
      if (success) {
        setIsUnlocking(true);
        setTimeout(onUnlock, 800);
      }
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-stone-100 to-stone-200">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          className="w-10 h-10 border-3 border-amber-800 border-t-transparent rounded-full"
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-stone-200 via-stone-100 to-amber-50 p-4 overflow-hidden">
      {/* Ambient shadow/glow */}
      <div className="fixed inset-0 pointer-events-none">
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[600px] rounded-full blur-3xl opacity-20"
          style={{ backgroundColor: binding.color }}
        />
      </div>

      {/* Main content */}
      <div className="relative flex flex-col items-center">
        {/* Large leather journal - locked view */}
        <motion.div
          className="relative mb-12"
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{
            scale: isUnlocking ? 1.05 : 1,
            opacity: 1,
            y: 0,
            rotateY: isUnlocking ? -30 : 0,
          }}
          transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
          style={{ perspective: '1200px' }}
        >
          {/* Book shadow */}
          <div
            className="absolute inset-0 translate-y-8 translate-x-4 blur-2xl opacity-50 rounded-2xl"
            style={{ backgroundColor: binding.shadowColor }}
          />

          {/* The Journal Book */}
          <div
            className="relative w-[420px] h-[520px] rounded-r-2xl rounded-l-md"
            style={{
              backgroundColor: binding.color,
              boxShadow: `
                inset 0 0 80px rgba(0, 0, 0, 0.4),
                inset -8px 0 30px rgba(0, 0, 0, 0.3),
                12px 12px 40px ${binding.shadowColor},
                -2px 0 10px rgba(0, 0, 0, 0.2)
              `,
            }}
          >
            {/* Realistic leather grain texture */}
            <svg className="absolute inset-0 w-full h-full rounded-r-2xl rounded-l-md pointer-events-none" preserveAspectRatio="none">
              <defs>
                <filter id="leatherLock" x="0" y="0" width="100%" height="100%">
                  <feTurbulence type="fractalNoise" baseFrequency="0.03" numOctaves="6" seed="15" result="noise"/>
                  <feDiffuseLighting in="noise" lightingColor="#fff" surfaceScale="4" result="bump">
                    <feDistantLight azimuth="135" elevation="45"/>
                  </feDiffuseLighting>
                  <feComposite in="bump" in2="SourceGraphic" operator="arithmetic" k1="0.4" k2="0.6" k3="0" k4="0"/>
                </filter>
                <filter id="grainLock">
                  <feTurbulence type="turbulence" baseFrequency="0.7" numOctaves="3" seed="42"/>
                  <feColorMatrix type="saturate" values="0"/>
                </filter>
              </defs>
              <rect width="100%" height="100%" filter="url(#leatherLock)" opacity="0.3"/>
              <rect width="100%" height="100%" filter="url(#grainLock)" opacity="0.1"/>
            </svg>

            {/* Spine with stitching */}
            <div
              className="absolute left-0 top-0 bottom-0 w-8 rounded-l-md"
              style={{
                background: `linear-gradient(90deg,
                  rgba(0,0,0,0.5) 0%,
                  rgba(0,0,0,0.2) 30%,
                  transparent 100%
                )`,
              }}
            >
              {/* Stitching line */}
              <div className="absolute left-3 top-8 bottom-8 w-px bg-amber-900/30"
                style={{
                  backgroundImage: 'repeating-linear-gradient(180deg, transparent, transparent 4px, currentColor 4px, currentColor 8px)',
                }}
              />
            </div>

            {/* Embossed border frame */}
            <div
              className="absolute top-6 right-6 bottom-6 left-12 rounded-lg pointer-events-none"
              style={{
                border: '3px double rgba(212, 175, 55, 0.25)',
                boxShadow: `
                  inset 0 0 0 1px rgba(0, 0, 0, 0.15),
                  0 0 0 1px rgba(255, 255, 255, 0.05)
                `,
              }}
            />

            {/* Gold corner accents */}
            <div className="absolute top-8 left-14 w-10 h-10" style={{
              borderTop: '2px solid rgba(212, 175, 55, 0.35)',
              borderLeft: '2px solid rgba(212, 175, 55, 0.35)',
            }} />
            <div className="absolute top-8 right-8 w-10 h-10" style={{
              borderTop: '2px solid rgba(212, 175, 55, 0.35)',
              borderRight: '2px solid rgba(212, 175, 55, 0.35)',
            }} />
            <div className="absolute bottom-8 left-14 w-10 h-10" style={{
              borderBottom: '2px solid rgba(212, 175, 55, 0.35)',
              borderLeft: '2px solid rgba(212, 175, 55, 0.35)',
            }} />
            <div className="absolute bottom-8 right-8 w-10 h-10" style={{
              borderBottom: '2px solid rgba(212, 175, 55, 0.35)',
              borderRight: '2px solid rgba(212, 175, 55, 0.35)',
            }} />

            {/* Gold foil page edges */}
            <div
              className="absolute right-0 top-6 bottom-6 w-2 rounded-r"
              style={{
                background: 'linear-gradient(180deg, #d4af37 0%, #f5e6a3 15%, #d4af37 30%, #c5a028 50%, #f5e6a3 70%, #d4af37 85%, #c5a028 100%)',
                boxShadow: 'inset 2px 0 4px rgba(0,0,0,0.2)',
              }}
            />

            {/* Engraved "Boundless" logo */}
            <div className="absolute bottom-12 right-12">
              <span
                className="font-playfair text-3xl italic tracking-widest select-none"
                style={{
                  color: 'transparent',
                  textShadow: `
                    2px 2px 2px rgba(255, 255, 255, 0.1),
                    -1px -1px 2px rgba(0, 0, 0, 0.5)
                  `,
                  WebkitBackgroundClip: 'text',
                  backgroundClip: 'text',
                  background: `linear-gradient(145deg, rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0.1))`,
                }}
              >
                Boundless
              </span>
            </div>

            {/* Clasp/Lock */}
            <motion.div
              className="absolute right-[-20px] top-1/2 -translate-y-1/2"
              animate={{ x: isUnlocking ? 20 : 0 }}
              transition={{ duration: 0.4 }}
            >
              {/* Clasp base */}
              <div
                className="w-10 h-24 rounded-r-lg"
                style={{
                  background: 'linear-gradient(135deg, #d4af37 0%, #f5e6a3 30%, #d4af37 60%, #c5a028 100%)',
                  boxShadow: '3px 3px 8px rgba(0,0,0,0.4), inset 1px 1px 2px rgba(255,255,255,0.4)',
                }}
              >
                {/* Keyhole */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                  <div className="w-3 h-3 rounded-full bg-black/40" />
                  <div className="w-1.5 h-3 bg-black/40 mx-auto -mt-0.5 rounded-b" />
                </div>
              </div>
            </motion.div>
          </div>
        </motion.div>

        {/* PIN Entry Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="flex flex-col items-center"
        >
          <h1 className="text-3xl font-playfair text-stone-800 mb-2">
            {isSetupMode
              ? setupStep === 'enter'
                ? 'Create Your PIN'
                : 'Confirm Your PIN'
              : 'Enter PIN'}
          </h1>
          <p className="text-stone-500 mb-8 text-center max-w-xs">
            {isSetupMode
              ? setupStep === 'enter'
                ? 'Choose a 4-digit PIN to protect your journal'
                : 'Enter the same PIN again'
              : 'Unlock your journal'}
          </p>

          <PinInput
            onComplete={handlePinComplete}
            error={setupError || error}
            disabled={isUnlocking}
            resetKey={resetKey}
          />
        </motion.div>
      </div>
    </div>
  );
}
