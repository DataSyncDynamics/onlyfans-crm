/**
 * Haptic Feedback Utility for Mobile Devices
 */

type HapticStyle = 'light' | 'medium' | 'heavy' | 'success' | 'warning' | 'error';

interface HapticPattern {
  duration: number;
  pattern?: number[];
}

const HAPTIC_PATTERNS: Record<HapticStyle, HapticPattern> = {
  light: { duration: 10 },
  medium: { duration: 20 },
  heavy: { duration: 30 },
  success: { pattern: [10, 50, 10], duration: 0 },
  warning: { pattern: [10, 100, 10], duration: 0 },
  error: { pattern: [30, 100, 30, 100, 30], duration: 0 },
};

export const hapticFeedback = (style: HapticStyle = 'light'): void => {
  if (!('vibrate' in navigator)) {
    return;
  }

  const pattern = HAPTIC_PATTERNS[style];

  try {
    if (pattern.pattern) {
      navigator.vibrate(pattern.pattern);
    } else {
      navigator.vibrate(pattern.duration);
    }
  } catch (error) {
    console.warn('Haptic feedback failed:', error);
  }
};

export const haptics = {
  tap: () => hapticFeedback('light'),
  button: () => hapticFeedback('medium'),
  success: () => hapticFeedback('success'),
  error: () => hapticFeedback('error'),
  warning: () => hapticFeedback('warning'),
};
