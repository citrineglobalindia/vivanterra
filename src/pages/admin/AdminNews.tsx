import { useEffect, useState } from "react";
import { Loader2, Newspaper, Plus, Save, Trash2 } from "lucide-react";
import Seo from "@/components/seo/Seo";
import AdminLayout from "@/components/admin/AdminLayout";
import { getSupabase, type NewsRow } from "@/lib/supabase";
import { useAdminSession } from "@/lib/admin-auth";

const input = "w-full bg-paper border border-line-dark rounded-md px-3 py-2 text-sm text-ink outline-none focus:border-gold transition-colors";

export default function AdminNews() {
  const { email } = useAdminSession();
  const [rows, setRows] = useState<NewsRow[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function load() {
    const { data, error } = await getSupabase().from("vivanterra_news").select("*").order("sort_order");
    if (error) { setError(error.message); return; }
    setRows((data as NewsRow[]) ?? []);
  }
  useEffect(() => { load(); }, []);

  async function add() {
    setBusy(true);
    await getSupabase().from("vivanterra_news").insert({ title: "New item", sort_order: (rows?.length ?? 0) });
    await load(); setBusy(false);
  }
  async function save(r: NewsRow) {
    setBusy(true);
    await getSupabase().from("vivanterra_news").update({ title: r.title, dek: r.dek, date_label: r.date_label, image: r.image, link: r.link, published: r.published }).eq("id", r.id);
    setBusy(false);
  }
  async function del(id: string) {
    if (!window.confirm("Delete this news item?")) return;
    await getSupabase().from("vivanterra_news").delete().eq("id", id); load();
  }
  function patch(id: string, key: keyof NewsRow, val: unknown) {
    setRows((rs) => (rs ?? []).map((r) => (r.id === id ? { ...r, [key]: val } : r)));
  }

  return (
    <>
      <Seo title="Admin — news" description="Manage news." />
      <AdminLayout email={email} title="News" subtitle="Homepage news items."
        actions={<button type="button" onClick={add} disabled={busy} className="inline-flex items-center gap-2 h-11 px-5 rounded-md bg-ink text-paper hover:bg-gold hover:text-ink text-[11px] tracking-[0.16em] uppercase font-semibold disabled:opacity-60"><Plus size={15}/> Add item</button>}>
        {error && <div className="p-4 border border-[hsl(var(--destructive))]/30 bg-[hsl(var(--destructive))]/5 text-[hsl(var(--destructive))] text-sm rounded-md mb-6">{error}</div>}
        {rows === null && !error && <div className="flex items-center gap-3 text-ink/50"><Loader2 className="animate-spin" size={16}/> Loading…</div>}
        {rows && rows.length === 0 && <div className="border border-dashed border-line-dark rounded-lg py-16 text-center text-ink/50"><Newspaper className="mx-auto mb-3 opacity-50"/>No news items. Click "Add item".</div>}
        <div className="space-y-4">
          {(rows ?? []).map((r) => (
            <div key={r.id} className="bg-paper border border-line-dark rounded-lg p-5 grid md:grid-cols-2 gap-3">
              <input className={input} value={r.title} onChange={(e)=>patch(r.id,"title",e.target.value)} placeholder="Title"/>
              <input className={input} value={r.date_label ?? ""} onChange={(e)=>patch(r.id,"date_label",e.target.value)} placeholder="Date (e.g. May 2026)"/>
              <input className={`${input} md:col-span-2`} value={r.dek ?? ""} onChange={(e)=>patch(r.id,"dek",e.target.value)} placeholder="Short description"/>
              <input className={input} value={r.image ?? ""} onChange={(e)=>patch(r.id,"image",e.target.value)} placeholder="Image URL"/>
              <input className={input} value={r.link ?? ""} onChange={(e)=>patch(r.id,"link",e.target.value)} placeholder="Link URL"/>
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
