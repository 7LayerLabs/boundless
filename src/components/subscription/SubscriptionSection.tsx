'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Crown, ExternalLink, Check, Calendar, CreditCard, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils/cn';
import { PLAN_DETAILS } from '@/lib/stripe/config';
import { PaywallModal } from './PaywallModal';

interface SubscriptionSectionProps {
  isPro: boolean;
  subscriptionPlan: string;
  subscriptionStatus: string;
  subscriptionEndDate: number;
  stripeCustomerId: string;
}

export function SubscriptionSection({
  isPro,
  subscriptionPlan,
  subscriptionStatus,
  subscriptionEndDate,
  stripeCustomerId,
}: SubscriptionSectionProps) {
  const [showPaywall, setShowPaywall] = useState(false);
  const [isLoadingPortal, setIsLoadingPortal] = useState(false);

  const handleManageSubscription = async () => {
    if (!stripeCustomerId) return;
    
    setIsLoadingPortal(true);
    try {
      const response = await fetch('/api/stripe/create-portal', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ customerId: stripeCustomerId }),
      });

      const data = await response.json();
      if (data.url) {
        window.location.href = data.url;
      }
    } catch (error) {
      console.error('Portal error:', error);
    } finally {
      setIsLoadingPortal(false);
    }
  };

  const formatDate = (timestamp: number) => {
    if (!timestamp) return 'N/A';
    return new Date(timestamp).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const getStatusBadge = (status: string) => {
    const badges: Record<string, { color: string; label: string }> = {
      active: { color: 'bg-green-100 text-green-700', label: 'Active' },
      canceled: { color: 'bg-amber-100 text-amber-700', label: 'Canceled' },
      past_due: { color: 'bg-red-100 text-red-700', label: 'Past Due' },
      trialing: { color: 'bg-blue-100 text-blue-700', label: 'Trial' },
      lifetime: { color: 'bg-purple-100 text-purple-700', label: 'Lifetime' },
    };
    return badges[status] || { color: 'bg-gray-100 text-gray-700', label: status };
  };

  if (isPro) {
    const statusBadge = getStatusBadge(subscriptionPlan === 'lifetime' ? 'lifetime' : subscriptionStatus);
    const planDetails = PLAN_DETAILS[subscriptionPlan as keyof typeof PLAN_DETAILS];

    return (
      <div className="space-y-6">
        {/* Pro Status Card */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl p-6 border border-amber-200"
        >
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-amber-500 flex items-center justify-center">
                <Crown className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-amber-900 text-lg">Boundless Pro</h3>
                <p className="text-sm text-amber-700">{planDetails?.name || subscriptionPlan}</p>
              </div>
            </div>
            <span className={cn('px-3 py-1 rounded-full text-sm font-medium', statusBadge.color)}>
              {statusBadge.label}
            </span>
          </div>

          {subscriptionPlan !== 'lifetime' && subscriptionEndDate > 0 && (
            <div className="flex items-center gap-2 text-sm text-amber-700 mb-4">
              <Calendar className="w-4 h-4" />
              <span>
                {subscriptionStatus === 'canceled' ? 'Access until: ' : 'Renews: '}
                {formatDate(subscriptionEndDate)}
              </span>
            </div>
          )}

          <div className="flex items-center gap-4 text-sm">
            <div className="flex items-center gap-1 text-green-700">
              <Check className="w-4 h-4" />
              <span>All Pro features unlocked</span>
            </div>
          </div>
        </motion.div>

        {/* Manage Subscription */}
        {stripeCustomerId && subscriptionPlan !== 'lifetime' && (
          <button
            onClick={handleManageSubscription}
            disabled={isLoadingPortal}
            className={cn(
              'w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg',
              'bg-white border border-amber-200 text-amber-800',
              'hover:bg-amber-50 transition-colors',
              'disabled:opacity-50 disabled:cursor-not-allowed'
            )}
          >
            {isLoadingPortal ? (
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                className="w-4 h-4 border-2 border-amber-300 border-t-amber-600 rounded-full"
              />
            ) : (
              <CreditCard className="w-4 h-4" />
            )}
            <span>Manage Subscription</span>
            <ExternalLink className="w-3 h-3" />
          </button>
        )}
      </div>
    );
  }

  // Free user view
  return (
    <div className="space-y-6">
      {/* Current Plan */}
      <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
            <Sparkles className="w-5 h-5 text-gray-500" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">Free Plan</h3>
            <p className="text-sm text-gray-600">Basic journaling features</p>
          </div>
        </div>
        
        <p className="text-sm text-gray-600 mb-4">
          Upgrade to Pro to unlock guided programs, AI reflections, templates, and more.
        </p>

        <button
          onClick={() => setShowPaywall(true)}
          className={cn(
            'w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg',
            'bg-gradient-to-r from-amber-600 to-amber-700 text-white font-medium',
            'hover:from-amber-700 hover:to-amber-800 transition-all'
          )}
        >
          <Crown className="w-4 h-4" />
          <span>Upgrade to Pro</span>
        </button>
      </div>

      {/* Paywall Modal */}
      {showPaywall && <PaywallModal onClose={() => setShowPaywall(false)} />}
    </div>
  );
}
