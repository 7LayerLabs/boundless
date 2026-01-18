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
      isBookmarked: i.boolean().optional(), // Bookmark important entries
      images: i.json<{ id: string; url: string; caption?: string; size?: number }[]>().optional(), // Photo attachments with optional size
      notebookId: i.string().optional(), // Which notebook this belongs to
      updates: i.json<{ id: string; content: string; createdAt: number }[]>().optional(), // Updates added after locking
      createdAt: i.number(),
      updatedAt: i.number(),
    }),
    notebooks: i.entity({
      userId: i.string(),
      name: i.string(),
      color: i.string(), // Color theme for the notebook
      icon: i.string().optional(), // Icon identifier
      isDefault: i.boolean().optional(),
      createdAt: i.number(),
      updatedAt: i.number(),
    }),
    prompts: i.entity({
      userId: i.string(),
      text: i.string(),
      category: i.string().optional(), // gratitude, reflection, goals, etc.
      isCustom: i.boolean().optional(),
      usedAt: i.number().optional(),
      createdAt: i.number(),
    }),
    programEntries: i.entity({
      userId: i.string(),
      programId: i.string(), // ID of the guided program
      promptIndex: i.number(), // Which prompt (0-indexed)
      content: i.string(), // The user's writing
      wordCount: i.number(),
      completedAt: i.number(), // When they finished this prompt
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
      journalWhy: i.string().optional(), // User's personal "why" for journaling
      darkMode: i.boolean().optional(), // Dark mode toggle
      currentNotebookId: i.string().optional(), // Currently selected notebook
      scene: i.string().optional(), // Background scene: desk, cafe, beach, library
      customTags: i.json<{ name: string; color: string }[]>().optional(), // Custom tags with colors
      showWritingStats: i.boolean().optional(), // Show Writing Stats in sidebar
      showEntryTemplates: i.boolean().optional(), // Show Entry Templates in sidebar
      showGuidedPrograms: i.boolean().optional(), // Show Guided Programs in sidebar
      showDailyQuote: i.boolean().optional(), // Show Daily Quote in sidebar
      lockedQuote: i.json<{ text: string; author: string } | null>().optional(), // Locked quote that persists across days
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
  isBookmarked?: boolean;
  images?: { id: string; url: string; caption?: string; size?: number }[];
  notebookId?: string;
  updates?: { id: string; content: string; createdAt: number }[];
  createdAt: number;
  updatedAt: number;
};

export type Notebook = {
  id: string;
  userId: string;
  name: string;
  color: string;
  icon?: string;
  isDefault?: boolean;
  createdAt: number;
  updatedAt: number;
};

export type Prompt = {
  id: string;
  userId: string;
  text: string;
  category?: string;
  isCustom?: boolean;
  usedAt?: number;
  createdAt: number;
};

export type ProgramEntry = {
  id: string;
  userId: string;
  programId: string;
  promptIndex: number;
  content: string;
  wordCount: number;
  completedAt: number;
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
  journalWhy?: string; // User's personal "why" for journaling
  darkMode?: boolean; // Dark mode toggle
  currentNotebookId?: string; // Currently selected notebook
  scene?: string; // Background scene: desk, cafe, beach, library
  customTags?: { name: string; color: string }[]; // Custom tags with colors
  showWritingStats?: boolean; // Show Writing Stats in sidebar
  showEntryTemplates?: boolean; // Show Entry Templates in sidebar
  showGuidedPrograms?: boolean; // Show Guided Programs in sidebar
  showDailyQuote?: boolean; // Show Daily Quote in sidebar
  lockedQuote?: { text: string; author: string } | null; // Locked quote that persists across days
  createdAt: number;
  updatedAt: number;
};
