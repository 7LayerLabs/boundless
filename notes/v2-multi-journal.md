# V2 Feature: Multiple Journals Per User

## Overview
Allow users to create and manage multiple journal books (max 5) instead of a single journal. When logging in, users see their collection of journals on a bookshelf-style view.

## Core Requirements

### Journal Collection View (Post-Login)
- Display all user's journals as physical books on a shelf/desk
- Maximum of 5 journals per user
- "Add New Journal" option (if under 5)
- Click a book to open and start writing

### Individual Journal Customization

#### Book Cover Colors
- Leather color options: brown, black, burgundy, navy, forest green, tan
- Custom color picker option
- Maintains realistic leather texture with chosen color

#### Label/Sticker System
- Decorative sticker/label on book cover
- Preset categories:
  - Personal
  - Work
  - Dreams
  - Gratitude
  - Travel
  - Health
  - Ideas
  - Custom text option
- Sticker styles:
  - Classic embossed gold
  - Handwritten tag
  - Vintage label
  - Modern minimal
  - Wax seal style

### Journal Properties
- Title/name (displayed on spine or cover)
- Description (optional)
- Icon or emoji
- Created date
- Last entry date
- Entry count
- Color theme
- Label/sticker type and text

## Database Schema Changes

```typescript
// Update notebooks entity
notebooks: i.entity({
  userId: i.string(),
  name: i.string(),
  description: i.string().optional(),

  // Cover customization
  coverColor: i.string(), // hex or preset name
  labelType: i.string().optional(), // 'embossed', 'handwritten', 'vintage', 'minimal', 'wax-seal'
  labelText: i.string().optional(), // 'Personal', 'Work', custom text, etc.
  labelPreset: i.string().optional(), // preset category if using one

  // Display
  icon: i.string().optional(),
  sortOrder: i.number().optional(),

  // Stats (computed or stored)
  entryCount: i.number().optional(),
  lastEntryAt: i.number().optional(),

  isDefault: i.boolean().optional(),
  createdAt: i.number(),
  updatedAt: i.number(),
}),
```

## UI Components Needed

### 1. BookshelfView
- Grid/shelf layout showing all journals
- Book hover effects (slight lift, glow)
- Add new book button/slot

### 2. JournalCustomizer
- Color picker for cover
- Label/sticker selector
- Preview of book with changes
- Name and description inputs

### 3. BookCoverPreview
- Real-time preview of customization
- Shows selected color + label combo

### 4. NewJournalModal
- Step-by-step creation flow
- Choose color -> Choose label -> Name it -> Create

## User Flow

1. **First Login (New User)**
   - Auto-create one default journal
   - Show brief intro/tutorial
   - Option to customize or start writing

2. **Returning User**
   - See bookshelf with all journals
   - Click to open any journal
   - Quick stats visible (last entry, count)

3. **Creating New Journal**
   - Click "+" or empty book slot
   - Customize appearance
   - Name and describe
   - Start writing

4. **Managing Journals**
   - Long-press or menu for options
   - Edit appearance
   - Delete (with confirmation)
   - Reorder on shelf

## Design Considerations

- Books should look realistic and inviting
- Stickers/labels should feel handcrafted
- Smooth animations between views
- Responsive for mobile (stack books vertically)
- Dark mode support for bookshelf view

## V2 Additional Features

### Smart Relationships (Entity Tracker)
Allow users to define and track people, places, dates, and things in their journal:

- **Entity Library**: Users can create profiles for:
  - People (family, friends, coworkers)
  - Places (home, work, favorite spots)
  - Events/Dates (anniversaries, milestones)
  - Custom categories

- **Auto-Recognition**: When journaling, the app recognizes mentions and:
  - Highlights linked entities
  - Shows relationship context
  - Tracks frequency of mentions

- **Relationship Insights**:
  - "You mention Sarah most when feeling anxious"
  - "Coffee shop appears in 80% of your creative entries"
  - Timeline of entity mentions

- **Privacy-First**:
  - All processing done locally
  - Opt-in feature
  - No data leaves device

**Complexity**: High (requires NLP/entity recognition)
**Tier**: Pro feature

---

## Future Enhancements (V3+)
- Journal templates (pre-filled prompts for specific types)
- Export individual journals
- Archive old journals (beyond 5 limit)
- Share journals (read-only)
- Journal cover image upload
