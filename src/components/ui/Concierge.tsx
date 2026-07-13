import { useEffect, useRef, useState, type ReactNode } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowUpRight, MessageCircle, Send, Sparkles, X } from "lucide-react";
import { Link } from "react-router-dom";

/* ============================================================
   Vivanterra Concierge — an in-house AI-styled chat widget.
   - Floating launcher (bottom-right)
   - Editorial chat panel matching the cream/sage/gold palette
   - Local intent matcher with suggested chips and quick actions
   - Persists message history in localStorage
   ============================================================ */

type Action = { label: string; href: string; external?: boolean };
type Message = {
  id: string;
  role: "bot" | "user";
  text: string;
  chips?: string[];
  actions?: Action[];
  ts: number;
};

const STORAGE_KEY = "vivanterra:concierge:v1";
const SEEN_KEY = "vivanterra:concierge:seen";

/* ── Intent map ─────────────────────────────────────────── */
type Intent = {
  match: RegExp;
  reply: () => Pick<Message, "text" | "chips" | "actions">;
};

const INTENTS: Intent[] = [
  {
    match: /\b(hi|hello|hey|hola|namaste|good (morning|afternoon|evening))\b/i,
    reply: () => ({
      text:
        "Hello — welcome to Vivanterra Real Estate. I'm the concierge. How can I help you today?",
      chips: ["Available residences", "Schedule a visit", "Speak with a person"],
    }),
  },
  {
    match: /\b(residences?|projects?|portfolio|properties|homes?|apartments?|flats?|villas?|available)\b/i,
    reply: () => ({
      text:
        "Our portfolio spans completed, ongoing and upcoming residences across India. Each is composed with patience and rare materials.",
      chips: ["Ongoing", "Upcoming", "Completed"],
      actions: [{ label: "View all residences", href: "/projects" }],
    }),
  },
  {
    match: /\b(ongoing|in progress|under construction)\b/i,
    reply: () => ({
      text: "Here are the residences currently being built.",
      actions: [{ label: "Ongoing residences", href: "/projects/ongoing" }],
    }),
  },
  {
    match: /\b(upcoming|launch|new|forthcoming|future)\b/i,
    reply: () => ({
      text: "A look at what's next from Vivanterra — by invitation.",
      actions: [{ label: "Upcoming residences", href: "/projects/upcoming" }],
    }),
  },
  {
    match: /\b(completed|finished|delivered|handover)\b/i,
    reply: () => ({
      text: "Residences we've delivered to date.",
      actions: [{ label: "Completed residences", href: "/projects/completed" }],
    }),
  },
  {
    match: /\b(visit|tour|appointment|book|schedule|see|walk[- ]?through|showroom|sample)\b/i,
    reply: () => ({
      text:
        "Visits are by private appointment, Monday – Saturday, 10:00 – 19:00 IST. Share your details and a preferred window, and we'll arrange a walk-through.",
      chips: ["Speak with a person", "Our location"],
      actions: [{ label: "Request a visit", href: "/contact" }],
    }),
  },
  {
    match: /\b(price|pricing|cost|budget|starting|rate|how much|range|fee)\b/i,
    reply: () => ({
      text:
        "Pricing is composed per residence, considering floor, view and finish. We share a curated brief in confidence once we understand your preferences.",
      chips: ["Schedule a visit", "Speak with a person"],
      actions: [{ label: "Open private brief", href: "/contact" }],
    }),
  },
  {
    match: /\b(location|address|studio|where|directions|office|map|sadashiva)\b/i,
    reply: () => ({
      text:
        "Our office is at Cassini Towers, Sadashiva Nagar, Bengaluru 560080. Visits by appointment only.",
      actions: [
        {
          label: "Open in Google Maps",
          href:
            "https://www.google.com/maps/dir/?api=1&destination=Velociti+Real+Estate,+Sadashiva+Nagar,+Bengaluru",
          external: true,
        },
        { label: "Contact Vivanterra", href: "/contact" },
      ],
    }),
  },
  {
    match: /\b(phone|call|telephone|number|reach)\b/i,
    reply: () => ({
      text: "You can reach us directly at +91 88675 89797.",
      actions: [
        { label: "Call now", href: "tel:+918867589797", external: true },
        { label: "WhatsApp instead", href: "https://wa.me/918867589797", external: true },
      ],
    }),
  },
  {
    match: /\b(email|mail|write)\b/i,
    reply: () => ({
      text: "Drop us a note at hello@vivanterra.in — we read every message.",
      actions: [{ label: "Open mail", href: "mailto:hello@vivanterra.in", external: true }],
    }),
  },
  {
    match: /\b(whats?app|chat|message|text)\b/i,
    reply: () => ({
      text: "We're on WhatsApp at +91 88675 89797. Quickest way to reach the team.",
      actions: [
        { label: "Open WhatsApp", href: "https://wa.me/918867589797", external: true },
      ],
    }),
  },
  {
    match: /\b(about|who|company|firm|history|story|studio)\b/i,
    reply: () => ({
      text:
        "Vivanterra is a residential practice — a small atelier composing private residences with patience, restraint and rare materials.",
      actions: [{ label: "Read about us", href: "/about" }],
    }),
  },
  {
    match: /\b(career|careers?|job|jobs?|hiring|hire|work|opening|vacancy)\b/i,
    reply: () => ({
      text:
        "We hire rarely and quietly — for designers, project leads and craftspeople who care deeply about the made object.",
      actions: [{ label: "View careers", href: "/career" }],
    }),
  },
  {
    match: /\b(press|media|journalist|article|interview)\b/i,
    reply: () => ({
      text:
        "For press enquiries, send a brief through the contact form with subject 'Press' and we'll respond within a business day.",
      actions: [{ label: "Press enquiry", href: "/contact" }],
    }),
  },
  {
    match: /\b(invest|investor|partnership|partner|allocation|yield|fund)\b/i,
    reply: () => ({
      text:
        "Investor relations are handled directly by leadership. Begin a confidential briefing through the contact form, marked 'Investor'.",
      actions: [{ label: "Investor enquiry", href: "/contact" }],
    }),
  },
  {
    match: /\b(blog|blogs?|article|read|journal|insights?)\b/i,
    reply: () => ({
      text: "Our journal collects field notes from Vivanterra, in print and online.",
      actions: [{ label: "Visit the journal", href: "/blogs" }],
    }),
  },
  {
    match: /\b(human|person|agent|advisor|someone|representative|talk to|live)\b/i,
    reply: () => ({
      text:
        "Of course. The fastest way to reach a person is the contact form — every enquiry is read by our concierge, never automated.",
      chips: ["Phone", "Email", "WhatsApp"],
      actions: [{ label: "Open the contact form", href: "/contact" }],
    }),
  },
  {
    match: /\b(thanks?|thank you|cheers|appreciate|ty)\b/i,
    reply: () => ({
      text: "Thank you. We're here whenever you need us.",
    }),
  },
  {
    match: /\b(bye|goodbye|see you|later|gn|good ?night)\b/i,
    reply: () => ({ text: "Until next time. Wishing you a beautiful evening." }),
  },
];

const FALLBACK = (q: string): Pick<Message, "text" | "chips" | "actions"> => ({
  text:
    q.length < 4
      ? "Could you share a little more?"
      : "I'd love to connect you with our team for that — every enquiry is read by a person, never automated.",
  chips: ["Available residences", "Schedule a visit", "Our location"],
  actions: [{ label: "Speak with Vivanterra", href: "/contact" }],
});

const WELCOME: Message = {
  id: "welcome",
  role: "bot",
  ts: Date.now(),
  text:
    "Welcome — I'm the Vivanterra concierge. Tell me what you're looking for and I'll point you in the right direction.",
  chips: ["Available residences", "Schedule a visit", "Our location", "Speak with a person"],
};

function uid() {
  return Math.random().toString(36).slice(2, 10);
}

function loadMessages(): Message[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [WELCOME];
    const parsed = JSON.parse(raw) as Message[];
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : [WELCOME];
  } catch {
    return [WELCOME];
  }
}

function answer(q: string): Pick<Message, "text" | "chips" | "actions"> {
  for (const i of INTENTS) if (i.match.test(q)) return i.reply();
  return FALLBACK(q);
}

/* ── Component ──────────────────────────────────────────── */

export default function Concierge() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>(() => {
    if (typeof window === "undefined") return [WELCOME];
    return loadMessages();
  });
  const [draft, setDraft] = useState("");
  const [typing, setTyping] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  /* Persist messages */
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
    } catch {
      /* noop */
    }
  }, [messages]);

  /* Show a one-time pulse hint on first visit */
  useEffect(() => {
    try {
      if (!localStorage.getItem(SEEN_KEY)) {
        const t = setTimeout(() => setShowHint(true), 2400);
        const t2 = setTimeout(() => setShowHint(false), 9000);
        return () => {
          clearTimeout(t);
          clearTimeout(t2);
        };
      }
    } catch {
      /* noop */
    }
  }, []);

  /* Autoscroll on new message / typing */
  useEffect(() => {
    if (!open) return;
    const el = scrollRef.current;
    if (!el) return;
    el.scrollTo({ top: el.scrollHeight, behavior: "smooth" });
  }, [messages, typing, open]);

  /* Focus input on open */
  useEffect(() => {
    if (open) {
      try {
        localStorage.setItem(SEEN_KEY, "1");
      } catch {
        /* noop */
      }
      setShowHint(false);
      const t = setTimeout(() => inputRef.current?.focus(), 250);
      return () => clearTimeout(t);
    }
  }, [open]);

  /* Esc to close */
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  function send(text: string) {
    const trimmed = text.trim();
    if (!trimmed) return;
    const userMsg: Message = {
      id: uid(),
      role: "user",
      text: trimmed,
      ts: Date.now(),
    };
    setMessages((m) => [...m, userMsg]);
    setDraft("");
    setTyping(true);
    const delay = 600 + Math.min(1400, trimmed.length * 18);
    setTimeout(() => {
      const reply = answer(trimmed);
      setMessages((m) => [...m, { id: uid(), role: "bot", ts: Date.now(), ...reply }]);
      setTyping(false);
    }, delay);
  }

  function reset() {
    setMessages([{ ...WELCOME, id: uid(), ts: Date.now() }]);
  }

  return (
    <>
      {/* ───────── Launcher ───────── */}
      <div className="fixed bottom-6 right-6 md:bottom-8 md:right-8 z-[9990]">
        <AnimatePresence>
          {showHint && !open && (
            <motion.div
              initial={{ opacity: 0, y: 6, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 6, scale: 0.96 }}
              transition={{ duration: 0.5, ease: [0.2, 0.8, 0.2, 1] }}
              className="absolute right-16 bottom-2 whitespace-nowrap rounded-full bg-paper border border-line-dark px-4 py-2 text-sm text-ink shadow-[0_8px_24px_-12px_rgba(78,115,83,0.3)]"
            >
              <span className="text-gold mr-1">·</span> Concierge — ask anything
            </motion.div>
          )}
        </AnimatePresence>

        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", stiffness: 260, damping: 18, delay: 0.6 }}
        >
        <motion.button
          aria-label={open ? "Close concierge" : "Open concierge"}
          aria-expanded={open}
          onClick={() => setOpen((o) => !o)}
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.92 }}
          animate={open ? { y: 0 } : { y: [0, -6, 0] }}
          transition={open ? { duration: 0.3 } : { duration: 3, repeat: Infinity, ease: "easeInOut" }}
          className="relative h-12 w-12 md:h-14 md:w-14 rounded-full bg-ink text-paper flex items-center justify-center shadow-[0_18px_40px_-14px_rgba(78,115,83,0.55)]"
        >
          {/* Gold pulse */}
          {!open && (
            <>
              <span
                aria-hidden
                className="absolute inset-0 rounded-full border border-gold/60 animate-ping-slow opacity-70"
              />
              <span
                aria-hidden
                className="absolute inset-0 rounded-full border border-gold/40 animate-ping-slow opacity-50"
                style={{ animationDelay: "1s" }}
              />
            </>
          )}
          <AnimatePresence mode="wait" initial={false}>
            {open ? (
              <motion.span
                key="x"
                initial={{ rotate: -45, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: 45, opacity: 0 }}
                transition={{ duration: 0.25 }}
              >
                <X size={18} />
              </motion.span>
            ) : (
              <motion.span
                key="msg"
                initial={{ rotate: 45, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: -45, opacity: 0 }}
                transition={{ duration: 0.25 }}
              >
                <MessageCircle size={19} />
              </motion.span>
            )}
          </AnimatePresence>
        </motion.button>
        </motion.div>
      </div>

      {/* ───────── Panel ───────── */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 24, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 24, scale: 0.97 }}
            transition={{ duration: 0.4, ease: [0.2, 0.8, 0.2, 1] }}
            role="dialog"
            aria-label="Vivanterra concierge"
            className="fixed z-[9989] bg-paper border border-line-dark shadow-[0_30px_80px_-20px_rgba(78,115,83,0.45)] flex flex-col overflow-hidden bottom-24 right-4 md:bottom-28 md:right-8 w-[calc(100vw-2rem)] sm:w-[400px] h-[min(70vh,580px)] rounded-sm"
          >
            {/* Header */}
            <header className="relative px-5 py-4 bg-ink text-paper">
              <span className="absolute top-0 left-0 w-12 h-px bg-gold" />
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-paper/10 border border-paper/20 flex items-center justify-center">
                    <Sparkles size={14} className="text-gold" />
                  </div>
                  <div>
                    <div className="font-display text-paper text-base leading-tight">
                      Vivanterra Real Estate <span className="">Concierge</span>
                    </div>
                    <div className="flex items-center gap-2 text-[10px] tracking-[0.18em] uppercase text-paper/60">
                      <span className="w-1.5 h-1.5 rounded-full bg-gold animate-pulse" />
                      Online — typically replies instantly
                    </div>
                  </div>
                </div>
                <button
                  onClick={reset}
                  className="text-[10px] tracking-[0.18em] uppercase text-paper/60 hover:text-gold transition-colors"
                  aria-label="Start over"
                >
                  Reset
                </button>
              </div>
            </header>

            {/* Messages */}
            <div
              ref={scrollRef}
              className="flex-1 overflow-y-auto px-5 py-6 space-y-5 bg-paper"
            >
              {messages.map((m) => (
                <Bubble key={m.id} message={m} onChip={(t) => send(t)} />
              ))}
              {typing && <TypingIndicator />}
            </div>

            {/* Composer */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                send(draft);
              }}
              className="border-t border-line-dark bg-paper px-3 py-3 flex items-center gap-2"
            >
              <input
                ref={inputRef}
                type="text"
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                placeholder="Ask the concierge…"
                className="flex-1 bg-transparent outline-none text-ink placeholder:text-ink/40 text-sm px-3 py-2"
                aria-label="Type your message"
              />
              <button
                type="submit"
                aria-label="Send"
                disabled={!draft.trim()}
                className="h-9 w-9 rounded-full bg-ink text-paper flex items-center justify-center disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gold transition-colors"
              >
                <Send size={14} />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Slow ping keyframes */}
      <style>{`
        @keyframes vt-ping-slow {
          0% { transform: scale(1); opacity: 0.7; }
          80% { transform: scale(1.55); opacity: 0; }
          100% { transform: scale(1.55); opacity: 0; }
        }
        .animate-ping-slow { animation: vt-ping-slow 2.4s cubic-bezier(0.2,0.8,0.2,1) infinite; }
        @media (prefers-reduced-motion: reduce) {
          .animate-ping-slow { animation: none; }
        }
      `}</style>
    </>
  );
}

/* ── Sub-components ────────────────────────────────────── */

function Bubble({
  message,
  onChip,
}: {
  message: Message;
  onChip: (t: string) => void;
}) {
  const isBot = message.role === "bot";
  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: [0.2, 0.8, 0.2, 1] }}
      className={isBot ? "max-w-[88%]" : "max-w-[85%] ml-auto"}
    >
      <div
        className={[
          "px-4 py-3 text-sm leading-relaxed rounded-sm",
          isBot
            ? "bg-[rgba(78,115,83,0.06)] text-ink border border-line-dark"
            : "bg-ink text-paper",
        ].join(" ")}
      >
        {message.text}
      </div>

      {isBot && message.actions && message.actions.length > 0 && (
        <div className="mt-3 flex flex-col gap-2">
          {message.actions.map((a, i) => (
            <ActionLink key={i} action={a} />
          ))}
        </div>
      )}

      {isBot && message.chips && message.chips.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-2">
          {message.chips.map((c) => (
            <button
              key={c}
              onClick={() => onChip(c)}
              className="px-3 h-8 rounded-full border border-ink/25 text-[11px] tracking-[0.06em] uppercase text-ink hover:border-gold hover:text-gold transition-colors"
            >
              {c}
            </button>
          ))}
        </div>
      )}
    </motion.div>
  );
}

function ActionLink({ action }: { action: Action }) {
  const cls =
    "group inline-flex items-center justify-between gap-2 w-full px-4 h-11 border border-ink/25 text-[12px] tracking-[0.08em] uppercase text-ink hover:bg-ink hover:text-paper transition-colors";
  const inner: ReactNode = (
    <>
      <span>{action.label}</span>
      <ArrowUpRight size={14} className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
    </>
  );
  if (action.external) {
    return (
      <a href={action.href} target="_blank" rel="noreferrer" className={cls}>
        {inner}
      </a>
    );
  }
  return (
    <Link to={action.href} className={cls}>
      {inner}
    </Link>
  );
}

function TypingIndicator() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="max-w-[60%]"
    >
      <div className="px-4 py-3 rounded-sm bg-[rgba(78,115,83,0.06)] border border-line-dark inline-flex items-center gap-1.5">
        <Dot delay={0} />
        <Dot delay={0.15} />
        <Dot delay={0.3} />
      </div>
    </motion.div>
  );
}

function Dot({ delay }: { delay: number }) {
  return (
    <motion.span
      className="w-1.5 h-1.5 rounded-full bg-ink/50"
      animate={{ y: [0, -3, 0], opacity: [0.4, 1, 0.4] }}
      transition={{ duration: 1, repeat: Infinity, delay, ease: "easeInOut" }}
    />
  );
}
