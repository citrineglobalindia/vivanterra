import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

const EXIT_EASE = [0.77, 0, 0.18, 1] as const;

/**
 * Page intro loader — counts 000 → 100 in giant Playfair, then slides up.
 * Locks scroll while mounted.
 */
export default function Loader() {
  const [count, setCount] = useState(0);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    document.body.style.overflow = "hidden";

    const start = performance.now();
    const dur = 1900;
    let raf = 0;

    function tick(now: number) {
      const t = Math.min(1, (now - start) / dur);
      // ease-out cubic
      const eased = 1 - Math.pow(1 - t, 3);
      setCount(Math.round(eased * 100));
      if (t < 1) raf = requestAnimationFrame(tick);
    }
    raf = requestAnimationFrame(tick);

    const hide = window.setTimeout(() => setVisible(false), 2400);
    const unlock = window.setTimeout(() => {
      document.body.style.overflow = "";
    }, 3600);

    return () => {
      cancelAnimationFrame(raf);
      window.clearTimeout(hide);
      window.clearTimeout(unlock);
      document.body.style.overflow = "";
    };
  }, []);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className="fixed inset-0 z-[10000] flex items-end justify-end bg-ink"
          initial={{ y: 0 }}
          exit={{ y: "-100%" }}
          transition={{ duration: 1.1, ease: EXIT_EASE }}
        >
          <div className="container-x max-w-page w-full pb-8 md:pb-14">
            <div className="flex items-end justify-between">
              <span className="eyebrow text-paper/60">Meridian Estates</span>
              <span
                className="font-display text-paper tabular-nums"
                style={{ fontSize: "clamp(120px, 22vw, 320px)", lineHeight: 0.85, fontWeight: 300 }}
              >
                {String(count).padStart(3, "0")}
              </span>
            </div>
            <div className="mt-6 hairline" />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
