import { corsHeaders } from 'npm:@supabase/supabase-js@2/cors';

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders });
  const keyName = Deno.env.get('NOSIAM_API_KEY_NAME')!;
  const keyValue = Deno.env.get('NOSIAM_API_KEY_VALUE')!;
  const url = 'https://www.luxury-perfumes.net/wp-json/nosiam/v1/catalog?type=simple&limit=5&page=1';
  const r = await fetch(url, { headers: { [keyName]: keyValue } });
  const j = await r.json();
  const slim = (j.products || []).map((p: any) => ({
    id: p.id, name: p.name, price: p.price, sku: p.sku, type: p.type,
    stock: p.stock_status, purchasable: p.purchasable, permalink: p.permalink,
  }));
  return new Response(JSON.stringify({ total: j.pagination?.total_product, sample: slim }, null, 2), {
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });
});
