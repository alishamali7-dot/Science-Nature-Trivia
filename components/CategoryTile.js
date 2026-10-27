import { Pressable, StyleSheet, Text } from 'react-native';
import { colors, fonts } from '../theme';

// result: undefined (not played) | 'right' | 'wrong'
export default function CategoryTile({ topic, points, result, wide, onPress, dir }) {
  const done = !!result;
  const tint = result === 'right' ? colors.accent : result === 'wrong' ? colors.wrong : colors.gold;
  return (
    <Pressable
      onPress={onPress}
      disabled={done}
      accessibilityRole="button"
      style={({ pressed }) => [
        styles.tile,
        wide && styles.wide,
        done && { backgroundColor: colors.cardDone, borderColor: tint, opacity: 0.75 },
        pressed && styles.pressed,
      ]}
    >
      <Text style={[styles.topic, dir.text]}>{topic}</Text>
      <Text style={[styles.points, dir.text, { color: tint }]}>
        {result === 'right' ? `✓ ${points}` : result === 'wrong' ? '✗ 0' : points}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  tile: {
    width: '47.5%', height: 128, borderRadius: 20, borderWidth: 2, borderColor: colors.line,
    backgroundColor: colors.card, padding: 16, justifyContent: 'space-between',
  },
  wide: { width: '100%' },
  pressed: { transform: [{ scale: 0.97 }] },
  topic: { color: colors.text, fontSize: 16, lineHeight: 24, fontFamily: fonts.bold },
  points: { fontSize: 34, lineHeight: 44, fontFamily: fonts.black },
});
