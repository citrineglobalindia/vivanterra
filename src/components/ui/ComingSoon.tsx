import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Instagram, Mail, MessageCircle, Phone } from "lucide-react";

/**
 * Pre-launch splash with a live countdown to the launch instant.
 * Auto-reveals the real site (handled by LaunchGate) when the timer ends.
 */
export default function ComingSoon({ target }: { target: number }) {
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);

  const remaining = Math.max(0, target - now);
  const { hh, mm, ss } = useMemo(() => {
    const totalSec = Math.floor(remaining / 1000);
    return {
      hh: String(Math.floor(totalSec / 3600)).padStart(2, "0"),
      mm: String(Math.floor((totalSec % 3600) / 60)).padStart(2, "0"),
      ss: String(totalSec % 60).padStart(2, "0"),
    };
  }, [remaining]);

  const launchLabel = useMemo(
    () =>
      new Date(target).toLocaleString("en-IN", {
        weekday: "long",
        day: "numeric",
        month: "long",
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
        timeZone: "Asia/Kolkata",
      }),
    [target],
  );

  return (
    <main className="relative min-h-[100svh] bg-ink text-paper flex flex-col items-center justify-center overflow-hidden px-6">
      {/* Ambient gold glow */}
      <motion.div
        aria-hidden
        className="pointer-events-none absolute -top-1/4 left-1/2 -translate-x-1/2 w-[80vw] h-[80vw] rounded-full"
        style={{
          background:
            "radial-gradient(circle, rgba(196,169,106,0.18) 0%, rgba(196,169,106,0.04) 40%, rgba(14,14,16,0) 70%)",
          filter: "blur(60px)",
        }}
        animate={{ opacity: [0.7, 1, 0.7] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
      />
      {/* Film grain */}
      <div
        aria-hidden
        className="absolute inset-0 opacity-[0.05] mix-blend-overlay pointer-events-none"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='200' height='200'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/></filter><rect width='100%' height='100%' filter='url(%23n)' opacity='0.7'/></svg>\")",
        }}
      />

      <div className="relative w-full max-w-3xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.2, 0.8, 0.2, 1] }}
        >
          {/* Wordmark */}
          <h1
            className="font-display text-paper select-none"
            style={{
              fontSize: "clamp(40px, 9vw, 96px)",
              fontWeight: 300,
              letterSpacing: "-0.03em",
              lineHeight: 1,
            }}
          >
            VIVANTERRA
          </h1>
          <div className="mt-4 flex items-center justify-center gap-3">
            <span className="h-px w-8 bg-gold" />
            <span className="eyebrow text-gold">
              Wellness-first real estate · Bengaluru
            </span>
            <span className="h-px w-8 bg-gold" />
          </div>
        </motion.div>

        <motion.p
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.15, ease: [0.2, 0.8, 0.2, 1] }}
          className="mt-10 font-display italic text-paper/85"
          style={{ fontSize: "clamp(18px, 2.4vw, 26px)", lineHeight: 1.4 }}
        >
          A new vocabulary of living — arriving today.
        </motion.p>

        {/* Countdown */}
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3, ease: [0.2, 0.8, 0.2, 1] }}
          className="mt-12 flex items-start justify-center gap-4 md:gap-8"
        >
          <TimeCell value={hh} label="Hours" />
          <Colon />
          <TimeCell value={mm} label="Minutes" />
          <Colon />
          <TimeCell value={ss} label="Seconds" />
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="mt-10 eyebrow text-gold"
        >
          Launching {launchLabel} IST
        </motion.p>

        {/* Contact */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.65 }}
          className="mt-12 flex items-center justify-center gap-5"
        >
          <Social href="mailto:hello@vivanterra.in" label="Email"><Mail size={16} /></Social>
          <Social href="tel:+918867589797" label="Call"><Phone size={16} /></Social>
          <Social href="https://wa.me/918867589797" label="WhatsApp" external><MessageCircle size={16} /></Social>
          <Social href="https://www.instagram.com/" label="Instagram" external><Instagram size={16} /></Social>
        </motion.div>
      </div>
    </main>
  );
}

function TimeCell({ value, label }: { value: string; label: string }) {
  return (
    <div className="flex flex-col items-center">
      <div
        className="font-display text-paper tabular-nums"
        style={{
          fontSize: "clamp(44px, 10vw, 96px)",
          fontWeight: 300,
          letterSpacing: "-0.02em",
          lineHeight: 1,
        }}
      >
        {value}
      </div>
      <div className="eyebrow text-paper mt-3 text-[11px]">{label}</div>
    </div>
  );
}

function Colon() {
  return (
    <div
      className="font-display text-gold/70"
      style={{ fontSize: "clamp(34px, 7vw, 72px)", fontWeight: 300, lineHeight: 1 }}
    >
      :
    </div>
  );
}

function Social({
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
  const props = external ? { target: "_blank", rel: "noreferrer" } : {};
  return (
    <a
      href={href}
      aria-label={label}
      {...props}
      className="w-11 h-11 rounded-full border border-paper/25 flex items-center justify-center text-paper hover:bg-gold hover:text-ink hover:border-gold transition-colors"
    >
      {children}
    </a>
  );
}
