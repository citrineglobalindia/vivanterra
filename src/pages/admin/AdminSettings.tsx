import { useEffect, useState } from "react";
import { CheckCircle2, Loader2, Save } from "lucide-react";
import Seo from "@/components/seo/Seo";
import AdminLayout from "@/components/admin/AdminLayout";
import { getSupabase } from "@/lib/supabase";
import { useAdminSession } from "@/lib/admin-auth";

const input = "w-full bg-[rgba(78,115,83,0.04)] border border-line-dark rounded-md px-3.5 py-2.5 text-[14px] text-ink outline-none focus:border-gold focus:bg-paper transition-colors";

type Contact = { phone: string; whatsapp: string; email: string; instagram: string; linkedin: string };
const DEFAULTS: Contact = { phone: "+91 88675 89797", whatsapp: "918867589797", email: "hello@vivanterra.in", instagram: "https://www.instagram.com/", linkedin: "https://www.linkedin.com/" };

export default function AdminSettings() {
  const { email } = useAdminSession();
  const [c, setC] = useState<Contact>(DEFAULTS);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const { data } = await getSupabase().from("vivanterra_settings").select("value").eq("key", "contact").single();
        if (data?.value) setC({ ...DEFAULTS, ...(data.value as Partial<Contact>) });
      } catch { /* no row yet */ }
      finally { setLoading(false); }
    })();
  }, []);

  async function save() {
    setSaving(true); setError(null); setSaved(false);
    try {
      const { error } = await getSupabase().from("vivanterra_settings").upsert({ key: "contact", value: c });
      if (error) throw error;
      setSaved(true); setTimeout(()=>setSaved(false), 2200);
    } catch (err) { setError(err instanceof Error ? err.message : "Save failed"); }
    finally { setSaving(false); }
  }

  if (loading) return <AdminLayout email={email}><div className="flex items-center gap-3 text-ink/50"><Loader2 className="animate-spin" size={16}/> Loading…</div></AdminLayout>;

  return (
    <>
      <Seo title="Admin — settings" description="Site settings." />
      <AdminLayout email={email} title="Theme & settings" subtitle="Contact details used across the site."
        actions={<button type="button" onClick={save} disabled={saving} className="inline-flex items-center gap-2 h-11 px-5 rounded-md bg-gold text-ink hover:bg-ink hover:text-paper text-[11px] tracking-[0.18em] uppercase font-semibold disabled:opacity-60">{saving?<Loader2 className="animate-spin" size={14}/>:saved?<CheckCircle2 size={14}/>:<Save size={14}/>}{saved?"Saved":"Save"}</button>}>
        {error && <div className="p-4 border border-[hsl(var(--destructive))]/30 bg-[hsl(var(--destructive))]/5 text-[hsl(var(--destructive))] text-sm rounded-md mb-6">{error}</div>}
        <div className="max-w-xl bg-paper border border-line-dark rounded-lg p-6 space-y-4">
          <div className="eyebrow text-gold text-[10px] mb-2">Contact</div>
          {([["phone","Phone (display)"],["whatsapp","WhatsApp number (digits only)"],["email","Email"],["instagram","Instagram URL"],["linkedin","LinkedIn URL"]] as [keyof Contact,string][]).map(([k,label])=>(
            <div key={k}><span className="block text-[11px] tracking-[0.12em] uppercase text-ink/55 mb-1.5">{label}</span><input className={input} value={c[k]} onChange={(e)=>setC({...c,[k]:e.target.value})}/></div>
          ))}
          <p className="text-ink/45 text-xs pt-2">Note: these are stored in the database. Wiring the public site to read from here (instead of hardcoded values) is a follow-up step.</p>
        </div>
      </AdminLayout>
    </>
  );
}
