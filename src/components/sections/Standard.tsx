import { useRef } from "react";
import {
  motion,
  useScroll,
  useTransform,
  type MotionValue,
} from "framer-motion";
import { Quote } from "lucide-react";

/**
 * The Vivanterra Standard — magazine-style philosophy section.
 *
 * Replaces the previous 200vh sticky-scroll word-by-word reveal with
 * a tighter, single-viewport composition: eyebrow rule, oversized
 * quote mark, scroll-cued accent words, attribution, hairline detail.
 */
const PARAGRAPH =
  "We build slowly, with patience, because we believe a residence should outlast its first owner. We choose our materials the way a tailor chooses cloth — by hand, by weight, by the way light moves across them at the end of the day. Everything else, in the end, is light.";

const ACCENT_WORDS = new Set(["patience,", "materials", "light."]);

export default function Standard() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 0.85", "end 0.4"],
  });

  const words = PARAGRAPH.split(" ");

  return (
    <section
      ref={ref}
      id="standard"
      className="bg-ink text-paper relative overflow-hidden py-24 md:py-32 lg:py-40"
    >
      {/* Drifting gold orb — smaller, calmer */}
      <motion.div
        aria-hidden="true"
        className="pointer-events-none absolute top-1/4 -left-1/3 w-[55vw] h-[55vw] rounded-full"
        style={{
          background:
            "radial-gradient(circle, rgba(196,165,115,0.16) 0%, rgba(196,165,115,0.04) 40%, rgba(14,14,16,0) 70%)",
          filter: "blur(60px)",
        }}
        animate={{ x: [0, 80, 0], y: [0, -30, 0] }}
        transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Subtle film grain */}
      <div
        aria-hidden
        className="absolute inset-0 opacity-[0.04] mix-blend-overlay pointer-events-none"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='200' height='200'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/></filter><rect width='100%' height='100%' filter='url(%23n)' opacity='0.7'/></svg>\")",
        }}
      />

      <div className="relative max-w-page container-x">
        {/* Eyebrow + rule */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-15% 0px" }}
          transition={{ duration: 0.7, ease: [0.2, 0.8, 0.2, 1] }}
          className="grid md:grid-cols-12 gap-6 items-center mb-12 md:mb-16"
        >
          <div className="md:col-span-3 flex items-center gap-4">
            <span className="font-display text-gold text-3xl md:text-4xl tabular-nums">
              02
            </span>
            <span className="h-px flex-1 bg-gold/40 max-w-[60px]" />
            <span className="eyebrow text-paper">The Standard</span>
          </div>
          <div className="hidden md:block md:col-span-9 h-px bg-paper/10" />
        </motion.div>

        {/* Quote composition */}
        <div className="grid lg:grid-cols-12 gap-8 lg:gap-16 items-start">
          {/* Big decorative quote mark + label */}
          <motion.div
            initial={{ opacity: 0, scale: 0.85 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: "-15% 0px" }}
            transition={{ duration: 1, ease: [0.2, 0.8, 0.2, 1] }}
            className="lg:col-span-2 flex lg:flex-col items-start gap-6"
          >
            <Quote
              size={72}
              strokeWidth={1.1}
              className="text-gold/55 -ml-1"
            />
            <div className="lg:mt-auto">
              <div className="eyebrow text-paper mb-1">Philosophy</div>
              <div className="font-display italic text-paper/70 text-sm">
                Est. 2009
              </div>
            </div>
          </motion.div>

          {/* The big quote with scroll-revealed words */}
          <div className="lg:col-span-10">
            <h2 className="sr-only">The Vivanterra Standard</h2>
            <p
              className="font-display text-paper/25"
              style={{
                fontSize: "clamp(26px, 3.4vw, 48px)",
                fontWeight: 300,
                lineHeight: 1.25,
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

            {/* Attribution row */}
            <motion.div
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-15% 0px" }}
              transition={{
                duration: 0.7,
                delay: 0.4,
                ease: [0.2, 0.8, 0.2, 1],
              }}
              className="mt-10 md:mt-14 flex items-center gap-5"
            >
              <span className="h-px w-12 bg-gold" />
              <div>
                <p className="font-display italic text-paper text-lg md:text-xl leading-tight">
                  Tej Singh
                </p>
                <p className="eyebrow text-paper text-[10px] mt-1">
                  Founder · Vivanterra
                </p>
              </div>
            </motion.div>
          </div>
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
  // Tighter band — words finish revealing earlier in the scroll than before.
  const start = 0.1 + (index / total) * 0.65;
  const end = start + 0.04;
  const opacity = useTransform(progress, [start, end], [0.15, 1]);

  return (
    <>
      <motion.span
        style={{
          opacity,
          color: accent ? "var(--gold)" : undefined,
          fontStyle: accent ? "italic" : undefined,
        }}
        className="inline"
      >
        {word}
      </motion.span>
      {index < total - 1 && " "}
    </>
  );
}
