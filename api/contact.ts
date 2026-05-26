/**
 * POST /api/contact
 *
 * Receives a contact-form enquiry from the public site, validates it, and
 * inserts it into the vivanterra_enquiries table using the Supabase
 * service-role key (which bypasses RLS — RLS only allows admins to read).
 *
 * Required env vars (set in Vercel → Settings → Environment Variables):
 *   SUPABASE_URL                 — https://<ref>.supabase.co
 *   SUPABASE_SERVICE_ROLE_KEY    — Project Settings → API → service_role secret
 *
 * Returns: { ok: true, id } on success, { ok: false, error } on failure.
 */
import { createClient } from "@supabase/supabase-js";

type Body = {
  name?: unknown;
  email?: unknown;
  phone?: unknown;
  scope?: unknown;
  budget?: unknown;
  message?: unknown;
  projectSlug?: unknown;
  source?: unknown;
};

const SCOPES = ["residence", "investor", "press", "career", "visit"];
const BUDGETS = ["under-2", "2-5", "5-10", "10-plus"];

function asString(v: unknown, max = 2000): string | undefined {
  if (typeof v !== "string") return undefined;
  const s = v.trim();
  if (!s) return undefined;
  return s.slice(0, max);
}

function clientIp(req: Request): string | undefined {
  const fwd = req.headers.get("x-forwarded-for");
  if (fwd) return fwd.split(",")[0].trim();
  return req.headers.get("x-real-ip") || undefined;
}

export const config = { runtime: "edge" };

export default async function handler(req: Request): Promise<Response> {
  // Permissive CORS — the form is on the same origin, but allow direct testing.
  const corsHeaders: Record<string, string> = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
  };

  if (req.method === "OPTIONS") {
    return new Response(null, { status: 204, headers: corsHeaders });
  }
  if (req.method !== "POST") {
    return Response.json(
      { ok: false, error: "Method not allowed" },
      { status: 405, headers: corsHeaders },
    );
  }

  let body: Body;
  try {
    body = (await req.json()) as Body;
  } catch {
    return Response.json(
      { ok: false, error: "Invalid JSON body" },
      { status: 400, headers: corsHeaders },
    );
  }

  const name = asString(body.name, 200);
  const email = asString(body.email, 320);
  const message = asString(body.message, 5000);
  const phone = asString(body.phone, 60);
  const scopeRaw = asString(body.scope, 50);
  const budgetRaw = asString(body.budget, 50);
  const projectSlug = asString(body.projectSlug, 100);
  const source = asString(body.source, 100) ?? "vivanterra-website";

  // Validation
  const errors: Record<string, string> = {};
  if (!name || name.length < 2) errors.name = "Please share your name";
  if (!email || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email))
    errors.email = "A valid email, please";
  if (!message || message.length < 10)
    errors.message = "A few more words help us reply better";
  if (phone && !/^[+\d\s\-()]{7,20}$/.test(phone))
    errors.phone = "Check the phone number";
  const scope = scopeRaw && SCOPES.includes(scopeRaw) ? scopeRaw : undefined;
  const budget =
    budgetRaw && BUDGETS.includes(budgetRaw) ? budgetRaw : undefined;
  if (!scope) errors.scope = "Pick a scope";

  if (Object.keys(errors).length > 0) {
    return Response.json(
      { ok: false, error: "Validation failed", fields: errors },
      { status: 400, headers: corsHeaders },
    );
  }

  // Supabase
  const url = process.env.SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !serviceKey) {
    // eslint-disable-next-line no-console
    console.error("[/api/contact] SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY missing");
    return Response.json(
      { ok: false, error: "Server not configured" },
      { status: 500, headers: corsHeaders },
    );
  }

  const supabase = createClient(url, serviceKey, {
    auth: { persistSession: false },
  });

  const ua = req.headers.get("user-agent") ?? null;
  const ip = clientIp(req) ?? null;

  const { data, error } = await supabase
    .from("vivanterra_enquiries")
    .insert({
      name,
      email,
      phone,
      scope,
      budget,
      message,
      project_slug: projectSlug,
      source,
      user_agent: ua,
      ip_address: ip,
    })
    .select("id")
    .single();

  if (error) {
    // eslint-disable-next-line no-console
    console.error("[/api/contact] insert failed:", error);
    return Response.json(
      { ok: false, error: "Could not save enquiry" },
      { status: 500, headers: corsHeaders },
    );
  }

  return Response.json(
    { ok: true, id: data?.id },
    { status: 200, headers: corsHeaders },
  );
}
