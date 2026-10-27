// Quick self-check for the game rules and the question bank. Run: node game.check.js
import assert from 'node:assert/strict';
import { answersOf, fiftyFifty, scoreAnswer, winnerOf } from './game.js';
import { CATEGORIES, QUESTIONS } from './questions.js';
import { DIFFICULTY, fillCategory, loadQuestions } from './trivia.js';

const q = {
  points: 400,
  question: { en: 'Which organ pumps blood?' },
  correct: { en: 'Heart' },
  wrong: [{ en: 'Lungs' }, { en: 'Stomach' }, { en: 'Brain' }],
};

const answers = answersOf(q);
assert.equal(answers.length, 4);
assert.ok(answers.includes(q.correct));

const hidden = fiftyFifty(q, () => 0);
assert.equal(hidden.length, 2);
assert.ok(!hidden.includes(q.correct));

assert.deepEqual(scoreAnswer([0, 0], 0, q, true), [400, 0]);
assert.deepEqual(scoreAnswer([0, 600], 0, q, true, true), [400, 200]);
assert.deepEqual(scoreAnswer([0, 200], 0, q, true, true), [400, 0]);
assert.deepEqual(scoreAnswer([0, 600], 0, q, false, true), [0, 600]);

assert.equal(winnerOf([600, 200]), 0);
assert.equal(winnerOf([200, 800]), 1);
assert.equal(winnerOf([400, 400]), -1);
assert.equal(winnerOf([0]), 0);

// Like سين جيم: every category has 6 questions, two each of 200 / 400 / 600.
for (const [age, list] of Object.entries(QUESTIONS)) {
  for (const c of CATEGORIES) {
    const pts = list.filter((x) => x.category === c.id).map((x) => x.points).sort((a, b) => a - b);
    assert.deepEqual(pts, [200, 200, 400, 400, 600, 600], `${age}/${c.id}`);
  }
  for (const x of list) {
    const labels = [x.correct, ...x.wrong].flatMap((a) => [a.ar, a.en]);
    assert.equal(x.wrong.length, 3, x.question.en);
    assert.equal(new Set([x.correct, ...x.wrong].map((a) => a.en)).size, 4, x.question.en);
    assert.ok(labels.every(Boolean) && x.question.ar && x.question.en, x.question.en);
  }
}

// API questions fill the slots by difficulty, borrow from the nearest one, and fall back to built-in.
const api = (id, d) => ({ id, difficulty: d, question: { text: id }, correctAnswer: 'a', incorrectAnswers: ['b', 'c', 'd'] });
const builtIn = QUESTIONS.kids.filter((x) => x.category === 'oceans');
const filled = fillCategory(builtIn, { easy: [], medium: [api('m1'), api('m2'), api('m3')] }, DIFFICULTY.kids);
assert.deepEqual(filled.map((x) => x.points), [200, 200, 400, 400, 600, 600]);
assert.deepEqual(filled.map((x) => x.question.en).slice(0, 3), ['m1', 'm2', 'm3']); // no easy: borrowed from medium
assert.deepEqual(filled.slice(3), builtIn.slice(3)); // pools ran dry: built-in questions
assert.equal(new Set(filled.map((x) => x.question.en)).size, 6);
// Questions asked in earlier games come last: unseen ones first, seen ones only when nothing else is left.
const again = fillCategory(builtIn, { easy: [], medium: [api('m1'), api('m2'), api('m3'), api('m4')] }, DIFFICULTY.kids, new Set(['m1', 'm2']));
assert.deepEqual(again.map((x) => x.question.en).slice(0, 4), ['m3', 'm4', 'm1', 'm2']);

// Loading problems come back as a LoadError the screen can explain.
const fail = async (respond) => {
  globalThis.fetch = respond;
  try {
    await loadQuestions('kids', QUESTIONS.kids, CATEGORIES, new Set());
    return null;
  } catch (e) {
    return e;
  }
};
const reply = (status, body = [], headers = {}) => async () => ({
  status, ok: status === 200, json: async () => body, headers: { get: (k) => headers[k] ?? null },
});
let err = await fail(reply(429, [], { 'ratelimit-reset': '4' }));
assert.equal(err.kind, 'rate');
assert.equal(err.wait, 4);
assert.equal((await fail(reply(429))).wait, 5); // no header: wait 5 seconds
assert.equal((await fail(reply(500))).kind, 'network');
assert.equal((await fail(async () => { throw new TypeError('offline'); })).kind, 'network');
assert.equal((await fail(reply(200, []))).kind, 'empty');
assert.equal(await fail(reply(200, [api('x1', 'easy'), api('x2', 'medium')])), null); // some questions: plays

console.log('game rules and question bank OK');
