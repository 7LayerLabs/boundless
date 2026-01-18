# Boundless - AI Assistant Guide

## Project Overview
Boundless is a digital journaling app with a realistic book aesthetic. Users write daily journal entries with customizable themes, moods, tags, and optional AI reflections.

## Tech Stack
- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4
- **Database**: InstantDB (real-time sync)
- **Editor**: TipTap (rich text)
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **Analytics**: PostHog
- **Auth**: InstantDB built-in auth

## Project Structure
```
src/
├── app/                    # Next.js App Router pages
│   ├── page.tsx           # Main entry (redirects or shows journal)
│   ├── about/             # About page
│   └── program/[id]/      # Guided program writing page
├── components/
│   ├── journal/           # Core journal components (JournalBook, PageContent, etc.)
│   ├── editor/            # TipTap editor, AI reflection, mood selector
│   ├── navigation/        # Sidebar, modals (Calendar, Search, Settings, etc.)
│   ├── program/           # Guided program components (ProgramBook, ProgramEditor)
│   ├── settings/          # Settings panel and sections
│   ├── scene/             # Background scenes (DeskScene)
│   ├── auth/              # Authentication components
│   ├── lock/              # PIN lock screen
│   └── providers/         # React context providers
├── constants/             # Static data (themes, fonts, moods, programs, templates, quotes)
├── hooks/                 # Custom React hooks (useJournal, useSettings)
├── lib/
│   ├── db/instant.ts      # InstantDB schema and initialization
│   ├── crypto/            # PIN hashing utilities
│   └── utils/             # Utility functions (cn for classnames)
└── types/                 # TypeScript type definitions
```

## Key Files
- `src/lib/db/instant.ts` - Database schema (entries, settings, programEntries, notebooks, prompts)
- `src/hooks/useJournal.ts` - Journal entry CRUD operations
- `src/hooks/useSettings.ts` - User settings management
- `src/components/journal/JournalBook.tsx` - Main journal component, manages all state and modals
- `src/components/journal/PageContent.tsx` - Journal page layout with header, toolbar, editor
- `src/constants/programs.ts` - Guided program definitions (prompts, categories)
- `src/constants/themes.ts` - Color themes for binding, pages, dates

## Database Schema (InstantDB)
- **entries**: Journal entries (userId, date, content, mood, tags, wordCount, isLocked, isBookmarked)
- **settings**: User preferences (colors, fonts, darkMode, AI settings, etc.)
- **programEntries**: Guided program responses (userId, programId, promptIndex, content)
- **notebooks**: Multiple notebooks (future feature)
- **prompts**: Custom prompts

## Conventions
- Use `'use client'` directive for client components
- Use `cn()` utility for conditional Tailwind classes (combines clsx + tailwind-merge)
- Dark mode: check `darkMode` from useSettings, apply conditional classes
- Animations: Use Framer Motion's `motion` components with `initial`, `animate`, `exit`
- State: Local state for UI, InstantDB for persistent data
- Styling: Tailwind classes inline, no separate CSS files

## Common Patterns

### Querying Data
```typescript
const { data, isLoading } = db.useQuery({
  entries: {
    $: { where: { userId: user.id } }
  }
});
```

### Updating Data
```typescript
await db.transact([
  tx.entries[entryId].update({ content, updatedAt: Date.now() })
]);
```

### Settings Hook
```typescript
const { darkMode, fontFamily, updateSetting } = useSettings();
updateSetting('darkMode', true);
```

## Commands
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run lint` - Run ESLint

## Features
- **Core**: Daily journaling with rich text editor, mood tracking, tags
- **Customization**: Binding colors, page colors, fonts, dark mode, scenes
- **Organization**: Search, calendar navigation, bookmarks, entry locking
- **Optional Features** (toggleable in sidebar settings):
  - Writing Stats
  - Entry Templates
  - Guided Programs (multi-day structured journaling)
  - Daily Quotes (pin to page or lock across days)
- **AI Reflection**: Optional AI-powered reflection questions (requires API key)
- **Privacy**: Optional PIN lock

## Future Plans
See `MONETIZATION.md` for paid tier planning (Templates, Programs, AI as premium features).
