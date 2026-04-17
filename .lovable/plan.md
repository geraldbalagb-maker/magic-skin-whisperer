## Obiettivo

Allineare font, UI e identità visiva di tutta l'app al brand **Maison 22 Esthétique / Luxury Perfumes**: sans-serif geometrico, completamente squadrato (zero rounded), nero/bianco/oro con accenti decisi, niente emoji né pattern decorativi.

## Punti del review da risolvere

**Hero / Header**

- Font della headline non coerente → adottare gerarchia tipografica del sito (sans condensato, peso bold, uppercase, tracking ampio sui titoli/eyebrow)
- Rimuovere "BEAUTY ROUTINE AI" dal centro header (già fatto, verificare)
- Hero image troppo "glittery/dorata" → sostituire con foto modella naturale, pelle pulita, sfondo neutro, stile editoriale (come le card "Detersione/Sieri" del sito)
- Eyebrow "in 1 minuto" da rendere più sobrio (oro→nero), stessa enfasi grafica del sito originale

**Sezione "Tre semplici passi"**

- Il titolo deve essere più alto/marcato (uppercase, tracking, bold) come "ACQUISTA 2 / IN OMAGGIO 1"
- Le immagini step vanno bene ma servono cornici squadrate, full-bleed, senza bordi soft
- Numerazione "01/02/03" più decisa: nero pieno grande, non oro chiaro al 20%

**TrustBar**

- Icone monocrome nere (non oro), allineate al sito, con label uppercase tracking ampio

**CTA Banner "Pronta a scoprire la tua routine?"**

- Sezione attualmente debole → renderla "più decisa, alta, marcata come ME"
- Sfondo bianco (o cream) con titolo XL bold uppercase nero
- Bottone nero pieno (non outline oro su nero), come gli "ISCRIVIMI" del sito
- Più padding verticale, headline più grande

**Quiz (BeautyQuiz)**

- Rimuovere TUTTI gli arrotondamenti residui (input, bottoni, chip, card, indicator step)
- Sostituire emoji nei titoli ("📸 🌸 💫 ✨ 🤫") con grafica/icona neutra o niente
- Sostituire icona Sparkles del bottone "Migliora con AI" con etichetta testuale o icona monocroma
- Font: titoli step più grandi/bold uppercase, sottotitoli più sobri (no italic, no tracking decorativo)
- Bottone CTA quiz: nero pieno (come sito), non oro
- Numero step (1,2,3..) diventa testo "STEP 01/05" in stile editoriale, niente cerchio bordato cream
- Verificare che lo sfondo cream + il logo non creino il "pattern di rose" denunciato (al momento il file non lo contiene già ma confermare nessuna immagine decorativa)

**Coerenza globale**

- Estendere gli stessi tweak a `ResultsPage`, `ThankYouPage`, `AnalysisScreen` (titoli uppercase bold, bottoni neri pieni, zero rounded, niente emoji nei microtesti)
- `BrandLogo` resta immagine ma assicurare dimensioni coerenti

## Modifiche tecniche

**1. `src/index.css` — design tokens tipografici**

- Aggiungere utility `.h-display` con `font-weight: 800; letter-spacing: -0.01em; text-transform: uppercase` per titoli hero/section
- Aggiungere `.eyebrow` con `text-xs font-bold uppercase tracking-[0.3em]`
- Aggiungere variabile `--brand-black: 0 0% 0%` e bottone `.btn-primary-black` (sfondo nero, testo bianco, uppercase, tracking, no rounded)
- Globale: assicurare `border-radius: 0` su tutti i componenti custom (verificare `tailwind.config` borderRadius override per il quiz/hero/cta)

**2. Hero (`V2Hero.tsx`)**

- Headline in `font-display font-extrabold uppercase tracking-tight` con dimensione maggiore
- Eyebrow "LA TUA ROUTINE" sopra il titolone
- Sostituire bullet `✦` oro con linea "—" nera o icona Check minimale
- Bottone CTA → nero pieno uppercase tracking, niente oro
- Generare nuova hero image AI: modella pelle pulita, sfondo neutro chiaro, no glitter, in linea con foto del sito Maison

**3. `V2HowItWorks.tsx**`

- Titolo sezione: usare classe `.h-display` più grande (text-3xl→text-4xl md:text-5xl)
- Numero step "01/02/03" in nero pieno text-5xl bold (rimuovere `text-primary/20`)
- Card step squadrate con bordo sottile `border-border`
- Ridurre alternanza visivo se necessario, mantenere layout pulito

**4. `V2TrustBar.tsx**`

- Icone in `text-foreground` (nero) non oro
- Label uppercase tracking ampio

**5. `V2CTABanner.tsx**` — restyling completo

- Sfondo: bianco o cream chiaro (non più charcoal scuro)
- Titolo XL bold uppercase nero
- Bottone nero pieno con freccia, stile sito
- Padding verticale aumentato (py-24 md:py-32)

**6. `BeautyQuiz.tsx**` — pulizia profonda

- Rimuovere TUTTE le emoji dai titoli e label
- Sostituire `bg-[hsl(var(--cream))]` cerchio numero step con badge rettangolare "STEP 01 / 05"
- Tutti gli input/bottoni/chip: confermare zero rounded (alcuni hanno ancora classi implicite)
- Bottone CTA principale: nero pieno (no oro)
- Bottone "Migliora con AI": testuale minimale, no oro, icona opzionale
- Selfie step: rimuovere emoji 📸 🤫
- Sostituire `<BrandLogo />` posizionato in alto a sx con logo centrato in alto (più coerente)

**7. `ResultsPage.tsx`, `ThankYouPage.tsx`, `AnalysisScreen.tsx**`

- Pass su titoli (uppercase bold), bottoni (neri), card (squadrate), rimozione emoji
- Mantenere logica funzionale invariata

**8. Asset**

- Generare nuova `src/assets/hero-beauty-v2.jpg` (modella naturale, no oro/glitter, in linea con il brand del sito)

## Risultato atteso

Tutta l'app respira lo stesso linguaggio visivo del sito Luxury Perfumes / Maison 22: pulito, alto, deciso, completamente squadrato, monocromo nero su bianco con piccoli accenti oro (link/hover), tipografia geometrica bold uppercase per i titoli.