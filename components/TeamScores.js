import { Animated, StyleSheet, Text, View } from 'react-native';
import { colors, fonts } from '../theme';
import { usePop } from './Motion';

function TeamScore({ name, score, color, active, ptsLabel }) {
  const scale = usePop(score);
  return (
    <Animated.View style={[styles.team, { borderColor: active ? color : 'transparent', transform: [{ scale }] }]}>
      <View style={[styles.dot, { backgroundColor: color }]} />
      <Text style={styles.name} numberOfLines={1}>{name}</Text>
      <Text style={styles.score}>{score} <Text style={styles.pts}>{ptsLabel}</Text></Text>
    </Animated.View>
  );
}

// Score chips for every team; the team whose turn it is gets a colored ring.
export default function TeamScores({ names, scores, turn, ptsLabel, dir }) {
  return (
    <View style={[styles.wrap, { flexDirection: dir.row }]}>
      {names.map((n, i) => (
        <TeamScore key={i} name={n} score={scores[i]} color={colors.teams[i]} active={names.length > 1 && i === turn} ptsLabel={ptsLabel} />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { gap: 10 },
  team: {
    flex: 1, backgroundColor: colors.card, borderRadius: 18, borderWidth: 2, paddingVertical: 10, paddingHorizontal: 14,
    alignItems: 'center', gap: 2,
  },
  dot: { width: 10, height: 10, borderRadius: 5 },
  name: { color: colors.soft, fontSize: 14, lineHeight: 22, fontFamily: fonts.medium },
  score: { color: colors.text, fontSize: 22, lineHeight: 30, fontFamily: fonts.black },
  pts: { color: colors.muted, fontSize: 13, fontFamily: fonts.medium },
});
