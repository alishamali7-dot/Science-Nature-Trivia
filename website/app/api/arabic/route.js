import { AiError, arabicQuestions } from '../../../lib/translate.mjs';

// POST /api/arabic — the game sends English questions to adapt and empty slots to fill; the OpenRouter
// key stays here on the server (Vercel env OPENROUTER_API_KEY) and never ships in the app.
// ponytail: no per-player rate limit; anyone who finds this URL can spend the key's daily free requests.
// Add Vercel KV/Upstash rate limiting if that happens.

export const maxDuration = 60;

const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};
const reply = (body, status = 200, headers = {}) => Response.json(body, { status, headers: { ...CORS, ...headers } });

export function OPTIONS() {
  return new Response(null, { status: 204, headers: CORS });
}

const short = (s, max = 300) => typeof s === 'string' && s.trim().length > 0 && s.length <= max;
const DIFFICULTIES = ['easy', 'medium', 'hard'];

// Only accept what the game itself sends, so the endpoint can't be used as a general free chatbot.
function validItem(x) {
  if (!x || !short(x.id, 80)) return false;
  if (x.mode === 'translate') return short(x.question) && short(x.correct, 120) && Array.isArray(x.wrong) && x.wrong.length === 3 && x.wrong.every((w) => short(w, 120));
  if (x.mode === 'write') return short(x.category, 40) && DIFFICULTIES.includes(x.difficulty);
  return false;
}

export async function POST(request) {
  const key = process.env.OPENROUTER_API_KEY;
  if (!key) return reply({ error: 'not_configured' }, 503);

  let body;
  try {
    body = await request.json();
  } catch {
    return reply({ error: 'bad_request' }, 400);
  }
  const { items, audience, avoid = [] } = body || {};
  const ok = Array.isArray(items) && items.length >= 1 && items.length <= 14 && items.every(validItem)
    && ['kids', 'adults'].includes(audience)
    && Array.isArray(avoid) && avoid.length <= 120 && avoid.every((a) => short(a, 200));
  if (!ok) return reply({ error: 'bad_request' }, 400);

  try {
    const result = await arabicQuestions({ items, audience, avoid }, key);
    return reply({ items: result });
  } catch (e) {
    if (e instanceof AiError && e.kind === 'rate') return reply({ error: 'rate' }, 429, { 'Retry-After': '20' });
    return reply({ error: 'failed' }, 502);
  }
}
