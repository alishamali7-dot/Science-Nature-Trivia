// Pure game rules, kept apart from the screens so they can be checked on their own (game.check.js).

// Fixed answer order for now (shuffling is an Extra level): the right answer lands in a different slot per question.
export function answersOf(q) {
  const all = [...q.wrong];
  all.splice(q.question.en.length % 4, 0, q.correct);
  return all;
}

// 50/50: two of the wrong answers to hide.
export function fiftyFifty(q, random = Math.random) {
  const pool = [...q.wrong];
  pool.splice(Math.floor(random() * pool.length), 1);
  return pool;
}

// New scores after an answer. With the pit (الحفرة), a right answer also takes
// the same points from every other team (never below zero).
export function scoreAnswer(scores, turn, q, right, pit = false) {
  if (!right) return scores;
  return scores.map((s, i) => (i === turn ? s + q.points : pit ? Math.max(0, s - q.points) : s));
}

// Index of the winning team, or -1 for a tie.
export function winnerOf(scores) {
  const best = Math.max(...scores);
  return scores.filter((s) => s === best).length > 1 ? -1 : scores.indexOf(best);
}
