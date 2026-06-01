import { useEffect, useState } from "react";
import { Image, Loader2, Plus, Trash2 } from "lucide-react";
import Seo from "@/components/seo/Seo";
import AdminLayout from "@/components/admin/AdminLayout";
import { getSupabase, type GalleryRow } from "@/lib/supabase";
import { useAdminSession } from "@/lib/admin-auth";

const input = "w-full bg-paper border border-line-dark rounded-md px-3 py-2 text-sm text-ink outline-none focus:border-gold transition-colors";

export default function AdminGallery() {
  const { email } = useAdminSession();
  const [rows, setRows] = useState<GalleryRow[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [url, setUrl] = useState("");
  const [title, setTitle] = useState("");

  async function load() {
    const { data, error } = await getSupabase().from("vivanterra_gallery").select("*").order("sort_order");
    if (error) { setError(error.message); return; }
    setRows((data as GalleryRow[]) ?? []);
  }
  useEffect(() => { load(); }, []);
  async function add() {
    if (!url.trim()) return;
    await getSupabase().from("vivanterra_gallery").insert({ image_url: url.trim(), title: title.trim() || null, sort_order: (rows?.length ?? 0) });
    setUrl(""); setTitle(""); load();
  }
  async function del(id: string) { if (!window.confirm("Remove image?")) return; await getSupabase().from("vivanterra_gallery").delete().eq("id", id); load(); }

  return (
    <>
      <Seo title="Admin — gallery" description="Media gallery." />
      <AdminLayout email={email} title="Gallery" subtitle="Image library.">
        {error && <div className="p-4 border border-[hsl(var(--destructive))]/30 bg-[hsl(var(--destructive))]/5 text-[hsl(var(--destructive))] text-sm rounded-md mb-6">{error}</div>}
        <div className="bg-paper border border-line-dark rounded-lg p-5 mb-8 flex flex-col sm:flex-row gap-3">
          <input className={input} value={url} onChange={(e)=>setUrl(e.target.value)} placeholder="Image URL (https://…)"/>
          <input className={`${input} sm:max-w-[220px]`} value={title} onChange={(e)=>setTitle(e.target.value)} placeholder="Caption (optional)"/>
          <button type="button" onClick={add} className="inline-flex items-center justify-center gap-2 h-10 px-5 rounded-md bg-ink text-paper hover:bg-gold hover:text-ink text-[11px] tracking-[0.16em] uppercase font-semibold shrink-0"><Plus size={15}/> Add</button>
        </div>
        {rows === null && !error && <div className="flex items-center gap-3 text-ink/50"><Loader2 className="animate-spin" size={16}/> Loading…</div>}
        {rows && rows.length === 0 && <div className="border border-dashed border-line-dark rounded-lg py-16 text-center text-ink/50"><Image className="mx-auto mb-3 opacity-50"/>No images yet. Paste a URL above to add.</div>}
        {rows && rows.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {rows.map((g) => (
              <div key={g.id} className="group relative aspect-square rounded-lg overflow-hidden bg-ink/5 border border-line-dark">
                <img src={g.image_url} alt={g.alt ?? g.title ?? ""} className="h-full w-full object-cover"/>
                {g.title && <div className="absolute bottom-0 inset-x-0 bg-ink/70 text-paper text-xs px-2 py-1 truncate">{g.title}</div>}
                <button type="button" onClick={()=>del(g.id)} className="absolute top-2 right-2 w-8 h-8 rounded-full bg-ink/70 text-paper opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center hover:bg-[hsl(var(--destructive))]"><Trash2 size={13}/></button>
              </div>
            ))}
          </div>
        )}
      </AdminLayout>
    </>
  );
}
