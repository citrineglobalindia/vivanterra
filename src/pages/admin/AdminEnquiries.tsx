import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { ChevronRight, Inbox, Loader2, Mail, MessageCircle, Phone, Search } from "lucide-react";
import Seo from "@/components/seo/Seo";
import AdminLayout from "@/components/admin/AdminLayout";
import { ENQUIRY_STATUSES, getSupabase, type Enquiry, type LeadStatus } from "@/lib/supabase";
import { useAdminSession } from "@/lib/admin-auth";

type SF = "all" | LeadStatus;
const TONE: Record<LeadStatus, string> = {
  new: "bg-gold/20 text-ink border-gold/40",
  contacted: "bg-ink/5 text-ink border-ink/20",
  qualified: "bg-[hsl(110_30%_88%)] text-ink border-[hsl(110_25%_70%)]",
  closed: "bg-ink text-paper border-ink",
  spam: "bg-[hsl(0_60%_94%)] text-ink border-[hsl(0_50%_75%)]",
};

export default function AdminEnquiries() {
  const { email } = useAdminSession();
  const [rows, setRows] = useState<Enquiry[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [status, setStatus] = useState<SF>("all");
  const [query, setQuery] = useState("");

  useEffect(() => {
    (async () => {
      try {
        const { data, error } = await getSupabase()
          .from("vivanterra_enquiries")
          .select("*")
          .order("created_at", { ascending: false })
          .limit(500);
        if (error) throw error;
        setRows((data as Enquiry[]) ?? []);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load");
      }
    })();
  }, []);

  const filtered = useMemo(() => {
    if (!rows) return null;
    const q = query.trim().toLowerCase();
    return rows.filter((e) => {
      if (status !== "all" && e.status !== status) return false;
      if (!q) return true;
      return (
        e.name.toLowerCase().includes(q) ||
        e.email.toLowerCase().includes(q) ||
        (e.message ?? "").toLowerCase().includes(q) ||
        (e.project_slug ?? "").toLowerCase().includes(q)
      );
    });
  }, [rows, status, query]);

  const counts = useMemo(() => {
    const all = rows ?? [];
    const o: Record<SF, number> = { all: all.length, new: 0, contacted: 0, qualified: 0, closed: 0, spam: 0 };
    for (const e of all) o[e.status]++;
    return o;
  }, [rows]);

  return (
    <>
      <Seo title="Admin — enquiries" description="Enquiry inbox." />
      <AdminLayout email={email} title="Enquiries" subtitle="Contact-form leads from the website.">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">
          <div className="flex flex-wrap items-center gap-2">
            {(["all", ...ENQUIRY_STATUSES] as SF[]).map((s) => {
              const active = status === s;
              return (
                <button key={s} type="button" onClick={() => setStatus(s)}
                  className={["inline-flex items-center gap-2 px-4 h-9 rounded-full border text-[11px] tracking-[0.14em] uppercase font-medium transition-all",
                    active ? "bg-ink text-paper border-ink" : "border-ink/25 text-ink hover:border-gold hover:text-gold"].join(" ")}>
                  {s === "all" ? "All" : s}
                  <span className="tabular-nums text-[10px] opacity-70">{counts[s]}</span>
                </button>
              );
            })}
          </div>
          <div className="relative w-full lg:w-72">
            <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ink/45"><Search size={14} /></span>
            <input type="search" value={query} onChange={(e) => setQuery(e.target.value)}
              placeholder="Search name, email, message…"
              className="w-full bg-paper border border-line-dark rounded-full pl-9 pr-4 py-2.5 text-sm text-ink outline-none focus:border-gold transition-colors" />
          </div>
        </div>

        {error && <div className="p-4 border border-[hsl(var(--destructive))]/30 bg-[hsl(var(--destructive))]/5 text-[hsl(var(--destructive))] text-sm rounded-md mb-6">{error}</div>}
        {rows === null && !error && <div className="flex items-center gap-3 text-ink/50"><Loader2 className="animate-spin" size={16} /> Loading…</div>}
        {filtered && filtered.length === 0 && (
          <div className="border border-dashed border-line-dark rounded-lg py-16 text-center text-ink/50">
            <Inbox className="mx-auto mb-3 opacity-50" />No enquiries{status !== "all" ? ` (${status})` : ""}.
          </div>
        )}

        {filtered && filtered.length > 0 && (
          <div className="overflow-x-auto border border-line-dark rounded-lg bg-paper">
            <table className="w-full text-sm">
              <thead className="bg-ink/5">
                <tr className="text-left text-[10px] tracking-[0.18em] uppercase text-ink/50">
                  <th className="px-4 py-3 font-medium">Received</th>
                  <th className="px-4 py-3 font-medium">Lead</th>
                  <th className="px-4 py-3 font-medium hidden md:table-cell">Scope / Project</th>
                  <th className="px-4 py-3 font-medium">Status</th>
                  <th className="px-4 py-3 font-medium hidden lg:table-cell">Reach</th>
                  <th className="px-4 py-3" />
                </tr>
              </thead>
              <tbody>
                {filtered.map((e) => (
                  <tr key={e.id} className="border-t border-line-dark hover:bg-ink/[0.02]">
                    <td className="px-4 py-4 align-top whitespace-nowrap tabular-nums text-ink/55">
                      {new Date(e.created_at).toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" })}
                    </td>
                    <td className="px-4 py-4 align-top">
                      <Link to={`/admin/enquiries/${e.id}`} className="font-medium text-ink hover:text-gold">{e.name}</Link>
                      <div className="text-ink/55 text-xs mt-0.5 break-all">{e.email}</div>
                      {e.phone && <div className="text-ink/55 text-xs tabular-nums">{e.phone}</div>}
                    </td>
                    <td className="px-4 py-4 align-top hidden md:table-cell">
                      <div className="text-ink capitalize">{e.scope ?? "—"}</div>
                      {e.project_slug && <span className="text-xs text-gold">{e.project_slug}</span>}
                    </td>
                    <td className="px-4 py-4 align-top">
                      <span className={`inline-block px-2.5 py-1 rounded-full border text-[10px] tracking-[0.16em] uppercase font-medium ${TONE[e.status]}`}>{e.status}</span>
                    </td>
                    <td className="px-4 py-4 align-top hidden lg:table-cell">
                      <div className="flex items-center gap-2">
                        <a href={`mailto:${e.email}`} className="w-8 h-8 rounded-full border border-line-dark flex items-center justify-center text-ink hover:bg-ink hover:text-paper" aria-label="Email"><Mail size={13} /></a>
                        {e.phone && <>
                          <a href={`tel:${e.phone.replace(/\s/g, "")}`} className="w-8 h-8 rounded-full border border-line-dark flex items-center justify-center text-ink hover:bg-ink hover:text-paper" aria-label="Call"><Phone size={13} /></a>
                          <a href={`https://wa.me/${e.phone.replace(/[^\d+]/g, "").replace(/^\+/, "")}`} target="_blank" rel="noreferrer" className="w-8 h-8 rounded-full border border-line-dark flex items-center justify-center text-ink hover:bg-ink hover:text-paper" aria-label="WhatsApp"><MessageCircle size={13} /></a>
                        </>}
                      </div>
                    </td>
                    <td className="px-4 py-4 align-top text-right">
                      <Link to={`/admin/enquiries/${e.id}`} className="inline-flex items-center gap-1 text-[10px] tracking-[0.18em] uppercase text-ink hover:text-gold">Open <ChevronRight size={12} /></Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </AdminLayout>
    </>
  );
}
