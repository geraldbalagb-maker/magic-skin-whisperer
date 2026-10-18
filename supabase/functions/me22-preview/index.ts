import { corsHeaders } from "npm:@supabase/supabase-js@2/cors";
import { z } from "npm:zod@3";

// Proxy verso il motore ME-22 (FastAPI). Il token resta lato server.
// action "start": analisi foto -> composizione routine -> accoda preview "dopo"
// action "status": polling del job preview

const GOAL_MAP: Record<string, string> = {
  "Più distesa e rilassata": "rughe",
  "Meno macchie e discromie": "pelle con macchie",
  "Più luminosa e uniforme": "colorito spento",
  "Pori meno visibili": "pori dilatati",
  "Meno rossori": "rosacea/rossori visibili",
  "Grana più fine": "pori dilatati",
};
const BUDGET_MAP: Record<string, string> = {
  "Entro i 50€": "low",
  "Fino a 100€": "medium",
  "Oltre i 100€": "high",
};

const StartSchema = z.object({
  action: z.enum(["start", "recommend"]),
  selfie: z.string().min(50).max(12_000_000).optional(),
  skinGoals: z.array(z.string().max(100)).max(10).default([]),
  budget: z.string().max(50).optional().default(""),
  skinDescription: z.string().max(5000).default(""),
});
const StatusSchema = z.object({
  action: z.literal("status"),
  jobId: z.string().regex(/^[a-f0-9]{32}$/),
});

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });

function dataUrlToBlob(dataUrl: string): Blob {
  const m = dataUrl.match(/^data:(image\/(?:jpeg|jpg|png|webp));base64,(.+)$/);
  if (!m) throw new Error("Formato selfie non valido");
  const bin = Uint8Array.from(atob(m[2]), (c) => c.charCodeAt(0));
  return new Blob([bin], { type: m[1] === "image/jpg" ? "image/jpeg" : m[1] });
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  const BASE = Deno.env.get("ME22_ENGINE_URL")?.replace(/\/+$/, "");
  const TOKEN = Deno.env.get("ME22_ENGINE_TOKEN");
  if (!BASE || !TOKEN) return json({ ok: false, error: "engine_not_configured" });
  const auth = { Authorization: `Bearer ${TOKEN}` };

  let body: unknown;
  try { body = await req.json(); } catch { return json({ ok: false, error: "invalid_json" }, 400); }

  try {
    const status = StatusSchema.safeParse(body);
    if (status.success) {
      const r = await fetch(`${BASE}/v1/previews/${status.data.jobId}`, { headers: auth });
      const d = await r.json().catch(() => ({}));
      if (!r.ok) return json({ ok: false, status: "failed", error: d?.error || `engine_${r.status}` });
      if (d.status === "done" && d.preview?.b64_json) {
        return json({
          ok: true,
          status: "done",
          image: `data:${d.preview.mime || "image/png"};base64,${d.preview.b64_json}`,
          disclaimer: d.disclaimer,
        });
      }
      return json({ ok: d.ok !== false, status: d.status, error: d.error });
    }

    const start = StartSchema.safeParse(body);
    if (!start.success) return json({ ok: false, error: start.error.flatten().fieldErrors }, 400);
    const { selfie, skinGoals, budget, skinDescription } = start.data;
    if (start.data.action === "start" && !selfie) return json({ ok: false, error: "selfie_required" }, 400);
    const blob = selfie ? dataUrlToBlob(selfie) : null;
    if (blob && blob.size > 8 * 1024 * 1024) return json({ ok: false, error: "selfie_too_large" }, 413);
    const ext = blob?.type.split("/")[1];

    // 1. Analisi
    let analysis = null;
    if (blob) {
      const fa = new FormData();
      fa.append("image", blob, `selfie.${ext}`);
      const ra = await fetch(`${BASE}/v1/analyze`, { method: "POST", headers: auth, body: fa, signal: AbortSignal.timeout(90_000) });
      const da = await ra.json().catch(() => ({}));
      if (!ra.ok || !da.ok) return json({ ok: false, error: da?.error || `analyze_${ra.status}` });
      analysis = da.analysis ?? null;
    }

    // 2. Routine
    const fromGoals = skinGoals.map((g) => GOAL_MAP[g]).filter(Boolean);
    const fromImage: string[] = Array.isArray(analysis?.mapped_me22_concerns)
      ? analysis.mapped_me22_concerns.filter((c: unknown) => typeof c === "string")
      : [];
    // Only the nine documented concern categories are accepted by the engine.
    const descriptionConcerns = [
      [/rugh|linee sottili/i, "rughe"], [/macchi|discrom/i, "pelle con macchie"],
      [/rossor|rosacea/i, "rosacea/rossori visibili"], [/pori/i, "pori dilatati"],
      [/pelle secca|disidrat/i, "pelle secca"], [/pelle grassa|untuos/i, "pelle grassa"],
      [/acne|brufol/i, "acne"], [/spento|opac/i, "colorito spento"],
    ] as const;
    const allowed = new Set(["acne", "pelle con macchie", "pelle grassa", "pelle secca", "pori dilatati", "rosacea/rossori visibili", "rughe", "colorito spento", "pattern seborroico/eritema"]);
    const concerns = Array.from(new Set([...fromGoals, ...fromImage, ...descriptionConcerns.filter(([pattern]) => pattern.test(skinDescription)).map(([, concern]) => concern)])).filter(c => allowed.has(c));
    if (!concerns.length) concerns.push("colorito spento");

    const rr = await fetch(`${BASE}/v1/routines`, {
      method: "POST",
      headers: { ...auth, "Content-Type": "application/json" },
      body: JSON.stringify({
        questionnaire: {
          concern_categories: concerns,
          budget: BUDGET_MAP[budget] || "medium",
        },
        image_analysis: analysis ?? undefined,
      }),
    });
    const dr = await rr.json().catch(() => ({}));
    if (!rr.ok || !dr.ok) return json({ ok: false, error: dr?.error || `routines_${rr.status}` });
    const result = { ok: true, analysis, recommendation: dr.recommendation };
    if (start.data.action === "recommend" || !blob) return json(result);

    // 3. Preview (asincrona)
    const fp = new FormData();
    fp.append("image", blob, `selfie.${ext}`);
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
