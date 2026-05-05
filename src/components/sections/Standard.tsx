import { useRef } from "react";
import { motion, useScroll, useTransform, type MotionValue } from "framer-motion";

const PARAGRAPH =
  "We build slowly, with patience, because we believe a residence should outlast its first owner. We choose our materials the way a tailor chooses cloth — by hand, by weight, by the way light moves across them at the end of the day. Everything else, in the end, is light.";

const ACCENT_WORDS = new Set(["patience,", "materials", "light."]);

export default function Standard() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const words = PARAGRAPH.split(" ");

  return (
    <section ref={ref} id="standard" className="bg-ink text-paper relative overflow-hidden" style={{ height: "200vh" }}>
      {/* Drifting gold orb */}
      <motion.div
        aria-hidden="true"
        className="pointer-events-none absolute top-1/4 -left-1/4 w-[60vw] h-[60vw] rounded-full"
        style={{
          background:
            "radial-gradient(circle, rgba(196,165,115,0.18) 0%, rgba(196,165,115,0.05) 40%, rgba(14,14,16,0) 70%)",
          filter: "blur(60px)",
        }}
        animate={{ x: [0, 120, 0], y: [0, -40, 0] }}
        transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
      />
      <div className="sticky top-0 h-screen flex items-center">
        <div className="max-w-page container-x w-full">
          <div className="eyebrow text-paper/60 mb-10">The Vivanterra Standard</div>
          <p
            className="font-display text-paper/30 max-w-[1100px]"
            style={{
              fontSize: "clamp(28px, 4vw, 56px)",
              fontWeight: 300,
              lineHeight: 1.2,
              letterSpacing: "-0.02em",
            }}
          >
            {words.map((w, i) => (
              <Word
                key={i}
                word={w}
                index={i}
                total={words.length}
                progress={scrollYProgress}
                accent={ACCENT_WORDS.has(w)}
              />
            ))}
          </p>
        </div>
      </div>
    </section>
  );
}

function Word({
  word,
  index,
  total,
  progress,
  accent,
}: {
  word: string;
  index: number;
  total: number;
  progress: MotionValue<number>;
  accent: boolean;
}) {
  // Reveal happens between scroll progress 0.2 and 0.75
  const start = 0.2 + (index / total) * 0.55;
  const end = start + 0.05;
  const opacity = useTransform(progress, [start, end], [0.15, 1]);

  return (
    <>
      <motion.span
        style={{ opacity, color: accent ? "var(--gold)" : undefined, fontStyle: accent ? "italic" : undefined }}
        className="inline"
      >
        {word}
      </motion.span>
      {index < total - 1 && " "}
    </>
  );
}
