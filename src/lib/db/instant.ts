import { init, i } from '@instantdb/react';

// InstantDB App ID
const APP_ID = '9f557bfc-7463-4e90-9b3b-1b8d22a9b70d';

// Define the schema using InstantDB's schema builder
const schema = i.schema({
  entities: {
    entries: i.entity({
      userId: i.string(),
      date: i.string(), // ISO date string
      content: i.string(),
      mood: i.string().optional(),
      tags: i.json<string[]>(),
      wordCount: i.number(),
      isLocked: i.boolean().optional(), // Lock entry to prevent edits
      updates: i.json<{ id: string; content: string; createdAt: number }[]>().optional(), // Updates added after locking
      createdAt: i.number(),
      updatedAt: i.number(),
    }),
    settings: i.entity({
      userId: i.string(),
      bindingColor: i.string(),
      claspStyle: i.string(),
      pageColor: i.string(),
      pageLines: i.boolean(),
      fontFamily: i.string(),
      fontSize: i.string(),
      inkColor: i.string(),
      showMoodSelector: i.boolean(),
      aiReflectionEnabled: i.boolean(),
      aiApiKey: i.string(),
      aiTone: i.string().optional(), // AI reflection tone: comforting, toughLove, curious, philosophical, playful
      dateFormat: i.string().optional(), // Date format: full, short, numeric, dots
      dateColor: i.string().optional(), // Date text color
      pinHash: i.string().optional(), // SHA-256 hashed 4-digit PIN for privacy
      createdAt: i.number(),
      updatedAt: i.number(),
    }),
  },
});

// Infer types from schema
type Schema = typeof schema;

// Initialize InstantDB with schema
export const db = init<Schema>({ appId: APP_ID, schema });

// Export entity types for use in components
export type JournalEntry = {
  id: string;
  userId: string;
  date: string;
  content: string;
  mood: string | null;
  tags: string[];
  wordCount: number;
  isLocked?: boolean;
  updates?: { id: string; content: string; createdAt: number }[];
  createdAt: number;
  updatedAt: number;
};

export type UserSettings = {
  id: string;
  userId: string;
  bindingColor: string;
  claspStyle: string;
  pageColor: string;
  pageLines: boolean;
  fontFamily: string;
  fontSize: string;
  inkColor: string;
  showMoodSelector: boolean;
  aiReflectionEnabled: boolean;
  aiApiKey: string;
  aiTone?: string; // AI reflection tone
  dateFormat?: string; // Date format
  dateColor?: string; // Date text color
  pinHash?: string; // SHA-256 hashed 4-digit PIN for privacy
  createdAt: number;
  updatedAt: number;
};
