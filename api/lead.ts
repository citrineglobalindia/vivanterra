/**
 * POST /api/lead
 *
 * Records a lead from the LeadPopup / newsletter / concierge into
 * vivanterra_leads using the Supabase service-role key.
 *
 * Env: SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY
 */
import { createClient } from "@supabase/supabase-js";

type Body = {
  name?: unknown;
  email?: unknown;
  phone?: unknown;
  kind?: unknown;
  message?: unknown;
  page_path?: unknown;
  project_slug?: unknown;
  source?: unknown;
};

const KINDS = ["popup", "newsletter", "concierge", "other"];

function asString(v: unknown, max = 2000): string | undefined {
  if (typeof v !== "string") return undefined;
  const s = v.trim();
  return s ? s.slice(0, max) : undefined;
}

export const config = { runtime: "edge" };

export default async function handler(req: Request): Promise<Response> {
  const cors: Record<string, string> = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
  };
  if (req.method === "OPTIONS") return new Response(null, { status: 204, headers: cors });
  if (req.method !== "POST")
    return Response.json({ ok: false, error: "Method not allowed" }, { status: 405, headers: cors });

  let body: Body;
  try {
    body = (await req.json()) as Body;
  } catch {
    return Response.json({ ok: false, error: "Invalid JSON" }, { status: 400, headers: cors });
  }

  const email = asString(body.email, 320);
  if (!email || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email))
    return Response.json({ ok: false, error: "Valid email required" }, { status: 400, headers: cors });

  const kindRaw = asString(body.kind, 30);
  const kind = kindRaw && KINDS.includes(kindRaw) ? kindRaw : "popup";

  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key)
    return Response.json({ ok: false, error: "Server not configured" }, { status: 500, headers: cors });

  const supabase = createClient(url, key, { auth: { persistSession: false } });

  const row = {
    name: asString(body.name, 200) ?? null,
    email,
    phone: asString(body.phone, 60) ?? null,
    kind,
    message: asString(body.message, 2000) ?? null,
    page_path: asString(body.page_path, 300) ?? null,
    project_slug: asString(body.project_slug, 100) ?? null,
    source: asString(body.source, 100) ?? "vivanterra-website",
    user_agent: req.headers.get("user-agent") ?? null,
    ip_address: (req.headers.get("x-forwarded-for") ?? "").split(",")[0].trim() || null,
  };

  // If newsletter, also upsert into subscribers.
  if (kind === "newsletter") {
    await supabase
      .from("vivanterra_subscribers")
      .upsert({ email, source: row.source }, { onConflict: "email" });
  }

  const { data, error } = await supabase
    .from("vivanterra_leads")
    .insert(row)
    .select("id")
    .single();

  if (error) {
    // eslint-disable-next-line no-console
    console.error("[/api/lead] insert failed:", error);
    return Response.json({ ok: false, error: "Could not save lead" }, { status: 500, headers: cors });
  }
  return Response.json({ ok: true, id: data?.id }, { status: 200, headers: cors });
}
