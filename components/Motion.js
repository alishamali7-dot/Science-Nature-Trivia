import { useEffect } from 'react';
import Animated, {
  Easing,
  FadeInDown,
  ReduceMotion,
  useAnimatedStyle,
  useReducedMotion,
  useSharedValue,
  withRepeat,
  withSequence,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import { EASE_OUT, motion } from '../theme';

// All motion runs on the UI thread (Reanimated) and respects the system "reduce motion" setting.
const OUT = Easing.bezier(...EASE_OUT);

// Rises into place when it mounts. Used once per screen block, staggered with `delay`.
export function FadeIn({ delay = 0, style, children }) {
  return (
    <Animated.View
      entering={FadeInDown.duration(motion.slow).delay(delay).easing(OUT).reduceMotion(ReduceMotion.System)}
      style={style}
    >
      {children}
    </Animated.View>
  );
}

// Gentle hover loop for illustrations; still when reduce motion is on.
export function Float({ amount = 8, duration = 2600, children }) {
  const reduced = useReducedMotion();
  const y = useSharedValue(0);
  useEffect(() => {
    if (reduced) return;
    y.set(withRepeat(withTiming(-amount, { duration, easing: Easing.inOut(Easing.sin) }), -1, true));
  }, [reduced]);
  const style = useAnimatedStyle(() => ({ transform: [{ translateY: y.get() }] }));
  return <Animated.View style={style}>{children}</Animated.View>;
}

// Springy bump when `trigger` changes to a truthy/new value (skips the first render).
export function usePop(trigger) {
  const scale = useSharedValue(1);
  useEffect(() => {
    if (!trigger) return;
    scale.set(withSequence(
      withTiming(1.05, { duration: motion.press, easing: OUT, reduceMotion: ReduceMotion.System }),
      withSpring(1, { duration: 400, dampingRatio: 0.55, reduceMotion: ReduceMotion.System }),
    ));
  }, [trigger]);
  return useAnimatedStyle(() => ({ transform: [{ scale: scale.get() }] }));
}

// Short horizontal shake when `active` turns true.
export function useShake(active) {
  const x = useSharedValue(0);
  useEffect(() => {
    if (!active) return;
    const step = (to) => withTiming(to, { duration: 50, reduceMotion: ReduceMotion.System });
    x.set(withSequence(step(9), step(-9), step(6), step(-6), step(3), step(0)));
  }, [active]);
  return useAnimatedStyle(() => ({ transform: [{ translateX: x.get() }] }));
}
