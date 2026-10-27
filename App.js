import { useEffect, useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { useFonts } from 'expo-font';
import AnswerButton from './components/AnswerButton';
import BoardRow from './components/BoardRow';
import Confetti from './components/Confetti';
import Illustration from './components/Illustration';
import LangToggle from './components/LangToggle';
import Lifeline from './components/Lifeline';
import { FadeIn, Float } from './components/Motion';
import OptionCard from './components/OptionCard';
import PrimaryButton from './components/PrimaryButton';
import QuestionCard from './components/QuestionCard';
import TeamScores from './components/TeamScores';
import TimerBar from './components/TimerBar';
import { answersOf, fiftyFifty, pointsFor, winnerOf } from './game';
import { CATEGORIES, QUESTIONS } from './questions';
import { STRINGS, dirFor } from './strings';
import { TIME, colors, fontFiles, fonts } from './theme';

export default function App() {
  const [fontsLoaded] = useFonts(fontFiles);
  const [lang, setLang] = useState('ar');
  const [screen, setScreen] = useState('start'); // start | setup | board | question | end

  // Setup
  const [mode, setMode] = useState('teams'); // solo | teams
  const [age, setAge] = useState('kids'); // kids | adults
  const [names, setNames] = useState(['', '']);

  // Game
  const [results, setResults] = useState({}); // question index -> { right, team }
  const [scores, setScores] = useState([0, 0]);
  const [turn, setTurn] = useState(0);
  const [lifelines, setLifelines] = useState([{}, {}]); // per team: { fifty, double } once each
  const [current, setCurrent] = useState(0);
  const [picked, setPicked] = useState(null); // answer object, or 'timeout'
  const [removed, setRemoved] = useState([]);
  const [doubled, setDoubled] = useState(false);
  const [left, setLeft] = useState(TIME.kids);

  const questions = QUESTIONS[age];
  const q = questions[current];
  const answered = picked !== null;

  // Countdown: one tick per second while a question is open and unanswered.
  useEffect(() => {
    if (screen !== 'question' || answered) return;
    if (left === 0) return finish('timeout');
    const id = setTimeout(() => setLeft((s) => s - 1), 1000);
    return () => clearTimeout(id);
  }, [screen, answered, left]);

  if (!fontsLoaded) return <View style={styles.screen} />;

  const t = STRINGS[lang];
  const dir = dirFor(lang);
  const teamCount = mode === 'teams' ? 2 : 1;
  const teamNames = mode === 'teams' ? names.map((n, i) => n.trim() || t.defaultTeams[i]) : [t.you];
  const allDone = Object.keys(results).length === questions.length;

  const newGame = () => {
    setResults({});
    setScores(Array(teamCount).fill(0));
    setTurn(0);
    setLifelines(Array.from({ length: teamCount }, () => ({})));
    setScreen('board');
  };

  const open = (i) => {
    setCurrent(i);
    setPicked(null);
    setRemoved([]);
    setDoubled(false);
    setLeft(TIME[age]);
    setScreen('question');
  };

  function finish(answer) {
    if (answered) return;
    const right = answer === q.correct;
    setPicked(answer);
    setResults({ ...results, [current]: { right, team: turn } });
    setScores(scores.map((s, i) => (i === turn ? s + pointsFor(q, right, doubled) : s)));
  }

  const takeLifeline = (kind) => {
    setLifelines(lifelines.map((l, i) => (i === turn ? { ...l, [kind]: true } : l)));
    if (kind === 'fifty') setRemoved(fiftyFifty(q));
    if (kind === 'double') setDoubled(true);
  };

  const next = () => {
    setTurn((turn + 1) % teamCount);
    setScreen(allDone ? 'end' : 'board');
  };

  const right = picked === q.correct;
  const winner = winnerOf(scores);
  const correctCount = Object.values(results).filter((r) => r.right).length;
  const maxPoints = questions.reduce((sum, x) => sum + x.points, 0);
  const myLifelines = lifelines[turn] || {};

  const turnBanner = teamCount > 1 && (
    <View style={[styles.turn, { flexDirection: dir.row, borderColor: colors.teams[turn] }]}>
      <View style={[styles.turnDot, { backgroundColor: colors.teams[turn] }]} />
      <Text style={[styles.turnText, dir.text]}>
        {t.turn} <Text style={{ color: colors.teams[turn] }}>{teamNames[turn]}</Text>
      </Text>
    </View>
  );

  return (
    <View style={styles.screen}>
      <View style={[styles.topBar, { flexDirection: dir.row }]}>
        <LangToggle lang={lang} onChange={setLang} />
        <Text style={styles.brand}>{t.category}</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
        {screen === 'start' && (
          <View key={`start-${lang}`} style={styles.fill}>
            <View style={styles.hero}>
              <Float amount={10}>
                <Illustration name="hero" size={230} />
              </Float>
            </View>
            <FadeIn delay={100}>
              <Text style={[styles.title, styles.center]}>{t.title}</Text>
            </FadeIn>
            <FadeIn delay={220}>
              <Text style={[styles.body, styles.center]}>{t.tagline}</Text>
            </FadeIn>
            <View style={[styles.artRow, { flexDirection: dir.row }]}>
              {CATEGORIES.map((c, i) => (
                <FadeIn key={c.id} delay={320 + i * 80}>
                  <Illustration name={c.art} size={48} />
                </FadeIn>
              ))}
            </View>
            <FadeIn delay={760} style={styles.bottom}>
              <PrimaryButton label={t.start} onPress={() => setScreen('setup')} />
            </FadeIn>
          </View>
        )}

        {screen === 'setup' && (
          <View key={`setup-${lang}`} style={styles.fill}>
            <FadeIn>
              <Text style={[styles.h1, dir.text]}>{t.setup}</Text>
            </FadeIn>

            <FadeIn delay={80} style={styles.section}>
              <Text style={[styles.label, dir.text]}>{t.who}</Text>
              <View style={[styles.pair, { flexDirection: dir.row }]}>
                <OptionCard title={t.solo} selected={mode === 'solo'} onPress={() => setMode('solo')} dir={dir} />
                <OptionCard title={t.teams} selected={mode === 'teams'} onPress={() => setMode('teams')} dir={dir} />
              </View>
            </FadeIn>

            <FadeIn delay={160} style={styles.section}>
              <Text style={[styles.label, dir.text]}>{t.age}</Text>
              <View style={styles.section}>
                <OptionCard art="animals" title={t.kids} hint={t.kidsHint} selected={age === 'kids'} onPress={() => setAge('kids')} dir={dir} />
                <OptionCard art="space" title={t.adults} hint={t.adultsHint} selected={age === 'adults'} onPress={() => setAge('adults')} dir={dir} />
              </View>
            </FadeIn>

            {mode === 'teams' && (
              <FadeIn delay={240} style={styles.section}>
                <Text style={[styles.label, dir.text]}>{t.teamNames}</Text>
                {names.map((n, i) => (
                  <View key={i} style={[styles.inputRow, { flexDirection: dir.row, borderColor: colors.teams[i] }]}>
                    <View style={[styles.turnDot, { backgroundColor: colors.teams[i] }]} />
                    <TextInput
                      value={n}
                      onChangeText={(v) => setNames(names.map((x, j) => (j === i ? v : x)))}
                      placeholder={t.defaultTeams[i]}
                      placeholderTextColor={colors.muted}
                      maxLength={14}
                      style={[styles.input, dir.text]}
                      accessibilityLabel={`${t.teamNames} ${i + 1}`}
                    />
                  </View>
                ))}
              </FadeIn>
            )}

            <View style={styles.bottom}>
              <PrimaryButton label={t.go} onPress={newGame} />
            </View>
          </View>
        )}

        {screen === 'board' && (
          <View key={`board-${lang}`} style={styles.fill}>
            <TeamScores names={teamNames} scores={scores} turn={turn} ptsLabel={t.pts} dir={dir} />
            {turnBanner}
            <Text style={[styles.hint, dir.text]}>{t.pick}</Text>
            <View style={styles.board}>
              {CATEGORIES.map((c, ci) => (
                <FadeIn key={c.id} delay={ci * 70}>
                  <BoardRow
                    category={c}
                    lang={lang}
                    dir={dir}
                    teamColors={colors.teams}
                    tiles={questions
                      .map((x, i) => ({ x, i }))
                      .filter(({ x }) => x.category === c.id)
                      .map(({ x, i }) => ({ points: x.points, result: results[i], onPress: () => open(i) }))}
                  />
                </FadeIn>
              ))}
            </View>
          </View>
        )}

        {screen === 'question' && (
          <View key={`q-${current}`} style={styles.fill}>
            {turnBanner}
            <TimerBar left={left} total={TIME[age]} label={t.sec} dir={dir} />
            <FadeIn>
              <QuestionCard
                category={CATEGORIES.find((c) => c.id === q.category)}
                question={q.question[lang]}
                points={q.points}
                ptsLabel={t.pts}
                doubled={doubled}
                dir={dir}
                lang={lang}
              />
            </FadeIn>
            <View style={[styles.pair, { flexDirection: dir.row }]}>
              <Lifeline label={t.fifty} used={myLifelines.fifty} usedLabel={t.used} disabled={answered || removed.length > 0} onPress={() => takeLifeline('fifty')} />
              <Lifeline label={t.double} used={myLifelines.double} usedLabel={t.used} disabled={answered || doubled} onPress={() => takeLifeline('double')} />
            </View>
            <View style={styles.answers}>
              {answersOf(q).map((a, i) => (
                <FadeIn key={a.en} delay={120 + i * 70}>
                  <AnswerButton
                    label={a[lang]}
                    removed={removed.includes(a)}
                    disabled={answered}
                    state={!answered ? 'idle' : a === q.correct ? 'correct' : a === picked ? 'wrong' : 'idle'}
                    onPress={() => finish(a)}
                    dir={dir}
                  />
                </FadeIn>
              ))}
            </View>
            <View style={styles.footer}>
              {answered && (
                <FadeIn style={styles.section}>
                  <Text style={[styles.feedback, { color: right ? colors.accent : colors.wrong }]}>
                    {right ? t.right + pointsFor(q, true, doubled) : (picked === 'timeout' ? t.timeout : t.wrong) + q.correct[lang]}
                  </Text>
                  <PrimaryButton variant="light" label={allDone ? t.seeScore : t.next} onPress={next} />
                </FadeIn>
              )}
            </View>
          </View>
        )}

        {screen === 'end' && (
          <View key={`end-${lang}`} style={styles.fill}>
            <View style={styles.hero}>
              <Float amount={8}>
                <Illustration name="hero" size={170} />
              </Float>
            </View>
            <FadeIn delay={100} style={styles.centerBox}>
              <Text style={styles.hint}>{teamCount > 1 ? t.winner : t.final}</Text>
              {teamCount > 1 ? (
                <Text style={[styles.winner, { color: winner === -1 ? colors.gold : colors.teams[winner] }]}>
                  {winner === -1 ? t.tie : teamNames[winner]}
                </Text>
              ) : (
                <>
                  <Text style={styles.bigScore}>{scores[0]}</Text>
                  <Text style={styles.hint}>{t.outOf(maxPoints)}</Text>
                  <Text style={styles.correctLine}>{t.correctOf(correctCount, questions.length)}</Text>
                  <Text style={[styles.body, styles.center]}>
                    {correctCount >= 9 ? t.v5 : correctCount >= 5 ? t.v3 : t.v0}
                  </Text>
                </>
              )}
            </FadeIn>
            {teamCount > 1 && (
              <FadeIn delay={250}>
                <TeamScores names={teamNames} scores={scores} turn={-1} ptsLabel={t.pts} dir={dir} />
              </FadeIn>
            )}
            <FadeIn delay={400} style={[styles.bottom, styles.section]}>
              <PrimaryButton label={t.again} onPress={newGame} />
              <PrimaryButton variant="ghost" label={t.change} onPress={() => setScreen('setup')} />
            </FadeIn>
          </View>
        )}
      </ScrollView>

      {screen === 'end' && <Confetti key={`confetti-${scores.join('-')}`} />}
      <StatusBar style="light" />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.bg, paddingTop: 54, paddingHorizontal: 20 },
  scroll: { flexGrow: 1, paddingTop: 16, paddingBottom: 32 },
  topBar: { justifyContent: 'space-between', alignItems: 'center' },
  brand: { color: colors.muted, fontSize: 14, fontFamily: fonts.medium },
  fill: { flex: 1, gap: 16 },
  bottom: { marginTop: 'auto' },
  section: { gap: 10 },
  pair: { gap: 10 },
  center: { textAlign: 'center' },
  centerBox: { alignItems: 'center', gap: 6 },
  hero: { alignItems: 'center', paddingTop: 4 },
  artRow: { justifyContent: 'center', gap: 10 },
  title: { color: colors.text, fontSize: 46, lineHeight: 72, fontFamily: fonts.display },
  h1: { color: colors.text, fontSize: 32, lineHeight: 50, fontFamily: fonts.display },
  label: { color: colors.soft, fontSize: 16, lineHeight: 24, fontFamily: fonts.bold },
  body: { color: colors.soft, fontSize: 17, lineHeight: 28, fontFamily: fonts.regular },
  hint: { color: colors.muted, fontSize: 15, lineHeight: 24, fontFamily: fonts.medium },
  inputRow: { alignItems: 'center', gap: 10, borderWidth: 2, borderRadius: 16, paddingHorizontal: 14, backgroundColor: colors.card },
  input: { flex: 1, minHeight: 54, color: colors.text, fontSize: 17, fontFamily: fonts.bold },
  turn: { alignItems: 'center', gap: 10, borderWidth: 2, borderRadius: 16, paddingVertical: 8, paddingHorizontal: 14, backgroundColor: colors.card },
  turnDot: { width: 12, height: 12, borderRadius: 6 },
  turnText: { flex: 1, color: colors.text, fontSize: 17, lineHeight: 26, fontFamily: fonts.bold },
  board: { gap: 12 },
  answers: { gap: 10 },
  footer: { minHeight: 110, justifyContent: 'flex-end' },
  feedback: { fontSize: 19, lineHeight: 30, fontFamily: fonts.black, textAlign: 'center' },
  winner: { fontSize: 44, lineHeight: 70, fontFamily: fonts.display, textAlign: 'center' },
  bigScore: { color: colors.accent, fontSize: 84, lineHeight: 110, fontFamily: fonts.black },
  correctLine: { color: colors.text, fontSize: 20, lineHeight: 32, fontFamily: fonts.bold, marginTop: 6 },
});
