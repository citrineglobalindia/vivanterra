import { motion, useReducedMotion } from "framer-motion";
import { useMemo } from "react";

interface SplitTextProps {
  text: string;
  by?: "word" | "char";
  className?: string;
  delay?: number;
  stagger?: number;
  duration?: number;
  as?: "h1" | "h2" | "h3" | "h4" | "p" | "span" | "div";
  /** Replay animation when this key changes (e.g. carousel slide index). */
  triggerKey?: string | number;
  once?: boolean;
}

const EASE = [0.2, 0.8, 0.2, 1] as const;

/**
 * Splits text into words or chars and animates each piece up from below
 * inside an overflow:hidden parent.
 */
export default function SplitText({
  text,
  by = "word",
  className,
  delay = 0,
  stagger,
  duration = 0.9,
  as = "h2",
  triggerKey,
  once = true,
}: SplitTextProps) {
  const reduced = useReducedMotion();
  const Tag = motion[as] as typeof motion.h2;

  const pieces = useMemo(() => {
    if (by === "word") return text.split(/(\s+)/); // keep whitespace
    return Array.from(text);
  }, [text, by]);

  const effectiveStagger = stagger ?? (by === "word" ? 0.04 : 0.025);

  return (
    <Tag
      key={triggerKey}
      className={className}
      aria-label={text}
      initial="hidden"
      whileInView={once ? "show" : undefined}
      animate={!once || triggerKey !== undefined ? "show" : undefined}
      viewport={{ once: true, margin: "-10% 0px" }}
      transition={{ staggerChildren: reduced ? 0 : effectiveStagger, delayChildren: delay }}
      variants={{ hidden: {}, show: {} }}
    >
      {pieces.map((piece, i) => {
        if (/^\s+$/.test(piece)) {
          return <span key={i} aria-hidden="true">{piece}</span>;
        }
        return (
          <span key={i} className="split-line" aria-hidden="true">
            <motion.span
              className="split-piece"
              variants={{
                hidden: { y: reduced ? "0%" : "110%" },
                show: { y: "0%", transition: { duration, ease: EASE } },
              }}
            >
              {piece}
            </motion.span>
          </span>
        );
      })}
    </Tag>
  );
}
