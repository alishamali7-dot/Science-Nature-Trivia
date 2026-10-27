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

// Points the current team gets for this answer.
export function pointsFor(q, right, doubled) {
  return right ? q.points * (doubled ? 2 : 1) : 0;
}

// Index of the winning team, or -1 for a tie.
export function winnerOf(scores) {
  const best = Math.max(...scores);
  const top = scores.filter((s) => s === best);
  return top.length > 1 ? -1 : scores.indexOf(best);
}
