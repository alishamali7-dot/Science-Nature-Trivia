import { StyleSheet, View } from 'react-native';
import Animated from 'react-native-reanimated';
import { colors, space } from '../theme';
import Bezel from './Bezel';
import { usePop } from './Motion';
import Txt from './Txt';

function TeamScore({ name, score, color, active, ptsLabel, turnLabel, dir }) {
  const pop = usePop(score);
  return (
    <Animated.View
      style={[styles.flex, pop]}
      accessible
      accessibilityLabel={`${name} ${score} ${ptsLabel}${active ? `, ${turnLabel}` : ''}`}
    >
      <Bezel radius={22} pad={4} ring={active ? color : undefined} coreStyle={[styles.core, { flexDirection: dir.row }]}>
        <View style={[styles.dot, { backgroundColor: color }]} />
        <View style={styles.flex}>
          <Txt variant="callout" style={dir.text} numberOfLines={1}>{name}</Txt>
          {active && <Txt variant="micro" color={color} style={dir.text}>{turnLabel}</Txt>}
        </View>
        <Txt variant="score" style={styles.num}>{score}</Txt>
      </Bezel>
    </Animated.View>
  );
}

// One chip per team; the team whose turn it is glows in its color with a "your turn" tag.
export default function TeamScores({ names, scores, turn, ptsLabel, turnLabel = '', dir }) {
  return (
    <View style={[styles.wrap, { flexDirection: dir.row }]}>
      {names.map((n, i) => (
        <TeamScore
          key={i}
          name={n}
          score={scores[i]}
          color={colors.teams[i]}
          active={names.length > 1 && i === turn}
          ptsLabel={ptsLabel}
          turnLabel={turnLabel}
          dir={dir}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { gap: space.sm },
  flex: { flex: 1 },
  core: { minHeight: 48, alignItems: 'center', gap: space.sm, paddingHorizontal: space.md, paddingVertical: space.xs },
  dot: { width: 8, height: 8, borderRadius: 4 },
  num: { fontVariant: ['tabular-nums'] },
});
