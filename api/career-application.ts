/**
 * POST /api/career-application — records a job application into
 * vivanterra_career_applications via the service-role key.
 */
import { createClient } from "@supabase/supabase-js";

type Body = {
  name?: unknown; email?: unknown; phone?: unknown;
  position_id?: unknown; position_title?: unknown;
  message?: unknown; resume_url?: unknown;
};
function s(v: unknown, max = 2000): string | undefined {
  if (typeof v !== "string") return undefined;
  const t = v.trim();
  return t ? t.slice(0, max) : undefined;
}
export const config = { runtime: "edge" };

export default async function handler(req: Request): Promise<Response> {
  const cors: Record<string, string> = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
  };
  if (req.method === "OPTIONS") return new Response(null, { status: 204, headers: cors });
  if (req.method !== "POST") return Response.json({ ok: false, error: "Method not allowed" }, { status: 405, headers: cors });

  let body: Body;
  try { body = (await req.json()) as Body; }
  catch { return Response.json({ ok: false, error: "Invalid JSON" }, { status: 400, headers: cors }); }

  const name = s(body.name, 200);
  const email = s(body.email, 320);
  const message = s(body.message, 5000);
  if (!name || name.length < 2) return Response.json({ ok: false, error: "Name required" }, { status: 400, headers: cors });
  if (!email || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) return Response.json({ ok: false, error: "Valid email required" }, { status: 400, headers: cors });

  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) return Response.json({ ok: false, error: "Server not configured" }, { status: 500, headers: cors });
  const supabase = createClient(url, key, { auth: { persistSession: false } });

  const { data, error } = await supabase.from("vivanterra_career_applications").insert({
    name, email,
    phone: s(body.phone, 60) ?? null,
    position_id: s(body.position_id, 60) ?? null,
    position_title: s(body.position_title, 200) ?? null,
    message: message ?? null,
    resume_url: s(body.resume_url, 500) ?? null,
    source: "career-page",
    user_agent: req.headers.get("user-agent") ?? null,
    ip_address: (req.headers.get("x-forwarded-for") ?? "").split(",")[0].trim() || null,
  }).select("id").single();

  if (error) { console.error("[/api/career-application]", error); return Response.json({ ok: false, error: "Could not save application" }, { status: 500, headers: cors }); }
  return Response.json({ ok: true, id: data?.id }, { status: 200, headers: cors });
}
