# Boundless V2

**The journal that feels real.** A beautiful digital journaling app with a skeuomorphic book aesthetic, 42 guided programs, AI reflections, and deep customization.

## Features

### Free Tier
- ✅ Unlimited journal entries
- ✅ Beautiful book aesthetic (leather binding, paper textures)
- ✅ Full customization (fonts, colors, bindings)
- ✅ Mood tracking with insights
- ✅ Tags & bookmarks
- ✅ Search & calendar navigation
- ✅ Dark mode
- ✅ PIN lock for privacy

### Pro Tier ($7.99/mo, $59/yr, or $149 lifetime)
- ⭐ 42 Guided Programs (multi-day journaling journeys)
- ⭐ AI Reflections (thoughtful questions about your writing)
- ⭐ Entry Templates (quick-start formats)
- ⭐ Writing Stats (track words, entries & streaks)
- ⭐ Daily Quotes (curated inspiration)
- ⭐ PDF Export

## Tech Stack

- **Framework:** Next.js 16 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS v4
- **Database:** InstantDB (real-time sync, built-in auth)
- **Editor:** TipTap (rich text)
- **Animations:** Framer Motion
- **Payments:** Stripe
- **Hosting:** Vercel

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- Stripe account (for payments)
- InstantDB account (for database)

### Installation

```bash
# Clone the repository
git clone https://github.com/Milobuilds45/boundless-v2.git
cd boundless-v2

# Install dependencies
npm install

# Copy environment template
cp .env.example .env.local

# Fill in your environment variables (see below)

# Run development server
npm run dev
```

### Environment Variables

Create a `.env.local` file with:

```env
# Stripe (from https://dashboard.stripe.com)
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_xxxxx
STRIPE_SECRET_KEY=sk_test_xxxxx
STRIPE_WEBHOOK_SECRET=whsec_xxxxx

# Stripe Price IDs (create in Stripe Dashboard)
NEXT_PUBLIC_STRIPE_PRICE_MONTHLY=price_xxxxx
NEXT_PUBLIC_STRIPE_PRICE_YEARLY=price_xxxxx
NEXT_PUBLIC_STRIPE_PRICE_LIFETIME=price_xxxxx

# App URL
NEXT_PUBLIC_APP_URL=http://localhost:3000

# PostHog (optional, for analytics)
NEXT_PUBLIC_POSTHOG_KEY=
NEXT_PUBLIC_POSTHOG_HOST=https://us.i.posthog.com
```

### Stripe Setup

1. Create a Stripe account at https://stripe.com
2. Create three products in the Stripe Dashboard:
   - **Pro Monthly:** $7.99/month recurring
   - **Pro Yearly:** $59/year recurring  
   - **Pro Lifetime:** $149 one-time
3. Copy the Price IDs to your `.env.local`
4. Set up a webhook endpoint at `/api/stripe/webhooks` for:
   - `checkout.session.completed`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
   - `invoice.payment_succeeded`
   - `invoice.payment_failed`

## Deployment

### Deploy to Vercel

1. Push to GitHub
2. Import project in Vercel
3. Add environment variables in Vercel dashboard
4. Deploy!

Or use the Vercel CLI:

```bash
npm i -g vercel
vercel
```

### Webhook URL

After deployment, update your Stripe webhook endpoint to:
```
https://your-domain.vercel.app/api/stripe/webhooks
```

## Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── api/stripe/        # Stripe API routes
│   └── ...
├── components/
│   ├── auth/              # Authentication components
│   ├── editor/            # TipTap editor & tools
│   ├── journal/           # Journal book components
│   ├── navigation/        # Sidebar & modals
│   ├── settings/          # Settings panel
│   └── subscription/      # Paywall & subscription
├── constants/             # App constants (programs, quotes, etc.)
├── hooks/                 # React hooks
├── lib/
│   ├── db/               # InstantDB setup
│   └── stripe/           # Stripe config
└── types/                # TypeScript types
```

## License

Private - All rights reserved

---

Built with ❤️ by Derek
