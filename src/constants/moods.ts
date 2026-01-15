import type { Mood } from '@/types/journal';

export interface MoodConfig {
  name: string;
  emoji: string;
  color: string;
}

export const moods: Record<Mood, MoodConfig> = {
  happy: {
    name: 'Happy',
    emoji: '😊',
    color: '#fbbf24',
  },
  sad: {
    name: 'Sad',
    emoji: '😢',
    color: '#60a5fa',
  },
  anxious: {
    name: 'Anxious',
    emoji: '😰',
    color: '#f87171',
  },
  calm: {
    name: 'Calm',
    emoji: '😌',
    color: '#34d399',
  },
  excited: {
    name: 'Excited',
    emoji: '🤩',
    color: '#f472b6',
  },
  grateful: {
    name: 'Grateful',
    emoji: '🙏',
    color: '#a78bfa',
  },
  tired: {
    name: 'Tired',
    emoji: '😴',
    color: '#9ca3af',
  },
  energetic: {
    name: 'Energetic',
    emoji: '⚡',
    color: '#fcd34d',
  },
  thoughtful: {
    name: 'Thoughtful',
    emoji: '🤔',
    color: '#67e8f9',
  },
  creative: {
    name: 'Creative',
    emoji: '🎨',
    color: '#c084fc',
  },
  angry: {
    name: 'Angry',
    emoji: '😠',
    color: '#ef4444',
  },
  frustrated: {
    name: 'Frustrated',
    emoji: '😤',
    color: '#f97316',
  },
  defeated: {
    name: 'Defeated',
    emoji: '😞',
    color: '#6b7280',
  },
  stressed: {
    name: 'Stressed',
    emoji: '😫',
    color: '#dc2626',
  },
  hopeful: {
    name: 'Hopeful',
    emoji: '🌟',
    color: '#eab308',
  },
  lonely: {
    name: 'Lonely',
    emoji: '🥺',
    color: '#8b5cf6',
  },
  proud: {
    name: 'Proud',
    emoji: '😤',
    color: '#10b981',
  },
  confused: {
    name: 'Confused',
    emoji: '😕',
    color: '#6366f1',
  },
  loved: {
    name: 'Loved',
    emoji: '🥰',
    color: '#ec4899',
  },
  content: {
    name: 'Content',
    emoji: '☺️',
    color: '#84cc16',
  },
  numb: {
    name: 'Nothing',
    emoji: '😶',
    color: '#a1a1aa',
  },
};

export const moodList = Object.entries(moods).map(([key, value]) => ({
  id: key as Mood,
  ...value,
}));
