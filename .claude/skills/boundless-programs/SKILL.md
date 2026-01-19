---
name: boundless-programs
description: Create or edit guided journaling programs for Boundless. Use when adding new programs, writing prompts, or organizing program categories. Programs are structured multi-day journeys with daily writing prompts.
allowed-tools: Read, Write, Edit, Glob
---

# Boundless Guided Programs

## Overview

Guided programs are structured journaling journeys with daily prompts. Each program belongs to a category and has a specific duration (14, 21, or 30 days).

## File Location

All programs defined in: `src/constants/programs.ts`

## Program Structure

```typescript
interface GuidedProgram {
  id: string;              // Unique identifier (kebab-case)
  name: string;            // Display name
  description: string;     // Brief tagline
  icon: string;            // Single emoji
  color: string;           // Tailwind classes for styling
  category: ProgramCategory;
  duration: number;        // Days (14, 21, or 30)
  prompts: string[];       // Array of daily prompts
}
```

## Categories

```typescript
type ProgramCategory = 'wellness' | 'legacy' | 'business' | 'relationships';
```

| Category | Name | Icon | Description |
|----------|------|------|-------------|
| wellness | Wellness & Growth | 🌱 | Personal development and mindfulness |
| legacy | My Story & Legacy | 📖 | Preserve memories and life stories |
| business | Business & Dreams | 🚀 | Plan, build, and achieve your goals |
| relationships | Relationships | ❤️ | Strengthen bonds with loved ones |

## Adding a New Program

### 1. Choose Category

Pick the most appropriate category for your program.

### 2. Define Program Object

```typescript
{
  id: 'program-name',           // lowercase-with-hyphens
  name: 'Program Display Name',
  description: 'Brief compelling tagline',
  icon: '🎯',                   // Single relevant emoji
  color: 'bg-blue-50 border-blue-300',  // Tailwind color classes
  category: 'business',         // One of the 4 categories
  duration: 21,                 // Match prompt count
  prompts: [
    // Array of exactly `duration` prompts
  ],
}
```

### 3. Add to Array

Add your program to the `guidedPrograms` array in the appropriate category section.

## Writing Effective Prompts

### Principles

1. **Chronological or Logical Order**: Prompts should build on each other
2. **Start Broad, Go Deep**: Begin with accessible topics, deepen over time
3. **End with Reflection**: Final prompt should synthesize the journey
4. **Be Specific**: "Describe a specific moment when..." not "Write about happiness"
5. **Invite Story**: Ask for memories, examples, specific people/events

### Prompt Structure Patterns

**By Duration:**

- **14-day programs**: Focus, 2-week sprint
  - Days 1-4: Foundation/Introduction
  - Days 5-10: Deep exploration
  - Days 11-14: Synthesis/Action

- **21-day programs**: Comprehensive journey
  - Week 1: Building awareness
  - Week 2: Deep work
  - Week 3: Integration and forward-looking

- **30-day programs**: Thorough exploration
  - Days 1-7: Setting foundation
  - Days 8-21: Core exploration (chronological or thematic)
  - Days 22-29: Synthesis and meaning-making
  - Day 30: Big picture reflection

### Example Prompts by Type

**Memory-Based:**
- "Describe your earliest memory of [topic]. What do you see, hear, and feel?"
- "Write about a specific moment when [experience]. Who was there?"

**Reflection:**
- "What has [topic] taught you about yourself?"
- "How has your relationship with [topic] changed over time?"

**Future-Oriented:**
- "What do you hope [topic] looks like in 5 years?"
- "What would you tell your future self about [topic]?"

**Relationship:**
- "Write about someone who [specific influence]. What did they teach you?"
- "Describe a conversation that changed how you see [topic]."

## Color Palette for Programs

| Category | Suggested Colors |
|----------|------------------|
| wellness | amber, purple, teal, rose |
| legacy | amber, pink, green |
| business | blue, indigo, orange |
| relationships | red, sky, violet, cyan |

Format: `bg-{color}-50 border-{color}-200` or `border-{color}-300`

## Example: Complete New Program

```typescript
{
  id: 'creativity-unleashed',
  name: 'Creativity Unleashed',
  description: 'Rediscover and nurture your creative spirit',
  icon: '🎨',
  color: 'bg-violet-50 border-violet-300',
  category: 'wellness',
  duration: 21,
  prompts: [
    // Week 1: Discovering your creative history
    "What's your earliest memory of creating something? Describe the moment.",
    "Who encouraged your creativity as a child? What did they say or do?",
    "What creative activities did you love but stopped doing? Why?",
    "Describe a time when you felt completely absorbed in creating something.",
    "What does creativity mean to you? How would you define it?",
    "What creative work by someone else has deeply moved you? Why?",
    "What fears or blocks do you have around creativity?",

    // Week 2: Exploring creative expression
    "If you had no fear of judgment, what would you create?",
    "What everyday moments feel creative to you?",
    "Describe your ideal creative space. What does it look like?",
    "What creative risks have you taken? What happened?",
    "How does creativity connect to other parts of your life?",
    "Write about a creative failure that taught you something.",
    "What creative project have you been putting off? Why?",

    // Week 3: Building a creative future
    "What does a creative life look like to you?",
    "How can you make more space for creativity in your routine?",
    "Who in your life supports your creative pursuits?",
    "What small creative act could you do today?",
    "How has your relationship with creativity evolved?",
    "What creative legacy do you want to leave?",
    "After this journey, what's one commitment you're making to your creativity?",
  ],
}
```

## Testing New Programs

After adding a program:
1. Check it appears in the Programs sidebar
2. Verify all prompts load correctly
3. Test starting and progressing through the program
4. Ensure the day count matches the prompts array length
