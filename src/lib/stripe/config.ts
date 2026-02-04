// Stripe configuration
// These will be set via environment variables in production

export const STRIPE_PRICES = {
  monthly: process.env.NEXT_PUBLIC_STRIPE_PRICE_MONTHLY || 'price_monthly_placeholder',
  yearly: process.env.NEXT_PUBLIC_STRIPE_PRICE_YEARLY || 'price_yearly_placeholder',
  lifetime: process.env.NEXT_PUBLIC_STRIPE_PRICE_LIFETIME || 'price_lifetime_placeholder',
} as const;

export const STRIPE_CONFIG = {
  publishableKey: process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || '',
  successUrl: typeof window !== 'undefined' ? `${window.location.origin}/?success=true` : '',
  cancelUrl: typeof window !== 'undefined' ? `${window.location.origin}/?canceled=true` : '',
};

export type PricePlan = keyof typeof STRIPE_PRICES;

export const PLAN_DETAILS: Record<PricePlan, { name: string; price: string; description: string; interval?: string }> = {
  monthly: {
    name: 'Pro Monthly',
    price: '$7.99',
    description: 'Billed monthly, cancel anytime',
    interval: 'month',
  },
  yearly: {
    name: 'Pro Yearly',
    price: '$59',
    description: 'Save 38% — billed annually',
    interval: 'year',
  },
  lifetime: {
    name: 'Pro Lifetime',
    price: '$149',
    description: 'One-time payment, forever access',
  },
};

// Pro features list for paywall
export const PRO_FEATURES = [
  {
    icon: '🧭',
    title: '42 Guided Programs',
    description: 'Multi-day journeys for real transformation',
  },
  {
    icon: '✨',
    title: 'AI Reflections',
    description: 'Thoughtful questions that help you explore deeper',
  },
  {
    icon: '📝',
    title: 'Entry Templates',
    description: 'Ready-made structures for different journaling styles',
  },
  {
    icon: '📊',
    title: 'Writing Stats',
    description: 'Track your words, streaks, and progress',
  },
  {
    icon: '💬',
    title: 'Daily Quotes',
    description: 'Curated inspiration to start your writing',
  },
  {
    icon: '📄',
    title: 'PDF Export',
    description: 'Export your journal entries beautifully',
  },
];
