'use client';

import { create } from 'zustand';
import { v4 as uuidv4 } from 'uuid';
import { db, countWords, extractPlainText } from '@/lib/db/database';
import type { JournalEntry, Mood } from '@/types/journal';

interface JournalState {
  currentEntryId: string | null;
  currentDate: Date;
  isEditing: boolean;
  unsavedChanges: boolean;

  // Actions
  setCurrentDate: (date: Date) => void;
  setCurrentEntry: (id: string | null) => void;
  setEditing: (editing: boolean) => void;
  markUnsaved: () => void;
  markSaved: () => void;

  // CRUD Operations
  createEntry: (date: Date, content: string, mood: Mood | null, tags: string[]) => Promise<string>;
  updateEntry: (id: string, content: string, mood: Mood | null, tags: string[]) => Promise<void>;
  deleteEntry: (id: string) => Promise<void>;
  getEntryByDate: (date: Date) => Promise<JournalEntry | undefined>;
}

export const useJournalStore = create<JournalState>((set, get) => ({
  currentEntryId: null,
  currentDate: new Date(),
  isEditing: false,
  unsavedChanges: false,

  setCurrentDate: (date: Date) => {
    set({ currentDate: date });
  },

  setCurrentEntry: (id: string | null) => {
    set({ currentEntryId: id });
  },

  setEditing: (editing: boolean) => {
    set({ isEditing: editing });
  },

  markUnsaved: () => {
    set({ unsavedChanges: true });
  },

  markSaved: () => {
    set({ unsavedChanges: false });
  },

  createEntry: async (date, content, mood, tags) => {
    const id = uuidv4();
    const plainText = typeof document !== 'undefined' ? extractPlainText(content) : content;

    const entry: JournalEntry = {
      id,
      date,
      content,
      plainText,
      mood,
      tags,
      createdAt: new Date(),
      updatedAt: new Date(),
      wordCount: countWords(plainText),
    };

    await db.entries.add(entry);
    set({ currentEntryId: id, unsavedChanges: false });
    return id;
  },

  updateEntry: async (id, content, mood, tags) => {
    const plainText = typeof document !== 'undefined' ? extractPlainText(content) : content;

    await db.entries.update(id, {
      content,
      plainText,
      mood,
      tags,
      updatedAt: new Date(),
      wordCount: countWords(plainText),
    });

    set({ unsavedChanges: false });
  },

  deleteEntry: async (id) => {
    await db.entries.delete(id);
    const { currentEntryId } = get();
    if (currentEntryId === id) {
      set({ currentEntryId: null });
    }
  },

  getEntryByDate: async (date) => {
    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);

    const entries = await db.entries
      .where('date')
      .between(startOfDay, endOfDay)
      .first();

    return entries;
  },
}));
