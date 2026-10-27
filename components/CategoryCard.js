import { Pressable, StyleSheet, Text, View, useWindowDimensions } from 'react-native';
import { colors, fonts } from '../theme';
import Bezel from './Bezel';
import Icon from './Icon';
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
        const tint = !done ? colors.hairline : tile.result.right ? teamColors[tile.result.team] : colors.line;
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
              { borderColor: tint, backgroundColor: done ? colors.coreDone : 'rgba(255,255,255,0.05)' },
              done && tile.result.right && { backgroundColor: `${tint}26` },
              pressed && styles.pressed,
            ]}
          >
            {done ? (
              <Icon name={tile.result.right ? 'check' : 'close'} size={16} color={tile.result.right ? tint : colors.muted} strokeWidth={2} />
            ) : (
              <Text style={styles.points}>{tile.points}</Text>
            )}
          </Pressable>
        );
      })}
    </View>
  );
  return (
    <Bezel radius={24} pad={4} style={styles.shell} coreStyle={styles.core}>
      {column(sides[0])}
      <View style={styles.middle}>
        <View style={[styles.halo, { backgroundColor: `${category.color}1A` }]}>
          <Illustration name={category.art} size={short ? 40 : 46} />
        </View>
        <Text style={styles.name} numberOfLines={2}>{category.name[lang]}</Text>
      </View>
      {column(sides[1])}
    </Bezel>
  );
}

const styles = StyleSheet.create({
  shell: { flex: 1 },
  core: { flexDirection: 'row', alignItems: 'center', gap: 4, padding: 6 },
  column: { gap: 6 },
  columnShort: { gap: 4 },
  middle: { flex: 1, alignItems: 'center', gap: 4 },
  halo: { borderRadius: 999, padding: 3 },
  name: { color: colors.text, fontSize: 13, lineHeight: 19, fontFamily: fonts.bold, textAlign: 'center' },
  tile: { width: 42, height: 40, borderRadius: 14, borderWidth: 1, alignItems: 'center', justifyContent: 'center' },
  tileShort: { height: 36 },
  pressed: { transform: [{ scale: 0.94 }], backgroundColor: 'rgba(255,255,255,0.12)' },
  points: { color: colors.gold, fontSize: 15, lineHeight: 22, fontFamily: fonts.black },
});
