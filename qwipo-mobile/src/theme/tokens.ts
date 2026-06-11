// Qwipo Design System — React Native theme tokens.
// Ported directly from the web app's CSS vars. Single source of truth.
// Use these everywhere; never hard-code a color, radius, or font size.

export const colors = {
  // Brand
  primary: '#2563EB',
  primaryFg: '#FFFFFF',
  ring: '#2563EB',
  destructive: '#D4183D',
  destructiveFg: '#FFFFFF',
  brandPurple: '#BC77FF',

  // Surfaces (light)
  background: '#FFFFFF',
  foreground: '#252525',
  card: '#FFFFFF',
  muted: '#ECECF0',
  mutedFg: '#717182',
  border: 'rgba(0,0,0,0.1)',
  inputBg: '#F3F3F5',

  // Semantic
  success: '#059669',
  successBg: '#ECFDF5',
  successBorder: '#A7F3D0',
  successFg: '#047857',
  warning: '#D97706',
  warningBg: '#FFFBEB',
  warningBorder: '#FDE68A',
  warningFg: '#B45309',
  danger: '#DC2626',
  dangerBg: '#FEF2F2',
  dangerBorder: '#FECACA',
  dangerFg: '#B91C1C',
  info: '#2563EB',
  infoBg: '#EFF6FF',
  infoBorder: '#BFDBFE',
  infoFg: '#1D4ED8',
  neutral: '#4B5563',
  neutralBg: '#F9FAFB',
  neutralBorder: '#E5E7EB',
  neutralFg: '#374151',
  accent: '#9333EA',
  accentBg: '#FAF5FF',
  accentBorder: '#E9D5FF',
  accentFg: '#7E22CE',

  // Surface helpers used across the app
  bgYellow: '#FEF3C7',
  bgOrange: '#FED7AA',
  bgBlue: '#DBEAFE',
  bgIndigo: '#E0E7FF',
  bgPink: '#FCE7F3',
  bgGray: '#F3F4F6',
  bgGreen: '#D1FAE5',
  bgRed: '#FEE2E2',
} as const;

export const radius = {
  sm: 2,
  md: 6,
  lg: 8,
  xl: 12,
  full: 9999,
} as const;

export const spacing = {
  0: 0,
  1: 4,
  2: 8,
  3: 12,
  4: 16,
  5: 20,
  6: 24,
  7: 28,
  8: 32,
  10: 40,
  12: 48,
  16: 64,
} as const;

export const fontSize = {
  micro: 10,
  tiny: 11,
  xs: 12,
  sm: 13,
  base: 14,
  md: 15,
  lg: 16,
  xl: 18,
  '2xl': 20,
  '3xl': 24,
  '4xl': 28,
} as const;

// Per DS rule: only 400 and 500 — but RN needs strings here.
export const fontWeight = {
  regular: '400' as const,
  medium: '500' as const,
};

export const motion = {
  fast: 150,
  default: 200,
  slow: 300,
};

// Convenient grouped theme for ThemeProvider / hook patterns.
export const theme = {
  colors,
  radius,
  spacing,
  fontSize,
  fontWeight,
  motion,
};

export type Theme = typeof theme;
