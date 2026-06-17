import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useLocation } from "react-router-dom";
import { toast } from "sonner";
import {
  ArrowUpRight,
  Building2,
  Loader2,
  Mail,
  MapPin,
  Phone,
  Tag,
  User,
  X,
} from "lucide-react";

/* ============================================================
   Vivanterra LeadPopup — single-column premium lead card.
   Image header with gold badge + property line, icon-prefixed
   form, configuration select, full-width CTA.

   Triggers (first to fire wins):
     • 3 seconds on page
     • 45% scroll
     • Desktop exit-intent
   Suppressed for 7 days after dismiss/submit. Homepage only.
   ============================================================ */

const SEEN_KEY = "vivanterra:lead:dismissed:v3";
const SUBMIT_KEY = "vivanterra:lead:submitted:v3";
const DISMISS_DAYS = 7;
const TIME_TRIGGER_MS = 3_000;
const SCROLL_TRIGGER = 0.45;

const HERO_IMG =
  "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=85";

const PROPERTY = {
  badge: "PRIVATE BRIEF",
  name: "Vivanterra Sadashiva Nagar",
  location: "13th Cross Rd, Bengaluru",
  price: "By appointment",
};

const CONFIGURATIONS = [
  "2 BHK Residence",
  "3 BHK Residence",
  "4 BHK Residence",
  "Penthouse",
  "Villa",
] as const;

const schema = z.object({
  name: z.string().trim().min(2, "Please share your name"),
  phone: z
    .string()
    .trim()
    .min(7, "Please share a phone number")
    .regex(/^[+\d\s\-()]{7,20}$/, "Check the phone number"),
  email: z.string().trim().email("A valid email, please"),
  project: z.string().trim().min(1),
  configuration: z.string().trim().min(1, "Please choose a configuration"),
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
    defaultValues: {
      project: PROPERTY.name,
      configuration: "",
    },
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
      if (e.key === "Escape") {
        setOpen(false);
        markDismissed(SEEN_KEY);
      }
    };
    window.addEventListener("keydown", onKey);

    const t = window.setTimeout(() => {
      const first =
        dialogRef.current?.querySelector<HTMLInputElement>("input[name='name']");
      first?.focus();
    }, 500);

    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
      window.clearTimeout(t);
    };
  }, [open]);

  function closeIt(persist: boolean) {
    setOpen(false);
    if (persist) markDismissed(SEEN_KEY);
  }

  async function onSubmit(values: FormValues) {
    try {
      await fetch("/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: values.name,
          email: values.email,
          phone: values.phone,
          kind: "popup",
          message: `Interested in ${values.configuration} at ${values.project}`,
          page_path: typeof window !== "undefined" ? window.location.pathname : null,
          source: "lead-popup",
        }),
      });
    } catch {
      // Non-blocking — still confirm to the user even if the network hiccups.
    }
    markDismissed(SUBMIT_KEY);
    toast.success("You're on the list", {
      description: "We'll be in touch with our next release.",
    });
    setOpen(false);
    reset({ project: PROPERTY.name, configuration: "" });
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
          className="fixed inset-0 z-[10050] flex items-center justify-center p-4"
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

          {/* Card */}
          <motion.div
            ref={dialogRef}
            initial={{ opacity: 0, y: 30, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 30, scale: 0.97 }}
            transition={{ duration: 0.55, ease: [0.2, 0.8, 0.2, 1] }}
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-[440px] max-h-[94vh] overflow-y-auto bg-paper rounded-xl overflow-x-hidden"
            style={{
              boxShadow:
                "0 40px 100px -30px rgba(78,115,83,0.6), 0 0 0 1px rgba(196,169,106,0.25)",
            }}
          >
            {/* Close */}
            <button
              type="button"
              onClick={() => closeIt(true)}
              aria-label="Close"
              className="absolute top-3 right-3 z-30 w-9 h-9 rounded-full bg-paper text-ink shadow-md flex items-center justify-center hover:bg-gold hover:text-ink hover:rotate-90 transition-all duration-300"
              style={{
                boxShadow:
                  "0 0 0 1px rgba(78,115,83,0.18), 0 4px 12px -4px rgba(14,14,16,0.25)",
              }}
            >
              <X size={15} strokeWidth={2.4} />
            </button>

            {/* ── Image header ── */}
            <div className="relative h-[180px] sm:h-[210px] overflow-hidden bg-ink">
              <motion.img
                src={HERO_IMG}
                alt=""
                className="absolute inset-0 w-full h-full object-cover"
                initial={{ scale: 1.1 }}
                animate={{ scale: 1 }}
                transition={{ duration: 6, ease: "easeOut" }}
                loading="eager"
              />
              {/* Bottom-up dark gradient for readable text */}
              <div
                aria-hidden
                className="absolute inset-0"
                style={{
                  background:
                    "linear-gradient(180deg, rgba(14,14,16,0.15) 0%, rgba(14,14,16,0.25) 35%, rgba(14,14,16,0.85) 100%)",
                }}
              />
              {/* Gold ambient */}
              <div
                aria-hidden
                className="absolute -top-12 -right-12 w-[60%] h-[80%] pointer-events-none"
                style={{
                  background:
                    "radial-gradient(ellipse at center, rgba(196,169,106,0.22) 0%, rgba(196,169,106,0) 65%)",
                  filter: "blur(30px)",
                }}
              />

              {/* Premium badge (top-left) */}
              <motion.div
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.5 }}
                className="absolute top-5 left-5"
              >
                <span className="inline-flex items-center gap-1.5 bg-gold text-ink px-3 py-1.5 text-[10px] tracking-[0.18em] font-semibold uppercase">
                  {PROPERTY.badge}
                </span>
              </motion.div>

              {/* Property block (bottom) */}
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.6 }}
                className="absolute left-5 right-5 bottom-5 text-paper"
              >
                <h2
                  id="lead-title"
                  className="font-display font-light leading-tight"
                  style={{
                    fontSize: "clamp(24px, 4vw, 30px)",
                    letterSpacing: "-0.02em",
                  }}
                >
                  {PROPERTY.name}
                </h2>

                <div className="mt-3 pl-3 border-l-2 border-gold space-y-1.5">
                  <div className="flex items-center gap-2 text-paper/95 text-[13px]">
                    <MapPin size={13} className="text-gold shrink-0" />
                    <span>{PROPERTY.location}</span>
                  </div>
                  <div className="flex items-center gap-2 text-paper text-[13px] font-medium">
                    <Tag size={13} className="text-gold shrink-0" />
                    <span>{PROPERTY.price}</span>
                  </div>
                </div>
              </motion.div>
            </div>

            {/* ── Form ── */}
            <form
              onSubmit={handleSubmit(onSubmit)}
              noValidate
              className="p-5 sm:p-7 space-y-3.5"
            >
              <div className="grid sm:grid-cols-2 gap-3.5">
                <IconField
                  icon={<User size={16} />}
                  error={errors.name?.message}
                >
                  <input
                    type="text"
                    autoComplete="name"
                    placeholder="Full name*"
                    className={inputCls}
                    {...register("name")}
                  />
                </IconField>

                <IconField
                  icon={<Phone size={16} />}
                  error={errors.phone?.message}
                >
                  <input
                    type="tel"
                    autoComplete="tel"
                    placeholder="Phone*"
                    className={inputCls}
                    {...register("phone")}
                  />
                </IconField>
              </div>

              <IconField
                icon={<Mail size={16} />}
                error={errors.email?.message}
              >
                <input
                  type="email"
                  autoComplete="email"
                  placeholder="Email Address*"
                  className={inputCls}
                  {...register("email")}
                />
              </IconField>

              <IconField
                icon={<Building2 size={16} />}
                error={errors.project?.message}
              >
                <input
                  type="text"
                  readOnly
                  className={`${inputCls} cursor-default`}
                  {...register("project")}
                />
              </IconField>

              <IconField
                icon={<Tag size={16} />}
                error={errors.configuration?.message}
              >
                <select
                  className={`${inputCls} appearance-none cursor-pointer pr-8 bg-[image:linear-gradient(45deg,transparent_50%,#4E7353_50%),linear-gradient(135deg,#4E7353_50%,transparent_50%)] bg-[position:calc(100%_-_15px)_center,calc(100%_-_10px)_center] bg-[size:5px_5px,5px_5px] bg-no-repeat`}
                  defaultValue=""
                  {...register("configuration")}
                >
                  <option value="" disabled>
                    Select Configuration*
                  </option>
                  {CONFIGURATIONS.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </IconField>

              {/* CTA */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="group relative mt-5 w-full h-[54px] rounded-md bg-ink text-paper font-semibold text-[12.5px] tracking-[0.18em] uppercase overflow-hidden disabled:opacity-60 disabled:cursor-not-allowed"
                style={{
                  boxShadow:
                    "0 0 0 1px rgba(196,169,106,0.4), 0 16px 40px -16px rgba(78,115,83,0.55)",
                }}
              >
                <span
                  aria-hidden
                  className="absolute inset-0 bg-gold scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-500 ease-out"
                />
                <span className="relative z-10 inline-flex items-center justify-center gap-2 group-hover:text-ink transition-colors duration-500">
                  {isSubmitting ? (
                    <>
                      <Loader2 size={16} className="animate-spin" />
                      Sending
                    </>
                  ) : (
                    <>
                      Get VIP Access
                      <ArrowUpRight
                        size={15}
                        className="transition-transform duration-500 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                      />
                    </>
                  )}
                </span>
              </button>

              <p className="text-center text-[11px] text-muted-soft pt-1">
                We respect your privacy. Used solely for this enquiry.
              </p>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/* ── Bits ────────────────────────────────────────────── */

const inputCls =
  "w-full bg-transparent border-0 outline-none text-ink text-[14px] py-3.5 pl-11 pr-3 placeholder:text-ink/45";

function IconField({
  icon,
  error,
  children,
}: {
  icon: React.ReactNode;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <div
        className={[
          "relative rounded-md border bg-[rgba(78,115,83,0.04)] transition-all duration-200",
          "focus-within:border-gold focus-within:bg-paper focus-within:ring-2 focus-within:ring-gold/20",
          error ? "border-[hsl(var(--destructive))]" : "border-line-dark",
        ].join(" ")}
      >
        <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gold/70 pointer-events-none transition-colors">
          {icon}
        </span>
        {children}
      </div>
      {error && (
        <p className="mt-1 text-[11px] tracking-wide text-[hsl(var(--destructive))] pl-1">
          {error}
        </p>
      )}
    </div>
  );
}
