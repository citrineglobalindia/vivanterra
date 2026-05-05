import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useLocation } from "react-router-dom";
import { toast } from "sonner";
import { ArrowUpRight, Loader2, Sparkles, X } from "lucide-react";

/* ============================================================
   Vivanterra LeadPopup — invitation-only early-access modal.
   Cinematic split: image with slow zoom + gold monogram + film grain
   on one side, editorial form with staggered fields on the other.

   Triggers (first to fire wins):
     • 18 seconds on page
     • 45% scroll
     • Desktop exit-intent
   Suppressed for 7 days after dismiss/submit. Skipped on /contact.
   ============================================================ */

const SEEN_KEY = "vivanterra:lead:dismissed:v2";
const SUBMIT_KEY = "vivanterra:lead:submitted:v2";
const DISMISS_DAYS = 7;
const TIME_TRIGGER_MS = 3_000;
const SCROLL_TRIGGER = 0.45;

const HERO_IMG =
  "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1400&q=85";

const schema = z.object({
  name: z.string().trim().min(2, "Please share your name"),
  email: z.string().trim().email("A valid email, please"),
  phone: z
    .string()
    .trim()
    .optional()
    .refine((v) => !v || /^[+\d\s\-()]{7,20}$/.test(v), "Check the phone number"),
  consent: z.literal(true, {
    errorMap: () => ({ message: "Please accept to continue" }),
  }),
});

type FormValues = z.infer<typeof schema>;

const nowMs = () => Date.now();

function recentlyDismissed(): boolean {
  try {
    const raw =
      localStorage.getItem(SUBMIT_KEY) || localStorage.getItem(SEEN_KEY);
    if (!raw) return false;
    const ts = Number(raw);
    if (!Number.isFinite(ts)) return false;
    return nowMs() - ts < DISMISS_DAYS * 86_400_000;
  } catch {
    return false;
  }
}

function markDismissed(key: string) {
  try {
    localStorage.setItem(key, String(nowMs()));
  } catch {
    /* noop */
  }
}

const fieldFx = {
  hidden: { opacity: 0, y: 14 },
  show: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, delay: 0.08 * i + 0.25, ease: [0.2, 0.8, 0.2, 1] },
  }),
};

export default function LeadPopup() {
  const { pathname } = useLocation();
  const [open, setOpen] = useState(false);
  const armedRef = useRef(true);
  const dialogRef = useRef<HTMLDivElement>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    mode: "onTouched",
  });

  /* Trigger setup — homepage only */
  useEffect(() => {
    if (pathname !== "/") return;
    if (recentlyDismissed()) return;

    let timeT: number | null = null;
    let scrollH: ((e: Event) => void) | null = null;
    let exitH: ((e: MouseEvent) => void) | null = null;

    const fire = () => {
      if (!armedRef.current) return;
      armedRef.current = false;
      setOpen(true);
    };

    timeT = window.setTimeout(fire, TIME_TRIGGER_MS);

    scrollH = () => {
      const h = document.documentElement;
      const max = h.scrollHeight - h.clientHeight;
      if (max <= 0) return;
      if (h.scrollTop / max >= SCROLL_TRIGGER) fire();
    };
    window.addEventListener("scroll", scrollH, { passive: true });

    const isFine =
      typeof window.matchMedia === "function" &&
      window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    if (isFine) {
      exitH = (e: MouseEvent) => {
        if (e.clientY <= 4 && e.relatedTarget === null) fire();
      };
      document.addEventListener("mouseout", exitH);
    }

    return () => {
      if (timeT) window.clearTimeout(timeT);
      if (scrollH) window.removeEventListener("scroll", scrollH);
      if (exitH) document.removeEventListener("mouseout", exitH);
    };
  }, [pathname]);

  /* Esc + body lock + initial focus */
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeIt(true);
    };
    window.addEventListener("keydown", onKey);

    const t = window.setTimeout(() => {
      const first =
        dialogRef.current?.querySelector<HTMLInputElement>("input[name='name']");
      first?.focus();
    }, 700);

    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
      window.clearTimeout(t);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  function closeIt(persist: boolean) {
    setOpen(false);
    if (persist) markDismissed(SEEN_KEY);
  }

  async function onSubmit(values: FormValues) {
    await new Promise((r) => setTimeout(r, 1100));
    console.log("lead", values);
    markDismissed(SUBMIT_KEY);
    toast.success("You're on the list", {
      description: "We'll be in touch with our next release.",
    });
    setOpen(false);
    reset();
  }

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          key="lead-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5, ease: [0.2, 0.8, 0.2, 1] }}
          className="fixed inset-0 z-[10050] flex items-center justify-center p-4 md:p-8"
          aria-modal="true"
          role="dialog"
          aria-labelledby="lead-title"
          onClick={() => closeIt(true)}
        >
          {/* Rich backdrop with film-grain */}
          <div
            aria-hidden
            className="absolute inset-0 bg-ink/80 backdrop-blur-[6px]"
          />
          <div
            aria-hidden
            className="absolute inset-0 opacity-[0.06] mix-blend-overlay pointer-events-none"
            style={{
              backgroundImage:
                "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='200' height='200'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/></filter><rect width='100%' height='100%' filter='url(%23n)' opacity='0.7'/></svg>\")",
            }}
          />

          {/* Dialog */}
          <motion.div
            ref={dialogRef}
            initial={{ opacity: 0, y: 40, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 40, scale: 0.96 }}
            transition={{ duration: 0.7, ease: [0.2, 0.8, 0.2, 1] }}
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-[960px] max-h-[88vh] overflow-hidden bg-paper grid md:grid-cols-12 ring-1 ring-gold/30"
            style={{
              boxShadow:
                "0 60px 140px -40px rgba(78,115,83,0.7), 0 0 0 1px rgba(196,169,106,0.25), 0 0 80px -20px rgba(196,169,106,0.25)",
            }}
          >
            {/* Close button — high contrast, always visible */}
            <button
              type="button"
              onClick={() => closeIt(true)}
              aria-label="Close"
              className="absolute top-3 right-3 md:top-4 md:right-4 z-50 w-10 h-10 md:w-11 md:h-11 rounded-full bg-ink text-paper flex items-center justify-center hover:bg-gold hover:text-ink transition-all duration-300 hover:rotate-90"
              style={{
                boxShadow:
                  "0 0 0 1px rgba(196,169,106,0.5), 0 8px 24px -8px rgba(14,14,16,0.5)",
              }}
            >
              <X size={16} strokeWidth={2.4} />
            </button>

            {/* ── Image side ────────────────────────────── */}
            <div className="hidden md:block md:col-span-5 relative bg-ink overflow-hidden">
              {/* Slow ken-burns */}
              <motion.img
                src={HERO_IMG}
                alt=""
                className="absolute inset-0 w-full h-full object-cover"
                initial={{ scale: 1.18, opacity: 0 }}
                animate={{ scale: 1, opacity: 0.78 }}
                transition={{ duration: 8, ease: "easeOut" }}
                loading="eager"
              />

              {/* Sage→ink atmospheric gradient */}
              <div
                aria-hidden
                className="absolute inset-0"
                style={{
                  background:
                    "linear-gradient(150deg, rgba(78,115,83,0.55) 0%, rgba(14,14,16,0.30) 45%, rgba(14,14,16,0.85) 100%)",
                }}
              />

              {/* Pulsing gold ambient glow */}
              <motion.div
                aria-hidden
                className="absolute -top-1/4 -right-1/4 w-[80%] h-[80%] pointer-events-none"
                style={{
                  background:
                    "radial-gradient(ellipse at center, rgba(196,169,106,0.30) 0%, rgba(196,169,106,0.08) 40%, rgba(0,0,0,0) 70%)",
                  filter: "blur(40px)",
                }}
                animate={{ opacity: [0.7, 1, 0.7] }}
                transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
              />

              {/* Film grain */}
              <div
                aria-hidden
                className="absolute inset-0 opacity-[0.10] mix-blend-overlay pointer-events-none"
                style={{
                  backgroundImage:
                    "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='200' height='200'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/></filter><rect width='100%' height='100%' filter='url(%23n)' opacity='0.7'/></svg>\")",
                }}
              />

              {/* Refined corner marks */}
              <span className="absolute top-6 left-6 w-6 h-6 border-l border-t border-gold/60" />
              <span className="absolute bottom-6 left-6 w-6 h-6 border-l border-b border-gold/60" />
              <span className="absolute top-6 right-6 w-6 h-6 border-r border-t border-gold/60" />

              {/* Top monogram + invitation seal */}
              <motion.div
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
                className="absolute top-8 left-8 right-8 flex items-start justify-between"
              >
                <div className="relative w-12 h-12 rounded-full border border-gold/70 flex items-center justify-center backdrop-blur-sm">
                  <span
                    className="font-display italic text-gold"
                    style={{ fontSize: 22, lineHeight: 1, fontWeight: 400 }}
                  >
                    V
                  </span>
                  <span className="absolute -inset-1 rounded-full border border-gold/20" />
                </div>
                <div className="text-right text-paper/80">
                  <div className="text-[10px] tracking-[0.22em] text-gold tabular-nums">
                    INVITATION
                  </div>
                  <div className="text-[10px] tracking-[0.22em] text-paper/60 tabular-nums mt-1">
                    No. 001 / 100
                  </div>
                </div>
              </motion.div>

              {/* Caption */}
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.9, delay: 0.5, ease: [0.2, 0.8, 0.2, 1] }}
                className="absolute bottom-10 left-8 right-8 text-paper"
              >
                <div className="flex items-center gap-3 mb-4">
                  <span className="h-px w-10 bg-gold" />
                  <span className="text-[10px] tracking-[0.22em] text-gold tabular-nums">
                    EARLY ACCESS · 2026
                  </span>
                </div>
                <p
                  className="font-display italic font-light"
                  style={{
                    fontSize: "clamp(22px, 2.4vw, 30px)",
                    lineHeight: 1.18,
                    letterSpacing: "-0.01em",
                  }}
                >
                  "A residence is composed
                  <br />
                  in private, long before
                  <br />
                  it is shown."
                </p>
                <p className="eyebrow text-paper/60 mt-5">— The studio</p>
              </motion.div>
            </div>

            {/* ── Form side ───────────────────────────── */}
            <div className="md:col-span-7 px-6 pt-10 pb-7 md:px-10 md:pt-10 md:pb-8 overflow-y-auto relative">
              {/* Soft gold halo behind headline */}
              <div
                aria-hidden
                className="absolute -top-24 -right-24 w-[400px] h-[400px] pointer-events-none"
                style={{
                  background:
                    "radial-gradient(ellipse at center, rgba(196,169,106,0.10) 0%, rgba(196,169,106,0) 60%)",
                  filter: "blur(20px)",
                }}
              />

              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.2 }}
                className="flex items-center gap-3 mb-4 relative"
              >
                <Sparkles size={13} className="text-gold" />
                <span className="eyebrow text-muted-soft">
                  Reserve your invitation
                </span>
              </motion.div>

              <motion.h2
                id="lead-title"
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.25, ease: [0.2, 0.8, 0.2, 1] }}
                className="font-display text-ink relative"
                style={{
                  fontSize: "clamp(26px, 2.8vw, 38px)",
                  fontWeight: 300,
                  letterSpacing: "-0.02em",
                  lineHeight: 1.05,
                }}
              >
                Receive a <span className="italic text-gold">private brief</span>
                <br />
                before public release.
              </motion.h2>

              <form
                onSubmit={handleSubmit(onSubmit)}
                noValidate
                className="mt-7 space-y-5 relative"
              >
                <Field index={0} num="01" label="Name" error={errors.name?.message}>
                  <input
                    type="text"
                    autoComplete="name"
                    placeholder="Your full name"
                    className={inputCls}
                    {...register("name")}
                  />
                </Field>

                <Field index={1} num="02" label="Email" error={errors.email?.message}>
                  <input
                    type="email"
                    autoComplete="email"
                    placeholder="you@example.com"
                    className={inputCls}
                    {...register("email")}
                  />
                </Field>

                <Field
                  index={2}
                  num="03"
                  label="Phone (optional)"
                  error={errors.phone?.message}
                >
                  <input
                    type="tel"
                    autoComplete="tel"
                    placeholder="+91 ·····"
                    className={inputCls}
                    {...register("phone")}
                  />
                </Field>

                <motion.div
                  custom={3}
                  variants={fieldFx}
                  initial="hidden"
                  animate="show"
                >
                  <label className="flex items-start gap-2.5 cursor-pointer text-muted-soft text-[13px] leading-snug">
                    <input
                      type="checkbox"
                      className="mt-[3px] w-4 h-4 accent-[var(--gold)] shrink-0"
                      {...register("consent")}
                    />
                    <span>
                      I'd like to receive private briefs. We'll never share your
                      details.
                    </span>
                  </label>
                  {errors.consent && (
                    <p className="mt-1 text-[12px] tracking-wide text-[hsl(var(--destructive))]">
                      {errors.consent.message as string}
                    </p>
                  )}
                </motion.div>

                <motion.div
                  custom={4}
                  variants={fieldFx}
                  initial="hidden"
                  animate="show"
                  className="flex flex-wrap items-center gap-5 pt-1"
                >
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="group relative inline-flex items-center gap-2 h-12 px-7 rounded-full bg-ink text-paper font-medium text-[12px] tracking-[0.10em] uppercase overflow-hidden transition-transform duration-300 hover:-translate-y-0.5 disabled:opacity-60 disabled:cursor-not-allowed"
                    style={{
                      boxShadow:
                        "0 20px 50px -20px rgba(78,115,83,0.55), 0 0 0 1px rgba(196,169,106,0.35)",
                    }}
                  >
                    <span
                      aria-hidden
                      className="absolute inset-0 bg-gold scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-500 ease-[cubic-bezier(0.2,0.8,0.2,1)]"
                    />
                    <span className="relative z-10 inline-flex items-center gap-2 group-hover:text-ink transition-colors duration-500">
                      {isSubmitting ? (
                        <>
                          <Loader2 className="animate-spin" size={16} />
                          Reserving
                        </>
                      ) : (
                        <>
                          Reserve my invitation
                          <ArrowUpRight
                            size={16}
                            className="transition-transform duration-500 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                          />
                        </>
                      )}
                    </span>
                  </button>
                  <button
                    type="button"
                    onClick={() => closeIt(true)}
                    className="text-sm text-muted-soft hover:text-ink transition-colors underline-offset-4 hover:underline"
                  >
                    Maybe later
                  </button>
                </motion.div>
              </form>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/* ── Bits ────────────────────────────────────────────── */

const inputCls =
  "w-full bg-transparent border-0 border-b border-ink/20 focus:border-gold py-2 text-base text-ink outline-none transition-colors placeholder:text-ink/30";

function Field({
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
      animate="show"
    >
      <div className="flex items-baseline gap-3 mb-1.5">
        <span className="text-[10px] tracking-[0.22em] text-gold tabular-nums">
          {num}
        </span>
        <span className="eyebrow text-muted-soft">{label}</span>
      </div>
      {children}
      {error && (
        <p className="mt-1 text-[12px] tracking-wide text-[hsl(var(--destructive))]">
          {error}
        </p>
      )}
    </motion.div>
  );
}
