export type Mood =
  | 'happy'
  | 'sad'
  | 'anxious'
  | 'calm'
  | 'excited'
  | 'grateful'
  | 'tired'
  | 'energetic'
  | 'thoughtful'
  | 'creative'
  | 'angry'
  | 'frustrated'
  | 'defeated'
  | 'stressed'
  | 'hopeful'
  | 'lonely'
  | 'proud'
  | 'confused'
  | 'loved'
  | 'content'
  | 'numb';

export interface EntryUpdate {
  id: string;
  content: string;
  createdAt: Date;
}

export interface JournalEntry {
  id: string;
  date: Date;
  content: string;
  plainText: string;
  mood: Mood | null;
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
  wordCount: number;
  isLocked: boolean;
  updates: EntryUpdate[];
}

export interface EntryDraft {
  content: string;
  mood: Mood | null;
  tags: string[];
}
