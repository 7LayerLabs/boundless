'use client';

import { Smile, Brain, ToggleLeft, ToggleRight, BarChart2, FileText, Compass, Quote } from 'lucide-react';
import { cn } from '@/lib/utils/cn';
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
  return (
    <section className="pb-6 border-b border-neutral-200">
      <h3 className="text-sm font-medium text-neutral-500 uppercase tracking-wide mb-4">Features</h3>

      {/* Mood Tracking Toggle */}
      <div className="flex items-center justify-between py-3">
        <div className="flex items-center gap-3">
          <Smile className="w-5 h-5 text-neutral-400" />
          <div>
            <p className="text-sm font-medium text-neutral-800">Mood Tracking</p>
            <p className="text-xs text-neutral-500">Track how you feel each day</p>
          </div>
        </div>
        <button
          onClick={() => updateSetting('showMoodSelector', !showMoodSelector)}
          className="relative"
        >
          {showMoodSelector ? (
            <ToggleRight className="w-10 h-10 text-neutral-900" />
          ) : (
            <ToggleLeft className="w-10 h-10 text-neutral-300" />
          )}
        </button>
      </div>

      {/* AI Reflection Toggle */}
      <div className="flex items-center justify-between py-3">
        <div className="flex items-center gap-3">
          <Brain className="w-5 h-5 text-neutral-400" />
          <div>
            <p className="text-sm font-medium text-neutral-800">AI Reflection</p>
            <p className="text-xs text-neutral-500">Get thoughtful questions about your writing</p>
          </div>
        </div>
        <button
          onClick={() => updateSetting('aiReflectionEnabled', !aiReflectionEnabled)}
          className="relative"
        >
          {aiReflectionEnabled ? (
            <ToggleRight className="w-10 h-10 text-neutral-900" />
          ) : (
            <ToggleLeft className="w-10 h-10 text-neutral-300" />
          )}
        </button>
      </div>

      {/* AI Tone Selector - shown when AI Reflection is enabled */}
      {aiReflectionEnabled && (
        <div className="mt-4 p-4 bg-neutral-50 rounded-xl border border-neutral-200">
          <p className="text-sm font-medium text-neutral-700 mb-3">Reflection Tone</p>
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
                      ? 'border-neutral-900 bg-white shadow-sm'
                      : 'border-neutral-200 hover:border-neutral-400 bg-white'
                  )}
                >
                  <span className="text-lg">{toneConfig.emoji}</span>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-neutral-800">{toneConfig.label}</p>
                    <p className="text-xs text-neutral-500">{toneConfig.description}</p>
                  </div>
                  {aiTone === tone && (
                    <div className="w-2 h-2 bg-neutral-900 rounded-full"></div>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Sidebar Features Section */}
      <div className="mt-6 pt-6 border-t border-neutral-200">
        <h4 className="text-sm font-medium text-neutral-500 uppercase tracking-wide mb-4">Sidebar Features</h4>

        {/* Writing Stats Toggle */}
        <div className="flex items-center justify-between py-3">
          <div className="flex items-center gap-3">
            <BarChart2 className="w-5 h-5 text-neutral-400" />
            <div>
              <p className="text-sm font-medium text-neutral-800">Writing Stats</p>
              <p className="text-xs text-neutral-500">Track words, entries & streaks</p>
            </div>
          </div>
          <button
            onClick={() => updateSetting('showWritingStats', !showWritingStats)}
            className="relative"
          >
            {showWritingStats ? (
              <ToggleRight className="w-10 h-10 text-neutral-900" />
            ) : (
              <ToggleLeft className="w-10 h-10 text-neutral-300" />
            )}
          </button>
        </div>

        {/* Entry Templates Toggle */}
        <div className="flex items-center justify-between py-3">
          <div className="flex items-center gap-3">
            <FileText className="w-5 h-5 text-neutral-400" />
            <div>
              <p className="text-sm font-medium text-neutral-800">Entry Templates</p>
              <p className="text-xs text-neutral-500">Quick-start formats</p>
            </div>
          </div>
          <button
            onClick={() => updateSetting('showEntryTemplates', !showEntryTemplates)}
            className="relative"
          >
            {showEntryTemplates ? (
              <ToggleRight className="w-10 h-10 text-neutral-900" />
            ) : (
              <ToggleLeft className="w-10 h-10 text-neutral-300" />
            )}
          </button>
        </div>

        {/* Guided Programs Toggle */}
        <div className="flex items-center justify-between py-3">
          <div className="flex items-center gap-3">
            <Compass className="w-5 h-5 text-neutral-400" />
            <div>
              <p className="text-sm font-medium text-neutral-800">Guided Programs</p>
              <p className="text-xs text-neutral-500">30-day journaling challenges</p>
            </div>
          </div>
          <button
            onClick={() => updateSetting('showGuidedPrograms', !showGuidedPrograms)}
            className="relative"
          >
            {showGuidedPrograms ? (
              <ToggleRight className="w-10 h-10 text-neutral-900" />
            ) : (
              <ToggleLeft className="w-10 h-10 text-neutral-300" />
            )}
          </button>
        </div>

        {/* Daily Quote Toggle */}
        <div className="flex items-center justify-between py-3">
          <div className="flex items-center gap-3">
            <Quote className="w-5 h-5 text-neutral-400" />
            <div>
              <p className="text-sm font-medium text-neutral-800">Daily Quote</p>
              <p className="text-xs text-neutral-500">Inspiring quotes with pin-to-page</p>
            </div>
          </div>
          <button
            onClick={() => updateSetting('showDailyQuote', !showDailyQuote)}
            className="relative"
          >
            {showDailyQuote ? (
              <ToggleRight className="w-10 h-10 text-neutral-900" />
            ) : (
              <ToggleLeft className="w-10 h-10 text-neutral-300" />
            )}
          </button>
        </div>
      </div>
    </section>
  );
}
