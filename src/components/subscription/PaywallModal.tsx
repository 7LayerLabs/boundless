'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Check, Star, Sparkles, Crown } from 'lucide-react';
import { loadStripe } from '@stripe/stripe-js';
import { cn } from '@/lib/utils/cn';
import { STRIPE_PRICES, PLAN_DETAILS, PRO_FEATURES, type PricePlan } from '@/lib/stripe/config';
import { db } from '@/lib/db/instant';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || '');

interface PaywallModalProps {
  onClose: () => void;
  feature?: string; // Which feature triggered the paywall
}

export function PaywallModal({ onClose, feature }: PaywallModalProps) {
  const [selectedPlan, setSelectedPlan] = useState<PricePlan>('yearly');
  const [isLoading, setIsLoading] = useState(false);
  const { user } = db.useAuth();

  const handleCheckout = async () => {
    if (!user?.email) {
      console.error('No user email found');
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch('/api/stripe/create-checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          priceId: STRIPE_PRICES[selectedPlan],
          userId: user.id,
          userEmail: user.email,
          plan: selectedPlan,
        }),
      });

      const data = await response.json();
      
      if (data.url) {
        window.location.href = data.url;
      } else if (data.sessionId) {
        const stripe = await stripePromise;
        if (stripe) {
          await stripe.redirectToCheckout({ sessionId: data.sessionId });
        }
      }
    } catch (error) {
      console.error('Checkout error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.95, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.95, opacity: 0, y: 20 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          onClick={(e) => e.stopPropagation()}
          className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-[#faf8f3] rounded-2xl shadow-2xl"
        >
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full hover:bg-amber-100 transition-colors z-10"
          >
            <X className="w-5 h-5 text-amber-800" />
          </button>

          {/* Header */}
          <div className="bg-gradient-to-br from-amber-100 to-orange-100 px-8 py-10 text-center">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: 'spring' }}
              className="inline-flex items-center gap-2 px-4 py-2 bg-amber-800 text-amber-50 rounded-full text-sm font-medium mb-4"
            >
              <Crown className="w-4 h-4" />
              <span>Boundless Pro</span>
            </motion.div>
            
            <h2 className="font-serif text-3xl md:text-4xl font-bold text-amber-900 mb-3">
              Unlock Your Full Potential
            </h2>
            
            {feature && (
              <p className="text-amber-700">
                <span className="font-medium">{feature}</span> is a Pro feature
              </p>
            )}
          </div>

          {/* Pricing Cards */}
          <div className="px-8 py-8">
            <div className="grid grid-cols-3 gap-3 mb-8">
              {(Object.keys(PLAN_DETAILS) as PricePlan[]).map((plan) => {
                const details = PLAN_DETAILS[plan];
                const isSelected = selectedPlan === plan;
                const isBestValue = plan === 'yearly';
                
                return (
                  <button
                    key={plan}
                    onClick={() => setSelectedPlan(plan)}
                    className={cn(
                      'relative p-4 rounded-xl border-2 transition-all text-left',
                      isSelected
                        ? 'border-amber-500 bg-amber-50 shadow-lg'
                        : 'border-amber-200 hover:border-amber-300 bg-white'
                    )}
                  >
                    {isBestValue && (
                      <span className="absolute -top-2.5 left-1/2 -translate-x-1/2 px-2 py-0.5 bg-amber-500 text-white text-xs font-medium rounded-full whitespace-nowrap">
                        Best Value
                      </span>
                    )}
                    
                    <p className="font-medium text-amber-900 text-sm mb-1">{details.name}</p>
                    <p className="text-2xl font-bold text-amber-800">{details.price}</p>
                    <p className="text-xs text-amber-600 mt-1">{details.description}</p>
                    
                    {isSelected && (
                      <motion.div
                        layoutId="selected-indicator"
                        className="absolute top-2 right-2"
                      >
                        <Check className="w-5 h-5 text-amber-600" />
                      </motion.div>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Features Grid */}
            <div className="mb-8">
              <h3 className="text-sm font-medium text-amber-800 uppercase tracking-wider mb-4">
                Everything in Pro
              </h3>
              <div className="grid grid-cols-2 gap-3">
                {PRO_FEATURES.map((feature, index) => (
                  <motion.div
                    key={feature.title}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 + index * 0.05 }}
                    className="flex items-start gap-3 p-3 bg-white rounded-lg border border-amber-100"
                  >
                    <span className="text-xl">{feature.icon}</span>
                    <div>
                      <p className="font-medium text-amber-900 text-sm">{feature.title}</p>
                      <p className="text-xs text-amber-600">{feature.description}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* CTA Button */}
            <button
              onClick={handleCheckout}
              disabled={isLoading}
              className={cn(
                'w-full py-4 px-6 rounded-xl font-medium text-lg transition-all',
                'bg-gradient-to-r from-amber-600 to-amber-700 text-white',
                'hover:from-amber-700 hover:to-amber-800 hover:shadow-lg',
                'disabled:opacity-50 disabled:cursor-not-allowed',
                'flex items-center justify-center gap-2'
              )}
            >
              {isLoading ? (
                <>
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                    className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full"
                  />
                  <span>Processing...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5" />
                  <span>Upgrade to Pro — {PLAN_DETAILS[selectedPlan].price}</span>
                </>
              )}
            </button>

            {/* Trust badges */}
            <div className="mt-6 flex items-center justify-center gap-6 text-xs text-amber-600">
              <span className="flex items-center gap-1">
                <Check className="w-3 h-3" /> Secure checkout
              </span>
              <span className="flex items-center gap-1">
                <Check className="w-3 h-3" /> Cancel anytime
              </span>
              <span className="flex items-center gap-1">
                <Check className="w-3 h-3" /> 7-day refund
              </span>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
