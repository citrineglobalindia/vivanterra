import { motion } from "framer-motion";
import { type ReactNode } from "react";

interface MarqueeProps {
  children: ReactNode;
  /** Loop duration in seconds. */
  speed?: number;
  className?: string;
  reverse?: boolean;
}

/**
 * Infinite horizontal marquee. Children should be rendered TWICE by the caller
 * is unnecessary — this component duplicates them internally to achieve the seamless loop.
 */
export default function Marquee({
  children,
  speed = 30,
  className,
  reverse = false,
}: MarqueeProps) {
  return (
    <div
      className={`overflow-hidden ${className ?? ""}`}
      aria-hidden="true"
    >
      <motion.div
        className="flex w-max"
        animate={{ x: reverse ? ["-50%", "0%"] : ["0%", "-50%"] }}
        transition={{ duration: speed, ease: "linear", repeat: Infinity }}
      >
        <div className="flex shrink-0">{children}</div>
        <div className="flex shrink-0">{children}</div>
      </motion.div>
    </div>
  );
}
