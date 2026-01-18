'use client';

import Link from 'next/link';
import { ArrowLeft, Shield, Lock, Eye, Ban } from 'lucide-react';

// Section heading component with gold-accented numbers
function SectionHeading({ number, title }: { number: number; title: string }) {
  return (
    <h2
      className="text-xl font-medium mb-5 flex items-baseline gap-2"
      style={{ fontFamily: 'var(--font-playfair), Georgia, serif' }}
    >
      <span style={{ color: '#d4a574' }}>{number}.</span>
      <span style={{ color: '#2c1810' }}>{title}</span>
    </h2>
  );
}

export default function PrivacyPolicy() {
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
        <div className="max-w-3xl mx-auto px-6 py-5">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm font-medium px-3 py-2 -ml-3 rounded-lg transition-all hover:bg-stone-100"
            style={{ color: '#5c4a3a' }}
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
          Privacy Policy
        </h1>
        <p className="text-sm mb-10" style={{ color: '#8b7355' }}>
          Last updated: January 18, 2026
        </p>

        {/* Privacy Commitment Banner */}
        <div
          className="rounded-2xl p-8 mb-14"
          style={{
            background: 'linear-gradient(135deg, #2c1810 0%, #4a3528 100%)',
          }}
        >
          <h2
            className="text-xl font-medium mb-6"
            style={{ color: '#f5f0e8' }}
          >
            Our Privacy Promise
          </h2>
          <div className="grid sm:grid-cols-2 gap-6">
            <div className="flex items-start gap-4">
              <div
                className="w-11 h-11 rounded-full flex items-center justify-center flex-shrink-0"
                style={{ background: 'rgba(212, 165, 116, 0.25)' }}
              >
                <Ban className="w-5 h-5" style={{ color: '#d4a574' }} />
              </div>
              <div>
                <p className="font-medium" style={{ color: '#f5f0e8' }}>
                  We never sell your data
                </p>
                <p className="text-sm mt-1" style={{ color: 'rgba(245, 240, 232, 0.75)' }}>
                  Your information is never sold to third parties
                </p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div
                className="w-11 h-11 rounded-full flex items-center justify-center flex-shrink-0"
                style={{ background: 'rgba(212, 165, 116, 0.25)' }}
              >
                <Eye className="w-5 h-5" style={{ color: '#d4a574' }} />
              </div>
              <div>
                <p className="font-medium" style={{ color: '#f5f0e8' }}>
                  We never read your journal
                </p>
                <p className="text-sm mt-1" style={{ color: 'rgba(245, 240, 232, 0.75)' }}>
                  Your entries are private and encrypted
                </p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div
                className="w-11 h-11 rounded-full flex items-center justify-center flex-shrink-0"
                style={{ background: 'rgba(212, 165, 116, 0.25)' }}
              >
                <Shield className="w-5 h-5" style={{ color: '#d4a574' }} />
              </div>
              <div>
                <p className="font-medium" style={{ color: '#f5f0e8' }}>
                  No marketing use
                </p>
                <p className="text-sm mt-1" style={{ color: 'rgba(245, 240, 232, 0.75)' }}>
                  Your content is never used for ads or marketing
                </p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div
                className="w-11 h-11 rounded-full flex items-center justify-center flex-shrink-0"
                style={{ background: 'rgba(212, 165, 116, 0.25)' }}
              >
                <Lock className="w-5 h-5" style={{ color: '#d4a574' }} />
              </div>
              <div>
                <p className="font-medium" style={{ color: '#f5f0e8' }}>
                  No AI training
                </p>
                <p className="text-sm mt-1" style={{ color: 'rgba(245, 240, 232, 0.75)' }}>
                  Your journal is never used to train AI models
                </p>
              </div>
            </div>
          </div>
        </div>

        <div
          className="max-w-none"
          style={{
            color: '#3a3028',
            fontFamily: 'system-ui, sans-serif',
            lineHeight: 1.8,
          }}
        >
          <section className="mb-12 pb-12 border-b border-stone-200">
            <SectionHeading number={1} title="Information We Collect" />
            <p className="mb-4">
              <strong>Account Information:</strong> When you create an account, we collect your email
              address for authentication purposes.
            </p>
            <p className="mb-4">
              <strong>Journal Content:</strong> Your journal entries, notes, images, and other content
              you create are stored securely. This content is yours and remains private.
            </p>
            <p>
              <strong>Usage Data:</strong> We collect minimal analytics data to improve the Service,
              such as feature usage patterns (not content). This data is anonymized and aggregated.
            </p>
          </section>

          <section className="mb-12 pb-12 border-b border-stone-200">
            <SectionHeading number={2} title="How We Use Your Information" />
            <p className="mb-4">We use your information solely to:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Provide and maintain the Service</li>
              <li>Authenticate your account</li>
              <li>Send important service updates (not marketing)</li>
              <li>Process payments for premium features</li>
              <li>Improve the Service based on aggregated, anonymous usage patterns</li>
            </ul>
          </section>

          <section className="mb-12 pb-12 border-b border-stone-200">
            <SectionHeading number={3} title="What We Never Do" />
            <p className="mb-4">We commit to never:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>Sell your data</strong> to third parties, advertisers, or data brokers</li>
              <li><strong>Read your journal entries</strong> — your content is private and encrypted</li>
              <li><strong>Use your content for marketing</strong> or advertising purposes</li>
              <li><strong>Train AI models</strong> on your personal journal content</li>
              <li><strong>Share your information</strong> with third parties for their marketing</li>
              <li><strong>Send you marketing emails</strong> without explicit consent</li>
            </ul>
          </section>

          <section className="mb-12 pb-12 border-b border-stone-200">
            <SectionHeading number={4} title="Data Security" />
            <p className="mb-4">
              We implement industry-standard security measures to protect your data:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Data encryption in transit and at rest</li>
              <li>Secure authentication with PIN protection</li>
              <li>Regular security audits and updates</li>
              <li>Limited employee access to user data</li>
            </ul>
          </section>

          <section className="mb-12 pb-12 border-b border-stone-200">
            <SectionHeading number={5} title="Data Retention" />
            <p className="mb-4">
              We retain your data for as long as your account is active. You can delete your account
              at any time, which will permanently remove all your data from our systems.
            </p>
            <p>
              Backup copies may be retained for up to 30 days after deletion to allow for recovery
              in case of accidental deletion.
            </p>
          </section>

          <section className="mb-12 pb-12 border-b border-stone-200">
            <SectionHeading number={6} title="Your Rights" />
            <p className="mb-4">You have the right to:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>Access</strong> your personal data</li>
              <li><strong>Export</strong> your journal content at any time</li>
              <li><strong>Delete</strong> your account and all associated data</li>
              <li><strong>Correct</strong> inaccurate personal information</li>
              <li><strong>Object</strong> to certain processing of your data</li>
            </ul>
          </section>

          <section className="mb-12 pb-12 border-b border-stone-200">
            <SectionHeading number={7} title="Third-Party Services" />
            <p className="mb-4">
              We use the following third-party services to operate Boundless:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>InstantDB:</strong> Database and authentication services</li>
              <li><strong>Payment Processor:</strong> To process premium subscriptions securely</li>
            </ul>
            <p className="mt-4">
              These services have access only to the minimum data necessary to perform their functions
              and are bound by their own privacy policies.
            </p>
          </section>

          <section className="mb-12 pb-12 border-b border-stone-200">
            <SectionHeading number={8} title="Cookies" />
            <p>
              We use essential cookies only for authentication and maintaining your session.
              We do not use tracking cookies, advertising cookies, or third-party analytics cookies.
            </p>
          </section>

          <section className="mb-12 pb-12 border-b border-stone-200">
            <SectionHeading number={9} title="Children's Privacy" />
            <p>
              Boundless is not intended for children under 13. We do not knowingly collect personal
              information from children under 13. If you believe a child has provided us with personal
              information, please contact us.
            </p>
          </section>

          <section className="mb-12 pb-12 border-b border-stone-200">
            <SectionHeading number={10} title="Changes to This Policy" />
            <p>
              We may update this Privacy Policy from time to time. We will notify you of significant
              changes by posting the new policy on this page with an updated revision date.
            </p>
          </section>

          <section className="mb-8">
            <SectionHeading number={11} title="Contact Us" />
            <p>
              If you have questions about this Privacy Policy or your data, please contact us at{' '}
              <a href="mailto:privacy@boundlessjournal.com" className="text-amber-700 hover:underline">
                privacy@boundlessjournal.com
              </a>
            </p>
          </section>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-stone-200 mt-8">
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
