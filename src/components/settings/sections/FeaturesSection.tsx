'use client';

import { Smile, Brain, ToggleLeft, ToggleRight } from 'lucide-react';
import { cn } from '@/lib/utils/cn';
import type { AITone } from '@/types/settings';

const aiTones: Record<AITone, { label: string; description: string; emoji: string }> = {
  comforting: { label: 'Comforting', description: 'Warm, supportive, and gentle', emoji: '🤗' },
  toughLove: { label: 'Tough Love', description: 'Direct, challenging, no-nonsense', emoji: '💪' },
  curious: { label: 'Curious', description: 'Neutral, exploratory, Socratic', emoji: '🤔' },
  philosophical: { label: 'Philosophical', description: 'Deep, reflective, existential', emoji: '🧘' },
  playful: { label: 'Playful', description: 'Light, humorous, casual', emoji: '😄' },
};

interface FeaturesSectionProps {
  showMoodSelector: boolean;
  aiReflectionEnabled: boolean;
  aiTone: AITone;
  updateSetting: (key: any, value: any) => Promise<void> | void;
}

export function FeaturesSection({
  showMoodSelector,
  aiReflectionEnabled,
  aiTone,
  updateSetting,
}: FeaturesSectionProps) {
  return (
    <section className="pb-6 border-b border-amber-100">
      <h3 className="text-sm font-medium text-amber-800 mb-4">Features</h3>

      {/* Mood Tracking Toggle */}
      <div className="flex items-center justify-between py-3">
        <div className="flex items-center gap-3">
          <Smile className="w-5 h-5 text-amber-600" />
          <div>
            <p className="text-sm font-medium text-amber-800">Mood Tracking</p>
            <p className="text-xs text-amber-500">Track how you feel each day</p>
          </div>
        </div>
        <button
          onClick={() => updateSetting('showMoodSelector', !showMoodSelector)}
          className="relative"
        >
          {showMoodSelector ? (
            <ToggleRight className="w-10 h-10 text-amber-500" />
          ) : (
            <ToggleLeft className="w-10 h-10 text-amber-300" />
          )}
        </button>
      </div>

      {/* AI Reflection Toggle */}
      <div className="flex items-center justify-between py-3">
        <div className="flex items-center gap-3">
          <Brain className="w-5 h-5 text-purple-500" />
          <div>
            <p className="text-sm font-medium text-amber-800">AI Reflection</p>
            <p className="text-xs text-amber-500">Get thoughtful questions about your writing</p>
          </div>
        </div>
        <button
          onClick={() => updateSetting('aiReflectionEnabled', !aiReflectionEnabled)}
          className="relative"
        >
          {aiReflectionEnabled ? (
            <ToggleRight className="w-10 h-10 text-purple-500" />
          ) : (
            <ToggleLeft className="w-10 h-10 text-amber-300" />
          )}
        </button>
      </div>

      {/* AI Tone Selector - shown when AI Reflection is enabled */}
      {aiReflectionEnabled && (
        <div className="mt-4 p-4 bg-purple-50 rounded-xl border border-purple-100">
          <p className="text-sm font-medium text-purple-800 mb-3">Reflection Tone</p>
          <div className="space-y-2">
            {(Object.keys(aiTones) as AITone[]).map((tone) => {
              const toneConfig = aiTones[tone];
              return (
                <button
                  key={tone}
                  onClick={() => updateSetting('aiTone', tone)}
                  className={cn(
                    'w-full px-3 py-2 rounded-lg border-2 text-left transition-all flex items-center gap-3',
                    aiTone === tone
                      ? 'border-purple-500 bg-white'
                      : 'border-purple-100 hover:border-purple-300 bg-white/50'
                  )}
                >
                  <span className="text-lg">{toneConfig.emoji}</span>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-purple-800">{toneConfig.label}</p>
                    <p className="text-xs text-purple-500">{toneConfig.description}</p>
                  </div>
                  {aiTone === tone && (
                    <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </section>
  );
}
