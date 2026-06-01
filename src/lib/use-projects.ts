import { useEffect, useState } from "react";
import {
  getProjects as getStaticProjects,
  getProjectBySlug as getStaticBySlug,
  type Project,
  type ProjectStatus,
} from "@/data/projects";
import { getSupabase, supabaseConfigured, type ProjectRow } from "@/lib/supabase";

/**
 * Maps a DB row to the public Project shape used by the site components.
 */
function mapRow(r: ProjectRow): Project {
  return {
    slug: r.slug,
    title: r.title,
    tagline: r.tagline ?? "",
    status: r.status,
    location: r.location ?? "",
    hero: r.hero ?? "",
    gallery: r.gallery ?? [],
    summary: r.summary ?? "",
    description: r.description ?? [],
    specs: r.specs ?? [],
    possession: r.possession ?? undefined,
    price: r.price ?? undefined,
    featured: r.featured,
  };
}

/**
 * Returns published projects, preferring the database and falling back to the
 * built-in TS data when Supabase is unconfigured, errors, or returns nothing.
 * This keeps the site working at all times while letting the admin drive content.
 */
export function useProjects(status?: ProjectStatus) {
  const [projects, setProjects] = useState<Project[]>(() =>
    getStaticProjects(status),
  );
  const [loading, setLoading] = useState(supabaseConfigured);

  useEffect(() => {
    if (!supabaseConfigured) return;
    let cancelled = false;
    (async () => {
      try {
        let q = getSupabase()
          .from("vivanterra_projects")
          .select("*")
          .eq("published", true)
          .order("sort_order", { ascending: true });
        if (status) q = q.eq("status", status);
        const { data, error } = await q;
        if (cancelled) return;
        if (!error && data && data.length > 0) {
          setProjects((data as ProjectRow[]).map(mapRow));
        }
      } catch {
        /* keep static fallback */
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [status]);

  return { projects, loading };
}

/** Single project by slug — DB first, static fallback. */
export function useProject(slug: string) {
  const [project, setProject] = useState<Project | undefined>(() =>
    getStaticBySlug(slug),
  );
  const [loading, setLoading] = useState(supabaseConfigured);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (!supabaseConfigured) {
      setNotFound(!getStaticBySlug(slug));
      return;
    }
    let cancelled = false;
    (async () => {
      try {
        const { data, error } = await getSupabase()
          .from("vivanterra_projects")
          .select("*")
          .eq("slug", slug)
          .eq("published", true)
          .maybeSingle();
        if (cancelled) return;
        if (!error && data) {
          setProject(mapRow(data as ProjectRow));
          setNotFound(false);
        } else if (!getStaticBySlug(slug)) {
          setNotFound(true);
        }
      } catch {
        /* keep static fallback */
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [slug]);

  return { project, loading, notFound };
}
