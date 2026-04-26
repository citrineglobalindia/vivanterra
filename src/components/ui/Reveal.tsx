import { motion, useReducedMotion, type Variants } from "framer-motion";
import { type ReactNode } from "react";

interface RevealProps {
  children: ReactNode;
  delay?: number;
  duration?: number;
  y?: number;
  className?: string;
  as?: "div" | "section" | "p" | "li" | "article" | "header" | "footer";
}

const EASE = [0.2, 0.8, 0.2, 1] as const;

/**
 * Wraps children in a one-shot scroll-triggered reveal.
 * Respects prefers-reduced-motion (opacity-only).
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

  const variants: Variants = {
    hidden: { opacity: 0, y: reduced ? 0 : y },
    show: {
      opacity: 1,
      y: 0,
      transition: { duration, delay, ease: EASE },
    },
  };

  void as;

  return (
    <motion.div
      className={className}
      variants={variants}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "-10% 0px" }}
    >
      {children}
    </motion.div>
  );
}
