---
name: boundless-design
description: Apply Boundless design system and styling. Use when styling components, creating UI, choosing colors, or building pages. Follows the warm literary luxury aesthetic with cream backgrounds, brown text, and gold accents.
allowed-tools: Read, Write, Edit, Glob
---

# Boundless Design System

## Brand Aesthetic

**Literary Luxury** - A warm, elegant journal feel like a premium leather-bound book.

## Color Palette

### Primary Colors

| Name | Hex | Usage |
|------|-----|-------|
| Cream Background | `#faf8f3` | Page backgrounds |
| Dark Brown | `#2c1810` | Primary text, headers |
| Medium Brown | `#5c3d2e` | Body text |
| Light Brown | `#8b7355` | Secondary text, labels |
| Gold Accent | `#d4a574` | Buttons, highlights, accents |
| Muted Gold | `#a89a8c` | Subtle accents |

### Dark Theme (Modals, Cards)

| Name | Hex | Usage |
|------|-----|-------|
| Dark Background | `#1a1816` | Modal backgrounds |
| Dark Card | `#2c1810` | Card backgrounds |
| Light Text | `rgba(240, 230, 210, 0.9)` | Primary text on dark |
| Muted Text | `rgba(180, 170, 150, 0.6)` | Secondary text on dark |

### Semantic Colors

| Name | Hex | Usage |
|------|-----|-------|
| Error | `#c47070` | Error messages |
| Success | `#22c55e` | Success states (green-500) |

## Typography

### Font Families

```css
/* Display/Headlines - Playfair Display */
font-family: var(--font-playfair), Georgia, serif;

/* Journal Writing - Caveat */
font-family: var(--font-caveat), cursive;

/* Body/UI - System */
font-family: system-ui, sans-serif;
```

### Usage

- **Playfair Display**: Page titles, hero headlines, section headers
- **Caveat**: Journal entry content (user's writing)
- **System UI**: Labels, buttons, small text, UI elements

## Common Styles

### Page Container (Light)

```tsx
<div
  className="min-h-screen"
  style={{
    background: '#faf8f3',
    fontFamily: 'var(--font-playfair), Georgia, serif',
  }}
>
```

### Dark Card/Modal

```tsx
<div
  style={{
    background: '#1a1816',
    borderRadius: '12px',
    boxShadow: `
      0 25px 50px rgba(0, 0, 0, 0.5),
      0 0 0 1px rgba(255, 255, 255, 0.05),
      inset 0 1px 0 rgba(255, 255, 255, 0.05)
    `,
  }}
>
```

### Gold Accent Line

```tsx
<div
  className="h-px"
  style={{ background: 'rgba(212, 175, 55, 0.3)' }}
/>
```

### Primary Button (Dark)

```tsx
<button
  className="px-6 py-3 rounded-full font-medium transition-colors"
  style={{
    background: '#2c1810',
    color: '#faf8f3',
  }}
>
```

### Primary Button (Gold)

```tsx
<button
  className="px-6 py-3 rounded-full font-medium transition-colors"
  style={{
    background: '#d4a574',
    color: '#2c1810',
  }}
>
```

### Ghost Button

```tsx
<button
  className="px-4 py-2 rounded-lg transition-all"
  style={{
    background: 'rgba(212, 175, 55, 0.15)',
    border: '1px solid rgba(212, 175, 55, 0.3)',
    color: 'rgba(212, 175, 55, 0.9)',
  }}
>
```

### Input Field (Dark Theme)

```tsx
<input
  className="w-full px-4 py-3 rounded-lg transition-all"
  style={{
    background: 'rgba(255, 255, 255, 0.05)',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    color: 'rgba(240, 230, 210, 0.9)',
    outline: 'none',
  }}
/>
```

## Section Patterns

### Feature Card

```tsx
<div className="p-8 bg-white/60 backdrop-blur-sm rounded-2xl border border-[#2c1810]/5 hover:border-[#d4a574]/30 transition-all">
  <div className="w-12 h-12 bg-[#2c1810]/5 rounded-xl flex items-center justify-center text-[#8b4513] mb-5">
    <Icon className="w-6 h-6" />
  </div>
  <h3 className="font-serif text-xl font-semibold text-[#2c1810] mb-2">
    Title
  </h3>
  <p className="text-[#5c3d2e]/70 leading-relaxed">
    Description
  </p>
</div>
```

### Section Header

```tsx
<div className="text-center mb-16">
  <h2 className="font-serif text-4xl md:text-5xl font-bold text-[#2c1810] mb-4">
    Section Title
  </h2>
  <p className="text-lg text-[#5c3d2e]/70 max-w-xl mx-auto">
    Subtitle text
  </p>
</div>
```

### Pro Badge

```tsx
<div className="inline-flex items-center gap-2 px-4 py-2 bg-[#d4a574]/20 rounded-full">
  <Star className="w-4 h-4 text-[#d4a574] fill-current" />
  <span className="text-sm font-medium text-[#d4a574]">Pro Feature</span>
</div>
```

## Spacing Guidelines

- **Section padding**: `py-32 px-6`
- **Card padding**: `p-6` to `p-8`
- **Component gaps**: `gap-4` to `gap-6`
- **Text margins**: `mb-2` to `mb-4` for headings, `mb-6` to `mb-8` for sections

## Border Radius

- **Cards/Modals**: `rounded-2xl` or `rounded-3xl`
- **Buttons**: `rounded-full` or `rounded-lg`
- **Inputs**: `rounded-lg`
- **Small elements**: `rounded-md`

## Shadow Styles

### Subtle

```css
shadow-lg
```

### Prominent

```css
shadow-xl hover:shadow-2xl
```

### Custom Dark Shadow

```tsx
boxShadow: '0 25px 50px rgba(0, 0, 0, 0.5)'
```

## Responsive Breakpoints

Use Tailwind defaults:
- `sm:` 640px
- `md:` 768px
- `lg:` 1024px
- `xl:` 1280px

Common pattern:
```tsx
className="text-4xl md:text-5xl lg:text-6xl"
className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
className="px-6 md:px-8 lg:px-12"
```
