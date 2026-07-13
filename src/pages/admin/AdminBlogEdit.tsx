import { useEffect, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { ArrowLeft, Loader2, Plus, Save, Trash2 } from "lucide-react";
import Seo from "@/components/seo/Seo";
import AdminLayout from "@/components/admin/AdminLayout";
import { getSupabase, type PostRow } from "@/lib/supabase";
import { useAdminSession } from "@/lib/admin-auth";

const input = "w-full bg-[rgba(78,115,83,0.04)] border border-line-dark rounded-md px-3.5 py-2.5 text-[14px] text-ink placeholder:text-ink/40 outline-none focus:border-gold focus:bg-paper transition-colors";
function slugify(s: string){return s.toLowerCase().trim().replace(/[^a-z0-9\s-]/g,"").replace(/\s+/g,"-").replace(/-+/g,"-");}

export default function AdminBlogEdit() {
  const { id } = useParams<{ id: string }>();
  const isNew = !id || id === "new";
  const nav = useNavigate();
  const { email } = useAdminSession();
  const [f, setF] = useState({ slug:"", title:"", dek:"", category:"Vivanterra Notes", author:"", date_label:"", reading_time:"", image:"", body:[""], featured:false, published:true });
  const [loading, setLoading] = useState(!isNew);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isNew) return;
    (async () => {
      try {
        const { data, error } = await getSupabase().from("vivanterra_posts").select("*").eq("id", id).single();
        if (error) throw error;
        const p = data as PostRow;
        setF({ slug:p.slug, title:p.title, dek:p.dek??"", category:p.category??"", author:p.author??"", date_label:p.date_label??"", reading_time:p.reading_time??"", image:p.image??"", body:p.body?.length?p.body:[""], featured:p.featured, published:p.published });
      } catch (err) { setError(err instanceof Error ? err.message : "Failed to load"); }
      finally { setLoading(false); }
    })();
  }, [id, isNew]);

  async function save() {
    setError(null);
    if (!f.title.trim()) return setError("Title is required.");
    setSaving(true);
    try {
      const payload = { slug: slugify(f.slug || f.title), title:f.title.trim(), dek:f.dek||null, category:f.category||null, author:f.author||null, date_label:f.date_label||null, reading_time:f.reading_time||null, image:f.image||null, body:f.body.map((b)=>b.trim()).filter(Boolean), featured:f.featured, published:f.published };
      const sb = getSupabase();
      if (isNew) { const { error } = await sb.from("vivanterra_posts").insert(payload); if (error) throw error; }
      else { const { error } = await sb.from("vivanterra_posts").update(payload).eq("id", id); if (error) throw error; }
      nav("/admin/blogs");
    } catch (err) { setError(err instanceof Error ? err.message : "Save failed"); }
    finally { setSaving(false); }
  }
  async function remove() {
    if (isNew || !id || !window.confirm("Delete this post?")) return;
    await getSupabase().from("vivanterra_posts").delete().eq("id", id);
    nav("/admin/blogs");
  }

  if (loading) return <AdminLayout email={email}><div className="flex items-center gap-3 text-ink/50"><Loader2 className="animate-spin" size={16}/> Loading…</div></AdminLayout>;

  return (
    <>
      <Seo title={isNew?"Admin — new post":"Admin — edit post"} description="Post editor." />
      <AdminLayout email={email} title={isNew?"New post":"Edit post"} actions={
        <div className="flex items-center gap-3">
          {!isNew && <button type="button" onClick={remove} className="inline-flex items-center gap-1.5 h-11 px-4 rounded-md border border-[hsl(var(--destructive))]/40 text-[hsl(var(--destructive))] hover:bg-[hsl(var(--destructive))]/5 text-[11px] tracking-[0.16em] uppercase"><Trash2 size={13}/> Delete</button>}
          <button type="button" onClick={save} disabled={saving} className="inline-flex items-center gap-2 h-11 px-5 rounded-md bg-gold text-ink hover:bg-ink hover:text-paper text-[11px] tracking-[0.18em] uppercase font-semibold disabled:opacity-60">{saving?<Loader2 className="animate-spin" size={14}/>:<Save size={14}/>} Save</button>
        </div>}>
        <Link to="/admin/blogs" className="inline-flex items-center gap-1 mb-7 text-[11px] uppercase tracking-[0.18em] text-ink/55 hover:text-gold"><ArrowLeft size={13}/> All posts</Link>
        {error && <div className="p-4 border border-[hsl(var(--destructive))]/30 bg-[hsl(var(--destructive))]/5 text-[hsl(var(--destructive))] text-sm rounded-md mb-6">{error}</div>}
        <div className="grid lg:grid-cols-3 gap-6 max-w-5xl">
          <div className="lg:col-span-2 space-y-5">
            <div className="bg-paper border border-line-dark rounded-lg p-6 space-y-4">
              <L label="Title"><input className={input} value={f.title} onChange={(e)=>setF({...f,title:e.target.value})}/></L>
              <L label="Slug"><input className={input} value={f.slug} onChange={(e)=>setF({...f,slug:e.target.value})} placeholder={slugify(f.title)||"slug"}/></L>
              <L label="Dek (summary)"><textarea rows={2} className={`${input} resize-none`} value={f.dek} onChange={(e)=>setF({...f,dek:e.target.value})}/></L>
            </div>
            <div className="bg-paper border border-line-dark rounded-lg p-6">
              <div className="eyebrow text-gold mb-4 text-[10px]">Body (one paragraph per box)</div>
              {f.body.map((b,i)=>(
                <div key={i} className="flex gap-2 mb-2">
                  <textarea rows={3} className={`${input} resize-none flex-1`} value={b} onChange={(e)=>{const n=[...f.body];n[i]=e.target.value;setF({...f,body:n});}}/>
                  <button type="button" onClick={()=>setF({...f,body:f.body.filter((_,j)=>j!==i)})} className="shrink-0 w-10 rounded-md border border-line-dark text-ink/50 hover:text-[hsl(var(--destructive))]"><Trash2 size={13} className="mx-auto"/></button>
                </div>
              ))}
              <button type="button" onClick={()=>setF({...f,body:[...f.body,""]})} className="inline-flex items-center gap-1.5 text-[11px] tracking-[0.16em] uppercase text-ink/60 hover:text-gold mt-1"><Plus size={13}/> Add paragraph</button>
            </div>
          </div>
          <div className="space-y-5">
            <div className="bg-paper border border-line-dark rounded-lg p-6 space-y-4">
              <L label="Category"><input className={input} value={f.category} onChange={(e)=>setF({...f,category:e.target.value})}/></L>
              <L label="Author"><input className={input} value={f.author} onChange={(e)=>setF({...f,author:e.target.value})}/></L>
              <L label="Date label"><input className={input} value={f.date_label} onChange={(e)=>setF({...f,date_label:e.target.value})} placeholder="April 2026"/></L>
              <L label="Reading time"><input className={input} value={f.reading_time} onChange={(e)=>setF({...f,reading_time:e.target.value})} placeholder="8 min read"/></L>
              <label className="flex items-center gap-3 cursor-pointer"><input type="checkbox" checked={f.featured} onChange={(e)=>setF({...f,featured:e.target.checked})} className="w-4 h-4 accent-[var(--gold)]"/><span className="text-sm text-ink">Featured</span></label>
              <label className="flex items-center gap-3 cursor-pointer"><input type="checkbox" checked={f.published} onChange={(e)=>setF({...f,published:e.target.checked})} className="w-4 h-4 accent-[var(--gold)]"/><span className="text-sm text-ink">Published</span></label>
            </div>
            <div className="bg-paper border border-line-dark rounded-lg p-6">
              <L label="Image URL"><input className={input} value={f.image} onChange={(e)=>setF({...f,image:e.target.value})} placeholder="https://…"/></L>
              {f.image && <div className="mt-3 aspect-[16/10] rounded-md overflow-hidden bg-ink/5 border border-line-dark"><img src={f.image} alt="" className="h-full w-full object-cover"/></div>}
            </div>
          </div>
        </div>
      </AdminLayout>
    </>
  );
}
function L({label,children}:{label:string;children:React.ReactNode}){return <div><span className="block text-[11px] tracking-[0.12em] uppercase text-ink/55 mb-1.5">{label}</span>{children}</div>;}
