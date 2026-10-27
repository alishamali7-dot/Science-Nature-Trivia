import { Pressable, StyleSheet, Text, View } from 'react-native';
import { colors, fonts } from '../theme';
import Illustration from './Illustration';

// One category on the board: its art and name, then one tile per question (by points).
// tiles: [{ points, result: undefined | { right, team }, onPress }]
export default function BoardRow({ category, tiles, lang, dir, teamColors }) {
  return (
    <View style={[styles.row, { flexDirection: dir.row }]}>
      <View style={[styles.head, { flexDirection: dir.row }]}>
        <Illustration name={category.art} size={44} />
        <Text style={[styles.name, dir.text]} numberOfLines={2}>{category.name[lang]}</Text>
      </View>
      {tiles.map((tile) => {
        const done = !!tile.result;
        const tint = !done ? category.color : tile.result.right ? teamColors[tile.result.team] : colors.line;
        return (
          <Pressable
            key={tile.points}
            onPress={tile.onPress}
            disabled={done}
            accessibilityRole="button"
            accessibilityLabel={`${category.name[lang]} ${tile.points}`}
            accessibilityState={{ disabled: done }}
            style={({ pressed }) => [
              styles.tile,
              { borderColor: tint, backgroundColor: done ? colors.cardDone : colors.card },
              pressed && styles.pressed,
            ]}
          >
            <Text style={[styles.points, { color: done ? (tile.result.right ? tint : colors.muted) : colors.gold }]}>
              {done ? (tile.result.right ? '✓' : '✗') : tile.points}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  row: { alignItems: 'center', gap: 10 },
  head: { flex: 1, alignItems: 'center', gap: 10 },
  name: { flex: 1, color: colors.text, fontSize: 16, lineHeight: 24, fontFamily: fonts.bold },
  tile: { width: 76, height: 60, borderRadius: 16, borderWidth: 2, alignItems: 'center', justifyContent: 'center' },
  pressed: { transform: [{ scale: 0.95 }] },
  points: { fontSize: 22, lineHeight: 30, fontFamily: fonts.black },
});
