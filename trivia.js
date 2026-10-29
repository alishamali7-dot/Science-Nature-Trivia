// Questions from The Trivia API (https://the-trivia-api.com), English only.
// Each board category maps to the API's topic tags; each points value maps to a difficulty.
// Any slot the API can't fill (or no internet) falls back to the built-in question for that slot.

const API = 'https://the-trivia-api.com/v2/questions';

export const TAGS = {
  space: 'space,astronomy,planets,astrophysics,space_exploration',
  animals: 'animals',
  plants: 'plants,botany,trees,flowers,gardening,herbs',
  body: 'anatomy,the_human_body,disease,diseases',
  earth: 'geology,chemistry,chemical_elements,elements,earthquakes,weather,earth',
  oceans: 'oceans,seas,marine_life,seafaring,pacific_ocean,bodies_of_water', // ocean tags alone hold ~22 questions
};

// Kids get easy and normal only; adults go up to hard.
export const DIFFICULTY = {
  kids: { 200: 'easy', 400: 'medium', 600: 'medium' },
  adults: { 200: 'easy', 400: 'medium', 600: 'hard' },
};

// When a difficulty runs short, borrow from the nearest one.
const NEAR = { easy: ['easy', 'medium', 'hard'], medium: ['medium', 'easy', 'hard'], hard: ['hard', 'medium', 'easy'] };

const text = (s) => ({ ar: s, en: s });
const toQuestion = (x, category, points) => ({
  id: x.id,
  category,
  points,
  question: text(x.question.text),
  correct: text(x.correctAnswer),
  wrong: x.incorrectAnswers.slice(0, 3).map(text),
});

// Fills one category's slots (in the order of `builtIn`) from pools by difficulty, never repeating a question
// within a game. Questions in `seen` (asked in earlier games) are used only once no unseen one is left,
// or never with reuseSeen false (Arabic games have the AI write a new one instead).
// pools: { easy: [apiQuestion], medium: [...], hard: [...] }
export function fillCategory(builtIn, pools, plan, seen = new Set(), reuseSeen = true) {
  const used = new Set();
  return builtIn.map((slot) => {
    for (const fresh of reuseSeen ? [true, false] : [true]) {
      for (const d of NEAR[plan[slot.points]]) {
        const x = (pools[d] || []).find(
          (p) => !used.has(p.id) && (!fresh || !seen.has(p.id)) && p.incorrectAnswers.length >= 3,
        );
        if (x) {
          used.add(x.id);
          return toQuestion(x, slot.category, slot.points);
        }
      }
    }
    return slot;
  });
}

// Why a load failed, for the screen to explain: 'rate' (too many requests; `wait` seconds until the
// API takes more), 'network' (no internet or the server failed), 'empty' (the API had no questions).
export class LoadError extends Error {
  constructor(kind, wait = 0) {
    super(kind);
    this.kind = kind;
    this.wait = wait;
  }
}

// One request per category (the API allows 20 requests per 5 seconds), grouped by difficulty here.
async function fetchPools(tags, difficulties, kids) {
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), 12000);
  let res;
  try {
    res = await fetch(`${API}?limit=50&types=text_choice&tags=${tags}&difficulties=${difficulties.join(',')}`, { signal: ctrl.signal });
  } catch {
    throw new LoadError('network');
  } finally {
    clearTimeout(timer);
  }
  if (res.status === 429) {
    const wait = Number(res.headers.get('ratelimit-reset') || res.headers.get('retry-after'));
    throw new LoadError('rate', wait > 0 ? wait : 5);
  }
  if (!res.ok) throw new LoadError('network');
  // Niche questions are too obscure for children.
  const list = (await res.json()).filter((x) => !(kids && x.isNiche));
  return Object.fromEntries(difficulties.map((d) => [d, list.filter((x) => x.difficulty === d)]));
}

// A fresh deck in the same shape and order as `builtIn` (the built-in list for this age group).
// Throws a LoadError when the API can't be reached or has no questions at all; a category that only
// runs short borrows, then falls back to its built-in question.
export async function loadQuestions(age, builtIn, categories, seen, reuseSeen = true) {
  const plan = DIFFICULTY[age];
  const needed = [...new Set(Object.values(plan))];
  const decks = await Promise.all(
    categories.map(async (c) => {
      const pools = await fetchPools(TAGS[c.id], needed, age === 'kids');
      return fillCategory(builtIn.filter((x) => x.category === c.id), pools, plan, seen, reuseSeen);
    }),
  );
  const deck = decks.flat();
  if (reuseSeen && !deck.some((x) => x.id)) throw new LoadError('empty');
  return deck;
}

// ——— Arabic games ———
// The website's /api/arabic route (it holds the OpenRouter key) has a free AI model adapt each English
// question into Arabic like a teacher would, and write a brand-new question for any slot the trivia API
// has no unseen question left for. AI-written questions get ids "ai:<category>:<text>" so the same
// no-repeat memory covers them, and their texts are sent back as "avoid" so they aren't written twice.
export const ARABIC_API = 'https://science-challenge-psi.vercel.app/api/arabic';

const BATCHES = [['space', 'animals'], ['plants', 'body'], ['earth', 'oceans']]; // 3 AI requests per game, run together

async function askArabic(body, endpoint) {
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), 90000); // free models can take ~30 s
  let res;
  try {
    res = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
      signal: ctrl.signal,
    });
  } catch {
    throw new LoadError('network');
  } finally {
    clearTimeout(timer);
  }
  if (res.status === 429) throw new LoadError('rate', Number(res.headers.get('retry-after')) || 20);
  if (!res.ok) throw new LoadError('network');
  return (await res.json()).items || {};
}

// Turns a slot plus the AI's reply into a game question; null when the AI skipped or garbled it.
export function arabicSlot(slot, item, reply) {
  if (!reply) return null;
  const en = (s, fallback) => ({ ar: s, en: fallback ?? s });
  if (item.mode === 'translate') {
    return {
      id: slot.id,
      category: slot.category,
      points: slot.points,
      question: en(reply.question, slot.question.en),
      correct: en(reply.correct, slot.correct.en),
      wrong: reply.wrong.map((w, i) => en(w, slot.wrong[i].en)),
    };
  }
  return {
    id: `ai:${slot.category}:${reply.question}`,
    category: slot.category,
    points: slot.points,
    question: en(reply.question),
    correct: en(reply.correct),
    wrong: reply.wrong.map((w) => en(w)),
  };
}

// The request items for one game deck: translate every API question, write one for every empty slot.
export function arabicItems(deck, age, categories) {
  const plan = DIFFICULTY[age];
  return deck.map((slot, i) => (slot.id
    ? { id: `q${i}`, mode: 'translate', question: slot.question.en, correct: slot.correct.en, wrong: slot.wrong.map((w) => w.en) }
    : { id: `q${i}`, mode: 'write', category: categories.find((c) => c.id === slot.category).name.en, difficulty: plan[slot.points] }));
}

// An Arabic deck in the same shape and order as `builtIn`. Slots the AI skips keep their built-in
// Arabic question. Throws a LoadError only when no AI request worked at all.
export async function loadArabic(age, builtIn, categories, seen, endpoint = ARABIC_API) {
  const deck = await loadQuestions(age, builtIn, categories, seen, false);
  const items = arabicItems(deck, age, categories);
  const avoidFor = (ids) => [...seen]
    .filter((s) => s.startsWith('ai:') && ids.some((c) => s.startsWith(`ai:${c}:`)))
    .slice(-60)
    .map((s) => s.slice(s.indexOf(':', 3) + 1));

  const results = await Promise.allSettled(BATCHES.map((ids) => {
    const mine = items.filter((_, i) => ids.includes(deck[i].category));
    return askArabic({ audience: age, items: mine, avoid: avoidFor(ids) }, endpoint);
  }));
  const failed = results.filter((r) => r.status === 'rejected');
  if (failed.length === results.length) throw failed[0].reason;

  const replies = Object.assign({}, ...results.map((r) => (r.status === 'fulfilled' ? r.value : {})));
  return deck.map((slot, i) => arabicSlot(slot, items[i], replies[items[i].id]) || builtIn[i]);
}
