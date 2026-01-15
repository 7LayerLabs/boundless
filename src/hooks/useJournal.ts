'use client';

import { useState, useEffect, useMemo } from 'react';
import { db, type JournalEntry } from '@/lib/db/instant';
import { id, tx } from '@instantdb/react';
import type { Mood } from '@/types/journal';

export function useJournal() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedEntryId, setSelectedEntryId] = useState<string | null>(null);
  const { user } = db.useAuth();

  // Get start and end of current day as ISO strings for comparison
  const startOfDay = useMemo(() => {
    const d = new Date(currentDate);
    d.setHours(0, 0, 0, 0);
    return d;
  }, [currentDate]);

  const endOfDay = useMemo(() => {
    const d = new Date(currentDate);
    d.setHours(23, 59, 59, 999);
    return d;
  }, [currentDate]);

  // Query entries for current user
  const query = user
    ? {
        entries: {
          $: {
            where: {
              userId: user.id,
            },
          },
        },
      }
    : null;

  const { data, isLoading, error } = db.useQuery(query);

  // Type assertion for entries
  const entries = (data?.entries || []) as JournalEntry[];

  // Get all entries for the current day (sorted by creation time, newest first)
  const dayEntries = useMemo(() => {
    return entries
      .filter((entry: JournalEntry) => {
        const entryDate = new Date(entry.date);
        return entryDate >= startOfDay && entryDate <= endOfDay;
      })
      .sort((a, b) => b.createdAt - a.createdAt);
  }, [entries, startOfDay, endOfDay]);

  // Get the currently selected entry (or the most recent one for the day)
  const currentEntry = useMemo(() => {
    if (selectedEntryId) {
      return dayEntries.find((e) => e.id === selectedEntryId) || dayEntries[0] || null;
    }
    return dayEntries[0] || null;
  }, [dayEntries, selectedEntryId]);

  // Auto-select the most recent entry when day changes
  useEffect(() => {
    if (dayEntries.length > 0 && !dayEntries.find((e) => e.id === selectedEntryId)) {
      setSelectedEntryId(dayEntries[0].id);
    } else if (dayEntries.length === 0) {
      setSelectedEntryId(null);
    }
  }, [dayEntries, selectedEntryId]);

  // Get all entries for calendar/insights
  const allEntries = entries;

  // Create a new entry
  const createEntry = async (
    date: Date,
    content: string,
    mood: Mood | null,
    tags: string[]
  ) => {
    if (!user) return null;

    const entryId = id();
    const now = Date.now();

    await db.transact([
      tx.entries[entryId].update({
        userId: user.id,
        date: date.toISOString(),
        content,
        mood,
        tags,
        wordCount: content.replace(/<[^>]*>/g, ' ').split(/\s+/).filter(Boolean).length,
        isLocked: false,
        updates: [],
        createdAt: now,
        updatedAt: now,
      }),
    ]);

    setSelectedEntryId(entryId);
    return entryId;
  };

  // Update an existing entry (only if not locked)
  const updateEntry = async (
    entryId: string,
    content: string,
    mood: Mood | null,
    tags: string[]
  ) => {
    if (!user) return;

    const entry = entries.find((e) => e.id === entryId);
    if (entry?.isLocked) return; // Don't allow editing locked entries

    await db.transact([
      tx.entries[entryId].update({
        content,
        mood,
        tags,
        wordCount: content.replace(/<[^>]*>/g, ' ').split(/\s+/).filter(Boolean).length,
        updatedAt: Date.now(),
      }),
    ]);
  };

  // Lock an entry (prevents further edits to original content)
  const lockEntry = async (entryId: string) => {
    if (!user) return;

    await db.transact([
      tx.entries[entryId].update({
        isLocked: true,
        updatedAt: Date.now(),
      }),
    ]);
  };

  // Add an update to a locked entry
  const addEntryUpdate = async (entryId: string, updateContent: string) => {
    if (!user) return;

    const entry = entries.find((e) => e.id === entryId);
    if (!entry) return;

    const existingUpdates = entry.updates || [];
    const newUpdate = {
      id: id(),
      content: updateContent,
      createdAt: Date.now(),
    };

    await db.transact([
      tx.entries[entryId].update({
        updates: [...existingUpdates, newUpdate],
        updatedAt: Date.now(),
      }),
    ]);
  };

  // Delete an entry
  const deleteEntry = async (entryId: string) => {
    if (!user) return;

    await db.transact([tx.entries[entryId].delete()]);

    // Select another entry if available
    if (selectedEntryId === entryId) {
      const remaining = dayEntries.filter((e) => e.id !== entryId);
      setSelectedEntryId(remaining[0]?.id || null);
    }
  };

  return {
    currentDate,
    setCurrentDate,
    currentEntry,
    dayEntries,
    selectedEntryId,
    setSelectedEntryId,
    allEntries,
    isLoading,
    error,
    createEntry,
    updateEntry,
    lockEntry,
    addEntryUpdate,
    deleteEntry,
  };
}
