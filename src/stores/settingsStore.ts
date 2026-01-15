'use client';

import { create } from 'zustand';
import { db } from '@/lib/db/database';
import type { BindingColor, ClaspStyle, PageColor, FontFamily, FontSize, InkColor, AITone, UserSettings } from '@/types/settings';
import { DEFAULT_SETTINGS, SETTINGS_ID } from '@/constants/defaults';

interface SettingsState {
  bindingColor: BindingColor;
  claspStyle: ClaspStyle;
  pageColor: PageColor;
  pageLines: boolean;
  fontFamily: FontFamily;
  fontSize: FontSize;
  inkColor: InkColor;
  showMoodSelector: boolean;
  aiReflectionEnabled: boolean;
  aiApiKey: string;
  aiTone: AITone;
  isLoading: boolean;

  // Actions
  loadSettings: () => Promise<void>;
  updateSetting: <K extends keyof typeof DEFAULT_SETTINGS>(
    key: K,
    value: (typeof DEFAULT_SETTINGS)[K]
  ) => Promise<void>;
  resetSettings: () => Promise<void>;
}

export const useSettingsStore = create<SettingsState>((set, get) => ({
  ...DEFAULT_SETTINGS,
  isLoading: true,

  loadSettings: async () => {
    try {
      const settings = await db.settings.get(SETTINGS_ID);
      if (settings) {
        // Validate fontFamily exists in new font list, fallback to caveat if not
        const validFonts = ['caveat', 'patrickHand', 'kalam', 'comingSoon', 'shadowsIntoLight', 'reenieBeanie', 'justAnotherHand', 'coveredByYourGrace', 'permanentMarker', 'architectsDaughter', 'gloriaHallelujah', 'gochiHand', 'homemadeApple', 'nothingYouCouldDo', 'satisfy', 'marckScript'];
        const fontFamily = validFonts.includes(settings.fontFamily) ? settings.fontFamily : 'caveat';

        set({
          bindingColor: settings.bindingColor,
          claspStyle: settings.claspStyle,
          pageColor: settings.pageColor,
          pageLines: settings.pageLines,
          fontFamily: fontFamily as FontFamily,
          fontSize: settings.fontSize,
          inkColor: settings.inkColor || 'black',
          showMoodSelector: settings.showMoodSelector ?? true,
          aiReflectionEnabled: settings.aiReflectionEnabled ?? false,
          aiApiKey: settings.aiApiKey || '',
          aiTone: settings.aiTone || 'comforting',
          isLoading: false,
        });
      } else {
        // Create default settings
        await db.settings.put({
          id: SETTINGS_ID,
          ...DEFAULT_SETTINGS,
          createdAt: new Date(),
          updatedAt: new Date(),
        });
        set({ isLoading: false });
      }
    } catch (error) {
      console.error('Error loading settings:', error);
      set({ isLoading: false });
    }
  },

  updateSetting: async (key, value) => {
    try {
      set({ [key]: value } as Partial<SettingsState>);

      await db.settings.update(SETTINGS_ID, {
        [key]: value,
        updatedAt: new Date(),
      });
    } catch (error) {
      console.error('Error updating setting:', error);
    }
  },

  resetSettings: async () => {
    try {
      set({ ...DEFAULT_SETTINGS });

      await db.settings.update(SETTINGS_ID, {
        ...DEFAULT_SETTINGS,
        updatedAt: new Date(),
      });
    } catch (error) {
      console.error('Error resetting settings:', error);
    }
  },
}));
