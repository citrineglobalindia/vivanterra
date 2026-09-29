import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  Copy,
  Eye,
  EyeOff,
  Loader2,
  Pencil,
  PenSquare,
  Plus,
  Search,
  Trash2,
} from "lucide-react";
import Seo from "@/components/seo/Seo";
import AdminLayout from "@/components/admin/AdminLayout";
import { getSupabase, type PostRow } from "@/lib/supabase";
import { useAdminSession } from "@/lib/admin-auth";

type Filter = "all" | "published" | "draft";

export default function AdminBlogs() {
  const { email } = useAdminSession();
  const [rows, setRows] = useState<PostRow[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<Filter>("all");
  const [busy, setBusy] = useState<string | null>(null);

  async function load() {
    try {
      const { data, error } = await getSupabase()
        .from("vivanterra_posts")
        .select("*")
        .order("sort_order", { ascending: true })
        .order("created_at", { ascending: false });
      if (error) throw error;
      setRows((data as PostRow[]) ?? []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load");
    }
  }
  useEffect(() => {
    load();
  }, []);

  const visible = useMemo(() => {
    let xs = rows ?? [];
    if (filter !== "all") xs = xs.filter((p) => (filter === "published" ? p.published : !p.published));
    const q = query.trim().toLowerCase();
    if (q) {
      xs = xs.filter((p) =>
        [p.title, p.dek, p.author, p.category, p.slug]
          .filter(Boolean)
          .some((v) => String(v).toLowerCase().includes(q)),
      );
    }
    return xs;
  }, [rows, filter, query]);

  const counts = useMemo(() => {
    const all = rows ?? [];
    return {
      all: all.length,
      published: all.filter((p) => p.published).length,
      draft: all.filter((p) => !p.published).length,
    };
  }, [rows]);

  async function remove(post: PostRow) {
    if (!window.confirm(`Delete "${post.title}"? This cannot be undone.`)) return;
    setError(null);
    setNotice(null);
    setBusy(post.id);
    try {
      // Ask for the row back: an RLS-blocked delete otherwise returns no error
      // and it looks like it worked.
      const { data, error } = await getSupabase()
        .from("vivanterra_posts")
        .delete()
        .eq("id", post.id)
        .select("id");
      if (error) throw error;
      if (!data || data.length === 0) {
        throw new Error("Nothing was deleted — your account may not have permission.");
      }
      setRows((prev) => (prev ?? []).filter((p) => p.id !== post.id));
      setNotice(`Deleted "${post.title}".`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Delete failed");
    } finally {
      setBusy(null);
    }
  }

  async function togglePublished(post: PostRow) {
    setError(null);
    setNotice(null);
    setBusy(post.id);
    try {
      const { data, error } = await getSupabase()
        .from("vivanterra_posts")
        .update({ published: !post.published })
        .eq("id", post.id)
        .select("id, published");
      if (error) throw error;
      if (!data || data.length === 0) {
        throw new Error("Nothing was updated — your account may not have permission.");
      }
      setRows((prev) =>
        (prev ?? []).map((p) => (p.id === post.id ? { ...p, published: !post.published } : p)),
      );
      setNotice(`"${post.title}" is now ${post.published ? "a draft" : "published"}.`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Update failed");
    } finally {
      setBusy(null);
    }
  }

  async function duplicate(post: PostRow) {
    setError(null);
    setNotice(null);
    setBusy(post.id);
    try {
      const base = `${post.slug}-copy`;
      const taken = new Set((rows ?? []).map((p) => p.slug));
      let slug = base;
      let n = 2;
      while (taken.has(slug)) slug = `${base}-${n++}`;

      const { data, error } = await getSupabase()
        .from("vivanterra_posts")
        .insert({
          slug,
          title: `${post.title} (copy)`,
          dek: post.dek,
          category: post.category,
          author: post.author,
          date_label: post.date_label,
          reading_time: post.reading_time,
          image: post.image,
          body: post.body,
          featured: false,
          published: false,
          sort_order: post.sort_order,
        })
        .select("*");
      if (error) throw error;
      if (data && data.length) {
        setRows((prev) => [...(prev ?? []), data[0] as PostRow]);
        setNotice(`Duplicated as a draft: "${post.title} (copy)".`);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Duplicate failed");
    } finally {
      setBusy(null);
    }
  }

  const chip = (f: Filter, label: string, n: number) => (
    <button
      key={f}
      type="button"
      onClick={() => setFilter(f)}
      className={`inline-flex items-center gap-2 h-9 px-3.5 rounded-full border text-[10px] tracking-[0.16em] uppercase transition-colors ${
        filter === f ? "bg-ink text-paper border-ink" : "border-line-dark text-ink/70 hover:border-gold hover:text-gold"
      }`}
    >
      {label}
      <span className={`tabular-nums ${filter === f ? "text-paper/70" : "text-ink/45"}`}>{n}</span>
    </button>
  );

  return (
    <>
      <Seo title="Admin — blogs" description="Manage journal posts." />
      <AdminLayout
        email={email}
        title="Blogs"
        subtitle="Journal / essay posts."
        actions={
          <Link
            to="/admin/blogs/new"
            className="inline-flex items-center gap-2 h-11 px-5 rounded-md bg-ink text-paper hover:bg-gold hover:text-ink transition-colors text-[11px] tracking-[0.16em] uppercase font-semibold"
          >
            <Plus size={15} /> New post
          </Link>
        }
      >
        {error && (
          <div className="p-4 border border-[hsl(var(--destructive))]/30 bg-[hsl(var(--destructive))]/5 text-[hsl(var(--destructive))] text-sm rounded-md mb-6">
            {error}
          </div>
        )}
        {notice && (
          <div className="p-4 border border-gold/40 bg-gold/5 text-ink text-sm rounded-md mb-6">{notice}</div>
        )}

        {rows !== null && rows.length > 0 && (
          <div className="flex flex-wrap items-center gap-3 mb-6">
            <div className="relative w-full sm:w-64">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-ink/45 pointer-events-none">
                <Search size={14} />
              </span>
              <input
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search posts…"
                className="w-full bg-[rgba(78,115,83,0.04)] border border-line-dark rounded-full pl-9 pr-4 h-9 text-sm text-ink placeholder:text-ink/40 outline-none focus:border-gold focus:bg-paper transition-colors"
              />
            </div>
            {chip("all", "All", counts.all)}
            {chip("published", "Published", counts.published)}
            {chip("draft", "Drafts", counts.draft)}
          </div>
        )}

        {rows === null && !error && (
          <div className="flex items-center gap-3 text-ink/50">
            <Loader2 className="animate-spin" size={16} /> Loading…
          </div>
        )}

        {rows && rows.length === 0 && (
          <div className="border border-dashed border-line-dark rounded-lg py-16 text-center text-ink/50">
            <PenSquare className="mx-auto mb-3 opacity-50" />
            No posts yet. Add one and it appears on the journal straight away.
          </div>
        )}

        {rows && rows.length > 0 && visible.length === 0 && (
          <div className="border border-dashed border-line-dark rounded-lg py-14 text-center text-ink/50">
            No posts match that search.
          </div>
        )}

        {visible.length > 0 && (
          <div className="border border-line-dark rounded-lg bg-paper overflow-hidden divide-y divide-line-dark">
            {visible.map((p) => (
              <div key={p.id} className="flex items-center gap-4 px-5 py-4">
                <div className="w-14 h-14 rounded-md bg-ink/5 overflow-hidden shrink-0">
                  {p.image && <img src={p.image} alt="" className="h-full w-full object-cover" />}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-ink truncate">{p.title}</span>
                    {!p.published && (
                      <span className="shrink-0 text-[9px] tracking-[0.16em] uppercase px-2 py-0.5 rounded-full bg-ink/10 text-ink/60">
                        Draft
                      </span>
                    )}
                    {p.featured && (
                      <span className="shrink-0 text-[9px] tracking-[0.16em] uppercase px-2 py-0.5 rounded-full bg-gold/25 text-ink/70">
                        Featured
                      </span>
                    )}
                  </div>
                  <div className="text-ink/55 text-xs truncate">
                    {[p.category, p.author, `/blogs/${p.slug}`].filter(Boolean).join(" · ")}
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  {busy === p.id && <Loader2 className="animate-spin text-ink/40" size={14} />}
                  <button
                    type="button"
                    onClick={() => togglePublished(p)}
                    disabled={busy === p.id}
                    title={p.published ? "Unpublish" : "Publish"}
                    className="inline-flex items-center justify-center h-9 w-9 rounded-md border border-line-dark text-ink/60 hover:border-gold hover:text-gold disabled:opacity-40"
                  >
                    {p.published ? <Eye size={13} /> : <EyeOff size={13} />}
                  </button>
                  <button
                    type="button"
                    onClick={() => duplicate(p)}
                    disabled={busy === p.id}
                    title="Duplicate as draft"
                    className="inline-flex items-center justify-center h-9 w-9 rounded-md border border-line-dark text-ink/60 hover:border-gold hover:text-gold disabled:opacity-40"
                  >
                    <Copy size={13} />
                  </button>
                  <Link
                    to={`/admin/blogs/${p.id}/edit`}
                    className="inline-flex items-center gap-1.5 h-9 px-4 rounded-md border border-line-dark text-ink hover:border-gold hover:text-gold text-[10px] tracking-[0.16em] uppercase"
                  >
                    <Pencil size={12} /> Edit
                  </Link>
                  <button
                    type="button"
                    onClick={() => remove(p)}
                    disabled={busy === p.id}
                    title="Delete"
                    className="inline-flex items-center justify-center h-9 w-9 rounded-md border border-[hsl(var(--destructive))]/35 text-[hsl(var(--destructive))] hover:bg-[hsl(var(--destructive))]/5 disabled:opacity-40"
                  >
                    <Trash2 size={13} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </AdminLayout>
    </>
  );
}
