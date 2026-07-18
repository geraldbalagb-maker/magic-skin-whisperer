// Genera un URL firmato (HMAC-SHA256) verso il gestore PHP di luxury-perfumes.net
// che popola il carrello WooCommerce con più prodotti e reindirizza al checkout.
//
// Richiesta:  POST { items: [{id: number, qty?: number}], coupon?: string }
// Risposta:   { url: string, expiresAt: number }

import { corsHeaders } from 'npm:@supabase/supabase-js@2/cors';

const STORE_BASE = 'https://www.luxury-perfumes.net';
const HANDLER_PATH = '/m22-cart'; // endpoint pubblico gestito dal plugin PHP (vedi istruzioni IT)
const TTL_SECONDS = 60 * 15; // 15 minuti

function b64url(bytes: Uint8Array): string {
  let s = '';
  for (const b of bytes) s += String.fromCharCode(b);
  return btoa(s).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

async function hmacSha256(secret: string, message: string): Promise<string> {
  const key = await crypto.subtle.importKey(
    'raw',
    new TextEncoder().encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign'],
  );
  const sig = await crypto.subtle.sign('HMAC', key, new TextEncoder().encode(message));
  return b64url(new Uint8Array(sig));
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders });

  try {
    const secret = Deno.env.get('WC_CHECKOUT_HMAC_SECRET');
    if (!secret) {
      return new Response(
        JSON.stringify({ error: 'WC_CHECKOUT_HMAC_SECRET non configurato' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
      );
    }

    const body = await req.json().catch(() => ({}));
    const items: Array<{ id: number | string; qty?: number }> = Array.isArray(body?.items) ? body.items : [];
    const coupon: string | undefined = typeof body?.coupon === 'string' ? body.coupon.trim() : undefined;

    // Validazione: id numerici positivi, qty 1..10
    const clean = items
      .map((it) => ({ id: Number(it.id), qty: Math.min(Math.max(Number(it.qty ?? 1) || 1, 1), 10) }))
      .filter((it) => Number.isInteger(it.id) && it.id > 0);

    if (clean.length === 0 || clean.length > 30) {
      return new Response(
        JSON.stringify({ error: 'items deve contenere 1..30 prodotti validi' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
      );
    }

    // Formato compatto: "id:qty,id:qty,..."
    const itemsStr = clean.map((it) => `${it.id}:${it.qty}`).join(',');
    const exp = Math.floor(Date.now() / 1000) + TTL_SECONDS;
    const nonce = b64url(crypto.getRandomValues(new Uint8Array(12)));

    // Canonical string firmato (ordine fisso, no url-encoding). Il PHP DEVE ricostruirlo identico.
    const params = new URLSearchParams();
    params.set('items', itemsStr);
    params.set('exp', String(exp));
    params.set('nonce', nonce);
    if (coupon) params.set('coupon', coupon);

    const canonical = [
      `items=${itemsStr}`,
      `exp=${exp}`,
      `nonce=${nonce}`,
      coupon ? `coupon=${coupon}` : null,
    ].filter(Boolean).join('&');

    const sig = await hmacSha256(secret, canonical);
    params.set('sig', sig);

    const url = `${STORE_BASE}${HANDLER_PATH}?${params.toString()}`;

    return new Response(JSON.stringify({ url, expiresAt: exp }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (e) {
    console.error('build-checkout-url error', e);
    return new Response(
      JSON.stringify({ error: 'internal_error', details: String(e) }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
    );
  }
});
