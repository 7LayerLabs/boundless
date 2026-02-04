'use client';

import { useState } from 'react';
import { Smile, Brain, ToggleLeft, ToggleRight, BarChart2, FileText, Compass, Quote, Crown } from 'lucide-react';
import { cn } from '@/lib/utils/cn';
import { useSettings } from '@/hooks/useSettings';
import { PaywallModal } from '@/components/subscription/PaywallModal';
import type { AITone } from '@/types/settings';

const aiTones: Record<AITone, { label: string; description: string; emoji: string }> = {
  comforting: { label: 'Comforting', description: 'Warm, supportive, and gentle', emoji: '🤗' },
  toughLove: { label: 'Tough Love', description: 'Direct, challenging, no-nonsense', emoji: '💪' },
  curious: { label: 'Curious', description: 'Neutral, exploratory, Socratic', emoji: '🤔' },
  philosophical: { label: 'Philosophical', description: 'Deep, reflective, existential', emoji: '🧘' },
  playful: { label: 'Playful', description: 'Light, humorous, casual', emoji: '😄' },
  devilsAdvocate: { label: "Devil's Advocate", description: 'Challenges your perspective', emoji: '😈' },
  silverLining: { label: 'Silver Lining', description: 'Finds the positive angle', emoji: '🌤️' },
};

// Pro badge component
function ProBadge() {
  return (
    <span className="inline-flex items-center gap-1 px-1.5 py-0.5 bg-amber-100 text-amber-700 text-[10px] font-medium rounded">
      <Crown className="w-2.5 h-2.5" />
      PRO
    </span>
  );
}

interface FeaturesSectionProps {
  showMoodSelector: boolean;
  aiReflectionEnabled: boolean;
  aiTone: AITone;
  showWritingStats: boolean;
  showEntryTemplates: boolean;
  showGuidedPrograms: boolean;
  showDailyQuote: boolean;
  updateSetting: (key: any, value: any) => Promise<void> | void;
}

export function FeaturesSection({
  showMoodSelector,
  aiReflectionEnabled,
  aiTone,
  showWritingStats,
  showEntryTemplates,
  showGuidedPrograms,
  showDailyQuote,
  updateSetting,
}: FeaturesSectionProps) {
  const { isPro } = useSettings();
  const [showPaywall, setShowPaywall] = useState(false);
  const [paywallFeature, setPaywallFeature] = useState<string | null>(null);

  const handleProFeatureToggle = (
    feature: string,
    settingKey: string,
    currentValue: boolean
  ) => {
    if (!isPro && !currentValue) {
      setPaywallFeature(feature);
      setShowPaywall(true);
      return;
    }
    updateSetting(settingKey as any, !currentValue);
  };

  return (
    <section className="pb-6 border-b border-amber-200">
      <h3 className="text-sm font-medium text-stone-600 uppercase tracking-wide mb-4">Features</h3>

      {/* Mood Tracking Toggle - FREE */}
      <div className="flex items-center justify-between py-3">
        <div className="flex items-center gap-3">
          <Smile className="w-5 h-5 text-amber-700" />
          <div>
            <p className="text-sm font-medium text-stone-800">Mood Tracking</p>
            <p className="text-xs text-stone-600">Track how you feel each day</p>
          </div>
        </div>
        <button
          onClick={() => updateSetting('showMoodSelector', !showMoodSelector)}
          className="relative"
        >
          {showMoodSelector ? (
            <ToggleRight className="w-10 h-10 text-amber-800" />
          ) : (
            <ToggleLeft className="w-10 h-10 text-amber-300" />
          )}
        </button>
      </div>

      {/* AI Reflection Toggle - PRO */}
      <div className="flex items-center justify-between py-3">
        <div className="flex items-center gap-3">
          <Brain className="w-5 h-5 text-amber-700" />
          <div>
            <div className="flex items-center gap-2">
              <p className="text-sm font-medium text-stone-800">AI Reflection</p>
              {!isPro && <ProBadge />}
            </div>
            <p className="text-xs text-stone-600">Get thoughtful questions about your writing</p>
          </div>
        </div>
        <button
          onClick={() => handleProFeatureToggle('AI Reflections', 'aiReflectionEnabled', aiReflectionEnabled)}
          className="relative"
        >
          {aiReflectionEnabled ? (
            <ToggleRight className="w-10 h-10 text-amber-800" />
          ) : (
            <ToggleLeft className="w-10 h-10 text-amber-300" />
          )}
        </button>
      </div>

      {/* AI Tone Selector - shown when AI Reflection is enabled */}
      {aiReflectionEnabled && (
        <div className="mt-4 p-4 bg-amber-50 rounded-xl border border-amber-200">
          <p className="text-sm font-medium text-stone-700 mb-3">Reflection Tone</p>
          <div className="space-y-2">
            {(Object.keys(aiTones) as AITone[]).map((tone) => {
              const toneConfig = aiTones[tone];
              return (
                <button
                  key={tone}
                  onClick={() => updateSetting('aiTone', tone)}
                  className={cn(
                    'w-full px-3 py-2 rounded-lg border text-left transition-all flex items-center gap-3',
                    aiTone === tone
                      ? 'border-amber-700 bg-white shadow-sm'
                      : 'border-amber-200 hover:border-amber-400 bg-white'
                  )}
                >
                  <span className="text-lg">{toneConfig.emoji}</span>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-stone-800">{toneConfig.label}</p>
                    <p className="text-xs text-stone-600">{toneConfig.description}</p>
                  </div>
                  {aiTone === tone && (
                    <div className="w-2 h-2 bg-amber-700 rounded-full"></div>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Sidebar Features Section */}
      <div className="mt-6 pt-6 border-t border-amber-200">
        <h4 className="text-sm font-medium text-stone-600 uppercase tracking-wide mb-4">Sidebar Features</h4>

        {/* Writing Stats Toggle - PRO */}
        <div className="flex items-center justify-between py-3">
          <div className="flex items-center gap-3">
            <BarChart2 className="w-5 h-5 text-amber-700" />
            <div>
              <div className="flex items-center gap-2">
                <p className="text-sm font-medium text-stone-800">Writing Stats</p>
                {!isPro && <ProBadge />}
              </div>
              <p className="text-xs text-stone-600">Track words, entries & streaks</p>
            </div>
          </div>
          <button
            onClick={() => handleProFeatureToggle('Writing Stats', 'showWritingStats', showWritingStats)}
            className="relative"
          >
            {showWritingStats ? (
              <ToggleRight className="w-10 h-10 text-amber-800" />
            ) : (
              <ToggleLeft className="w-10 h-10 text-amber-300" />
            )}
          </button>
        </div>

        {/* Entry Templates Toggle - PRO */}
        <div className="flex items-center justify-between py-3">
          <div className="flex items-center gap-3">
            <FileText className="w-5 h-5 text-amber-700" />
            <div>
              <div className="flex items-center gap-2">
                <p className="text-sm font-medium text-stone-800">Entry Templates</p>
                {!isPro && <ProBadge />}
              </div>
              <p className="text-xs text-stone-600">Quick-start formats</p>
            </div>
          </div>
          <button
            onClick={() => handleProFeatureToggle('Entry Templates', 'showEntryTemplates', showEntryTemplates)}
            className="relative"
          >
            {showEntryTemplates ? (
              <ToggleRight className="w-10 h-10 text-amber-800" />
            ) : (
              <ToggleLeft className="w-10 h-10 text-amber-300" />
            )}
          </button>
        </div>

        {/* Guided Programs Toggle - PRO */}
        <div className="flex items-center justify-between py-3">
          <div className="flex items-center gap-3">
            <Compass className="w-5 h-5 text-amber-700" />
            <div>
              <div className="flex items-center gap-2">
                <p className="text-sm font-medium text-stone-800">Guided Programs</p>
                {!isPro && <ProBadge />}
              </div>
              <p className="text-xs text-stone-600">42 multi-day journaling journeys</p>
            </div>
          </div>
          <button
            onClick={() => handleProFeatureToggle('Guided Programs', 'showGuidedPrograms', showGuidedPrograms)}
            className="relative"
          >
            {showGuidedPrograms ? (
              <ToggleRight className="w-10 h-10 text-amber-800" />
            ) : (
              <ToggleLeft className="w-10 h-10 text-amber-300" />
            )}
          </button>
        </div>

        {/* Daily Quote Toggle - PRO */}
        <div className="flex items-center justify-between py-3">
          <div className="flex items-center gap-3">
            <Quote className="w-5 h-5 text-amber-700" />
            <div>
              <div className="flex items-center gap-2">
                <p className="text-sm font-medium text-stone-800">Daily Quote</p>
                {!isPro && <ProBadge />}
              </div>
              <p className="text-xs text-stone-600">Inspiring quotes with pin-to-page</p>
            </div>
          </div>
          <button
            onClick={() => handleProFeatureToggle('Daily Quotes', 'showDailyQuote', showDailyQuote)}
            className="relative"
          >
            {showDailyQuote ? (
              <ToggleRight className="w-10 h-10 text-amber-800" />
            ) : (
              <ToggleLeft className="w-10 h-10 text-amber-300" />
            )}
          </button>
        </div>
      </div>

      {/* Paywall Modal */}
      {showPaywall && (
        <PaywallModal
          onClose={() => {
            setShowPaywall(false);
            setPaywallFeature(null);
          }}
          feature={paywallFeature || undefined}
        />
      )}
    </section>
  );
}
