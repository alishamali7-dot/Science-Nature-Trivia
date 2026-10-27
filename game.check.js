// Quick self-check for the game rules. Run: node game.check.js
import assert from 'node:assert/strict';
import { answersOf, fiftyFifty, pointsFor, winnerOf } from './game.js';

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

assert.equal(pointsFor(q, true, false), 400);
assert.equal(pointsFor(q, true, true), 800);
assert.equal(pointsFor(q, false, true), 0);

assert.equal(winnerOf([600, 200]), 0);
assert.equal(winnerOf([200, 800]), 1);
assert.equal(winnerOf([400, 400]), -1);
assert.equal(winnerOf([0]), 0);

console.log('game rules OK');
