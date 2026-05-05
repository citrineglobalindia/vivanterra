import PageShell from "@/components/ui/PageShell";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useState } from "react";
import { toast } from "sonner";
import {
  ArrowUpRight,
  Loader2,
  Mail,
  MapPin,
  Phone,
  MessageCircle,
  Linkedin,
  Instagram,
  Clock,
} from "lucide-react";

const MAP_EMBED_SRC =
  "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3887.4437936751333!2d77.57702427484206!3d13.007386687311262!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bae17c4e3da2a87%3A0x73dfcc3f1ff75c60!2sVelociti%20Real%20Estate!5e0!3m2!1sen!2sin!4v1777965103416!5m2!1sen!2sin";

const DIRECTIONS_URL =
  "https://www.google.com/maps/dir/?api=1&destination=Velociti+Real+Estate,+Sadashiva+Nagar,+Bengaluru";

const ENQUIRY_TYPES = [
  { value: "residence", label: "Residence" },
  { value: "investor", label: "Investor" },
  { value: "press", label: "Press" },
  { value: "career", label: "Career" },
  { value: "other", label: "Other" },
] as const;

const CONTACT_METHODS = [
  { value: "email", label: "Email" },
  { value: "phone", label: "Phone" },
  { value: "whatsapp", label: "WhatsApp" },
] as const;

const PILLARS = [
  {
    n: "01",
    title: "Residences",
    body: "Curated tours of current and forthcoming addresses, by appointment.",
  },
  {
    n: "02",
    title: "Investors",
    body: "Confidential briefings on partnerships, allocations and yield horizons.",
  },
  {
    n: "03",
    title: "Press & Media",
    body: "Editorial enquiries, imagery, and on-the-record interviews.",
  },
];

const PROCESS = [
  { n: "01", title: "We listen", body: "Your enquiry reaches our concierge — read carefully, never automated." },
  { n: "02", title: "We respond", body: "A reply within one business day, tailored to your interest and timeline." },
  { n: "03", title: "We invite", body: "A private walk-through of the residence, hosted at the studio or on site." },
];

const schema = z.object({
  name: z.string().trim().min(2, "Please share your name"),
  email: z.string().trim().email("A valid email, please"),
  phone: z
    .string()
    .trim()
    .optional()
    .refine((v) => !v || /^[+\d\s\-()]{7,20}$/.test(v), "Check the phone number"),
  enquiry: z.enum(["residence", "investor", "press", "career", "other"]),
  project: z.string().trim().max(120).optional(),
  preferred: z.enum(["email", "phone", "whatsapp"]),
  message: z.string().trim().min(10, "A few more words help us reply better"),
  consent: z.literal(true, {
    errorMap: () => ({ message: "Please accept to continue" }),
  }),
});

type FormValues = z.infer<typeof schema>;

const fieldFx = {
  hidden: { opacity: 0, y: 14 },
  show: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, delay: 0.05 * i, ease: [0.2, 0.8, 0.2, 1] },
  }),
};

function FieldRow({
  num,
  label,
  index,
  error,
  children,
}: {
  num: string;
  label: string;
  index: number;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <motion.div
      custom={index}
      variants={fieldFx}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "-10% 0px" }}
    >
      <div className="flex items-baseline gap-3 mb-3">
        <span className="text-[10px] tracking-[0.22em] font-medium text-gold tabular-nums">
          {num}
        </span>
        <span className="eyebrow text-muted-soft">{label}</span>
      </div>
      {children}
      {error && (
        <p className="mt-2 text-[12px] tracking-wide text-[hsl(var(--destructive))]">
          {error}
        </p>
      )}
    </motion.div>
  );
}

const inputCls =
  "w-full bg-transparent border-0 border-b border-ink/20 focus:border-gold py-3 text-lg text-ink outline-none transition-colors placeholder:text-ink/30";

export default function Contact() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    watch,
    setValue,
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { enquiry: "residence", preferred: "email" },
    mode: "onTouched",
  });

  const enquiry = watch("enquiry");
  const preferred = watch("preferred");
  const [submittedOnce, setSubmittedOnce] = useState(false);

  const onSubmit = async (values: FormValues) => {
    await new Promise((r) => setTimeout(r, 1100));
    console.log("contact enquiry", values);
    toast.success("Enquiry received", {
      description: "We typically respond within one business day.",
    });
    reset({ enquiry: "residence", preferred: "email" } as FormValues);
    setSubmittedOnce(true);
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
      {/* ───────── Service pillars ───────── */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-10% 0px" }}
        transition={{ duration: 0.7, ease: [0.2, 0.8, 0.2, 1] }}
        className="grid md:grid-cols-3 gap-10 md:gap-16 mb-20 md:mb-28 pt-2"
      >
        {PILLARS.map((p) => (
          <div key={p.n} className="relative pt-6">
            <span className="absolute top-0 left-0 w-12 h-px bg-gold" />
            <div className="flex items-baseline gap-4 mb-4">
              <span className="text-[11px] tracking-[0.22em] text-gold tabular-nums">
                {p.n}
              </span>
              <span className="eyebrow text-muted-soft">/ Service</span>
            </div>
            <h3 className="font-display text-ink text-2xl md:text-3xl font-light mb-3">
              {p.title}
            </h3>
            <p className="text-muted-soft leading-relaxed text-sm md:text-base max-w-xs">
              {p.body}
            </p>
          </div>
        ))}
      </motion.div>

      <div className="hairline-dark mb-20 md:mb-28" />

      {/* ───────── Main grid ───────── */}
      <div className="grid md:grid-cols-12 gap-12 md:gap-20">
        {/* Form */}
        <div className="md:col-span-7 relative">
          <div className="mb-12">
            <div className="flex items-baseline gap-4 mb-4">
              <span className="text-[11px] tracking-[0.22em] text-gold tabular-nums">
                01
              </span>
              <span className="eyebrow text-muted-soft">/ Enquiry</span>
            </div>
            <h2
              className="font-display text-ink"
              style={{
                fontSize: "clamp(28px, 3.5vw, 48px)",
                fontWeight: 300,
                letterSpacing: "-0.02em",
                lineHeight: 1.05,
              }}
            >
              Compose your <span className="italic text-gold">enquiry.</span>
            </h2>
          </div>

          <div>
            <form
              onSubmit={handleSubmit(onSubmit)}
              noValidate
              className="space-y-10"
            >
              <FieldRow num="01" label="Name" index={0} error={errors.name?.message}>
                <input
                  type="text"
                  autoComplete="name"
                  placeholder="Your full name"
                  className={inputCls}
                  {...register("name")}
                />
              </FieldRow>

              <div className="grid sm:grid-cols-2 gap-9">
                <FieldRow num="02" label="Email" index={1} error={errors.email?.message}>
                  <input
                    type="email"
                    autoComplete="email"
                    placeholder="you@example.com"
                    className={inputCls}
                    {...register("email")}
                  />
                </FieldRow>
                <FieldRow num="03" label="Phone" index={2} error={errors.phone?.message}>
                  <input
                    type="tel"
                    autoComplete="tel"
                    placeholder="+91 ·····"
                    className={inputCls}
                    {...register("phone")}
                  />
                </FieldRow>
              </div>

              <FieldRow num="04" label="Subject" index={3} error={errors.enquiry?.message}>
                <div className="flex flex-wrap gap-2 pt-2">
                  {ENQUIRY_TYPES.map((t) => {
                    const active = enquiry === t.value;
                    return (
                      <button
                        key={t.value}
                        type="button"
                        onClick={() =>
                          setValue("enquiry", t.value, { shouldValidate: true })
                        }
                        className={[
                          "px-4 h-10 rounded-full border text-[12px] tracking-[0.08em] uppercase transition-all",
                          active
                            ? "bg-ink text-paper border-ink shadow-[0_0_0_3px_rgba(196,169,106,0.18)]"
                            : "border-ink/25 text-ink hover:border-gold hover:text-gold",
                        ].join(" ")}
                        aria-pressed={active}
                      >
                        {t.label}
                      </button>
                    );
                  })}
                </div>
              </FieldRow>

              <FieldRow
                num="05"
                label="Project of interest"
                index={4}
                error={errors.project?.message}
              >
                <input
                  type="text"
                  placeholder="e.g. Vivanterra Sadashiva Nagar"
                  className={inputCls}
                  {...register("project")}
                />
              </FieldRow>

              <FieldRow
                num="06"
                label="How should we reach you"
                index={5}
                error={errors.preferred?.message}
              >
                <div className="flex flex-wrap gap-6 pt-2">
                  {CONTACT_METHODS.map((m) => {
                    const active = preferred === m.value;
                    return (
                      <label
                        key={m.value}
                        className="flex items-center gap-3 cursor-pointer text-ink"
                      >
                        <span
                          className={[
                            "w-4 h-4 rounded-full border transition-colors flex items-center justify-center",
                            active ? "border-gold" : "border-ink/30",
                          ].join(" ")}
                        >
                          {active && <span className="w-2 h-2 rounded-full bg-gold" />}
                        </span>
                        <input
                          type="radio"
                          value={m.value}
                          className="sr-only"
                          {...register("preferred")}
                        />
                        <span className="text-base">{m.label}</span>
                      </label>
                    );
                  })}
                </div>
              </FieldRow>

              <FieldRow num="07" label="Message" index={6} error={errors.message?.message}>
                <textarea
                  rows={4}
                  placeholder="Tell us a little about what you're looking for…"
                  className={`${inputCls} resize-none`}
                  {...register("message")}
                />
              </FieldRow>

              <motion.div
                custom={7}
                variants={fieldFx}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true, margin: "-10% 0px" }}
                className="pt-2"
              >
                <label className="flex items-start gap-3 cursor-pointer text-muted-soft text-sm leading-relaxed">
                  <input
                    type="checkbox"
                    className="mt-[3px] w-4 h-4 accent-[var(--gold)]"
                    {...register("consent")}
                  />
                  <span>
                    I agree to be contacted about this enquiry. We respect your privacy
                    and will never share your details.
                  </span>
                </label>
                {errors.consent && (
                  <p className="mt-2 text-[12px] tracking-wide text-[hsl(var(--destructive))]">
                    {errors.consent.message as string}
                  </p>
                )}
              </motion.div>

              <motion.div
                custom={8}
                variants={fieldFx}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true, margin: "-10% 0px" }}
                className="flex flex-wrap items-center gap-6 pt-2"
              >
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="btn btn-dark disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="animate-spin" size={16} />
                      Sending
                    </>
                  ) : (
                    <>
                      Send enquiry
                      <ArrowUpRight className="btn-arrow" size={16} />
                    </>
                  )}
                </button>
                {submittedOnce && !isSubmitting && (
                  <span className="text-sm text-muted-soft italic">
                    Thank you — we'll be in touch shortly.
                  </span>
                )}
              </motion.div>
            </form>
          </div>
        </div>

        {/* Aside */}
        <aside className="md:col-span-4 md:col-start-9 space-y-12">
          <div>
            <div className="flex items-baseline gap-4 mb-4">
              <span className="text-[11px] tracking-[0.22em] text-gold tabular-nums">
                02
              </span>
              <span className="eyebrow text-muted-soft flex items-center gap-2">
                / Studio <MapPin size={11} />
              </span>
            </div>
            <p className="text-ink leading-relaxed">
              4th Floor, Cassini Towers,
              <br />
              Upper Palace Orchids,
              <br />
              13th Cross Rd, Sadashiva Nagar,
              <br />
              Bengaluru 560080
            </p>
            <a
              href={DIRECTIONS_URL}
              target="_blank"
              rel="noreferrer"
              className="nav-link inline-flex items-center gap-1 mt-5 text-sm text-ink hover:text-gold transition-colors"
            >
              Get directions
              <ArrowUpRight size={14} />
            </a>
          </div>

          <div className="hairline-dark" />

          <div className="space-y-4">
            <div className="flex items-baseline gap-4 mb-2">
              <span className="text-[11px] tracking-[0.22em] text-gold tabular-nums">
                03
              </span>
              <span className="eyebrow text-muted-soft">/ Direct</span>
            </div>
            <a
              href="tel:+919986666774"
              className="group flex items-center justify-between gap-3 text-ink hover:text-gold transition-colors py-2 border-b border-line-dark"
            >
              <span className="flex items-center gap-3">
                <Phone size={15} className="opacity-60" />
                <span>+91 99866 66774</span>
              </span>
              <ArrowUpRight
                size={14}
                className="opacity-0 group-hover:opacity-100 transition-opacity"
              />
            </a>
            <a
              href="mailto:hello@velociti.com"
              className="group flex items-center justify-between gap-3 text-ink hover:text-gold transition-colors py-2 border-b border-line-dark"
            >
              <span className="flex items-center gap-3">
                <Mail size={15} className="opacity-60" />
                <span>hello@velociti.com</span>
              </span>
              <ArrowUpRight
                size={14}
                className="opacity-0 group-hover:opacity-100 transition-opacity"
              />
            </a>
            <a
              href="https://wa.me/919986666774"
              target="_blank"
              rel="noreferrer"
              className="group flex items-center justify-between gap-3 text-ink hover:text-gold transition-colors py-2 border-b border-line-dark"
            >
              <span className="flex items-center gap-3">
                <MessageCircle size={15} className="opacity-60" />
                <span>WhatsApp</span>
              </span>
              <ArrowUpRight
                size={14}
                className="opacity-0 group-hover:opacity-100 transition-opacity"
              />
            </a>
          </div>

          <div className="hairline-dark" />

          <div>
            <div className="flex items-baseline gap-4 mb-4">
              <span className="text-[11px] tracking-[0.22em] text-gold tabular-nums">
                04
              </span>
              <span className="eyebrow text-muted-soft flex items-center gap-2">
                / Hours <Clock size={11} />
              </span>
            </div>
            <p className="text-ink text-sm leading-relaxed">
              Monday – Saturday
              <br />
              <span className="text-muted-soft">10:00 — 19:00 IST</span>
            </p>
          </div>

          <div className="flex items-center gap-3 pt-2">
            <a
              href="https://www.linkedin.com/"
              target="_blank"
              rel="noreferrer"
              aria-label="LinkedIn"
              className="w-10 h-10 rounded-full border border-ink/25 flex items-center justify-center text-ink hover:bg-ink hover:text-paper hover:border-ink transition-colors"
            >
              <Linkedin size={15} />
            </a>
            <a
              href="https://www.instagram.com/"
              target="_blank"
              rel="noreferrer"
              aria-label="Instagram"
              className="w-10 h-10 rounded-full border border-ink/25 flex items-center justify-center text-ink hover:bg-ink hover:text-paper hover:border-ink transition-colors"
            >
              <Instagram size={15} />
            </a>
          </div>
        </aside>
      </div>

      {/* ───────── Editorial pull quote ───────── */}
      <motion.figure
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-10% 0px" }}
        transition={{ duration: 0.9, ease: [0.2, 0.8, 0.2, 1] }}
        className="my-24 md:my-36 max-w-4xl mx-auto text-center"
      >
        <div className="w-12 h-px bg-gold mx-auto mb-8" />
        <blockquote
          className="font-display text-ink italic font-light"
          style={{
            fontSize: "clamp(28px, 3.5vw, 48px)",
            lineHeight: 1.25,
            letterSpacing: "-0.01em",
          }}
        >
          "A residence is a long correspondence with light, with material, with
          time. We'd like to begin yours."
        </blockquote>
        <figcaption className="eyebrow text-muted-soft mt-8">
          — The studio
        </figcaption>
      </motion.figure>

      {/* ───────── Map ───────── */}
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-10% 0px" }}
        transition={{ duration: 0.8, ease: [0.2, 0.8, 0.2, 1] }}
        className="relative"
      >
        {/* Gold ambient glow */}
        <div
          aria-hidden
          className="absolute -inset-x-20 -top-20 h-[60%] pointer-events-none -z-10"
          style={{
            background:
              "radial-gradient(ellipse at center, rgba(196,169,106,0.10) 0%, rgba(196,169,106,0.04) 35%, rgba(0,0,0,0) 70%)",
            filter: "blur(40px)",
          }}
        />

        <div className="grid md:grid-cols-12 gap-8 mb-12 items-end">
          <div className="md:col-span-7">
            <div className="flex items-baseline gap-4 mb-5">
              <span className="text-[11px] tracking-[0.22em] text-gold tabular-nums">
                05
              </span>
              <span className="eyebrow text-muted-soft">/ Visit the studio</span>
            </div>
            <h2
              className="font-display text-ink"
              style={{
                fontSize: "clamp(36px, 5.5vw, 80px)",
                fontWeight: 300,
                letterSpacing: "-0.02em",
                lineHeight: 0.98,
              }}
            >
              Sadashiva Nagar,
              <br />
              <span className="italic text-gold">Bengaluru.</span>
            </h2>
          </div>
          <div className="md:col-span-4 md:col-start-9">
            <p className="text-muted-soft leading-relaxed">
              Visits are by appointment. Reach out and we'll arrange a time that
              suits you, with a private walk-through of current and upcoming
              residences.
            </p>
          </div>
        </div>

        <div className="relative overflow-hidden border border-line-dark group">
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

          {/* Sage overlay on hover for editorial feel */}
          <div
            aria-hidden
            className="absolute inset-0 pointer-events-none mix-blend-multiply opacity-0 group-hover:opacity-100 transition-opacity duration-700"
            style={{
              background:
                "linear-gradient(180deg, rgba(78,115,83,0.10) 0%, rgba(78,115,83,0) 50%)",
            }}
          />

          {/* Floating address card */}
          <div className="hidden md:block absolute left-8 bottom-8 max-w-sm">
            <div className="relative bg-paper/95 backdrop-blur-sm border border-line-dark p-7">
              <span className="absolute top-0 left-0 w-12 h-px bg-gold" />
              <div className="flex items-baseline gap-3 mb-3">
                <span className="text-[10px] tracking-[0.22em] text-gold tabular-nums">
                  STUDIO
                </span>
              </div>
              <p className="font-display text-ink text-xl font-light mb-4">
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

      {/* ───────── What happens next ───────── */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-10% 0px" }}
        transition={{ duration: 0.8, ease: [0.2, 0.8, 0.2, 1] }}
        className="mt-24 md:mt-32"
      >
        <div className="hairline-dark mb-16" />
        <div className="flex items-baseline gap-4 mb-12">
          <span className="text-[11px] tracking-[0.22em] text-gold tabular-nums">
            06
          </span>
          <span className="eyebrow text-muted-soft">/ What happens next</span>
        </div>
        <div className="grid md:grid-cols-3 gap-10 md:gap-16">
          {PROCESS.map((p) => (
            <div key={p.n} className="relative pt-6">
              <span className="absolute top-0 left-0 w-8 h-px bg-ink/40" />
              <div className="font-display text-gold text-5xl md:text-6xl font-light mb-3 tabular-nums">
                {p.n}
              </div>
              <h3 className="font-display text-ink text-xl md:text-2xl font-light mb-3">
                {p.title}
              </h3>
              <p className="text-muted-soft leading-relaxed text-sm">{p.body}</p>
            </div>
          ))}
        </div>
      </motion.div>
    </PageShell>
  );
}
