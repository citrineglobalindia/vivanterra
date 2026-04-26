import { useRef, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { FreeMode } from "swiper/modules";
import type { Swiper as SwiperClass } from "swiper";
import { ArrowLeft, ArrowRight, ArrowUpRight } from "lucide-react";
import "swiper/css";
import "swiper/css/free-mode";
import Reveal from "../ui/Reveal";
import SplitText from "../ui/SplitText";

/** Editable list — swap one line per project. */
const RESIDENCES = [
  { name: "Aurelia Bay", location: "Dubai Marina", image: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1200&q=80" },
  { name: "The Cypress", location: "Downtown", image: "https://images.unsplash.com/photo-1494526585095-c41746248156?auto=format&fit=crop&w=1200&q=80" },
  { name: "Sable Heights", location: "Palm Jumeirah", image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80" },
  { name: "Linnea Place", location: "Business Bay", image: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=80" },
  { name: "Olin Park", location: "Emirates Hills", image: "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=1200&q=80" },
  { name: "Vermilion Court", location: "JBR", image: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80" },
];

export default function Residences() {
  const ref = useRef<SwiperClass | null>(null);
  const [progress, setProgress] = useState(0);

  return (
    <section id="residences" className="bg-paper text-ink py-24 md:py-[180px]">
      <div className="max-w-page container-x">
        <div className="flex items-end justify-between gap-8 mb-16 md:mb-24">
          <div>
            <Reveal>
              <div className="eyebrow mb-6 text-ink/60">Selected Developments — 2026</div>
            </Reveal>
            <SplitText
              as="h2"
              text="A new vocabulary of living."
              className="font-display text-ink"
              by="word"
            />
          </div>
          <div className="hidden md:flex items-center gap-3">
            <button
              onClick={() => ref.current?.slidePrev()}
              aria-label="Previous"
              className="h-12 w-12 rounded-full border border-ink/30 flex items-center justify-center hover:bg-ink hover:text-paper transition-colors"
            >
              <ArrowLeft size={16} />
            </button>
            <button
              onClick={() => ref.current?.slideNext()}
              aria-label="Next"
              className="h-12 w-12 rounded-full border border-ink/30 flex items-center justify-center hover:bg-ink hover:text-paper transition-colors"
            >
              <ArrowRight size={16} />
            </button>
          </div>
        </div>

        <style>{`
          #residences h2.font-display { font-size: clamp(40px, 6vw, 88px); font-weight: 300; line-height: 1; }
          #residences .accent-italic { font-style: italic; color: var(--gold); }
        `}</style>

        <Swiper
          modules={[FreeMode]}
          freeMode
          grabCursor
          slidesPerView={1.2}
          spaceBetween={20}
          breakpoints={{
            640: { slidesPerView: 2, spaceBetween: 28 },
            1024: { slidesPerView: 3, spaceBetween: 36 },
          }}
          onSwiper={(s) => (ref.current = s)}
          onProgress={(_, p) => setProgress(p)}
        >
          {RESIDENCES.map((r, i) => (
            <SwiperSlide key={i}>
              <Reveal delay={i * 0.06}>
                <article className="group cursor-pointer transition-transform duration-500 hover:-translate-y-1.5" data-cursor="hover">
                  <div className="img-zoom aspect-[3/4] bg-ink/5 rounded-sm overflow-hidden shadow-[0_2px_0_rgba(0,0,0,0)] group-hover:shadow-[0_24px_60px_-30px_rgba(0,0,0,0.3)] transition-shadow duration-500">
                    <img src={r.image} alt={`${r.name}, ${r.location}`} loading="lazy" className="h-full w-full object-cover" />
                  </div>
                  <div className="mt-6">
                    <h3 className="font-display" style={{ fontSize: 28, fontWeight: 400, letterSpacing: "-0.02em" }}>
                      {r.name}
                    </h3>
                    <p className="text-[13px] text-muted-soft mt-1">{r.location}</p>
                    <div className="hairline-dark my-5" />
                    <a href="#" className="inline-flex items-center gap-2 text-[12px] uppercase tracking-[0.18em] font-medium nav-link">
                      View
                      <ArrowUpRight size={14} className="transition-transform duration-300 group-hover:translate-x-1" />
                    </a>
                  </div>
                </article>
              </Reveal>
            </SwiperSlide>
          ))}
        </Swiper>

        <div className="mt-12 relative h-px w-full bg-ink/10">
          <span
            className="absolute inset-y-0 left-0 bg-ink"
            style={{ width: `${Math.max(8, (1 - progress) * 100)}%`, transition: "width 0.2s ease-out" }}
          />
        </div>
      </div>
    </section>
  );
}
