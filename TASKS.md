# Beauty Routine AI — Task List Definitiva

Lista master delle modifiche da implementare. Aggiornare lo stato man mano: `[ ]` todo, `[x]` done, `[~]` in progress.

---

## 1. Design & UI (Stile, Colori e Tipografia)

- [x] **1. Stile bottoni "Maison Esthétique"** — base nera (token `--v2-amber` ora 0% 0%), bottoni rettangolari, niente shadow amber.
- [x] **2. Palette colori** — `--primary`, `--accent`, `--cta` portati a nero. Le utility `bg-gradient-gold` / `text-gradient-gold` / `bg-gradient-cta` ora rendono in nero (cascata su tutta l'app).
- [x] **3. Tipografia** — display font sostituito con **Cormorant Garamond** (serif elegante stile Luxury Perfumes); body resta Karla. Esposto `font-display` / `font-serif` in Tailwind.
- [x] **4. UI risultati** — Rimosso il "boxettino" (rounded-3xl + bordo gold) attorno a step image: ora pannello nero pieno con badge bianco. Card prodotto: rettangolare, niente gradient gold sul check, accent foreground.

## 2. Flusso Immagini (UX & Bug)

- [x] **5. Bug webcam mobile** — input `capture="user"` separato da quello galleria; iOS/Android aprono direttamente la fotocamera.
- [x] **6. Scatta foto vs Carica foto** — due bottoni distinti: "Scatta una foto" (camera) e "Carica dalla galleria" (file picker).
- [x] **7. No auto-advance dopo upload** — la foto si mostra in preview, l'utente decide quando andare avanti.
- [x] **8. Visualizzazione foto utente più grande** — preview a tutta larghezza della card (aspect-square w-full), molto meno croppata.
- [x] **9. Trigger "Vai avanti"** — pulsante esplicito nero sotto la preview; tap sulla foto la rimuove per riscattare/ricaricare.
- [x] **10. Riposizionare Prima/Dopo** — sezione spostata subito sotto l'hero risultati.

## 3. Logica, AI e Condizioni

- [x] **11. Routine modulata per tempo** — ≤10 min = 3 step (Detersione, Idratante, Trattamento mirato); altrimenti 5 step.
- [x] **12. Precompilazione AI senza Markdown** — prompt aggiornato + stripping server-side e client-side di `* _ # > -` e backtick.
- [x] **13. Auto-selezione prodotti** — tutti i prodotti raccomandati pre-selezionati nel carrello; utente deseleziona.

## 4. Nuovi Step e Campi del Quiz

- [x] **14. Step "Come vorresti vedere la tua pelle?"** — multi-select: Più distesa / Senza macchie / Luminosa / Senza pori dilatati.
- [x] **15. Step "Cosa usi di solito?"** — checkbox multiple con bottone "Beauty routine completa" che seleziona tutto.
- [x] **16. Step "Budget"** — Entro i 50€ / Fino a 100€ / Oltre i 100€. Passato all'AI per la selezione prodotti.

## 5. Materiali e Richieste Cliente

- [x] **17. Sostituire foto AI con foto reali** — inserite due foto professionali di Valentina Tecchio (`valentina-portrait.jpg` nei risultati, `valentina-smile.jpg` nel thank you).
- [ ] **18. Richiedere immagini proprietarie** — placeholder per immagini reali del cliente.
- [ ] **19. Revisione testi finali** — raccogliere feedback cliente su testi e FAQ.

## 6. Extra / Strategici

- [x] **20. Foto obbligatoria** — rimosso lo skip, pulsante "Vai avanti" attivo solo con foto + microcopy esplicativo.
- [x] **21. Valentina nei risultati** — aggiunta sezione "La Founder" con ritratto reale nei risultati e foto nel messaggio thank you.
- [x] **22. Offerta/prezzo speciale via funnel** — bundle a -25% (era -20%) con badge "Offerta esclusiva funnel" e copy dedicato.
- [x] **23. Rimuovere Header/Footer durante il flusso** — Quiz, Analisi, Risultati e Thank You ora sono fullscreen senza nav.

---

**Riferimenti screenshot:** stile bottoni neri pieni, header minimale, tipografia serif elegante per titoli (Maison 22 / Luxury Perfumes).

## 7. Motore ME-22
- [x] Collegare assegnazione prodotti ME-22 a risultati, carrello e bundle (mattina/sera/settimanale): ID WooCommerce e prezzi del motore, extra facoltativi, prodotti ripetuti conteggiati una volta. Test reale con foto e 6 test automatici superati.
- [x] Correggere la mappatura “Fino a 100€” su low/low_end (base motore 100€, non 200€); controllo budget sul prezzo della routine completa con lo sconto attuale del 10%, prezzi prodotto originali e arrotondamento ai centesimi condiviso. 10 test superati; quiz reale con foto: 106,80€ → 96,12€, nessun falso sforamento.
- [ ] Supportare il limite rigoroso di 50€ ed eliminare la tolleranza motore del 15% per limiti rigidi: richiede intervento del team ME-22, perché l'API esterna accetta solo low/medium/high e la fascia minima parte da 100€. Gli sforamenti reali non sono nascosti.
- [ ] Verificare checkout WooCommerce: richiede mappatura ID prodotti e conferma installazione del plugin sul sito del negozio.
