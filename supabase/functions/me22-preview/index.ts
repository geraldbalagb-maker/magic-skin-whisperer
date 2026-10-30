import { corsHeaders } from "npm:@supabase/supabase-js@2/cors";
import { forbidden, isAllowedOrigin } from "../_shared/origin.ts";
import { z } from "npm:zod@3";
import { getME22BudgetPolicy } from "../_shared/me22Budget.ts";

// Proxy verso il motore ME-22 (FastAPI). Il token resta lato server.
// action "analyze":   foto -> /v1/analyze (subito dopo il caricamento)
// action "recommend": payload (analisi + questionario corretto dall'utente) -> /v1/routines
// action "start":     come recommend + accoda la preview "dopo"
// action "status":    polling del job preview

const CONCERNS = ["acne", "pelle con macchie", "pelle grassa", "pelle secca", "pori dilatati", "rosacea/rossori visibili", "rughe", "colorito spento", "pattern seborroico/eritema"] as const;

const AnalyzeSchema = z.object({ action: z.literal("analyze"), selfie: z.string().min(50).max(12_000_000) });
const StartSchema = z.object({
  action: z.enum(["start", "recommend"]),
  selfie: z.string().min(50).max(12_000_000).optional(),
  analysis: z.record(z.unknown()).nullable().optional(),
  user: z.object({ name: z.string().max(100).default(""), age: z.number().int().min(10).max(110).nullable().default(null) }).default({ name: "", age: null }),
  concerns: z.array(z.string().max(60)).max(9).default([]),
  budget: z.string().max(50).optional().default(""),
  skinSensitivity: z.enum(["low", "medium", "high"]).default("medium"),
  routineTimeMinutes: z.number().int().min(1).max(120).nullable().default(null),
  currentProducts: z.array(z.string().max(60)).max(20).default([]),
  desiredSkinGoal: z.string().max(5000).default(""),
});
const StatusSchema = z.object({ action: z.literal("status"), jobId: z.string().regex(/^[a-f0-9]{32}$/) });

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), { status, headers: { ...corsHeaders, "Content-Type": "application/json" } });

function dataUrlToBlob(dataUrl: string): Blob {
  const m = dataUrl.match(/^data:(image\/(?:jpeg|jpg|png|webp));base64,(.+)$/);
  if (!m) throw new Error("Formato selfie non valido");
  const bin = Uint8Array.from(atob(m[2]), (c) => c.charCodeAt(0));
  return new Blob([bin], { type: m[1] === "image/jpg" ? "image/jpeg" : m[1] });
}

const ageRange = (age: number | null) => {
  if (age === null) return null;
  if (age < 18) return "under_18";
  if (age <= 24) return "18-24";
  if (age <= 34) return "25-34";
  if (age <= 44) return "35-44";
  if (age <= 54) return "45-54";
  if (age <= 64) return "55-64";
  return "65+";
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  if (!isAllowedOrigin(req)) return forbidden(corsHeaders);

  const BASE = Deno.env.get("ME22_ENGINE_URL")?.replace(/\/+$/, "");
  const TOKEN = Deno.env.get("ME22_ENGINE_TOKEN");
  if (!BASE || !TOKEN) return json({ ok: false, error: "engine_not_configured" });
  const auth = { Authorization: `Bearer ${TOKEN}` };

  let body: unknown;
  try { body = await req.json(); } catch { return json({ ok: false, error: "invalid_json" }, 400); }

  const analyze = async (blob: Blob) => {
    const fa = new FormData();
    fa.append("image", blob, `selfie.${blob.type.split("/")[1]}`);
    const ra = await fetch(`${BASE}/v1/analyze`, { method: "POST", headers: auth, body: fa, signal: AbortSignal.timeout(90_000) });
    const da = await ra.json().catch(() => ({}));
    if (!ra.ok || !da.ok) throw new Error(da?.error || `analyze_${ra.status}`);
    return da.analysis ?? null;
  };

  try {
    const status = StatusSchema.safeParse(body);
    if (status.success) {
      const r = await fetch(`${BASE}/v1/previews/${status.data.jobId}`, { headers: auth });
      const d = await r.json().catch(() => ({}));
      if (!r.ok) return json({ ok: false, status: "failed", error: d?.error || `engine_${r.status}` });
      if (d.status === "done" && d.preview?.b64_json) {
        return json({ ok: true, status: "done", image: `data:${d.preview.mime || "image/png"};base64,${d.preview.b64_json}`, disclaimer: d.disclaimer });
      }
      return json({ ok: d.ok !== false, status: d.status, error: d.error });
    }

    const an = AnalyzeSchema.safeParse(body);
    if (an.success) {
      const blob = dataUrlToBlob(an.data.selfie);
      if (blob.size > 8 * 1024 * 1024) return json({ ok: false, error: "selfie_too_large" }, 413);
      return json({ ok: true, analysis: await analyze(blob) });
    }

    const start = StartSchema.safeParse(body);
    if (!start.success) return json({ ok: false, error: start.error.flatten().fieldErrors }, 400);
    const p = start.data;
    const budgetPolicy = getME22BudgetPolicy(p.budget);
    const blob = p.selfie ? dataUrlToBlob(p.selfie) : null;
    if (blob && blob.size > 8 * 1024 * 1024) return json({ ok: false, error: "selfie_too_large" }, 413);

    // Analysis is normally done right after upload; only re-run it if missing.
    const analysis = p.analysis ?? (blob ? await analyze(blob) : null);

    // Concerns come from the user-confirmed quiz (pre-filled by the analysis).
    const allowed = new Set<string>(CONCERNS);
    const concerns = Array.from(new Set(p.concerns)).filter(c => allowed.has(c));
    if (!concerns.length) return json({ ok: false, error: "concerns_required" }, 400);

    const payload = {
      user: { name: p.user.name, age: p.user.age },
      image_analysis: analysis ?? undefined,
      questionnaire: {
        concern_categories: concerns,
        skin_sensitivity: p.skinSensitivity,
        age_range: ageRange(p.user.age),
        budget: budgetPolicy.engineBudget,
        budget_max_eur: budgetPolicy.capEur,
        routine_time_minutes: p.routineTimeMinutes,
        current_products_used: p.currentProducts.map(c => c.toLowerCase()),
        desired_skin_goal: p.desiredSkinGoal || null,
        spf_use: null,
      },
    };

    const rr = await fetch(`${BASE}/v1/routines`, {
      method: "POST",
      headers: { ...auth, "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const dr = await rr.json().catch(() => ({}));
    if (!rr.ok || !dr.ok) return json({ ok: false, error: dr?.error || dr?.detail || `routines_${rr.status}` });

    // Runtime catalog media is fetched server-side, never hotlinked by the browser.
    const media = new Map<string, Promise<string | null>>();
    const hydrate = async (product: Record<string, unknown> | null) => {
      if (!product || typeof product.image !== "string") return;
      const imageUrl = product.image;
      if (!media.has(imageUrl)) media.set(imageUrl, (async () => {
        try {
          const url = new URL(imageUrl);
          if (url.protocol !== "https:" || !["www.luxury-perfumes.net", "luxury-perfumes.net"].includes(url.hostname)) return null;
          const response = await fetch(url, { signal: AbortSignal.timeout(15_000), redirect: "error" });
          const mime = response.headers.get("content-type")?.split(";")[0] || "";
          if (!response.ok || !["image/jpeg", "image/png", "image/webp"].includes(mime)) return null;
          const bytes = new Uint8Array(await response.arrayBuffer());
          if (bytes.length > 3_000_000) return null;
          let binary = "";
          for (let offset = 0; offset < bytes.length; offset += 8192) binary += String.fromCharCode(...bytes.subarray(offset, offset + 8192));
          return `data:${mime};base64,${btoa(binary)}`;
        } catch { return null; }
      })());
      product.image_data = await media.get(imageUrl);
    };
    const entries = [...Object.values(dr.recommendation?.routine || {}).flat(), ...(dr.recommendation?.extra_products || [])] as { product?: Record<string, unknown> | null }[];
    if (dr.recommendation?.primary_kit?.product) entries.push(dr.recommendation.primary_kit);
    await Promise.all(entries.map(entry => hydrate(entry.product || null)));
    const { image_analysis: _omit, ...payloadSummary } = payload;
    const result = { ok: true, analysis, recommendation: dr.recommendation, request: payloadSummary };
    if (p.action === "recommend" || !blob) return json(result);

    // Preview (asincrona)
    const fp = new FormData();
    fp.append("image", blob, `selfie.${blob.type.split("/")[1]}`);
    fp.append("routine", JSON.stringify(dr.recommendation));
    fp.append("analysis", analysis ? JSON.stringify(analysis) : "");
    try {
      const rp = await fetch(`${BASE}/v1/previews`, { method: "POST", headers: auth, body: fp, signal: AbortSignal.timeout(30_000) });
      const dp = await rp.json().catch(() => ({}));
      if (!rp.ok || !dp.ok || !dp.job_id) return json({ ...result, previewError: dp?.error || `previews_${rp.status}` });
      return json({ ...result, jobId: dp.job_id, status: dp.status });
    } catch {
      return json({ ...result, previewError: "preview_unavailable" });
    }
  } catch (e) {
    console.error("me22-preview error:", e);
    return json({ ok: false, error: e instanceof Error ? e.message : "engine_unreachable" });
  }
});
