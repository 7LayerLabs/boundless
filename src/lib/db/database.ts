import Dexie, { type Table } from 'dexie';
import type { JournalEntry } from '@/types/journal';
import type { UserSettings, PinData } from '@/types/settings';

class JournalDatabase extends Dexie {
  entries!: Table<JournalEntry>;
  settings!: Table<UserSettings>;
  pinData!: Table<PinData>;

  constructor() {
    super('BoundlessJournalDB');

    this.version(1).stores({
      entries: 'id, date, mood, *tags, createdAt, updatedAt',
      settings: 'id',
      pinData: 'id',
    });
  }
}

export const db = new JournalDatabase();

// Helper to tokenize text for search
export function tokenize(text: string): string[] {
  return text
    .toLowerCase()
    .replace(/[^\w\s]/g, ' ')
    .split(/\s+/)
    .filter((word) => word.length > 2)
    .filter((word, index, arr) => arr.indexOf(word) === index);
}

// Helper to extract plain text from HTML content
export function extractPlainText(html: string): string {
  const div = document.createElement('div');
  div.innerHTML = html;
  return div.textContent || div.innerText || '';
}

// Count words in text
export function countWords(text: string): number {
  return text
    .trim()
    .split(/\s+/)
    .filter((word) => word.length > 0).length;
}
