import { useEffect, useRef, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, EffectFade, Pagination } from "swiper/modules";
import type { Swiper as SwiperClass } from "swiper";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import "swiper/css";
import "swiper/css/effect-fade";
import SplitText from "../ui/SplitText";

/**
 * Top-of-page editable slide list. Replace `video` URLs with your real files.
 * Free Pexels architectural placeholder videos used as defaults.
 */
const SLIDES = [
  {
    eyebrow: "01 / Lifestyle Residences",
    headline: "A new vocabulary\nof living\nshaped by\nlight & material.",
    video: "https://videos.pexels.com/video-files/3773486/3773486-uhd_2560_1440_30fps.mp4",
  },
  {
    eyebrow: "02 / Waterfront Architecture",
    headline: "Quiet luxury\ndrawn from\nthe horizon\nof the gulf.",
    video: "https://videos.pexels.com/video-files/2169880/2169880-uhd_2560_1440_30fps.mp4",
  },
  {
    eyebrow: "03 / Private Sanctuary",
    headline: "Spaces composed\nwith patience,\nrestraint and\nrare materials.",
    video: "https://videos.pexels.com/video-files/4763824/4763824-uhd_2560_1440_24fps.mp4",
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
    <section id="top" className="relative h-[100svh] w-full overflow-hidden bg-ink text-paper">
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
            <div className="relative h-full w-full">
              <video
                className="absolute inset-0 h-full w-full object-cover"
                src={s.video}
                playsInline
                muted
                loop
                autoPlay
                preload="metadata"
                poster=""
              />
              <div
                className="absolute inset-0"
                style={{ background: "linear-gradient(to top, rgba(14,14,16,0.75) 0%, rgba(14,14,16,0.15) 50%, rgba(14,14,16,0.45) 100%)" }}
                aria-hidden="true"
              />
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

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
            <div className="md:col-span-9">
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
            <div className="md:col-span-3 md:text-right">
              <a href="#residences" className="btn btn-light">
                Discover the residence
                <ArrowUpRight className="btn-arrow" size={16} />
              </a>
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
        h1.font-display { font-size: clamp(56px, 9vw, 140px); font-weight: 300; line-height: 0.95; }
        @media (max-width: 640px) { h1.font-display { font-size: clamp(40px, 11vw, 64px); } }
      `}</style>
    </section>
  );
}
