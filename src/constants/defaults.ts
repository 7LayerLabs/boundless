import type { UserSettings } from '@/types/settings';

export const DEFAULT_SETTINGS: Omit<UserSettings, 'id' | 'createdAt' | 'updatedAt'> = {
  bindingColor: 'brown',
  claspStyle: 'gold',
  pageColor: 'cream',
  pageLines: true,
  fontFamily: 'caveat',
  fontSize: 'medium',
  inkColor: 'black',
  // Feature toggles
  showMoodSelector: true,  // On by default
  aiReflectionEnabled: false,  // Off by default
  // AI Configuration
  aiApiKey: '',  // User must provide their own key
  aiTone: 'comforting',  // Default tone for AI reflections
  dateFormat: 'full',  // Default date format: JANUARY 16, 2026
  dateColor: 'brown',  // Default date text color
  scene: 'desk',  // Default scene/environment
};

export const SETTINGS_ID = 'user-settings';
export const PIN_DATA_ID = 'pin-data';
