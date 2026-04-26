import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import Reveal from "../ui/Reveal";
import { ArrowUpRight } from "lucide-react";

/** Editable list — swap with real cities later. */
const CITIES = [
  { city: "Dubai", country: "United Arab Emirates", count: 4, blurb: "Our home market and design language origin.", x: 690, y: 240 },
  { city: "London", country: "United Kingdom", count: 3, blurb: "Mayfair and Belgravia restorations in collaboration with English ateliers.", x: 460, y: 130 },
  { city: "Riyadh", country: "Saudi Arabia", count: 2, blurb: "Two new districts within the Diriyah master plan.", x: 660, y: 245 },
  { city: "Doha", country: "Qatar", count: 2, blurb: "Waterfront residences along West Bay.", x: 670, y: 250 },
  { city: "Lisbon", country: "Portugal", count: 1, blurb: "A single restored quinta above the Tagus.", x: 425, y: 200 },
  { city: "Singapore", country: "Singapore", count: 2, blurb: "Tropical-modern towers in District 9.", x: 880, y: 320 },
  { city: "Miami", country: "United States", count: 2, blurb: "Sunset Islands villas with private moorings.", x: 240, y: 250 },
  { city: "Mumbai", country: "India", count: 1, blurb: "An invitation-only Worli skyhome.", x: 750, y: 280 },
];

export default function GlobalPresence() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  // Active index drives which dot is gold
  const activeIndex = useTransform(scrollYProgress, (p) => {
    const total = CITIES.length;
    return Math.min(total - 1, Math.max(0, Math.floor(p * total * 1.1 - 0.4)));
  });

  return (
    <section ref={ref} className="bg-paper text-ink relative">
      <div className="max-w-page container-x">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 py-24 md:py-32">
          {/* Sticky map */}
          <div className="lg:sticky lg:top-24 self-start h-[60vh] lg:h-[80vh] flex flex-col">
            <div className="eyebrow mb-6 text-ink/60">Global Presence</div>
            <h2 className="font-display mb-10" style={{ fontSize: "clamp(36px, 4.5vw, 64px)", fontWeight: 300, letterSpacing: "-0.02em", lineHeight: 1.05 }}>
              Eight cities. <span className="italic text-gold">One language.</span>
            </h2>
            <div className="relative flex-1 w-full">
              <svg viewBox="0 0 1000 500" className="w-full h-full" aria-hidden="true">
                {/* Simplified abstract continents (thin lines) */}
                <g fill="none" stroke="currentColor" strokeWidth="0.6" opacity="0.4">
                  <path d="M150,180 Q200,150 270,160 T380,180 Q420,210 400,260 T350,320 Q300,330 260,310 T180,280 Q140,240 150,180Z" />
                  <path d="M420,140 Q470,120 520,130 T580,150 Q610,170 600,200 T560,240 Q500,250 460,220 T410,180 Q400,160 420,140Z" />
                  <path d="M560,180 Q620,170 680,200 T780,260 Q800,300 770,340 T700,380 Q640,370 600,330 T560,270 Q540,220 560,180Z" />
                  <path d="M820,250 Q860,260 880,300 T890,360 Q870,390 840,380 T810,340 Q800,300 820,250Z" />
                  <path d="M200,330 Q240,340 270,380 T280,440 Q260,460 230,450 T200,410 Q190,370 200,330Z" />
                </g>
                {CITIES.map((c, i) => (
                  <CityDot key={c.city} index={i} x={c.x} y={c.y} city={c.city} activeIndex={activeIndex} />
                ))}
              </svg>
            </div>
          </div>

          {/* Cards */}
          <div className="flex flex-col gap-6">
            {CITIES.map((c, i) => (
              <Reveal key={c.city} delay={i * 0.04}>
                <article className="border-t border-ink/15 pt-8 pb-2">
                  <div className="flex items-baseline justify-between gap-4 mb-3">
                    <h3 className="font-display" style={{ fontSize: 36, fontWeight: 400, letterSpacing: "-0.02em" }}>
                      {c.city}
                    </h3>
                    <span className="eyebrow text-ink/50">{String(i + 1).padStart(2, "0")}</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm text-muted-soft mb-4">
                    <span>{c.country}</span>
                    <span className="h-1 w-1 rounded-full bg-ink/30" />
                    <span>{c.count} developments</span>
                  </div>
                  <p className="text-[15px] text-ink/80 max-w-md mb-5 leading-[1.6]">{c.blurb}</p>
                  <a href="#" className="inline-flex items-center gap-2 text-[12px] uppercase tracking-[0.18em] font-medium nav-link group">
                    View region
                    <ArrowUpRight size={14} className="transition-transform duration-300 group-hover:translate-x-1" />
                  </a>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function CityDot({
  index,
  x,
  y,
  city,
  activeIndex,
}: {
  index: number;
  x: number;
  y: number;
  city: string;
  activeIndex: ReturnType<typeof useTransform<number, number>>;
}) {
  // Slightly distribute coordinates so dots don't overlap (Riyadh/Doha/Dubai cluster)
  const ox = x + (index % 2 === 0 ? -8 : 8) * (index / 2);
  const oy = y + (index % 3 === 0 ? -6 : 4) * (index / 3);

  const fill = useTransform(activeIndex, (a) => (a === index ? "var(--gold)" : "var(--ink)"));
  const r = useTransform(activeIndex, (a) => (a === index ? 5 : 3));
  const labelOpacity = useTransform(activeIndex, (a) => (a === index ? 1 : 0));

  return (
    <g>
      <motion.circle cx={ox} cy={oy} r={3} className="animate-pulse-soft" fill="currentColor" opacity={0.25} />
      <motion.circle cx={ox} cy={oy} r={r} fill={fill} />
      <motion.text
        x={ox + 10}
        y={oy + 4}
        fontSize="11"
        fill="var(--gold)"
        style={{ opacity: labelOpacity, fontFamily: "Inter", fontWeight: 500, letterSpacing: "0.18em", textTransform: "uppercase" }}
      >
        {city.toUpperCase()}
      </motion.text>
    </g>
  );
}
