import { useEffect, useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  ArrowUpRight,
  Briefcase,
  Calendar,
  CheckCircle2,
  IndianRupee,
  Loader2,
  Mail,
  MapPin,
  MessageCircle,
  Phone,
  Save,
  User,
} from "lucide-react";
import Seo from "@/components/seo/Seo";
import AdminLayout from "@/components/admin/AdminLayout";
import { ENQUIRY_STATUSES, getSupabase, type Enquiry } from "@/lib/supabase";
import { useAdminSession } from "@/lib/admin-auth";

export default function AdminEnquiry() {
  const { id = "" } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { email } = useAdminSession();
  const [enquiry, setEnquiry] = useState<Enquiry | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [status, setStatus] = useState<Enquiry["status"]>("new");
  const [notes, setNotes] = useState("");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        const { data, error } = await getSupabase()
          .from("vivanterra_enquiries")
          .select("*")
          .eq("id", id)
          .single();
        if (cancelled) return;
        if (error) throw error;
        const e = data as Enquiry;
        setEnquiry(e);
        setStatus(e.status);
        setNotes(e.notes ?? "");
      } catch (err) {
        if (!cancelled)
          setError(err instanceof Error ? err.message : "Failed to load");
      }
    }
    load();
    return () => {
      cancelled = true;
    };
  }, [id]);

  async function save() {
    if (!enquiry) return;
    setSaving(true);
    setSaved(false);
    try {
      const { error } = await getSupabase()
        .from("vivanterra_enquiries")
        .update({ status, notes: notes || null })
        .eq("id", enquiry.id);
      if (error) throw error;
      setEnquiry({ ...enquiry, status, notes });
      setSaved(true);
      window.setTimeout(() => setSaved(false), 2200);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Save failed");
    } finally {
      setSaving(false);
    }
  }

  if (error) {
    return (
      <AdminLayout email={email} title="Enquiry">
        <div className="p-4 border border-[hsl(var(--destructive))]/30 bg-[hsl(var(--destructive))]/5 text-[hsl(var(--destructive))] text-sm rounded-sm">
          {error}
        </div>
        <button
          type="button"
          onClick={() => navigate("/admin")}
          className="mt-6 inline-flex items-center gap-1 text-[11px] uppercase tracking-[0.18em] text-ink hover:text-gold"
        >
          <ArrowLeft size={13} /> Back to enquiries
        </button>
      </AdminLayout>
    );
  }

  if (!enquiry) {
    return (
      <AdminLayout email={email}>
        <div className="flex items-center gap-3 text-muted-soft">
          <Loader2 className="animate-spin" size={16} /> Loading…
        </div>
      </AdminLayout>
    );
  }

  const phoneClean = enquiry.phone?.replace(/[^\d+]/g, "").replace(/^\+/, "");

  return (
    <>
      <Seo title={`Enquiry · ${enquiry.name}`} description="Admin enquiry detail." />
      <AdminLayout email={email}>
        <Link
          to="/admin"
          className="inline-flex items-center gap-1 mb-7 text-[11px] uppercase tracking-[0.18em] text-muted-soft hover:text-gold"
        >
          <ArrowLeft size={13} /> All enquiries
        </Link>

        <div className="grid lg:grid-cols-12 gap-10">
          {/* Left: message + meta */}
          <div className="lg:col-span-7">
            <div className="flex items-start justify-between gap-6 mb-2">
              <div>
                <h1
                  className="font-display text-ink"
                  style={{
                    fontSize: "clamp(28px, 3vw, 36px)",
                    fontWeight: 400,
                    letterSpacing: "-0.01em",
                    lineHeight: 1.1,
                  }}
                >
                  {enquiry.name}
                </h1>
                <p className="text-muted-soft text-sm mt-1 tabular-nums">
                  Received{" "}
                  {new Date(enquiry.created_at).toLocaleString("en-IN", {
                    dateStyle: "full",
                    timeStyle: "short",
                  })}
                </p>
              </div>
            </div>

            <div className="mt-8 bg-paper border border-line-dark rounded-sm p-7 md:p-8">
              <div className="eyebrow text-gold mb-4">Message</div>
              <p className="text-ink/85 leading-relaxed whitespace-pre-wrap text-[15px]">
                {enquiry.message}
              </p>
            </div>

            <dl className="mt-8 grid sm:grid-cols-2 gap-y-5 gap-x-8 text-sm">
              <DetailField icon={<Mail size={13} />} label="Email">
                <a
                  href={`mailto:${enquiry.email}`}
                  className="text-ink hover:text-gold break-all"
                >
                  {enquiry.email}
                </a>
              </DetailField>

              {enquiry.phone && (
                <DetailField icon={<Phone size={13} />} label="Phone">
                  <a
                    href={`tel:${enquiry.phone.replace(/\s/g, "")}`}
                    className="text-ink hover:text-gold tabular-nums"
                  >
                    {enquiry.phone}
                  </a>
                </DetailField>
              )}

              {enquiry.scope && (
                <DetailField icon={<Briefcase size={13} />} label="Scope">
                  <span className="text-ink capitalize">{enquiry.scope}</span>
                </DetailField>
              )}

              {enquiry.budget && (
                <DetailField icon={<IndianRupee size={13} />} label="Budget">
                  <span className="text-ink">{enquiry.budget}</span>
                </DetailField>
              )}

              {enquiry.project_slug && (
                <DetailField icon={<MapPin size={13} />} label="Project">
                  <Link
                    to={`/projects/${enquiry.project_slug}`}
                    className="text-gold hover:underline"
                  >
                    {enquiry.project_slug} <ArrowUpRight size={11} className="inline" />
                  </Link>
                </DetailField>
              )}

              <DetailField icon={<User size={13} />} label="Source">
                <span className="text-ink">{enquiry.source}</span>
              </DetailField>
            </dl>

            <div className="mt-10 flex flex-wrap items-center gap-3">
              <a
                href={`mailto:${enquiry.email}?subject=Re: your enquiry about Vivanterra`}
                className="inline-flex items-center gap-2 h-11 px-5 rounded-sm bg-ink text-paper hover:bg-gold hover:text-ink transition-colors text-[11px] tracking-[0.18em] uppercase font-semibold"
              >
                <Mail size={13} /> Reply by email
              </a>
              {phoneClean && (
                <>
                  <a
                    href={`tel:${enquiry.phone}`}
                    className="inline-flex items-center gap-2 h-11 px-5 rounded-sm border border-ink/30 text-ink hover:bg-ink hover:text-paper transition-colors text-[11px] tracking-[0.18em] uppercase font-medium"
                  >
                    <Phone size={13} /> Call
                  </a>
                  <a
                    href={`https://wa.me/${phoneClean}?text=${encodeURIComponent(
                      `Hi ${enquiry.name.split(" ")[0]}, thanks for reaching out to Vivanterra. — `,
                    )}`}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 h-11 px-5 rounded-sm border border-ink/30 text-ink hover:bg-ink hover:text-paper transition-colors text-[11px] tracking-[0.18em] uppercase font-medium"
                  >
                    <MessageCircle size={13} /> WhatsApp
                  </a>
                </>
              )}
            </div>
          </div>

          {/* Right: status + notes */}
          <aside className="lg:col-span-5">
            <div className="bg-paper border border-line-dark rounded-sm p-7 md:p-8 lg:sticky lg:top-24">
              <div className="eyebrow text-gold mb-4">Status & notes</div>

              <label className="block mb-5">
                <span className="eyebrow text-muted-soft mb-2 inline-block">
                  Lead status
                </span>
                <select
                  value={status}
                  onChange={(e) =>
                    setStatus(e.target.value as Enquiry["status"])
                  }
                  className="w-full bg-paper border border-line-dark rounded-md px-4 py-3 text-[15px] text-ink outline-none focus:border-gold transition-colors capitalize"
                >
                  {ENQUIRY_STATUSES.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </label>

              <label className="block mb-5">
                <span className="eyebrow text-muted-soft mb-2 inline-block">
                  Private notes
                </span>
                <textarea
                  rows={8}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Internal notes about this lead — not visible to the enquirer."
                  className="w-full bg-[rgba(78,115,83,0.04)] border border-line-dark rounded-md px-4 py-3 text-[14px] text-ink placeholder:text-ink/45 outline-none focus:border-gold focus:bg-paper transition-colors resize-none"
                />
              </label>

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={save}
                  disabled={saving}
                  className="inline-flex items-center gap-2 h-11 px-5 rounded-sm bg-gold text-ink font-semibold text-[11px] tracking-[0.20em] uppercase hover:bg-ink hover:text-paper transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {saving ? (
                    <>
                      <Loader2 className="animate-spin" size={13} /> Saving
                    </>
                  ) : (
                    <>
                      <Save size={13} /> Save changes
                    </>
                  )}
                </button>
                {saved && (
                  <span className="inline-flex items-center gap-1 text-[12px] text-[hsl(140_45%_38%)]">
                    <CheckCircle2 size={13} /> Saved
                  </span>
                )}
              </div>

              <div className="mt-7 pt-5 border-t border-line-dark text-[11px] tracking-[0.16em] uppercase text-muted-soft tabular-nums">
                <span className="inline-flex items-center gap-1.5">
                  <Calendar size={11} className="opacity-60" />
                  Last updated{" "}
                  {new Date(enquiry.updated_at).toLocaleString("en-IN", {
                    dateStyle: "medium",
                    timeStyle: "short",
                  })}
                </span>
              </div>
            </div>
          </aside>
        </div>
      </AdminLayout>
    </>
  );
}

function DetailField({
  icon,
  label,
  children,
}: {
  icon: React.ReactNode;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <dt className="flex items-center gap-1.5 text-[10px] tracking-[0.18em] uppercase text-muted-soft mb-1.5">
        <span className="text-gold">{icon}</span>
        {label}
      </dt>
      <dd>{children}</dd>
    </div>
  );
}
