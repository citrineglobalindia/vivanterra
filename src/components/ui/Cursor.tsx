import { useEffect, useRef, useState } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

/**
 * Custom cursor: a 10px ink dot with mix-blend-difference + a 40px lagged ring.
 * Hidden on touch devices (handled via CSS `@media (hover: none)`).
 */
export default function Cursor() {
  const [enabled, setEnabled] = useState(false);
  const [hovering, setHovering] = useState(false);
  const dotX = useMotionValue(-100);
  const dotY = useMotionValue(-100);
  const ringX = useSpring(dotX, { damping: 30, stiffness: 200, mass: 0.6 });
  const ringY = useSpring(dotY, { damping: 30, stiffness: 200, mass: 0.6 });
  const last = useRef({ x: -100, y: -100 });

  useEffect(() => {
    const isFine = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    if (!isFine) return;
    setEnabled(true);
    document.documentElement.classList.add("has-custom-cursor");

    function move(e: MouseEvent) {
      last.current = { x: e.clientX, y: e.clientY };
      dotX.set(e.clientX);
      dotY.set(e.clientY);
    }
    function over(e: MouseEvent) {
      const t = e.target as HTMLElement | null;
      if (!t) return;
      const interactive = t.closest("a, button, input, textarea, [data-cursor='hover']");
      setHovering(!!interactive);
    }

    window.addEventListener("mousemove", move, { passive: true });
    window.addEventListener("mouseover", over);
    return () => {
      window.removeEventListener("mousemove", move);
      window.removeEventListener("mouseover", over);
      document.documentElement.classList.remove("has-custom-cursor");
    };
  }, [dotX, dotY]);

  if (!enabled) return null;

  return (
    <div className="pointer-events-none fixed inset-0 z-[9999]" aria-hidden="true">
      <motion.div
        className="absolute h-[10px] w-[10px] rounded-full bg-paper"
        style={{
          x: dotX,
          y: dotY,
          translateX: "-50%",
          translateY: "-50%",
          mixBlendMode: "difference",
        }}
      />
      <motion.div
        className="absolute rounded-full border border-paper"
        style={{
          x: ringX,
          y: ringY,
          width: 40,
          height: 40,
          translateX: "-50%",
          translateY: "-50%",
          mixBlendMode: "difference",
          scale: hovering ? 1.4 : 1,
          transition: "scale 0.3s cubic-bezier(0.2,0.8,0.2,1)",
        }}
      />
    </div>
  );
}
