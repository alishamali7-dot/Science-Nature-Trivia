import { StyleSheet, Text, View } from 'react-native';
import { colors, fonts } from '../theme';

export default function QuestionCard({ topic, question, points, ptsLabel, dir }) {
  return (
    <View style={styles.card}>
      <View style={[styles.top, { flexDirection: dir.row }]}>
        <Text style={styles.topic}>{topic}</Text>
        <Text style={styles.points}>{points} {ptsLabel}</Text>
      </View>
      <Text style={[styles.question, dir.text]}>{question}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: { backgroundColor: colors.card, borderRadius: 22, padding: 22, gap: 12 },
  top: { justifyContent: 'space-between', alignItems: 'center' },
  topic: { color: colors.accent, fontSize: 15, fontFamily: fonts.bold },
  points: {
    color: colors.bg, backgroundColor: colors.gold, fontSize: 14, fontFamily: fonts.black,
    paddingHorizontal: 12, paddingVertical: 2, borderRadius: 999, overflow: 'hidden',
  },
  question: { color: colors.text, fontSize: 25, lineHeight: 36, fontFamily: fonts.bold },
});
