'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, Loader2 } from 'lucide-react';
import { db } from '@/lib/db/instant';

export function AuthModal() {
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [step, setStep] = useState<'email' | 'code'>('email');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSendCode = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setIsLoading(true);
    setError('');

    try {
      await db.auth.sendMagicCode({ email });
      setStep('code');
    } catch (err: any) {
      setError(err.message || 'Failed to send code');
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyCode = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!code) return;

    setIsLoading(true);
    setError('');

    try {
      await db.auth.signInWithMagicCode({ email, code });
    } catch (err: any) {
      const errorMessage = err.message || 'Invalid code';

      // Handle expired/stale session errors
      if (errorMessage.includes('Record not found') || errorMessage.includes('magic-code')) {
        // Clear any stale auth state
        try {
          await db.auth.signOut();
        } catch {
          // Ignore signout errors
        }
        localStorage.removeItem('instantdb-session');
        setError('Session expired. Please request a new code.');
        setCode('');
        setStep('email');
      } else if (errorMessage.includes('expired')) {
        setError('Code expired. Please request a new one.');
        setCode('');
        setStep('email');
      } else {
        setError(errorMessage);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center"
      style={{
        background: 'rgba(0,0,0,0.8)',
        backdropFilter: 'blur(8px)',
      }}
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0, y: 10 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.95, opacity: 0, y: 10 }}
        transition={{ duration: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
        className="w-full max-w-sm mx-4"
      >
        {/* Card */}
        <div
          className="relative overflow-hidden"
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
          {/* Subtle top accent */}
          <div
            className="absolute top-0 left-0 right-0 h-px"
            style={{
              background: 'rgba(212, 175, 55, 0.3)',
            }}
          />

          {/* Header */}
          <div className="px-8 pt-10 pb-6 text-center">
            <h2
              className="text-xl font-serif tracking-wide"
              style={{ color: 'rgba(240, 230, 210, 0.9)' }}
            >
              {step === 'email' ? 'Welcome' : 'Verification'}
            </h2>
            <p
              className="text-sm mt-2"
              style={{ color: 'rgba(180, 170, 150, 0.6)' }}
            >
              {step === 'email'
                ? 'Enter your email to continue'
                : `Code sent to ${email}`}
            </p>
          </div>

          {/* Form */}
          <div className="px-8 pb-10">
            <AnimatePresence mode="wait">
              {step === 'email' ? (
                <motion.form
                  key="email-form"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 10 }}
                  onSubmit={handleSendCode}
                  className="space-y-4"
                >
                  <div>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="your@email.com"
                      className="w-full px-4 py-3 rounded-lg text-sm transition-all"
                      style={{
                        background: 'rgba(255, 255, 255, 0.05)',
                        border: '1px solid rgba(255, 255, 255, 0.1)',
                        color: 'rgba(240, 230, 210, 0.9)',
                        outline: 'none',
                      }}
                      onFocus={(e) => {
                        e.target.style.borderColor = 'rgba(212, 175, 55, 0.4)';
                        e.target.style.background = 'rgba(255, 255, 255, 0.08)';
                      }}
                      onBlur={(e) => {
                        e.target.style.borderColor = 'rgba(255, 255, 255, 0.1)';
                        e.target.style.background = 'rgba(255, 255, 255, 0.05)';
                      }}
                      required
                      autoFocus
                    />
                  </div>

                  {error && (
                    <p className="text-sm text-center" style={{ color: '#c47070' }}>
                      {error}
                    </p>
                  )}

                  <button
                    type="submit"
                    disabled={isLoading || !email}
                    className="w-full py-3 px-4 rounded-lg flex items-center justify-center gap-2 transition-all disabled:opacity-50"
                    style={{
                      background: 'rgba(212, 175, 55, 0.15)',
                      border: '1px solid rgba(212, 175, 55, 0.3)',
                      color: 'rgba(212, 175, 55, 0.9)',
                    }}
                  >
                    {isLoading ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <>
                        <span className="text-sm font-medium">Continue</span>
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </motion.form>
              ) : (
                <motion.form
                  key="code-form"
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  onSubmit={handleVerifyCode}
                  className="space-y-4"
                >
                  <div>
                    <input
                      type="text"
                      value={code}
                      onChange={(e) => setCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                      placeholder="000000"
                      maxLength={6}
                      className="w-full px-4 py-3 rounded-lg text-center text-xl tracking-[0.4em] font-mono transition-all"
                      style={{
                        background: 'rgba(255, 255, 255, 0.05)',
                        border: '1px solid rgba(255, 255, 255, 0.1)',
                        color: 'rgba(240, 230, 210, 0.9)',
                        outline: 'none',
                      }}
                      onFocus={(e) => {
                        e.target.style.borderColor = 'rgba(212, 175, 55, 0.4)';
                      }}
                      onBlur={(e) => {
                        e.target.style.borderColor = 'rgba(255, 255, 255, 0.1)';
                      }}
                      required
                      autoFocus
                    />
                  </div>

                  {error && (
                    <p className="text-sm text-center" style={{ color: '#c47070' }}>
                      {error}
                    </p>
                  )}

                  <button
                    type="submit"
                    disabled={isLoading || code.length !== 6}
                    className="w-full py-3 px-4 rounded-lg flex items-center justify-center gap-2 transition-all disabled:opacity-50"
                    style={{
                      background: 'rgba(212, 175, 55, 0.15)',
                      border: '1px solid rgba(212, 175, 55, 0.3)',
                      color: 'rgba(212, 175, 55, 0.9)',
                    }}
                  >
                    {isLoading ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <span className="text-sm font-medium">Verify</span>
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setStep('email');
                      setCode('');
                      setError('');
                    }}
                    className="w-full py-2 text-sm transition-colors"
                    style={{ color: 'rgba(180, 170, 150, 0.5)' }}
                  >
                    Use different email
                  </button>
                </motion.form>
              )}
            </AnimatePresence>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
