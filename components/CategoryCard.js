import { StyleSheet, View } from 'react-native';
import { colors, radius, space } from '../theme';
import Bezel from './Bezel';
import Icon from './Icon';
import Illustration from './Illustration';
import Tap from './Tap';
import Txt from './Txt';
import useLayout from './useLayout';

// One category on the board, سين جيم style: picture and name in the middle,
// 200 / 400 / 600 down each side (6 questions per category).
// sides: [[tile, tile, tile], [tile, tile, tile]], tile = { points, result, onPress }
export default function CategoryCard({ category, sides, lang, teamColors }) {
  const { short, wide } = useLayout();
  const column = (tiles) => (
    <View style={[styles.column, short && styles.columnShort, wide && styles.columnWide]}>
      {tiles.map((tile, i) => {
        const done = !!tile.result;
        const tint = !done ? colors.hairline : tile.result.right ? teamColors[tile.result.team] : colors.line;
        return (
          <Tap
            key={i}
            onPress={tile.onPress}
            haptic="tap"
            disabled={done}
            scaleTo={0.92}
            hitSlop={4}
            accessibilityRole="button"
            accessibilityLabel={`${category.name[lang]} ${tile.points}`}
            accessibilityState={{ disabled: done }}
            style={[
              styles.tile,
              short && styles.tileShort,
              wide && styles.tileWide,
              { borderColor: tint, backgroundColor: done ? colors.coreDone : 'rgba(255,255,255,0.05)' },
              done && tile.result.right && { backgroundColor: `${tint}26` },
            ]}
          >
            {done ? (
              <Icon name={tile.result.right ? 'check' : 'close'} size={16} color={tile.result.right ? tint : colors.muted} strokeWidth={2} />
            ) : (
              <Txt variant={wide ? 'score' : 'points'} color="gold" maxFontSizeMultiplier={1.2}>{tile.points}</Txt>
            )}
          </Tap>
        );
      })}
    </View>
  );
  return (
    <Bezel radius={24} pad={4} style={styles.shell} coreStyle={styles.core}>
      {column(sides[0])}
      <View style={styles.middle}>
        <View style={[styles.halo, { backgroundColor: `${category.color}1A` }]}>
          <Illustration name={category.art} size={wide ? 84 : short ? 40 : 46} />
        </View>
        <Txt variant={wide ? 'label' : 'micro'} style={[styles.name, wide && styles.nameWide]} numberOfLines={2} maxFontSizeMultiplier={1.3}>
          {category.name[lang]}
        </Txt>
      </View>
      {column(sides[1])}
    </Bezel>
  );
}

const styles = StyleSheet.create({
  shell: { flex: 1 },
  core: { flexDirection: 'row', alignItems: 'center', gap: space.xs, padding: 6 },
  column: { gap: 6 },
  columnShort: { gap: space.xs },
  columnWide: { gap: 10 },
  nameWide: { fontSize: 17, lineHeight: 26 },
  middle: { flex: 1, alignItems: 'center', gap: space.xs },
  halo: { borderRadius: radius.full, padding: 3 },
  name: { fontSize: 13, lineHeight: 19, textAlign: 'center' },
  tile: {
    width: 44, height: 40, borderRadius: radius.sm, borderCurve: 'continuous', borderWidth: 1,
    alignItems: 'center', justifyContent: 'center',
  },
  tileShort: { height: 36 },
  tileWide: { width: 76, height: 72, borderRadius: 18 },
});
