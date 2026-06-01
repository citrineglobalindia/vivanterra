import { useEffect, useState } from "react";
import { Download, Loader2, Mail, Users } from "lucide-react";
import Seo from "@/components/seo/Seo";
import AdminLayout from "@/components/admin/AdminLayout";
import { getSupabase, type SubscriberRow } from "@/lib/supabase";
import { useAdminSession } from "@/lib/admin-auth";

export default function AdminSubscribers() {
  const { email } = useAdminSession();
  const [rows, setRows] = useState<SubscriberRow[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const { data, error } = await getSupabase().from("vivanterra_subscribers").select("*").order("created_at", { ascending: false });
        if (error) throw error;
        setRows((data as SubscriberRow[]) ?? []);
      } catch (err) { setError(err instanceof Error ? err.message : "Failed to load"); }
    })();
  }, []);

  function exportCsv() {
    if (!rows) return;
    const csv = ["email,status,source,subscribed_at", ...rows.map((r) => `${r.email},${r.status},${r.source},${r.created_at}`)].join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "vivanterra-subscribers.csv";
    a.click();
  }

  return (
    <>
      <Seo title="Admin — subscribers" description="Newsletter subscribers." />
      <AdminLayout email={email} title="Subscribers" subtitle="Newsletter sign-ups."
        actions={rows && rows.length > 0 ? (
          <button type="button" onClick={exportCsv} className="inline-flex items-center gap-2 h-11 px-5 rounded-md border border-line-dark text-ink hover:border-gold hover:text-gold transition-colors text-[11px] tracking-[0.16em] uppercase">
            <Download size={14} /> Export CSV
          </button>
        ) : undefined}>
        {error && <div className="p-4 border border-[hsl(var(--destructive))]/30 bg-[hsl(var(--destructive))]/5 text-[hsl(var(--destructive))] text-sm rounded-md mb-6">{error}</div>}
        {rows === null && !error && <div className="flex items-center gap-3 text-ink/50"><Loader2 className="animate-spin" size={16} /> Loading…</div>}
        {rows && rows.length === 0 && (
          <div className="border border-dashed border-line-dark rounded-lg py-16 text-center text-ink/50"><Users className="mx-auto mb-3 opacity-50" />No subscribers yet.</div>
        )}
        {rows && rows.length > 0 && (
          <div className="border border-line-dark rounded-lg bg-paper overflow-hidden">
            <ul className="divide-y divide-line-dark">
              {rows.map((s) => (
                <li key={s.id} className="flex items-center justify-between px-6 py-4">
                  <span className="flex items-center gap-3 text-ink"><Mail size={14} className="text-gold/70" />{s.email}</span>
                  <span className="flex items-center gap-4 text-xs text-ink/50">
                    <span className="capitalize">{s.status}</span>
                    <span className="tabular-nums">{new Date(s.created_at).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}</span>
                  </span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </AdminLayout>
    </>
  );
}
