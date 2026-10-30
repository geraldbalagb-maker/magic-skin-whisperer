// Blocks browser calls coming from websites other than this app.
// Not a substitute for rate limiting: non-browser clients can still forge the Origin header.
const ALLOWED_HOSTS = [
  "beauty-routine.mvpfactory.it",
  "magic-skin-whisperer.lovable.app",
  "localhost",
  "127.0.0.1",
];
const ALLOWED_SUFFIXES = [".lovable.app", ".lovableproject.com", ".lovable.dev"];

export function isAllowedOrigin(req: Request): boolean {
  const origin = req.headers.get("origin");
  if (!origin) return false;
  try {
    const host = new URL(origin).hostname;
    return ALLOWED_HOSTS.includes(host) || ALLOWED_SUFFIXES.some((s) => host.endsWith(s));
  } catch {
    return false;
  }
}

export function forbidden(headers: Record<string, string>): Response {
  return new Response(JSON.stringify({ ok: false, error: "origin_not_allowed" }), {
    status: 403,
    headers: { ...headers, "Content-Type": "application/json" },
  });
}
