import { Animated, StyleSheet, Text, View } from 'react-native';
import { colors, fonts } from '../theme';
import Bezel from './Bezel';
import { usePop } from './Motion';

function TeamScore({ name, score, color, active, ptsLabel, turnLabel, dir }) {
  const scale = usePop(score);
  return (
    <Animated.View style={[styles.flex, { transform: [{ scale }] }]} accessibilityLabel={`${name} ${score} ${ptsLabel}${active ? `, ${turnLabel}` : ''}`}>
      <Bezel radius={22} pad={4} ring={active ? color : undefined} coreStyle={[styles.core, { flexDirection: dir.row }]}>
        <View style={[styles.dot, { backgroundColor: color }]} />
        <View style={styles.text}>
          <Text style={[styles.name, dir.text]} numberOfLines={1}>{name}</Text>
          {active && <Text style={[styles.turn, dir.text, { color }]}>{turnLabel}</Text>}
        </View>
        <Text style={styles.score}>{score}</Text>
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
  wrap: { gap: 8 },
  flex: { flex: 1 },
  core: { minHeight: 48, alignItems: 'center', gap: 8, paddingHorizontal: 12, paddingVertical: 4 },
  dot: { width: 8, height: 8, borderRadius: 4 },
  text: { flex: 1 },
  name: { color: colors.text, fontSize: 15, lineHeight: 22, fontFamily: fonts.bold },
  turn: { fontSize: 12, lineHeight: 18, fontFamily: fonts.bold },
  score: { color: colors.text, fontSize: 22, lineHeight: 30, fontFamily: fonts.black },
});
