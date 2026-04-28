// Visit counter — Vercel KV (Redis) backed.
// GET /api/visits          → returns current count (no increment)
// GET /api/visits?inc=1    → atomically increments and returns new count
//
// Setup required in Vercel dashboard:
// 1. Storage → Create Database → KV (Upstash Redis)
// 2. Connect to project — auto-injects KV_REST_API_URL + KV_REST_API_TOKEN
// 3. Redeploy

import { kv } from '@vercel/kv';

export const runtime = 'edge';
export const dynamic = 'force-dynamic';
export const revalidate = 0;

const COUNTER_KEY = 'chernobyl:visits';
const SEED_FLAG = 'chernobyl:seeded';
const SEED_VALUE = 100; // baseline visits before KV migration

async function ensureSeed(): Promise<void> {
  // Only seed once: check flag
  const seeded = await kv.get(SEED_FLAG);
  if (seeded) return;

  // Set initial value if counter doesn't exist or is below seed
  const current = (await kv.get<number>(COUNTER_KEY)) || 0;
  if (current < SEED_VALUE) {
    await kv.set(COUNTER_KEY, SEED_VALUE);
  }
  await kv.set(SEED_FLAG, '1');
}

export async function GET(request: Request) {
  const url = new URL(request.url);
  const increment = url.searchParams.get('inc') === '1';

  const headers = {
    'Content-Type': 'application/json',
    'Cache-Control': 'no-store, max-age=0',
  };

  try {
    // Check KV is configured
    if (!process.env.KV_REST_API_URL || !process.env.KV_REST_API_TOKEN) {
      return new Response(
        JSON.stringify({
          count: null,
          ok: false,
          error: 'Vercel KV not configured. Add KV storage in Vercel dashboard.',
        }),
        { status: 200, headers }
      );
    }

    // One-time seed
    await ensureSeed();

    let count: number;
    if (increment) {
      // Atomic increment — Redis INCR is bulletproof against races
      count = await kv.incr(COUNTER_KEY);
    } else {
      count = (await kv.get<number>(COUNTER_KEY)) || SEED_VALUE;
    }

    return new Response(
      JSON.stringify({ count, ok: true, source: 'vercel-kv' }),
      { status: 200, headers }
    );
  } catch (err: any) {
    console.error('KV error:', err?.message || err);
    return new Response(
      JSON.stringify({
        count: null,
        ok: false,
        error: 'Counter service error',
        detail: err?.message,
      }),
      { status: 200, headers }
    );
  }
}
