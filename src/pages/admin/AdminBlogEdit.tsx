import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { ArrowLeft, Eye, Loader2, Pencil, Save, Trash2 } from "lucide-react";
import Seo from "@/components/seo/Seo";
import AdminLayout from "@/components/admin/AdminLayout";
import { getSupabase, type PostRow } from "@/lib/supabase";
import { useAdminSession } from "@/lib/admin-auth";
import { CATEGORIES } from "@/data/posts";
import { readingTimeFor } from "@/lib/use-posts";

const input =
  "w-full bg-[rgba(78,115,83,0.04)] border border-line-dark rounded-md px-3.5 py-2.5 text-[14px] text-ink placeholder:text-ink/40 outline-none focus:border-gold focus:bg-paper transition-colors";

function slugify(s: string) {
  return s
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

/** The editor keeps one text blob; the database keeps an array of paragraphs. */
const toParagraphs = (text: string) =>
  text
    .split(/\n\s*\n/)
    .map((p) => p.trim())
    .filter(Boolean);
const fromParagraphs = (body: string[]) => (body ?? []).join("\n\n");

type Form = {
  slug: string;
  title: string;
  dek: string;
  category: string;
  author: string;
  date_label: string;
  reading_time: string;
  image: string;
  bodyText: string;
  featured: boolean;
  published: boolean;
  sort_order: number;
};

const EMPTY: Form = {
  slug: "",
  title: "",
  dek: "",
  category: "Vivanterra Notes",
  author: "",
  date_label: "",
  reading_time: "",
  image: "",
  bodyText: "",
  featured: false,
  published: true,
  sort_order: 0,
};

export default function AdminBlogEdit() {
  const { id } = useParams<{ id: string }>();
  const isNew = !id || id === "new";
  const nav = useNavigate();
  const { email } = useAdminSession();

  const [f, setF] = useState<Form>(EMPTY);
  const initial = useRef<string>(JSON.stringify(EMPTY));
  const [loading, setLoading] = useState(!isNew);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [tab, setTab] = useState<"write" | "preview">("write");

  const set = useCallback(<K extends keyof Form>(k: K, v: Form[K]) => {
    setF((prev) => ({ ...prev, [k]: v }));
  }, []);

  useEffect(() => {
    if (isNew) {
      const now = new Date().toLocaleString("en-GB", { month: "long", year: "numeric" });
      const seeded = { ...EMPTY, date_label: now, author: email ?? "" };
      setF(seeded);
      initial.current = JSON.stringify(seeded);
      return;
    }
    (async () => {
      try {
        const { data, error } = await getSupabase()
          .from("vivanterra_posts")
          .select("*")
          .eq("id", id)
          .single();
        if (error) throw error;
        const p = data as PostRow;
        const loaded: Form = {
          slug: p.slug,
          title: p.title,
          dek: p.dek ?? "",
          category: p.category ?? "",
          author: p.author ?? "",
          date_label: p.date_label ?? "",
          reading_time: p.reading_time ?? "",
          image: p.image ?? "",
          bodyText: fromParagraphs(p.body),
          featured: p.featured,
          published: p.published,
          sort_order: p.sort_order ?? 0,
        };
        setF(loaded);
        initial.current = JSON.stringify(loaded);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load");
      } finally {
        setLoading(false);
      }
    })();
  }, [id, isNew, email]);

  const paragraphs = useMemo(() => toParagraphs(f.bodyText), [f.bodyText]);
  const words = useMemo(
    () => paragraphs.join(" ").split(/\s+/).filter(Boolean).length,
    [paragraphs],
  );
  const autoReadingTime = useMemo(() => readingTimeFor(paragraphs), [paragraphs]);
  const dirty = JSON.stringify(f) !== initial.current;

  // Warn before losing an unsaved draft.
  useEffect(() => {
    if (!dirty) return;
    const onBeforeUnload = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      e.returnValue = "";
    };
    window.addEventListener("beforeunload", onBeforeUnload);
    return () => window.removeEventListener("beforeunload", onBeforeUnload);
  }, [dirty]);

  async function save() {
    setError(null);
    setNotice(null);
    if (!f.title.trim()) return setError("Title is required.");
    if (paragraphs.length === 0) return setError("Give the post at least one paragraph of body text.");

    const slug = slugify(f.slug || f.title);
    if (!slug) return setError("Could not build a slug from that title — set one manually.");

    setSaving(true);
    try {
      const sb = getSupabase();

      // Slug is unique in the database; check first so the failure is readable.
      const { data: clash } = await sb
        .from("vivanterra_posts")
        .select("id")
        .eq("slug", slug)
        .maybeSingle();
      if (clash && (isNew || (clash as { id: string }).id !== id)) {
        setSaving(false);
        return setError(`The slug "${slug}" is already used by another post. Change the slug.`);
      }

      const payload = {
        slug,
        title: f.title.trim(),
        dek: f.dek.trim() || null,
        category: f.category.trim() || null,
        author: f.author.trim() || null,
        date_label: f.date_label.trim() || null,
        reading_time: f.reading_time.trim() || autoReadingTime,
        image: f.image.trim() || null,
        body: paragraphs,
        featured: f.featured,
        published: f.published,
        sort_order: Number.isFinite(f.sort_order) ? f.sort_order : 0,
      };

      if (isNew) {
        const { error } = await sb.from("vivanterra_posts").insert(payload);
        if (error) throw error;
      } else {
        const { error } = await sb.from("vivanterra_posts").update(payload).eq("id", id);
        if (error) throw error;
      }
      initial.current = JSON.stringify(f);
      nav("/admin/blogs");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Save failed");
    } finally {
      setSaving(false);
    }
  }

  async function remove() {
    if (isNew || !id) return;
    if (!window.confirm(`Delete "${f.title}"? This cannot be undone.`)) return;
    setError(null);
    setDeleting(true);
    try {
      // .delete() resolves without error when RLS simply matches no rows, so
      // ask for the deleted row back and treat "nothing returned" as a failure.
      const { data, error } = await getSupabase()
        .from("vivanterra_posts")
        .delete()
        .eq("id", id)
        .select("id");
      if (error) throw error;
      if (!data || data.length === 0) {
        throw new Error("Nothing was deleted — your account may not have permission.");
      }
      initial.current = JSON.stringify(f);
      nav("/admin/blogs");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Delete failed");
    } finally {
      setDeleting(false);
    }
  }

  if (loading) {
    return (
      <AdminLayout email={email}>
        <div className="flex items-center gap-3 text-ink/50">
          <Loader2 className="animate-spin" size={16} /> Loading…
        </div>
      </AdminLayout>
    );
  }

  return (
    <>
      <Seo title={isNew ? "Admin — new post" : "Admin — edit post"} description="Post editor." />
      <AdminLayout
        email={email}
        title={isNew ? "New post" : "Edit post"}
        subtitle={dirty ? "Unsaved changes" : undefined}
        actions={
          <div className="flex items-center gap-3">
            {!isNew && (
              <button
                type="button"
                onClick={remove}
                disabled={deleting}
                className="inline-flex items-center gap-1.5 h-11 px-4 rounded-md border border-[hsl(var(--destructive))]/40 text-[hsl(var(--destructive))] hover:bg-[hsl(var(--destructive))]/5 text-[11px] tracking-[0.16em] uppercase disabled:opacity-60"
              >
                {deleting ? <Loader2 className="animate-spin" size={13} /> : <Trash2 size={13} />} Delete
              </button>
            )}
            <button
              type="button"
              onClick={save}
              disabled={saving}
              className="inline-flex items-center gap-2 h-11 px-5 rounded-md bg-gold text-ink hover:bg-ink hover:text-paper text-[11px] tracking-[0.18em] uppercase font-semibold disabled:opacity-60"
            >
              {saving ? <Loader2 className="animate-spin" size={14} /> : <Save size={14} />}
              {f.published ? "Save & publish" : "Save draft"}
            </button>
          </div>
        }
      >
        <Link
          to="/admin/blogs"
          className="inline-flex items-center gap-1 mb-7 text-[11px] uppercase tracking-[0.18em] text-ink/55 hover:text-gold"
        >
          <ArrowLeft size={13} /> All posts
        </Link>

        {error && (
          <div className="p-4 border border-[hsl(var(--destructive))]/30 bg-[hsl(var(--destructive))]/5 text-[hsl(var(--destructive))] text-sm rounded-md mb-6">
            {error}
          </div>
        )}
        {notice && (
          <div className="p-4 border border-gold/40 bg-gold/5 text-ink text-sm rounded-md mb-6">{notice}</div>
        )}

        <div className="grid lg:grid-cols-3 gap-6 max-w-5xl">
          <div className="lg:col-span-2 space-y-5">
            <div className="bg-paper border border-line-dark rounded-lg p-6 space-y-4">
              <L label="Title">
                <input
                  className={input}
                  value={f.title}
                  onChange={(e) => set("title", e.target.value)}
                  placeholder="What is this essay called?"
                />
              </L>
              <L label="Slug">
                <div className="flex gap-2">
                  <input
                    className={input}
                    value={f.slug}
                    onChange={(e) => set("slug", e.target.value)}
                    placeholder={slugify(f.title) || "auto-generated-from-title"}
                  />
                  <button
                    type="button"
                    onClick={() => set("slug", slugify(f.title))}
                    disabled={!f.title}
                    className="shrink-0 px-3 rounded-md border border-line-dark text-[10px] tracking-[0.16em] uppercase text-ink/60 hover:text-gold hover:border-gold disabled:opacity-40"
                  >
                    From title
                  </button>
                </div>
                <span className="block mt-1.5 text-[11px] text-ink/45">
                  /blogs/{slugify(f.slug || f.title) || "…"}
                </span>
              </L>
              <L label="Dek (summary shown on cards)">
                <textarea
                  rows={2}
                  className={`${input} resize-none`}
                  value={f.dek}
                  onChange={(e) => set("dek", e.target.value)}
                />
              </L>
            </div>

            <div className="bg-paper border border-line-dark rounded-lg overflow-hidden">
              <div className="flex items-center justify-between border-b border-line-dark px-4">
                <div className="flex">
                  {(["write", "preview"] as const).map((t) => (
                    <button
                      key={t}
                      type="button"
                      onClick={() => setTab(t)}
                      className={`inline-flex items-center gap-1.5 px-4 py-3 text-[11px] tracking-[0.16em] uppercase border-b-2 -mb-px transition-colors ${
                        tab === t
                          ? "border-gold text-ink"
                          : "border-transparent text-ink/45 hover:text-ink"
                      }`}
                    >
                      {t === "write" ? <Pencil size={12} /> : <Eye size={12} />} {t}
                    </button>
                  ))}
                </div>
                <span className="text-[11px] text-ink/45 tabular-nums">
                  {paragraphs.length} para · {words} words · {autoReadingTime}
                </span>
              </div>

              {tab === "write" ? (
                <div className="p-6">
                  <textarea
                    rows={18}
                    className={`${input} leading-[1.7] font-[Georgia,serif] text-[15px]`}
                    value={f.bodyText}
                    onChange={(e) => set("bodyText", e.target.value)}
                    placeholder={"Write the essay here.\n\nLeave a blank line between paragraphs — each block becomes its own paragraph on the site."}
                  />
                  <p className="mt-2 text-[11px] text-ink/45">
                    One blank line separates paragraphs. Everything is saved as plain text.
                  </p>
                </div>
              ) : (
                <div className="p-6 max-h-[560px] overflow-auto">
                  {paragraphs.length === 0 ? (
                    <p className="text-ink/45 text-sm">Nothing to preview yet.</p>
                  ) : (
                    paragraphs.map((para, i) => (
                      <p
                        key={i}
                        className="text-ink/85 mb-5 leading-[1.85] text-[16px]"
                        style={{ fontFamily: "Georgia, serif" }}
                      >
                        {para}
                      </p>
                    ))
                  )}
                </div>
              )}
            </div>
          </div>

          <div className="space-y-5">
            <div className="bg-paper border border-line-dark rounded-lg p-6 space-y-4">
              <L label="Category">
                <input
                  className={input}
                  list="vivanterra-post-categories"
                  value={f.category}
                  onChange={(e) => set("category", e.target.value)}
                  placeholder="Pick one, or type a new one"
                />
                <datalist id="vivanterra-post-categories">
                  {CATEGORIES.map((c) => (
                    <option key={c} value={c} />
                  ))}
                </datalist>
              </L>
              <L label="Author">
                <input className={input} value={f.author} onChange={(e) => set("author", e.target.value)} />
              </L>
              <L label="Date label">
                <input
                  className={input}
                  value={f.date_label}
                  onChange={(e) => set("date_label", e.target.value)}
                  placeholder="April 2026"
                />
              </L>
              <L label="Reading time">
                <input
                  className={input}
                  value={f.reading_time}
                  onChange={(e) => set("reading_time", e.target.value)}
                  placeholder={autoReadingTime}
                />
                <span className="block mt-1.5 text-[11px] text-ink/45">
                  Left blank, {autoReadingTime} is used.
                </span>
              </L>
              <L label="Sort order">
                <input
                  type="number"
                  className={input}
                  value={f.sort_order}
                  onChange={(e) => set("sort_order", Number(e.target.value))}
                />
                <span className="block mt-1.5 text-[11px] text-ink/45">Lower numbers appear first.</span>
              </L>
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={f.featured}
                  onChange={(e) => set("featured", e.target.checked)}
                  className="w-4 h-4 accent-[var(--gold)]"
                />
                <span className="text-sm text-ink">Featured</span>
              </label>
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={f.published}
                  onChange={(e) => set("published", e.target.checked)}
                  className="w-4 h-4 accent-[var(--gold)]"
                />
                <span className="text-sm text-ink">
                  Published {f.published ? "" : "— saved as a draft, hidden from the site"}
                </span>
              </label>
            </div>

            <div className="bg-paper border border-line-dark rounded-lg p-6">
              <L label="Cover image URL">
                <input
                  className={input}
                  value={f.image}
                  onChange={(e) => set("image", e.target.value)}
                  placeholder="https://… or /bengaluru/…"
                />
              </L>
              {f.image && (
                <div className="mt-3 aspect-[16/10] rounded-md overflow-hidden bg-ink/5 border border-line-dark">
                  <img src={f.image} alt="" className="h-full w-full object-cover" />
                </div>
              )}
            </div>
          </div>
        </div>
      </AdminLayout>
    </>
  );
}

function L({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <span className="block text-[11px] tracking-[0.12em] uppercase text-ink/55 mb-1.5">{label}</span>
      {children}
    </div>
  );
}
