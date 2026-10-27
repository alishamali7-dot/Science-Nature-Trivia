import { useEffect, useRef } from 'react';
import { Animated, Easing, StyleSheet, Text, View } from 'react-native';
import { colors, fonts } from '../theme';

export default function TimerBar({ left, total, label, dir }) {
  const v = useRef(new Animated.Value(left / total)).current;
  useEffect(() => {
    Animated.timing(v, { toValue: left / total, duration: 950, easing: Easing.linear, useNativeDriver: false }).start();
  }, [left]);
  const low = left <= 5;
  return (
    <View style={[styles.row, { flexDirection: dir.row }]} accessibilityLabel={`${left} ${label}`}>
      <View style={[styles.track, { flexDirection: dir.row }]}>
        <Animated.View
          style={[styles.fill, { backgroundColor: low ? colors.wrong : colors.accent, width: v.interpolate({ inputRange: [0, 1], outputRange: ['0%', '100%'] }) }]}
        />
      </View>
      <Text style={[styles.num, low && { color: colors.wrong }]}>{left}{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  row: { alignItems: 'center', gap: 10 },
  track: { flex: 1, height: 10, borderRadius: 5, backgroundColor: colors.chip, overflow: 'hidden' },
  fill: { height: 10, borderRadius: 5 },
  num: { minWidth: 44, textAlign: 'center', color: colors.text, fontSize: 16, fontFamily: fonts.black },
});
