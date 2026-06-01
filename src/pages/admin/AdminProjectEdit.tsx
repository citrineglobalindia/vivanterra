import { useEffect, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import {
  ArrowLeft,
  CheckCircle2,
  Loader2,
  Plus,
  Save,
  Trash2,
} from "lucide-react";
import Seo from "@/components/seo/Seo";
import AdminLayout from "@/components/admin/AdminLayout";
import {
  getSupabase,
  PROJECT_STATUSES,
  type ProjectRow,
  type ProjectStatus,
  type Spec,
} from "@/lib/supabase";
import { useAdminSession } from "@/lib/admin-auth";

type FormState = {
  slug: string;
  title: string;
  tagline: string;
  status: ProjectStatus;
  location: string;
  hero: string;
  gallery: string[];
  summary: string;
  description: string[];
  specs: Spec[];
  possession: string;
  price: string;
  featured: boolean;
  published: boolean;
};

const BLANK: FormState = {
  slug: "",
  title: "",
  tagline: "",
  status: "Upcoming",
  location: "",
  hero: "",
  gallery: [""],
  summary: "",
  description: [""],
  specs: [{ label: "Typology", value: "" }],
  possession: "",
  price: "",
  featured: false,
  published: true,
};

function slugify(s: string) {
  return s
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

export default function AdminProjectEdit() {
  const { id } = useParams<{ id: string }>();
  const isNew = !id || id === "new";
  const navigate = useNavigate();
  const { email } = useAdminSession();

  const [form, setForm] = useState<FormState>(BLANK);
  const [loading, setLoading] = useState(!isNew);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [originalStatus, setOriginalStatus] = useState<ProjectStatus | null>(null);
  const [slugTouched, setSlugTouched] = useState(false);

  useEffect(() => {
    if (isNew) return;
    let cancelled = false;
    (async () => {
      try {
        const { data, error } = await getSupabase()
          .from("vivanterra_projects")
          .select("*")
          .eq("id", id)
          .single();
        if (cancelled) return;
        if (error) throw error;
        const p = data as ProjectRow;
        setForm({
          slug: p.slug,
          title: p.title,
          tagline: p.tagline ?? "",
          status: p.status,
          location: p.location ?? "",
          hero: p.hero ?? "",
          gallery: p.gallery?.length ? p.gallery : [""],
          summary: p.summary ?? "",
          description: p.description?.length ? p.description : [""],
          specs: p.specs?.length ? p.specs : [{ label: "", value: "" }],
          possession: p.possession ?? "",
          price: p.price ?? "",
          featured: p.featured,
          published: p.published,
        });
        setOriginalStatus(p.status);
        setSlugTouched(true);
      } catch (err) {
        if (!cancelled)
          setError(err instanceof Error ? err.message : "Failed to load");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [id, isNew]);

  function set<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  async function save() {
    setError(null);
    if (!form.title.trim()) return setError("Title is required.");
    if (!form.slug.trim()) return setError("Slug is required.");
    setSaving(true);
    try {
      const sb = getSupabase();
      const payload = {
        slug: slugify(form.slug),
        title: form.title.trim(),
        tagline: form.tagline.trim() || null,
        status: form.status,
        location: form.location.trim() || null,
        hero: form.hero.trim() || null,
        gallery: form.gallery.map((g) => g.trim()).filter(Boolean),
        summary: form.summary.trim() || null,
        description: form.description.map((d) => d.trim()).filter(Boolean),
        specs: form.specs.filter((s) => s.label.trim() && s.value.trim()),
        possession: form.possession.trim() || null,
        price: form.price.trim() || null,
        featured: form.featured,
        published: form.published,
      };

      let projectId = id;
      if (isNew) {
        const { data, error } = await sb
          .from("vivanterra_projects")
          .insert(payload)
          .select("id")
          .single();
        if (error) throw error;
        projectId = data.id;
        await sb.from("vivanterra_project_status_history").insert({
          project_id: projectId,
          from_status: null,
          to_status: form.status,
          changed_by: email,
        });
      } else {
        const { error } = await sb
          .from("vivanterra_projects")
          .update(payload)
          .eq("id", id);
        if (error) throw error;
        if (originalStatus && originalStatus !== form.status) {
          await sb.from("vivanterra_project_status_history").insert({
            project_id: id,
            from_status: originalStatus,
            to_status: form.status,
            changed_by: email,
          });
        }
      }
      setSaved(true);
      setTimeout(() => navigate("/admin/projects"), 700);
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Save failed";
      setError(
        msg.includes("duplicate") || msg.includes("unique")
          ? "That slug is already used by another project. Pick a unique slug."
          : msg,
      );
    } finally {
      setSaving(false);
    }
  }

  async function remove() {
    if (isNew || !id) return;
    if (!window.confirm("Delete this project permanently? This cannot be undone."))
      return;
    setSaving(true);
    const { error } = await getSupabase()
      .from("vivanterra_projects")
      .delete()
      .eq("id", id);
    setSaving(false);
    if (error) {
      setError(error.message);
      return;
    }
    navigate("/admin/projects");
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
      <Seo title={isNew ? "Admin — new project" : "Admin — edit project"} description="Project editor." />
      <AdminLayout
        email={email}
        title={isNew ? "New project" : "Edit project"}
        actions={
          <div className="flex items-center gap-3">
            {!isNew && (
              <button
                type="button"
                onClick={remove}
                className="inline-flex items-center gap-1.5 h-11 px-4 rounded-md border border-[hsl(var(--destructive))]/40 text-[hsl(var(--destructive))] hover:bg-[hsl(var(--destructive))]/5 transition-colors text-[11px] tracking-[0.16em] uppercase"
              >
                <Trash2 size={13} /> Delete
              </button>
            )}
            <button
              type="button"
              onClick={save}
              disabled={saving}
              className="inline-flex items-center gap-2 h-11 px-5 rounded-md bg-gold text-ink hover:bg-ink hover:text-paper transition-colors text-[11px] tracking-[0.18em] uppercase font-semibold disabled:opacity-60"
            >
              {saving ? <Loader2 className="animate-spin" size={14} /> : saved ? <CheckCircle2 size={14} /> : <Save size={14} />}
              {saved ? "Saved" : "Save"}
            </button>
          </div>
        }
      >
        <Link
          to="/admin/projects"
          className="inline-flex items-center gap-1 mb-7 text-[11px] uppercase tracking-[0.18em] text-ink/55 hover:text-gold"
        >
          <ArrowLeft size={13} /> All projects
        </Link>

        {error && (
          <div className="p-4 border border-[hsl(var(--destructive))]/30 bg-[hsl(var(--destructive))]/5 text-[hsl(var(--destructive))] text-sm rounded-md mb-6">
            {error}
          </div>
        )}

        <div className="grid lg:grid-cols-3 gap-8 max-w-5xl">
          {/* Main column */}
          <div className="lg:col-span-2 space-y-6">
            <Section title="Basics">
              <Field label="Title">
                <input
                  className={input}
                  value={form.title}
                  onChange={(e) => {
                    set("title", e.target.value);
                    if (!slugTouched) set("slug", slugify(e.target.value));
                  }}
                  placeholder="Aurelia Bay"
                />
              </Field>
              <Field label="Slug (URL)">
                <input
                  className={input}
                  value={form.slug}
                  onChange={(e) => {
                    setSlugTouched(true);
                    set("slug", e.target.value);
                  }}
                  placeholder="aurelia-bay"
                />
                <p className="text-ink/45 text-xs mt-1">
                  Public URL: /projects/{slugify(form.slug) || "…"}
                </p>
              </Field>
              <Field label="Tagline">
                <input
                  className={input}
                  value={form.tagline}
                  onChange={(e) => set("tagline", e.target.value)}
                  placeholder="Eight residences above a quiet courtyard."
                />
              </Field>
              <Field label="Location">
                <input
                  className={input}
                  value={form.location}
                  onChange={(e) => set("location", e.target.value)}
                  placeholder="Sadashiva Nagar, Bengaluru"
                />
              </Field>
              <Field label="Summary (listing card)">
                <textarea
                  rows={2}
                  className={`${input} resize-none`}
                  value={form.summary}
                  onChange={(e) => set("summary", e.target.value)}
                />
              </Field>
            </Section>

            <Section title="Description (one paragraph per box)">
              <RepeatList
                items={form.description}
                onChange={(d) => set("description", d)}
                render={(val, onVal) => (
                  <textarea
                    rows={3}
                    className={`${input} resize-none`}
                    value={val}
                    onChange={(e) => onVal(e.target.value)}
                    placeholder="Paragraph…"
                  />
                )}
                addLabel="Add paragraph"
                blank=""
              />
            </Section>

            <Section title="Gallery image URLs">
              <RepeatList
                items={form.gallery}
                onChange={(g) => set("gallery", g)}
                render={(val, onVal) => (
                  <input
                    className={input}
                    value={val}
                    onChange={(e) => onVal(e.target.value)}
                    placeholder="https://…"
                  />
                )}
                addLabel="Add image"
                blank=""
              />
            </Section>

            <Section title="Specifications">
              {form.specs.map((spec, i) => (
                <div key={i} className="flex gap-2 mb-2">
                  <input
                    className={`${input} flex-1`}
                    value={spec.label}
                    onChange={(e) => {
                      const next = [...form.specs];
                      next[i] = { ...next[i], label: e.target.value };
                      set("specs", next);
                    }}
                    placeholder="Configuration"
                  />
                  <input
                    className={`${input} flex-1`}
                    value={spec.value}
                    onChange={(e) => {
                      const next = [...form.specs];
                      next[i] = { ...next[i], value: e.target.value };
                      set("specs", next);
                    }}
                    placeholder="3 & 4 BHK"
                  />
                  <button
                    type="button"
                    onClick={() => set("specs", form.specs.filter((_, j) => j !== i))}
                    className="shrink-0 w-10 rounded-md border border-line-dark text-ink/50 hover:text-[hsl(var(--destructive))] hover:border-[hsl(var(--destructive))]/40"
                  >
                    <Trash2 size={13} className="mx-auto" />
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={() => set("specs", [...form.specs, { label: "", value: "" }])}
                className="inline-flex items-center gap-1.5 text-[11px] tracking-[0.16em] uppercase text-ink/60 hover:text-gold mt-1"
              >
                <Plus size={13} /> Add spec
              </button>
            </Section>
          </div>

          {/* Sidebar column */}
          <div className="space-y-6">
            <Section title="Status & visibility">
              <Field label="Status">
                <select
                  className={input}
                  value={form.status}
                  onChange={(e) => set("status", e.target.value as ProjectStatus)}
                >
                  {PROJECT_STATUSES.map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </Field>
              <Field label="Possession">
                <input
                  className={input}
                  value={form.possession}
                  onChange={(e) => set("possession", e.target.value)}
                  placeholder="Q1 2027"
                />
              </Field>
              <Field label="Price">
                <input
                  className={input}
                  value={form.price}
                  onChange={(e) => set("price", e.target.value)}
                  placeholder="₹ 8.5 Cr Onwards*"
                />
              </Field>
              <label className="flex items-center gap-3 mt-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={form.featured}
                  onChange={(e) => set("featured", e.target.checked)}
                  className="w-4 h-4 accent-[var(--gold)]"
                />
                <span className="text-sm text-ink">Featured</span>
              </label>
              <label className="flex items-center gap-3 mt-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={form.published}
                  onChange={(e) => set("published", e.target.checked)}
                  className="w-4 h-4 accent-[var(--gold)]"
                />
                <span className="text-sm text-ink">Published (visible on site)</span>
              </label>
            </Section>

            <Section title="Hero image">
              <Field label="Hero image URL">
                <input
                  className={input}
                  value={form.hero}
                  onChange={(e) => set("hero", e.target.value)}
                  placeholder="https://…"
                />
              </Field>
              {form.hero && (
                <div className="mt-3 aspect-[16/10] rounded-md overflow-hidden bg-ink/5 border border-line-dark">
                  <img src={form.hero} alt="" className="h-full w-full object-cover" />
                </div>
              )}
            </Section>
          </div>
        </div>
      </AdminLayout>
    </>
  );
}

const input =
  "w-full bg-[rgba(78,115,83,0.04)] border border-line-dark rounded-md px-3.5 py-2.5 text-[14px] text-ink placeholder:text-ink/40 outline-none focus:border-gold focus:bg-paper transition-colors";

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-paper border border-line-dark rounded-lg p-5 md:p-6">
      <div className="eyebrow text-gold mb-4 text-[10px]">{title}</div>
      {children}
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="mb-4 last:mb-0">
      <span className="block text-[11px] tracking-[0.12em] uppercase text-ink/55 mb-1.5">
        {label}
      </span>
      {children}
    </div>
  );
}

function RepeatList({
  items,
  onChange,
  render,
  addLabel,
  blank,
}: {
  items: string[];
  onChange: (items: string[]) => void;
  render: (val: string, onVal: (v: string) => void) => React.ReactNode;
  addLabel: string;
  blank: string;
}) {
  return (
    <div>
      {items.map((val, i) => (
        <div key={i} className="flex gap-2 mb-2">
          <div className="flex-1">
            {render(val, (v) => {
              const next = [...items];
              next[i] = v;
              onChange(next);
            })}
          </div>
          <button
            type="button"
            onClick={() => onChange(items.filter((_, j) => j !== i))}
            className="shrink-0 w-10 rounded-md border border-line-dark text-ink/50 hover:text-[hsl(var(--destructive))] hover:border-[hsl(var(--destructive))]/40"
          >
            <Trash2 size={13} className="mx-auto" />
          </button>
        </div>
      ))}
      <button
        type="button"
        onClick={() => onChange([...items, blank])}
        className="inline-flex items-center gap-1.5 text-[11px] tracking-[0.16em] uppercase text-ink/60 hover:text-gold mt-1"
      >
        <Plus size={13} /> {addLabel}
      </button>
    </div>
  );
}
