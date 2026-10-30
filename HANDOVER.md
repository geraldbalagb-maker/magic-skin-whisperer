# Handover – Maison 22 Beauty Routine

App React + Vite + TypeScript + Tailwind. Backend = Supabase Edge Functions (Deno). **Nessun database**: non esistono tabelle né migrazioni; foto, risposte e routine restano nella sessione del browser. Non c'è nulla da esportare dal database.

## 1. Setup frontend
```bash
npm install        # oppure bun install
cp .env.example .env   # inserire URL e anon key del nuovo progetto Supabase
npm run dev        # http://localhost:8080
npm test           # test vitest (logica budget/routine)
```
Variabili frontend (pubbliche, ok nel browser): `VITE_SUPABASE_URL`, `VITE_SUPABASE_PUBLISHABLE_KEY`, `VITE_SUPABASE_PROJECT_ID`.

Nota: `src/integrations/supabase/client.ts` legge queste variabili; `supabase/config.toml` contiene il `project_id` del vecchio progetto: sostituirlo con il nuovo.

## 2. Setup Supabase (nuovo progetto)
```bash
supabase link --project-ref <NUOVO_REF>
supabase secrets set ME22_ENGINE_URL=... ME22_ENGINE_TOKEN=... WC_CHECKOUT_HMAC_SECRET=... AI_API_KEY=...
supabase functions deploy
```

### Segreti delle funzioni
| Segreto | Uso | Dove ottenerlo |
|---|---|---|
| `ME22_ENGINE_URL` | URL motore ME-22 (`https://me-engine.man-super.com`) | Aureliano |
| `ME22_ENGINE_TOKEN` | Bearer token motore ME-22 | Aureliano |
| `WC_CHECKOUT_HMAC_SECRET` | Firma link carrello WooCommerce (**non ancora generato**) | da concordare con Ivan (deve coincidere col plugin WP) |
| `LOVABLE_API_KEY` | AI Gateway di Lovable – **non funziona fuori da Lovable** | vedi sezione 4 |
| `NOSIAM_API_KEY_NAME` / `_VALUE` | Solo funzione di test `nosiam-probe` (eliminabile) | IT negozio |

I token non devono mai finire nel frontend.

## 3. Funzioni
| Funzione | Ruolo | Stato |
|---|---|---|
| `me22-preview` | Proxy verso ME-22: analisi foto, routine, prodotti, immagini prodotto | **in uso** |
| `enhance-selfie` | Foto "Dopo" (modello immagine Gemini) | **in uso** |
| `build-checkout-url` | Link carrello firmato HMAC (valido 15 min) | in uso, bloccato dal segreto |
| `_shared/me22Budget.ts` | Fasce budget 100/250/350€ → low/medium/high, +15%, sconto bundle 10% (`M22-BUNDLE10`) | condiviso con il client |
| `analyze-skin`, `analyze-selfie`, `map-skin-concerns`, `enhance-text` | Logica precedente / fallback | non essenziali |
| `nosiam-probe` | Test credenziali catalogo | eliminabile |

## 4. AI Gateway (da sostituire)
Le funzioni AI chiamano `https://ai.gateway.lovable.dev/v1/chat/completions` con `LOVABLE_API_KEY`. Fuori da Lovable va sostituito con un provider diretto (API compatibile OpenAI), es. Google Gemini (`https://generativelanguage.googleapis.com/v1beta/openai/chat/completions`) o OpenRouter, cambiando URL, chiave e nome modello (`google/gemini-3-pro-image` in `enhance-selfie`).

## 5. Checkout WooCommerce
Plugin WP `maison22-wc-cart-handler.php` (route `/m22-cart`) da installare sul negozio `www.luxury-perfumes.net`: verifica la firma, riempie il carrello e reindirizza. Ad oggi `/m22-cart` risponde 404. Nessun pagamento testato.

## 6. Punti aperti
- Segreto HMAC + plugin da attivare con Ivan.
- Kit principale ME-22 (budget high) oltre la tolleranza: conferma di Aureliano.
- Conservazione dati lato motore ME-22: da chiarire con Aureliano.

## 7. Dove leggere
`AGENTS.md` (regole architetturali), `TASKS.md` / `roadmap.md` (stato lavori), `src/lib/me22Routine.ts` (adattamento routine), `src/components/AnalysisScreen.tsx` (flusso analisi).
