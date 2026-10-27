import { useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import AnswerButton from './components/AnswerButton';
import QuestionCard from './components/QuestionCard';
import ScoreBadge from './components/ScoreBadge';
import { QUESTIONS } from './questions';
import { colors } from './theme';

// Answers in a fixed order for now (shuffling is an Extra level).
const answersOf = (q) => {
  const all = [...q.wrong];
  all.splice(q.question.length % 4, 0, q.correct);
  return all;
};

export default function App() {
  const [index, setIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [picked, setPicked] = useState(null);
  const [finished, setFinished] = useState(false);

  const q = QUESTIONS[index];
  const answered = picked !== null;
  const isLast = index === QUESTIONS.length - 1;

  const pick = (answer) => {
    if (answered) return;
    setPicked(answer);
    if (answer === q.correct) setScore(score + 1);
  };

  const next = () => {
    if (isLast) return setFinished(true);
    setIndex(index + 1);
    setPicked(null);
  };

  const playAgain = () => {
    setIndex(0);
    setScore(0);
    setPicked(null);
    setFinished(false);
  };

  if (finished) {
    return (
      <View style={styles.screen}>
        <View style={styles.endTop}>
          <Text style={styles.kicker}>Final score</Text>
          <Text style={styles.bigScore}>{score}/{QUESTIONS.length}</Text>
          <Text style={styles.verdict}>
            {score === QUESTIONS.length ? 'Perfect — real scientist.' : score >= 3 ? 'Nice work, explorer.' : 'Keep exploring!'}
          </Text>
        </View>
        <PrimaryButton label="Play again" onPress={playAgain} />
        <StatusBar style="light" />
      </View>
    );
  }

  const right = picked === q.correct;

  return (
    <View style={styles.screen}>
      <View style={styles.header}>
        <Text style={styles.kicker}>Science & Nature</Text>
        <ScoreBadge score={score} />
      </View>

      <QuestionCard topic={q.topic} question={q.question} />

      <View style={styles.answers}>
        {answersOf(q).map((a) => (
          <AnswerButton
            key={a}
            label={a}
            disabled={answered}
            state={!answered ? 'idle' : a === q.correct ? 'correct' : a === picked ? 'wrong' : 'idle'}
            onPress={() => pick(a)}
          />
        ))}
      </View>

      <View style={styles.footer}>
        {answered && (
          <>
            <Text style={[styles.feedback, { color: right ? colors.accent : colors.wrong }]}>
              {right ? 'Correct!' : 'Wrong!'}
            </Text>
            <PrimaryButton label={isLast ? 'See score' : 'Next'} onPress={next} />
          </>
        )}
      </View>
      <StatusBar style="light" />
    </View>
  );
}

function PrimaryButton({ label, onPress }) {
  return (
    <Pressable onPress={onPress} accessibilityRole="button" style={({ pressed }) => [styles.primary, pressed && { opacity: 0.8 }]}>
      <Text style={styles.primaryLabel}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.bg, paddingTop: 64, paddingHorizontal: 20, paddingBottom: 36, gap: 20 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  kicker: { color: colors.muted, fontSize: 14, letterSpacing: 1.5, textTransform: 'uppercase' },
  answers: { gap: 12, marginTop: 'auto' },
  footer: { minHeight: 100, gap: 12, justifyContent: 'flex-end' },
  feedback: { fontSize: 20, fontWeight: '700', textAlign: 'center' },
  primary: { height: 60, borderRadius: 16, backgroundColor: colors.accent, alignItems: 'center', justifyContent: 'center' },
  primaryLabel: { color: colors.bg, fontSize: 18, fontWeight: '700' },
  endTop: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 12 },
  bigScore: { color: colors.accent, fontSize: 96, fontWeight: '800' },
  verdict: { color: colors.text, fontSize: 18 },
});
