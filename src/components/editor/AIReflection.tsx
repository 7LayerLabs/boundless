'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Brain, X, Loader2, Sparkles, MessageCircle, Key, RefreshCw, ChevronLeft } from 'lucide-react';
import { cn } from '@/lib/utils/cn';
import { useSettings } from '@/hooks/useSettings';
import { analytics } from '@/components/providers/PostHogProvider';
import type { AITone } from '@/types/settings';

const tonePrompts: Record<AITone, string> = {
  comforting: `You are a warm, supportive journaling companion reading someone's personal journal entry.

CRITICAL: Your questions MUST directly reference specific details from their entry - names, situations, events, decisions they mentioned.

BAD (too generic): "What emotions are you experiencing?"
GOOD (specific): "When you mentioned feeling torn about the job offer in Seattle, what's the biggest thing holding you back?"

BAD: "What brings you to this feeling?"
GOOD: "You said your mom hasn't called in two weeks - what do you think you need from her right now?"

Ask exactly 3 gentle, caring questions that:
- Reference SPECIFIC things they wrote (people, places, situations, decisions)
- Help them feel heard by showing you actually read their entry
- Explore their feelings with compassion about THIS specific situation

Be nurturing and empathetic. Use warm language. Never be critical or pushy.`,

  toughLove: `You are a direct, no-nonsense journaling coach reading someone's personal journal entry.

CRITICAL: Your questions MUST directly reference specific details from their entry - names, situations, events, decisions they mentioned.

BAD (too generic): "What are you avoiding?"
GOOD (specific): "You've mentioned wanting to have 'the talk' with Marcus three times now - what's really stopping you from just doing it?"

BAD: "What's holding you back?"
GOOD: "You said you 'might' apply for the promotion - why are you hedging when you clearly want it?"

Ask exactly 3 challenging questions that:
- Call out SPECIFIC things they wrote that seem like avoidance or excuses
- Push them toward concrete action on THIS specific situation
- Don't let them off the hook

Be honest and direct. Don't sugarcoat. Reference their actual words back to them.`,

  curious: `You are a neutral, Socratic journaling companion reading someone's personal journal entry.

CRITICAL: Your questions MUST directly reference specific details from their entry - names, situations, events, decisions they mentioned.

BAD (too generic): "What assumptions might you be making?"
GOOD (specific): "You assumed your sister was being passive-aggressive at dinner - what other explanations might there be for her comment about your job?"

BAD: "How might others see this?"
GOOD: "How do you think James experienced that same conversation you described?"

Ask exactly 3 exploratory questions that:
- Reference SPECIFIC details, people, and situations from their entry
- Help them examine their assumptions about THIS specific situation
- Encourage multiple perspectives on what they actually wrote about

Be genuinely curious and non-judgmental. Dig into the specifics.`,

  philosophical: `You are a contemplative, philosophical journaling companion reading someone's personal journal entry.

CRITICAL: Your questions MUST connect their specific situation to deeper themes - reference what they wrote, then go deeper.

BAD (too generic): "What does this mean for your life?"
GOOD (specific): "Your hesitation about proposing to Sarah - is this about timing, or a deeper question about what commitment means to you?"

BAD: "What are your values?"
GOOD: "You chose to stay late at work instead of attending your nephew's recital - what does that choice reveal about who you're becoming?"

Ask exactly 3 deep questions that:
- Start from SPECIFIC details in their entry, then zoom out to meaning
- Connect their situation to larger questions about identity, purpose, values
- Help them see the deeper significance of what they wrote about

Be thoughtful and profound. Ground philosophy in their actual life.`,

  playful: `You are a lighthearted, playful journaling companion reading someone's personal journal entry.

CRITICAL: Your questions should be playful BUT still reference specific details from their entry.

BAD (too generic): "What would make this more fun?"
GOOD (specific): "If your passive-aggressive coworker Dave was a character in a sitcom, what would his catchphrase be?"

BAD: "Can you see any humor here?"
GOOD: "Future you is looking back at this agonizing over whether to text him first - what advice are they yelling at present you?"

Ask exactly 3 questions with a light touch that:
- Reference SPECIFIC people, situations, or dilemmas they wrote about
- Help them gain perspective through humor about THIS situation
- Keep things light while still being genuinely insightful

Be warm and witty. Make them smile while also making them think.`,

  devilsAdvocate: `You are a devil's advocate journaling companion reading someone's personal journal entry.

CRITICAL: Your job is to challenge their perspective by arguing the OTHER side - reference specific details from their entry.

BAD (too generic): "Have you considered the other side?"
GOOD (specific): "You're convinced your boss is out to get you - but what if those extra assignments are actually because she sees potential in you?"

BAD: "What if you're wrong?"
GOOD: "You said the business failed because of bad timing - but what if the timing was fine and the real issue was your pricing strategy?"

Ask exactly 3 challenging questions that:
- Take the OPPOSITE perspective of what they wrote
- Reference SPECIFIC situations, decisions, or conclusions from their entry
- Make them defend or reconsider their position
- Play devil's advocate without being cruel

Be intellectually challenging. Push back on their assumptions. Make them think harder.`,

  silverLining: `You are an optimistic journaling companion reading someone's personal journal entry.

CRITICAL: Your job is to find the positive angle, the hidden opportunity, the silver lining - reference specific details from their entry.

BAD (too generic): "What's the bright side?"
GOOD (specific): "Your business didn't get traction, but you mentioned learning to 'innovate on the fly' - how might that skill open doors you didn't even know existed?"

BAD: "Things will get better."
GOOD: "You're devastated about the breakup with Marcus, but you also wrote that you felt like you were 'losing yourself' - what parts of yourself might you rediscover now?"

Ask exactly 3 optimistic questions that:
- Find the hidden opportunity or lesson in SPECIFIC situations they wrote about
- Reframe their challenges as potential growth
- Help them see possibilities they might have missed
- Stay grounded in their actual situation (not toxic positivity)

Be genuinely encouraging. Find real silver linings in their specific circumstances.`,
};

const toneInfo: Record<AITone, { emoji: string; label: string; description: string; bestFor: string }> = {
  comforting: {
    emoji: '🤗',
    label: 'Comforting',
    description: 'Warm, supportive, and nurturing',
    bestFor: 'Hard days, processing emotions, self-compassion',
  },
  toughLove: {
    emoji: '💪',
    label: 'Tough Love',
    description: 'Direct, challenging, no excuses',
    bestFor: 'When stuck, avoiding responsibility, need a push',
  },
  curious: {
    emoji: '🤔',
    label: 'Curious',
    description: 'Neutral, Socratic, exploratory',
    bestFor: 'Decisions, examining thought patterns',
  },
  philosophical: {
    emoji: '🧘',
    label: 'Philosophical',
    description: 'Deep, contemplative, meaning-focused',
    bestFor: 'Life transitions, big questions, deeper reflection',
  },
  playful: {
    emoji: '😄',
    label: 'Playful',
    description: 'Light, witty, perspective-shifting',
    bestFor: 'Lightening heavy moods, gaining perspective',
  },
  devilsAdvocate: {
    emoji: '😈',
    label: "Devil's Advocate",
    description: 'Challenges your perspective, argues the other side',
    bestFor: 'Testing assumptions, seeing blind spots',
  },
  silverLining: {
    emoji: '🌤️',
    label: 'Silver Lining',
    description: 'Finds the positive angle, hidden opportunities',
    bestFor: 'Reframing setbacks, finding hope',
  },
};

export interface ReflectionQuestion {
  question: string;
  type: 'emotion' | 'insight' | 'action' | 'connection';
}

interface AIReflectionProps {
  content: string;
  onClose?: () => void;
  onSelectQuestion?: (question: ReflectionQuestion) => void;
}

export function AIReflection({ content, onClose, onSelectQuestion }: AIReflectionProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [questions, setQuestions] = useState<ReflectionQuestion[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [showApiKeyInput, setShowApiKeyInput] = useState(false);
  const [tempApiKey, setTempApiKey] = useState('');
  const [showTonePicker, setShowTonePicker] = useState(true);
  const [selectedTone, setSelectedTone] = useState<AITone>('comforting');

  const { aiApiKey, aiTone, updateSetting } = useSettings();

  const generateQuestions = async (tone: AITone) => {
    if (!content || content.trim().length < 20) {
      setError('Write a bit more before reflecting - at least a few sentences.');
      return;
    }

    if (!aiApiKey) {
      setShowApiKeyInput(true);
      return;
    }

    setShowTonePicker(false);
    setIsLoading(true);
    setError(null);
    setQuestions([]);

    try {
      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${aiApiKey}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          systemInstruction: {
            parts: [{
              text: `${tonePrompts[tone]}

RESPOND WITH ONLY A JSON ARRAY. No text before or after. No markdown code blocks. Just pure JSON.

You must return EXACTLY 3 questions in this format:
[{"question": "Your question here?", "type": "emotion"}, {"question": "Second question?", "type": "insight"}, {"question": "Third question?", "type": "action"}]

Valid types: "emotion" (feelings), "insight" (understanding), "action" (next steps), "connection" (relationships/patterns)

Each question should be distinct and match your assigned tone.`
            }]
          },
          contents: [{
            parts: [{
              text: `Journal entry:\n\n${content}\n\nGive me exactly 3 reflection questions that directly reference specific details, names, situations, or decisions from this entry. Do NOT ask generic questions - each question must prove you read and understood what I wrote.`
            }]
          }],
          generationConfig: {
            temperature: 0.7,
            maxOutputTokens: 500,
          }
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        if (response.status === 400 || response.status === 403) {
          setError('Invalid API key. Please check your Gemini API key.');
          setShowApiKeyInput(true);
        } else {
          setError(errorData.error?.message || 'Failed to generate questions. Please try again.');
        }
        return;
      }

      const data = await response.json();
      const responseContent = data.candidates?.[0]?.content?.parts?.[0]?.text;

      if (responseContent) {
        analytics.aiReflectionUsed(tone);
        try {
          // Extract JSON from the response - handle markdown blocks and preamble text
          let jsonStr = responseContent.trim();

          // Strip markdown code blocks if present
          const codeBlockMatch = jsonStr.match(/```(?:json)?\s*([\s\S]*?)\s*```/);
          if (codeBlockMatch) {
            jsonStr = codeBlockMatch[1];
          }

          // If still not valid JSON, try to find JSON array in the text
          if (!jsonStr.startsWith('[')) {
            const jsonMatch = jsonStr.match(/\[[\s\S]*\]/);
            if (jsonMatch) {
              jsonStr = jsonMatch[0];
            }
          }

          const parsed = JSON.parse(jsonStr);
          setQuestions(parsed);
        } catch {
          // If not valid JSON, create a simple question from the text
          setQuestions([{ question: responseContent, type: 'insight' }]);
        }
      }
    } catch (err) {
      console.error('AI Reflection error:', err);
      setError('Could not connect to AI service. Please check your internet connection.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveApiKey = () => {
    if (tempApiKey.trim()) {
      updateSetting('aiApiKey', tempApiKey.trim());
      setShowApiKeyInput(false);
      setTempApiKey('');
    }
  };

  const handleOpen = () => {
    setIsOpen(true);
    setShowTonePicker(true);
    setSelectedTone(aiTone || 'comforting');
    setQuestions([]);
    setError(null);
  };

  const handleClose = () => {
    setIsOpen(false);
    setQuestions([]);
    setError(null);
    setShowApiKeyInput(false);
    setShowTonePicker(true);
    onClose?.();
  };

  const handleSelectTone = (tone: AITone) => {
    setSelectedTone(tone);
    generateQuestions(tone);
  };

  const handleBackToTones = () => {
    setShowTonePicker(true);
    setQuestions([]);
    setError(null);
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'emotion': return '💭';
      case 'insight': return '💡';
      case 'action': return '🎯';
      case 'connection': return '🔗';
      default: return '✨';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'emotion': return 'bg-pink-50 border-pink-200';
      case 'insight': return 'bg-amber-50 border-amber-200';
      case 'action': return 'bg-green-50 border-green-200';
      case 'connection': return 'bg-blue-50 border-blue-200';
      default: return 'bg-amber-50 border-amber-200';
    }
  };

  return (
    <>
      {/* Trigger Button */}
      <button
        onClick={handleOpen}
        className={cn(
          'p-3 rounded-xl transition-all',
          'bg-amber-700 hover:bg-amber-800',
          'shadow-lg hover:shadow-xl',
          'group'
        )}
        title="AI Reflection - Get thoughtful questions about your writing"
      >
        <Brain className="w-5 h-5 text-white group-hover:scale-110 transition-transform" />
      </button>

      {/* Modal */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4"
            onClick={handleClose}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-lg bg-white rounded-2xl shadow-2xl overflow-hidden"
            >
              {/* Header */}
              <div className="bg-amber-800 px-6 py-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-white/10 rounded-lg">
                    <Sparkles className="w-5 h-5 text-amber-200" />
                  </div>
                  <div>
                    <h2 className="text-lg font-medium text-amber-50">AI Reflection</h2>
                    <p className="text-sm text-amber-200/70">Questions to deepen your writing</p>
                  </div>
                </div>
                <button
                  onClick={handleClose}
                  className="p-2 rounded-lg hover:bg-white/10 transition-colors"
                >
                  <X className="w-5 h-5 text-amber-200" />
                </button>
              </div>

              {/* Content */}
              <div className="p-6 max-h-[60vh] overflow-y-auto">
                {/* API Key Input */}
                {showApiKeyInput && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-6 p-4 bg-amber-50 rounded-xl border border-amber-200"
                  >
                    <div className="flex items-center gap-2 mb-3">
                      <Key className="w-4 h-4 text-amber-600" />
                      <p className="text-sm font-medium text-amber-800">Gemini API Key Required</p>
                    </div>
                    <p className="text-xs text-amber-600 mb-3">
                      Your key is stored locally and never shared. Get one at{' '}
                      <a
                        href="https://aistudio.google.com/app/apikey"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="underline hover:text-amber-800"
                      >
                        aistudio.google.com
                      </a>
                    </p>
                    <div className="flex gap-2">
                      <input
                        type="password"
                        value={tempApiKey}
                        onChange={(e) => setTempApiKey(e.target.value)}
                        placeholder="AIza..."
                        className="flex-1 px-3 py-2 text-sm border border-amber-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                      />
                      <button
                        onClick={handleSaveApiKey}
                        disabled={!tempApiKey.trim()}
                        className="px-4 py-2 bg-amber-600 text-white text-sm font-medium rounded-lg hover:bg-amber-700 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Save
                      </button>
                    </div>
                  </motion.div>
                )}

                {/* Tone Picker */}
                {showTonePicker && !showApiKeyInput && (
                  <div className="space-y-3">
                    <p className="text-sm text-gray-600 mb-4">
                      What kind of reflection do you need today?
                    </p>
                    {(Object.keys(toneInfo) as AITone[]).map((tone) => {
                      const info = toneInfo[tone];
                      return (
                        <motion.button
                          key={tone}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          onClick={() => handleSelectTone(tone)}
                          className={cn(
                            'w-full p-4 rounded-xl border-2 text-left transition-all',
                            'hover:scale-[1.01] hover:shadow-md',
                            'bg-white border-gray-200 hover:border-amber-400'
                          )}
                        >
                          <div className="flex items-start gap-3">
                            <span className="text-2xl">{info.emoji}</span>
                            <div className="flex-1">
                              <p className="font-medium text-gray-800">{info.label}</p>
                              <p className="text-sm text-gray-500">{info.description}</p>
                              <p className="text-xs text-amber-600 mt-1">Best for: {info.bestFor}</p>
                            </div>
                          </div>
                        </motion.button>
                      );
                    })}
                  </div>
                )}

                {/* Loading State */}
                {isLoading && (
                  <div className="flex flex-col items-center justify-center py-12">
                    <Loader2 className="w-8 h-8 text-amber-600 animate-spin mb-4" />
                    <p className="text-sm text-gray-500">Reading your thoughts...</p>
                    <p className="text-xs text-gray-400 mt-1">Using {toneInfo[selectedTone].label} tone</p>
                  </div>
                )}

                {/* Error State */}
                {error && !showApiKeyInput && !showTonePicker && (
                  <div className="p-4 bg-red-50 rounded-xl border border-red-200">
                    <p className="text-sm text-red-600">{error}</p>
                    <button
                      onClick={() => generateQuestions(selectedTone)}
                      className="mt-3 text-sm text-red-700 underline hover:text-red-800"
                    >
                      Try again
                    </button>
                  </div>
                )}

                {/* Questions */}
                {questions.length > 0 && !showTonePicker && (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between mb-4">
                      <button
                        onClick={handleBackToTones}
                        className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700"
                      >
                        <ChevronLeft className="w-4 h-4" />
                        Change tone
                      </button>
                      <div className="flex items-center gap-2 text-sm text-gray-500">
                        <span>{toneInfo[selectedTone].emoji}</span>
                        <span>{toneInfo[selectedTone].label}</span>
                        <button
                          onClick={() => generateQuestions(selectedTone)}
                          className="p-1 hover:bg-gray-100 rounded"
                          title="Regenerate questions"
                        >
                          <RefreshCw className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                    <p className="text-sm text-gray-500 mb-2">
                      Click a question to pin it while you write...
                    </p>
                    {questions.map((q, index) => (
                      <motion.button
                        key={index}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        onClick={() => {
                          onSelectQuestion?.(q);
                          handleClose();
                        }}
                        className={cn(
                          'w-full p-4 rounded-xl border-2 text-left transition-all',
                          'hover:scale-[1.02] hover:shadow-md cursor-pointer',
                          getTypeColor(q.type)
                        )}
                      >
                        <div className="flex items-start gap-3">
                          <span className="text-xl">{getTypeIcon(q.type)}</span>
                          <p className="text-gray-800 leading-relaxed flex-1">{q.question}</p>
                          <span className="text-xs text-gray-400 mt-1">📌</span>
                        </div>
                      </motion.button>
                    ))}
                  </div>
                )}
              </div>

              {/* Footer */}
              <div className="px-6 py-4 bg-gray-50 border-t border-gray-100">
                <p className="text-xs text-gray-400 text-center">
                  Your journal content stays private. Questions are generated using AI and not stored.
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
