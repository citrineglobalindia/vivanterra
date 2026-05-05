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
  hidden: { opacity: 0, y: 12 },
  show: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, delay: 0.04 * i, ease: [0.2, 0.8, 0.2, 1] },
  }),
};

function FieldRow({
  label,
  index,
  error,
  children,
}: {
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
      <label className="eyebrow text-muted-soft block mb-3">{label}</label>
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
  "w-full bg-transparent border-0 border-b border-ink/20 focus:border-ink py-3 text-lg text-ink outline-none transition-colors placeholder:text-ink/30";

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
      intro="Tell us about the residence you're imagining. We typically respond within one business day."
    >
      <div className="grid md:grid-cols-12 gap-12 md:gap-20">
        {/* ───────── Form ───────── */}
        <form
          onSubmit={handleSubmit(onSubmit)}
          noValidate
          className="md:col-span-7 space-y-9"
        >
          <FieldRow label="Name" index={0} error={errors.name?.message}>
            <input
              type="text"
              autoComplete="name"
              placeholder="Your full name"
              className={inputCls}
              {...register("name")}
            />
          </FieldRow>

          <div className="grid sm:grid-cols-2 gap-9">
            <FieldRow label="Email" index={1} error={errors.email?.message}>
              <input
                type="email"
                autoComplete="email"
                placeholder="you@example.com"
                className={inputCls}
                {...register("email")}
              />
            </FieldRow>
            <FieldRow label="Phone" index={2} error={errors.phone?.message}>
              <input
                type="tel"
                autoComplete="tel"
                placeholder="+91 ·····"
                className={inputCls}
                {...register("phone")}
              />
            </FieldRow>
          </div>

          {/* Enquiry type — segmented */}
          <FieldRow label="What's this about" index={3} error={errors.enquiry?.message}>
            <div className="flex flex-wrap gap-2 pt-2">
              {ENQUIRY_TYPES.map((t) => {
                const active = enquiry === t.value;
                return (
                  <button
                    key={t.value}
                    type="button"
                    onClick={() => setValue("enquiry", t.value, { shouldValidate: true })}
                    className={[
                      "px-4 h-10 rounded-full border text-[12px] tracking-[0.08em] uppercase transition-colors",
                      active
                        ? "bg-ink text-paper border-ink"
                        : "border-ink/25 text-ink hover:border-ink",
                    ].join(" ")}
                    aria-pressed={active}
                  >
                    {t.label}
                  </button>
                );
              })}
            </div>
          </FieldRow>

          <FieldRow label="Project of interest" index={4} error={errors.project?.message}>
            <input
              type="text"
              placeholder="e.g. Vivanterra Sadashiva Nagar"
              className={inputCls}
              {...register("project")}
            />
          </FieldRow>

          {/* Preferred contact method */}
          <FieldRow
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
                        active ? "border-ink" : "border-ink/30",
                      ].join(" ")}
                    >
                      {active && <span className="w-2 h-2 rounded-full bg-ink" />}
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

          <FieldRow label="Message" index={6} error={errors.message?.message}>
            <textarea
              rows={4}
              placeholder="Tell us a little about what you're looking for…"
              className={`${inputCls} resize-none`}
              {...register("message")}
            />
          </FieldRow>

          {/* Consent */}
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
                className="mt-[3px] w-4 h-4 accent-[var(--ink)]"
                {...register("consent")}
              />
              <span>
                I agree to be contacted about this enquiry. We respect your privacy and
                will never share your details.
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
            className="flex items-center gap-6 pt-2"
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
              <span className="text-sm text-muted-soft">
                Thank you — we'll be in touch shortly.
              </span>
            )}
          </motion.div>
        </form>

        {/* ───────── Aside ───────── */}
        <aside className="md:col-span-4 md:col-start-9 space-y-12">
          <div>
            <div className="eyebrow text-muted-soft mb-4 flex items-center gap-2">
              <MapPin size={12} /> Studio
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
              className="nav-link inline-flex items-center gap-1 mt-4 text-sm text-ink"
            >
              Get directions
              <ArrowUpRight size={14} />
            </a>
          </div>

          <div className="hairline-dark" />

          <div className="space-y-4">
            <div className="eyebrow text-muted-soft mb-1">Direct</div>
            <a
              href="tel:+919986666774"
              className="group flex items-center gap-3 text-ink hover:text-gold transition-colors"
            >
              <Phone size={16} className="opacity-70" />
              <span>+91 99866 66774</span>
            </a>
            <a
              href="mailto:hello@velociti.com"
              className="group flex items-center gap-3 text-ink hover:text-gold transition-colors"
            >
              <Mail size={16} className="opacity-70" />
              <span>hello@velociti.com</span>
            </a>
            <a
              href="https://wa.me/919986666774"
              target="_blank"
              rel="noreferrer"
              className="group flex items-center gap-3 text-ink hover:text-gold transition-colors"
            >
              <MessageCircle size={16} className="opacity-70" />
              <span>WhatsApp</span>
            </a>
          </div>

          <div className="hairline-dark" />

          <div>
            <div className="eyebrow text-muted-soft mb-3 flex items-center gap-2">
              <Clock size={12} /> Hours
            </div>
            <p className="text-ink text-sm leading-relaxed">
              Monday – Saturday
              <br />
              <span className="text-muted-soft">10:00 — 19:00 IST</span>
            </p>
          </div>

          <div className="flex items-center gap-4 pt-2">
            <a
              href="https://www.linkedin.com/"
              target="_blank"
              rel="noreferrer"
              aria-label="LinkedIn"
              className="w-10 h-10 rounded-full border border-ink/25 flex items-center justify-center text-ink hover:bg-ink hover:text-paper transition-colors"
            >
              <Linkedin size={15} />
            </a>
            <a
              href="https://www.instagram.com/"
              target="_blank"
              rel="noreferrer"
              aria-label="Instagram"
              className="w-10 h-10 rounded-full border border-ink/25 flex items-center justify-center text-ink hover:bg-ink hover:text-paper transition-colors"
            >
              <Instagram size={15} />
            </a>
          </div>
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
        <div className="hairline-dark mb-12" />
        <div className="grid md:grid-cols-12 gap-8 mb-10 items-end">
          <div className="md:col-span-7">
            <div className="eyebrow text-gold mb-4">Visit the studio</div>
            <h2
              className="font-display text-ink"
              style={{
                fontSize: "clamp(32px, 4.5vw, 64px)",
                fontWeight: 300,
                letterSpacing: "-0.02em",
                lineHeight: 1,
              }}
            >
              Sadashiva Nagar, <span className="italic text-gold">Bengaluru.</span>
            </h2>
          </div>
          <div className="md:col-span-4 md:col-start-9">
            <p className="text-muted-soft leading-relaxed">
              Visits are by appointment. Reach out and we'll arrange a time that suits you,
              with a private walk-through of current and upcoming residences.
            </p>
          </div>
        </div>

        <div className="relative overflow-hidden rounded-sm border border-line-dark">
          <div className="aspect-[16/10] md:aspect-[21/9] w-full bg-paper">
            <iframe
              title="Velociti Real Estate — Sadashiva Nagar studio"
              src={MAP_EMBED_SRC}
              className="w-full h-full"
              style={{ border: 0, filter: "grayscale(0.25) contrast(0.95)" }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>

          {/* Floating address card */}
          <div className="hidden md:block absolute left-6 bottom-6 max-w-sm bg-paper/95 backdrop-blur-sm border border-line-dark p-6">
            <div className="eyebrow text-gold mb-3">Velociti Real Estate</div>
            <p className="text-ink text-sm leading-relaxed">
              Cassini Towers, Sadashiva Nagar
              <br />
              Bengaluru 560080
            </p>
            <a
              href={DIRECTIONS_URL}
              target="_blank"
              rel="noreferrer"
              className="nav-link inline-flex items-center gap-1 mt-4 text-sm text-ink"
            >
              Open in Google Maps
              <ArrowUpRight size={14} />
            </a>
          </div>
        </div>
      </motion.div>
    </PageShell>
  );
}
