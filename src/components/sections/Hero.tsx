import { useEffect, useRef, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, EffectFade, Pagination } from "swiper/modules";
import type { Swiper as SwiperClass } from "swiper";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import "swiper/css";
import "swiper/css/effect-fade";
import SplitText from "../ui/SplitText";
import Magnetic from "../ui/Magnetic";

/**
 * Top-of-page editable slide list. Replace `video` URLs with your real files.
 * Free Pexels architectural placeholder videos used as defaults.
 */
const SLIDES = [
  {
    eyebrow: "01 / Lifestyle Residences",
    headline: "A new vocabulary\nof living\nshaped by\nlight & material.",
    video: "https://videos.pexels.com/video-files/3773486/3773486-hd_1920_1080_30fps.mp4",
  },
  {
    eyebrow: "02 / Waterfront Architecture",
    headline: "Quiet luxury\ndrawn from\nthe horizon\nof the gulf.",
    video: "https://videos.pexels.com/video-files/2169880/2169880-hd_1920_1080_30fps.mp4",
  },
  {
    eyebrow: "03 / Private Sanctuary",
    headline: "Spaces composed\nwith patience,\nrestraint and\nrare materials.",
    video: "https://videos.pexels.com/video-files/4763824/4763824-hd_1920_1080_24fps.mp4",
  },
];

const SLIDE_MS = 6000;

export default function Hero() {
  const [active, setActive] = useState(0);
  const [progress, setProgress] = useState(0);
  const swiperRef = useRef<SwiperClass | null>(null);
  const reduced = useReducedMotion();

  useEffect(() => {
    const start = performance.now();
    let raf = 0;
    function tick(now: number) {
      const t = Math.min(1, (now - start) / SLIDE_MS);
      setProgress(t);
      if (t < 1) raf = requestAnimationFrame(tick);
    }
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [active]);

  return (
    <section
      id="top"
      className="relative h-[100svh] w-full overflow-hidden bg-ink text-paper isolate z-10"
    >
      <Swiper
        modules={[Autoplay, EffectFade, Pagination]}
        effect="fade"
        fadeEffect={{ crossFade: true }}
        loop
        autoplay={{ delay: SLIDE_MS, disableOnInteraction: false }}
        speed={1100}
        onSwiper={(s) => (swiperRef.current = s)}
        onSlideChange={(s) => setActive(s.realIndex)}
        className="absolute inset-0"
      >
        {SLIDES.map((s, i) => (
          <SwiperSlide key={i}>
            <div className="relative h-full w-full bg-ink">
              <video
                className="absolute inset-0 h-full w-full object-cover opacity-0 transition-opacity duration-700"
                src={s.video}
                playsInline
                muted
                loop
                autoPlay
                preload="auto"
                onLoadedData={(e) =>
                  (e.currentTarget.style.opacity = "1")
                }
                onCanPlay={(e) => {
                  e.currentTarget.style.opacity = "1";
                  void e.currentTarget.play().catch(() => {});
                }}
              />
              <div
                className="absolute inset-0"
                style={{ background: "linear-gradient(to top, rgba(14,14,16,0.85) 0%, rgba(14,14,16,0.15) 45%, rgba(14,14,16,0.55) 100%)" }}
                aria-hidden="true"
              />
              {/* Gold ambient glow */}
              <motion.div
                aria-hidden="true"
                className="absolute -bottom-1/3 left-1/2 -translate-x-1/2 w-[120vw] h-[80vh] pointer-events-none"
                style={{
                  background:
                    "radial-gradient(ellipse at center, rgba(196,165,115,0.18) 0%, rgba(196,165,115,0.06) 35%, rgba(14,14,16,0) 70%)",
                  filter: "blur(40px)",
                }}
                initial={{ opacity: 0 }}
                animate={{ opacity: [0.6, 1, 0.7] }}
                transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
              />
              {/* Subtle film grain via SVG noise */}
              <div
                aria-hidden="true"
                className="absolute inset-0 opacity-[0.08] mix-blend-overlay pointer-events-none"
                style={{
                  backgroundImage:
                    "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='200' height='200'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/></filter><rect width='100%' height='100%' filter='url(%23n)' opacity='0.7'/></svg>\")",
                }}
              />
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      {/* Animated corner brackets */}
      <CornerMarks />

      {/* Vertical scroll indicator (top-right) */}
      <div
        className="absolute right-6 md:right-12 top-1/2 -translate-y-1/2 z-10 hidden sm:flex flex-col items-center gap-4"
        aria-hidden="true"
      >
        <span className="eyebrow text-paper/70" style={{ writingMode: "vertical-rl" }}>Scroll</span>
        <div className="relative h-24 w-px bg-paper/20 overflow-hidden">
          {!reduced && (
            <span className="absolute inset-x-0 h-1/2 bg-paper animate-scroll-indicator" />
          )}
        </div>
      </div>

      {/* Content */}
      <div className="absolute inset-0 z-10 flex flex-col justify-end pb-16 md:pb-24">
        <div className="max-w-page container-x">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-end">
            <div className="md:col-span-10 min-w-0">
              <div className="eyebrow text-paper/80 mb-6">{SLIDES[active].eyebrow}</div>
              <SplitText
                as="h1"
                key={active}
                triggerKey={active}
                text={SLIDES[active].headline}
                by="char"
                className="font-display text-paper whitespace-pre-line"
                duration={1}
                stagger={0.018}
                once={false}
              />
            </div>
            <div className="md:col-span-2 md:text-right">
              <Magnetic className="inline-block" strength={0.3}>
                <a href="#residences" className="btn btn-light">
                  Discover the residence
                  <ArrowUpRight className="btn-arrow" size={16} />
                </a>
              </Magnetic>
            </div>
          </div>

          {/* Pagination + progress */}
          <div className="mt-10 md:mt-14 flex items-center justify-between gap-8">
            <div className="flex items-center gap-3">
              {SLIDES.map((_, i) => (
                <button
                  key={i}
                  aria-label={`Go to slide ${i + 1}`}
                  onClick={() => swiperRef.current?.slideToLoop(i)}
                  className="h-1.5 w-1.5 rounded-full transition-all duration-300"
                  style={{
                    backgroundColor: i === active ? "var(--paper)" : "rgba(246,243,238,0.35)",
                    transform: i === active ? "scale(1.3)" : "scale(1)",
                  }}
                />
              ))}
            </div>
            <div className="flex-1 max-w-md ml-6">
              <div className="relative h-px w-full bg-paper/20">
                <span
                  className="absolute inset-y-0 left-0 bg-paper"
                  style={{ width: `${progress * 100}%`, transition: "width 0.05s linear" }}
                />
              </div>
            </div>
            <div className="text-xs tabular-nums text-paper/70 font-medium">
              {String(active + 1).padStart(2, "0")} <span className="text-paper/40">/ {String(SLIDES.length).padStart(2, "0")}</span>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        h1.font-display { font-size: clamp(38px, 6vw, 96px); font-weight: 300; line-height: 1.0; max-width: 100%; overflow-wrap: break-word; }
        @media (max-width: 640px) { h1.font-display { font-size: clamp(32px, 9vw, 52px); } }
      `}</style>
    </section>
  );
}

function CornerMarks() {
  const common = {
    initial: { opacity: 0, scale: 0.6 },
    animate: { opacity: 1, scale: 1 },
    transition: { delay: 2.4, duration: 1.2, ease: [0.2, 0.8, 0.2, 1] as const },
  };
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 z-10">
      {/* TL */}
      <motion.div {...common} className="absolute top-24 left-6 md:top-32 md:left-12 w-8 h-8 border-l border-t border-paper/40" />
      {/* TR */}
      <motion.div {...common} className="absolute top-24 right-6 md:top-32 md:right-12 w-8 h-8 border-r border-t border-paper/40" />
      {/* BL */}
      <motion.div {...common} className="absolute bottom-6 left-6 md:bottom-12 md:left-12 w-8 h-8 border-l border-b border-paper/40" />
      {/* BR */}
      <motion.div {...common} className="absolute bottom-6 right-6 md:bottom-12 md:right-12 w-8 h-8 border-r border-b border-paper/40" />
    </div>
  );
}
