import { Pressable } from 'react-native';
import Animated, { Easing, ReduceMotion, useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
import { EASE_OUT, motion } from '../theme';
import { haptic as buzz } from './haptics';

const OUT = Easing.bezier(...EASE_OUT);
const RETAIN = { top: 20, bottom: 20, left: 20, right: 20 };

// Every tappable thing: feedback on press-in (scale down), commit on press-out, optional haptic.
// `outer` styles the moving wrapper (layout: flex, width); `style` styles the pressable itself.
export default function Tap({ onPress, haptic, disabled, scaleTo = 0.97, outer, style, children, ...rest }) {
  const s = useSharedValue(1);
  const anim = useAnimatedStyle(() => ({ transform: [{ scale: s.get() }] }));
  const to = (v, d) => s.set(withTiming(v, { duration: d, easing: OUT, reduceMotion: ReduceMotion.System }));
  return (
    <Animated.View style={[outer, anim]}>
      <Pressable
        {...rest}
        disabled={disabled}
        pressRetentionOffset={RETAIN}
        onPressIn={() => to(scaleTo, motion.press)}
        onPressOut={() => to(1, motion.base)}
        onPress={(e) => { if (haptic) buzz[haptic](); onPress?.(e); }}
        style={style}
      >
        {children}
      </Pressable>
    </Animated.View>
  );
}
