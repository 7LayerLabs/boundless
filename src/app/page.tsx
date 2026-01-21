'use client';

import { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import Link from 'next/link';
import { DeskScene } from '@/components/scene/DeskScene';
// Note: Additional scenes (CafeScene, BeachScene, LibraryScene) saved for v2
import { ClosedJournal } from '@/components/journal/ClosedJournal';
import { AuthModal } from '@/components/auth/AuthModal';
import { PinModal } from '@/components/lock/PinModal';
import { JournalBook } from '@/components/journal/JournalBook';
import { LandingPage } from '@/components/landing/LandingPage';
import { ErrorBoundary, JournalErrorFallback } from '@/components/ErrorBoundary';
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
  scene: 'desk',
};


export default function Home() {
  const { isLoading: authLoading, user, error: authError } = db.useAuth();
  const [isPinVerified, setIsPinVerified] = useState(false);
  const [isJournalOpen, setIsJournalOpen] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [useFallbackSettings, setUseFallbackSettings] = useState(false);

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

  const { data, isLoading: settingsLoading, error: settingsError } = db.useQuery(query);
  const settingsArray = (data?.settings || []) as UserSettings[];
  const userSettings = settingsArray[0];


  // Track if we've waited long enough for settings to be created/loaded
  const [settingsWaitExceeded, setSettingsWaitExceeded] = useState(false);
  useEffect(() => {
    if (user && !userSettings) {
      const timeout = setTimeout(() => setSettingsWaitExceeded(true), 5000);
      return () => clearTimeout(timeout);
    } else if (userSettings) {
      setSettingsWaitExceeded(false);
    }
  }, [user, userSettings]);

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

  // Handle auth state changes
  useEffect(() => {
    if (user) {
      // User authenticated - close auth modal
      setShowAuthModal(false);
    } else {
      // User logged out - reset all states
      setIsPinVerified(false);
      setIsJournalOpen(false);
      setShowAuthModal(false);
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

  // Show loading during auth check OR while waiting for settings
  // We MUST have userSettings before showing PIN modal (need settingsId for transactions)
  const waitingForSettings = user && !userSettings && !settingsWaitExceeded;
  const isLoading = authLoading || waitingForSettings;

  // Determine what to show
  const showLandingPage = !user && !showAuthModal;
  // Show PIN modal only when we have userSettings (so settingsId is available)
  const showPinModal = user && !isPinVerified && userSettings;
  const showOpenJournal = user && isPinVerified && isJournalOpen;

  // Show error if settings failed to load after timeout
  const showSettingsError = user && !userSettings && settingsWaitExceeded;

  // Handle auth errors - clear stale sessions and recover
  useEffect(() => {
    if (authError) {
      const errorMessage = authError.message || '';
      // Handle stale session errors
      if (errorMessage.includes('Record not found') || errorMessage.includes('magic-code')) {
        // Clear stale auth data and reload
        localStorage.removeItem('instantdb-session');
        db.auth.signOut().catch(() => {});
        window.location.reload();
      }
    }
  }, [authError]);

  if (authError) {
    const errorMessage = authError.message || '';
    const isSessionError = errorMessage.includes('Record not found') || errorMessage.includes('magic-code');

    return (
      <DeskScene>
        <div className="text-center p-8 bg-amber-50/90 rounded-2xl shadow-xl">
          <p className="text-red-600 mb-4">
            {isSessionError ? 'Session expired' : 'Connection error'}
          </p>
          <button
            onClick={() => {
              localStorage.removeItem('instantdb-session');
              db.auth.signOut().catch(() => {});
              window.location.reload();
            }}
            className="px-6 py-2 bg-amber-500 text-white rounded-lg hover:bg-amber-600 transition-colors"
          >
            {isSessionError ? 'Sign in again' : 'Retry'}
          </button>
        </div>
      </DeskScene>
    );
  }

  // If settings failed to load, use temporary fallback settings and skip PIN
  const fallbackSettings: UserSettings | null = (useFallbackSettings && user) ? {
    id: 'temp-' + user.id,
    userId: user.id,
    ...DEFAULT_SETTINGS,
    createdAt: Date.now(),
    updatedAt: Date.now(),
  } as UserSettings : null;

  // Use fallback if real settings failed
  const effectiveSettings = userSettings || fallbackSettings;

  // Show settings error with option to continue anyway
  if (showSettingsError && !useFallbackSettings) {
    return (
      <DeskScene>
        <div className="text-center p-8 bg-amber-50/90 rounded-2xl shadow-xl max-w-md">
          <p className="text-amber-800 mb-4">
            Unable to load your settings. This might be a connection issue.
          </p>
          <div className="flex flex-col gap-3">
            <button
              onClick={() => window.location.reload()}
              className="px-6 py-2 bg-amber-500 text-white rounded-lg hover:bg-amber-600 transition-colors"
            >
              Retry
            </button>
            <button
              onClick={() => {
                setUseFallbackSettings(true);
                setIsPinVerified(true); // Skip PIN when using fallback
              }}
              className="px-6 py-2 bg-amber-700 text-white rounded-lg hover:bg-amber-800 transition-colors"
            >
              Continue Anyway
            </button>
          </div>
          <button
            onClick={() => {
              db.auth.signOut();
              window.location.reload();
            }}
            className="mt-4 text-sm text-amber-600 hover:text-amber-800"
          >
            Sign out
          </button>
        </div>
      </DeskScene>
    );
  }

  // Show landing page for non-authenticated users
  if (showLandingPage && !isLoading) {
    return <LandingPage onGetStarted={() => setShowAuthModal(true)} />;
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
      <ErrorBoundary
        fallback={
          <div className="w-full max-w-2xl mx-auto mt-8">
            <JournalErrorFallback
              error={new Error('An error occurred')}
              resetErrorBoundary={() => window.location.reload()}
            />
          </div>
        }
      >
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
      </ErrorBoundary>

      {/* Auth Modal */}
      <AnimatePresence>
        {showAuthModal && !isLoading && (
          <ErrorBoundary
            title="Login error"
            description="We couldn't load the login form. Please refresh the page."
          >
            <AuthModal />
          </ErrorBoundary>
        )}
      </AnimatePresence>

      {/* PIN Modal */}
      <AnimatePresence>
        {showPinModal && !isLoading && (
          <ErrorBoundary
            title="Security check error"
            description="We couldn't load the PIN verification. Please refresh the page."
          >
            <PinModal
              settingsId={userSettings?.id || null}
              pinHash={userSettings?.pinHash || null}
              onUnlock={() => setIsPinVerified(true)}
              userEmail={user?.email}
            />
          </ErrorBoundary>
        )}
      </AnimatePresence>
    </DeskScene>
  );
}
