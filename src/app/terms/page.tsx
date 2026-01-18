'use client';

import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default function TermsOfService() {
  return (
    <div
      className="min-h-screen"
      style={{
        background: '#faf8f3',
        fontFamily: 'var(--font-playfair), Georgia, serif',
      }}
    >
      {/* Header */}
      <header className="border-b border-stone-200">
        <div className="max-w-3xl mx-auto px-6 py-6">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm transition-colors hover:text-amber-700"
            style={{ color: '#8b7355' }}
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Boundless
          </Link>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-3xl mx-auto px-6 py-12">
        <h1
          className="text-4xl font-medium mb-2"
          style={{ color: '#2c1810' }}
        >
          Terms of Service
        </h1>
        <p className="text-sm mb-12" style={{ color: '#8b7355' }}>
          Last updated: January 18, 2026
        </p>

        <div
          className="prose prose-stone max-w-none"
          style={{
            color: '#4a3f35',
            fontFamily: 'system-ui, sans-serif',
            lineHeight: 1.8,
          }}
        >
          <section className="mb-10">
            <h2
              className="text-xl font-medium mb-4"
              style={{ color: '#2c1810', fontFamily: 'var(--font-playfair), Georgia, serif' }}
            >
              1. Acceptance of Terms
            </h2>
            <p>
              By accessing or using Boundless ("the Service"), you agree to be bound by these Terms of Service.
              If you do not agree to these terms, please do not use the Service.
            </p>
          </section>

          <section className="mb-10">
            <h2
              className="text-xl font-medium mb-4"
              style={{ color: '#2c1810', fontFamily: 'var(--font-playfair), Georgia, serif' }}
            >
              2. Description of Service
            </h2>
            <p>
              Boundless is a digital journaling application that allows you to write, organize, and reflect on
              your personal thoughts and experiences. The Service includes free features and optional premium
              features available through subscription or one-time purchase.
            </p>
          </section>

          <section className="mb-10">
            <h2
              className="text-xl font-medium mb-4"
              style={{ color: '#2c1810', fontFamily: 'var(--font-playfair), Georgia, serif' }}
            >
              3. Your Content
            </h2>
            <p className="mb-4">
              <strong>Ownership:</strong> You retain full ownership of all content you create using Boundless,
              including journal entries, notes, and any other personal writing.
            </p>
            <p className="mb-4">
              <strong>Privacy:</strong> Your journal entries are private. We do not read, analyze, sell, share,
              or use your personal journal content for any purpose, including marketing, advertising, or AI training.
            </p>
            <p>
              <strong>Responsibility:</strong> You are solely responsible for the content you create and store
              using the Service.
            </p>
          </section>

          <section className="mb-10">
            <h2
              className="text-xl font-medium mb-4"
              style={{ color: '#2c1810', fontFamily: 'var(--font-playfair), Georgia, serif' }}
            >
              4. Account Security
            </h2>
            <p>
              You are responsible for maintaining the confidentiality of your account credentials and PIN.
              You agree to notify us immediately of any unauthorized access to your account.
            </p>
          </section>

          <section className="mb-10">
            <h2
              className="text-xl font-medium mb-4"
              style={{ color: '#2c1810', fontFamily: 'var(--font-playfair), Georgia, serif' }}
            >
              5. Acceptable Use
            </h2>
            <p className="mb-4">You agree not to:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Use the Service for any illegal purpose</li>
              <li>Attempt to gain unauthorized access to the Service or its systems</li>
              <li>Interfere with or disrupt the Service</li>
              <li>Reverse engineer or attempt to extract the source code of the Service</li>
            </ul>
          </section>

          <section className="mb-10">
            <h2
              className="text-xl font-medium mb-4"
              style={{ color: '#2c1810', fontFamily: 'var(--font-playfair), Georgia, serif' }}
            >
              6. Subscriptions and Payments
            </h2>
            <p className="mb-4">
              Premium features are available through monthly subscription or lifetime purchase.
              Subscription fees are billed in advance on a monthly basis.
            </p>
            <p>
              You may cancel your subscription at any time. Cancellation will take effect at the end of
              your current billing period.
            </p>
          </section>

          <section className="mb-10">
            <h2
              className="text-xl font-medium mb-4"
              style={{ color: '#2c1810', fontFamily: 'var(--font-playfair), Georgia, serif' }}
            >
              7. Disclaimer of Warranties
            </h2>
            <p>
              The Service is provided "as is" without warranties of any kind, either express or implied.
              We do not guarantee that the Service will be uninterrupted, secure, or error-free.
            </p>
          </section>

          <section className="mb-10">
            <h2
              className="text-xl font-medium mb-4"
              style={{ color: '#2c1810', fontFamily: 'var(--font-playfair), Georgia, serif' }}
            >
              8. Limitation of Liability
            </h2>
            <p>
              To the maximum extent permitted by law, Boundless shall not be liable for any indirect,
              incidental, special, consequential, or punitive damages resulting from your use of the Service.
            </p>
          </section>

          <section className="mb-10">
            <h2
              className="text-xl font-medium mb-4"
              style={{ color: '#2c1810', fontFamily: 'var(--font-playfair), Georgia, serif' }}
            >
              9. Changes to Terms
            </h2>
            <p>
              We may update these Terms from time to time. We will notify you of significant changes by
              posting the new Terms on this page with an updated revision date.
            </p>
          </section>

          <section className="mb-10">
            <h2
              className="text-xl font-medium mb-4"
              style={{ color: '#2c1810', fontFamily: 'var(--font-playfair), Georgia, serif' }}
            >
              10. Contact
            </h2>
            <p>
              If you have questions about these Terms, please contact us at{' '}
              <a href="mailto:support@boundlessjournal.com" className="text-amber-700 hover:underline">
                support@boundlessjournal.com
              </a>
            </p>
          </section>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-stone-200 mt-12">
        <div className="max-w-3xl mx-auto px-6 py-8">
          <div className="flex flex-wrap gap-6 text-sm" style={{ color: '#8b7355' }}>
            <Link href="/privacy" className="hover:text-amber-700 transition-colors">
              Privacy Policy
            </Link>
            <Link href="/terms" className="hover:text-amber-700 transition-colors">
              Terms of Service
            </Link>
          </div>
          <p className="text-xs mt-4" style={{ color: '#a89a8c' }}>
            © 2026 Boundless. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
