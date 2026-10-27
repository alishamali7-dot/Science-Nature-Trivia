import { useEffect, useRef, useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { BackHandler, ScrollView, StyleSheet, TextInput, View } from 'react-native';
import { SafeAreaProvider, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useFonts } from 'expo-font';
import AnswerButton from './components/AnswerButton';
import BackButton from './components/BackButton';
import Backdrop from './components/Backdrop';
import CategoryCard from './components/CategoryCard';
import Confetti from './components/Confetti';
import GameBar from './components/GameBar';
import { haptic } from './components/haptics';
import Illustration from './components/Illustration';
import LangToggle from './components/LangToggle';
import Lifeline from './components/Lifeline';
import { FadeIn, Float } from './components/Motion';
import OptionCard from './components/OptionCard';
import PrimaryButton from './components/PrimaryButton';
import QuestionCard from './components/QuestionCard';
import TeamScores from './components/TeamScores';
import TimerBar from './components/TimerBar';
import Txt from './components/Txt';
import useLayout from './components/useLayout';
import { answersOf, fiftyFifty, scoreAnswer, winnerOf } from './game';
import { CATEGORIES, QUESTIONS } from './questions';
import { STRINGS, dirFor } from './strings';
import { TIME, colors, fontFiles, fonts, radius, space } from './theme';

const CALL_BONUS = 30; // seconds added by "call a friend"

const HELPER_ICONS = { fifty: 'half', twoTries: 'repeat', pit: 'pit', call: 'phone' };

// Board rows of `n` category cards each, for any number of categories.
const rowsOf = (n) => CATEGORIES.filter((_, i) => i % n === 0).map((_, r) => CATEGORIES.slice(r * n, r * n + n));

export default function App() {
  return (
    <SafeAreaProvider>
      <Game />
    </SafeAreaProvider>
  );
}

function Game() {
  const [fontsLoaded] = useFonts(fontFiles);
  const insets = useSafeAreaInsets();
  const { short, wide, column, boardColumns } = useLayout();
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
  const [history, setHistory] = useState([]); // game snapshots before each answered question, for Undo
  const [pending, setPending] = useState(null); // snapshot taken when the current question opened
  const [gameConfig, setGameConfig] = useState(null); // { mode, age } of the game in progress, so setup can offer "continue"

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

  // Android's system Back button runs the same "go back" as the on-screen button.
  const backRef = useRef(null);
  useEffect(() => {
    const sub = BackHandler.addEventListener('hardwareBackPress', () => (backRef.current ? backRef.current() : false));
    return () => sub.remove();
  }, []);

  if (!fontsLoaded) return <View style={styles.screen} />;

  const t = STRINGS[lang];
  const dir = dirFor(lang);
  const teamCount = mode === 'teams' ? 2 : 1;
  const teamNames = mode === 'teams' ? names.map((n, i) => n.trim() || t.defaultTeams[i]) : [t.you];
  const doneCount = Object.keys(results).length;
  const allDone = doneCount === questions.length;
  const inGame = screen === 'board' || screen === 'question' || screen === 'end';

  const newGame = () => {
    setResults({});
    setScores(Array(teamCount).fill(0));
    setTurn(0);
    setLifelines(Array.from({ length: teamCount }, () => ({})));
    setHistory([]);
    setPending(null);
    setPicked(null);
    setGameConfig({ mode, age });
    setScreen('board');
  };

  const open = (i) => {
    setPending({ results, scores, turn, lifelines });
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
      haptic.error();
      setTried([answer]);
      setNotice(t.tryAgain);
      return;
    }
    (right ? haptic.success : haptic.error)();
    setPicked(answer);
    setResults({ ...results, [current]: { right, team: turn } });
    setScores(scoreAnswer(scores, turn, q, right, pit));
    setHistory([...history, pending]);
  }

  // Undo: take back the last answered question (its points, helpers and turn) and return to the board.
  const undo = () => {
    const last = history[history.length - 1];
    if (!last) return;
    setResults(last.results);
    setScores(last.scores);
    setTurn(last.turn);
    setLifelines(last.lifelines);
    setHistory(history.slice(0, -1));
    setPending(null);
    setPicked(null);
    setScreen('board');
  };

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

  // Back to the previous screen. Leaving an unanswered question puts it back on the board as if
  // it was never opened (helpers used on it come back). Returns false on the start screen so
  // Android can close the app.
  const goBack = () => {
    if (screen === 'setup') setScreen('start');
    else if (screen === 'board') setScreen('setup');
    else if (screen === 'question' && answered) next();
    else if (screen === 'question') {
      if (pending) setLifelines(pending.lifelines);
      setPending(null);
      setScreen('board');
    } else if (screen === 'end') setScreen('board');
    else return false;
    return true;
  };
  backRef.current = goBack;

  // A game in progress can be continued from setup, as long as players and age group are unchanged.
  const canResume = gameConfig && gameConfig.mode === mode && gameConfig.age === age;

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

  // Phones use the full width; tablets center a readable column (the board gets a wider one).
  const col = (wider) => (wide ? { width: '100%', maxWidth: wider ? 920 : column, alignSelf: 'center' } : null);

  return (
    <View style={[styles.screen, { paddingTop: insets.top + space.sm, paddingStart: insets.left + space.lg, paddingEnd: insets.right + space.lg }]}>
      <Backdrop />

      <View style={[styles.topBar, col(screen === 'board'), { flexDirection: dir.row }]}>
        <View style={[styles.topStart, { flexDirection: dir.row }]}>
          {screen !== 'start' && <BackButton onPress={goBack} label={t.back} dir={dir} />}
          {/* During a game the bar holds undo/restart; language is changed from setup (then "continue game"). */}
          {!inGame && <LangToggle lang={lang} onChange={setLang} />}
        </View>
        {inGame ? (
          <GameBar canUndo={history.length > 0} onUndo={undo} onRestart={newGame} t={t} dir={dir} />
        ) : (
          <Txt variant="caption" color="muted">{t.category}</Txt>
        )}
      </View>

      <ScrollView
        contentContainerStyle={[styles.scroll, { paddingBottom: Math.max(insets.bottom, space.lg) + space.sm }]}
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="interactive"
        automaticallyAdjustKeyboardInsets
        showsVerticalScrollIndicator={false}
      >
        {screen === 'start' && (
          <View key={`start-${lang}`} style={[styles.fill, col()]}>
            <View style={styles.centered}>
              <View style={styles.hero}>
                <Float amount={10}>
                  <Illustration name="hero" size={short ? 150 : wide ? 280 : 220} />
                </Float>
              </View>
              <FadeIn delay={120} style={styles.headBlock}>
                <Txt variant={short ? 'displayCompact' : 'display'} style={styles.center} accessibilityRole="header">{t.title}</Txt>
                <Txt color="soft" style={styles.center}>{t.tagline}</Txt>
              </FadeIn>
              <View style={[styles.artRow, { flexDirection: dir.row }]}>
                {CATEGORIES.map((c) => (
                  <View key={c.id} style={[styles.artChip, { backgroundColor: `${c.color}1A`, borderColor: `${c.color}40` }]}>
                    <Illustration name={c.art} size={36} />
                  </View>
                ))}
              </View>
            </View>
            <PrimaryButton label={t.start} onPress={() => setScreen('setup')} dir={dir} />
          </View>
        )}

        {screen === 'setup' && (
          <View key={`setup-${lang}`} style={[styles.fill, short && styles.fillShort, col()]}>
            <Txt variant={short ? 'heading' : 'title'} style={dir.text} accessibilityRole="header">{t.setup}</Txt>

            <View style={[styles.section, short && styles.sectionShort]}>
              <Txt variant="caption" color="muted" style={[styles.bold, dir.text]}>{t.who}</Txt>
              <View style={[styles.pair, { flexDirection: dir.row }]} accessibilityRole="radiogroup">
                <OptionCard title={t.solo} selected={mode === 'solo'} onPress={() => setMode('solo')} dir={dir} />
                <OptionCard title={t.teams} selected={mode === 'teams'} onPress={() => setMode('teams')} dir={dir} />
              </View>
            </View>

            <View style={[styles.section, short && styles.sectionShort]}>
              <Txt variant="caption" color="muted" style={[styles.bold, dir.text]}>{t.age}</Txt>
              <View style={[styles.pair, { flexDirection: dir.row }]} accessibilityRole="radiogroup">
                <OptionCard art="animals" compact={short} title={t.kids} hint={t.kidsHint} selected={age === 'kids'} onPress={() => setAge('kids')} dir={dir} />
                <OptionCard art="space" compact={short} title={t.adults} hint={t.adultsHint} selected={age === 'adults'} onPress={() => setAge('adults')} dir={dir} />
              </View>
            </View>

            {mode === 'teams' && (
              <FadeIn style={[styles.section, short && styles.sectionShort]}>
                <Txt variant="caption" color="muted" style={[styles.bold, dir.text]}>{t.teamNames}</Txt>
                {names.map((n, i) => (
                  <View key={i} style={[styles.inputRow, { flexDirection: dir.row }]}>
                    <View style={[styles.teamDot, { backgroundColor: colors.teams[i] }]} />
                    <TextInput
                      value={n}
                      onChangeText={(v) => setNames(names.map((x, j) => (j === i ? v : x)))}
                      placeholder={t.defaultTeams[i]}
                      placeholderTextColor={colors.muted}
                      selectionColor={colors.accent}
                      cursorColor={colors.accent}
                      keyboardAppearance="dark"
                      returnKeyType="done"
                      maxLength={14}
                      style={[styles.input, short && styles.inputShort, dir.text]}
                      accessibilityLabel={`${t.teamNames} ${i + 1}`}
                    />
                  </View>
                ))}
              </FadeIn>
            )}

            <View style={[styles.bottom, styles.section]}>
              {canResume ? (
                <>
                  <PrimaryButton label={t.resume} onPress={() => setScreen('board')} dir={dir} />
                  <PrimaryButton variant="ghost" size={short ? 'sm' : 'md'} icon="restart" label={t.fresh} onPress={newGame} dir={dir} />
                </>
              ) : (
                <PrimaryButton label={t.go} onPress={newGame} dir={dir} />
              )}
            </View>
          </View>
        )}

        {screen === 'board' && (
          <View key={`board-${lang}`} style={[styles.fill, short && styles.fillShort, col(true)]}>
            <TeamScores names={teamNames} scores={scores} turn={turn} ptsLabel={t.pts} turnLabel={t.yourTurn} dir={dir} />
            {!short && (
              <View style={[styles.boardHead, { flexDirection: dir.row }]}>
                <Txt variant="heading" style={dir.text} accessibilityRole="header">{t.board}</Txt>
                <Txt variant="caption" color="muted">{t.left(questions.length - doneCount)}</Txt>
              </View>
            )}
            <FadeIn style={styles.board}>
              {rowsOf(boardColumns).map((row, ri) => (
                <View key={ri} style={[styles.pair, { flexDirection: dir.row }]}>
                  {row.map((c) => (
                    <CategoryCard key={c.id} category={c} sides={sidesOf(c)} lang={lang} teamColors={colors.teams} />
                  ))}
                </View>
              ))}
            </FadeIn>
            {/* Reached after going back from the results: a way forward to them again. */}
            {allDone && (
              <View style={styles.bottom}>
                <PrimaryButton label={t.seeScore} onPress={() => setScreen('end')} dir={dir} />
              </View>
            )}
          </View>
        )}

        {screen === 'question' && (
          <View key={`q-${current}`} style={[styles.fill, short && styles.fillShort, wide && styles.fillCentered, col()]}>
            {/* Status line: whose turn + timer while answering, then the result. */}
            {answered ? (
              <FadeIn>
                <Txt
                  variant="label"
                  color={right ? 'right' : 'wrong'}
                  style={styles.feedback}
                  accessibilityLiveRegion="assertive"
                >
                  {feedback}
                </Txt>
              </FadeIn>
            ) : (
              <View style={[styles.status, { flexDirection: dir.row }]}>
                {teamCount > 1 && (
                  <View style={[styles.turn, { flexDirection: dir.row, borderColor: `${colors.teams[turn]}66`, backgroundColor: `${colors.teams[turn]}1A` }]}>
                    <View style={[styles.teamDot, { backgroundColor: colors.teams[turn] }]} />
                    <Txt variant="callout" color={colors.teams[turn]} style={styles.turnText} numberOfLines={1}>{teamNames[turn]}</Txt>
                  </View>
                )}
                <View style={styles.timer}>
                  <TimerBar left={left} total={TIME[age] + bonus} label={t.sec} dir={dir} />
                </View>
              </View>
            )}
            <QuestionCard
              category={CATEGORIES.find((c) => c.id === q.category)}
              question={q.question[lang]}
              points={q.points}
              ptsLabel={t.pts}
              note={answered ? '' : notice}
              compact={short}
              large={wide}
              dir={dir}
              lang={lang}
            />
            {/* The one authored moment on this screen: answers rise in, one after another. */}
            <View style={[styles.answers, short && styles.answersShort]}>
              {answersOf(q).map((a, i) => (
                <FadeIn key={a.en} delay={80 + i * 60}>
                  <AnswerButton
                    compact={short}
                    letter={t.letters[i]}
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
            {/* Phones pin the actions to the bottom for the thumb; tablets keep them with the answers. */}
            <View style={wide ? styles.footerWide : styles.footer}>
              {answered ? (
                <PrimaryButton label={allDone ? t.seeScore : t.next} onPress={next} dir={dir} />
              ) : (
                <View style={[styles.helpers, { flexDirection: dir.row }]}>
                  {helpers.map((h) => (
                    <Lifeline
                      key={h.kind}
                      icon={HELPER_ICONS[h.kind]}
                      compact={short}
                      label={h.label}
                      used={mine[h.kind]}
                      usedLabel={t.used}
                      disabled={h.off}
                      onPress={() => takeLifeline(h.kind)}
                      dir={dir}
                    />
                  ))}
                </View>
              )}
            </View>
          </View>
        )}

        {screen === 'end' && (
          <View key={`end-${lang}`} style={[styles.fill, col()]}>
            <View style={styles.centered}>
              <View style={styles.hero}>
                <Float amount={8}>
                  <Illustration name="hero" size={short ? 130 : 170} />
                </Float>
              </View>
              <FadeIn delay={100} style={styles.centerBox}>
                {teamCount > 1 ? (
                  <Txt variant={short ? 'displayCompact' : 'display'} color={winner === -1 ? 'gold' : colors.teams[winner]} style={styles.center} accessibilityRole="header">
                    {winner === -1 ? t.tie : t.wins(teamNames[winner])}
                  </Txt>
                ) : (
                  <>
                    <Txt variant="hero" style={styles.num} accessibilityRole="header">{scores[0]}</Txt>
                    <Txt variant="caption" color="muted">{t.outOf(maxPoints)}</Txt>
                    <Txt variant="label" style={styles.gapTop}>{t.correctOf(correctCount, questions.length)}</Txt>
                    <Txt color="soft" style={styles.center}>
                      {correctCount >= 30 ? t.v5 : correctCount >= 18 ? t.v3 : t.v0}
                    </Txt>
                  </>
                )}
              </FadeIn>
              {teamCount > 1 && <TeamScores names={teamNames} scores={scores} turn={-1} ptsLabel={t.pts} dir={dir} />}
            </View>
            <View style={styles.section}>
              <PrimaryButton label={t.again} icon="restart" onPress={newGame} dir={dir} />
              <PrimaryButton variant="ghost" label={t.change} onPress={() => setScreen('setup')} dir={dir} />
            </View>
          </View>
        )}
      </ScrollView>

      {screen === 'end' && <Confetti key={`confetti-${scores.join('-')}`} />}
      <StatusBar style="light" />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.bg },
  scroll: { flexGrow: 1, paddingTop: space.lg },
  topBar: { justifyContent: 'space-between', alignItems: 'center', minHeight: 48, gap: space.sm },
  topStart: { alignItems: 'center', gap: space.sm },
  fill: { flex: 1, gap: space.md + 2 },
  fillShort: { gap: space.sm },
  centered: { flex: 1, justifyContent: 'center', gap: space.lg },
  headBlock: { gap: space.sm },
  bottom: { marginTop: 'auto' },
  section: { gap: 10 },
  sectionShort: { gap: 6 },
  pair: { gap: space.sm },
  center: { textAlign: 'center' },
  centerBox: { alignItems: 'center', gap: 6 },
  hero: { alignItems: 'center' },
  artRow: { justifyContent: 'center', flexWrap: 'wrap', gap: space.sm },
  artChip: { borderRadius: radius.full, borderWidth: 1, padding: space.xs },
  bold: { fontFamily: fonts.bold },
  inputRow: {
    alignItems: 'center', gap: 10, borderRadius: radius.full, paddingHorizontal: 18,
    backgroundColor: colors.core, borderWidth: 1, borderColor: colors.hairline, borderTopColor: colors.highlight,
  },
  input: { flex: 1, minHeight: 54, color: colors.text, fontSize: 17, fontFamily: fonts.bold },
  inputShort: { minHeight: 44 },
  teamDot: { width: 10, height: 10, borderRadius: 5 },
  boardHead: { justifyContent: 'space-between', alignItems: 'center' },
  board: { gap: space.sm },
  status: { alignItems: 'center', gap: 10, minHeight: 40 },
  turn: { maxWidth: '45%', alignItems: 'center', gap: space.sm, borderWidth: 1, borderRadius: radius.full, paddingVertical: 5, paddingHorizontal: space.md },
  turnText: { flexShrink: 1 },
  timer: { flex: 1 },
  answers: { gap: 10 },
  answersShort: { gap: space.sm },
  helpers: { flexWrap: 'wrap', gap: space.sm },
  footer: { marginTop: 'auto' },
  footerWide: { marginTop: space.md },
  fillCentered: { justifyContent: 'center' },
  feedback: { minHeight: 40, fontFamily: fonts.black, textAlign: 'center', textAlignVertical: 'center' },
  num: { fontVariant: ['tabular-nums'] },
  gapTop: { marginTop: 6 },
});
