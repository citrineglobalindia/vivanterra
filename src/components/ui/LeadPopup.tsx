import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useLocation } from "react-router-dom";
import { toast } from "sonner";
import { ArrowUpRight, Loader2, X } from "lucide-react";

/* ============================================================
   Vivanterra LeadPopup — invitation-only early-access modal.
   Triggers (whichever fires first):
     • 18 seconds on page
     • 45% scroll
     • Desktop exit-intent (cursor leaves toward viewport top)
   Suppressed for 7 days after dismiss/submit.
   Excluded on /contact (user is already mid-enquiry).
   ============================================================ */

const SEEN_KEY = "vivanterra:lead:dismissed";
const SUBMIT_KEY = "vivanterra:lead:submitted";
const DISMISS_DAYS = 7;
const TIME_TRIGGER_MS = 18_000;
const SCROLL_TRIGGER = 0.45;

const HERO_IMG =
  "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80";

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

function nowMs() {
  return Date.now();
}

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

  /* ── Trigger setup ──────────────────────────────────── */
  useEffect(() => {
    if (pathname === "/contact") return;
    if (recentlyDismissed()) return;

    let timeT: number | null = null;
    let scrollH: ((e: Event) => void) | null = null;
    let exitH: ((e: MouseEvent) => void) | null = null;

    const fire = () => {
      if (!armedRef.current) return;
      armedRef.current = false;
      setOpen(true);
    };

    /* Time trigger */
    timeT = window.setTimeout(fire, TIME_TRIGGER_MS);

    /* Scroll trigger */
    scrollH = () => {
      const h = document.documentElement;
      const max = h.scrollHeight - h.clientHeight;
      if (max <= 0) return;
      const r = h.scrollTop / max;
      if (r >= SCROLL_TRIGGER) fire();
    };
    window.addEventListener("scroll", scrollH, { passive: true });

    /* Exit intent — desktop only */
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
      const first = dialogRef.current?.querySelector<HTMLInputElement>("input[name='name']");
      first?.focus();
    }, 200);

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
          transition={{ duration: 0.4, ease: [0.2, 0.8, 0.2, 1] }}
          className="fixed inset-0 z-[9995] flex items-center justify-center p-4 md:p-8"
          aria-modal="true"
          role="dialog"
          aria-labelledby="lead-title"
          onClick={() => closeIt(true)}
        >
          {/* Backdrop */}
          <div
            aria-hidden
            className="absolute inset-0 bg-ink/70 backdrop-blur-sm"
          />

          {/* Dialog */}
          <motion.div
            ref={dialogRef}
            initial={{ opacity: 0, y: 30, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 30, scale: 0.97 }}
            transition={{ duration: 0.55, ease: [0.2, 0.8, 0.2, 1] }}
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-5xl max-h-[92vh] overflow-hidden bg-paper border border-line-dark shadow-[0_40px_120px_-30px_rgba(78,115,83,0.55)] grid md:grid-cols-12"
          >
            {/* Close button */}
            <button
              type="button"
              onClick={() => closeIt(true)}
              aria-label="Close"
              className="absolute top-4 right-4 z-10 w-10 h-10 rounded-full border border-ink/20 bg-paper/80 backdrop-blur flex items-center justify-center text-ink hover:bg-ink hover:text-paper hover:border-ink transition-colors"
            >
              <X size={16} />
            </button>

            {/* ── Image side ────────────────────────────── */}
            <div className="hidden md:block md:col-span-5 relative bg-ink overflow-hidden">
              <img
                src={HERO_IMG}
                alt=""
                className="absolute inset-0 w-full h-full object-cover opacity-70"
                loading="eager"
              />
              <div
                aria-hidden
                className="absolute inset-0"
                style={{
                  background:
                    "linear-gradient(160deg, rgba(78,115,83,0.45) 0%, rgba(14,14,16,0.55) 100%)",
                }}
              />
              <div
                aria-hidden
                className="absolute inset-0 pointer-events-none"
                style={{
                  background:
                    "radial-gradient(ellipse at top right, rgba(196,169,106,0.18) 0%, rgba(196,169,106,0) 60%)",
                  filter: "blur(30px)",
                }}
              />
              {/* Corner brackets */}
              <span className="absolute top-6 left-6 w-6 h-6 border-l border-t border-paper/50" />
              <span className="absolute bottom-6 left-6 w-6 h-6 border-l border-b border-paper/50" />

              {/* Caption */}
              <div className="absolute bottom-8 left-8 right-8 text-paper">
                <span className="text-[10px] tracking-[0.22em] text-gold tabular-nums">
                  EARLY ACCESS · 2026
                </span>
                <p
                  className="font-display italic font-light mt-3"
                  style={{
                    fontSize: "clamp(22px, 2.4vw, 32px)",
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
              </div>
            </div>

            {/* ── Form side ───────────────────────────── */}
            <div className="md:col-span-7 px-6 py-10 md:px-12 md:py-14 overflow-y-auto">
              <div className="flex items-center gap-3 mb-6">
                <span className="h-px w-10 bg-gold" />
                <span className="eyebrow text-muted-soft">
                  Reserve your invitation
                </span>
              </div>

              <h2
                id="lead-title"
                className="font-display text-ink"
                style={{
                  fontSize: "clamp(30px, 3.6vw, 48px)",
                  fontWeight: 300,
                  letterSpacing: "-0.02em",
                  lineHeight: 1.05,
                }}
              >
                Be the first to receive
                <br />
                a <span className="italic text-gold">private brief</span>.
              </h2>

              <p className="mt-5 text-muted-soft leading-relaxed text-sm md:text-base max-w-md">
                We share new residences with a small list of interested clients
                before they reach the public. Leave your details to be included.
              </p>

              <form
                onSubmit={handleSubmit(onSubmit)}
                noValidate
                className="mt-9 space-y-7"
              >
                <Field label="Name" error={errors.name?.message} num="01">
                  <input
                    type="text"
                    autoComplete="name"
                    placeholder="Your full name"
                    className={inputCls}
                    {...register("name")}
                  />
                </Field>

                <Field label="Email" error={errors.email?.message} num="02">
                  <input
                    type="email"
                    autoComplete="email"
                    placeholder="you@example.com"
                    className={inputCls}
                    {...register("email")}
                  />
                </Field>

                <Field
                  label="Phone (optional)"
                  error={errors.phone?.message}
                  num="03"
                >
                  <input
                    type="tel"
                    autoComplete="tel"
                    placeholder="+91 ·····"
                    className={inputCls}
                    {...register("phone")}
                  />
                </Field>

                <div className="pt-1">
                  <label className="flex items-start gap-3 cursor-pointer text-muted-soft text-sm leading-relaxed">
                    <input
                      type="checkbox"
                      className="mt-[3px] w-4 h-4 accent-[var(--gold)]"
                      {...register("consent")}
                    />
                    <span>
                      I'd like to receive private briefs from Vivanterra Real
                      Estate. We'll never share your details.
                    </span>
                  </label>
                  {errors.consent && (
                    <p className="mt-2 text-[12px] tracking-wide text-[hsl(var(--destructive))]">
                      {errors.consent.message as string}
                    </p>
                  )}
                </div>

                <div className="flex flex-wrap items-center gap-5 pt-3">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="btn btn-dark disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="animate-spin" size={16} />
                        Reserving
                      </>
                    ) : (
                      <>
                        Reserve my invitation
                        <ArrowUpRight className="btn-arrow" size={16} />
                      </>
                    )}
                  </button>
                  <button
                    type="button"
                    onClick={() => closeIt(true)}
                    className="text-sm text-muted-soft hover:text-ink transition-colors underline-offset-4 hover:underline"
                  >
                    Maybe later
                  </button>
                </div>
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
  "w-full bg-transparent border-0 border-b border-ink/20 focus:border-gold py-3 text-base md:text-lg text-ink outline-none transition-colors placeholder:text-ink/30";

function Field({
  num,
  label,
  error,
  children,
}: {
  num: string;
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <div className="flex items-baseline gap-3 mb-2">
        <span className="text-[10px] tracking-[0.22em] text-gold tabular-nums">
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
    </div>
  );
}
