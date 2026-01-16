// Predefined starter tags with colors
export const starterTags: { name: string; color: string }[] = [
  { name: 'personal', color: '#8b5cf6' },      // Purple
  { name: 'work', color: '#3b82f6' },          // Blue
  { name: 'health', color: '#22c55e' },        // Green
  { name: 'relationships', color: '#ec4899' }, // Pink
  { name: 'gratitude', color: '#f59e0b' },     // Amber
  { name: 'goals', color: '#06b6d4' },         // Cyan
  { name: 'reflection', color: '#6366f1' },    // Indigo
  { name: 'ideas', color: '#eab308' },         // Yellow
  { name: 'family', color: '#f97316' },        // Orange
  { name: 'growth', color: '#14b8a6' },        // Teal
];

// Default tag colors for custom tags
export const tagColors: string[] = [
  '#8b5cf6', // Purple
  '#3b82f6', // Blue
  '#22c55e', // Green
  '#ec4899', // Pink
  '#f59e0b', // Amber
  '#06b6d4', // Cyan
  '#6366f1', // Indigo
  '#eab308', // Yellow
  '#f97316', // Orange
  '#14b8a6', // Teal
  '#ef4444', // Red
  '#84cc16', // Lime
];

// Get color for a tag (from starter tags or assign based on name hash)
export function getTagColor(tagName: string, customTags?: { name: string; color: string }[]): string {
  // Check starter tags first
  const starter = starterTags.find(t => t.name === tagName);
  if (starter) return starter.color;

  // Check custom tags
  if (customTags) {
    const custom = customTags.find(t => t.name === tagName);
    if (custom) return custom.color;
  }

  // Generate consistent color based on tag name
  let hash = 0;
  for (let i = 0; i < tagName.length; i++) {
    hash = tagName.charCodeAt(i) + ((hash << 5) - hash);
  }
  return tagColors[Math.abs(hash) % tagColors.length];
}
