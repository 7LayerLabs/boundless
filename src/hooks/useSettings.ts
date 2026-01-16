'use client';

import { useEffect } from 'react';
import { db, type UserSettings } from '@/lib/db/instant';
import { id, tx } from '@instantdb/react';
import type { BindingColor, ClaspStyle, PageColor, FontFamily, FontSize, InkColor, AITone, DateFormat, DateColor } from '@/types/settings';

const DEFAULT_SETTINGS = {
  bindingColor: 'brown' as BindingColor,
  claspStyle: 'gold' as ClaspStyle,
  pageColor: 'cream' as PageColor,
  pageLines: true,
  fontFamily: 'caveat' as FontFamily,
  fontSize: 'medium' as FontSize,
  inkColor: 'black' as InkColor,
  showMoodSelector: true,
  aiReflectionEnabled: false,
  aiApiKey: '',
  aiTone: 'comforting' as AITone,
  dateFormat: 'full' as DateFormat,
  dateColor: 'brown' as DateColor,
  pinHash: '' as string | undefined, // Privacy PIN hash
  journalWhy: '' as string, // User's personal "why" for journaling
  darkMode: false as boolean, // Dark mode toggle
  currentNotebookId: '' as string, // Currently selected notebook
};

export function useSettings() {
  const { user } = db.useAuth();

  // Query settings for current user
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

  const { data, isLoading } = db.useQuery(query);

  // Type assertion for settings
  const settingsArray = (data?.settings || []) as UserSettings[];
  const userSettings = settingsArray[0];

  // Create default settings if none exist
  useEffect(() => {
    if (user && !isLoading && !userSettings) {
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
  }, [user, isLoading, userSettings]);

  // Get settings with defaults
  const settings = {
    bindingColor: (userSettings?.bindingColor as BindingColor) || DEFAULT_SETTINGS.bindingColor,
    claspStyle: (userSettings?.claspStyle as ClaspStyle) || DEFAULT_SETTINGS.claspStyle,
    pageColor: (userSettings?.pageColor as PageColor) || DEFAULT_SETTINGS.pageColor,
    pageLines: userSettings?.pageLines ?? DEFAULT_SETTINGS.pageLines,
    fontFamily: (userSettings?.fontFamily as FontFamily) || DEFAULT_SETTINGS.fontFamily,
    fontSize: (userSettings?.fontSize as FontSize) || DEFAULT_SETTINGS.fontSize,
    inkColor: (userSettings?.inkColor as InkColor) || DEFAULT_SETTINGS.inkColor,
    showMoodSelector: userSettings?.showMoodSelector ?? DEFAULT_SETTINGS.showMoodSelector,
    aiReflectionEnabled: userSettings?.aiReflectionEnabled ?? DEFAULT_SETTINGS.aiReflectionEnabled,
    aiApiKey: userSettings?.aiApiKey || DEFAULT_SETTINGS.aiApiKey,
    aiTone: (userSettings?.aiTone as AITone) || DEFAULT_SETTINGS.aiTone,
    dateFormat: (userSettings?.dateFormat as DateFormat) || DEFAULT_SETTINGS.dateFormat,
    dateColor: (userSettings?.dateColor as DateColor) || DEFAULT_SETTINGS.dateColor,
    pinHash: userSettings?.pinHash || undefined,
    journalWhy: userSettings?.journalWhy || DEFAULT_SETTINGS.journalWhy,
    darkMode: userSettings?.darkMode ?? DEFAULT_SETTINGS.darkMode,
    currentNotebookId: userSettings?.currentNotebookId || DEFAULT_SETTINGS.currentNotebookId,
  };

  // Update a setting
  const updateSetting = async <K extends keyof typeof DEFAULT_SETTINGS>(
    key: K,
    value: (typeof DEFAULT_SETTINGS)[K]
  ) => {
    if (!userSettings?.id) return;

    await db.transact([
      tx.settings[userSettings.id].update({
        [key]: value,
        updatedAt: Date.now(),
      }),
    ]);
  };

  // Reset all settings to defaults
  const resetSettings = async () => {
    if (!userSettings?.id) return;

    await db.transact([
      tx.settings[userSettings.id].update({
        ...DEFAULT_SETTINGS,
        updatedAt: Date.now(),
      }),
    ]);
  };

  return {
    ...settings,
    isLoading,
    updateSetting,
    resetSettings,
  };
}
