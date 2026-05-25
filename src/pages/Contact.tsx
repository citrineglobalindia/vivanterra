import PageShell from "@/components/ui/PageShell";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useRef, useState } from "react";
import { toast } from "sonner";
import { submitContactEnquiry, type ContactEnquiry } from "@/lib/contact";
import { useSearchParams } from "react-router-dom";
import { getProjectBySlug } from "@/data/projects";
import {
  ArrowUpRight,
  Clock,
  Facebook,
  Instagram,
  Linkedin,
  Loader2,
  Mail,
  MapPin,
  Phone,
  Send,
} from "lucide-react";

const MAP_EMBED_SRC =
  "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3887.4437936751333!2d77.57702427484206!3d13.007386687311262!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bae17c4e3da2a87%3A0x73dfcc3f1ff75c60!2sVelociti%20Real%20Estate!5e0!3m2!1sen!2sin!4v1777965103416!5m2!1sen!2sin";

const DIRECTIONS_URL =
  "https://www.google.com/maps/dir/?api=1&destination=Velociti+Real+Estate,+Sadashiva+Nagar,+Bengaluru";

const SCOPE_OPTIONS = [
  { value: "residence", label: "Residence" },
  { value: "investor", label: "Investor" },
  { value: "press", label: "Press" },
  { value: "career", label: "Career" },
  { value: "visit", label: "Studio Visit" },
] as const;

const BUDGET_OPTIONS = [
  { value: "under-2", label: "Under ₹2 Cr" },
  { value: "2-5", label: "₹2 — 5 Cr" },
  { value: "5-10", label: "₹5 — 10 Cr" },
  { value: "10-plus", label: "₹10 Cr +" },
] as const;

const schema = z.object({
  name: z.string().trim().min(2, "Please share your name"),
  email: z.string().trim().email("A valid email, please"),
  phone: z
    .string()
    .trim()
    .optional()
    .refine(
      (v) => !v || /^[+\d\s\-()]{7,20}$/.test(v),
      "Check the phone number",
    ),
  scope: z.enum(["residence", "investor", "press", "career", "visit"]),
  budget: z.enum(["under-2", "2-5", "5-10", "10-plus"]).optional(),
  message: z
    .string()
    .trim()
    .min(10, "A few more words help us reply better"),
});

type FormValues = z.infer<typeof schema>;

export default function Contact() {
  const [searchParams] = useSearchParams();
  const projectSlug = searchParams.get("project") || undefined;
  const project = projectSlug ? getProjectBySlug(projectSlug) : undefined;

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    watch,
    setValue,
    setFocus,
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      scope: "residence",
      message: project
        ? `I'd like to learn more about ${project.title}.`
        : undefined,
    },
    mode: "onTouched",
  });

  const scope = watch("scope");
  const budget = watch("budget");
  const [submittedOnce, setSubmittedOnce] = useState(false);
  const honeypotRef = useRef<HTMLInputElement>(null);

  const onSubmit = async (values: FormValues) => {
    const payload: ContactEnquiry = { ...(values as ContactEnquiry), projectSlug };
    const result = await submitContactEnquiry(payload, {
      honeypot: honeypotRef.current?.value,
    });

    if ("reason" in result) {
      const description =
        result.reason === "timeout"
          ? "The request took too long. Please try again in a moment."
          : result.reason === "server"
            ? `We couldn't deliver your enquiry (${result.status ?? "error"}). Please try again or email hello@velociti.com directly.`
            : "We couldn't reach our servers. Please check your connection and try again.";
      toast.error("Enquiry not sent", { description });
      return;
    }

    toast.success("Enquiry received", {
      description: result.mock
        ? "We've logged your message — a concierge will reach out shortly."
        : "We typically respond within one business day.",
    });
    reset({ scope: "residence" } as FormValues);
    if (honeypotRef.current) honeypotRef.current.value = "";
    setSubmittedOnce(true);
  };

  const onInvalid = (errs: typeof errors) => {
    const order: (keyof FormValues)[] = [
      "name",
      "email",
      "phone",
      "scope",
      "budget",
      "message",
    ];
    const first = order.find((k) => errs[k]);
    if (first) setFocus(first);
  };

  return (
    <PageShell
      eyebrow="Contact"
      title={
        <>
          Begin a <span className="italic text-gold">conversation.</span>
        </>
      }
      intro="Tell us about the residence you're imagining. Every enquiry is read by our concierge and answered within one business day."
    >
      <div className="grid lg:grid-cols-12 gap-10 lg:gap-16">
        {/* ───────── Form ───────── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-10% 0px" }}
          transition={{ duration: 0.7, ease: [0.2, 0.8, 0.2, 1] }}
          className="lg:col-span-7"
        >
          <div className="eyebrow text-gold mb-5">The Enquiry</div>
          <h2
            className="font-display text-ink uppercase"
            style={{
              fontSize: "clamp(36px, 5vw, 68px)",
              fontWeight: 700,
              letterSpacing: "-0.02em",
              lineHeight: 0.98,
            }}
          >
            Start with a few lines.
          </h2>

          <form
            onSubmit={handleSubmit(onSubmit, onInvalid)}
            noValidate
            className="mt-10 space-y-7"
          >
            {/* Honeypot — hidden from real users, irresistible to bots. */}
            <div
              aria-hidden="true"
              className="absolute -left-[9999px] top-auto h-0 w-0 overflow-hidden"
            >
              <label htmlFor="company-website">
                Company website (leave blank)
              </label>
              <input
                ref={honeypotRef}
                id="company-website"
                name="company_website"
                type="text"
                tabIndex={-1}
                autoComplete="off"
              />
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <Field error={errors.name?.message}>
                <input
                  type="text"
                  autoComplete="name"
                  placeholder="Your name"
                  className={inputCls}
                  {...register("name")}
                />
              </Field>
              <Field error={errors.email?.message}>
                <input
                  type="email"
                  autoComplete="email"
                  placeholder="Email"
                  className={inputCls}
                  {...register("email")}
                />
              </Field>
            </div>

            <Field error={errors.phone?.message}>
              <input
                type="tel"
                autoComplete="tel"
                placeholder="Phone (optional)"
                className={inputCls}
                {...register("phone")}
              />
            </Field>

            {/* Scope chips */}
            <div>
              <div className="eyebrow text-muted-soft mb-3">Scope</div>
              <div className="flex flex-wrap gap-2">
                {SCOPE_OPTIONS.map((s) => {
                  const active = scope === s.value;
                  return (
                    <button
                      key={s.value}
                      type="button"
                      onClick={() =>
                        setValue("scope", s.value, { shouldValidate: true })
                      }
                      className={[
                        "px-4 h-10 rounded-full border text-[11px] tracking-[0.16em] uppercase font-medium transition-all",
                        active
                          ? "bg-ink text-paper border-ink shadow-[0_8px_24px_-12px_rgba(78,115,83,0.5)]"
                          : "border-ink/25 text-ink hover:border-gold hover:text-gold",
                      ].join(" ")}
                      aria-pressed={active}
                    >
                      {s.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Budget chips */}
            <div>
              <div className="eyebrow text-muted-soft mb-3">Indicative Budget</div>
              <div className="flex flex-wrap gap-2">
                {BUDGET_OPTIONS.map((b) => {
                  const active = budget === b.value;
                  return (
                    <button
                      key={b.value}
                      type="button"
                      onClick={() =>
                        setValue(
                          "budget",
                          active ? undefined : b.value,
                          { shouldValidate: false },
                        )
                      }
                      className={[
                        "px-4 h-10 rounded-full border text-[11px] tracking-[0.16em] uppercase font-medium transition-all",
                        active
                          ? "bg-ink text-paper border-ink shadow-[0_8px_24px_-12px_rgba(78,115,83,0.5)]"
                          : "border-ink/25 text-ink hover:border-gold hover:text-gold",
                      ].join(" ")}
                      aria-pressed={active}
                    >
                      {b.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Message */}
            <Field error={errors.message?.message}>
              <textarea
                rows={5}
                placeholder="Tell us about the space, the brief, the timeline…"
                className={`${inputCls} resize-none`}
                {...register("message")}
              />
            </Field>

            {/* Submit */}
            <div className="flex flex-wrap items-center gap-5 pt-2">
              <button
                type="submit"
                disabled={isSubmitting}
                className="group relative inline-flex items-center justify-center gap-2.5 h-14 px-8 bg-gold text-ink font-semibold text-[12px] tracking-[0.20em] uppercase rounded-sm overflow-hidden transition-transform duration-300 hover:-translate-y-0.5 disabled:opacity-60 disabled:cursor-not-allowed"
                style={{
                  boxShadow:
                    "0 18px 40px -16px rgba(196,169,106,0.55), 0 0 0 1px rgba(196,169,106,0.4)",
                }}
              >
                <span
                  aria-hidden
                  className="absolute inset-0 bg-ink scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-500 ease-out"
                />
                <span className="relative z-10 inline-flex items-center gap-2.5 group-hover:text-paper transition-colors duration-500">
                  {isSubmitting ? (
                    <>
                      <Loader2 size={16} className="animate-spin" />
                      Sending
                    </>
                  ) : (
                    <>
                      Send Enquiry
                      <Send
                        size={14}
                        className="transition-transform duration-500 group-hover:translate-x-1 group-hover:-translate-y-0.5"
                      />
                    </>
                  )}
                </span>
              </button>
              {submittedOnce && !isSubmitting && (
                <span className="text-sm text-muted-soft italic">
                  Thank you — we'll be in touch shortly.
                </span>
              )}
            </div>
          </form>
        </motion.div>

        {/* ───────── Sidebar ───────── */}
        <aside className="lg:col-span-5 space-y-6">
          {/* Studio card (dark) */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-10% 0px" }}
            transition={{ duration: 0.7, delay: 0.1, ease: [0.2, 0.8, 0.2, 1] }}
            className="relative overflow-hidden bg-ink text-paper rounded-sm p-8 md:p-10"
            style={{
              boxShadow:
                "0 30px 80px -30px rgba(78,115,83,0.6), 0 0 0 1px rgba(196,169,106,0.18)",
            }}
          >
            {/* Soft gold ambient */}
            <div
              aria-hidden
              className="absolute -top-1/4 -right-1/4 w-[80%] h-[80%] pointer-events-none"
              style={{
                background:
                  "radial-gradient(ellipse at center, rgba(196,169,106,0.18) 0%, rgba(196,169,106,0) 70%)",
                filter: "blur(40px)",
              }}
            />
            {/* Film grain */}
            <div
              aria-hidden
              className="absolute inset-0 opacity-[0.06] mix-blend-overlay pointer-events-none"
              style={{
                backgroundImage:
                  "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='200' height='200'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/></filter><rect width='100%' height='100%' filter='url(%23n)' opacity='0.7'/></svg>\")",
              }}
            />

            <div className="relative">
              <div className="eyebrow text-gold mb-4">Visit the studio</div>
              <h3
                className="font-display uppercase"
                style={{
                  fontSize: "clamp(26px, 3.2vw, 38px)",
                  fontWeight: 700,
                  letterSpacing: "-0.02em",
                  lineHeight: 1,
                }}
              >
                Sadashiva Nagar · Bengaluru
              </h3>

              <div className="mt-8 space-y-5">
                <SidebarRow icon={<MapPin size={16} />}>
                  4th Floor, Cassini Towers,
                  <br />
                  13th Cross Rd, Sadashiva Nagar,
                  <br />
                  Bengaluru 560080
                </SidebarRow>
                <SidebarRow icon={<Clock size={16} />}>
                  Mon — Sat · 10am — 7pm IST
                  <br />
                  <span className="text-paper/60">Sunday by appointment</span>
                </SidebarRow>
                <SidebarRow icon={<Phone size={16} />}>
                  <a
                    href="tel:+919986666774"
                    className="hover:text-gold transition-colors"
                  >
                    +91 99866 66774
                  </a>
                </SidebarRow>
                <SidebarRow icon={<Mail size={16} />}>
                  <a
                    href="mailto:hello@velociti.com"
                    className="hover:text-gold transition-colors"
                  >
                    hello@velociti.com
                  </a>
                </SidebarRow>
              </div>

              {/* Social row */}
              <div className="mt-9 flex items-center gap-3">
                <SocialDot href="https://www.instagram.com/" label="Instagram">
                  <Instagram size={14} />
                </SocialDot>
                <SocialDot href="https://www.facebook.com/" label="Facebook">
                  <Facebook size={14} />
                </SocialDot>
                <SocialDot href="https://www.linkedin.com/" label="LinkedIn">
                  <Linkedin size={14} />
                </SocialDot>
                <SocialDot href={DIRECTIONS_URL} label="Directions" external>
                  <MapPin size={14} />
                </SocialDot>
              </div>
            </div>
          </motion.div>

          {/* Response promise card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-10% 0px" }}
            transition={{ duration: 0.7, delay: 0.2, ease: [0.2, 0.8, 0.2, 1] }}
            className="bg-paper border border-line-dark rounded-sm p-8"
          >
            <div className="eyebrow text-gold mb-4">Response Promise</div>
            <p className="text-ink leading-relaxed">
              Every enquiry is read by our concierge. You'll hear from us
              within one business day with the next steps.
            </p>
            <div className="mt-6 flex items-center gap-3 font-display uppercase font-bold text-ink text-lg tracking-[-0.01em]">
              <span>No bots.</span>
              <span className="text-gold">→</span>
              <span>Real people.</span>
            </div>
          </motion.div>
        </aside>
      </div>

      {/* ───────── Map ───────── */}
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-10% 0px" }}
        transition={{ duration: 0.8, ease: [0.2, 0.8, 0.2, 1] }}
        className="mt-24 md:mt-32"
      >
        <div className="grid md:grid-cols-12 gap-8 mb-10 items-end">
          <div className="md:col-span-7">
            <div className="eyebrow text-gold mb-4">On the map</div>
            <h2
              className="font-display text-ink uppercase"
              style={{
                fontSize: "clamp(32px, 4.5vw, 56px)",
                fontWeight: 700,
                letterSpacing: "-0.02em",
                lineHeight: 1,
              }}
            >
              Find us in
              <br />
              <span className="italic text-gold normal-case font-light">
                Sadashiva Nagar.
              </span>
            </h2>
          </div>
          <div className="md:col-span-4 md:col-start-9">
            <p className="text-muted-soft leading-relaxed">
              Visits are by appointment. Reach out and we'll arrange a private
              walk-through at the studio.
            </p>
          </div>
        </div>

        <div className="relative overflow-hidden rounded-sm border border-line-dark">
          <div className="aspect-[16/10] md:aspect-[21/9] w-full bg-paper">
            <iframe
              title="Vivanterra Real Estate — Sadashiva Nagar studio"
              src={MAP_EMBED_SRC}
              className="w-full h-full"
              style={{ border: 0, filter: "grayscale(0.35) contrast(0.92)" }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>

          {/* Floating address card */}
          <div className="hidden md:block absolute left-8 bottom-8 max-w-sm">
            <div className="relative bg-paper/95 backdrop-blur-sm border border-line-dark p-7 rounded-sm">
              <span className="absolute top-0 left-0 w-12 h-px bg-gold" />
              <div className="text-[10px] tracking-[0.22em] text-gold tabular-nums mb-3">
                STUDIO
              </div>
              <p className="font-display text-ink text-xl font-bold uppercase mb-3 leading-tight tracking-tight">
                Vivanterra Real Estate
              </p>
              <p className="text-ink text-sm leading-relaxed">
                Cassini Towers, Sadashiva Nagar
                <br />
                Bengaluru 560080
              </p>
              <a
                href={DIRECTIONS_URL}
                target="_blank"
                rel="noreferrer"
                className="nav-link inline-flex items-center gap-1 mt-5 text-sm text-ink hover:text-gold transition-colors"
              >
                Open in Google Maps
                <ArrowUpRight size={14} />
              </a>
            </div>
          </div>
        </div>
      </motion.div>
    </PageShell>
  );
}

/* ───────── Bits ───────── */

const inputCls =
  "w-full bg-[rgba(78,115,83,0.04)] border border-line-dark rounded-md px-4 py-3.5 text-[15px] text-ink placeholder:text-ink/45 outline-none focus:border-gold focus:bg-paper transition-colors";

function Field({
  error,
  children,
}: {
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      {children}
      {error && (
        <p className="mt-1.5 text-[12px] tracking-wide text-[hsl(var(--destructive))] pl-1">
          {error}
        </p>
      )}
    </div>
  );
}

function SidebarRow({
  icon,
  children,
}: {
  icon: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-start gap-4 text-paper/85 text-[14px] leading-relaxed">
      <span className="mt-0.5 w-9 h-9 shrink-0 rounded-full border border-gold/40 text-gold flex items-center justify-center">
        {icon}
      </span>
      <div>{children}</div>
    </div>
  );
}

function SocialDot({
  href,
  label,
  external,
  children,
}: {
  href: string;
  label: string;
  external?: boolean;
  children: React.ReactNode;
}) {
  const cls =
    "w-9 h-9 rounded-full border border-paper/25 flex items-center justify-center text-paper hover:bg-gold hover:text-ink hover:border-gold transition-colors";
  const props = external
    ? { target: "_blank", rel: "noreferrer" as const }
    : {};
  return (
    <a href={href} aria-label={label} className={cls} {...props}>
      {children}
    </a>
  );
}
