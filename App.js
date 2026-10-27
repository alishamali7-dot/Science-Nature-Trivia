import { useEffect, useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { ScrollView, StyleSheet, Text, TextInput, View, useWindowDimensions } from 'react-native';
import { useFonts } from 'expo-font';
import AnswerButton from './components/AnswerButton';
import CategoryCard from './components/CategoryCard';
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
import { answersOf, fiftyFifty, scoreAnswer, winnerOf } from './game';
import { CATEGORIES, QUESTIONS } from './questions';
import { STRINGS, dirFor } from './strings';
import { TIME, colors, fontFiles, fonts } from './theme';

const CALL_BONUS = 30; // seconds added by "call a friend"

// Board layout: two category cards per row.
const PAIRS = [0, 2, 4].map((i) => CATEGORIES.slice(i, i + 2));

export default function App() {
  const [fontsLoaded] = useFonts(fontFiles);
  const short = useWindowDimensions().height < 760; // iPhone SE-size screens get a tighter question layout
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
  const [lifelines, setLifelines] = useState([{}, {}]); // per team: { fifty, twoTries, pit, call }, once each

  // Current question
  const [current, setCurrent] = useState(0);
  const [picked, setPicked] = useState(null); // answer object, or 'timeout'
  const [removed, setRemoved] = useState([]); // hidden by 50/50
  const [tried, setTried] = useState([]); // wrong first try under "two tries"
  const [twoTries, setTwoTries] = useState(false);
  const [pit, setPit] = useState(false);
  const [bonus, setBonus] = useState(0);
  const [notice, setNotice] = useState('');
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
    setTried([]);
    setTwoTries(false);
    setPit(false);
    setBonus(0);
    setNotice('');
    setLeft(TIME[age]);
    setScreen('question');
  };

  function finish(answer) {
    if (answered) return;
    const right = answer === q.correct;
    if (!right && answer !== 'timeout' && twoTries && tried.length === 0) {
      setTried([answer]);
      setNotice(t.tryAgain);
      return;
    }
    setPicked(answer);
    setResults({ ...results, [current]: { right, team: turn } });
    setScores(scoreAnswer(scores, turn, q, right, pit));
  }

  const takeLifeline = (kind) => {
    setLifelines(lifelines.map((l, i) => (i === turn ? { ...l, [kind]: true } : l)));
    if (kind === 'fifty') setRemoved(fiftyFifty({ ...q, wrong: q.wrong.filter((w) => !tried.includes(w)) }));
    if (kind === 'twoTries') setTwoTries(true);
    if (kind === 'pit') { setPit(true); setNotice(t.pitOn); }
    if (kind === 'call') { setBonus(CALL_BONUS); setLeft(left + CALL_BONUS); setNotice(t.callOn); }
  };

  const next = () => {
    setTurn((turn + 1) % teamCount);
    setScreen(allDone ? 'end' : 'board');
  };

  const right = picked === q.correct;
  const winner = winnerOf(scores);
  const correctCount = Object.values(results).filter((r) => r.right).length;
  const maxPoints = questions.reduce((sum, x) => sum + x.points, 0);
  const mine = lifelines[turn] || {};
  const other = (turn + 1) % teamCount;

  // Each category's 6 questions split into two sides of 200 / 400 / 600.
  const sidesOf = (c) => {
    const tiles = questions
      .map((x, i) => ({ points: x.points, result: results[i], onPress: () => open(i), category: x.category }))
      .filter((x) => x.category === c.id)
      .sort((a, b) => a.points - b.points);
    return [tiles.filter((_, i) => i % 2 === 0), tiles.filter((_, i) => i % 2 === 1)];
  };


  const helpers = [
    { kind: 'fifty', label: t.fifty, off: removed.length > 0 },
    { kind: 'twoTries', label: t.twoTries, off: twoTries },
    ...(teamCount > 1 ? [{ kind: 'pit', label: t.pit, off: pit }] : []),
    { kind: 'call', label: t.call, off: bonus > 0 },
  ];

  let feedback = '';
  if (answered) {
    feedback = right ? t.right(q.points) : (picked === 'timeout' ? t.timeout : t.wrong) + q.correct[lang];
    if (right && pit && teamCount > 1) feedback += `\n${t.pitHit(teamNames[other], q.points)}`;
  }

  return (
    <View style={styles.screen}>
      <View style={[styles.topBar, { flexDirection: dir.row }]}>
        <LangToggle lang={lang} onChange={setLang} />
        <Text style={styles.brand}>{t.category}</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
        {screen === 'start' && (
          <View key={`start-${lang}`} style={styles.fill}>
            <View style={styles.startTop}>
            <View style={styles.hero}>
              <Float amount={10}>
                <Illustration name="hero" size={short ? 150 : 210} />
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
                <FadeIn key={c.id} delay={320 + i * 70}>
                  <Illustration name={c.art} size={44} />
                </FadeIn>
              ))}
            </View>
            </View>
            <FadeIn delay={760}>
              <PrimaryButton label={t.start} onPress={() => setScreen('setup')} />
            </FadeIn>
          </View>
        )}

        {screen === 'setup' && (
          <View key={`setup-${lang}`} style={[styles.fill, short && styles.fillShort]}>
            <FadeIn>
              <Text style={[styles.h1, short && styles.h1Short, dir.text]}>{t.setup}</Text>
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
              <View style={[styles.pair, { flexDirection: dir.row }]}>
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
                      style={[styles.input, short && styles.inputShort, dir.text]}
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
            <TeamScores names={teamNames} scores={scores} turn={turn} ptsLabel={t.pts} turnLabel={t.yourTurn} dir={dir} />
            <View style={styles.board}>
              {PAIRS.map((pair, pi) => (
                <FadeIn key={pi} delay={pi * 90} style={[styles.pair, { flexDirection: dir.row }]}>
                  {pair.map((c) => (
                    <CategoryCard key={c.id} category={c} sides={sidesOf(c)} lang={lang} teamColors={colors.teams} />
                  ))}
                </FadeIn>
              ))}
            </View>
          </View>
        )}

        {screen === 'question' && (
          <View key={`q-${current}`} style={[styles.fill, short && styles.fillShort]}>
            {/* Status line: whose turn + timer while answering, then the result. */}
            {answered ? (
              <FadeIn>
                <Text style={[styles.feedback, { color: right ? colors.accent : colors.wrong }]}>{feedback}</Text>
              </FadeIn>
            ) : (
              <View style={[styles.status, { flexDirection: dir.row }]}>
                {teamCount > 1 && (
                  <View style={[styles.turn, { flexDirection: dir.row, borderColor: colors.teams[turn] }]}>
                    <View style={[styles.turnDot, { backgroundColor: colors.teams[turn] }]} />
                    <Text style={[styles.turnText, { color: colors.teams[turn] }]} numberOfLines={1}>{teamNames[turn]}</Text>
                  </View>
                )}
                <View style={styles.timer}>
                  <TimerBar left={left} total={TIME[age] + bonus} label={t.sec} dir={dir} />
                </View>
              </View>
            )}
            <FadeIn>
              <QuestionCard
                category={CATEGORIES.find((c) => c.id === q.category)}
                question={q.question[lang]}
                points={q.points}
                ptsLabel={t.pts}
                note={answered ? '' : notice}
                compact={short}
                dir={dir}
                lang={lang}
              />
            </FadeIn>
            <View style={[styles.answers, short && styles.answersShort]}>
              {answersOf(q).map((a, i) => (
                <FadeIn key={a.en} delay={120 + i * 70}>
                  <AnswerButton
                    compact={short}
                    label={a[lang]}
                    removed={removed.includes(a)}
                    disabled={answered || tried.includes(a)}
                    state={
                      tried.includes(a) || (answered && a === picked && !right) ? 'wrong'
                        : answered && a === q.correct ? 'correct' : 'idle'
                    }
                    onPress={() => finish(a)}
                    dir={dir}
                  />
                </FadeIn>
              ))}
            </View>
            <View style={styles.footer}>
              {answered ? (
                <FadeIn>
                  <PrimaryButton variant="light" label={allDone ? t.seeScore : t.next} onPress={next} />
                </FadeIn>
              ) : (
                <View style={[styles.helpers, { flexDirection: dir.row }]}>
                  {helpers.map((h) => (
                    <Lifeline
                      key={h.kind}
                      compact={short}
                      label={h.label}
                      used={mine[h.kind]}
                      usedLabel={t.used}
                      disabled={h.off}
                      onPress={() => takeLifeline(h.kind)}
                    />
                  ))}
                </View>
              )}
            </View>
          </View>
        )}

        {screen === 'end' && (
          <View key={`end-${lang}`} style={styles.fill}>
            <View style={styles.startTop}>
            <View style={styles.hero}>
              <Float amount={8}>
                <Illustration name="hero" size={160} />
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
                    {correctCount >= 30 ? t.v5 : correctCount >= 18 ? t.v3 : t.v0}
                  </Text>
                </>
              )}
            </FadeIn>
            {teamCount > 1 && (
              <FadeIn delay={250}>
                <TeamScores names={teamNames} scores={scores} turn={-1} ptsLabel={t.pts} dir={dir} />
              </FadeIn>
            )}
            </View>
            <FadeIn delay={400} style={styles.section}>
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
  screen: { flex: 1, backgroundColor: colors.bg, paddingTop: 54, paddingHorizontal: 16 },
  scroll: { flexGrow: 1, paddingTop: 14, paddingBottom: 28 },
  topBar: { justifyContent: 'space-between', alignItems: 'center' },
  brand: { color: colors.muted, fontSize: 14, fontFamily: fonts.medium },
  fill: { flex: 1, gap: 14 },
  bottom: { marginTop: 'auto' },
  section: { gap: 10 },
  pair: { gap: 8 },
  center: { textAlign: 'center' },
  centerBox: { alignItems: 'center', gap: 4 },
  hero: { alignItems: 'center' },
  startTop: { flex: 1, justifyContent: 'center', gap: 14 },
  artRow: { justifyContent: 'center', flexWrap: 'wrap', gap: 8 },
  title: { color: colors.text, fontSize: 44, lineHeight: 70, fontFamily: fonts.display },
  h1: { color: colors.text, fontSize: 30, lineHeight: 48, fontFamily: fonts.display },
  label: { color: colors.soft, fontSize: 16, lineHeight: 24, fontFamily: fonts.bold },
  body: { color: colors.soft, fontSize: 17, lineHeight: 28, fontFamily: fonts.regular },
  hint: { color: colors.muted, fontSize: 15, lineHeight: 24, fontFamily: fonts.medium },
  fillShort: { gap: 8 },
  h1Short: { fontSize: 26, lineHeight: 40 },
  inputShort: { minHeight: 44 },
  status: { alignItems: 'center', gap: 10, minHeight: 40 },
  timer: { flex: 1 },
  answersShort: { gap: 8 },
  inputRow: { alignItems: 'center', gap: 10, borderWidth: 2, borderRadius: 16, paddingHorizontal: 14, backgroundColor: colors.card },
  input: { flex: 1, minHeight: 52, color: colors.text, fontSize: 17, fontFamily: fonts.bold },
  turn: { maxWidth: '45%', alignItems: 'center', gap: 8, borderWidth: 2, borderRadius: 999, paddingVertical: 4, paddingHorizontal: 12, backgroundColor: colors.card },
  turnDot: { width: 12, height: 12, borderRadius: 6 },
  turnText: { flexShrink: 1, fontSize: 15, lineHeight: 24, fontFamily: fonts.bold },
  board: { gap: 8 },
  answers: { gap: 10 },
  helpers: { flexWrap: 'wrap', gap: 8 },
  footer: { marginTop: 'auto' },
  feedback: { minHeight: 40, fontSize: 18, lineHeight: 28, fontFamily: fonts.black, textAlign: 'center', textAlignVertical: 'center' },
  winner: { fontSize: 42, lineHeight: 68, fontFamily: fonts.display, textAlign: 'center' },
  bigScore: { color: colors.accent, fontSize: 80, lineHeight: 104, fontFamily: fonts.black },
  correctLine: { color: colors.text, fontSize: 20, lineHeight: 32, fontFamily: fonts.bold, marginTop: 6 },
});
