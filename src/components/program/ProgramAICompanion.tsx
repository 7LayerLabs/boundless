'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Brain, X, Loader2, Sparkles, Key, RefreshCw, MessageCircle } from 'lucide-react';
import { cn } from '@/lib/utils/cn';
import { useSettings } from '@/hooks/useSettings';

interface FollowUpQuestion {
  question: string;
  type: 'deeper' | 'missed' | 'expand' | 'connect';
  context: string;
}

interface ProgramAICompanionProps {
  prompt: string;
  content: string;
  programName: string;
  darkMode: boolean;
  onInsertQuestion?: (question: string) => void;
}

const typeInfo: Record<string, { emoji: string; label: string; color: string }> = {
  deeper: {
    emoji: '🔍',
    label: 'Explore Further',
    color: 'bg-purple-50 border-purple-200',
  },
  expand: {
    emoji: '📝',
    label: 'Describe More',
    color: 'bg-blue-50 border-blue-200',
  },
  explore: {
    emoji: '🌿',
    label: 'Look Closer',
    color: 'bg-green-50 border-green-200',
  },
  describe: {
    emoji: '💭',
    label: 'What Was That Like',
    color: 'bg-amber-50 border-amber-200',
  },
};

export function ProgramAICompanion({
  prompt,
  content,
  programName,
  darkMode,
  onInsertQuestion,
}: ProgramAICompanionProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [questions, setQuestions] = useState<FollowUpQuestion[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [showApiKeyInput, setShowApiKeyInput] = useState(false);
  const [tempApiKey, setTempApiKey] = useState('');

  const { aiApiKey, updateSetting } = useSettings();

  const systemPrompt = `You are a neutral writing companion for a guided journaling program called "${programName}".

The user is responding to this prompt: "${prompt}"

Your ONLY job is to ask questions that help them explore their own thoughts more fully. You are a MIRROR, not a guide.

=== CRITICAL SAFETY RULES - NEVER VIOLATE THESE ===

1. NEVER validate or dismiss ANY thought, feeling, belief, or perception
   - BAD: "You're right to feel that way"
   - BAD: "That sounds like it might not be accurate"
   - BAD: "It's normal to feel..."
   - GOOD: "You wrote that you feel X - what does that feel like in your body?"

2. NEVER lead toward ANY conclusion or decision
   - BAD: "Have you considered that maybe he does care?"
   - BAD: "It sounds like you should..."
   - GOOD: "You mentioned feeling unsure - what would help you understand this better?"

3. NEVER agree or disagree with their interpretation of events or people
   - BAD: "That does sound manipulative"
   - BAD: "Maybe they didn't mean it that way"
   - GOOD: "You described this as manipulative - what specifically made it feel that way to you?"

4. NEVER offer reassurance, comfort, or encouragement about beliefs
   - BAD: "You're not crazy for thinking that"
   - BAD: "That's a valid concern"
   - GOOD: "You mentioned this thought keeps coming back - when did you first notice it?"

5. NEVER suggest what they "should" feel, do, or think

6. For ANY concerning content (paranoia, self-harm, harm to others, delusions):
   - Do NOT engage with the content's validity
   - Simply ask neutral exploratory questions about their experience
   - Example: If they write "people are watching me" - ask "How long have you been noticing this?" NOT "That must be scary" or "What makes you think that's happening?"

=== YOUR APPROACH ===

Ask questions that:
- Reflect back SPECIFIC things they wrote without adding interpretation
- Help them describe their experience more fully
- Explore the "what" and "how" - not the "why" (why can feel judgmental)
- Let THEM draw their own conclusions

GOOD QUESTION PATTERNS:
- "You wrote [exact quote] - what was that like?"
- "You mentioned [specific detail] briefly - what else do you remember about that?"
- "You used the word [their word] - what does that word mean to you here?"
- "What were you noticing in your body when [thing they described]?"
- "You moved quickly past [topic] - is there more there?"

BAD QUESTION PATTERNS:
- "Why do you think...?" (implies they should have a reason)
- "Have you considered...?" (leading)
- "Don't you think...?" (leading)
- "It sounds like..." (interpretation)
- "Maybe..." (suggestion)

=== OUTPUT FORMAT ===

Return EXACTLY 3 questions in this JSON format:
[
  {"question": "Your neutral question?", "type": "deeper", "context": "What you noticed in their writing"},
  {"question": "Second question?", "type": "expand", "context": "Specific detail they mentioned"},
  {"question": "Third question?", "type": "explore", "context": "Something they touched on briefly"}
]

Valid types: "deeper", "expand", "explore", "describe"

Remember: You have NO opinion. You make NO judgments. You offer NO guidance. You simply help them look more closely at what they already wrote.`;

  const generateQuestions = async () => {
    if (!content || content.trim().length < 30) {
      setError('Write a bit more first - at least a few sentences to work with.');
      return;
    }

    if (!aiApiKey) {
      setShowApiKeyInput(true);
      return;
    }

    setIsLoading(true);
    setError(null);
    setQuestions([]);

    try {
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${aiApiKey}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            systemInstruction: {
              parts: [{ text: systemPrompt }],
            },
            contents: [
              {
                parts: [
                  {
                    text: `Here's what I've written so far:\n\n${content}\n\nBased on what I wrote, give me 3 follow-up questions to help me go deeper. Remember to reference SPECIFIC things I mentioned.`,
                  },
                ],
              },
            ],
            generationConfig: {
              temperature: 0.7,
              maxOutputTokens: 800,
            },
          }),
        }
      );

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
        try {
          let jsonStr = responseContent.trim();

          // Strip markdown code blocks if present
          const codeBlockMatch = jsonStr.match(/```(?:json)?\s*([\s\S]*?)\s*```/);
          if (codeBlockMatch) {
            jsonStr = codeBlockMatch[1];
          }

          // Find JSON array in text
          if (!jsonStr.startsWith('[')) {
            const jsonMatch = jsonStr.match(/\[[\s\S]*\]/);
            if (jsonMatch) {
              jsonStr = jsonMatch[0];
            }
          }

          const parsed = JSON.parse(jsonStr);
          setQuestions(parsed);
        } catch {
          setQuestions([
            {
              question: responseContent,
              type: 'deeper',
              context: 'AI response',
            },
          ]);
        }
      }
    } catch (err) {
      console.error('Program AI Companion error:', err);
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
    setQuestions([]);
    setError(null);
    generateQuestions();
  };

  const handleClose = () => {
    setIsOpen(false);
    setQuestions([]);
    setError(null);
    setShowApiKeyInput(false);
  };

  const handleSelectQuestion = (question: FollowUpQuestion) => {
    onInsertQuestion?.(question.question);
    handleClose();
  };

  return (
    <>
      {/* Trigger Button */}
      <button
        onClick={handleOpen}
        className={cn(
          'flex items-center gap-2 px-3 py-2 rounded-lg transition-all',
          'border',
          darkMode
            ? 'border-amber-600/50 text-amber-400 hover:bg-amber-900/30'
            : 'border-amber-300 text-amber-700 hover:bg-amber-50'
        )}
        title="AI Companion - Get help going deeper"
      >
        <Brain className="w-4 h-4" />
        <span className="text-sm">Go Deeper</span>
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
              <div className="bg-gradient-to-r from-amber-700 to-amber-800 px-6 py-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-white/10 rounded-lg">
                    <MessageCircle className="w-5 h-5 text-amber-200" />
                  </div>
                  <div>
                    <h2 className="text-lg font-medium text-amber-50">Explore Your Writing</h2>
                    <p className="text-sm text-amber-200/70">Questions to look closer at what you wrote</p>
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

                {/* Loading State */}
                {isLoading && (
                  <div className="flex flex-col items-center justify-center py-12">
                    <Loader2 className="w-8 h-8 text-amber-600 animate-spin mb-4" />
                    <p className="text-sm text-gray-500">Reading your writing...</p>
                    <p className="text-xs text-gray-400 mt-1">Finding places you might want to explore more</p>
                  </div>
                )}

                {/* Error State */}
                {error && !showApiKeyInput && (
                  <div className="p-4 bg-red-50 rounded-xl border border-red-200">
                    <p className="text-sm text-red-600">{error}</p>
                    <button
                      onClick={generateQuestions}
                      className="mt-3 text-sm text-red-700 underline hover:text-red-800"
                    >
                      Try again
                    </button>
                  </div>
                )}

                {/* Questions */}
                {questions.length > 0 && (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-sm text-gray-600">
                        Some questions based on what you wrote...
                      </p>
                      <button
                        onClick={generateQuestions}
                        className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors"
                        title="Get different questions"
                      >
                        <RefreshCw className="w-4 h-4 text-gray-500" />
                      </button>
                    </div>

                    {questions.map((q, index) => {
                      const info = typeInfo[q.type] || typeInfo.deeper;
                      return (
                        <motion.button
                          key={index}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.1 }}
                          onClick={() => handleSelectQuestion(q)}
                          className={cn(
                            'w-full p-4 rounded-xl border-2 text-left transition-all',
                            'hover:scale-[1.01] hover:shadow-md cursor-pointer',
                            info.color
                          )}
                        >
                          <div className="flex items-start gap-3">
                            <span className="text-xl mt-0.5">{info.emoji}</span>
                            <div className="flex-1">
                              <p className="text-xs text-gray-500 mb-1">{info.label}</p>
                              <p className="text-gray-800 leading-relaxed">{q.question}</p>
                              {q.context && (
                                <p className="text-xs text-gray-500 mt-2 italic">
                                  "{q.context}"
                                </p>
                              )}
                            </div>
                          </div>
                        </motion.button>
                      );
                    })}

                    <p className="text-xs text-gray-400 text-center mt-4">
                      Click a question to add it to your writing space
                    </p>
                  </div>
                )}
              </div>

              {/* Footer */}
              <div className="px-6 py-4 bg-gray-50 border-t border-gray-100">
                <p className="text-xs text-gray-400 text-center">
                  Your writing stays private. These questions have no agenda—only you decide what to explore.
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
