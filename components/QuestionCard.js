import { StyleSheet, Text, View } from 'react-native';
import { colors, fonts } from '../theme';
import Illustration from './Illustration';
import { Float } from './Motion';

// `note` shows a helper message (two tries, pit, call a friend) under the question.
export default function QuestionCard({ category, question, points, ptsLabel, note, compact, dir, lang }) {
  return (
    <View style={[styles.card, compact && styles.cardCompact, { borderColor: category.color }]}>
      <View style={[styles.top, { flexDirection: dir.row }]}>
        <Float amount={4}>
          <Illustration name={category.art} size={compact ? 40 : 52} />
        </Float>
        <View style={styles.meta}>
          <Text style={[styles.topic, dir.text, { color: category.color }]}>{category.name[lang]}</Text>
          <Text style={[styles.points, dir.text]}>{points} {ptsLabel}</Text>
        </View>
      </View>
      <Text style={[styles.question, compact && styles.questionCompact, dir.text]}>{question}</Text>
      {!!note && <Text style={[styles.note, dir.text]}>{note}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  card: { backgroundColor: colors.card, borderRadius: 24, borderWidth: 2, padding: 20, gap: 12 },
  cardCompact: { padding: 14, gap: 8 },
  top: { alignItems: 'center', gap: 12 },
  meta: { flex: 1 },
  topic: { fontSize: 16, lineHeight: 24, fontFamily: fonts.bold },
  points: { color: colors.gold, fontSize: 15, lineHeight: 22, fontFamily: fonts.black },
  question: { color: colors.text, fontSize: 24, lineHeight: 38, fontFamily: fonts.bold },
  questionCompact: { fontSize: 20, lineHeight: 32 },
  note: { color: colors.gold, fontSize: 14, lineHeight: 22, fontFamily: fonts.medium },
});
