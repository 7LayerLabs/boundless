export interface GuidedProgram {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  duration: number; // in days
  prompts: string[];
}

export const guidedPrograms: GuidedProgram[] = [
  {
    id: 'gratitude-30',
    name: '30 Days of Gratitude',
    description: 'Cultivate an attitude of appreciation',
    icon: '🙏',
    color: 'bg-amber-50 border-amber-200',
    duration: 30,
    prompts: [
      "What's one thing you often take for granted but are grateful for?",
      "Write about someone who has positively impacted your life.",
      "What's a skill or ability you're thankful to have?",
      "Describe a place that brings you peace and comfort.",
      "What's a challenge you've overcome that you're now grateful for?",
      "Write about a recent small pleasure that made you smile.",
      "What's something in nature that fills you with wonder?",
      "Who in your life always makes you feel supported?",
      "What's a piece of technology you're grateful exists?",
      "Describe a memory that warms your heart.",
      "What's something about your body you appreciate?",
      "Write about a book, song, or movie that changed your perspective.",
      "What's a simple daily routine you're thankful for?",
      "Who's a stranger who once showed you unexpected kindness?",
      "What's something you have now that past-you would be thrilled about?",
      "Describe a lesson learned from a difficult experience.",
      "What's an opportunity you're grateful to have had?",
      "Write about a pet or animal that has brought joy to your life.",
      "What's something about where you live that you appreciate?",
      "Who's a teacher or mentor you're grateful for?",
      "What's a comfort food and the memories it brings?",
      "Describe a friendship that has stood the test of time.",
      "What's a cultural tradition you value?",
      "Write about a time when everything worked out better than expected.",
      "What's something you love about the current season?",
      "Who always believes in you, even when you doubt yourself?",
      "What's a freedom or right you're grateful to have?",
      "Describe your favorite part of your daily routine.",
      "What's something that made you laugh recently?",
      "Looking back, what three things are you most grateful for from this month?",
    ],
  },
  {
    id: 'self-discovery',
    name: 'Self-Discovery Journey',
    description: 'Explore who you really are',
    icon: '🔮',
    color: 'bg-purple-50 border-purple-200',
    duration: 30,
    prompts: [
      "What are five words that best describe who you are?",
      "What's your earliest memory? How do you think it shaped you?",
      "What are you most passionate about? When did this passion begin?",
      "Describe your perfect day from start to finish.",
      "What do you value most in relationships?",
      "What's a belief you held strongly that has changed over time?",
      "When do you feel most like yourself?",
      "What would you do if you knew you couldn't fail?",
      "What are your three greatest strengths?",
      "What's a weakness you're working to improve?",
      "How do you typically handle conflict?",
      "What does success mean to you?",
      "Describe a turning point in your life.",
      "What role does creativity play in your life?",
      "What are you most afraid of? Why?",
      "How do you recharge when you're feeling drained?",
      "What legacy do you want to leave behind?",
      "What brings you a sense of purpose?",
      "How has your definition of happiness evolved?",
      "What's something you wish others understood about you?",
      "What boundaries do you need to set or maintain?",
      "How do you express love and care for others?",
      "What childhood dream still resonates with you?",
      "What does your ideal future look like?",
      "How do you handle uncertainty?",
      "What's a part of yourself you've struggled to accept?",
      "What motivates you to keep going during hard times?",
      "How has your relationship with yourself changed over time?",
      "What would you tell your younger self?",
      "After this journey, what have you discovered about yourself?",
    ],
  },
  {
    id: 'mindfulness-21',
    name: '21 Days of Mindfulness',
    description: 'Develop present-moment awareness',
    icon: '🧘',
    color: 'bg-teal-50 border-teal-200',
    duration: 21,
    prompts: [
      "Describe this present moment using all five senses.",
      "What thoughts keep replaying in your mind? Observe them without judgment.",
      "Write about your breath. Notice its rhythm and depth.",
      "What emotions are you carrying right now? Where do you feel them in your body?",
      "Describe one ordinary activity you did today with full attention.",
      "What's one thing you noticed today that you usually overlook?",
      "Write about a moment when you felt truly present recently.",
      "What distracts you most often? How can you gently redirect your focus?",
      "Describe the space around you in detail right now.",
      "What thoughts are you letting go of today?",
      "Write about eating one meal mindfully. What did you notice?",
      "How does your body feel in this moment? Scan from head to toe.",
      "What sounds can you hear right now? Near and far?",
      "Describe a conversation you had with full presence.",
      "What patterns in your thinking have you noticed this week?",
      "Write about walking somewhere today. What did you observe?",
      "What are you grateful for in this exact moment?",
      "How has being more mindful affected your daily life?",
      "What emotions came up today? How did you respond to them?",
      "Describe a moment of stillness you experienced recently.",
      "Reflecting on these 21 days, how has your awareness changed?",
    ],
  },
  {
    id: 'confidence-14',
    name: '14 Days to Confidence',
    description: 'Build self-esteem and inner strength',
    icon: '💪',
    color: 'bg-rose-50 border-rose-200',
    duration: 14,
    prompts: [
      "Write about a time when you surprised yourself with your own capability.",
      "What are ten things you genuinely like about yourself?",
      "Describe a compliment you received that was hard to accept. Why?",
      "What's a fear you've conquered? How did you do it?",
      "Write a letter of encouragement to yourself.",
      "What negative self-talk do you want to replace? With what?",
      "Describe a moment when you stood up for yourself.",
      "What accomplishment are you most proud of?",
      "Write about someone who inspires confidence in you.",
      "What would you attempt if you were confident enough?",
      "How do you handle criticism? How would you like to handle it?",
      "Describe your strengths as if you were recommending yourself for something.",
      "What's one small step you can take today to build confidence?",
      "Looking back on these two weeks, how has your self-perception changed?",
    ],
  },
  {
    id: 'creativity-unlock',
    name: 'Unlock Your Creativity',
    description: 'Spark imagination and innovation',
    icon: '🎨',
    color: 'bg-pink-50 border-pink-200',
    duration: 14,
    prompts: [
      "If you could master any creative skill overnight, what would it be?",
      "Describe a color without naming it or similar colors.",
      "Write a short story that begins with 'The door opened to reveal...'",
      "What's something mundane that you could reinvent?",
      "Create a conversation between two unlikely characters.",
      "Describe your dream in vivid detail.",
      "What if you could redesign one everyday object? What would you change?",
      "Write about a place that exists only in your imagination.",
      "What creative project have you been putting off? Why?",
      "Describe a piece of art, music, or writing that moved you.",
      "If you could have a creative superpower, what would it be?",
      "Write the first page of your autobiography with a creative twist.",
      "What limiting beliefs hold back your creativity?",
      "Create a new holiday. What is it, and how is it celebrated?",
    ],
  },
];

// Get program progress from localStorage
export function getProgramProgress(programId: string): { startDate: string | null; currentDay: number } {
  if (typeof window === 'undefined') {
    return { startDate: null, currentDay: 0 };
  }

  const key = `program_${programId}`;
  const stored = localStorage.getItem(key);

  if (!stored) {
    return { startDate: null, currentDay: 0 };
  }

  const { startDate } = JSON.parse(stored);
  const start = new Date(startDate);
  const now = new Date();
  const diffTime = Math.abs(now.getTime() - start.getTime());
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

  return { startDate, currentDay: diffDays + 1 };
}

// Start a program
export function startProgram(programId: string): void {
  if (typeof window === 'undefined') return;

  const key = `program_${programId}`;
  localStorage.setItem(key, JSON.stringify({
    startDate: new Date().toISOString(),
  }));
}

// Reset a program
export function resetProgram(programId: string): void {
  if (typeof window === 'undefined') return;

  const key = `program_${programId}`;
  localStorage.removeItem(key);
}
