'use client';

import { useState, useCallback } from 'react';
import { useSettings } from './useSettings';

export type ProFeature = 
  | 'ai_reflections'
  | 'guided_programs'
  | 'entry_templates'
  | 'writing_stats'
  | 'daily_quotes'
  | 'pdf_export';

const FEATURE_NAMES: Record<ProFeature, string> = {
  ai_reflections: 'AI Reflections',
  guided_programs: 'Guided Programs',
  entry_templates: 'Entry Templates',
  writing_stats: 'Writing Stats',
  daily_quotes: 'Daily Quotes',
  pdf_export: 'PDF Export',
};

export function useProFeature() {
  const { isPro } = useSettings();
  const [showPaywall, setShowPaywall] = useState(false);
  const [blockedFeature, setBlockedFeature] = useState<string | null>(null);

  const checkAccess = useCallback((feature: ProFeature): boolean => {
    if (isPro) return true;
    
    setBlockedFeature(FEATURE_NAMES[feature]);
    setShowPaywall(true);
    return false;
  }, [isPro]);

  const closePaywall = useCallback(() => {
    setShowPaywall(false);
    setBlockedFeature(null);
  }, []);

  const requirePro = useCallback(<T extends (...args: unknown[]) => void>(
    feature: ProFeature,
    callback: T
  ): ((...args: Parameters<T>) => void) => {
    return (...args: Parameters<T>) => {
      if (checkAccess(feature)) {
        callback(...args);
      }
    };
  }, [checkAccess]);

  return {
    isPro,
    showPaywall,
    blockedFeature,
    checkAccess,
    closePaywall,
    requirePro,
  };
}
