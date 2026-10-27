import { useEffect } from 'react';
import { StyleSheet, View, useWindowDimensions } from 'react-native';
import Animated, { Easing, useAnimatedStyle, useReducedMotion, useSharedValue, withDelay, withTiming } from 'react-native-reanimated';

const COLORS = ['#A99BFF', '#FFD166', '#5EB8FF', '#FF8FB1', '#3DDC97', '#19C2B0'];

// ponytail: 40 Reanimated views is plenty for one burst; switch to Skia if we ever need hundreds.
const PIECES = Array.from({ length: 40 }, (_, i) => ({
  x: Math.random(),
  size: 6 + Math.random() * 8,
  color: COLORS[i % COLORS.length],
  delay: Math.random() * 600,
  duration: 2200 + Math.random() * 1600,
  drift: (Math.random() - 0.5) * 120,
  spin: (Math.random() > 0.5 ? 1 : -1) * (360 + Math.random() * 540),
}));

function Piece({ p, width, height }) {
  const v = useSharedValue(0);
  useEffect(() => {
    v.set(withDelay(p.delay, withTiming(1, { duration: p.duration, easing: Easing.bezier(0.55, 0, 1, 0.45) })));
  }, []);
  const style = useAnimatedStyle(() => ({
    opacity: v.get() > 0.85 ? (1 - v.get()) / 0.15 : 1,
    transform: [
      { translateY: v.get() * (height + 40) },
      { translateX: v.get() * p.drift },
      { rotate: `${v.get() * p.spin}deg` },
    ],
  }));
  return (
    <Animated.View
      style={[{ position: 'absolute', left: p.x * width, top: -20, width: p.size, height: p.size * 1.6, borderRadius: 2, backgroundColor: p.color }, style]}
    />
  );
}

// The winner moment: one burst of confetti. Skipped entirely when reduce motion is on.
export default function Confetti() {
  const { width, height } = useWindowDimensions();
  const reduced = useReducedMotion();
  if (reduced) return null;
  return (
    <View pointerEvents="none" style={StyleSheet.absoluteFill}>
      {PIECES.map((p, i) => <Piece key={i} p={p} width={width} height={height} />)}
    </View>
  );
}
