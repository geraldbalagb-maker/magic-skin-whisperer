import { corsHeaders } from 'npm:@supabase/supabase-js@2/cors';

const ENDPOINT = 'https://www.luxury-perfumes.net/wp-json/nosiam/v1/catalog?limit=1&page=1';

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders });

  const keyName = Deno.env.get('NOSIAM_API_KEY_NAME');
  const keyValue = Deno.env.get('NOSIAM_API_KEY_VALUE');
  if (!keyName || !keyValue) {
    return new Response(JSON.stringify({ error: 'missing NOSIAM_API_KEY_NAME or NOSIAM_API_KEY_VALUE' }), {
      status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }

  // Try multiple auth strategies to auto-detect the correct one
  const attempts: Array<{ label: string; url: string; headers: Record<string, string> }> = [
    { label: `header:${keyName}`,      url: ENDPOINT, headers: { [keyName]: keyValue } },
    { label: `header:Authorization Bearer`, url: ENDPOINT, headers: { Authorization: `Bearer ${keyValue}` } },
    { label: `header:X-API-Key`,       url: ENDPOINT, headers: { 'X-API-Key': keyValue } },
    { label: `query:${keyName}`,       url: `${ENDPOINT}&${encodeURIComponent(keyName)}=${encodeURIComponent(keyValue)}`, headers: {} },
    { label: `query:api_key`,          url: `${ENDPOINT}&api_key=${encodeURIComponent(keyValue)}`, headers: {} },
    { label: `header:key+value pair`,  url: ENDPOINT, headers: { 'X-API-Key-Name': keyName, 'X-API-Key-Value': keyValue } },
  ];

  const results: any[] = [];
  for (const a of attempts) {
    try {
      const r = await fetch(a.url, { headers: a.headers });
      const text = await r.text();
      results.push({
        label: a.label,
        status: r.status,
        ok: r.ok,
        contentType: r.headers.get('content-type'),
        bodyPreview: text.slice(0, 4000),
      });
      if (r.ok && text.trim().startsWith('{') || text.trim().startsWith('[')) {
        // stop at first JSON success
        if (r.ok) break;
      }
    } catch (e) {
      results.push({ label: a.label, error: String(e) });
    }
  }

  return new Response(JSON.stringify({ keyName, results }, null, 2), {
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });
});
