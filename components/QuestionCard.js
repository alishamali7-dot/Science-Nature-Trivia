import { StyleSheet, Text, View } from 'react-native';
import { colors, fonts } from '../theme';
import Bezel from './Bezel';
import Illustration from './Illustration';
import { Float } from './Motion';

// The question in a double-bezel card. `note` shows a helper message (two tries, pit, call a friend).
export default function QuestionCard({ category, question, points, ptsLabel, note, compact, dir, lang }) {
  return (
    <Bezel radius={30} coreStyle={[styles.core, compact && styles.coreCompact]}>
      <View style={[styles.top, { flexDirection: dir.row }]}>
        <Float amount={4}>
          <Illustration name={category.art} size={compact ? 40 : 48} />
        </Float>
        <Text style={[styles.topic, dir.text, { color: category.color }]}>{category.name[lang]}</Text>
        <View style={styles.points}>
          <Text style={styles.pointsText}>{points} {ptsLabel}</Text>
        </View>
      </View>
      <Text style={[styles.question, compact && styles.questionCompact, dir.text]}>{question}</Text>
      {!!note && <Text style={[styles.note, dir.text]}>{note}</Text>}
    </Bezel>
  );
}

const styles = StyleSheet.create({
  core: { padding: 18, gap: 14 },
  coreCompact: { padding: 14, gap: 8 },
  top: { alignItems: 'center', gap: 10 },
  topic: { flex: 1, fontSize: 16, lineHeight: 24, fontFamily: fonts.bold },
  points: { borderRadius: 999, paddingHorizontal: 12, paddingVertical: 3, backgroundColor: 'rgba(255,209,102,0.12)', borderWidth: 1, borderColor: 'rgba(255,209,102,0.35)' },
  pointsText: { color: colors.gold, fontSize: 14, lineHeight: 22, fontFamily: fonts.black },
  question: { color: colors.text, fontSize: 24, lineHeight: 38, fontFamily: fonts.bold },
  questionCompact: { fontSize: 20, lineHeight: 32 },
  note: { color: colors.gold, fontSize: 14, lineHeight: 22, fontFamily: fonts.medium },
});
