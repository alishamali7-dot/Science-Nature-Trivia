import { AiError, writeCategory } from '../../../lib/translate.mjs';

// POST /api/category — a player's own category: the game sends the topic they typed, and a free OpenRouter
// model writes 6 questions on it (2 each at 200 / 400 / 600), plus spares in case some fail the quality filter. The key stays on the server (OPENROUTER_API_KEY).

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

const DIFFICULTIES = ['easy', 'medium', 'hard'];

export async function POST(request) {
  const key = process.env.OPENROUTER_API_KEY;
  if (!key) return reply({ error: 'not_configured' }, 503);

  let body;
  try {
    body = await request.json();
  } catch {
    return reply({ error: 'bad_request' }, 400);
  }
  const { topic, lang, audience, items } = body || {};
  const ok = typeof topic === 'string' && topic.trim().length >= 2 && topic.length <= 40
    && ['ar', 'en'].includes(lang) && ['kids', 'adults'].includes(audience)
    && Array.isArray(items) && items.length >= 6 && items.length <= 8 // 6 slots + up to 2 spares
    && items.every((x) => x && typeof x.id === 'string' && x.id.length <= 20 && DIFFICULTIES.includes(x.difficulty));
  if (!ok) return reply({ error: 'bad_request' }, 400);

  try {
    return reply(await writeCategory({ topic: topic.trim(), lang, audience, items }, key));
  } catch (e) {
    if (e instanceof AiError && e.kind === 'rate') return reply({ error: 'rate' }, 429, { 'Retry-After': '20' });
    return reply({ error: 'failed' }, 502);
  }
}
