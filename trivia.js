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
// within a game. Questions in `seen` (asked in earlier games) are used only once no unseen one is left.
// pools: { easy: [apiQuestion], medium: [...], hard: [...] }
export function fillCategory(builtIn, pools, plan, seen = new Set()) {
  const used = new Set();
  return builtIn.map((slot) => {
    for (const fresh of [true, false]) {
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
  const timer = setTimeout(() => ctrl.abort(), 8000);
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
export async function loadQuestions(age, builtIn, categories, seen) {
  const plan = DIFFICULTY[age];
  const needed = [...new Set(Object.values(plan))];
  const decks = await Promise.all(
    categories.map(async (c) => {
      const pools = await fetchPools(TAGS[c.id], needed, age === 'kids');
      return fillCategory(builtIn.filter((x) => x.category === c.id), pools, plan, seen);
    }),
  );
  const deck = decks.flat();
  if (!deck.some((x) => x.id)) throw new LoadError('empty');
  return deck;
}
