import { Pressable, StyleSheet, Text, View, useWindowDimensions } from 'react-native';
import { colors, fonts } from '../theme';
import Illustration from './Illustration';

// One category on the board, سين جيم style: picture and name in the middle,
// 200 / 400 / 600 down each side (6 questions per category).
// sides: [[tile, tile, tile], [tile, tile, tile]], tile = { points, result, onPress }
export default function CategoryCard({ category, sides, lang, teamColors }) {
  // Short phones (e.g. iPhone SE) get slightly smaller tiles so the whole board fits.
  const short = useWindowDimensions().height < 760;
  const column = (tiles) => (
    <View style={[styles.column, short && styles.columnShort]}>
      {tiles.map((tile, i) => {
        const done = !!tile.result;
        const tint = !done ? category.color : tile.result.right ? teamColors[tile.result.team] : colors.line;
        return (
          <Pressable
            key={i}
            onPress={tile.onPress}
            disabled={done}
            accessibilityRole="button"
            accessibilityLabel={`${category.name[lang]} ${tile.points}`}
            accessibilityState={{ disabled: done }}
            hitSlop={4}
            style={({ pressed }) => [
              styles.tile,
              short && styles.tileShort,
              { borderColor: tint, backgroundColor: done ? colors.cardDone : colors.bg },
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
  return (
    <View style={[styles.card, { borderColor: category.color }]}>
      {column(sides[0])}
      <View style={styles.middle}>
        <Illustration name={category.art} size={short ? 42 : 50} />
        <Text style={styles.name} numberOfLines={2} adjustsFontSizeToFit minimumFontScale={0.8}>
          {category.name[lang]}
        </Text>
      </View>
      {column(sides[1])}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1, flexDirection: 'row', alignItems: 'center', gap: 4, padding: 6,
    backgroundColor: colors.card, borderRadius: 18, borderWidth: 2,
  },
  column: { gap: 6 },
  columnShort: { gap: 4 },
  middle: { flex: 1, alignItems: 'center', gap: 4 },
  name: { color: colors.text, fontSize: 13, lineHeight: 19, fontFamily: fonts.bold, textAlign: 'center' },
  tile: { width: 42, height: 40, borderRadius: 12, borderWidth: 2, alignItems: 'center', justifyContent: 'center' },
  tileShort: { height: 36 },
  pressed: { transform: [{ scale: 0.94 }] },
  points: { fontSize: 15, lineHeight: 22, fontFamily: fonts.black },
});
