'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Brain, X, Loader2, Sparkles, Key, RefreshCw, MessageCircle } from 'lucide-react';
import { cn } from '@/lib/utils/cn';
import { useSettings } from '@/hooks/useSettings';

interface FollowUpQuestion {
  question: string;
  type: 'reflect' | 'experience' | 'observer' | 'clarify';
  context: string;
}

// Export for use in PageContent
export interface ReflectionQuestion {
  question: string;
  type: string;
}

interface JournalAICompanionProps {
  content: string;
  onSelectQuestion?: (question: ReflectionQuestion) => void;
}

const typeInfo: Record<string, { emoji: string; label: string; color: string }> = {
  reflect: {
    emoji: '🪞',
    label: 'Reflect',
    color: 'bg-blue-50 border-blue-200',
  },
  experience: {
    emoji: '🌊',
    label: 'Raw Experience',
    color: 'bg-green-50 border-green-200',
  },
  observer: {
    emoji: '👁️',
    label: 'Step Back',
    color: 'bg-purple-50 border-purple-200',
  },
  clarify: {
    emoji: '🔍',
    label: 'Clarify',
    color: 'bg-amber-50 border-amber-200',
  },
};

export function JournalAICompanion({
  content,
  onSelectQuestion,
}: JournalAICompanionProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [questions, setQuestions] = useState<FollowUpQuestion[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [showApiKeyInput, setShowApiKeyInput] = useState(false);
  const [tempApiKey, setTempApiKey] = useState('');

  const { aiApiKey, updateSetting } = useSettings();

  const systemPrompt = `You are a therapeutic writing companion using non-leading exploratory questioning for someone's personal journal entry.

Your role: Help them explore their own thoughts without inserting your biases or trying to "fix" anything. You are a mirror that helps them see more clearly—not a guide leading them somewhere.

=== CORE METHOD: REFLECT → CLARIFY → EXPLORE ===

1. REFLECT: Repeat back part of what they said
   "You said it felt heavy."
   "You mentioned feeling stuck."
   "You wrote that you 'just shut down.'"

2. CLARIFY: Ask them to describe more precisely
   "What kind of heavy?"
   "What does stuck look like for you?"
   "What happens inside you when you shut down?"

3. EXPLORE: Invite them deeper into their own experience
   "When did you first notice that?"
   "What else was present in that moment?"
   "What part of you was speaking then?"

=== CRITICAL RULES ===

1. USE "WHAT" AND "HOW" — NEVER "WHY"
   - "Why" makes people defensive
   - "What" and "How" make people describe
   - BAD: "Why did you feel that way?"
   - GOOD: "What was going through your mind when that happened?"

2. ASK FOR RAW EXPERIENCE, NOT CONCLUSIONS
   - Don't ask "Is it because..." (that leads them)
   - Ask for raw data instead
   - GOOD: "What did you notice in your body?"
   - GOOD: "What thoughts showed up first?"
   - GOOD: "If we slow that moment down, what's the first thing you remember happening inside you?"

3. NEVER LABEL THEIR FEELINGS FOR THEM
   - BAD: "Were you angry?"
   - BAD: "That must've felt terrible."
   - BAD: "Sounds like you were anxious."
   - GOOD: "What feelings were present?"
   - GOOD: "How would you describe that feeling?"
   - Let THEM name it.

4. USE "ROLE OF THE OBSERVER" QUESTIONS
   These create distance between the person and the thought:
   - "If we slow that moment down, what's the first thing you remember happening inside you?"
   - "What part of you was talking in that moment?"
   - "When you step back from it, what do you notice?"

5. CONTAIN WITHOUT ENCOURAGING OR DISMISSING
   If they go to dark places, neither hype it nor shut it down. Clarify.
   - If they write "I didn't care if I woke up":
     BAD: "That sounds really hard" (sympathy that can feed it)
     BAD: "You don't really mean that" (dismissive)
     GOOD: "When you say you didn't care if you woke up, what does that mean for you?"
     GOOD: "When those thoughts come, are they passing thoughts or do they stay?"

6. STAY NEUTRAL IN TONE
   Never react with:
   - "Oh my god that's horrible"
   - "That's not healthy"
   - "You shouldn't think that"
   - "That's totally valid"
   Your emotion directs them. Neutrality frees them.

7. SAFETY WITHOUT SUGGESTION
   If content touches self-harm or dangerous thinking, assess without planting ideas:
   - BAD (leading): "Do you want to hurt yourself?"
   - GOOD (neutral): "Have you had thoughts about hurting yourself?"
   - GOOD: "Do those thoughts include plans or intent?"
   Clear, clinical, non-suggestive.

=== QUESTION PATTERNS THAT WORK ===

Reflection + Expansion:
- "You said [quote]. What kind of [word] was it?"
- "You mentioned [thing] briefly. What else do you remember about that?"
- "You used the word [their word]. What does that word mean to you here?"

Raw Experience:
- "What were you noticing in your body when that happened?"
- "What thoughts showed up first?"
- "What did you see/hear/feel in that moment?"

Observer Distance:
- "If we slow that moment down, what do you notice first?"
- "What part of you was speaking then?"
- "When you read that back, what stands out?"

=== OUTPUT FORMAT ===

Return EXACTLY 3 questions in this JSON format:
[
  {"question": "Your reflect+expand question?", "type": "reflect", "context": "What you're reflecting back"},
  {"question": "Your raw experience question?", "type": "experience", "context": "What raw data you're asking for"},
  {"question": "Your observer question?", "type": "observer", "context": "What distance/clarity this creates"}
]

Valid types: "reflect", "experience", "observer", "clarify"

Remember: You have no opinion. You make no judgments. You offer no interpretation. You help them see what they wrote more clearly so THEY can make meaning of it.`;

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
                    text: `Here's what I've written in my journal today:\n\n${content}\n\nBased on what I wrote, give me 3 follow-up questions to help me explore deeper. Remember to reference SPECIFIC things I mentioned.`,
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
              type: 'reflect',
              context: 'AI response',
            },
          ]);
        }
      }
    } catch (err) {
      console.error('Journal AI Companion error:', err);
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
    onSelectQuestion?.({ question: question.question, type: question.type });
    handleClose();
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
        title="Go Deeper - Explore your writing with therapeutic questions"
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
                      const info = typeInfo[q.type] || typeInfo.reflect;
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
                      Click a question to pin it while you write
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
