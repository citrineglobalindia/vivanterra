import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Loader2, Pencil, PenSquare, Plus } from "lucide-react";
import Seo from "@/components/seo/Seo";
import AdminLayout from "@/components/admin/AdminLayout";
import { getSupabase, type PostRow } from "@/lib/supabase";
import { useAdminSession } from "@/lib/admin-auth";

export default function AdminBlogs() {
  const { email } = useAdminSession();
  const [rows, setRows] = useState<PostRow[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function load() {
    try {
      const { data, error } = await getSupabase().from("vivanterra_posts").select("*").order("sort_order");
      if (error) throw error;
      setRows((data as PostRow[]) ?? []);
    } catch (err) { setError(err instanceof Error ? err.message : "Failed to load"); }
  }
  useEffect(() => { load(); }, []);

  return (
    <>
      <Seo title="Admin — blogs" description="Manage journal posts." />
      <AdminLayout email={email} title="Blogs" subtitle="Journal / essay posts."
        actions={<Link to="/admin/blogs/new" className="inline-flex items-center gap-2 h-11 px-5 rounded-md bg-ink text-paper hover:bg-gold hover:text-ink transition-colors text-[11px] tracking-[0.16em] uppercase font-semibold"><Plus size={15} /> New post</Link>}>
        {error && <div className="p-4 border border-[hsl(var(--destructive))]/30 bg-[hsl(var(--destructive))]/5 text-[hsl(var(--destructive))] text-sm rounded-md mb-6">{error}</div>}
        {rows === null && !error && <div className="flex items-center gap-3 text-ink/50"><Loader2 className="animate-spin" size={16} /> Loading…</div>}
        {rows && rows.length === 0 && (
          <div className="border border-dashed border-line-dark rounded-lg py-16 text-center text-ink/50"><PenSquare className="mx-auto mb-3 opacity-50" />No posts yet. The site currently uses built-in posts; add one here to manage from the DB.</div>
        )}
        {rows && rows.length > 0 && (
          <div className="border border-line-dark rounded-lg bg-paper overflow-hidden divide-y divide-line-dark">
            {rows.map((p) => (
              <div key={p.id} className="flex items-center gap-4 px-5 py-4">
                <div className="w-14 h-14 rounded-md bg-ink/5 overflow-hidden shrink-0">{p.image && <img src={p.image} alt="" className="h-full w-full object-cover" />}</div>
                <div className="min-w-0 flex-1">
                  <div className="font-medium text-ink truncate">{p.title}</div>
                  <div className="text-ink/55 text-xs truncate">{p.category} · {p.author} {!p.published && "· Draft"}</div>
                </div>
                <Link to={`/admin/blogs/${p.id}/edit`} className="inline-flex items-center gap-1.5 h-9 px-4 rounded-md border border-line-dark text-ink hover:border-gold hover:text-gold text-[10px] tracking-[0.16em] uppercase"><Pencil size={12} /> Edit</Link>
              </div>
            ))}
          </div>
        )}
      </AdminLayout>
    </>
  );
}
