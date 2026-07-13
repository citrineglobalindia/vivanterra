import Seo from "@/components/seo/Seo";
import { useMemo, useState, type FormEvent } from "react";
import { toast } from "sonner";
import PageShell from "@/components/ui/PageShell";
import Reveal from "@/components/ui/Reveal";
import { motion } from "framer-motion";
import {
  ArrowUpRight,
  Briefcase,
  Building2,
  Clock,
  Hammer,
  Heart,
  Layers,
  MapPin,
  Sparkles,
  Users,
} from "lucide-react";

/* ── Data ────────────────────────────────────────────── */

const VALUES = [
  {
    n: "01",
    icon: <Hammer size={18} />,
    title: "Craft, before everything",
    body: "We build slowly so the work outlasts us. You'll be supported in doing your best work, not your fastest.",
  },
  {
    n: "02",
    icon: <Users size={18} />,
    title: "A small studio voice",
    body: "Eighteen people, one room. Every project is led by a partner; no idea is lost in a hierarchy.",
  },
  {
    n: "03",
    icon: <Heart size={18} />,
    title: "We hire for character",
    body: "Talent is plentiful. We hire for patience, kindness and the kind of curiosity that keeps reading at midnight.",
  },
];

type Department =
  | "Design"
  | "Construction"
  | "Studio"
  | "Velociti"
  | "Operations";

type Role = {
  title: string;
  department: Department;
  location: string;
  type: "Full-time" | "Contract" | "Internship";
  posted: string;
  blurb: string;
};

const ROLES: Role[] = [
  {
    title: "Senior Architect",
    department: "Design",
    location: "Bengaluru",
    type: "Full-time",
    posted: "May 2026",
    blurb:
      "Lead schematic and detailed design for a new Sadashiva Nagar residence, working directly with the founding partners.",
  },
  {
    title: "Interior Designer",
    department: "Design",
    location: "Bengaluru",
    type: "Full-time",
    posted: "May 2026",
    blurb:
      "Compose interiors for upcoming residences — material palettes, joinery details, lighting and styling.",
  },
  {
    title: "Project Lead — Site",
    department: "Construction",
    location: "Bengaluru",
    type: "Full-time",
    posted: "April 2026",
    blurb:
      "Hold the site standard. Coordinate craft, contractors and consultants from groundbreak to handover.",
  },
  {
    title: "Quality Captain",
    department: "Construction",
    location: "Bengaluru",
    type: "Full-time",
    posted: "April 2026",
    blurb:
      "Walk every floor every week. Document, photograph, escalate. The eye between drawing and reality.",
  },
  {
    title: "Client Concierge",
    department: "Studio",
    location: "Bengaluru",
    type: "Full-time",
    posted: "May 2026",
    blurb:
      "Read and respond to every enquiry the studio receives. Host visits, prepare briefs, coordinate handovers.",
  },
  {
    title: "Sales Director",
    department: "Velociti",
    location: "Bengaluru",
    type: "Full-time",
    posted: "March 2026",
    blurb:
      "Lead Velociti, our sales atelier. Build the relationships that bring clients to us and never the other way around.",
  },
  {
    title: "Editorial Lead",
    department: "Studio",
    location: "Bengaluru / Remote",
    type: "Contract",
    posted: "April 2026",
    blurb:
      "Custodian of our voice across print, digital and the occasional handwritten note.",
  },
  {
    title: "Operations Associate",
    department: "Operations",
    location: "Bengaluru",
    type: "Full-time",
    posted: "May 2026",
    blurb:
      "Keep the studio running quietly: vendors, finance, the long tail of details that makes craft possible.",
  },
];

const DEPARTMENTS: ("All" | Department)[] = [
  "All",
  "Design",
  "Construction",
  "Studio",
  "Velociti",
  "Operations",
];

const PROCESS = [
  { n: "01", title: "We read every CV", body: "No bots. The hiring partner reads what you send within a week." },
  { n: "02", title: "A first conversation", body: "Forty minutes, on Zoom or at the studio. We listen, we share context." },
  { n: "03", title: "A studio day", body: "Spend a working day with the team. Bring a project you're proud of." },
  { n: "04", title: "An offer, or a thank-you", body: "Either way, you'll hear from us within ten days. We promise the courtesy." },
];

/* ── Component ───────────────────────────────────────── */

export default function Career() {
  const [filter, setFilter] = useState<(typeof DEPARTMENTS)[number]>("All");

  const filtered = useMemo(
    () => (filter === "All" ? ROLES : ROLES.filter((r) => r.department === filter)),
    [filter],
  );

  const counts = useMemo(() => {
    const map: Record<string, number> = { All: ROLES.length };
    for (const r of ROLES) map[r.department] = (map[r.department] || 0) + 1;
    return map;
  }, []);

  return (
    <PageShell
      title={
        <>
      <Seo
        title={"Careers at the studio"}
        description={"Open roles at Vivanterra. We move slowly and hire people who have stayed."}
      />
          Build the <span className="">next chapter.</span>
        </>
      }
      intro="A small atelier in Bengaluru — designers, architects, craftspeople and operators. We hire rarely and quietly. If our work resonates with yours, we'd love to read."
    >
      {/* ───────── 01 · Why work with us ───────── */}
      <section className="mb-24 md:mb-32">
        <Reveal>
          <div className="flex items-center gap-3 mb-12">
            <span className="eyebrow text-muted-soft">Why Vivanterra</span>
          </div>
        </Reveal>

        <div className="grid md:grid-cols-3 gap-10 md:gap-12">
          {VALUES.map((v, i) => (
            <Reveal key={v.n} delay={i * 0.1}>
              <article className="relative pt-8">
                <span className="absolute top-0 left-0 w-12 h-px bg-gold" />
                <div className="flex items-center gap-3 mb-5 text-gold">
                  <span className="text-[11px] tracking-[0.22em] tabular-nums">
                    {v.n}
                  </span>
                  <span className="w-px h-3 bg-gold/60" />
                  {v.icon}
                </div>
                <h3
                  className="font-display text-ink mb-3"
                  style={{
                    fontSize: "clamp(22px, 2.4vw, 30px)",
                    fontWeight: 400,
                    letterSpacing: "-0.01em",
                    lineHeight: 1.15,
                  }}
                >
                  {v.title}
                </h3>
                <p className="text-muted-soft leading-relaxed text-sm">
                  {v.body}
                </p>
              </article>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ───────── 02 · Open positions ───────── */}
      <section className="mb-24 md:mb-32">
        <div className="hairline-dark mb-16 md:mb-20" />

        <div className="grid md:grid-cols-12 gap-8 mb-10 items-end">
          <div className="md:col-span-7">
            <Reveal delay={0.1}>
              <h2
                className="font-display text-ink"
                style={{
                  fontSize: "clamp(34px, 4.8vw, 64px)",
                  fontWeight: 300,
                  letterSpacing: "-0.02em",
                  lineHeight: 1,
                }}
              >
                {filtered.length} role{filtered.length === 1 ? "" : "s"}
                <br />
                <span className="">currently open.</span>
              </h2>
            </Reveal>
          </div>
          <div className="md:col-span-4 md:col-start-9">
            <p className="text-muted-soft leading-relaxed">
              Don't see your role? Send a brief and a portfolio anyway — we keep
              every introduction on file.
            </p>
          </div>
        </div>

        {/* Department filter */}
        <Reveal>
          <div className="flex flex-wrap gap-2 mb-8">
            {DEPARTMENTS.map((d) => {
              const active = filter === d;
              const count = counts[d] ?? 0;
              return (
                <button
                  key={d}
                  type="button"
                  onClick={() => setFilter(d)}
                  className={[
                    "inline-flex items-center gap-2 px-4 h-10 rounded-full border text-[11px] tracking-[0.16em] uppercase font-medium transition-all",
                    active
                      ? "bg-ink text-paper border-ink shadow-[0_8px_24px_-12px_rgba(78,115,83,0.5)]"
                      : "border-ink/25 text-ink hover:border-gold hover:text-gold",
                  ].join(" ")}
                  aria-pressed={active}
                >
                  <span>{d}</span>
                  <span
                    className={[
                      "tabular-nums text-[10px] px-1.5 py-0.5 rounded-full",
                      active ? "bg-gold/30 text-paper" : "bg-ink/10 text-ink/70",
                    ].join(" ")}
                  >
                    {count}
                  </span>
                </button>
              );
            })}
          </div>
        </Reveal>

        {/* Roles list */}
        <ul className="border-t border-line-dark">
          {filtered.length === 0 && (
            <li className="py-16 text-center text-muted-soft">
              No open roles in this department. Check back soon.
            </li>
          )}
          {filtered.map((r, i) => (
            <RoleRow key={r.title} role={r} index={i} />
          ))}
        </ul>
      </section>

      {/* ───────── 03 · Hiring process ───────── */}
      <section className="mb-24 md:mb-32 pt-12 md:pt-16">

        <Reveal>
          <div className="flex items-center gap-3 mb-12">
            <span className="eyebrow text-muted-soft">The Process</span>
          </div>
        </Reveal>

        <Reveal delay={0.1}>
          <h2
            className="font-display text-ink mb-12 md:mb-16"
            style={{
              fontSize: "clamp(32px, 4.5vw, 56px)",
              fontWeight: 300,
              letterSpacing: "-0.02em",
              lineHeight: 1.05,
            }}
          >
            How we hire,
            <br />
            <span className="">step by step.</span>
          </h2>
        </Reveal>

        <div className="grid md:grid-cols-4 gap-8 md:gap-10">
          {PROCESS.map((p, i) => (
            <Reveal key={p.n} delay={i * 0.08}>
              <div className="relative pt-6">
                <span className="absolute top-0 left-0 w-8 h-px bg-ink/40" />
                <div className="font-display text-gold tabular-nums leading-none mb-3">
                  <span
                    style={{
                      fontSize: "clamp(36px, 4vw, 56px)",
                      fontWeight: 300,
                      letterSpacing: "-0.03em",
                    }}
                  >
                    {p.n}
                  </span>
                </div>
                <h3 className="font-display text-ink text-xl md:text-2xl font-light mb-2.5">
                  {p.title}
                </h3>
                <p className="text-muted-soft text-sm leading-relaxed">{p.body}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ───────── 05 · Spontaneous CTA ───────── */}
      <section>
        <div className="hairline-dark mb-16 md:mb-20" />

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-10% 0px" }}
          transition={{ duration: 0.7, ease: [0.2, 0.8, 0.2, 1] }}
          className="relative overflow-hidden rounded-sm bg-ink text-paper p-10 md:p-16"
          style={{
            boxShadow:
              "0 30px 80px -30px rgba(78,115,83,0.6), 0 0 0 1px rgba(196,169,106,0.18)",
          }}
        >
          <div
            aria-hidden
            className="absolute -top-1/3 -right-1/4 w-[80%] h-[120%] pointer-events-none"
            style={{
              background:
                "radial-gradient(ellipse at center, rgba(196,169,106,0.18) 0%, rgba(196,169,106,0) 70%)",
              filter: "blur(40px)",
            }}
          />
          <div className="relative grid md:grid-cols-12 gap-8 items-end">
            <div className="md:col-span-8">
              <div className="eyebrow text-gold mb-4">Don't see your role?</div>
              <h3
                className="font-display"
                style={{
                  fontSize: "clamp(30px, 4vw, 52px)",
                  fontWeight: 300,
                  letterSpacing: "-0.02em",
                  lineHeight: 1.05,
                }}
              >
                Write to us anyway.
                <br />
                <span className="">
                  We read every introduction.
                </span>
              </h3>
              <p className="mt-5 text-paper/75 leading-relaxed max-w-xl">
                Send a short note about why our work resonates, plus a portfolio
                or a project you're proud of. We respond within ten days.
              </p>
            </div>
            <div className="md:col-span-4 md:text-right">
              <a
                href="mailto:careers@vivanterra.in"
                className="btn btn-light"
              >
                careers@vivanterra.in
                <ArrowUpRight size={16} className="btn-arrow" />
              </a>
            </div>
          </div>
        </motion.div>
      </section>

    </PageShell>
  );
}

/* ── Apply form ──────────────────────────────────────── */

function ApplyForm({ roles }: { roles: string[] }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [position, setPosition] = useState("");
  const [resume, setResume] = useState("");
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    if (name.trim().length < 2 || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
      toast.error("Please add your name and a valid email.");
      return;
    }
    setSubmitting(true);
    try {
      const res = await fetch("/api/career-application", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          email,
          phone,
          position_title: position || "General application",
          resume_url: resume,
          message,
        }),
      });
      const data = await res.json().catch(() => ({ ok: false }));
      if (!res.ok || !data.ok) throw new Error(data.error || "Submission failed");
      toast.success("Application received", {
        description: "Thank you — we read every introduction and respond within ten days.",
      });
      setName(""); setEmail(""); setPhone(""); setPosition(""); setResume(""); setMessage("");
      setDone(true);
    } catch (err) {
      toast.error("Could not send application", {
        description:
          err instanceof Error ? err.message : "Please try again, or email careers@vivanterra.in.",
      });
    } finally {
      setSubmitting(false);
    }
  }

  const inp =
    "w-full bg-[rgba(78,115,83,0.04)] border border-line-dark rounded-md px-4 py-3 text-[15px] text-ink placeholder:text-ink/45 outline-none focus:border-gold focus:bg-paper transition-colors";

  return (
    <form onSubmit={onSubmit} noValidate className="space-y-4 bg-paper border border-line-dark rounded-sm p-7 md:p-9">
      <div className="grid sm:grid-cols-2 gap-4">
        <input className={inp} value={name} onChange={(e) => setName(e.target.value)} placeholder="Your name" autoComplete="name" />
        <input className={inp} value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" type="email" autoComplete="email" />
      </div>
      <div className="grid sm:grid-cols-2 gap-4">
        <input className={inp} value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="Phone (optional)" type="tel" autoComplete="tel" />
        <select className={inp} value={position} onChange={(e) => setPosition(e.target.value)}>
          <option value="">Which role?</option>
          {roles.map((r) => (
            <option key={r} value={r}>{r}</option>
          ))}
          <option value="General application">General / other</option>
        </select>
      </div>
      <input className={inp} value={resume} onChange={(e) => setResume(e.target.value)} placeholder="Portfolio or resume link (URL)" type="url" />
      <textarea className={inp + " resize-none"} rows={4} value={message} onChange={(e) => setMessage(e.target.value)} placeholder="A short note about why our work resonates…" />
      <div className="flex items-center justify-between gap-4 pt-1">
        {done ? (
          <span className="text-sm text-muted-soft italic">Thank you — we will be in touch.</span>
        ) : <span />}
        <button
          type="submit"
          disabled={submitting}
          className="inline-flex items-center justify-center gap-2 h-12 px-6 bg-gold text-ink font-semibold text-[11px] tracking-[0.20em] uppercase rounded-sm hover:bg-ink hover:text-paper transition-colors disabled:opacity-60"
        >
          {submitting ? "Sending…" : "Send application"}
        </button>
      </div>
    </form>
  );
}

/* ── Role row ────────────────────────────────────────── */

function RoleRow({ role, index }: { role: Role; index: number }) {
  return (
    <motion.li
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-10% 0px" }}
      transition={{
        duration: 0.55,
        delay: index * 0.05,
        ease: [0.2, 0.8, 0.2, 1],
      }}
      className="border-b border-line-dark group"
    >
      <a
        href={`mailto:careers@vivanterra.in?subject=Application — ${encodeURIComponent(
          role.title,
        )}`}
        className="grid md:grid-cols-12 gap-4 md:gap-8 py-7 md:py-9 items-baseline hover:bg-ink/[0.03] transition-colors px-2 -mx-2 rounded-sm"
      >
        {/* Title + blurb */}
        <div className="md:col-span-6">
          <h3
            className="font-display text-ink group-hover:text-gold transition-colors"
            style={{
              fontSize: "clamp(22px, 2.4vw, 32px)",
              fontWeight: 400,
              letterSpacing: "-0.01em",
              lineHeight: 1.15,
            }}
          >
            {role.title}
          </h3>
          <p className="mt-3 text-muted-soft text-sm leading-relaxed max-w-xl">
            {role.blurb}
          </p>
        </div>

        {/* Meta */}
        <div className="md:col-span-5 grid grid-cols-3 gap-3 text-[11px] tracking-[0.16em] uppercase text-ink/80">
          <Meta icon={<Building2 size={12} />}>{role.department}</Meta>
          <Meta icon={<MapPin size={12} />}>{role.location}</Meta>
          <Meta icon={<Clock size={12} />}>{role.type}</Meta>
        </div>

        {/* Arrow */}
        <div className="md:col-span-1 md:text-right flex md:justify-end">
          <span className="inline-flex items-center justify-center w-11 h-11 rounded-full border border-line-dark text-ink group-hover:bg-gold group-hover:border-gold group-hover:text-ink transition-colors">
            <ArrowUpRight
              size={16}
              className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
            />
          </span>
        </div>
      </a>
    </motion.li>
  );
}

function Meta({
  icon,
  children,
}: {
  icon: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <span className="flex items-center gap-1.5 truncate">
      <span className="text-gold shrink-0">{icon}</span>
      <span className="truncate">{children}</span>
    </span>
  );
}

