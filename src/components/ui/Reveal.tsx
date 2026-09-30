import { motion, useReducedMotion, type Variants } from "framer-motion";
import { useEffect, useRef, useState, type ReactNode } from "react";

interface RevealProps {
  children: ReactNode;
  delay?: number;
  duration?: number;
  y?: number;
  className?: string;
  as?: "div" | "section" | "p" | "li" | "article" | "header" | "footer";
}

const EASE = [0.2, 0.8, 0.2, 1] as const;

/** How long to wait before deciding the reveal is never going to fire. */
const FALLBACK_MS = 2000;

/**
 * Wraps children in a one-shot scroll-triggered reveal.
 * Respects prefers-reduced-motion (opacity-only).
 *
 * Content starts at opacity 0, so anything that stops the animation running
 * would leave the page blank. Two guards prevent that: a tab that loads in the
 * background starts visible, and anything still hidden but on screen after a
 * short grace period is shown outright.
 */
export default function Reveal({
  children,
  delay = 0,
  duration = 0.8,
  y = 24,
  className,
  as = "div",
}: RevealProps) {
  const reduced = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);

  // Loaded while hidden => no animations will run; don't hide the content.
  const [armed] = useState(
    () => typeof document === "undefined" || document.visibilityState === "visible",
  );
  const [forced, setForced] = useState(false);
  const seen = useRef(false);

  useEffect(() => {
    if (!armed) return;
    const t = window.setTimeout(() => {
      if (seen.current) return;
      const el = ref.current;
      if (!el) return;
      const r = el.getBoundingClientRect();
      // On screen but still not revealed — show it rather than leave a blank.
      if (r.top < window.innerHeight && r.bottom > 0) setForced(true);
    }, FALLBACK_MS);
    return () => window.clearTimeout(t);
  }, [armed]);

  const variants: Variants = {
    hidden: { opacity: 0, y: reduced ? 0 : y },
    show: {
      opacity: 1,
      y: 0,
      transition: { duration, delay, ease: EASE },
    },
  };

  void as;

  const settled = !armed || forced;

  return (
    <motion.div
      ref={ref}
      className={className}
      variants={variants}
      initial={settled ? "show" : "hidden"}
      animate={settled ? "show" : undefined}
      whileInView={settled ? undefined : "show"}
      onViewportEnter={() => {
        seen.current = true;
      }}
      viewport={{ once: true, margin: "-10% 0px" }}
    >
      {children}
    </motion.div>
  );
}
