# Monetization Plan

## Free Tier
- Unlimited journaling
- Basic customization (fonts, colors, binding)
- Date navigation & search
- Mood tracking
- Tags & bookmarks

## Paid Tier (Pro)
- Entry Templates
- Guided Programs
- AI Reflections (has API costs)
- Writing Stats
- Daily Quotes
- PDF Export
- Premium themes/scenes
- Multiple notebooks (future)

## Pricing Options
- Monthly: $5-7/mo
- Lifetime: $49-79 (one-time)
- Offer both, let users choose

## Implementation Notes
- Use Stripe for payments
- Store subscription status in InstantDB (add `isPro` or `subscription` field to settings)
- Gate features with simple `isPro` check
- Consider free trial period for Pro features

## TODO
- [ ] Set up Stripe account
- [ ] Add subscription schema to database
- [ ] Create paywall component
- [ ] Add upgrade prompts on gated features
- [ ] Build settings page subscription management
- [ ] Implement Stripe webhook handlers
