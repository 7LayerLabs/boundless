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
    label: 'Go Deeper',
    color: 'bg-purple-50 border-purple-200',
  },
  missed: {
    emoji: '💡',
    label: 'You Might Have Missed',
    color: 'bg-amber-50 border-amber-200',
  },
  expand: {
    emoji: '📝',
    label: 'Tell Me More',
    color: 'bg-blue-50 border-blue-200',
  },
  connect: {
    emoji: '🔗',
    label: 'Make a Connection',
    color: 'bg-green-50 border-green-200',
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

  const systemPrompt = `You are a thoughtful writing companion helping someone with a guided journaling program called "${programName}".

The user is responding to this prompt: "${prompt}"

Your job is to read what they've written and help them go DEEPER. People often:
- Mention something meaningful but quickly move past it
- Stay on the surface instead of exploring their real feelings
- Avoid the uncomfortable parts that hold the most growth
- Miss connections between what they wrote and larger patterns in their life

CRITICAL INSTRUCTIONS:
1. You MUST reference SPECIFIC things they wrote - names, situations, phrases, events
2. Notice what they mentioned briefly but didn't explore
3. Notice emotional words they used without explaining
4. Notice contradictions or tensions in their writing
5. Notice what they might be avoiding

BAD (too generic): "What feelings came up for you?"
GOOD (specific): "You mentioned your dad 'wasn't really there' - what did that actually look like day to day?"

BAD: "Can you tell me more?"
GOOD: "You wrote about your promotion being 'bittersweet' but then moved on. What made it bitter?"

Return EXACTLY 3 follow-up questions in this JSON format:
[
  {"question": "Your specific question?", "type": "deeper", "context": "Brief note about what you noticed"},
  {"question": "Second question?", "type": "missed", "context": "What they glossed over"},
  {"question": "Third question?", "type": "expand", "context": "What could use more detail"}
]

Valid types:
- "deeper": Dig into something they mentioned but didn't fully explore
- "missed": Point out something meaningful they might have skipped
- "expand": Ask them to tell you more about a specific detail
- "connect": Help them see patterns or connections

Be warm and curious, not interrogating. You're helping them discover insights, not judging them.`;

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
                    <h2 className="text-lg font-medium text-amber-50">Writing Companion</h2>
                    <p className="text-sm text-amber-200/70">Let's go deeper together</p>
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
                    <p className="text-xs text-gray-400 mt-1">Looking for where you can go deeper</p>
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
                        I noticed some places you might want to explore more...
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
                  Your writing stays private. Questions are generated to help you explore deeper.
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
