import { Platform } from 'react-native';
import * as Haptics from 'expo-haptics';

// One haptic per user action, always paired with a visual. Silent on web.
const safe = (fn) => () => { if (Platform.OS !== 'web') fn().catch(() => {}); };

export const haptic = {
  tap: safe(() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)),
  select: safe(() => Haptics.selectionAsync()),
  heavy: safe(() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium)),
  success: safe(() => Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success)),
  error: safe(() => Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error)),
};
