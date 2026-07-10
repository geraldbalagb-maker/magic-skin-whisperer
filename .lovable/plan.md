# Piano correzioni feedback Cristiana

Quattro interventi mirati sui punti segnalati. Nessuna revisione strutturale delle pagine.

## 1. Testo inestetismi nel quiz (step "Come vorresti vedere la tua pelle?")

File: `src/components/BeautyQuiz.tsx`

Riscrivere le 4 opzioni con copy più chiaro e brand-consistent:
- "Più distesa" → **"Più distesa e rilassata"**
- "Senza macchie" → **"Meno macchie e discromie"**
- "Luminosa" → **"Più luminosa e uniforme"**
- "Senza pori dilatati" → **"Pori meno visibili"**

Aggiungere anche due opzioni mancanti tra gli inestetismi ricorrenti:
- **"Meno rossori"**
- **"Grana più fine"**

(La label "Senza infrazioni" vista nello screenshot è l'auto-traduzione di Safari attivata sull'iPhone — nel codice l'originale è "Senza macchie". Riscrivendo le stringhe la traduzione automatica non altererà più il senso.)

## 2. Analisi AI del viso in prima persona

File: `supabase/functions/analyze-selfie/index.ts`

Il tono attuale è troppo poetico/generico ("appare un po' più delicata", "grana piuttosto fine", "piena luminosità e vitalità"). Riscriviamo il system prompt così:

- Sempre in prima persona, ma **più concreto e osservazionale**.
- Aggancio a **elementi visibili specifici** (rossori localizzati su guance/naso, pori sulla zona T, macchie/discromie, occhiaie, texture, secchezza, lucidità della zona T) — l'AI deve nominare 2-3 osservazioni concrete, non frasi vaghe.
- Vietare aggettivi troppo lirici ("piena luminosità e vitalità", "dolcezza", "delicata del solito", "un po' più… del solito").
- Vietare comparativi non verificabili ("più del solito", "a volte sento mancare").
- Mantenere 3-5 frasi, prima persona, chiusura con desiderio propositivo — ma il desiderio deve essere collegato agli inestetismi osservati.

Aggiungere anche esempi in-prompt di output "buono" vs "scartato" per ancorare lo stile.

## 3. Prima/Dopo — enhancement più visibile ma realistico

File: `supabase/functions/enhance-selfie/index.ts`

Il prompt attuale forza un effetto "barely noticeable" e vieta esplicitamente qualunque cambio su rossori/texture oltre ~20%. Da qui l'impressione che sia solo un aumento di luminosità.

Modifiche al prompt:
- Alzare l'intensità dell'intervento su **inestetismi mirati** (rossori diffusi, macchie, piccole imperfezioni, texture irregolare, leggere occhiaie) — target ~40-50% di riduzione anziché ~20%, senza però toccare identità/lineamenti/nei/lentiggini.
- Mantenere il divieto esplicito su: brightening globale, glow, effetto porcellana, ringiovanimento, modifica dei tratti, cambio esposizione/bilanciamento bianco.
- Aggiungere una regola positiva: "il 'dopo' deve mostrare una pelle **visibilmente più uniforme** rispetto al 'prima', non solo più luminosa. La differenza deve essere riconoscibile senza confronto affiancato, restando fotorealistica."
- Rimuovere la clausola "if in doubt, do LESS" (attualmente spinge il modello verso il no-op) e sostituirla con "if in doubt, prioritize evenness of skin tone over global brightness".

## 4. Prodotto errato nel catalogo

File: `src/data/products.ts` + `supabase/functions/analyze-skin/index.ts`

Il prodotto id `10` — *"Crema Anti Age SPF50" — Rigenera 0.8 — 52,00 €* non è un prodotto Maison 22 Esthétique valido secondo Cristiana.

Azione:
- **Rimuoverlo** da `src/data/products.ts` (import immagine incluso) e dalla KB in `supabase/functions/analyze-skin/index.ts`.
- Rimuovere anche eventuali riferimenti al suo id in altri file (`rg "'10'"` sul repo per sicurezza).
- Nella chat, chiedere a Cristiana di confermare se altri prodotti tra i 30 in catalogo vanno rimossi o corretti (nome/prezzo/link), così facciamo una passata unica.

## Note tecniche

- Nessuna modifica al DB, nessuna migrazione.
- Edge Functions redeployate automaticamente al salvataggio dei file.
- Il fix del prodotto è retro-compatibile: se un'analisi precedente ne aveva salvato l'id, verrà semplicemente ignorato dal `productsMap.get(id)` filter già presente in `ResultsPage.tsx`.
