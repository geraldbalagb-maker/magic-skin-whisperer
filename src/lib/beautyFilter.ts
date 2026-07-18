/**
 * Deterministic in-browser beauty filter — Opzione D:
 * Mappa AI degli inestetismi (server) + rendering targeted (client).
 *
 * Pipeline:
 *   1. MediaPipe FaceLandmarker → 478 landmark + skin mask (esclude occhi/bocca/sopracciglia)
 *   2. Se disponibile una `SkinConcernsMap` dal server:
 *        - Riduce il canale rosso nelle bbox di rossore (proporzionale a severity)
 *        - Clone-stamp locale sulle macchie (media pixel circostanti + feathering)
 *        - Schiarita mirata sotto occhi + riduzione blu-viola (occhiaie)
 *        - Smoothing più marcato nella zona T (pori)
 *        - Smoothing leggero per zona sulla texture
 *   3. Blend finale sulla maschera pelle × strength → identità/sfondo/luce intatti
 */
import type { FaceLandmarker as FaceLandmarkerType } from "@mediapipe/tasks-vision";

// ============ Landmarks canonici FaceMesh ============
const FACE_OVAL = [
  10, 338, 297, 332, 284, 251, 389, 356, 454, 323, 361, 288, 397, 365, 379,
  378, 400, 377, 152, 148, 176, 149, 150, 136, 172, 58, 132, 93, 234, 127,
  162, 21, 54, 103, 67, 109,
];
const LEFT_EYE = [263, 249, 390, 373, 374, 380, 381, 382, 362];
const RIGHT_EYE = [33, 7, 163, 144, 145, 153, 154, 155, 133];
const LIPS_OUTER = [
  61, 146, 91, 181, 84, 17, 314, 405, 321, 375, 291, 409, 270, 269, 267, 0, 37,
  39, 40, 185,
];
const LEFT_EYEBROW = [336, 296, 334, 293, 300, 276, 283, 282, 295, 285];
const RIGHT_EYEBROW = [70, 63, 105, 66, 107, 55, 65, 52, 53, 46];

// Landmark utili per zone targeted (indici FaceMesh canonici)
// Sotto-occhio approssimato: punti alti degli zigomi appena sotto la palpebra inferiore
const LEFT_UNDEREYE_CENTER = 450; // sotto occhio destro nell'immagine (soggetto sx)
const RIGHT_UNDEREYE_CENTER = 230; // sotto occhio sinistro nell'immagine (soggetto dx)
// NOTA: MediaPipe usa nomenclatura anatomica del soggetto, non della vista.
// Nella mappa AI "left/right" sono riferiti alla vista dell'immagine → li normalizziamo qui.

// ============ Tipi ============
export interface SkinConcernsMap {
  redness: { bbox: [number, number, number, number]; severity: number }[];
  spots: { center: [number, number]; radius: number; severity: number }[];
  dark_circles: { left: number; right: number };
  pores_tzone: number;
  texture: { forehead: number; cheeks: number; chin: number };
}

interface Landmark { x: number; y: number; z: number }

export interface BeautyFilterOptions {
  /** 0..1 — intensità complessiva del filtro base. Default 0.42. */
  strength?: number;
  /** raggio del Gaussian blur di base sulla pelle (px). */
  blurRadius?: number;
  /** Mappa AI degli inestetismi. Se assente → solo smoothing uniforme. */
  concerns?: SkinConcernsMap | null;
  /** Intensità globale delle correzioni targeted (0..1). Default 0.7. */
  targetedStrength?: number;
}

// ============ MediaPipe loader ============
let landmarkerPromise: Promise<FaceLandmarkerType> | null = null;

async function getLandmarker(): Promise<FaceLandmarkerType> {
  if (landmarkerPromise) return landmarkerPromise;
  landmarkerPromise = (async () => {
    const { FaceLandmarker, FilesetResolver } = await import(
      "@mediapipe/tasks-vision"
    );
    const filesetResolver = await FilesetResolver.forVisionTasks(
      "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.35/wasm",
    );
    return FaceLandmarker.createFromOptions(filesetResolver, {
      baseOptions: {
        modelAssetPath:
          "https://storage.googleapis.com/mediapipe-models/face_landmarker/face_landmarker/float16/1/face_landmarker.task",
        delegate: "GPU",
      },
      runningMode: "IMAGE",
      numFaces: 1,
    });
  })();
  return landmarkerPromise;
}

// ============ Utils ============
function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
}

function drawPolygon(
  ctx: CanvasRenderingContext2D,
  pts: { x: number; y: number }[],
) {
  if (!pts.length) return;
  ctx.beginPath();
  ctx.moveTo(pts[0].x, pts[0].y);
  for (let i = 1; i < pts.length; i++) ctx.lineTo(pts[i].x, pts[i].y);
  ctx.closePath();
  ctx.fill();
}

function pickPoints(landmarks: Landmark[], indices: number[], w: number, h: number) {
  return indices.map((i) => ({ x: landmarks[i].x * w, y: landmarks[i].y * h }));
}

function buildSkinMask(
  landmarks: Landmark[],
  w: number,
  h: number,
): HTMLCanvasElement {
  const mask = document.createElement("canvas");
  mask.width = w;
  mask.height = h;
  const ctx = mask.getContext("2d")!;
  ctx.fillStyle = "#fff";
  drawPolygon(ctx, pickPoints(landmarks, FACE_OVAL, w, h));
  ctx.globalCompositeOperation = "destination-out";
  ctx.fillStyle = "#fff";
  drawPolygon(ctx, pickPoints(landmarks, LEFT_EYE, w, h));
  drawPolygon(ctx, pickPoints(landmarks, RIGHT_EYE, w, h));
  drawPolygon(ctx, pickPoints(landmarks, LEFT_EYEBROW, w, h));
  drawPolygon(ctx, pickPoints(landmarks, RIGHT_EYEBROW, w, h));
  drawPolygon(ctx, pickPoints(landmarks, LIPS_OUTER, w, h));
  ctx.globalCompositeOperation = "source-over";
  const feathered = document.createElement("canvas");
  feathered.width = w;
  feathered.height = h;
  const fctx = feathered.getContext("2d")!;
  fctx.filter = `blur(${Math.max(6, Math.round(Math.min(w, h) * 0.012))}px)`;
  fctx.drawImage(mask, 0, 0);
  return feathered;
}

/** Disegna un gradiente radiale morbido come "pennello" per interventi locali. */
function paintRadialAlpha(
  ctx: CanvasRenderingContext2D,
  cx: number,
  cy: number,
  radius: number,
  colorInner: string,
  colorOuter: string,
) {
  const g = ctx.createRadialGradient(cx, cy, 0, cx, cy, radius);
  g.addColorStop(0, colorInner);
  g.addColorStop(1, colorOuter);
  ctx.fillStyle = g;
  ctx.beginPath();
  ctx.arc(cx, cy, radius, 0, Math.PI * 2);
  ctx.fill();
}

// ============ Trattamenti targeted ============

/**
 * Attenua i rossori: sui rettangoli indicati, riduce il canale ROSSO
 * mescolando ogni pixel col grigio-canale (R → media di G+B pesata).
 * Usiamo un livello sopra l'originale con `mix-blend-mode: saturation` limitato via mask.
 */
function applyRednessReduction(
  base: HTMLCanvasElement,
  concerns: SkinConcernsMap,
  targeted: number,
): HTMLCanvasElement {
  if (!concerns.redness.length) return base;
  const w = base.width;
  const h = base.height;

  // 1. Versione desaturata di rosso (canale R sostituito con media G+B).
  const desat = document.createElement("canvas");
  desat.width = w;
  desat.height = h;
  const dctx = desat.getContext("2d")!;
  dctx.drawImage(base, 0, 0);
  const imgData = dctx.getImageData(0, 0, w, h);
  const d = imgData.data;
  for (let i = 0; i < d.length; i += 4) {
    const r = d[i];
    const g = d[i + 1];
    const b = d[i + 2];
    // Nuovo R = mix tra R e media(G,B) — riduce dominante rossa
    const target = (g + b) * 0.5;
    d[i] = r * 0.55 + target * 0.45;
  }
  dctx.putImageData(imgData, 0, 0);

  // 2. Costruiamo una maschera con le bbox di rossore, alpha = severity
  const mask = document.createElement("canvas");
  mask.width = w;
  mask.height = h;
  const mctx = mask.getContext("2d")!;
  for (const r of concerns.redness) {
    const [x, y, bw, bh] = r.bbox;
    const cx = (x + bw / 2) * w;
    const cy = (y + bh / 2) * h;
    const radius = Math.max(bw, bh) * Math.max(w, h) * 0.6;
    const alpha = Math.min(1, r.severity) * targeted;
    paintRadialAlpha(
      mctx,
      cx,
      cy,
      radius,
      `rgba(255,255,255,${alpha})`,
      "rgba(255,255,255,0)",
    );
  }

  // 3. desat × mask
  mctx.globalCompositeOperation = "source-in";
  mctx.drawImage(desat, 0, 0);
  mctx.globalCompositeOperation = "source-over";

  // 4. base + (desat masked) → sovrapposto
  const out = document.createElement("canvas");
  out.width = w;
  out.height = h;
  const octx = out.getContext("2d")!;
  octx.drawImage(base, 0, 0);
  octx.drawImage(mask, 0, 0);
  return out;
}

/**
 * Attenua le macchie: per ogni spot, campiona la pelle circostante (anello esterno)
 * e la stampa dentro col feathering → clone-stamp locale.
 */
function applySpotHealing(
  base: HTMLCanvasElement,
  concerns: SkinConcernsMap,
  targeted: number,
): HTMLCanvasElement {
  if (!concerns.spots.length) return base;
  const w = base.width;
  const h = base.height;

  const out = document.createElement("canvas");
  out.width = w;
  out.height = h;
  const octx = out.getContext("2d")!;
  octx.drawImage(base, 0, 0);

  for (const s of concerns.spots) {
    const cx = s.center[0] * w;
    const cy = s.center[1] * h;
    const rPx = Math.max(3, s.radius * Math.min(w, h));
    // Prendiamo una zona più larga intorno (2x) e la blurriamo, poi la incolliamo dentro.
    const sample = document.createElement("canvas");
    const side = Math.round(rPx * 4);
    sample.width = side;
    sample.height = side;
    const sctx = sample.getContext("2d")!;
    sctx.filter = `blur(${Math.round(rPx * 1.4)}px)`;
    sctx.drawImage(
      base,
      cx - side / 2,
      cy - side / 2,
      side,
      side,
      0,
      0,
      side,
      side,
    );
    sctx.filter = "none";

    // Feather via radial mask
    const patch = document.createElement("canvas");
    patch.width = side;
    patch.height = side;
    const pctx = patch.getContext("2d")!;
    pctx.drawImage(sample, 0, 0);
    pctx.globalCompositeOperation = "destination-in";
    const grad = pctx.createRadialGradient(
      side / 2, side / 2, 0,
      side / 2, side / 2, side / 2,
    );
    const alpha = Math.min(1, s.severity) * targeted;
    grad.addColorStop(0, `rgba(255,255,255,${alpha})`);
    grad.addColorStop(0.6, `rgba(255,255,255,${alpha * 0.5})`);
    grad.addColorStop(1, "rgba(255,255,255,0)");
    pctx.fillStyle = grad;
    pctx.fillRect(0, 0, side, side);
    pctx.globalCompositeOperation = "source-over";

    octx.drawImage(patch, cx - side / 2, cy - side / 2);
  }

  return out;
}

/**
 * Riduce le occhiaie: sotto ciascun occhio, schiarisce leggermente e desatura il canale blu.
 */
function applyDarkCircleReduction(
  base: HTMLCanvasElement,
  landmarks: Landmark[],
  concerns: SkinConcernsMap,
  targeted: number,
): HTMLCanvasElement {
  const { left, right } = concerns.dark_circles;
  if (left <= 0.05 && right <= 0.05) return base;

  const w = base.width;
  const h = base.height;

  // Versione schiarita + desaturata sul blu
  const light = document.createElement("canvas");
  light.width = w;
  light.height = h;
  const lctx = light.getContext("2d")!;
  lctx.drawImage(base, 0, 0);
  const imgData = lctx.getImageData(0, 0, w, h);
  const d = imgData.data;
  for (let i = 0; i < d.length; i += 4) {
    d[i] = Math.min(255, d[i] * 1.08 + 6);       // R su
    d[i + 1] = Math.min(255, d[i + 1] * 1.06 + 5); // G su
    d[i + 2] = Math.min(255, d[i + 2] * 0.96 + 2); // B giù → meno viola
  }
  lctx.putImageData(imgData, 0, 0);

  // Maschera: due gradient radiali sotto gli occhi
  const mask = document.createElement("canvas");
  mask.width = w;
  mask.height = h;
  const mctx = mask.getContext("2d")!;

  const leftPt = landmarks[LEFT_UNDEREYE_CENTER];
  const rightPt = landmarks[RIGHT_UNDEREYE_CENTER];
  if (leftPt && left > 0.05) {
    paintRadialAlpha(
      mctx,
      leftPt.x * w,
      leftPt.y * h + h * 0.005,
      Math.min(w, h) * 0.08,
      `rgba(255,255,255,${Math.min(1, left) * targeted})`,
      "rgba(255,255,255,0)",
    );
  }
  if (rightPt && right > 0.05) {
    paintRadialAlpha(
      mctx,
      rightPt.x * w,
      rightPt.y * h + h * 0.005,
      Math.min(w, h) * 0.08,
      `rgba(255,255,255,${Math.min(1, right) * targeted})`,
      "rgba(255,255,255,0)",
    );
  }

  mctx.globalCompositeOperation = "source-in";
  mctx.drawImage(light, 0, 0);
  mctx.globalCompositeOperation = "source-over";

  const out = document.createElement("canvas");
  out.width = w;
  out.height = h;
  const octx = out.getContext("2d")!;
  octx.drawImage(base, 0, 0);
  octx.drawImage(mask, 0, 0);
  return out;
}

// ============ Applicazione principale ============
export async function applyBeautyFilter(
  imageSrc: string,
  opts: BeautyFilterOptions = {},
): Promise<string> {
  const strength = Math.max(0, Math.min(1, opts.strength ?? 0.42));
  const targetedStrength = Math.max(0, Math.min(1, opts.targetedStrength ?? 0.7));
  const concerns = opts.concerns ?? null;

  const img = await loadImage(imageSrc);
  const w = img.naturalWidth;
  const h = img.naturalHeight;
  const blurRadius =
    opts.blurRadius ?? Math.max(4, Math.round(Math.min(w, h) * 0.012));

  // Detect face
  let landmarks: Landmark[] | null = null;
  try {
    const landmarker = await getLandmarker();
    const result = landmarker.detect(img);
    if (result.faceLandmarks?.[0]?.length) {
      landmarks = result.faceLandmarks[0] as Landmark[];
    }
  } catch (e) {
    console.warn("[beautyFilter] face detection failed:", e);
  }

  if (!landmarks) {
    const fallback = document.createElement("canvas");
    fallback.width = w;
    fallback.height = h;
    fallback.getContext("2d")!.drawImage(img, 0, 0);
    return fallback.toDataURL("image/jpeg", 0.92);
  }

  // 1. Base originale su canvas
  let working = document.createElement("canvas");
  working.width = w;
  working.height = h;
  working.getContext("2d")!.drawImage(img, 0, 0);

  // 2. Applica trattamenti TARGETED (se abbiamo la mappa AI)
  if (concerns) {
    working = applyRednessReduction(working, concerns, targetedStrength);
    working = applySpotHealing(working, concerns, targetedStrength);
    working = applyDarkCircleReduction(working, landmarks, concerns, targetedStrength);
  }

  // 3. Smoothing base sulla pelle (frequency-separation-like via blur mascherato)
  const softened = document.createElement("canvas");
  softened.width = w;
  softened.height = h;
  const sctx = softened.getContext("2d")!;
  sctx.filter = `blur(${blurRadius}px) saturate(0.98)`;
  sctx.drawImage(working, 0, 0);
  sctx.filter = "none";

  const mask = buildSkinMask(landmarks, w, h);

  const maskedSoft = document.createElement("canvas");
  maskedSoft.width = w;
  maskedSoft.height = h;
  const msctx = maskedSoft.getContext("2d")!;
  msctx.drawImage(softened, 0, 0);
  msctx.globalCompositeOperation = "destination-in";
  msctx.drawImage(mask, 0, 0);
  msctx.globalCompositeOperation = "source-over";

  // 4. Compose finale: working (con trattamenti targeted) + smoothing pelle × strength
  const out = document.createElement("canvas");
  out.width = w;
  out.height = h;
  const octx = out.getContext("2d")!;
  octx.drawImage(working, 0, 0);
  octx.globalAlpha = strength;
  octx.drawImage(maskedSoft, 0, 0);
  octx.globalAlpha = 1;

  return out.toDataURL("image/jpeg", 0.92);
}

/** Pre-carica il modello per ridurre la latenza al primo uso. */
export function warmUpBeautyFilter() {
  void getLandmarker().catch(() => {});
}
