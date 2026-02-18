import type { FontFamily } from '@/types/settings';

export interface FontConfig {
  name: string;
  displayName: string;
  className: string;
  sampleText: string;
  category: 'neat' | 'messy' | 'bold' | 'childlike' | 'vintage' | 'serif';
}

export const fontCategories = {
  neat: {
    label: 'Neat & Tidy',
    description: 'Clean, organized handwriting',
  },
  messy: {
    label: 'Messy & Quick',
    description: 'Rushed, scribbled notes',
  },
  bold: {
    label: 'Bold & Expressive',
    description: 'Marker style, emphatic',
  },
  childlike: {
    label: 'Childlike & Playful',
    description: 'Youthful, whimsical',
  },
  vintage: {
    label: 'Vintage & Classic',
    description: 'Old-fashioned journal style',
  },
  serif: {
    label: 'Serif',
    description: 'Classic, elegant typography',
  },
};

export const fonts: Record<FontFamily, FontConfig> = {
  // Neat & Tidy
  caveat: {
    name: 'Caveat',
    displayName: 'Caveat',
    className: 'font-caveat',
    sampleText: 'Today was a good day...',
    category: 'neat',
  },
  patrickHand: {
    name: 'Patrick Hand',
    displayName: 'Patrick Hand',
    className: 'font-patrick',
    sampleText: 'Today was a good day...',
    category: 'neat',
  },
  kalam: {
    name: 'Kalam',
    displayName: 'Kalam',
    className: 'font-kalam',
    sampleText: 'Today was a good day...',
    category: 'neat',
  },
  comingSoon: {
    name: 'Coming Soon',
    displayName: 'Coming Soon',
    className: 'font-comingsoon',
    sampleText: 'Today was a good day...',
    category: 'neat',
  },

  // Messy & Quick
  shadowsIntoLight: {
    name: 'Shadows Into Light',
    displayName: 'Shadows Into Light',
    className: 'font-shadows',
    sampleText: 'running late again...',
    category: 'messy',
  },
  reenieBeanie: {
    name: 'Reenie Beanie',
    displayName: 'Reenie Beanie',
    className: 'font-reenie',
    sampleText: 'running late again...',
    category: 'messy',
  },
  justAnotherHand: {
    name: 'Just Another Hand',
    displayName: 'Just Another Hand',
    className: 'font-justanotherhand',
    sampleText: 'running late again...',
    category: 'messy',
  },
  coveredByYourGrace: {
    name: 'Covered By Your Grace',
    displayName: 'Covered By Your Grace',
    className: 'font-coveredbyyourgrace',
    sampleText: 'running late again...',
    category: 'messy',
  },

  // Bold & Expressive
  permanentMarker: {
    name: 'Permanent Marker',
    displayName: 'Permanent Marker',
    className: 'font-marker',
    sampleText: 'THIS IS IMPORTANT!',
    category: 'bold',
  },
  architectsDaughter: {
    name: 'Architects Daughter',
    displayName: 'Architects Daughter',
    className: 'font-architects',
    sampleText: 'THIS IS IMPORTANT!',
    category: 'bold',
  },

  // Childlike & Playful
  gloriaHallelujah: {
    name: 'Gloria Hallelujah',
    displayName: 'Gloria Hallelujah',
    className: 'font-gloria',
    sampleText: 'had so much fun today!!!',
    category: 'childlike',
  },
  gochiHand: {
    name: 'Gochi Hand',
    displayName: 'Gochi Hand',
    className: 'font-gochihand',
    sampleText: 'had so much fun today!!!',
    category: 'childlike',
  },

  // Vintage & Classic
  homemadeApple: {
    name: 'Homemade Apple',
    displayName: 'Homemade Apple',
    className: 'font-homemadeapple',
    sampleText: 'A thought for the ages...',
    category: 'vintage',
  },
  nothingYouCouldDo: {
    name: 'Nothing You Could Do',
    displayName: 'Nothing You Could Do',
    className: 'font-nothingyoucoulddo',
    sampleText: 'A thought for the ages...',
    category: 'vintage',
  },
  satisfy: {
    name: 'Satisfy',
    displayName: 'Satisfy',
    className: 'font-satisfy',
    sampleText: 'A thought for the ages...',
    category: 'vintage',
  },
  marckScript: {
    name: 'Marck Script',
    displayName: 'Marck Script',
    className: 'font-marckscript',
    sampleText: 'A thought for the ages...',
    category: 'vintage',
  },

  // Serif fonts
  garamond: {
    name: 'EB Garamond',
    displayName: 'Garamond',
    className: 'font-garamond',
    sampleText: 'Your thoughts, beautifully written',
    category: 'serif',
  },
  merriweather: {
    name: 'Merriweather',
    displayName: 'Merriweather',
    className: 'font-merriweather',
    sampleText: 'Your thoughts, beautifully written',
    category: 'serif',
  },
  lora: {
    name: 'Lora',
    displayName: 'Lora',
    className: 'font-lora',
    sampleText: 'Your thoughts, beautifully written',
    category: 'serif',
  },
};

export const fontsByCategory = {
  neat: Object.entries(fonts).filter(([, f]) => f.category === 'neat'),
  messy: Object.entries(fonts).filter(([, f]) => f.category === 'messy'),
  bold: Object.entries(fonts).filter(([, f]) => f.category === 'bold'),
  childlike: Object.entries(fonts).filter(([, f]) => f.category === 'childlike'),
  vintage: Object.entries(fonts).filter(([, f]) => f.category === 'vintage'),
  serif: Object.entries(fonts).filter(([, f]) => f.category === 'serif'),
};

export const fontSizes = {
  small: '0.875rem',
  medium: '1rem',
  large: '1.25rem',
};
