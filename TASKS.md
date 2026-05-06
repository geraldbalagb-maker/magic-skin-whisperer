# Beauty Routine AI — Task List Definitiva

Lista master delle modifiche da implementare. Aggiornare lo stato man mano: `[ ]` todo, `[x]` done, `[~]` in progress.

---

## 1. Design & UI (Stile, Colori e Tipografia)

- [ ] **1. Stile bottoni "Maison Esthétique"** — base neutra (preferibilmente nero), variazione solo di colore. Riferimento: bottoni "AGGIUNGI AL CARRELLO" negli screenshot luxury-perfumes.
- [ ] **2. Palette colori** — sostituire la sensazione marrone/amber dominante con il nero come colore predominante e per i bottoni. Mantenere accenti gold solo dove necessario.
- [ ] **3. Tipografia** — sostituire i font attuali su titoli e accenti con il font indicato (verificare in revisione).
- [ ] **4. UI risultati** — rimuovere il "boxettino" nella pagina routine finale, sostituirlo con sfondo/elemento nero più elegante.

## 2. Flusso Immagini (UX & Bug)

- [ ] **5. Bug webcam mobile** — fix accesso webcam da smartphone.
- [ ] **6. Scatta foto vs Carica foto** — separare/chiarire le due azioni (oggi tap fa solo upload).
- [ ] **7. No auto-advance dopo upload** — l'utente non deve essere mandato allo step successivo automaticamente.
- [ ] **8. Visualizzazione foto utente più grande** — meno croppata.
- [ ] **9. Trigger "Vai avanti"** — pulsante esplicito di conferma; tap sulla foto permette di rifare/ricaricare.
- [ ] **10. Riposizionare Prima/Dopo** — spostare la sezione in cima nella pagina dei risultati.

## 3. Logica, AI e Condizioni

- [ ] **11. Routine modulata per tempo** — meno di 10 min = routine essenziale (meno prodotti).
- [ ] **12. Precompilazione AI senza Markdown** — descrizione viso pulita, editabile dall'utente.
- [ ] **13. Auto-selezione prodotti** — tutti i consigliati pre-checked di default; utente deseleziona ciò che non vuole.

## 4. Nuovi Step e Campi del Quiz

- [ ] **14. Step "Come vorresti vedere la tua pelle?"** — opzioni: Più distesa, Senza macchie, Luminosa, Senza pori dilatati.
- [ ] **15. Step "Cosa usi di solito?"** — checkbox multiple (Siero, Detergente, ecc. da elenco prodotti). Opzione "Beauty routine completa" che seleziona tutto.
- [ ] **16. Step "Budget"** — Entro i 50€ / Fino a 100€ / Oltre i 100€.

## 5. Materiali e Richieste Cliente

- [ ] **17. Sostituire foto AI con foto reali** — inserire foto di Valentina Tecchio (cercare su Google).
- [ ] **18. Richiedere immagini proprietarie** — placeholder per immagini reali del cliente.
- [ ] **19. Revisione testi finali** — raccogliere feedback cliente su testi e FAQ.

## 6. Extra / Strategici

- [ ] **20. Foto obbligatoria** — rimuovere lo skip dell'upload foto (oppure A/B test).
- [ ] **21. Valentina nei risultati** — aggiungere foto Valentina nella schermata finale (umanizzare la routine).
- [ ] **22. Offerta/prezzo speciale via funnel** — sconto dedicato a chi compra dal funnel.
- [ ] **23. Rimuovere Header/Footer durante il flusso** — azzerare distrazioni: niente nav durante quiz/analisi/risultati/thankyou.

---

**Riferimenti screenshot:** stile bottoni neri pieni, header minimale, tipografia serif elegante per titoli (Maison 22 / Luxury Perfumes).
