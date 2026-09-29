-- Vivanterra — full database schema.
-- Apply to a fresh Supabase project via the SQL Editor, or
--   supabase db execute --file supabase/schema.sql
--
-- Tiers:
--   * published content  -> readable by anon
--   * submissions        -> no anon access; /api/* writes with the service-role key
--   * everything else    -> admins only, per the vivanterra_admin_users allowlist

-- ── helpers ────────────────────────────────────────────────────────────
create or replace function public.vivanterra_touch_updated_at()
returns trigger language plpgsql set search_path = '' as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- ── content ────────────────────────────────────────────────────────────
create table public.vivanterra_projects (
  id          uuid primary key default gen_random_uuid(),
  slug        text not null unique,
  title       text not null,
  tagline     text,
  status      text not null default 'Upcoming' check (status in ('Ongoing','Upcoming','Completed')),
  location    text,
  hero        text,
  gallery     jsonb not null default '[]'::jsonb,
  summary     text,
  description jsonb not null default '[]'::jsonb,
  specs       jsonb not null default '[]'::jsonb,
  possession  text,
  price       text,
  featured    boolean not null default false,
  published   boolean not null default true,
  sort_order  integer not null default 0,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

create table public.vivanterra_project_status_history (
  id          uuid primary key default gen_random_uuid(),
  project_id  uuid not null references public.vivanterra_projects(id) on delete cascade,
  from_status text check (from_status in ('Ongoing','Upcoming','Completed')),
  to_status   text not null check (to_status in ('Ongoing','Upcoming','Completed')),
  changed_by  text,
  created_at  timestamptz not null default now()
);

create table public.vivanterra_posts (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  dek text, category text, author text,
  date_label text, reading_time text, image text,
  body jsonb not null default '[]'::jsonb,
  featured boolean not null default false,
  published boolean not null default true,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.vivanterra_news (
  id uuid primary key default gen_random_uuid(),
  title text not null, dek text, date_label text, image text, link text,
  published boolean not null default true,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.vivanterra_press_releases (
  id uuid primary key default gen_random_uuid(),
  title text not null, publication text, quote text, date_label text, link text,
  published boolean not null default true,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.vivanterra_gallery (
  id uuid primary key default gen_random_uuid(),
  title text, image_url text not null, alt text, tag text,
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);

create table public.vivanterra_career_positions (
  id uuid primary key default gen_random_uuid(),
  title text not null, department text, location text, type text, summary text,
  description jsonb not null default '[]'::jsonb,
  published boolean not null default true,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ── submissions (written by /api/* with the service-role key) ──────────
create table public.vivanterra_enquiries (
  id uuid primary key default gen_random_uuid(),
  name text not null, email text not null, phone text,
  scope text, budget text, message text not null,
  project_slug text,
  source text not null default 'vivanterra-website',
  status text not null default 'new' check (status in ('new','contacted','qualified','closed','spam')),
  notes text, user_agent text, ip_address text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.vivanterra_leads (
  id uuid primary key default gen_random_uuid(),
  name text, email text not null, phone text,
  kind text not null default 'other' check (kind in ('popup','newsletter','concierge','other')),
  message text, page_path text, project_slug text,
  source text not null default 'vivanterra-website',
  status text not null default 'new' check (status in ('new','contacted','qualified','closed','spam')),
  notes text, user_agent text, ip_address text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.vivanterra_subscribers (
  id uuid primary key default gen_random_uuid(),
  email text not null unique,
  source text not null default 'vivanterra-website',
  status text not null default 'subscribed' check (status in ('subscribed','unsubscribed')),
  created_at timestamptz not null default now()
);

create table public.vivanterra_career_applications (
  id uuid primary key default gen_random_uuid(),
  name text not null, email text not null, phone text,
  position_id uuid references public.vivanterra_career_positions(id) on delete set null,
  position_title text, message text, resume_url text,
  source text not null default 'career-page',
  status text not null default 'new' check (status in ('new','reviewing','interview','hired','rejected','closed')),
  notes text, user_agent text, ip_address text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ── admin ──────────────────────────────────────────────────────────────
create table public.vivanterra_admin_users (
  id uuid primary key default gen_random_uuid(),
  email text not null unique,
  name text,
  created_at timestamptz not null default now()
);

create table public.vivanterra_settings (
  key text primary key,
  value jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

-- ── indexes ────────────────────────────────────────────────────────────
create index on public.vivanterra_projects (published, sort_order);
create index on public.vivanterra_projects (status);
create index on public.vivanterra_posts (published, sort_order);
create index on public.vivanterra_news (published, sort_order);
create index on public.vivanterra_press_releases (published, sort_order);
create index on public.vivanterra_gallery (sort_order);
create index on public.vivanterra_career_positions (published, sort_order);
create index on public.vivanterra_project_status_history (project_id, created_at desc);
create index on public.vivanterra_enquiries (created_at desc);
create index on public.vivanterra_enquiries (status);
create index on public.vivanterra_leads (created_at desc);
create index on public.vivanterra_leads (status);
create index on public.vivanterra_career_applications (created_at desc);
create index on public.vivanterra_career_applications (position_id);

-- ── updated_at triggers ────────────────────────────────────────────────
create trigger touch before update on public.vivanterra_projects           for each row execute function public.vivanterra_touch_updated_at();
create trigger touch before update on public.vivanterra_posts              for each row execute function public.vivanterra_touch_updated_at();
create trigger touch before update on public.vivanterra_news               for each row execute function public.vivanterra_touch_updated_at();
create trigger touch before update on public.vivanterra_press_releases     for each row execute function public.vivanterra_touch_updated_at();
create trigger touch before update on public.vivanterra_career_positions   for each row execute function public.vivanterra_touch_updated_at();
create trigger touch before update on public.vivanterra_enquiries          for each row execute function public.vivanterra_touch_updated_at();
create trigger touch before update on public.vivanterra_leads              for each row execute function public.vivanterra_touch_updated_at();
create trigger touch before update on public.vivanterra_career_applications for each row execute function public.vivanterra_touch_updated_at();
create trigger touch before update on public.vivanterra_settings           for each row execute function public.vivanterra_touch_updated_at();

-- Lives in `private` so PostgREST does not expose it as /rest/v1/rpc/...
create schema if not exists private;
revoke all on schema private from public, anon;
grant usage on schema private to authenticated;

create or replace function private.vivanterra_is_admin()
returns boolean language sql stable security definer set search_path = '' as $$
  select exists (
    select 1 from public.vivanterra_admin_users a
    where lower(a.email) = lower(coalesce(auth.jwt() ->> 'email', ''))
  );
$$;
revoke all on function private.vivanterra_is_admin() from public, anon;
grant execute on function private.vivanterra_is_admin() to authenticated;

-- ── row level security ─────────────────────────────────────────────────
alter table public.vivanterra_projects               enable row level security;
alter table public.vivanterra_project_status_history enable row level security;
alter table public.vivanterra_posts                  enable row level security;
alter table public.vivanterra_news                   enable row level security;
alter table public.vivanterra_press_releases         enable row level security;
alter table public.vivanterra_gallery                enable row level security;
alter table public.vivanterra_career_positions       enable row level security;
alter table public.vivanterra_enquiries              enable row level security;
alter table public.vivanterra_leads                  enable row level security;
alter table public.vivanterra_subscribers            enable row level security;
alter table public.vivanterra_career_applications    enable row level security;
alter table public.vivanterra_admin_users            enable row level security;
alter table public.vivanterra_settings               enable row level security;

create policy "public reads published" on public.vivanterra_projects          for select to anon, authenticated using (published = true);
create policy "public reads published" on public.vivanterra_posts             for select to anon, authenticated using (published = true);
create policy "public reads published" on public.vivanterra_news              for select to anon, authenticated using (published = true);
create policy "public reads published" on public.vivanterra_press_releases    for select to anon, authenticated using (published = true);
create policy "public reads published" on public.vivanterra_career_positions  for select to anon, authenticated using (published = true);
create policy "public reads gallery"   on public.vivanterra_gallery           for select to anon, authenticated using (true);
create policy "public reads settings"  on public.vivanterra_settings          for select to anon, authenticated using (true);

create policy "admins manage" on public.vivanterra_projects               for all to authenticated using (private.vivanterra_is_admin()) with check (private.vivanterra_is_admin());
create policy "admins manage" on public.vivanterra_posts                  for all to authenticated using (private.vivanterra_is_admin()) with check (private.vivanterra_is_admin());
create policy "admins manage" on public.vivanterra_news                   for all to authenticated using (private.vivanterra_is_admin()) with check (private.vivanterra_is_admin());
create policy "admins manage" on public.vivanterra_press_releases         for all to authenticated using (private.vivanterra_is_admin()) with check (private.vivanterra_is_admin());
create policy "admins manage" on public.vivanterra_gallery                for all to authenticated using (private.vivanterra_is_admin()) with check (private.vivanterra_is_admin());
create policy "admins manage" on public.vivanterra_career_positions       for all to authenticated using (private.vivanterra_is_admin()) with check (private.vivanterra_is_admin());
create policy "admins manage" on public.vivanterra_settings               for all to authenticated using (private.vivanterra_is_admin()) with check (private.vivanterra_is_admin());
create policy "admins manage" on public.vivanterra_project_status_history for all to authenticated using (private.vivanterra_is_admin()) with check (private.vivanterra_is_admin());
create policy "admins manage" on public.vivanterra_enquiries              for all to authenticated using (private.vivanterra_is_admin()) with check (private.vivanterra_is_admin());
create policy "admins manage" on public.vivanterra_leads                  for all to authenticated using (private.vivanterra_is_admin()) with check (private.vivanterra_is_admin());
create policy "admins manage" on public.vivanterra_subscribers            for all to authenticated using (private.vivanterra_is_admin()) with check (private.vivanterra_is_admin());
create policy "admins manage" on public.vivanterra_career_applications    for all to authenticated using (private.vivanterra_is_admin()) with check (private.vivanterra_is_admin());

-- A signed-in user sees only their own allowlist row. src/lib/admin-auth.ts
-- treats "one row back" as admin, "no rows" as not.
create policy "see own allowlist row" on public.vivanterra_admin_users
  for select to authenticated using (lower(email) = lower(coalesce(auth.jwt() ->> 'email', '')));
create policy "admins manage allowlist" on public.vivanterra_admin_users
  for all to authenticated using (private.vivanterra_is_admin()) with check (private.vivanterra_is_admin());
