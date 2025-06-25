
export const formatTime = (seconds?: number) => {
  if (!seconds) return '0h 0m';
  
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  
  return `${hours}h ${minutes}m`;
};


export const chartColors = {
  status: {
    todo: '#FCD34D',       // Bright yellow
    inProgress: '#A78BFA', // Vibrant purple
    completed: '#4ADE80'   // Bright green
  },
  priority: {
    low: '#93C5FD',        // Light blue
    medium: '#FCD34D',     // Bright yellow
    high: '#F87171'        // Bright red
  },
  time: {
    gradient: ['#8B5CF6', '#6366F1', '#3B82F6'] // Purple to blue gradient
  },
  metrics: {
    tasks: ['#EDE9FE', '#C4B5FD'],      // Light purple gradient
    completion: ['#FCE7F3', '#F9A8D4'], // Light pink gradient
    time: ['#DCFCE7', '#86EFAC']        // Light green gradient
  },
  dashboard: {
    purple: '#8B5CF6',     // Vibrant purple
    blue: '#3B82F6',       // Bright blue
    green: '#10B981',      // Emerald green
    red: '#EF4444',        // Bright red
    yellow: '#F59E0B',     // Amber yellow
    pink: '#EC4899',       // Hot pink
    teal: '#14B8A6',       // Teal
    orange: '#F97316',     // Orange
    indigo: '#4F46E5'      // Indigo
  },
  gradients: {
    purpleToBlue: 'linear-gradient(to right, #8B5CF6, #3B82F6)',
    greenToTeal: 'linear-gradient(to right, #10B981, #14B8A6)',
    orangeToPink: 'linear-gradient(to right, #F97316, #EC4899)',
    redToOrange: 'linear-gradient(to right, #EF4444, #F97316)',
    yellowToGreen: 'linear-gradient(to right, #F59E0B, #10B981)'
  }
};


export const getRandomColor = () => {
  const colors = [
    '#8B5CF6', // Purple
    '#EC4899', // Pink
    '#4F46E5', // Indigo
    '#F97316', // Orange
    '#10B981', // Green
    '#FBBF24', // Yellow
    '#14B8A6'  // Teal
  ];
  return colors[Math.floor(Math.random() * colors.length)];
};


export const getPastelColor = (baseColor: string) => {
  
  const pastelPairs: Record<string, string> = {
    '#8B5CF6': '#EDE9FE', // Purple -> Light purple
    '#EC4899': '#FCE7F3', // Pink -> Light pink
    '#4F46E5': '#E0E7FF', // Indigo -> Light indigo
    '#F97316': '#FFF7ED', // Orange -> Light orange
    '#10B981': '#D1FAE5', // Green -> Light green
    '#FBBF24': '#FEF3C7', // Yellow -> Light yellow
    '#14B8A6': '#CCFBF1'  // Teal -> Light teal
  };
  
  return pastelPairs[baseColor] || '#F9FAFB'; // Default to light gray if not found
};


export const getRandomGradient = () => {
  const gradients = [
    'linear-gradient(to right, #8B5CF6, #3B82F6)',   // Purple to Blue
    'linear-gradient(to right, #EC4899, #F472B6)',   // Pink shades
    'linear-gradient(to right, #10B981, #14B8A6)',   // Green to Teal
    'linear-gradient(to right, #F97316, #FBBF24)',   // Orange to Yellow
    'linear-gradient(to right, #4F46E5, #818CF8)'    // Indigo shades
  ];
  
  return gradients[Math.floor(Math.random() * gradients.length)];
};


export const hexToRgba = (hex: string, opacity: number = 1) => {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  
  return `rgba(${r}, ${g}, ${b}, ${opacity})`;
};

