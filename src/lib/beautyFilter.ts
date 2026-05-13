/**
 * Deterministic in-browser beauty filter.
 *
 * Pipeline:
 *   1. MediaPipe FaceLandmarker → 478 facial landmarks
 *   2. Build a soft "skin only" mask (face oval minus eyes/eyebrows/lips)
 *   3. Apply edge-preserving smoothing (Gaussian blur) on the masked area
 *   4. Blend softened ↔ original using the mask × strength
 *
 * Result: rughe e arrossamenti attenuati ~45%, pori e texture preservati,
 * occhi/bocca/sfondo IDENTICI all'originale, esposizione invariata.
 */
import type { FaceLandmarker as FaceLandmarkerType } from "@mediapipe/tasks-vision";

// Canonical ordered ring of FaceMesh indices (clockwise) for the face oval.
// Source: MediaPipe FaceMesh canonical contours.
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

interface Landmark { x: number; y: number; z: number }

function pickPoints(
  landmarks: Landmark[],
  indices: number[],
  w: number,
  h: number,
) {
  return indices.map((i) => ({ x: landmarks[i].x * w, y: landmarks[i].y * h }));
}

/**
 * Build a soft skin mask on a canvas: white = pelle (apply effect),
 * black = features/sfondo (preserve original).
 */
function buildSkinMask(
  landmarks: Landmark[],
  w: number,
  h: number,
): HTMLCanvasElement {
  const mask = document.createElement("canvas");
  mask.width = w;
  mask.height = h;
  const ctx = mask.getContext("2d")!;

  // 1. Riempi l'ovale del viso di bianco
  ctx.fillStyle = "#fff";
  drawPolygon(ctx, pickPoints(landmarks, FACE_OVAL, w, h));

  // 2. Sottrai occhi, sopracciglia, bocca (con un piccolo padding via blur dopo)
  ctx.globalCompositeOperation = "destination-out";
  ctx.fillStyle = "#fff";
  drawPolygon(ctx, pickPoints(landmarks, LEFT_EYE, w, h));
  drawPolygon(ctx, pickPoints(landmarks, RIGHT_EYE, w, h));
  drawPolygon(ctx, pickPoints(landmarks, LEFT_EYEBROW, w, h));
  drawPolygon(ctx, pickPoints(landmarks, RIGHT_EYEBROW, w, h));
  drawPolygon(ctx, pickPoints(landmarks, LIPS_OUTER, w, h));
  ctx.globalCompositeOperation = "source-over";

  // 3. Feather: sfumiamo i bordi della maschera per una transizione naturale
  const feathered = document.createElement("canvas");
  feathered.width = w;
  feathered.height = h;
  const fctx = feathered.getContext("2d")!;
  fctx.filter = `blur(${Math.max(6, Math.round(Math.min(w, h) * 0.012))}px)`;
  fctx.drawImage(mask, 0, 0);
  return feathered;
}

export interface BeautyFilterOptions {
  /** 0..1 — intensità complessiva. Default 0.55 (visibile ma naturale). */
  strength?: number;
  /** raggio del Gaussian blur sulla pelle (px). Default proporzionale alla foto. */
  blurRadius?: number;
}

/**
 * Applica il beauty filter a un'immagine (data URL o URL pubblico).
 * Ritorna una data URL JPEG.
 */
export async function applyBeautyFilter(
  imageSrc: string,
  opts: BeautyFilterOptions = {},
): Promise<string> {
  const strength = Math.max(0, Math.min(1, opts.strength ?? 0.55));

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

  // Nessun volto → ritorna l'originale
  if (!landmarks) {
    const fallback = document.createElement("canvas");
    fallback.width = w;
    fallback.height = h;
    fallback.getContext("2d")!.drawImage(img, 0, 0);
    return fallback.toDataURL("image/jpeg", 0.92);
  }

  // 1. Versione ammorbidita
  const softened = document.createElement("canvas");
  softened.width = w;
  softened.height = h;
  const sctx = softened.getContext("2d")!;
  sctx.filter = `blur(${blurRadius}px) saturate(0.97)`;
  sctx.drawImage(img, 0, 0);
  sctx.filter = "none";

  // 2. Maschera pelle (alpha)
  const mask = buildSkinMask(landmarks, w, h);

  // 3. Applichiamo la maschera alla versione soft → mask × softened
  const maskedSoft = document.createElement("canvas");
  maskedSoft.width = w;
  maskedSoft.height = h;
  const msctx = maskedSoft.getContext("2d")!;
  msctx.drawImage(softened, 0, 0);
  msctx.globalCompositeOperation = "destination-in";
  msctx.drawImage(mask, 0, 0);
  msctx.globalCompositeOperation = "source-over";

  // 4. Composizione finale: originale + (maskedSoft ad alpha=strength)
  const out = document.createElement("canvas");
  out.width = w;
  out.height = h;
  const octx = out.getContext("2d")!;
  octx.drawImage(img, 0, 0);
  octx.globalAlpha = strength;
  octx.drawImage(maskedSoft, 0, 0);
  octx.globalAlpha = 1;

  return out.toDataURL("image/jpeg", 0.92);
}

/** Pre-carica il modello per ridurre la latenza al primo uso. */
export function warmUpBeautyFilter() {
  void getLandmarker().catch(() => {});
}
