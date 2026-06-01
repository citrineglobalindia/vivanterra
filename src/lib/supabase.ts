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

/* ── Types ─────────────────────────────────────────── */

export type LeadStatus = "new" | "contacted" | "qualified" | "closed" | "spam";
export const ENQUIRY_STATUSES: LeadStatus[] = [
  "new",
  "contacted",
  "qualified",
  "closed",
  "spam",
];

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
  status: LeadStatus;
  notes: string | null;
  created_at: string;
  updated_at: string;
};

export type Lead = {
  id: string;
  name: string | null;
  email: string;
  phone: string | null;
  kind: "popup" | "newsletter" | "concierge" | "other";
  message: string | null;
  page_path: string | null;
  project_slug: string | null;
  source: string;
  status: LeadStatus;
  notes: string | null;
  created_at: string;
  updated_at: string;
};

export type ProjectStatus = "Ongoing" | "Upcoming" | "Completed";
export const PROJECT_STATUSES: ProjectStatus[] = [
  "Ongoing",
  "Upcoming",
  "Completed",
];

export type Spec = { label: string; value: string };

export type ProjectRow = {
  id: string;
  slug: string;
  title: string;
  tagline: string | null;
  status: ProjectStatus;
  location: string | null;
  hero: string | null;
  gallery: string[];
  summary: string | null;
  description: string[];
  specs: Spec[];
  possession: string | null;
  price: string | null;
  featured: boolean;
  published: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
};

export type PostRow = {
  id: string;
  slug: string;
  title: string;
  dek: string | null;
  category: string | null;
  author: string | null;
  date_label: string | null;
  reading_time: string | null;
  image: string | null;
  body: string[];
  featured: boolean;
  published: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
};

export type NewsRow = {
  id: string;
  title: string;
  dek: string | null;
  date_label: string | null;
  image: string | null;
  link: string | null;
  published: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
};

export type PressRow = {
  id: string;
  title: string;
  publication: string | null;
  quote: string | null;
  date_label: string | null;
  link: string | null;
  published: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
};

export type GalleryRow = {
  id: string;
  title: string | null;
  image_url: string;
  alt: string | null;
  tag: string | null;
  sort_order: number;
  created_at: string;
};

export type SubscriberRow = {
  id: string;
  email: string;
  source: string;
  status: "subscribed" | "unsubscribed";
  created_at: string;
};

export type CareerPosition = {
  id: string;
  title: string;
  department: string | null;
  location: string | null;
  type: string | null;
  summary: string | null;
  description: string[];
  published: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
};

export type ApplicationStatus =
  | "new"
  | "reviewing"
  | "interview"
  | "hired"
  | "rejected"
  | "closed";
export const APPLICATION_STATUSES: ApplicationStatus[] = [
  "new",
  "reviewing",
  "interview",
  "hired",
  "rejected",
  "closed",
];

export type CareerApplication = {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  position_id: string | null;
  position_title: string | null;
  message: string | null;
  resume_url: string | null;
  source: string;
  status: ApplicationStatus;
  notes: string | null;
  created_at: string;
  updated_at: string;
};
