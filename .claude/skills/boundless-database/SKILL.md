---
name: boundless-database
description: Work with InstantDB database in Boundless. Use when querying data, creating transactions, updating entries, or working with the schema. Covers entries, settings, and real-time subscriptions.
allowed-tools: Read, Write, Edit, Glob, Grep
---

# Boundless Database (InstantDB)

## Setup

```tsx
import { db } from '@/lib/db/instant';
import { id, tx } from '@instantdb/react';
```

## Schema Location

Schema defined in: `src/lib/db/instant.ts`

## Data Types

### Entry (Journal Entry)

```typescript
interface Entry {
  id: string;
  userId: string;
  date: string;           // "YYYY-MM-DD"
  content: string;        // TipTap JSON or HTML
  mood?: string;          // "happy" | "sad" | "anxious" | etc.
  tags?: string[];
  isBookmarked?: boolean;
  isLocked?: boolean;
  images?: { id: string; url: string; caption?: string; size?: number }[];
  createdAt: number;
  updatedAt: number;
}
```

### UserSettings

```typescript
interface UserSettings {
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
  pinHash?: string;
  aiReflectionEnabled?: boolean;
  aiApiKey?: string;
  scene: string;
  createdAt: number;
  updatedAt: number;
}
```

## Querying Data

### Basic Query

```tsx
const { data, isLoading, error } = db.useQuery({
  entries: {
    $: {
      where: {
        userId: user.id,
        date: "2026-01-18"
      }
    }
  }
});

const entries = data?.entries || [];
```

### Query with Conditional

```tsx
const query = user ? {
  settings: {
    $: {
      where: { userId: user.id }
    }
  }
} : null;

const { data } = db.useQuery(query);
```

### Query Multiple Tables

```tsx
const { data } = db.useQuery({
  entries: {
    $: { where: { userId: user.id } }
  },
  settings: {
    $: { where: { userId: user.id } }
  }
});
```

## Transactions (Write Operations)

### Create New Record

```tsx
const entryId = id(); // Generate new ID

await db.transact([
  tx.entries[entryId].update({
    userId: user.id,
    date: "2026-01-18",
    content: "",
    createdAt: Date.now(),
    updatedAt: Date.now(),
  })
]);
```

### Update Existing Record

```tsx
await db.transact([
  tx.entries[entryId].update({
    content: newContent,
    updatedAt: Date.now(),
  })
]);
```

### Delete Record

```tsx
await db.transact([
  tx.entries[entryId].delete()
]);
```

### Multiple Operations

```tsx
await db.transact([
  tx.entries[id1].update({ isBookmarked: true }),
  tx.entries[id2].update({ isBookmarked: false }),
  tx.settings[settingsId].update({ updatedAt: Date.now() }),
]);
```

## Authentication

### Get Current User

```tsx
const { isLoading, user, error } = db.useAuth();
```

### Sign Out

```tsx
await db.auth.signOut();
```

### Magic Code Auth

```tsx
// Send code
await db.auth.sendMagicCode({ email });

// Verify code
await db.auth.signInWithMagicCode({ email, code });
```

## Common Patterns

### Create Entry for Today

```tsx
const createEntry = async () => {
  const entryId = id();
  const today = new Date().toISOString().split('T')[0];

  await db.transact([
    tx.entries[entryId].update({
      userId: user.id,
      date: today,
      content: '',
      createdAt: Date.now(),
      updatedAt: Date.now(),
    })
  ]);

  return entryId;
};
```

### Toggle Bookmark

```tsx
const toggleBookmark = async (entryId: string, current: boolean) => {
  await db.transact([
    tx.entries[entryId].update({
      isBookmarked: !current,
      updatedAt: Date.now(),
    })
  ]);
};
```

### Update Settings

```tsx
const updateSettings = async (settingsId: string, updates: Partial<UserSettings>) => {
  await db.transact([
    tx.settings[settingsId].update({
      ...updates,
      updatedAt: Date.now(),
    })
  ]);
};
```

## Error Handling

```tsx
try {
  await db.transact([...]);
} catch (err: any) {
  if (err.message?.includes('Record not found')) {
    // Handle stale session
    await db.auth.signOut();
  }
  console.error('Database error:', err);
}
```

## Real-Time Updates

InstantDB queries are automatically real-time. When data changes anywhere, all subscribed components update immediately. No manual refresh needed.
