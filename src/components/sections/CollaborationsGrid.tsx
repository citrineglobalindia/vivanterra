import { useRef, useEffect, useState } from "react";
import { motion, useScroll, useTransform, useSpring, MotionValue } from "framer-motion";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, FreeMode } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import Reveal from "../ui/Reveal";

/** Editable list — swap one line per partner. Replace logo paths with real SVGs in /public/logos/. */
type Partner = { name: string; alt: string; image: string; logo: string };

const PARTNERS: Partner[] = [
  { name: "Partner 01", alt: "Architectural interior", image: "https://images.unsplash.com/photo-1505693414120-0d0788ba2c1b?auto=format&fit=crop&w=800&q=70", logo: "/logos/partner-01.svg" },
  { name: "Partner 02", alt: "Marble facade",          image: "https://images.unsplash.com/photo-1505691938895-1758d7feb511?auto=format&fit=crop&w=800&q=70", logo: "/logos/partner-02.svg" },
  { name: "Partner 03", alt: "Spa interior",           image: "https://images.unsplash.com/photo-1542317854-e8a87a96ed02?auto=format&fit=crop&w=800&q=70",   logo: "/logos/partner-03.svg" },
  { name: "Partner 04", alt: "Lobby chandelier",       image: "https://images.unsplash.com/photo-1551918120-9739cb430c6d?auto=format&fit=crop&w=800&q=70",   logo: "/logos/partner-04.svg" },
  { name: "Partner 05", alt: "Suite at dusk",          image: "https://images.unsplash.com/photo-1455587734955-081b22074882?auto=format&fit=crop&w=800&q=70", logo: "/logos/partner-05.svg" },
  { name: "Partner 06", alt: "Resort pool",            image: "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&w=800&q=70", logo: "/logos/partner-06.svg" },
  { name: "Partner 07", alt: "Penthouse view",         image: "https://images.unsplash.com/photo-1519642918688-7e43b19245d8?auto=format&fit=crop&w=800&q=70", logo: "/logos/partner-07.svg" },
  { name: "Partner 08", alt: "Beach pavilion",         image: "https://images.unsplash.com/photo-1540541338287-41700207dee6?auto=format&fit=crop&w=800&q=70", logo: "/logos/partner-08.svg" },
];

function rangeFor(i: number): [number, number] {
  const seed = (i * 9301 + 49297) % 233280;
  const r = seed / 233280;
  const speed = 0.35 + r * 0.45;
  const sign = i % 2 === 0 ? -1 : -1;
  const end = sign * speed * 40;
  return [0, end];
}

function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(mq.matches);
    const handler = (e: MediaQueryListEvent) => setReduced(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);
  return reduced;
}

function Card({ p }: { p: Partner }) {
  return (
    <div className="relative aspect-[3/4] rounded-md overflow-hidden shadow-[0_25px_60px_-20px_rgba(0,0,0,0.55)] group">
      <img
        src={p.image}
        alt={p.alt}
        loading="lazy"
        className="absolute inset-0 w-full h-full object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-[1.04]"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/15 to-black/30" />
      <img
        src={p.logo}
        alt={`${p.name} logo`}
        className="absolute bottom-6 left-1/2 -translate-x-1/2 w-[100px] h-[80px] object-contain pointer-events-none"
        style={{ filter: "invert(1) brightness(2)" }}
      />
    </div>
  );
}

function ParallaxCard({
  p,
  i,
  scrollYProgress,
}: {
  p: Partner;
  i: number;
  scrollYProgress: MotionValue<number>;
}) {
  const raw = useTransform(scrollYProgress, [0, 1], rangeFor(i));
  const smooth = useSpring(raw, { damping: 28, stiffness: 120, mass: 0.4 });
  const yPct = useTransform(smooth, (v: number) => `${v}%`);

  return (
    <motion.button
      type="button"
      className="block w-full text-left will-change-transform"
      style={{ y: yPct, transform: "translateZ(0)" }}
      data-cursor="hover"
      aria-label={p.name}
    >
      <Card p={p} />
    </motion.button>
  );
}

export default function CollaborationsGrid() {
  const sectionRef = useRef<HTMLElement>(null);
  const reduced = usePrefersReducedMotion();

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  return (
    <section
      ref={sectionRef}
      className="bg-[var(--ink)] text-[var(--paper)] py-[100px] md:py-[140px] px-6 md:px-[48px] overflow-hidden"
    >
      <style>{`
        .swiper-pagination-progressbar-fill { background: var(--gold) !important; }
        .swiper-pagination-progressbar { background: rgba(255,255,255,.15) !important; height: 1px !important; }
        .collab-h2 .gold-italic { color: var(--gold); font-style: italic; }
      `}</style>

      {/* Top row */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-8 md:gap-12 max-w-[1600px] mx-auto">
        <div className="md:col-span-2">
          <Reveal>
            <div className="text-[11px] uppercase tracking-[0.18em] text-[var(--paper)]/60">
              Curated Collaborations
            </div>
          </Reveal>
        </div>
        <div className="md:col-span-3">
          <Reveal delay={0.1}>
            <h2
              className="collab-h2 font-display"
              style={{
                fontWeight: 300,
                fontSize: "clamp(36px, 5vw, 72px)",
                letterSpacing: "-0.02em",
                lineHeight: 1.05,
              }}
            >
              We work with <span className="gold-italic">houses</span> that share our standards.
            </h2>
          </Reveal>
        </div>
      </div>

      {/* Spacer */}
      <div className="h-[60px] md:h-[80px]" />

      {/* Desktop grid */}
      <div className="hidden md:block max-w-[1600px] mx-auto">
        <div className="grid grid-cols-4 gap-8">
          {PARTNERS.map((p, i) =>
            reduced ? (
              <button key={p.name} type="button" className="block w-full text-left" aria-label={p.name}>
                <Card p={p} />
              </button>
            ) : (
              <ParallaxCard key={p.name} p={p} i={i} scrollYProgress={scrollYProgress} />
            )
          )}
        </div>
      </div>

      {/* Mobile carousel */}
      <div className="md:hidden -mx-6">
        <Swiper
          modules={[Pagination, FreeMode]}
          slidesPerView={1.15}
          spaceBetween={10}
          freeMode
          grabCursor
          pagination={{ type: "progressbar" }}
          className="!pl-6 !pb-10"
        >
          {PARTNERS.map((p) => (
            <SwiperSlide key={p.name} className="!w-[78vw]">
              <Card p={p} />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
}
