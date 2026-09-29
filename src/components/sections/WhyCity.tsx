import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useScroll, useTransform, useReducedMotion } from "framer-motion";
import Reveal from "../ui/Reveal";
import SplitText from "../ui/SplitText";

const PILLARS = [
  {
    label: "Climate",
    text: "A temperate plateau. Mild light, gentle monsoons and breeze-fed evenings shape every courtyard, terrace and wood-screened facade we draw.",
  },
  {
    label: "Connectivity",
    text: "A two-hour flight from any major south-Indian city, four from the Gulf, eight from London. A quiet, patient capital with global reach.",
  },
  {
    label: "Culture",
    text: "A garden city of ateliers, craftspeople and a new generation of collectors. Bengaluru takes its makers seriously — we build for them.",
  },
];

/** Auto-advancing view of the city. Swap a line to change a slide. */
const CITY = [
  { src: "/bengaluru/vidhana-soudha.jpg", alt: "Vidhana Soudha at golden hour, Bengaluru" },
  { src: "/bengaluru/bangalore-palace.jpg", alt: "Bangalore Palace under a clear sky" },
  { src: "/bengaluru/ub-city-tower.jpg", alt: "UB City tower rising above palm trees, Bengaluru" },
  { src: "/bengaluru/government-museum.jpg", alt: "The Government Museum and gardens at Cubbon Park, Bengaluru" },
  { src: "/bengaluru/iskcon-temple.jpg", alt: "The ISKCON temple gopuram, Bengaluru" },
  { src: "/bengaluru/commercial-street.jpg", alt: "Commercial Street lit for the festival season, Bengaluru" },
  { src: "/bengaluru/ub-city-collection.jpg", alt: "The Collection at UB City, Bengaluru" },
  { src: "/bengaluru/north-bengaluru-aerial.jpg", alt: "Aerial view of a planned layout in north Bengaluru" },
];

const INTERVAL = 4200;

export default function WhyCity() {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], reduced ? ["0%", "0%"] : ["8%", "-8%"]);

  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);

  // Auto-advance. Held while the pointer rests on the frame, and skipped
  // entirely for anyone who asked for reduced motion.
  useEffect(() => {
    if (reduced || paused) return;
    const id = window.setInterval(
      () => setIndex((i) => (i + 1) % CITY.length),
      INTERVAL,
    );
    return () => window.clearInterval(id);
  }, [reduced, paused]);

  // Don't cycle while the tab is in the background.
  useEffect(() => {
    const onVisibility = () => setPaused(document.hidden);
    document.addEventListener("visibilitychange", onVisibility);
    return () => document.removeEventListener("visibilitychange", onVisibility);
  }, []);

  return (
    <section ref={ref} className="bg-mist text-ink py-24 md:py-[180px] overflow-hidden section-glow">
      <div className="max-w-page container-x">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 items-start">
          <div className="lg:col-span-6">
            <div
              className="relative aspect-[4/5] w-full overflow-hidden rounded-sm bg-ink/5"
              onMouseEnter={() => setPaused(true)}
              onMouseLeave={() => setPaused(false)}
            >
              <AnimatePresence initial={false}>
                <motion.img
                  key={CITY[index].src}
                  src={CITY[index].src}
                  alt={CITY[index].alt}
                  loading={index === 0 ? "eager" : "lazy"}
                  initial={reduced ? { opacity: 0 } : { x: "100%" }}
                  animate={reduced ? { opacity: 1 } : { x: "0%" }}
                  exit={reduced ? { opacity: 0 } : { x: "-100%" }}
                  transition={{ duration: reduced ? 0 : 0.9, ease: [0.65, 0, 0.35, 1] }}
                  className="absolute inset-0 h-[116%] w-full object-cover"
                  style={{ y }}
                />
              </AnimatePresence>

              {/* Position within the set */}
              <div className="absolute bottom-4 left-0 right-0 flex items-center justify-center gap-1.5">
                {CITY.map((c, i) => (
                  <button
                    key={c.src}
                    type="button"
                    aria-label={`Show ${c.alt}`}
                    aria-current={i === index}
                    onClick={() => setIndex(i)}
                    className={`h-1.5 rounded-full transition-all duration-500 ${
                      i === index ? "w-5 bg-white/90" : "w-1.5 bg-white/50 hover:bg-white/75"
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>

          <div className="lg:col-span-6 lg:pt-10">
            <Reveal>
              <div className="eyebrow mb-6 text-ink/60">Why this city</div>
            </Reveal>
            <SplitText
              as="h2"
              text="Why Bengaluru."
              className="font-display text-ink mb-12"
              by="word"
            />
            <style>{`
              section h2.font-display { font-size: clamp(40px, 6vw, 88px); font-weight: 300; line-height: 1; letter-spacing: -0.02em; }
            `}</style>

            <div className="space-y-10">
              {PILLARS.map((p, i) => (
                <Reveal key={p.label} delay={0.1 + i * 0.1}>
                  <div>
                    <div className="eyebrow text-ink/60 mb-3">{p.label}</div>
                    <p className="text-[16px] md:text-[17px] text-ink/85 leading-[1.6] max-w-[520px]">
                      {p.text}
                    </p>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
