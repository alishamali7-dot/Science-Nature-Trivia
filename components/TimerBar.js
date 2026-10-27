import { useEffect, useRef } from 'react';
import { Animated, Easing, StyleSheet, Text, View } from 'react-native';
import { colors, fonts } from '../theme';

// Thin countdown track; turns red for the last 5 seconds.
export default function TimerBar({ left, total, label, dir }) {
  const v = useRef(new Animated.Value(left / total)).current;
  useEffect(() => {
    Animated.timing(v, { toValue: Math.min(1, left / total), duration: 950, easing: Easing.linear, useNativeDriver: false }).start();
  }, [left, total]);
  const low = left <= 5;
  const tint = low ? colors.wrong : colors.right;
  return (
    <View style={[styles.row, { flexDirection: dir.row }]} accessibilityRole="timer" accessibilityLabel={`${left} ${label}`}>
      <View style={[styles.track, { flexDirection: dir.row }]}>
        <Animated.View style={[styles.fill, { backgroundColor: tint, width: v.interpolate({ inputRange: [0, 1], outputRange: ['0%', '100%'] }) }]} />
      </View>
      <View style={[styles.pill, { borderColor: `${tint}55` }]}>
        <Text style={[styles.num, { color: low ? colors.wrong : colors.text }]}>{left}{label}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: { alignItems: 'center', gap: 10 },
  track: { flex: 1, height: 6, borderRadius: 3, backgroundColor: 'rgba(255,255,255,0.07)', overflow: 'hidden' },
  fill: { height: 6, borderRadius: 3 },
  pill: { minWidth: 52, borderRadius: 999, borderWidth: 1, paddingHorizontal: 10, paddingVertical: 2, alignItems: 'center' },
  num: { fontSize: 15, lineHeight: 24, fontFamily: fonts.black },
});
