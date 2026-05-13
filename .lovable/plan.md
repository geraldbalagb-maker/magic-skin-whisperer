## Problema

L'enhancement attuale è affidato a Gemini (`enhance-selfie`), un modello di image-generation che:
- non controlla con precisione l'esposizione → produce sovraesposizione e cambi di luce
- altera i connotati (occhi che cambiano, glow innaturale, sfondo modificato)
- è imprevedibile: ogni run dà un risultato diverso, spesso pessimo
- è lento e costoso (chiamata server, ~10s, gateway 502)

Per un effetto "Instagram beauty" leggero ma visibile servono **algoritmi deterministici di image-processing**, non un modello generativo.

## Approccio scelto: frequency separation + face mask (in-browser)

È la stessa tecnica che usano Instagram, FaceApp, Snapchat (versione "soft"):

```text
foto originale
    │
    ├─► rilevamento volto (468 landmark)
    │       │
    │       └─► maschera pelle = ovale del viso
    │            MENO occhi, sopracciglia, bocca, narici, capelli
    │
    ├─► copia 1: low-frequency  (Gaussian blur forte)  → toni & colori uniformi
    ├─► copia 2: high-frequency (originale − low)      → pori, peli, dettagli
    │
    └─► composito finale:
        skin_mask × ( low + high × 0.65 )    ← pelle ammorbidita ma con texture
        + (1 − skin_mask) × originale         ← occhi/bocca/sfondo INTATTI
```

Risultato: rughe attenuate (~40-50%), tono più uniforme, pori ancora visibili, occhi e bocca nitidissimi, sfondo identico, esposizione identica.

## Stack

- **MediaPipe Tasks Vision** (`@mediapipe/tasks-vision`) — FaceLandmarker, 468 punti, caricato lazy via CDN solo quando serve. Modello ~3MB.
- **Canvas 2D** per la pipeline (blur, mask, blend). Niente WebGL custom: la `canvas2d.filter = "blur(Npx)"` di Chrome/Safari è hardware-accelerata e basta.
- 100% client-side: nessuna edge function, nessuna chiamata di rete dopo il caricamento del modello.

## Modifiche al codice

### 1. Nuovo modulo `src/lib/beautyFilter.ts`
Espone:
```ts
export async function applyBeautyFilter(
  base64Image: string,
  opts?: { strength?: number } // 0..1, default 0.55
): Promise<string>  // ritorna base64 PNG dell'immagine ritoccata
```
Internamente:
1. Carica `FaceLandmarker` (singleton, lazy, da CDN jsDelivr)
2. Decodifica base64 → ImageBitmap
3. Rileva landmark; se nessun volto → ritorna l'immagine originale
4. Costruisce skin mask su un canvas off-screen:
   - poligono `FACE_OVAL` (36 punti) riempito di bianco
   - sottrae con `globalCompositeOperation = "destination-out"` i poligoni di occhi (LEFT_EYE, RIGHT_EYE), sopracciglia, labbra (LIPS), narici
   - applica `feather` (blur ~8px) ai bordi della maschera per transizione naturale
5. Crea `lowFreq` = canvas con `ctx.filter = "blur(6px) saturate(0.97)"` sull'originale
6. Crea `highFreq` = differenza `originale − lowFreq` (via `difference` blend mode + offset 128 trick) — mantenuto al 65%
7. Compone `softened = lowFreq + highFreq × 0.65`
8. Blend finale: `originale × (1 − mask × strength) + softened × (mask × strength)`
9. Ritorna `canvas.toDataURL("image/jpeg", 0.92)`

`strength` default 0.55 = effetto chiaramente visibile ma naturale (riduce ~45% delle rughe e arrossamenti, mantiene texture).

### 2. `src/components/AnalysisScreen.tsx`
- Rimuovo la chiamata a `supabase.functions.invoke('enhance-selfie', …)`
- La sostituisco con `applyBeautyFilter(selfieBase64)`
- Mantiene lo stesso state finale `enhancedSelfie` → nessun cambio nel resto del flow

### 3. Edge function `enhance-selfie`
La marco come deprecata (commento in cima). Non la cancello subito per non rompere eventuali chiamate in cache, ma non viene più invocata.

### 4. Memory
Aggiorno la memoria `mem://tech/ai-selfie-enhancement-prompt` per riflettere il nuovo approccio (algoritmico in-browser, non Gemini).

## Perché funziona meglio del prompt Gemini

| Criterio | Gemini | Frequency separation + mask |
|---|---|---|
| Esposizione invariata | ❌ random | ✅ matematicamente garantita |
| Connotati invariati | ❌ rischio | ✅ mask esclude occhi/bocca |
| Sfondo invariato | ❌ spesso ridipinto | ✅ mask esclude fuori-volto |
| Texture pelle (pori) | ❌ "plastico" | ✅ high-freq preservato |
| Determinismo | ❌ ogni run diverso | ✅ identico ogni volta |
| Costo per richiesta | $$ + latency | 0 (locale) |
| Tempo elaborazione | 8-12s | 0.3-1s |

## File toccati

- `src/lib/beautyFilter.ts` — NEW
- `src/components/AnalysisScreen.tsx` — sostituisce la chiamata edge
- `supabase/functions/enhance-selfie/index.ts` — solo commento di deprecazione
- `mem://tech/ai-selfie-enhancement-prompt` — aggiornamento

## Aspetti tecnici secondari

- **MediaPipe loading**: usato `FilesetResolver.forVisionTasks("https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.x/wasm")` — niente bundling pesante. Modello scaricato una sola volta, cache browser.
- **Fallback se nessun volto rilevato**: ritorno l'originale (UI mostra solo "Prima" senza Dopo).
- **iOS Safari**: `ctx.filter` supportato da Safari 18.0+; per versioni vecchie eseguo blur via downscale+upscale (separable Gaussian fallback).
- **Memory leak**: tutti i canvas off-screen vengono dereferenziati esplicitamente.
