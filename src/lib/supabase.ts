import { createClient, type SupabaseClient } from "@supabase/supabase-js";

const env: Record<string, string | undefined> =
  ((import.meta as ImportMeta & {
    env?: Record<string, string | undefined>;
  }).env ?? {}) as Record<string, string | undefined>;

const SUPABASE_URL = env.VITE_SUPABASE_URL ?? "";
const SUPABASE_ANON_KEY = env.VITE_SUPABASE_ANON_KEY ?? "";

export const supabaseConfigured =
  SUPABASE_URL.length > 0 && SUPABASE_ANON_KEY.length > 0;

let _client: SupabaseClient | null = null;

/** Lazy singleton — only constructed when actually used. */
export function getSupabase(): SupabaseClient {
  if (!_client) {
    if (!supabaseConfigured) {
      throw new Error(
        "Supabase is not configured. Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in your Vercel environment variables.",
      );
    }
    _client = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
      auth: { persistSession: true, autoRefreshToken: true },
    });
  }
  return _client;
}

export type Enquiry = {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  scope: string | null;
  budget: string | null;
  message: string;
  project_slug: string | null;
  source: string;
  status: "new" | "contacted" | "qualified" | "closed" | "spam";
  notes: string | null;
  created_at: string;
  updated_at: string;
};

export const ENQUIRY_STATUSES: Enquiry["status"][] = [
  "new",
  "contacted",
  "qualified",
  "closed",
  "spam",
];
