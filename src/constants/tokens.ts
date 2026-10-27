/**
 * Campus Marketplace Design Tokens
 * 
 * THE ONLY TOKEN FILE FOR COLORS, SPACING, TYPOGRAPHY, AND RADII.
 * All colors adhere to WCAG AA >= 4.5:1 contrast in both light and dark modes.
 * No raw hex colors allowed anywhere else in the application code.
 */

export const Colors = {
  light: {
    background: '#F8FAFC',
    surface: '#FFFFFF',
    surfaceRaised: '#F1F5F9',
    textPrimary: '#0F172A',
    textSecondary: '#475569',
    textMuted: '#64748B',
    primary: '#1E40AF',
    primaryContrast: '#FFFFFF',
    primaryMuted: '#DBEAFE',
    accent: '#B45309',
    accentContrast: '#FFFFFF',
    success: '#166534',
    successContrast: '#FFFFFF',
    successMuted: '#DCFCE7',
    danger: '#991B1B',
    dangerContrast: '#FFFFFF',
    dangerMuted: '#FEE2E2',
    warning: '#92400E',
    warningContrast: '#FFFFFF',
    warningMuted: '#FEF3C7',
    border: '#CBD5E1',
    borderSubtle: '#E2E8F0',
    overlay: 'rgba(15, 23, 42, 0.55)',
    skeleton: '#E2E8F0',
    offlineBannerBg: '#FEF3C7',
    offlineBannerText: '#92400E',
    cardShadow: 'rgba(15, 23, 42, 0.08)',
  },
  dark: {
    background: '#0F172A',
    surface: '#1E293B',
    surfaceRaised: '#334155',
    textPrimary: '#F8FAFC',
    textSecondary: '#94A3B8',
    textMuted: '#94A3B8',
    primary: '#60A5FA',
    primaryContrast: '#0F172A',
    primaryMuted: '#1E3A8A',
    accent: '#FBBF24',
    accentContrast: '#0F172A',
    success: '#4ADE80',
    successContrast: '#0F172A',
    successMuted: '#064E3B',
    danger: '#F87171',
    dangerContrast: '#0F172A',
    dangerMuted: '#7F1D1D',
    warning: '#FCD34D',
    warningContrast: '#0F172A',
    warningMuted: '#78350F',
    border: '#334155',
    borderSubtle: '#1E293B',
    overlay: 'rgba(0, 0, 0, 0.75)',
    skeleton: '#334155',
    offlineBannerBg: '#78350F',
    offlineBannerText: '#FEF3C7',
    cardShadow: 'rgba(0, 0, 0, 0.4)',
  },
} as const;

export type ColorKey = keyof typeof Colors.light;
export type ColorTheme = Record<ColorKey, string>;

export const Spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  xxxl: 32,
  giant: 48,
} as const;

export const Radii = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  full: 9999,
} as const;

export const Typography = {
  h1: {
    fontSize: 28,
    lineHeight: 34,
    fontWeight: '700' as const,
  },
  h2: {
    fontSize: 22,
    lineHeight: 28,
    fontWeight: '700' as const,
  },
  h3: {
    fontSize: 18,
    lineHeight: 24,
    fontWeight: '600' as const,
  },
  body: {
    fontSize: 16,
    lineHeight: 22,
    fontWeight: '400' as const,
  },
  bodyBold: {
    fontSize: 16,
    lineHeight: 22,
    fontWeight: '600' as const,
  },
  caption: {
    fontSize: 14,
    lineHeight: 18,
    fontWeight: '400' as const,
  },
  captionBold: {
    fontSize: 14,
    lineHeight: 18,
    fontWeight: '600' as const,
  },
  small: {
    fontSize: 12,
    lineHeight: 16,
    fontWeight: '500' as const,
  },
} as const;

export const Accessibility = {
  minTouchTarget: 44,
} as const;
