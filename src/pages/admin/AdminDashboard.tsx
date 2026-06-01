import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  Building2,
  ChevronRight,
  Image,
  Loader2,
  MessageSquare,
  Newspaper,
  PenSquare,
  Users,
} from "lucide-react";
import Seo from "@/components/seo/Seo";
import AdminLayout from "@/components/admin/AdminLayout";
import { getSupabase, type Enquiry } from "@/lib/supabase";
import { useAdminSession } from "@/lib/admin-auth";

type Counts = {
  projects: number;
  enquiries: number;
  enquiriesNew: number;
  leads: number;
  subscribers: number;
  posts: number;
  news: number;
  press: number;
  gallery: number;
};

export default function AdminDashboard() {
  const { email } = useAdminSession();
  const [counts, setCounts] = useState<Counts | null>(null);
  const [recent, setRecent] = useState<Enquiry[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        const sb = getSupabase();
        const head = (table: string, filter?: [string, string]) => {
          let q = sb.from(table).select("*", { count: "exact", head: true });
          if (filter) q = q.eq(filter[0], filter[1]);
          return q;
        };
        const [
          projects,
          enquiries,
          enquiriesNew,
          leads,
          subscribers,
          posts,
          news,
          press,
          gallery,
          recentRes,
        ] = await Promise.all([
          head("vivanterra_projects"),
          head("vivanterra_enquiries"),
          head("vivanterra_enquiries", ["status", "new"]),
          head("vivanterra_leads"),
          head("vivanterra_subscribers"),
          head("vivanterra_posts"),
          head("vivanterra_news"),
          head("vivanterra_press_releases"),
          head("vivanterra_gallery"),
          sb
            .from("vivanterra_enquiries")
            .select("*")
            .order("created_at", { ascending: false })
            .limit(5),
        ]);
        if (cancelled) return;
        setCounts({
          projects: projects.count ?? 0,
          enquiries: enquiries.count ?? 0,
          enquiriesNew: enquiriesNew.count ?? 0,
          leads: leads.count ?? 0,
          subscribers: subscribers.count ?? 0,
          posts: posts.count ?? 0,
          news: news.count ?? 0,
          press: press.count ?? 0,
          gallery: gallery.count ?? 0,
        });
        setRecent((recentRes.data as Enquiry[]) ?? []);
      } catch (err) {
        if (!cancelled)
          setError(err instanceof Error ? err.message : "Failed to load");
      }
    }
    load();
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <>
      <Seo title="Admin — dashboard" description="Vivanterra admin overview." />
      <AdminLayout
        email={email}
        title="Overview"
        subtitle="Quick view of your content and leads."
      >
        {error && (
          <div className="p-4 border border-[hsl(var(--destructive))]/30 bg-[hsl(var(--destructive))]/5 text-[hsl(var(--destructive))] text-sm rounded-md mb-6">
            {error}
          </div>
        )}

        {!counts && !error ? (
          <div className="flex items-center gap-3 text-ink/50">
            <Loader2 className="animate-spin" size={16} /> Loading…
          </div>
        ) : counts ? (
          <>
            {/* Primary stat cards */}
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-10">
              <StatCard
                to="/admin/projects"
                label="Projects"
                value={counts.projects}
                icon={<Building2 size={22} />}
              />
              <StatCard
                to="/admin/enquiries"
                label="Enquiries"
                value={counts.enquiries}
                badge={counts.enquiriesNew > 0 ? `${counts.enquiriesNew} new` : undefined}
                icon={<MessageSquare size={22} />}
              />
              <StatCard
                to="/admin/subscribers"
                label="Subscribers"
                value={counts.subscribers}
                icon={<Users size={22} />}
              />
              <StatCard
                to="/admin/blogs"
                label="Blog posts"
                value={counts.posts}
                icon={<PenSquare size={22} />}
              />
            </div>

            {/* Secondary */}
            <div className="grid sm:grid-cols-3 gap-5 mb-12">
              <MiniStat to="/admin/news" label="News items" value={counts.news} icon={<Newspaper size={16} />} />
              <MiniStat to="/admin/press" label="Press releases" value={counts.press} icon={<Newspaper size={16} />} />
              <MiniStat to="/admin/gallery" label="Gallery images" value={counts.gallery} icon={<Image size={16} />} />
            </div>

            {/* Recent enquiries */}
            <div className="bg-paper border border-line-dark rounded-lg overflow-hidden">
              <div className="flex items-center justify-between px-6 py-4 border-b border-line-dark">
                <h2 className="font-display text-ink text-lg">Recent enquiries</h2>
                <Link
                  to="/admin/enquiries"
                  className="text-[11px] tracking-[0.16em] uppercase text-ink/60 hover:text-gold inline-flex items-center gap-1"
                >
                  View all <ChevronRight size={12} />
                </Link>
              </div>
              {recent.length === 0 ? (
                <div className="px-6 py-10 text-center text-ink/50 text-sm">
                  No enquiries yet.
                </div>
              ) : (
                <ul className="divide-y divide-line-dark">
                  {recent.map((e) => (
                    <li key={e.id}>
                      <Link
                        to={`/admin/enquiries/${e.id}`}
                        className="flex items-center justify-between gap-4 px-6 py-4 hover:bg-ink/[0.02] transition-colors"
                      >
                        <div className="min-w-0">
                          <div className="font-medium text-ink truncate">
                            {e.name}
                          </div>
                          <div className="text-ink/55 text-xs truncate">
                            {e.email} · {e.scope ?? "—"}
                            {e.project_slug ? ` · ${e.project_slug}` : ""}
                          </div>
                        </div>
                        <div className="flex items-center gap-3 shrink-0">
                          <span className="text-[10px] tracking-[0.14em] uppercase px-2 py-0.5 rounded-full bg-gold/20 text-ink">
                            {e.status}
                          </span>
                          <span className="text-ink/40 text-xs tabular-nums hidden sm:inline">
                            {new Date(e.created_at).toLocaleDateString("en-IN", {
                              day: "numeric",
                              month: "short",
                            })}
                          </span>
                          <ChevronRight size={14} className="text-ink/30" />
                        </div>
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </>
        ) : null}
      </AdminLayout>
    </>
  );
}

function StatCard({
  to,
  label,
  value,
  icon,
  badge,
}: {
  to: string;
  label: string;
  value: number;
  icon: React.ReactNode;
  badge?: string;
}) {
  return (
    <Link
      to={to}
      className="group bg-paper border border-line-dark rounded-lg p-6 hover:border-gold hover:shadow-[0_18px_40px_-24px_rgba(0,0,0,0.18)] transition-all"
    >
      <div className="flex items-start justify-between mb-4">
        <span className="text-ink/55 text-sm">{label}</span>
        <span className="text-gold/70 group-hover:text-gold transition-colors">
          {icon}
        </span>
      </div>
      <div className="flex items-baseline gap-3">
        <span
          className="font-display text-ink tabular-nums"
          style={{ fontSize: "clamp(34px, 4vw, 48px)", fontWeight: 300, lineHeight: 1 }}
        >
          {value}
        </span>
        {badge && (
          <span className="text-[10px] tracking-[0.14em] uppercase px-2 py-0.5 rounded-full bg-gold/20 text-ink">
            {badge}
          </span>
        )}
      </div>
    </Link>
  );
}

function MiniStat({
  to,
  label,
  value,
  icon,
}: {
  to: string;
  label: string;
  value: number;
  icon: React.ReactNode;
}) {
  return (
    <Link
      to={to}
      className="group flex items-center justify-between bg-paper border border-line-dark rounded-lg px-5 py-4 hover:border-gold transition-colors"
    >
      <span className="flex items-center gap-2.5 text-ink/65 text-sm">
        <span className="text-gold/70">{icon}</span>
        {label}
      </span>
      <span className="font-display text-ink text-xl tabular-nums">{value}</span>
    </Link>
  );
}
