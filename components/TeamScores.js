import { Animated, StyleSheet, Text, View } from 'react-native';
import { colors, fonts } from '../theme';
import { usePop } from './Motion';

function TeamScore({ name, score, color, active, ptsLabel, turnLabel, dir }) {
  const scale = usePop(score);
  return (
    <Animated.View
      style={[
        styles.team,
        { flexDirection: dir.row, borderColor: active ? color : 'transparent', backgroundColor: active ? `${color}22` : colors.card, transform: [{ scale }] },
      ]}
      accessibilityLabel={`${name} ${score} ${ptsLabel}${active ? `, ${turnLabel}` : ''}`}
    >
      <View style={[styles.dot, { backgroundColor: color }]} />
      <View style={styles.text}>
        <Text style={[styles.name, dir.text]} numberOfLines={1}>{name}</Text>
        {active && <Text style={[styles.turn, dir.text, { color }]}>{turnLabel}</Text>}
      </View>
      <Text style={styles.score}>{score}</Text>
    </Animated.View>
  );
}

// One compact chip per team; the team whose turn it is gets a colored ring and a "your turn" tag.
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
  team: {
    flex: 1, minHeight: 54, alignItems: 'center', gap: 8, borderRadius: 16, borderWidth: 2, paddingHorizontal: 12, paddingVertical: 6,
  },
  dot: { width: 10, height: 10, borderRadius: 5 },
  text: { flex: 1 },
  name: { color: colors.text, fontSize: 15, lineHeight: 22, fontFamily: fonts.bold },
  turn: { fontSize: 12, lineHeight: 18, fontFamily: fonts.bold },
  score: { color: colors.text, fontSize: 22, lineHeight: 30, fontFamily: fonts.black },
});
