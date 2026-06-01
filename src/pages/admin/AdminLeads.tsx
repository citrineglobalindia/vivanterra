import { useEffect, useMemo, useState } from "react";
import { Inbox, Loader2, Mail, MessageCircle, Phone, Save, Search, Trash2 } from "lucide-react";
import Seo from "@/components/seo/Seo";
import AdminLayout from "@/components/admin/AdminLayout";
import { ENQUIRY_STATUSES, getSupabase, type Lead, type LeadStatus } from "@/lib/supabase";
import { useAdminSession } from "@/lib/admin-auth";

const KINDS = ["all", "popup", "newsletter", "concierge", "other"] as const;

export default function AdminLeads() {
  const { email } = useAdminSession();
  const [rows, setRows] = useState<Lead[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [kind, setKind] = useState<(typeof KINDS)[number]>("all");
  const [query, setQuery] = useState("");

  async function load() {
    const { data, error } = await getSupabase().from("vivanterra_leads").select("*").order("created_at", { ascending: false }).limit(500);
    if (error) { setError(error.message); return; }
    setRows((data as Lead[]) ?? []);
  }
  useEffect(() => { load(); }, []);

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    return (rows ?? []).filter((r) => {
      if (kind !== "all" && r.kind !== kind) return false;
      if (!q) return true;
      return r.email.toLowerCase().includes(q) || (r.name ?? "").toLowerCase().includes(q) || (r.message ?? "").toLowerCase().includes(q);
    });
  }, [rows, kind, query]);

  async function setStatus(id: string, status: LeadStatus) {
    await getSupabase().from("vivanterra_leads").update({ status }).eq("id", id);
    setRows((rs) => (rs ?? []).map((r) => r.id === id ? { ...r, status } : r));
  }
  async function del(id: string) { if (!window.confirm("Delete this lead?")) return; await getSupabase().from("vivanterra_leads").delete().eq("id", id); load(); }

  return (
    <>
      <Seo title="Admin — leads" description="Captured leads." />
      <AdminLayout email={email} title="Leads" subtitle="Pop-up, newsletter & concierge captures.">
        {error && <div className="p-4 border border-[hsl(var(--destructive))]/30 bg-[hsl(var(--destructive))]/5 text-[hsl(var(--destructive))] text-sm rounded-md mb-6">{error}</div>}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">
          <div className="flex flex-wrap gap-2">
            {KINDS.map((k) => {
              const active = kind === k;
              const count = k === "all" ? (rows ?? []).length : (rows ?? []).filter((r) => r.kind === k).length;
              return <button key={k} type="button" onClick={()=>setKind(k)} className={["inline-flex items-center gap-2 px-4 h-9 rounded-full border text-[11px] tracking-[0.14em] uppercase font-medium",active?"bg-ink text-paper border-ink":"border-ink/25 text-ink hover:border-gold hover:text-gold"].join(" ")}>{k}<span className="tabular-nums text-[10px] opacity-70">{count}</span></button>;
            })}
          </div>
          <div className="relative w-full lg:w-64">
            <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ink/45"><Search size={14}/></span>
            <input type="search" value={query} onChange={(e)=>setQuery(e.target.value)} placeholder="Search…" className="w-full bg-paper border border-line-dark rounded-full pl-9 pr-4 py-2.5 text-sm text-ink outline-none focus:border-gold"/>
          </div>
        </div>
        {rows === null && !error && <div className="flex items-center gap-3 text-ink/50"><Loader2 className="animate-spin" size={16}/> Loading…</div>}
        {rows && visible.length === 0 && <div className="border border-dashed border-line-dark rounded-lg py-16 text-center text-ink/50"><Inbox className="mx-auto mb-3 opacity-50"/>No leads{kind!=="all"?` (${kind})`:""} yet.</div>}
        <div className="space-y-3">
          {visible.map((l) => (
            <div key={l.id} className="bg-paper border border-line-dark rounded-lg p-4 flex flex-wrap items-center gap-4">
              <span className="text-[9px] tracking-[0.16em] uppercase px-2 py-1 rounded-full bg-gold/20 text-ink shrink-0">{l.kind}</span>
              <div className="min-w-0 flex-1">
                <div className="font-medium text-ink truncate">{l.name ?? l.email}</div>
                <div className="text-ink/55 text-xs truncate">{l.email}{l.message ? ` · ${l.message}` : ""}</div>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <a href={`mailto:${l.email}`} className="w-8 h-8 rounded-full border border-line-dark flex items-center justify-center text-ink hover:bg-ink hover:text-paper"><Mail size={13}/></a>
                {l.phone && <>
                  <a href={`tel:${l.phone}`} className="w-8 h-8 rounded-full border border-line-dark flex items-center justify-center text-ink hover:bg-ink hover:text-paper"><Phone size={13}/></a>
                  <a href={`https://wa.me/${l.phone.replace(/[^\d+]/g,"").replace(/^\+/,"")}`} target="_blank" rel="noreferrer" className="w-8 h-8 rounded-full border border-line-dark flex items-center justify-center text-ink hover:bg-ink hover:text-paper"><MessageCircle size={13}/></a>
                </>}
                <select value={l.status} onChange={(e)=>setStatus(l.id, e.target.value as LeadStatus)} className="bg-paper border border-line-dark rounded-md px-2 py-1.5 text-xs text-ink outline-none focus:border-gold capitalize">
                  {ENQUIRY_STATUSES.map((s)=><option key={s} value={s}>{s}</option>)}
                </select>
                <button type="button" onClick={()=>del(l.id)} className="h-8 px-2.5 rounded-md border border-line-dark text-ink/50 hover:text-[hsl(var(--destructive))] hover:border-[hsl(var(--destructive))]/40"><Trash2 size={12}/></button>
              </div>
            </div>
          ))}
        </div>
      </AdminLayout>
    </>
  );
}
