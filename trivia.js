// Questions from The Trivia API (https://the-trivia-api.com), English only.
// Each board category maps to the API's topic tags; each points value maps to a difficulty.
// Any slot the API can't fill (or no internet) falls back to the built-in question for that slot.

const API = 'https://the-trivia-api.com/v2/questions';

export const TAGS = {
  space: 'space,astronomy,planets,astrophysics,space_exploration',
  animals: 'animals',
  plants: 'plants,botany',
  body: 'anatomy,the_human_body,disease,diseases',
  earth: 'geology,chemistry,chemical_elements,elements,earthquakes,weather,earth',
  oceans: 'oceans,seas,marine_life,seafaring',
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
  category,
  points,
  question: text(x.question.text),
  correct: text(x.correctAnswer),
  wrong: x.incorrectAnswers.slice(0, 3).map(text),
});

// Fills one category's slots (in the order of `builtIn`) from pools by difficulty, never repeating a question.
// pools: { easy: [apiQuestion], medium: [...], hard: [...] }
export function fillCategory(builtIn, pools, plan) {
  const used = new Set();
  return builtIn.map((slot) => {
    for (const d of NEAR[plan[slot.points]]) {
      const x = (pools[d] || []).find((p) => !used.has(p.id) && p.incorrectAnswers.length >= 3);
      if (x) {
        used.add(x.id);
        return toQuestion(x, slot.category, slot.points);
      }
    }
    return slot;
  });
}

// One request per category (the API allows 20 requests per 5 seconds), grouped by difficulty here.
async function fetchPools(tags, difficulties, kids) {
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), 8000);
  try {
    const res = await fetch(`${API}?limit=50&types=text_choice&tags=${tags}&difficulties=${difficulties.join(',')}`, { signal: ctrl.signal });
    if (!res.ok) return {};
    // Niche questions are too obscure for children.
    const list = (await res.json()).filter((x) => !(kids && x.isNiche));
    return Object.fromEntries(difficulties.map((d) => [d, list.filter((x) => x.difficulty === d)]));
  } catch {
    return {};
  } finally {
    clearTimeout(timer);
  }
}

// A fresh deck in the same shape and order as `builtIn` (the built-in list for this age group).
export async function loadQuestions(age, builtIn, categories) {
  const plan = DIFFICULTY[age];
  const needed = [...new Set(Object.values(plan))];
  const decks = await Promise.all(
    categories.map(async (c) => {
      const pools = await fetchPools(TAGS[c.id], needed, age === 'kids');
      return fillCategory(builtIn.filter((x) => x.category === c.id), pools, plan);
    }),
  );
  return decks.flat();
}
