import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  Building2,
  Loader2,
  Pencil,
  Plus,
  Star,
} from "lucide-react";
import Seo from "@/components/seo/Seo";
import AdminLayout from "@/components/admin/AdminLayout";
import {
  getSupabase,
  PROJECT_STATUSES,
  type ProjectRow,
  type ProjectStatus,
} from "@/lib/supabase";
import { useAdminSession } from "@/lib/admin-auth";

type Filter = "all" | ProjectStatus;

const STATUS_TONE: Record<ProjectStatus, string> = {
  Ongoing: "bg-gold/20 text-ink border-gold/40",
  Upcoming: "bg-ink/5 text-ink border-ink/20",
  Completed: "bg-ink text-paper border-ink",
};

export default function AdminProjects() {
  const { email } = useAdminSession();
  const [rows, setRows] = useState<ProjectRow[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<Filter>("all");

  async function load() {
    try {
      const { data, error } = await getSupabase()
        .from("vivanterra_projects")
        .select("*")
        .order("sort_order", { ascending: true });
      if (error) throw error;
      setRows((data as ProjectRow[]) ?? []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load");
    }
  }

  useEffect(() => {
    load();
  }, []);

  const visible = (rows ?? []).filter(
    (r) => filter === "all" || r.status === filter,
  );

  async function togglePublished(p: ProjectRow) {
    await getSupabase()
      .from("vivanterra_projects")
      .update({ published: !p.published })
      .eq("id", p.id);
    load();
  }

  return (
    <>
      <Seo title="Admin — projects" description="Manage Vivanterra projects." />
      <AdminLayout
        email={email}
        title="Projects"
        subtitle="Create, edit, and manage residence projects."
        actions={
          <Link
            to="/admin/projects/new"
            className="inline-flex items-center gap-2 h-11 px-5 rounded-md bg-ink text-paper hover:bg-gold hover:text-ink transition-colors text-[11px] tracking-[0.16em] uppercase font-semibold"
          >
            <Plus size={15} /> New project
          </Link>
        }
      >
        {/* Filters */}
        <div className="flex flex-wrap items-center gap-2 mb-6">
          {(["all", ...PROJECT_STATUSES] as Filter[]).map((f) => {
            const active = filter === f;
            const count =
              f === "all"
                ? (rows ?? []).length
                : (rows ?? []).filter((r) => r.status === f).length;
            return (
              <button
                key={f}
                type="button"
                onClick={() => setFilter(f)}
                className={[
                  "inline-flex items-center gap-2 px-4 h-9 rounded-full border text-[11px] tracking-[0.14em] uppercase font-medium transition-all",
                  active
                    ? "bg-ink text-paper border-ink"
                    : "border-ink/25 text-ink hover:border-gold hover:text-gold",
                ].join(" ")}
              >
                {f === "all" ? "All" : f}
                <span className="tabular-nums text-[10px] opacity-70">{count}</span>
              </button>
            );
          })}
        </div>

        {error && (
          <div className="p-4 border border-[hsl(var(--destructive))]/30 bg-[hsl(var(--destructive))]/5 text-[hsl(var(--destructive))] text-sm rounded-md mb-6">
            {error}
          </div>
        )}

        {rows === null && !error && (
          <div className="flex items-center gap-3 text-ink/50">
            <Loader2 className="animate-spin" size={16} /> Loading…
          </div>
        )}

        {rows && visible.length === 0 && (
          <div className="border border-dashed border-line-dark rounded-lg py-16 text-center text-ink/50">
            <Building2 className="mx-auto mb-3 opacity-50" />
            No projects. Click "New project" to add one.
          </div>
        )}

        {visible.length > 0 && (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {visible.map((p) => (
              <article
                key={p.id}
                className="bg-paper border border-line-dark rounded-lg overflow-hidden group"
              >
                <div className="relative aspect-[16/10] bg-ink/5 overflow-hidden">
                  {p.hero && (
                    <img
                      src={p.hero}
                      alt={p.title}
                      loading="lazy"
                      className="h-full w-full object-cover"
                    />
                  )}
                  <span
                    className={`absolute top-3 left-3 px-2.5 py-1 rounded-full border text-[9px] tracking-[0.16em] uppercase font-medium ${STATUS_TONE[p.status]}`}
                  >
                    {p.status}
                  </span>
                  {p.featured && (
                    <span className="absolute top-3 right-3 w-7 h-7 rounded-full bg-gold text-ink flex items-center justify-center" title="Featured">
                      <Star size={13} />
                    </span>
                  )}
                  {!p.published && (
                    <span className="absolute bottom-3 left-3 px-2 py-0.5 rounded bg-ink/80 text-paper text-[9px] tracking-[0.16em] uppercase">
                      Draft
                    </span>
                  )}
                </div>
                <div className="p-5">
                  <h3 className="font-display text-ink text-lg leading-tight">
                    {p.title}
                  </h3>
                  <p className="text-ink/55 text-xs mt-1">{p.location}</p>
                  <div className="flex items-center justify-between mt-2 text-sm">
                    <span className="text-ink tabular-nums">
                      {p.price ?? "Price on request"}
                    </span>
                    {p.possession && (
                      <span className="text-ink/50 text-xs">{p.possession}</span>
                    )}
                  </div>
                  <div className="flex items-center gap-2 mt-5">
                    <Link
                      to={`/admin/projects/${p.id}/edit`}
                      className="flex-1 inline-flex items-center justify-center gap-1.5 h-10 rounded-md bg-ink text-paper hover:bg-gold hover:text-ink transition-colors text-[10px] tracking-[0.16em] uppercase font-semibold"
                    >
                      <Pencil size={12} /> Edit
                    </Link>
                    <button
                      type="button"
                      onClick={() => togglePublished(p)}
                      className="h-10 px-3 rounded-md border border-line-dark text-ink hover:border-gold hover:text-gold transition-colors text-[10px] tracking-[0.16em] uppercase"
                    >
                      {p.published ? "Unpublish" : "Publish"}
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </AdminLayout>
    </>
  );
}
