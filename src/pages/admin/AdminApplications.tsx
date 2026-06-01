import { useEffect, useMemo, useState } from "react";
import { ArrowLeft, Loader2, Mail, Phone, Save, Trash2, Users } from "lucide-react";
import { Link } from "react-router-dom";
import Seo from "@/components/seo/Seo";
import AdminLayout from "@/components/admin/AdminLayout";
import { APPLICATION_STATUSES, getSupabase, type ApplicationStatus, type CareerApplication } from "@/lib/supabase";
import { useAdminSession } from "@/lib/admin-auth";

export default function AdminApplications() {
  const { email } = useAdminSession();
  const [rows, setRows] = useState<CareerApplication[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<"all" | ApplicationStatus>("all");

  async function load() {
    const { data, error } = await getSupabase().from("vivanterra_career_applications").select("*").order("created_at", { ascending: false });
    if (error) { setError(error.message); return; }
    setRows((data as CareerApplication[]) ?? []);
  }
  useEffect(() => { load(); }, []);

  const visible = useMemo(() => (rows ?? []).filter((r) => filter === "all" || r.status === filter), [rows, filter]);

  async function setStatus(id: string, status: ApplicationStatus) {
    await getSupabase().from("vivanterra_career_applications").update({ status }).eq("id", id);
    setRows((rs) => (rs ?? []).map((r) => r.id === id ? { ...r, status } : r));
  }
  async function del(id: string) { if (!window.confirm("Delete this application?")) return; await getSupabase().from("vivanterra_career_applications").delete().eq("id", id); load(); }

  return (
    <>
      <Seo title="Admin — applications" description="Job applications." />
      <AdminLayout email={email} title="Applications" subtitle="Career applications inbox."
        actions={<Link to="/admin/careers" className="inline-flex items-center gap-1 h-11 px-4 rounded-md border border-line-dark text-ink hover:border-gold hover:text-gold text-[11px] tracking-[0.16em] uppercase"><ArrowLeft size={13}/> Positions</Link>}>
        {error && <div className="p-4 border border-[hsl(var(--destructive))]/30 bg-[hsl(var(--destructive))]/5 text-[hsl(var(--destructive))] text-sm rounded-md mb-6">{error}</div>}
        <div className="flex flex-wrap gap-2 mb-6">
          {(["all", ...APPLICATION_STATUSES] as const).map((s) => {
            const active = filter === s;
            const count = s === "all" ? (rows ?? []).length : (rows ?? []).filter((r) => r.status === s).length;
            return <button key={s} type="button" onClick={()=>setFilter(s)} className={["inline-flex items-center gap-2 px-4 h-9 rounded-full border text-[11px] tracking-[0.14em] uppercase font-medium",active?"bg-ink text-paper border-ink":"border-ink/25 text-ink hover:border-gold hover:text-gold"].join(" ")}>{s}<span className="tabular-nums text-[10px] opacity-70">{count}</span></button>;
          })}
        </div>
        {rows === null && !error && <div className="flex items-center gap-3 text-ink/50"><Loader2 className="animate-spin" size={16}/> Loading…</div>}
        {rows && visible.length === 0 && <div className="border border-dashed border-line-dark rounded-lg py-16 text-center text-ink/50"><Users className="mx-auto mb-3 opacity-50"/>No applications{filter!=="all"?` (${filter})`:""}.</div>}
        <div className="space-y-4">
          {visible.map((a) => (
            <div key={a.id} className="bg-paper border border-line-dark rounded-lg p-5">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <div className="font-display text-ink text-lg">{a.name}</div>
                  <div className="text-ink/55 text-sm">{a.position_title ?? "General application"}</div>
                </div>
                <div className="flex items-center gap-2">
                  <select value={a.status} onChange={(e)=>setStatus(a.id, e.target.value as ApplicationStatus)} className="bg-paper border border-line-dark rounded-md px-3 py-2 text-sm text-ink outline-none focus:border-gold capitalize">
                    {APPLICATION_STATUSES.map((s)=><option key={s} value={s}>{s}</option>)}
                  </select>
                  <button type="button" onClick={()=>del(a.id)} className="h-9 px-3 rounded-md border border-line-dark text-ink/50 hover:text-[hsl(var(--destructive))] hover:border-[hsl(var(--destructive))]/40"><Trash2 size={13}/></button>
                </div>
              </div>
              {a.message && <p className="text-ink/75 text-sm mt-3 leading-relaxed whitespace-pre-wrap">{a.message}</p>}
              <div className="flex flex-wrap items-center gap-4 mt-4 text-sm">
                <a href={`mailto:${a.email}`} className="inline-flex items-center gap-1.5 text-ink hover:text-gold"><Mail size={13}/> {a.email}</a>
                {a.phone && <a href={`tel:${a.phone}`} className="inline-flex items-center gap-1.5 text-ink hover:text-gold"><Phone size={13}/> {a.phone}</a>}
                {a.resume_url && <a href={a.resume_url} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 text-gold hover:underline">Resume ↗</a>}
                <span className="text-ink/40 text-xs tabular-nums ml-auto">{new Date(a.created_at).toLocaleDateString("en-IN",{day:"numeric",month:"short",year:"numeric"})}</span>
              </div>
            </div>
          ))}
        </div>
      </AdminLayout>
    </>
  );
}
