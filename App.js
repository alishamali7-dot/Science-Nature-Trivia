import { useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import { useFonts, Cairo_400Regular, Cairo_600SemiBold, Cairo_700Bold, Cairo_800ExtraBold } from '@expo-google-fonts/cairo';
import AnswerButton from './components/AnswerButton';
import CategoryTile from './components/CategoryTile';
import LangToggle from './components/LangToggle';
import PrimaryButton from './components/PrimaryButton';
import QuestionCard from './components/QuestionCard';
import ScoreBadge from './components/ScoreBadge';
import { QUESTIONS } from './questions';
import { STRINGS, dirFor } from './strings';
import { colors, fonts } from './theme';

// Fixed answer order for now (shuffling is an Extra level): the right answer goes in a different slot per question.
const answersOf = (q) => {
  const all = [...q.wrong];
  all.splice((q.points / 100) % 4, 0, q.correct);
  return all;
};

export default function App() {
  const [fontsLoaded] = useFonts({ Cairo_400Regular, Cairo_600SemiBold, Cairo_700Bold, Cairo_800ExtraBold });
  const [lang, setLang] = useState('ar');
  const [screen, setScreen] = useState('start'); // start | board | question | end
  const [current, setCurrent] = useState(0);
  const [results, setResults] = useState({}); // question index -> 'right' | 'wrong'
  const [picked, setPicked] = useState(null);
  const [score, setScore] = useState(0);

  if (!fontsLoaded) return <View style={styles.screen} />;

  const t = STRINGS[lang];
  const dir = dirFor(lang);
  const q = QUESTIONS[current];
  const answered = picked !== null;
  const allDone = Object.keys(results).length === QUESTIONS.length;
  const correctCount = Object.values(results).filter((r) => r === 'right').length;

  const newGame = () => {
    setResults({});
    setPicked(null);
    setScore(0);
    setScreen('board');
  };

  const open = (i) => {
    setCurrent(i);
    setPicked(null);
    setScreen('question');
  };

  const pick = (answer) => {
    if (answered) return;
    const right = answer === q.correct;
    setPicked(answer);
    setResults({ ...results, [current]: right ? 'right' : 'wrong' });
    if (right) setScore(score + q.points);
  };

  return (
    <View style={styles.screen}>
      <View style={[styles.topBar, { flexDirection: dir.row }]}>
        <LangToggle lang={lang} onChange={setLang} />
        {(screen === 'board' || screen === 'question') && <ScoreBadge score={score} label={t.pts} />}
      </View>

      {screen === 'start' && (
        <View style={styles.fill}>
          <View style={styles.startTop}>
            <Text style={[styles.kicker, dir.text]}>{t.category}</Text>
            <Text style={[styles.title, dir.text]}>{t.title}</Text>
            <Text style={[styles.body, dir.text]}>{t.tagline}</Text>
            <View style={styles.steps}>
              {t.steps.map((s, i) => (
                <View key={s} style={[styles.step, { flexDirection: dir.row }]}>
                  <Text style={styles.stepNum}>{i + 1}</Text>
                  <Text style={[styles.stepText, dir.text]}>{s}</Text>
                </View>
              ))}
            </View>
          </View>
          <PrimaryButton label={t.start} onPress={newGame} />
        </View>
      )}

      {screen === 'board' && (
        <View style={styles.fill}>
          <View style={styles.gapSm}>
            <Text style={[styles.h2, dir.text]}>{t.pick}</Text>
            <Text style={[styles.hint, dir.text]}>{t.pickHint}</Text>
          </View>
          <View style={[styles.board, { flexDirection: dir.row }]}>
            {QUESTIONS.map((item, i) => (
              <CategoryTile
                key={item.points}
                topic={item.topic[lang]}
                points={item.points}
                result={results[i]}
                wide={i === QUESTIONS.length - 1}
                onPress={() => open(i)}
                dir={dir}
              />
            ))}
          </View>
        </View>
      )}

      {screen === 'question' && (
        <View style={styles.fill}>
          <QuestionCard topic={q.topic[lang]} question={q.question[lang]} points={q.points} ptsLabel={t.pts} dir={dir} />
          <View style={styles.answers}>
            {answersOf(q).map((a) => (
              <AnswerButton
                key={a.en}
                label={a[lang]}
                disabled={answered}
                state={!answered ? 'idle' : a === q.correct ? 'correct' : a === picked ? 'wrong' : 'idle'}
                onPress={() => pick(a)}
                dir={dir}
              />
            ))}
          </View>
          <View style={styles.footer}>
            {answered && (
              <>
                <Text style={[styles.feedback, { color: picked === q.correct ? colors.accent : colors.wrong }]}>
                  {picked === q.correct ? t.right + q.points : t.wrong + q.correct[lang]}
                </Text>
                <PrimaryButton light label={allDone ? t.seeScore : t.toBoard} onPress={() => setScreen(allDone ? 'end' : 'board')} />
              </>
            )}
          </View>
        </View>
      )}

      {screen === 'end' && (
        <View style={styles.fill}>
          <View style={styles.endTop}>
            <Text style={styles.hint}>{t.final}</Text>
            <Text style={styles.bigScore}>{score}</Text>
            <Text style={styles.hint}>{t.outOf}</Text>
            <Text style={styles.correctLine}>{correctCount}{t.correctOf}</Text>
            <Text style={styles.body}>{correctCount === QUESTIONS.length ? t.v5 : correctCount >= 3 ? t.v3 : t.v0}</Text>
          </View>
          <PrimaryButton label={t.again} onPress={newGame} />
        </View>
      )}

      <StatusBar style="light" />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.bg, paddingTop: 56, paddingHorizontal: 20, paddingBottom: 32, gap: 18 },
  topBar: { justifyContent: 'space-between', alignItems: 'center' },
  fill: { flex: 1, gap: 16, justifyContent: 'space-between' },
  startTop: { gap: 12, paddingTop: 24 },
  kicker: { color: colors.muted, fontSize: 15, fontFamily: fonts.semi },
  title: { color: colors.text, fontSize: 44, lineHeight: 60, fontFamily: fonts.black },
  body: { color: colors.soft, fontSize: 17, lineHeight: 27, fontFamily: fonts.regular, textAlign: 'center' },
  steps: { gap: 10, marginTop: 12 },
  step: { alignItems: 'center', gap: 12, backgroundColor: colors.card, borderRadius: 14, padding: 12 },
  stepNum: {
    width: 32, height: 32, borderRadius: 10, overflow: 'hidden', backgroundColor: colors.accent, color: colors.bg,
    textAlign: 'center', lineHeight: 32, fontFamily: fonts.black, fontSize: 16,
  },
  stepText: { flex: 1, color: colors.text, fontSize: 16, lineHeight: 24, fontFamily: fonts.semi },
  gapSm: { gap: 2 },
  h2: { color: colors.text, fontSize: 28, lineHeight: 40, fontFamily: fonts.black },
  hint: { color: colors.muted, fontSize: 15, lineHeight: 24, fontFamily: fonts.regular },
  board: { flexWrap: 'wrap', justifyContent: 'space-between', rowGap: 12, marginBottom: 'auto' },
  answers: { gap: 12, marginTop: 'auto' },
  footer: { minHeight: 110, gap: 10, justifyContent: 'flex-end' },
  feedback: { fontSize: 19, lineHeight: 30, fontFamily: fonts.black, textAlign: 'center' },
  endTop: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 6 },
  bigScore: { color: colors.accent, fontSize: 84, lineHeight: 104, fontFamily: fonts.black },
  correctLine: { color: colors.text, fontSize: 20, lineHeight: 32, fontFamily: fonts.bold, marginTop: 10 },
});
