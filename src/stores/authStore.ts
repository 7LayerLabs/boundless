'use client';

import { create } from 'zustand';
import { db } from '@/lib/db/database';
import { hashPin, verifyPin, generateSalt, isValidPin } from '@/lib/crypto/pinHash';
import { PIN_DATA_ID } from '@/constants/defaults';

interface AuthState {
  isUnlocked: boolean;
  isPinSetup: boolean;
  isLoading: boolean;
  error: string | null;

  // Actions
  checkPinSetup: () => Promise<void>;
  setupPin: (pin: string) => Promise<boolean>;
  unlock: (pin: string) => Promise<boolean>;
  lock: () => void;
  changePin: (currentPin: string, newPin: string) => Promise<boolean>;
  clearError: () => void;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  isUnlocked: false,
  isPinSetup: false,
  isLoading: true,
  error: null,

  checkPinSetup: async () => {
    try {
      const pinData = await db.pinData.get(PIN_DATA_ID);
      set({ isPinSetup: !!pinData, isLoading: false });
    } catch (error) {
      console.error('Error checking PIN setup:', error);
      set({ isLoading: false, error: 'Failed to check PIN setup' });
    }
  },

  setupPin: async (pin: string) => {
    if (!isValidPin(pin)) {
      set({ error: 'PIN must be exactly 4 digits' });
      return false;
    }

    try {
      const salt = generateSalt();
      const pinHash = await hashPin(pin, salt);

      await db.pinData.put({
        id: PIN_DATA_ID,
        pinHash,
        salt,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      set({ isPinSetup: true, isUnlocked: true, error: null });
      return true;
    } catch (error) {
      console.error('Error setting up PIN:', error);
      set({ error: 'Failed to set up PIN' });
      return false;
    }
  },

  unlock: async (pin: string) => {
    if (!isValidPin(pin)) {
      set({ error: 'PIN must be exactly 4 digits' });
      return false;
    }

    try {
      const pinData = await db.pinData.get(PIN_DATA_ID);
      if (!pinData) {
        set({ error: 'PIN not set up' });
        return false;
      }

      const isValid = await verifyPin(pin, pinData.pinHash, pinData.salt);
      if (isValid) {
        set({ isUnlocked: true, error: null });
        return true;
      } else {
        set({ error: 'Incorrect PIN' });
        return false;
      }
    } catch (error) {
      console.error('Error unlocking:', error);
      set({ error: 'Failed to verify PIN' });
      return false;
    }
  },

  lock: () => {
    set({ isUnlocked: false });
  },

  changePin: async (currentPin: string, newPin: string) => {
    if (!isValidPin(newPin)) {
      set({ error: 'New PIN must be exactly 4 digits' });
      return false;
    }

    try {
      const pinData = await db.pinData.get(PIN_DATA_ID);
      if (!pinData) {
        set({ error: 'PIN not set up' });
        return false;
      }

      const isValid = await verifyPin(currentPin, pinData.pinHash, pinData.salt);
      if (!isValid) {
        set({ error: 'Current PIN is incorrect' });
        return false;
      }

      const salt = generateSalt();
      const pinHash = await hashPin(newPin, salt);

      await db.pinData.update(PIN_DATA_ID, {
        pinHash,
        salt,
        updatedAt: new Date(),
      });

      set({ error: null });
      return true;
    } catch (error) {
      console.error('Error changing PIN:', error);
      set({ error: 'Failed to change PIN' });
      return false;
    }
  },

  clearError: () => {
    set({ error: null });
  },
}));
