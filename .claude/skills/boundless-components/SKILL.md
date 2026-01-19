---
name: boundless-components
description: Create React components for Boundless journaling app. Use when building new UI components, pages, modals, or features. Follows project patterns with TypeScript, Framer Motion animations, and the warm literary aesthetic.
allowed-tools: Read, Write, Edit, Glob, Grep
---

# Boundless Component Creation

## Project Stack

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS + inline styles for custom colors
- **Animation**: Framer Motion
- **Icons**: Lucide React
- **Database**: InstantDB (real-time)
- **Editor**: TipTap

## Component Patterns

### Basic Component Structure

```tsx
'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { IconName } from 'lucide-react';

interface ComponentProps {
  // Props with TypeScript types
}

export function ComponentName({ prop }: ComponentProps) {
  // State and hooks

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {/* Content */}
    </motion.div>
  );
}
```

### Key Conventions

1. **Always use `'use client'`** at top of component files
2. **Export named functions**, not default exports
3. **Use Framer Motion** for all animations
4. **TypeScript interfaces** for all props
5. **No emojis** unless user explicitly requests them

## File Locations

| Type | Location |
|------|----------|
| Pages | `src/app/[route]/page.tsx` |
| Components | `src/components/[category]/ComponentName.tsx` |
| Hooks | `src/hooks/useHookName.ts` |
| Constants | `src/constants/[name].ts` |
| Utils | `src/lib/utils/[name].ts` |

## Animation Patterns

### Page/Modal Enter

```tsx
<motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  exit={{ opacity: 0, y: -10 }}
  transition={{ duration: 0.3 }}
>
```

### Staggered Children

```tsx
<motion.div
  initial={{ opacity: 0 }}
  animate={{ opacity: 1 }}
  transition={{ staggerChildren: 0.1 }}
>
  {items.map((item, i) => (
    <motion.div
      key={item.id}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: i * 0.1 }}
    />
  ))}
</motion.div>
```

### Hover Effects

```tsx
<motion.button
  whileHover={{ scale: 1.02 }}
  whileTap={{ scale: 0.98 }}
  transition={{ type: 'spring', stiffness: 400 }}
>
```

## Modal Pattern

```tsx
<AnimatePresence>
  {isOpen && (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center"
      style={{ background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)' }}
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        className="bg-white rounded-2xl p-6 max-w-md w-full mx-4"
      >
        {/* Modal content */}
      </motion.div>
    </motion.div>
  )}
</AnimatePresence>
```

## Error Boundaries

Wrap complex components:

```tsx
import { ErrorBoundary } from '@/components/ErrorBoundary';

<ErrorBoundary title="Error title" description="Error description">
  <YourComponent />
</ErrorBoundary>
```

## Supporting Files

- See [patterns.md](patterns.md) for more component examples
- See [animations.md](animations.md) for animation recipes
