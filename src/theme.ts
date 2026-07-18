/**
 * Organic design system — tokens ported from the Design Canvas styles.css.
 * Warm cream ground, terracotta accent, sage second accent. Caprasimo display
 * headings over Figtree. Over-rounded shapes, pill controls.
 *
 * `color-mix(in srgb, X n%, transparent)` from the CSS is expressed here as a
 * hex-with-alpha helper (`mix`) so the same tints carry over to React Native.
 */

export const colors = {
  bg: '#f5ead8',
  surface: '#ebddc5',
  text: '#201e1d',
  accent: '#c67139',
  accent2: '#7a8a5e',

  neutral: {
    100: '#f9f4ed',
    200: '#eee7db',
    300: '#dcd3c4',
    400: '#c0b6a5',
    500: '#a19786',
    600: '#82796a',
    700: '#645c50',
    800: '#474238',
    900: '#2e2b25',
  },
  accentRamp: {
    100: '#fff2eb',
    200: '#ffe1d0',
    300: '#ffc6a5',
    400: '#f6a06b',
    500: '#d67f48',
    600: '#b2622d',
    700: '#8c491a',
    800: '#643312',
    900: '#402310',
  },
  accent2Ramp: {
    100: '#f0fae1',
    200: '#e1eecc',
    300: '#ccdbb2',
    400: '#aebf92',
    500: '#8fa073',
    600: '#728157',
    700: '#56633f',
    800: '#3d472b',
    900: '#272e1b',
  },
} as const;

/** Approximate `color-mix(in srgb, hex pct%, transparent)` → 8-digit hex. */
export function mix(hex: string, pct: number): string {
  const a = Math.round((pct / 100) * 255)
    .toString(16)
    .padStart(2, '0');
  return `${hex}${a}`;
}

export const divider = mix(colors.text, 16);
export const textMuted = mix(colors.text, 55);
export const textFaint = mix(colors.text, 45);

export const scrim = mix(colors.neutral[900], 45);

export const space = {
  1: 4.4,
  2: 8.8,
  3: 13.2,
  4: 17.6,
  6: 26.4,
  8: 35.2,
} as const;

export const radius = {
  sm: 8,
  md: 16,
  lg: 28,
  pill: 999,
} as const;

export const fonts = {
  heading: 'Caprasimo_400Regular',
  body: 'Figtree_400Regular',
  bodyMedium: 'Figtree_600SemiBold',
  bodyBold: 'Figtree_700Bold',
} as const;

/** Soft ink-tinted elevation, tuned to the cream ground. */
export const shadow = {
  sm: {
    shadowColor: colors.neutral[900],
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.14,
    shadowRadius: 2,
    elevation: 1,
  },
  md: {
    shadowColor: colors.neutral[900],
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.16,
    shadowRadius: 10,
    elevation: 4,
  },
  lg: {
    shadowColor: colors.neutral[900],
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.22,
    shadowRadius: 32,
    elevation: 12,
  },
} as const;

export const theme = {
  colors,
  divider,
  textMuted,
  textFaint,
  scrim,
  space,
  radius,
  fonts,
  shadow,
  mix,
};

export type Theme = typeof theme;
