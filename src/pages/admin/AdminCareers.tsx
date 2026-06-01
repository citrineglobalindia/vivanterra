import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Briefcase, ChevronRight, Loader2, Plus, Save, Trash2 } from "lucide-react";
import Seo from "@/components/seo/Seo";
import AdminLayout from "@/components/admin/AdminLayout";
import { getSupabase, type CareerPosition } from "@/lib/supabase";
import { useAdminSession } from "@/lib/admin-auth";

const input = "w-full bg-paper border border-line-dark rounded-md px-3 py-2 text-sm text-ink outline-none focus:border-gold transition-colors";

export default function AdminCareers() {
  const { email } = useAdminSession();
  const [rows, setRows] = useState<CareerPosition[] | null>(null);
  const [appCount, setAppCount] = useState<number>(0);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function load() {
    const sb = getSupabase();
    const [{ data, error }, apps] = await Promise.all([
      sb.from("vivanterra_career_positions").select("*").order("sort_order"),
      sb.from("vivanterra_career_applications").select("*", { count: "exact", head: true }),
    ]);
    if (error) { setError(error.message); return; }
    setRows((data as CareerPosition[]) ?? []);
    setAppCount(apps.count ?? 0);
  }
  useEffect(() => { load(); }, []);

  async function add() {
    setBusy(true);
    await getSupabase().from("vivanterra_career_positions").insert({ title: "New role", sort_order: rows?.length ?? 0, description: [] });
    await load(); setBusy(false);
  }
  async function save(r: CareerPosition) {
    setBusy(true);
    await getSupabase().from("vivanterra_career_positions").update({
      title: r.title, department: r.department, location: r.location, type: r.type, summary: r.summary, published: r.published,
    }).eq("id", r.id);
    setBusy(false);
  }
  async function del(id: string) { if (!window.confirm("Delete this position?")) return; await getSupabase().from("vivanterra_career_positions").delete().eq("id", id); load(); }
  function patch(id: string, k: keyof CareerPosition, v: unknown) { setRows((rs) => (rs ?? []).map((r) => r.id === id ? { ...r, [k]: v } : r)); }

  return (
    <>
      <Seo title="Admin — careers" description="Manage open positions." />
      <AdminLayout email={email} title="Careers" subtitle="Open positions & applications."
        actions={
          <div className="flex items-center gap-3">
            <Link to="/admin/applications" className="inline-flex items-center gap-2 h-11 px-5 rounded-md border border-line-dark text-ink hover:border-gold hover:text-gold text-[11px] tracking-[0.16em] uppercase">
              Applications <span className="tabular-nums bg-gold/20 px-1.5 rounded-full">{appCount}</span>
            </Link>
            <button type="button" onClick={add} disabled={busy} className="inline-flex items-center gap-2 h-11 px-5 rounded-md bg-ink text-paper hover:bg-gold hover:text-ink text-[11px] tracking-[0.16em] uppercase font-semibold disabled:opacity-60"><Plus size={15}/> Add role</button>
          </div>
        }>
        {error && <div className="p-4 border border-[hsl(var(--destructive))]/30 bg-[hsl(var(--destructive))]/5 text-[hsl(var(--destructive))] text-sm rounded-md mb-6">{error}</div>}
        {rows === null && !error && <div className="flex items-center gap-3 text-ink/50"><Loader2 className="animate-spin" size={16}/> Loading…</div>}
        {rows && rows.length === 0 && <div className="border border-dashed border-line-dark rounded-lg py-16 text-center text-ink/50"><Briefcase className="mx-auto mb-3 opacity-50"/>No positions. Click "Add role".</div>}
        <div className="space-y-4">
          {(rows ?? []).map((r) => (
            <div key={r.id} className="bg-paper border border-line-dark rounded-lg p-5 grid md:grid-cols-2 gap-3">
              <input className={input} value={r.title} onChange={(e)=>patch(r.id,"title",e.target.value)} placeholder="Role title"/>
              <input className={input} value={r.department ?? ""} onChange={(e)=>patch(r.id,"department",e.target.value)} placeholder="Department"/>
              <input className={input} value={r.location ?? ""} onChange={(e)=>patch(r.id,"location",e.target.value)} placeholder="Location"/>
              <input className={input} value={r.type ?? ""} onChange={(e)=>patch(r.id,"type",e.target.value)} placeholder="Type (Full-time)"/>
              <input className={`${input} md:col-span-2`} value={r.summary ?? ""} onChange={(e)=>patch(r.id,"summary",e.target.value)} placeholder="One-line summary"/>
              <div className="md:col-span-2 flex items-center justify-between pt-1">
                <label className="flex items-center gap-2 text-sm text-ink cursor-pointer"><input type="checkbox" checked={r.published} onChange={(e)=>patch(r.id,"published",e.target.checked)} className="w-4 h-4 accent-[var(--gold)]"/> Published</label>
                <div className="flex items-center gap-2">
                  <button type="button" onClick={()=>save(r)} disabled={busy} className="inline-flex items-center gap-1.5 h-9 px-4 rounded-md bg-gold text-ink hover:bg-ink hover:text-paper text-[10px] tracking-[0.16em] uppercase font-semibold"><Save size={12}/> Save</button>
                  <button type="button" onClick={()=>del(r.id)} className="h-9 px-3 rounded-md border border-line-dark text-ink/50 hover:text-[hsl(var(--destructive))] hover:border-[hsl(var(--destructive))]/40"><Trash2 size={13}/></button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </AdminLayout>
    </>
  );
}
