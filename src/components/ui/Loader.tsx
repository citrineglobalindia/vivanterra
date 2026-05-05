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
    const dur = 2200;
    let raf = 0;

    function tick(now: number) {
      const t = Math.min(1, (now - start) / dur);
      const eased = 1 - Math.pow(1 - t, 3);
      setCount(Math.round(eased * 100));
      if (t < 1) raf = requestAnimationFrame(tick);
    }
    raf = requestAnimationFrame(tick);

    const hide = window.setTimeout(() => setVisible(false), 2700);
    const unlock = window.setTimeout(() => {
      document.body.style.overflow = "";
    }, 3900);

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
          className="fixed inset-0 z-[10000] bg-ink text-paper flex flex-col"
          initial={{ y: 0 }}
          exit={{ y: "-100%" }}
          transition={{ duration: 1.1, ease: EXIT_EASE }}
        >
          {/* Subtle gold ambient glow */}
          <div
            aria-hidden
            className="absolute inset-0 pointer-events-none"
            style={{
              background:
                "radial-gradient(ellipse at center bottom, rgba(196,169,106,0.10) 0%, rgba(196,169,106,0.04) 35%, rgba(0,0,0,0) 70%)",
              filter: "blur(40px)",
            }}
          />

          {/* Top mark + eyebrow */}
          <header className="container-x max-w-page w-full pt-8 md:pt-12 flex items-center justify-between relative">
            <motion.div
              className="flex items-baseline gap-3"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.1, ease: [0.2, 0.8, 0.2, 1] }}
            >
              <span className="font-display text-paper text-2xl md:text-3xl font-light tracking-[-0.02em]">
                Vivanterra
              </span>
              <span className="eyebrow text-paper/60">Real Estate</span>
            </motion.div>
            <motion.span
              className="eyebrow text-paper/50"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.7, delay: 0.4 }}
            >
              Loading the studio
            </motion.span>
          </header>

          <div className="flex-1" />

          {/* Counter + brand line */}
          <div className="container-x max-w-page w-full pb-8 md:pb-14 relative">
            <div className="flex items-end justify-between gap-6">
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2, ease: [0.2, 0.8, 0.2, 1] }}
                className="max-w-md"
              >
                <span className="text-[11px] tracking-[0.22em] text-gold tabular-nums">
                  EST. BENGALURU
                </span>
                <p className="mt-3 font-display text-paper/85 italic font-light text-xl md:text-2xl leading-snug">
                  Composing residences with patience, restraint and rare materials.
                </p>
              </motion.div>

              <span
                className="font-display text-paper tabular-nums leading-[0.85] text-right"
                style={{
                  fontSize: "clamp(96px, 18vw, 280px)",
                  fontWeight: 300,
                }}
              >
                {String(count).padStart(3, "0")}
              </span>
            </div>

            {/* Gold progress hairline */}
            <div className="mt-6 relative h-px w-full bg-paper/20 overflow-hidden">
              <motion.span
                className="absolute inset-y-0 left-0 bg-gold"
                style={{ width: `${count}%` }}
                transition={{ ease: "linear" }}
              />
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
