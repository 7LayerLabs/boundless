'use client';

import { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { DeskScene } from '@/components/scene/DeskScene';
import { ClosedJournal } from '@/components/journal/ClosedJournal';
import { AuthModal } from '@/components/auth/AuthModal';
import { PinModal } from '@/components/lock/PinModal';
import { JournalBook } from '@/components/journal/JournalBook';
import { db, type UserSettings } from '@/lib/db/instant';
import { id, tx } from '@instantdb/react';

// Default settings for new users
const DEFAULT_SETTINGS = {
  bindingColor: 'brown',
  claspStyle: 'gold',
  pageColor: 'cream',
  pageLines: true,
  fontFamily: 'caveat',
  fontSize: 'medium',
  inkColor: 'black',
  showMoodSelector: true,
  aiReflectionEnabled: false,
  aiApiKey: '',
};

export default function Home() {
  const { isLoading: authLoading, user, error: authError } = db.useAuth();
  const [isPinVerified, setIsPinVerified] = useState(false);
  const [isJournalOpen, setIsJournalOpen] = useState(false);

  // Query user settings
  const query = user
    ? {
        settings: {
          $: {
            where: {
              userId: user.id,
            },
          },
        },
      }
    : null;

  const { data, isLoading: settingsLoading } = db.useQuery(query);
  const settingsArray = (data?.settings || []) as UserSettings[];
  const userSettings = settingsArray[0];

  // Create default settings if none exist
  useEffect(() => {
    if (user && !settingsLoading && !userSettings) {
      const settingsId = id();
      db.transact([
        tx.settings[settingsId].update({
          userId: user.id,
          ...DEFAULT_SETTINGS,
          createdAt: Date.now(),
          updatedAt: Date.now(),
        }),
      ]);
    }
  }, [user, settingsLoading, userSettings]);

  // Reset states when user logs out
  useEffect(() => {
    if (!user) {
      setIsPinVerified(false);
      setIsJournalOpen(false);
    }
  }, [user]);

  // Open journal after PIN is verified
  useEffect(() => {
    if (isPinVerified && !isJournalOpen) {
      // Small delay for the unlock animation
      const timer = setTimeout(() => {
        setIsJournalOpen(true);
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [isPinVerified, isJournalOpen]);

  const isLoading = authLoading || (user && settingsLoading);

  // Determine what to show
  const showAuthModal = !user;
  const showPinModal = user && !isPinVerified;
  const showOpenJournal = user && isPinVerified && isJournalOpen;

  if (authError) {
    return (
      <DeskScene>
        <div className="text-center p-8 bg-amber-50/90 rounded-2xl shadow-xl">
          <p className="text-red-600 mb-4">Connection error</p>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-2 bg-amber-500 text-white rounded-lg hover:bg-amber-600 transition-colors"
          >
            Retry
          </button>
        </div>
      </DeskScene>
    );
  }

  return (
    <DeskScene>
      {/* Loading spinner */}
      {isLoading && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="absolute inset-0 flex items-center justify-center z-50"
        >
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
            className="w-10 h-10 border-3 border-amber-400 border-t-transparent rounded-full"
          />
        </motion.div>
      )}

      {/* Main content */}
      <AnimatePresence mode="wait">
        {!showOpenJournal ? (
          <motion.div
            key="closed-journal"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 0.9, y: 50 }}
            transition={{ duration: 0.5 }}
          >
            <ClosedJournal isLocked={!isPinVerified} />
          </motion.div>
        ) : (
          <motion.div
            key="open-journal"
            initial={{ opacity: 0, scale: 0.8, rotateY: -90 }}
            animate={{ opacity: 1, scale: 1, rotateY: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
            className="w-full max-w-6xl mx-auto"
          >
            <JournalBook />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Auth Modal */}
      <AnimatePresence>
        {showAuthModal && !isLoading && <AuthModal />}
      </AnimatePresence>

      {/* Sticky note - only on welcome page */}
      <AnimatePresence>
        {showAuthModal && !isLoading && (
          <motion.div
            initial={{ opacity: 0, y: -20, rotate: -5 }}
            animate={{ opacity: 1, y: 0, rotate: -3 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4, delay: 0.5 }}
            className="absolute top-6 right-6 w-52 z-50"
          >
            <div
              className="relative p-4 shadow-lg"
              style={{
                background: 'linear-gradient(135deg, #fef9c3 0%, #fef08a 100%)',
                boxShadow: `
                  0 4px 6px rgba(0, 0, 0, 0.25),
                  0 10px 20px rgba(0, 0, 0, 0.15),
                  inset 0 -2px 4px rgba(0, 0, 0, 0.05)
                `,
              }}
            >
              {/* Tape effect at top */}
              <div
                className="absolute -top-2 left-1/2 -translate-x-1/2 w-12 h-4 rounded-sm"
                style={{
                  background: 'linear-gradient(180deg, rgba(255,255,255,0.6) 0%, rgba(255,255,255,0.3) 100%)',
                  boxShadow: '0 1px 2px rgba(0,0,0,0.1)',
                }}
              />

              {/* Content */}
              <div className="relative">
                <h3
                  className="text-sm font-bold mb-2"
                  style={{
                    color: '#78350f',
                    fontFamily: 'Comic Sans MS, cursive, sans-serif',
                  }}
                >
                  What is Boundless?
                </h3>
                <p
                  className="text-xs leading-relaxed mb-2"
                  style={{
                    color: '#92400e',
                    fontFamily: 'Comic Sans MS, cursive, sans-serif',
                  }}
                >
                  A private space to write honestly with two-layer security.
                </p>
                <ul
                  className="text-xs space-y-1"
                  style={{
                    color: '#a16207',
                    fontFamily: 'Comic Sans MS, cursive, sans-serif',
                  }}
                >
                  <li>• Daily prompts</li>
                  <li>• Mood tracking</li>
                  <li>• Distraction-free</li>
                </ul>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* PIN Modal */}
      <AnimatePresence>
        {showPinModal && !isLoading && (
          <PinModal
            settingsId={userSettings?.id || null}
            pinHash={userSettings?.pinHash || null}
            onUnlock={() => setIsPinVerified(true)}
            userEmail={user?.email}
          />
        )}
      </AnimatePresence>
    </DeskScene>
  );
}
