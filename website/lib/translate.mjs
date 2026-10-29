// Arabic questions for the game, from a free OpenRouter model acting as an Arabic teacher.
// Each item either adapts an English trivia question ("translate") or writes a brand-new one ("write")
// when the trivia API has run out of unseen questions. Used by the /api/arabic route.

// Free models are often busy (429), so try them in order until one answers.
// Order picked on 2026-10-29 by comparing them on tricky terms (Acacia, Mother of Pearl, epiglottis).
export const MODELS = [
  'nvidia/nemotron-3.5-super-vl:free',
  'google/gemma-4-31b-it:free',
  'nvidia/nemotron-3-ultra-550b-a55b:free',
  'google/gemma-4-26b-a4b-it:free',
];

const SYSTEM = `You are an experienced Arabic teacher who prepares questions for a family science quiz show.
You receive a JSON list of items. Each item has an "id" and a "mode":

"translate": an English trivia question with its correct and wrong answers. Rewrite it in clear Modern Standard Arabic (الفصحى),
the way a teacher would adapt it for Arab players, not word for word. Keep the meaning and keep the right answer right.
Set "skip": true instead when the question only works in English or only for Americans: wordplay, collective nouns
(like "a parliament of owls"), spelling or letter questions, English idioms, English book/film/brand titles, US-only facts.

"write": write ONE new multiple-choice question in Arabic for the given category and difficulty
(easy = everyday knowledge, medium = school science, hard = a specialist fact). Only use well-established facts
that every science textbook agrees on; never invent numbers. Do not repeat or reword any question in "avoid",
and make every written question in this request about a different fact.

For every item, answer with: question, correct (the right answer), wrong (exactly 3 wrong answers that are believable
but clearly wrong). Rules for all items:
- Arabic punctuation (؟ ، ). Questions end with ؟.
- Common Arabic names for planets, animals, places, scientists and terms (Jupiter = المشتري, Isaac Newton = إسحاق نيوتن).
- Use the established Arabic term for every scientific or everyday term, never a word-by-word calque
  (Mother of Pearl = عرق اللؤلؤ, fool's gold = البايريت, epiglottis = لسان المزمار, larynx = الحنجرة).
  If you don't know the established term for an answer, set "skip": true rather than inventing one.
- A fill-in-the-blank question keeps its blank as ____ and ends without ؟.
- Skip questions whose answer is obvious from the question itself, and anything about alcohol (this is a family game).
- Western digits (1, 2, 3); unit words in Arabic.
- Answers are a word or a short phrase, never a sentence, no final period. All four answers are different.
- Audience "kids": simple words a 9-year-old understands, facts unchanged.
- No explanations. No Latin script unless a name has no Arabic form.

Reply with JSON only, no markdown:
{"items":[{"id":"…","question":"…","correct":"…","wrong":["…","…","…"]} or {"id":"…","skip":true}]}
with one entry per input item and the same ids.`;

export class AiError extends Error {
  constructor(kind) {
    super(kind);
    this.kind = kind; // 'rate' (every model busy) | 'failed'
  }
}

// items: [{ id, mode: 'translate', question, correct, wrong } | { id, mode: 'write', category, difficulty }]
// Returns { [id]: { question, correct, wrong } | null } (null: skipped or malformed).
export async function arabicQuestions({ items, audience, avoid = [] }, key, fetchImpl = fetch) {
  const input = JSON.stringify({ audience, avoid, items });
  let busy = false;
  for (const model of MODELS) {
    try {
      const res = await fetchImpl('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${key}`,
          'Content-Type': 'application/json',
          'HTTP-Referer': 'https://science-challenge-psi.vercel.app',
          'X-Title': 'Science Challenge',
        },
        body: JSON.stringify({
          model,
          temperature: 0.4,
          reasoning: { enabled: false }, // thinking makes free models 3x slower and adds nothing here
          response_format: { type: 'json_object' },
          messages: [{ role: 'system', content: SYSTEM }, { role: 'user', content: input }],
        }),
      });
      if (res.status === 429) {
        busy = true;
        continue;
      }
      if (!res.ok) continue;
      const data = await res.json();
      return parseItems(data.choices?.[0]?.message?.content || '', items);
    } catch {
      // a bad reply or network error: try the next model
    }
  }
  throw new AiError(busy ? 'rate' : 'failed');
}

// Pulls the JSON out of the model's reply and keeps only well-formed answers for ids we sent.
export function parseItems(text, items) {
  const json = text.slice(text.indexOf('{'), text.lastIndexOf('}') + 1);
  const replies = JSON.parse(json).items || [];
  const sent = new Set(items.map((x) => x.id));
  const clean = (s) => (typeof s === 'string' ? s.trim() : '');
  // Free models sometimes slip into another script mid-word ("ال甘草", "الquinine"): drop those items.
  const garbled = (s) => /[Ѐ-ӿ぀-鿿가-힯]/.test(s) || /[؀-ۿ][A-Za-z]|[A-Za-z][؀-ۿ]/.test(s);
  const out = {};
  for (const x of replies) {
    if (!sent.has(x.id)) continue;
    const answers = [clean(x.correct), ...(Array.isArray(x.wrong) ? x.wrong.map(clean) : [])];
    const ok = !x.skip && clean(x.question) && answers.length === 4 && answers.every(Boolean) && new Set(answers).size === 4
      && ![x.question, ...answers].some(garbled);
    out[x.id] = ok ? { question: clean(x.question), correct: answers[0], wrong: answers.slice(1) } : null;
  }
  return out;
}
