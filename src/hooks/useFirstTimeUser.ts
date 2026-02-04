'use client';

import { useState, useEffect } from 'react';
import { useJournal } from './useJournal';

/**
 * Hook to detect if user is new (has no entries) and should see onboarding
 */
export function useFirstTimeUser() {
  const [isFirstTime, setIsFirstTime] = useState(false);
  const [hasChecked, setHasChecked] = useState(false);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const { allEntries } = useJournal();

  useEffect(() => {
    // Check localStorage for onboarding completion
    const hasCompletedOnboarding = localStorage.getItem('boundless_onboarding_complete');
    
    if (hasCompletedOnboarding === 'true') {
      setIsFirstTime(false);
      setShowOnboarding(false);
      setHasChecked(true);
      return;
    }

    // User hasn't completed onboarding - check if they have entries
    if (allEntries !== undefined) {
      const hasNoEntries = allEntries.length === 0;
      setIsFirstTime(hasNoEntries);
      setShowOnboarding(hasNoEntries && hasCompletedOnboarding !== 'true');
      setHasChecked(true);
    }
  }, [allEntries]);

  const completeOnboarding = () => {
    localStorage.setItem('boundless_onboarding_complete', 'true');
    setShowOnboarding(false);
    setIsFirstTime(false);
  };

  const resetOnboarding = () => {
    localStorage.removeItem('boundless_onboarding_complete');
    setShowOnboarding(true);
    setIsFirstTime(true);
  };

  return {
    isFirstTime,
    hasChecked,
    showOnboarding,
    completeOnboarding,
    resetOnboarding,
  };
}
