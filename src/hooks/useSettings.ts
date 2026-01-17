'use client';

import { useEffect } from 'react';
import { db, type UserSettings } from '@/lib/db/instant';
import { id, tx } from '@instantdb/react';
import type { BindingColor, ClaspStyle, PageColor, FontFamily, FontSize, InkColor, AITone, DateFormat, DateColor, SceneType } from '@/types/settings';

export type CustomTag = { name: string; color: string };

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
  scene: 'desk' as SceneType,
  pinHash: '' as string | undefined, // Privacy PIN hash
  journalWhy: '' as string, // User's personal "why" for journaling
  darkMode: false as boolean, // Dark mode toggle
  currentNotebookId: '' as string, // Currently selected notebook
  customTags: [] as CustomTag[], // Custom tags with colors
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
    scene: (userSettings?.scene as SceneType) || DEFAULT_SETTINGS.scene,
    pinHash: userSettings?.pinHash || undefined,
    journalWhy: userSettings?.journalWhy || DEFAULT_SETTINGS.journalWhy,
    darkMode: userSettings?.darkMode ?? DEFAULT_SETTINGS.darkMode,
    currentNotebookId: userSettings?.currentNotebookId || DEFAULT_SETTINGS.currentNotebookId,
    customTags: (userSettings?.customTags as CustomTag[]) || DEFAULT_SETTINGS.customTags,
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

  // Add a custom tag with color
  const addCustomTag = async (name: string, color: string): Promise<boolean> => {
    if (!userSettings?.id) {
      console.error('addCustomTag: No user settings found');
      return false;
    }

    const trimmedName = name.trim().toLowerCase();
    if (!trimmedName) {
      console.error('addCustomTag: Empty tag name');
      return false;
    }

    const existingTags = settings.customTags || [];
    // Don't add if it already exists
    if (existingTags.some(t => t.name === trimmedName)) {
      console.log('addCustomTag: Tag already exists');
      return false;
    }

    const newTags = [...existingTags, { name: trimmedName, color }];

    await db.transact([
      tx.settings[userSettings.id].update({
        customTags: newTags,
        updatedAt: Date.now(),
      }),
    ]);

    return true;
  };

  // Remove a custom tag
  const removeCustomTag = async (name: string) => {
    if (!userSettings?.id) return;

    const existingTags = settings.customTags || [];
    const newTags = existingTags.filter(t => t.name !== name);

    await db.transact([
      tx.settings[userSettings.id].update({
        customTags: newTags,
        updatedAt: Date.now(),
      }),
    ]);
  };

  return {
    ...settings,
    isLoading,
    updateSetting,
    resetSettings,
    addCustomTag,
    removeCustomTag,
  };
}
