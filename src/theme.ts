export const theme = {
  colors: {
    primary: '#2563eb', // Blue 600
    primaryLight: '#60a5fa', // Blue 400
    secondary: '#7c3aed', // Violet 600
    accent: '#f59e0b', // Amber 500
    background: '#f8fafc', // Slate 50
    text: '#1e293b', // Slate 800
    textLight: '#64748b', // Slate 500
    white: '#ffffff',
    error: '#ef4444',
    success: '#22c55e',
    glass: 'rgba(255, 255, 255, 0.7)',
    glassBorder: 'rgba(255, 255, 255, 0.4)',
  },
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
    xxl: 48,
  },
  borderRadius: {
    sm: 8,
    md: 12,
    lg: 16,
    xl: 24,
    full: 9999,
  },
  shadows: {
    sm: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.05,
      shadowRadius: 2,
      elevation: 2,
    },
    md: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.1,
      shadowRadius: 10,
      elevation: 4,
    },
    lg: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 10 },
      shadowOpacity: 0.15,
      shadowRadius: 20,
      elevation: 8,
    },
  },
  gradients: {
    primary: ['#2563eb', '#7c3aed'],
    background: ['#f1f5f9', '#e2e8f0'],
    login: ['#1e3a8a', '#581c87'], // Deep Blue to Deep Purple
  }
};
