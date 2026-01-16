'use client';

import posthog from 'posthog-js';
import { PostHogProvider as PHProvider } from 'posthog-js/react';
import { useEffect } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';

// Initialize PostHog
if (typeof window !== 'undefined' && process.env.NEXT_PUBLIC_POSTHOG_KEY) {
  posthog.init(process.env.NEXT_PUBLIC_POSTHOG_KEY, {
    api_host: process.env.NEXT_PUBLIC_POSTHOG_HOST || 'https://us.i.posthog.com',
    person_profiles: 'identified_only',
    capture_pageview: false, // We capture manually for better control
    capture_pageleave: true,
  });
}

// Page view tracking component
function PostHogPageView() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (pathname && posthog) {
      let url = window.origin + pathname;
      if (searchParams?.toString()) {
        url = url + '?' + searchParams.toString();
      }
      posthog.capture('$pageview', { $current_url: url });
    }
  }, [pathname, searchParams]);

  return null;
}

// Helper functions for tracking events
export const trackEvent = (eventName: string, properties?: Record<string, any>) => {
  if (posthog) {
    posthog.capture(eventName, properties);
  }
};

// Identify user (call after login)
export const identifyUser = (userId: string, properties?: Record<string, any>) => {
  if (posthog) {
    posthog.identify(userId, properties);
  }
};

// Reset user (call after logout)
export const resetUser = () => {
  if (posthog) {
    posthog.reset();
  }
};

// Pre-defined events for Boundless
export const analytics = {
  // Auth events
  userSignedUp: (method: string) => trackEvent('user_signed_up', { method }),
  userLoggedIn: (method: string) => trackEvent('user_logged_in', { method }),
  userLoggedOut: () => trackEvent('user_logged_out'),

  // Journal events
  entryCreated: (wordCount: number, hasMood: boolean) =>
    trackEvent('entry_created', { word_count: wordCount, has_mood: hasMood }),
  entryUpdated: (wordCount: number) =>
    trackEvent('entry_updated', { word_count: wordCount }),
  entryLocked: () => trackEvent('entry_locked'),
  entryBookmarked: () => trackEvent('entry_bookmarked'),

  // Feature usage
  moodSelected: (mood: string) => trackEvent('mood_selected', { mood }),
  tagAdded: (tag: string) => trackEvent('tag_added', { tag }),
  promptUsed: (category: string) => trackEvent('prompt_used', { category }),
  aiReflectionUsed: (tone: string) => trackEvent('ai_reflection_used', { tone }),
  searchPerformed: (resultCount: number) => trackEvent('search_performed', { result_count: resultCount }),

  // Settings
  themeChanged: (theme: 'light' | 'dark') => trackEvent('theme_changed', { theme }),
  fontChanged: (font: string) => trackEvent('font_changed', { font }),

  // Export
  pdfExported: (entryCount: number) => trackEvent('pdf_exported', { entry_count: entryCount }),
  entryPrinted: () => trackEvent('entry_printed'),
};

export function PostHogProvider({ children }: { children: React.ReactNode }) {
  return (
    <PHProvider client={posthog}>
      <PostHogPageView />
      {children}
    </PHProvider>
  );
}
