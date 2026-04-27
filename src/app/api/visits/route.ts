// Visit counter — tries multiple free counter APIs in sequence.
// GET /api/visits          → returns current count (no increment)
// GET /api/visits?inc=1    → increments and returns new count

export const runtime = 'edge';
export const dynamic = 'force-dynamic';
export const revalidate = 0;

const NAMESPACE = 'chernobyl-60sec';
const KEY = 'visits';

type Endpoint = {
  name: string;
  up: string;
  get: string;
  extract: (d: any) => number | null;
};

const ENDPOINTS: Endpoint[] = [
  // counterapi.dev v2 (newer)
  {
    name: 'counterapi-v2',
    up: `https://api.counterapi.dev/v2/${NAMESPACE}/${KEY}/up`,
    get: `https://api.counterapi.dev/v2/${NAMESPACE}/${KEY}`,
    extract: (d) => (typeof d?.data?.count === 'number' ? d.data.count : null),
  },
  // counterapi.dev v1 (older)
  {
    name: 'counterapi-v1',
    up: `https://api.counterapi.dev/v1/${NAMESPACE}/${KEY}/up`,
    get: `https://api.counterapi.dev/v1/${NAMESPACE}/${KEY}`,
    extract: (d) => (typeof d?.count === 'number' ? d.count : null),
  },
  // abacus.jasoncameron.dev
  {
    name: 'abacus',
    up: `https://abacus.jasoncameron.dev/hit/${NAMESPACE}/${KEY}`,
    get: `https://abacus.jasoncameron.dev/get/${NAMESPACE}/${KEY}`,
    extract: (d) =>
      typeof d?.value === 'number' ? d.value :
      typeof d?.count === 'number' ? d.count : null,
  },
];

async function tryEndpoint(ep: Endpoint, increment: boolean): Promise<{ count: number; source: string } | null> {
  try {
    const url = increment ? ep.up : ep.get;
    const res = await fetch(url, {
      cache: 'no-store',
      signal: AbortSignal.timeout(4500),
    });
    if (!res.ok) return null;
    const data = await res.json().catch(() => null);
    if (!data) return null;
    const count = ep.extract(data);
    if (typeof count === 'number' && count >= 0) {
      return { count, source: ep.name };
    }
    return null;
  } catch {
    return null;
  }
}

export async function GET(request: Request) {
  const url = new URL(request.url);
  const increment = url.searchParams.get('inc') === '1';

  const headers = {
    'Content-Type': 'application/json',
    'Cache-Control': 'no-store, max-age=0',
  };

  // Try each endpoint in order
  const errors: string[] = [];
  for (const ep of ENDPOINTS) {
    const result = await tryEndpoint(ep, increment);
    if (result) {
      return new Response(
        JSON.stringify({ count: result.count, ok: true, source: result.source }),
        { status: 200, headers }
      );
    }
    errors.push(ep.name);
  }

  // All endpoints failed — return graceful error
  return new Response(
    JSON.stringify({
      count: null,
      ok: false,
      tried: errors,
      error: 'All counter services unavailable',
    }),
    { status: 200, headers } // 200 so client UI doesn't break
  );
}
