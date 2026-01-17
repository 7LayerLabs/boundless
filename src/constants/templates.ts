export interface EntryTemplate {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  content: string;
}

export const entryTemplates: EntryTemplate[] = [
  {
    id: 'gratitude',
    name: 'Gratitude',
    description: 'Count your blessings and appreciate the good',
    icon: '🙏',
    color: 'bg-amber-50 border-amber-200',
    content: `<p><strong>Three things I'm grateful for today:</strong></p>
<p>1. </p>
<p>2. </p>
<p>3. </p>
<p></p>
<p><strong>Someone who made my day better:</strong></p>
<p></p>
<p></p>
<p><strong>A small moment that brought me joy:</strong></p>
<p></p>`,
  },
  {
    id: 'goals',
    name: 'Goals & Intentions',
    description: 'Set your focus and track progress',
    icon: '🎯',
    color: 'bg-blue-50 border-blue-200',
    content: `<p><strong>My main goal for today:</strong></p>
<p></p>
<p></p>
<p><strong>Three tasks I will complete:</strong></p>
<p>☐ </p>
<p>☐ </p>
<p>☐ </p>
<p></p>
<p><strong>One thing I'm working towards:</strong></p>
<p></p>
<p></p>
<p><strong>How I'll know if today was successful:</strong></p>
<p></p>`,
  },
  {
    id: 'weekly-review',
    name: 'Weekly Review',
    description: 'Reflect on your week and plan ahead',
    icon: '📋',
    color: 'bg-purple-50 border-purple-200',
    content: `<p><strong>🌟 Wins from this week:</strong></p>
<p></p>
<p></p>
<p><strong>📚 What I learned:</strong></p>
<p></p>
<p></p>
<p><strong>💭 Challenges I faced:</strong></p>
<p></p>
<p></p>
<p><strong>🎯 Focus areas for next week:</strong></p>
<p>1. </p>
<p>2. </p>
<p>3. </p>
<p></p>
<p><strong>💡 One thing I want to do differently:</strong></p>
<p></p>`,
  },
  {
    id: 'morning-pages',
    name: 'Morning Pages',
    description: 'Stream of consciousness writing',
    icon: '☀️',
    color: 'bg-orange-50 border-orange-200',
    content: `<p><strong>How I'm feeling this morning:</strong></p>
<p></p>
<p></p>
<p><strong>What's on my mind:</strong></p>
<p></p>
<p></p>
<p><strong>What I'm looking forward to today:</strong></p>
<p></p>
<p></p>
<p><strong>Free writing (let your thoughts flow):</strong></p>
<p></p>`,
  },
  {
    id: 'evening-reflection',
    name: 'Evening Reflection',
    description: 'Process your day before rest',
    icon: '🌙',
    color: 'bg-indigo-50 border-indigo-200',
    content: `<p><strong>The best part of today was:</strong></p>
<p></p>
<p></p>
<p><strong>Something that challenged me:</strong></p>
<p></p>
<p></p>
<p><strong>How I handled it:</strong></p>
<p></p>
<p></p>
<p><strong>Tomorrow I will:</strong></p>
<p></p>
<p></p>
<p><strong>I'm letting go of:</strong></p>
<p></p>`,
  },
  {
    id: 'self-care',
    name: 'Self-Care Check-In',
    description: 'Nurture your mind, body, and soul',
    icon: '💚',
    color: 'bg-green-50 border-green-200',
    content: `<p><strong>Physical: How does my body feel?</strong></p>
<p></p>
<p></p>
<p><strong>Mental: What's my headspace like?</strong></p>
<p></p>
<p></p>
<p><strong>Emotional: What feelings am I experiencing?</strong></p>
<p></p>
<p></p>
<p><strong>Something kind I did for myself today:</strong></p>
<p></p>
<p></p>
<p><strong>What I need right now:</strong></p>
<p></p>`,
  },
  {
    id: 'creativity',
    name: 'Creative Spark',
    description: 'Capture ideas and inspiration',
    icon: '✨',
    color: 'bg-pink-50 border-pink-200',
    content: `<p><strong>An idea that excites me:</strong></p>
<p></p>
<p></p>
<p><strong>Something that inspired me recently:</strong></p>
<p></p>
<p></p>
<p><strong>If I could create anything, I would:</strong></p>
<p></p>
<p></p>
<p><strong>A problem I'd love to solve:</strong></p>
<p></p>
<p></p>
<p><strong>Random thoughts & doodles:</strong></p>
<p></p>`,
  },
  {
    id: 'brain-dump',
    name: 'Brain Dump',
    description: 'Clear your mind of everything',
    icon: '🧠',
    color: 'bg-gray-50 border-gray-200',
    content: `<p><strong>Everything on my mind right now:</strong></p>
<p></p>
<p></p>
<p></p>
<p></p>
<p></p>
<p><strong>Things I need to do:</strong></p>
<p></p>
<p></p>
<p></p>
<p><strong>Things I'm worried about:</strong></p>
<p></p>
<p></p>
<p></p>
<p><strong>Things I'm excited about:</strong></p>
<p></p>`,
  },
];
