import { Platform } from 'react-native';

export const Shadows = {
  card: Platform.select({
    ios: { shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.06, shadowRadius: 3 },
    android: { elevation: 2 },
  }),
  ctaEmerald: Platform.select({
    ios: { shadowColor: '#0F7A5F', shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.25, shadowRadius: 22 },
    android: { elevation: 6 },
  }),
  ctaOrange: Platform.select({
    ios: { shadowColor: '#E55A2B', shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.32, shadowRadius: 22 },
    android: { elevation: 6 },
  }),
} as const;
