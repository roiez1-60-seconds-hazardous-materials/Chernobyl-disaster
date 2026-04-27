// Visit counter via counterapi.dev (free, no auth required)
// Two endpoints:
//   GET /api/visits           → returns current count (no increment)
//   GET /api/visits?inc=1     → increments and returns new count

export const runtime = 'edge';
export const dynamic = 'force-dynamic';
export const revalidate = 0;

const NAMESPACE = 'chernobyl-60sec';
const KEY = 'visits';

export async function GET(request: Request) {
  const url = new URL(request.url);
  const increment = url.searchParams.get('inc') === '1';

  // Try v1 endpoint
  const v1Up = `https://api.counterapi.dev/v1/${NAMESPACE}/${KEY}/up`;
  const v1Get = `https://api.counterapi.dev/v1/${NAMESPACE}/${KEY}`;

  const headers = { 'Cache-Control': 'no-store, max-age=0' };

  try {
    const endpoint = increment ? v1Up : v1Get;
    const res = await fetch(endpoint, { cache: 'no-store' });
    if (!res.ok) throw new Error(`Counter API ${res.status}`);
    const data = await res.json();
    const count = typeof data?.count === 'number' ? data.count : null;
    return new Response(JSON.stringify({ count, ok: count !== null }), {
      status: 200,
      headers: { ...headers, 'Content-Type': 'application/json' },
    });
  } catch (err) {
    return new Response(JSON.stringify({ count: null, ok: false, error: String(err) }), {
      status: 200, // soft-fail: still 200 so client UI doesn't break
      headers: { ...headers, 'Content-Type': 'application/json' },
    });
  }
}
