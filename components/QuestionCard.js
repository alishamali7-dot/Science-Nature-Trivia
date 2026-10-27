import { StyleSheet, Text, View } from 'react-native';
import { colors, fonts } from '../theme';
import Illustration from './Illustration';
import { Float } from './Motion';

export default function QuestionCard({ category, question, points, ptsLabel, doubled, dir, lang }) {
  return (
    <View style={[styles.card, { borderColor: category.color }]}>
      <View style={[styles.top, { flexDirection: dir.row }]}>
        <Float amount={4}>
          <Illustration name={category.art} size={52} />
        </Float>
        <View style={styles.meta}>
          <Text style={[styles.topic, dir.text, { color: category.color }]}>{category.name[lang]}</Text>
          <Text style={[styles.points, dir.text]}>
            {doubled ? `${points * 2} ${ptsLabel}  ×2` : `${points} ${ptsLabel}`}
          </Text>
        </View>
      </View>
      <Text style={[styles.question, dir.text]}>{question}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: { backgroundColor: colors.card, borderRadius: 24, borderWidth: 2, padding: 20, gap: 14 },
  top: { alignItems: 'center', gap: 12 },
  meta: { flex: 1, gap: 2 },
  topic: { fontSize: 16, lineHeight: 24, fontFamily: fonts.bold },
  points: { color: colors.gold, fontSize: 15, lineHeight: 22, fontFamily: fonts.black },
  question: { color: colors.text, fontSize: 24, lineHeight: 38, fontFamily: fonts.bold },
});
