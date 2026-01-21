'use client';

import { useState, useEffect, useMemo } from 'react';
import { db, type JournalEntry } from '@/lib/db/instant';
import { id, tx } from '@instantdb/react';
import type { Mood } from '@/types/journal';
import { analytics } from '@/components/providers/PostHogProvider';

export function useJournal() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedEntryId, setSelectedEntryId] = useState<string | null>(null);
  const { user } = db.useAuth();

  // Get current date as YYYY-MM-DD string for reliable comparison (avoids timezone issues)
  const currentDateString = useMemo(() => {
    const year = currentDate.getFullYear();
    const month = String(currentDate.getMonth() + 1).padStart(2, '0');
    const day = String(currentDate.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
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
        // Compare date strings (YYYY-MM-DD) to avoid timezone issues
        const entryDate = new Date(entry.date);
        const entryYear = entryDate.getFullYear();
        const entryMonth = String(entryDate.getMonth() + 1).padStart(2, '0');
        const entryDay = String(entryDate.getDate()).padStart(2, '0');
        const entryDateString = `${entryYear}-${entryMonth}-${entryDay}`;
        return entryDateString === currentDateString;
      })
      .sort((a, b) => b.createdAt - a.createdAt);
  }, [entries, currentDateString]);

  // Get the currently selected entry (or the most recent one for the day)
  const currentEntry = useMemo(() => {
    if (selectedEntryId) {
      // If we have a selected ID, only return that entry (or null if not found yet)
      // Don't fall back to dayEntries[0] as that would show old content during new entry creation
      const found = dayEntries.find((e) => e.id === selectedEntryId);
      return found || null;
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

    const wordCount = content.replace(/<[^>]*>/g, ' ').split(/\s+/).filter(Boolean).length;

    await db.transact([
      tx.entries[entryId].update({
        userId: user.id,
        date: date.toISOString(),
        content,
        mood,
        tags,
        wordCount,
        isLocked: false,
        updates: [],
        createdAt: now,
        updatedAt: now,
      }),
    ]);

    analytics.entryCreated(wordCount, !!mood);
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

    const wordCount = content.replace(/<[^>]*>/g, ' ').split(/\s+/).filter(Boolean).length;

    await db.transact([
      tx.entries[entryId].update({
        content,
        mood,
        tags,
        wordCount,
        updatedAt: Date.now(),
      }),
    ]);

    analytics.entryUpdated(wordCount);
  };

  // Update tags on an entry (works even on locked entries)
  const updateEntryTags = async (entryId: string, tags: string[]) => {
    if (!user) return;

    await db.transact([
      tx.entries[entryId].update({
        tags,
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

    analytics.entryLocked();
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

  // Toggle bookmark on an entry
  const toggleBookmark = async (entryId: string) => {
    if (!user) return;

    const entry = entries.find((e) => e.id === entryId);
    if (!entry) return;

    const wasBookmarked = entry.isBookmarked;

    await db.transact([
      tx.entries[entryId].update({
        isBookmarked: !entry.isBookmarked,
        updatedAt: Date.now(),
      }),
    ]);

    if (!wasBookmarked) {
      analytics.entryBookmarked();
    }
  };

  // Get bookmarked entries
  const bookmarkedEntries = useMemo(() => {
    return entries.filter((e) => e.isBookmarked).sort((a, b) => b.createdAt - a.createdAt);
  }, [entries]);

  // Get all unique tags
  const allTags = useMemo(() => {
    const tagSet = new Set<string>();
    entries.forEach((entry) => {
      (entry.tags || []).forEach((tag) => tagSet.add(tag));
    });
    return Array.from(tagSet).sort();
  }, [entries]);

  // Get entries by tag
  const getEntriesByTag = (tag: string) => {
    return entries.filter((e) => (e.tags || []).includes(tag)).sort((a, b) => b.createdAt - a.createdAt);
  };

  // Search entries
  const searchEntries = (query: string) => {
    if (!query.trim()) return [];
    const lowerQuery = query.toLowerCase();
    return entries
      .filter((e) => {
        const plainText = e.content.replace(/<[^>]*>/g, ' ').toLowerCase();
        return plainText.includes(lowerQuery);
      })
      .sort((a, b) => b.createdAt - a.createdAt);
  };

  // Add image to entry
  const addImage = async (entryId: string, url: string, caption?: string) => {
    if (!user) return;

    const entry = entries.find((e) => e.id === entryId);
    if (!entry) return;

    const existingImages = entry.images || [];
    const newImage = {
      id: id(),
      url,
      caption,
    };

    await db.transact([
      tx.entries[entryId].update({
        images: [...existingImages, newImage],
        updatedAt: Date.now(),
      }),
    ]);
  };

  // Remove image from entry
  const removeImage = async (entryId: string, imageId: string) => {
    if (!user) return;

    const entry = entries.find((e) => e.id === entryId);
    if (!entry) return;

    const updatedImages = (entry.images || []).filter((img) => img.id !== imageId);

    await db.transact([
      tx.entries[entryId].update({
        images: updatedImages,
        updatedAt: Date.now(),
      }),
    ]);
  };

  // Resize image in entry
  const resizeImage = async (entryId: string, imageId: string, size: number) => {
    if (!user) return;

    const entry = entries.find((e) => e.id === entryId);
    if (!entry) return;

    const updatedImages = (entry.images || []).map((img) =>
      img.id === imageId ? { ...img, size } : img
    );

    await db.transact([
      tx.entries[entryId].update({
        images: updatedImages,
        updatedAt: Date.now(),
      }),
    ]);
  };

  return {
    currentDate,
    setCurrentDate,
    currentEntry,
    dayEntries,
    selectedEntryId,
    setSelectedEntryId,
    allEntries,
    bookmarkedEntries,
    allTags,
    isLoading,
    error,
    createEntry,
    updateEntry,
    updateEntryTags,
    lockEntry,
    addEntryUpdate,
    deleteEntry,
    toggleBookmark,
    getEntriesByTag,
    searchEntries,
    addImage,
    removeImage,
    resizeImage,
  };
}
