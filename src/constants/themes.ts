import type { BindingColor, ClaspStyle, InkColor, DateColor } from '@/types/settings';

export interface BindingTheme {
  name: string;
  color: string;
  shadowColor: string;
  recommendedClasp: ClaspStyle;
}

export const bindingColors: Record<BindingColor, BindingTheme> = {
  black: {
    name: 'Classic Black',
    color: '#1a1a1a',
    shadowColor: 'rgba(26, 26, 26, 0.5)',
    recommendedClasp: 'gold',
  },
  brown: {
    name: 'Rich Brown',
    color: '#6b4423',
    shadowColor: 'rgba(107, 68, 35, 0.5)',
    recommendedClasp: 'gold',
  },
  darkBrown: {
    name: 'Dark Mahogany',
    color: '#3d2314',
    shadowColor: 'rgba(61, 35, 20, 0.5)',
    recommendedClasp: 'bronze',
  },
  tan: {
    name: 'Natural Tan',
    color: '#c4a574',
    shadowColor: 'rgba(196, 165, 116, 0.5)',
    recommendedClasp: 'bronze',
  },
  teal: {
    name: 'Deep Teal',
    color: '#2d6a6a',
    shadowColor: 'rgba(45, 106, 106, 0.5)',
    recommendedClasp: 'silver',
  },
  pink: {
    name: 'Dusty Rose',
    color: '#d4a5a5',
    shadowColor: 'rgba(212, 165, 165, 0.5)',
    recommendedClasp: 'gold',
  },
  lavender: {
    name: 'Soft Lavender',
    color: '#9d8bb7',
    shadowColor: 'rgba(157, 139, 183, 0.5)',
    recommendedClasp: 'silver',
  },
  white: {
    name: 'Pearl White',
    color: '#f5f5f5',
    shadowColor: 'rgba(200, 200, 200, 0.5)',
    recommendedClasp: 'silver',
  },
  pastelBlue: {
    name: 'Pastel Blue',
    color: '#a8c5d9',
    shadowColor: 'rgba(168, 197, 217, 0.5)',
    recommendedClasp: 'silver',
  },
  pastelGreen: {
    name: 'Pastel Green',
    color: '#a8d9c5',
    shadowColor: 'rgba(168, 217, 197, 0.5)',
    recommendedClasp: 'gold',
  },
  pastelYellow: {
    name: 'Pastel Yellow',
    color: '#d9d5a8',
    shadowColor: 'rgba(217, 213, 168, 0.5)',
    recommendedClasp: 'gold',
  },
};

export interface ClaspTheme {
  name: string;
  color: string;
  highlight: string;
}

export const claspStyles: Record<ClaspStyle, ClaspTheme> = {
  gold: {
    name: 'Gold',
    color: '#d4af37',
    highlight: '#f5e6a3',
  },
  silver: {
    name: 'Silver',
    color: '#c0c0c0',
    highlight: '#e8e8e8',
  },
  bronze: {
    name: 'Bronze',
    color: '#cd7f32',
    highlight: '#e8b878',
  },
};

export const pageColors = {
  white: '#fefefe',
  cream: '#f4ead5',
};

export interface InkTheme {
  name: string;
  color: string;
  caretColor: string;
}

export const inkColors: Record<InkColor, InkTheme> = {
  black: {
    name: 'Black Ink',
    color: '#1a1410',
    caretColor: '#1a1410',
  },
  blue: {
    name: 'Blue Ink',
    color: '#1a4a7a',
    caretColor: '#1a4a7a',
  },
  red: {
    name: 'Red Ink',
    color: '#8b1e1e',
    caretColor: '#8b1e1e',
  },
  green: {
    name: 'Green Ink',
    color: '#1e5c3a',
    caretColor: '#1e5c3a',
  },
  purple: {
    name: 'Purple Ink',
    color: '#4a1e6b',
    caretColor: '#4a1e6b',
  },
};

export interface DateColorTheme {
  name: string;
  color: string;
  dayColor: string; // Slightly lighter for the day name
}

export const dateColors: Record<DateColor, DateColorTheme> = {
  brown: {
    name: 'Classic Brown',
    color: '#78350f',
    dayColor: '#92400e',
  },
  black: {
    name: 'Black',
    color: '#1f2937',
    dayColor: '#374151',
  },
  navy: {
    name: 'Navy Blue',
    color: '#1e3a5f',
    dayColor: '#2563eb',
  },
  forest: {
    name: 'Forest Green',
    color: '#14532d',
    dayColor: '#166534',
  },
  burgundy: {
    name: 'Burgundy',
    color: '#7f1d1d',
    dayColor: '#991b1b',
  },
  slate: {
    name: 'Slate Gray',
    color: '#475569',
    dayColor: '#64748b',
  },
};
