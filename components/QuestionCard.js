import { StyleSheet, Text, View } from 'react-native';
import { colors } from '../theme';

export default function QuestionCard({ topic, question }) {
  return (
    <View style={styles.card}>
      <Text style={styles.topic}>{topic}</Text>
      <Text style={styles.question}>{question}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.card,
    borderRadius: 20,
    padding: 24,
    minHeight: 160,
    justifyContent: 'center',
    gap: 10,
  },
  topic: { color: colors.accent, fontSize: 13, letterSpacing: 1.2, textTransform: 'uppercase' },
  question: { color: colors.text, fontSize: 26, lineHeight: 33, fontWeight: '700' },
});
