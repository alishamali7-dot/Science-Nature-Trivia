import { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, { Easing, useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
import { colors, radius, space } from '../theme';
import Txt from './Txt';

// Thin countdown track that drains smoothly; turns red for the last 5 seconds.
// The fill is absolute and childless, so animating its width costs no layout of anything else.
export default function TimerBar({ left, total, label, dir }) {
  const frac = useSharedValue(Math.min(1, left / total));
  useEffect(() => {
    frac.set(withTiming(Math.min(1, left / total), { duration: 950, easing: Easing.linear }));
  }, [left, total]);
  const fill = useAnimatedStyle(() => ({ width: `${frac.get() * 100}%` }));
  const low = left <= 5;
  const tint = low ? colors.wrong : colors.right;
  const anchor = dir.row === 'row' ? { start: 0 } : { end: 0 };
  return (
    <View style={[styles.row, { flexDirection: dir.row }]} accessible accessibilityRole="timer" accessibilityLabel={`${left} ${label}`}>
      <View style={styles.track}>
        <Animated.View style={[styles.fill, anchor, { backgroundColor: tint }, fill]} />
      </View>
      <View style={[styles.pill, { borderColor: `${tint}55` }]}>
        <Txt variant="points" color={low ? 'wrong' : 'text'} style={styles.num} maxFontSizeMultiplier={1.3}>{left}{label}</Txt>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: { alignItems: 'center', gap: 10 },
  track: { flex: 1, height: 6, borderRadius: 3, backgroundColor: 'rgba(255,255,255,0.07)', overflow: 'hidden' },
  fill: { position: 'absolute', top: 0, bottom: 0, borderRadius: 3 },
  pill: { minWidth: 52, borderRadius: radius.full, borderWidth: 1, paddingHorizontal: 10, paddingVertical: 2, alignItems: 'center' },
  num: { fontVariant: ['tabular-nums'] },
});
