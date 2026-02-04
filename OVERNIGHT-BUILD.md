# Boundless V2 — Overnight Build Instructions

## Mission
Rebuild Boundless journaling app. Keep the core, make it better, cleaner, smoother. Add monetization.

## Source
- Original: `C:\Users\derek\OneDrive\Desktop\MILO\projects\boundless-rebuild`
- New Repo: `https://github.com/Milobuilds45/boundless-v2`

## Tech Stack (Keep)
- Next.js 16 (App Router)
- TypeScript
- Tailwind CSS v4
- InstantDB (database + auth)
- TipTap (rich text editor)
- Framer Motion (animations)

## Core Features (Must Keep)
1. Journal entry creation with rich text
2. Skeuomorphic book aesthetic (leather binding, customizable)
3. Mood tracking
4. 42 guided programs (5 categories)
5. Calendar navigation
6. Search and tags
7. AI reflections (BYOK)
8. Dark mode
9. PIN lock
10. PDF export

## What to Improve
1. **Cleaner UI** — More whitespace, better typography hierarchy
2. **Smoother animations** — Page turns, transitions
3. **Better onboarding** — First-time user experience
4. **Mobile responsiveness** — PWA-ready, touch-friendly
5. **Performance** — Fast load, smooth scrolling

## Monetization (Add)
Stripe integration with:
- Free tier: Basic journaling, customization, mood tracking
- Pro ($7.99/mo or $59/yr or $149 lifetime):
  - AI reflections
  - Guided programs
  - Entry templates
  - Writing stats
  - Daily quotes

### Stripe Implementation
1. Add Stripe SDK
2. Create subscription tiers in Stripe dashboard
3. Add `isPro`, `subscriptionId`, `subscriptionEndDate` to InstantDB settings
4. Create paywall modal component
5. Gate Pro features with `isPro` check
6. Add webhook handlers for subscription events
7. Settings page subscription management

## Design Direction
- Keep leather book aesthetic
- Color: Amber accent (#F59E0B) on dark background
- Fonts: Inter + JetBrains Mono
- Vibe: "Terminal Luxury" — premium but warm

## Deliverables by 7 AM
1. Clean, working app with all core features
2. Stripe integration complete (ready to test)
3. Deployed to Vercel
4. Code pushed to Milobuilds45/boundless-v2

## Git Credentials
- Username: Milobuilds45
- PAT: [REDACTED]

---

*Build with pride. Ship by morning.*
