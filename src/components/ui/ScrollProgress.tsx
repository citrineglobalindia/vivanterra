import { motion, useScroll, useSpring } from "framer-motion";

/**
 * Top-edge gold scroll-progress hairline. Spring-smoothed.
 * Sits above page content but below loaders/popups.
 */
export default function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 140,
    damping: 28,
    mass: 0.4,
  });

  return (
    <motion.div
      aria-hidden
      className="fixed left-0 right-0 top-0 z-[140] h-[2px] bg-gold origin-left pointer-events-none"
      style={{ scaleX }}
    />
  );
}
