import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowUpRight,
  ChevronRight,
  Filter,
  Inbox,
  Loader2,
  Mail,
  MessageCircle,
  Phone,
  Search,
} from "lucide-react";
import Seo from "@/components/seo/Seo";
import AdminLayout from "@/components/admin/AdminLayout";
import { ENQUIRY_STATUSES, getSupabase, type Enquiry } from "@/lib/supabase";
import { useAdminSession } from "@/lib/admin-auth";

type StatusFilter = "all" | Enquiry["status"];

const STATUS_TONES: Record<Enquiry["status"], string> = {
  new: "bg-gold/20 text-ink border-gold/40",
  contacted: "bg-ink/5 text-ink border-ink/20",
  qualified: "bg-[hsl(110_30%_88%)] text-ink border-[hsl(110_25%_70%)]",
  closed: "bg-ink text-paper border-ink",
  spam: "bg-[hsl(0_60%_94%)] text-ink border-[hsl(0_50%_75%)]",
};

export default function AdminDashboard() {
  const { email } = useAdminSession();
  const [enquiries, setEnquiries] = useState<Enquiry[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [status, setStatus] = useState<StatusFilter>("all");
  const [query, setQuery] = useState("");

  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        const { data, error } = await getSupabase()
          .from("vivanterra_enquiries")
          .select("*")
          .order("created_at", { ascending: false })
          .limit(200);
        if (cancelled) return;
        if (error) throw error;
        setEnquiries((data as Enquiry[]) ?? []);
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

  const filtered = useMemo(() => {
    if (!enquiries) return null;
    const q = query.trim().toLowerCase();
    return enquiries.filter((e) => {
      if (status !== "all" && e.status !== status) return false;
      if (!q) return true;
      return (
        e.name.toLowerCase().includes(q) ||
        e.email.toLowerCase().includes(q) ||
        (e.message ?? "").toLowerCase().includes(q) ||
        (e.project_slug ?? "").toLowerCase().includes(q)
      );
    });
  }, [enquiries, status, query]);

  const counts = useMemo(() => {
    const all = enquiries ?? [];
    const out: Record<StatusFilter, number> = {
      all: all.length,
      new: 0,
      contacted: 0,
      qualified: 0,
      closed: 0,
      spam: 0,
    };
    for (const e of all) out[e.status]++;
    return out;
  }, [enquiries]);

  return (
    <>
      <Seo title="Admin — enquiries" description="Vivanterra enquiry inbox." />
      <AdminLayout email={email} title="Enquiries">
        {/* Filters */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-8">
          <div className="flex flex-wrap items-center gap-2">
            <FilterPill
              active={status === "all"}
              count={counts.all}
              onClick={() => setStatus("all")}
            >
              All
            </FilterPill>
            {ENQUIRY_STATUSES.map((s) => (
              <FilterPill
                key={s}
                active={status === s}
                count={counts[s]}
                onClick={() => setStatus(s)}
              >
                {s}
              </FilterPill>
            ))}
          </div>

          <div className="relative w-full lg:w-72">
            <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ink/45 pointer-events-none">
              <Search size={14} />
            </span>
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search name, email, message…"
              className="w-full bg-[rgba(78,115,83,0.04)] border border-line-dark rounded-full pl-9 pr-4 py-2.5 text-sm text-ink placeholder:text-ink/40 outline-none focus:border-gold focus:bg-paper transition-colors"
            />
          </div>
        </div>

        {/* States */}
        {error && (
          <div className="p-4 border border-[hsl(var(--destructive))]/30 bg-[hsl(var(--destructive))]/5 text-[hsl(var(--destructive))] text-sm rounded-sm mb-6">
            {error}
          </div>
        )}

        {enquiries === null && !error && (
          <div className="flex items-center gap-3 text-muted-soft">
            <Loader2 className="animate-spin" size={16} /> Loading enquiries…
          </div>
        )}

        {filtered && filtered.length === 0 && (
          <div className="border border-dashed border-line-dark rounded-sm py-20 text-center text-muted-soft">
            <Inbox className="mx-auto mb-3 opacity-50" />
            <p>No enquiries{status !== "all" ? ` with status "${status}"` : " yet"}.</p>
          </div>
        )}

        {/* Table */}
        {filtered && filtered.length > 0 && (
          <div className="overflow-hidden border border-line-dark rounded-sm">
            <table className="w-full text-sm">
              <thead className="bg-ink/5">
                <tr className="text-left text-[10px] tracking-[0.18em] uppercase text-muted-soft">
                  <th className="px-4 py-3 font-medium">Received</th>
                  <th className="px-4 py-3 font-medium">Lead</th>
                  <th className="px-4 py-3 font-medium hidden md:table-cell">
                    Scope / Project
                  </th>
                  <th className="px-4 py-3 font-medium">Status</th>
                  <th className="px-4 py-3 font-medium hidden lg:table-cell">
                    Reach
                  </th>
                  <th className="px-4 py-3" />
                </tr>
              </thead>
              <tbody>
                {filtered.map((e) => (
                  <Row key={e.id} enquiry={e} />
                ))}
              </tbody>
            </table>
          </div>
        )}
      </AdminLayout>
    </>
  );
}

function FilterPill({
  active,
  count,
  onClick,
  children,
}: {
  active: boolean;
  count: number;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={[
        "inline-flex items-center gap-2 px-4 h-9 rounded-full border text-[11px] tracking-[0.16em] uppercase font-medium transition-all",
        active
          ? "bg-ink text-paper border-ink"
          : "border-ink/25 text-ink hover:border-gold hover:text-gold",
      ].join(" ")}
    >
      {!active && <Filter size={11} className="opacity-50" />}
      <span>{children}</span>
      <span
        className={[
          "tabular-nums text-[10px] px-1.5 py-0.5 rounded-full",
          active ? "bg-gold/30 text-paper" : "bg-ink/10 text-ink/70",
        ].join(" ")}
      >
        {count}
      </span>
    </button>
  );
}

function Row({ enquiry: e }: { enquiry: Enquiry }) {
  return (
    <tr className="border-t border-line-dark hover:bg-ink/[0.02] transition-colors">
      <td className="px-4 py-4 align-top whitespace-nowrap tabular-nums text-muted-soft">
        {new Date(e.created_at).toLocaleString("en-IN", {
          dateStyle: "medium",
          timeStyle: "short",
        })}
      </td>
      <td className="px-4 py-4 align-top">
        <Link
          to={`/admin/enquiries/${e.id}`}
          className="font-medium text-ink hover:text-gold"
        >
          {e.name}
        </Link>
        <div className="text-muted-soft text-xs mt-0.5 break-all">{e.email}</div>
        {e.phone && (
          <div className="text-muted-soft text-xs mt-0.5 tabular-nums">
            {e.phone}
          </div>
        )}
      </td>
      <td className="px-4 py-4 align-top hidden md:table-cell">
        <div className="text-ink text-sm capitalize">{e.scope ?? "—"}</div>
        {e.project_slug && (
          <Link
            to={`/projects/${e.project_slug}`}
            className="text-xs text-gold hover:underline tabular-nums"
          >
            {e.project_slug}
          </Link>
        )}
      </td>
      <td className="px-4 py-4 align-top">
        <span
          className={[
            "inline-block px-2.5 py-1 rounded-full border text-[10px] tracking-[0.16em] uppercase font-medium",
            STATUS_TONES[e.status],
          ].join(" ")}
        >
          {e.status}
        </span>
      </td>
      <td className="px-4 py-4 align-top hidden lg:table-cell">
        <div className="flex items-center gap-2">
          <a
            href={`mailto:${e.email}`}
            className="w-8 h-8 rounded-full border border-line-dark flex items-center justify-center text-ink hover:bg-ink hover:text-paper transition-colors"
            aria-label="Email"
            title="Email"
          >
            <Mail size={13} />
          </a>
          {e.phone && (
            <>
              <a
                href={`tel:${e.phone.replace(/\s/g, "")}`}
                className="w-8 h-8 rounded-full border border-line-dark flex items-center justify-center text-ink hover:bg-ink hover:text-paper transition-colors"
                aria-label="Call"
                title="Call"
              >
                <Phone size={13} />
              </a>
              <a
                href={`https://wa.me/${e.phone.replace(/[^\d+]/g, "").replace(/^\+/, "")}`}
                target="_blank"
                rel="noreferrer"
                className="w-8 h-8 rounded-full border border-line-dark flex items-center justify-center text-ink hover:bg-ink hover:text-paper transition-colors"
                aria-label="WhatsApp"
                title="WhatsApp"
              >
                <MessageCircle size={13} />
              </a>
            </>
          )}
        </div>
      </td>
      <td className="px-4 py-4 align-top text-right">
        <Link
          to={`/admin/enquiries/${e.id}`}
          className="inline-flex items-center gap-1 text-[10px] tracking-[0.18em] uppercase text-ink hover:text-gold transition-colors"
        >
          Open <ChevronRight size={12} />
        </Link>
      </td>
    </tr>
  );
}
