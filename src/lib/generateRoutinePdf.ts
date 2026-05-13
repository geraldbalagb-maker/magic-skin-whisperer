import jsPDF from "jspdf";
import type { AIRoutineResult } from "@/components/AnalysisScreen";
import type { Product } from "@/data/products";

interface GeneratePdfArgs {
  name: string;
  aiResult: AIRoutineResult;
  productsMap: Map<string, Product>;
}

/**
 * Genera il PDF della Beauty Routine seguendo le linee guida del brand:
 * - Solo nero su bianco
 * - Serif (times) per titoli display, sans (helvetica) per body
 * - Layout minimal, generoso whitespace, nessuna sovrapposizione
 */
export function generateRoutinePdf({ name, aiResult, productsMap }: GeneratePdfArgs) {
  const doc = new jsPDF({ unit: "mm", format: "a4" });
  const PAGE_W = 210;
  const PAGE_H = 297;
  const M = 20; // margine
  const CONTENT_W = PAGE_W - M * 2;

  let y = M;

  const ensureSpace = (needed: number) => {
    if (y + needed > PAGE_H - M) {
      doc.addPage();
      y = M;
    }
  };

  const hr = () => {
    doc.setDrawColor(0);
    doc.setLineWidth(0.2);
    doc.line(M, y, PAGE_W - M, y);
    y += 6;
  };

  const eyebrow = (text: string) => {
    ensureSpace(8);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(8);
    doc.setTextColor(0);
    doc.text(text.toUpperCase(), M, y, { charSpace: 1.2 });
    y += 6;
  };

  const heading = (text: string, size = 22) => {
    ensureSpace(size * 0.55);
    doc.setFont("times", "bold");
    doc.setFontSize(size);
    doc.setTextColor(0);
    const lines = doc.splitTextToSize(text, CONTENT_W);
    doc.text(lines, M, y);
    y += lines.length * size * 0.42 + 2;
  };

  const subheading = (text: string) => {
    ensureSpace(10);
    doc.setFont("times", "bold");
    doc.setFontSize(14);
    doc.setTextColor(0);
    const lines = doc.splitTextToSize(text, CONTENT_W);
    doc.text(lines, M, y);
    y += lines.length * 6 + 1;
  };

  const body = (text: string, size = 10) => {
    doc.setFont("helvetica", "normal");
    doc.setFontSize(size);
    doc.setTextColor(40);
    const lines = doc.splitTextToSize(text, CONTENT_W);
    ensureSpace(lines.length * size * 0.45 + 2);
    doc.text(lines, M, y);
    y += lines.length * size * 0.45 + 2;
  };

  // ---------- COVER ----------
  // Logo testuale (nessun asset esterno per evitare problemi)
  doc.setFont("times", "normal");
  doc.setFontSize(11);
  doc.setTextColor(0);
  doc.text("MAISON 22 ESTHÉTIQUE", PAGE_W / 2, y + 4, { align: "center", charSpace: 2 });
  y += 14;
  hr();
  y += 30;

  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.text("LA TUA BEAUTY ROUTINE PERSONALIZZATA", PAGE_W / 2, y, { align: "center", charSpace: 1.8 });
  y += 14;

  doc.setFont("times", "italic");
  doc.setFontSize(34);
  doc.text(`Per ${name}`, PAGE_W / 2, y, { align: "center" });
  y += 16;

  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.setTextColor(80);
  const dateStr = new Date().toLocaleDateString("it-IT", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
  doc.text(dateStr, PAGE_W / 2, y, { align: "center" });
  y += 30;

  // Analisi AI sulla cover
  doc.setDrawColor(0);
  doc.setLineWidth(0.2);
  doc.line(M + 30, y, PAGE_W - M - 30, y);
  y += 8;

  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  doc.setTextColor(0);
  doc.text("ANALISI AI", PAGE_W / 2, y, { align: "center", charSpace: 1.5 });
  y += 8;

  doc.setFont("times", "italic");
  doc.setFontSize(12);
  doc.setTextColor(30);
  const analysisLines = doc.splitTextToSize(aiResult.skin_analysis, CONTENT_W - 20);
  doc.text(analysisLines, PAGE_W / 2, y, { align: "center" });
  y += analysisLines.length * 5.5 + 8;

  doc.line(M + 30, y, PAGE_W - M - 30, y);

  // Footer cover
  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  doc.setTextColor(100);
  doc.text("BEAUTY-ROUTINE.MVPFACTORY.IT", PAGE_W / 2, PAGE_H - 12, { align: "center", charSpace: 1.5 });

  // ---------- ROUTINE ----------
  doc.addPage();
  y = M;

  eyebrow("Capitolo 01");
  heading("Il tuo rituale, passo dopo passo.", 26);
  y += 4;
  body(
    "Ogni step è stato selezionato dall'AI in base al tuo profilo cutaneo, alle tue abitudini e ai tuoi obiettivi. Segui l'ordine indicato per ottenere il massimo risultato.",
    10
  );
  y += 4;
  hr();
  y += 4;

  aiResult.steps.forEach((step) => {
    ensureSpace(40);

    // numero step
    doc.setFont("times", "italic");
    doc.setFontSize(28);
    doc.setTextColor(0);
    const num = String(step.step_order).padStart(2, "0");
    doc.text(num, M, y + 2);

    // titolo step
    doc.setFont("times", "bold");
    doc.setFontSize(16);
    doc.text(step.step_name, M + 18, y);
    y += 6;

    // descrizione
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.setTextColor(60);
    const descLines = doc.splitTextToSize(step.description, CONTENT_W - 18);
    doc.text(descLines, M + 18, y);
    y += descLines.length * 4.6 + 4;

    // prodotti
    const stepProducts = step.product_ids
      .map((id) => productsMap.get(id))
      .filter((p): p is Product => !!p);

    stepProducts.forEach((p) => {
      ensureSpace(14);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(9);
      doc.setTextColor(0);
      doc.text(p.brand.toUpperCase(), M + 18, y, { charSpace: 0.8 });
      y += 4;
      doc.setFont("times", "normal");
      doc.setFontSize(11);
      doc.setTextColor(0);
      const pname = doc.splitTextToSize(p.name, CONTENT_W - 40);
      doc.text(pname, M + 18, y);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(10);
      doc.text(`${p.price.toFixed(2)} €`, PAGE_W - M, y, { align: "right" });
      y += pname.length * 4.5 + 6;
    });

    y += 4;
    doc.setDrawColor(220);
    doc.setLineWidth(0.1);
    doc.line(M, y, PAGE_W - M, y);
    y += 8;
  });

  // ---------- TIPS ----------
  if (aiResult.personalized_tips?.length) {
    doc.addPage();
    y = M;
    eyebrow("Capitolo 02");
    heading("Consigli su misura per te.", 26);
    y += 4;
    hr();
    y += 4;

    aiResult.personalized_tips.forEach((tip) => {
      ensureSpace(20);
      subheading(tip.title);
      body(tip.text, 10);
      y += 4;
    });
  }

  // ---------- CHIUSURA ----------
  doc.addPage();
  y = M + 40;
  doc.setFont("times", "italic");
  doc.setFontSize(20);
  doc.setTextColor(0);
  const closing = doc.splitTextToSize(
    `“La bellezza autentica nasce dalla cura quotidiana, ${name}. Sii costante: la tua pelle ti ringrazierà.”`,
    CONTENT_W - 20
  );
  doc.text(closing, PAGE_W / 2, y, { align: "center" });
  y += closing.length * 8 + 16;

  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.setTextColor(0);
  doc.text("VALENTINA TECCHIO", PAGE_W / 2, y, { align: "center", charSpace: 1.5 });
  y += 5;
  doc.setFontSize(8);
  doc.setTextColor(80);
  doc.text("Founder — Maison 22 Esthétique", PAGE_W / 2, y, { align: "center" });

  // Footer su tutte le pagine
  const total = doc.getNumberOfPages();
  for (let i = 1; i <= total; i++) {
    doc.setPage(i);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(7);
    doc.setTextColor(120);
    if (i > 1) {
      doc.text("MAISON 22 ESTHÉTIQUE", M, PAGE_H - 8, { charSpace: 1.2 });
      doc.text(`${i} / ${total}`, PAGE_W - M, PAGE_H - 8, { align: "right" });
    }
  }

  doc.save(`beauty-routine-${name.toLowerCase().replace(/\s+/g, "-")}.pdf`);
}
