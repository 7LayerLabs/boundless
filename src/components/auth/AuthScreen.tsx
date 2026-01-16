'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Loader2, BookOpen, Sparkles } from 'lucide-react';
import { db } from '@/lib/db/instant';
import { cn } from '@/lib/utils/cn';
import { analytics } from '@/components/providers/PostHogProvider';

export function AuthScreen() {
  const [email, setEmail] = useState('');
  const [sentTo, setSentTo] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSendMagicLink = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;

    setIsLoading(true);
    setError(null);

    try {
      await db.auth.sendMagicCode({ email: email.trim() });
      setSentTo(email.trim());
    } catch (err: any) {
      console.error('Auth error:', err);
      setError(err.message || 'Failed to send login link. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyCode = async (code: string) => {
    if (!sentTo || code.length !== 6) return;

    setIsLoading(true);
    setError(null);

    try {
      await db.auth.signInWithMagicCode({ email: sentTo, code });
      analytics.userLoggedIn('magic_code');
    } catch (err: any) {
      console.error('Verification error:', err);
      setError(err.message || 'Invalid code. Please try again.');
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-stone-300 via-stone-200 to-stone-100 p-4">
      {/* Ambient lighting */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-1/2 bg-gradient-to-b from-amber-100/30 to-transparent" />
      </div>

      <motion.div
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative w-full max-w-md"
      >
        {/* Book shadow */}
        <div className="absolute inset-0 bg-amber-900/20 rounded-3xl blur-2xl transform translate-y-4" />

        {/* Auth Card - looks like a closed journal */}
        <div
          className="relative rounded-2xl overflow-hidden"
          style={{
            background: 'linear-gradient(135deg, #6b4423 0%, #8b5a2b 50%, #6b4423 100%)',
            boxShadow: `
              inset 0 2px 4px rgba(255,255,255,0.1),
              inset 0 -2px 4px rgba(0,0,0,0.2),
              0 20px 60px rgba(0,0,0,0.3)
            `,
          }}
        >
          {/* Leather texture overlay */}
          <div
            className="absolute inset-0 opacity-30 pointer-events-none"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
              mixBlendMode: 'overlay',
            }}
          />

          {/* Gold border frame */}
          <div className="absolute inset-4 rounded-xl border-2 border-amber-400/30 pointer-events-none" />

          {/* Content */}
          <div className="relative p-8 pt-12">
            {/* Logo */}
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-amber-100/10 mb-4">
                <BookOpen className="w-8 h-8 text-amber-200" />
              </div>
              <h1 className="text-3xl font-serif text-amber-100 mb-2">Boundless</h1>
              <p className="text-amber-200/60 text-sm">Your private digital journal</p>
            </div>

            {!sentTo ? (
              /* Email Input Form */
              <form onSubmit={handleSendMagicLink} className="space-y-4">
                <div>
                  <label className="block text-sm text-amber-200/80 mb-2">
                    Enter your email to continue
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-amber-600" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@example.com"
                      className={cn(
                        'w-full pl-12 pr-4 py-3 rounded-xl',
                        'bg-amber-50 text-amber-900 placeholder-amber-400',
                        'border-2 border-transparent',
                        'focus:outline-none focus:border-amber-400',
                        'transition-colors'
                      )}
                      disabled={isLoading}
                      autoFocus
                    />
                  </div>
                </div>

                {error && (
                  <motion.p
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-red-300 text-sm text-center"
                  >
                    {error}
                  </motion.p>
                )}

                <button
                  type="submit"
                  disabled={isLoading || !email.trim()}
                  className={cn(
                    'w-full py-3 rounded-xl font-medium',
                    'bg-amber-500 text-white',
                    'hover:bg-amber-600',
                    'disabled:opacity-50 disabled:cursor-not-allowed',
                    'transition-colors',
                    'flex items-center justify-center gap-2'
                  )}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Sending...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-5 h-5" />
                      Send Magic Link
                    </>
                  )}
                </button>
              </form>
            ) : (
              /* Code Verification Form */
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="space-y-4"
              >
                <div className="text-center mb-6">
                  <p className="text-amber-200/80 text-sm">
                    We sent a 6-digit code to
                  </p>
                  <p className="text-amber-100 font-medium">{sentTo}</p>
                </div>

                <div>
                  <label className="block text-sm text-amber-200/80 mb-2 text-center">
                    Enter the code from your email
                  </label>
                  <input
                    type="text"
                    maxLength={6}
                    placeholder="000000"
                    onChange={(e) => {
                      const code = e.target.value.replace(/\D/g, '');
                      e.target.value = code;
                      if (code.length === 6) {
                        handleVerifyCode(code);
                      }
                    }}
                    className={cn(
                      'w-full px-4 py-4 rounded-xl text-center',
                      'bg-amber-50 text-amber-900 placeholder-amber-300',
                      'border-2 border-transparent',
                      'focus:outline-none focus:border-amber-400',
                      'text-2xl font-mono tracking-[0.5em]',
                      'transition-colors'
                    )}
                    disabled={isLoading}
                    autoFocus
                  />
                </div>

                {error && (
                  <motion.p
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-red-300 text-sm text-center"
                  >
                    {error}
                  </motion.p>
                )}

                {isLoading && (
                  <div className="flex justify-center">
                    <Loader2 className="w-6 h-6 text-amber-200 animate-spin" />
                  </div>
                )}

                <button
                  type="button"
                  onClick={() => {
                    setSentTo(null);
                    setError(null);
                  }}
                  className="w-full py-2 text-amber-200/60 text-sm hover:text-amber-200 transition-colors"
                >
                  Use a different email
                </button>
              </motion.div>
            )}

            {/* Footer */}
            <p className="mt-8 text-center text-amber-200/40 text-xs">
              Your journal syncs securely across all devices
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
