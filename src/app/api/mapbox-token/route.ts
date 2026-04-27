// Server-side route that returns the Mapbox token from env vars.
// Reads at RUNTIME (no rebuild needed when env var changes in Vercel).

export const runtime = 'edge';
export const revalidate = 0;

export async function GET() {
  const token =
    process.env.NEXT_PUBLIC_MAPBOX_TOKEN ||
    process.env.MAPBOX_TOKEN ||
    process.env.MAPBOX_ACCESS_TOKEN ||
    '';

  if (!token) {
    return new Response(
      JSON.stringify({
        error: 'No Mapbox token configured on server',
        hint: 'Set NEXT_PUBLIC_MAPBOX_TOKEN or MAPBOX_TOKEN in Vercel env vars',
      }),
      {
        status: 500,
        headers: { 'content-type': 'application/json', 'cache-control': 'no-store' },
      }
    );
  }

  return new Response(JSON.stringify({ token }), {
    headers: { 'content-type': 'application/json', 'cache-control': 'no-store' },
  });
}
