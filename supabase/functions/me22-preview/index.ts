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
  action: z.literal("start"),
  selfie: z.string().min(50).max(12_000_000),
  skinGoals: z.array(z.string().max(100)).max(10).default([]),
  budget: z.string().max(50).optional().default(""),
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
    const { selfie, skinGoals, budget } = start.data;
    const blob = dataUrlToBlob(selfie);
    const ext = blob.type.split("/")[1];

    // 1. Analisi
    const fa = new FormData();
    fa.append("image", blob, `selfie.${ext}`);
    const ra = await fetch(`${BASE}/v1/analyze`, { method: "POST", headers: auth, body: fa });
    const da = await ra.json().catch(() => ({}));
    if (!ra.ok || !da.ok) return json({ ok: false, error: da?.error || `analyze_${ra.status}` });
    const analysis = da.analysis ?? null;

    // 2. Routine
    const fromGoals = skinGoals.map((g) => GOAL_MAP[g]).filter(Boolean);
    const fromImage: string[] = Array.isArray(analysis?.mapped_me22_concerns)
      ? analysis.mapped_me22_concerns.filter((c: unknown) => typeof c === "string")
      : [];
    const concerns = Array.from(new Set([...fromGoals, ...fromImage]));
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

    // 3. Preview (asincrona)
    const fp = new FormData();
    fp.append("image", blob, `selfie.${ext}`);
    fp.append("routine", JSON.stringify(dr.recommendation));
    fp.append("analysis", analysis ? JSON.stringify(analysis) : "");
    const rp = await fetch(`${BASE}/v1/previews`, { method: "POST", headers: auth, body: fp });
    const dp = await rp.json().catch(() => ({}));
    if (!rp.ok || !dp.ok || !dp.job_id) return json({ ok: false, error: dp?.error || `previews_${rp.status}` });

    return json({ ok: true, jobId: dp.job_id, status: dp.status });
  } catch (e) {
    console.error("me22-preview error:", e);
    return json({ ok: false, error: e instanceof Error ? e.message : "engine_unreachable" });
  }
});
