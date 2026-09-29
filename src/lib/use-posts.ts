import { useEffect, useState } from "react";
import {
  getPosts as getStaticPosts,
  getPostBySlug as getStaticBySlug,
  type Post,
} from "@/data/posts";
import { getSupabase, supabaseConfigured, type PostRow } from "@/lib/supabase";

/** Rough reading time, used when a post doesn't carry its own. */
export function readingTimeFor(body: string[]): string {
  const words = body.join(" ").trim().split(/\s+/).filter(Boolean).length;
  return `${Math.max(1, Math.round(words / 200))} min read`;
}

function mapRow(r: PostRow): Post {
  const body = r.body ?? [];
  return {
    slug: r.slug,
    title: r.title,
    dek: r.dek ?? "",
    category: r.category ?? "Vivanterra Notes",
    author: r.author ?? "Vivanterra",
    date: r.date_label ?? "",
    readingTime: r.reading_time?.trim() || readingTimeFor(body),
    image: r.image ?? "",
    body,
    featured: r.featured,
  };
}

/**
 * Published posts, database first, falling back to the built-in set when
 * Supabase is unconfigured, errors, or has nothing. Mirrors use-projects so
 * the site keeps working either way.
 */
export function usePosts() {
  const [posts, setPosts] = useState<Post[]>(() => getStaticPosts());
  const [loading, setLoading] = useState(supabaseConfigured);

  useEffect(() => {
    if (!supabaseConfigured) return;
    let cancelled = false;
    (async () => {
      try {
        const { data, error } = await getSupabase()
          .from("vivanterra_posts")
          .select("*")
          .eq("published", true)
          .order("sort_order", { ascending: true });
        if (cancelled) return;
        if (!error && data && data.length > 0) {
          setPosts((data as PostRow[]).map(mapRow));
        }
      } catch {
        /* keep the static fallback */
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  return { posts, loading };
}

/** Single post by slug — database first, static fallback. */
export function usePost(slug: string) {
  const [post, setPost] = useState<Post | undefined>(() => getStaticBySlug(slug));
  const [loading, setLoading] = useState(supabaseConfigured);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (!supabaseConfigured) {
      setNotFound(!getStaticBySlug(slug));
      return;
    }
    let cancelled = false;
    setLoading(true);
    setNotFound(false);
    (async () => {
      try {
        const { data, error } = await getSupabase()
          .from("vivanterra_posts")
          .select("*")
          .eq("slug", slug)
          .eq("published", true)
          .maybeSingle();
        if (cancelled) return;
        if (!error && data) {
          setPost(mapRow(data as PostRow));
        } else if (!getStaticBySlug(slug)) {
          // Nothing in the database and nothing built in.
          setNotFound(true);
        }
      } catch {
        if (!cancelled && !getStaticBySlug(slug)) setNotFound(true);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [slug]);

  return { post, loading, notFound };
}

/**
 * Posts sharing a category, falling back to any other post so the "keep
 * reading" row is never empty.
 */
export function relatedFrom(posts: Post[], slug: string, n = 3): Post[] {
  const current = posts.find((p) => p.slug === slug);
  if (!current) return posts.filter((p) => p.slug !== slug).slice(0, n);
  const others = posts.filter((p) => p.slug !== slug);
  const sameCategory = others.filter((p) => p.category === current.category);
  return [...sameCategory, ...others.filter((p) => p.category !== current.category)].slice(0, n);
}
