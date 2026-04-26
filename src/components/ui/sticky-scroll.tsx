"use client";
import { ReactLenis } from "lenis/react";
import React, { forwardRef } from "react";

/**
 * PORTFOLIO — easy single-line edits.
 * Each row renders 3–5 tiles. Drop in your real residence photography.
 */
const PORTFOLIO = {
  rowA: [
    "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1505691938895-1758d7feb511?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1613553474179-e1eda3ea5734?auto=format&fit=crop&w=1200&q=80",
  ],
  rowB: [
    "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=1200&q=80",
  ],
  rowC: [
    "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1493809842364-78817add7ffb?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?auto=format&fit=crop&w=1200&q=80",
  ],
};

const Tile: React.FC<{ src: string; alt: string; tall?: boolean }> = ({ src, alt, tall }) => (
  <figure
    className={`group relative overflow-hidden rounded-sm bg-ink/40 ring-1 ring-paper/5 ${
      tall ? "aspect-[3/4]" : "aspect-[4/3]"
    }`}
  >
    <img
      src={src}
      alt={alt}
      loading="lazy"
      decoding="async"
      className="h-full w-full object-cover transition-transform duration-[1200ms] ease-out will-change-transform group-hover:scale-[1.06]"
    />
    <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink/60 via-transparent to-transparent opacity-70" />
  </figure>
);

const StickyScroll = forwardRef<HTMLDivElement>((_props, ref) => {
  return (
    <ReactLenis root>
      <section
        ref={ref}
        id="portfolio"
        className="relative w-full bg-ink text-paper"
      >
        {/* INTRO — sticky title */}
        <div className="relative h-screen w-full">
          <div className="sticky top-0 flex h-screen w-full items-center justify-center overflow-hidden">
            <div className="mx-auto max-w-5xl px-6 text-center">
              <p className="mb-6 text-xs uppercase tracking-[0.4em] text-paper/50">
                Portfolio — Selected Works
              </p>
              <h2 className="font-serif text-5xl leading-[0.95] tracking-tight md:text-7xl lg:text-[8rem]">
                A gallery
                <br />
                <span className="italic text-paper/70">in motion.</span>
              </h2>
              <p className="mx-auto mt-8 max-w-xl text-sm leading-relaxed text-paper/60 md:text-base">
                Twenty-three residences across nine cities. Scroll to wander
                through the collection — each frame a quiet study in light,
                stone, and proportion.
              </p>
              <p className="mt-12 text-xs uppercase tracking-[0.3em] text-paper/40">
                Scroll ↓
              </p>
            </div>
          </div>
        </div>

        {/* GALLERY — three sticky rows that telescope */}
        <div className="relative w-full">
          {/* ROW A — 5 tiles */}
          <div className="sticky top-0 h-screen w-full overflow-hidden bg-ink">
            <div className="flex h-full w-full items-center">
              <div className="flex w-full gap-4 px-4 md:gap-6 md:px-8">
                {PORTFOLIO.rowA.map((src, i) => (
                  <div key={i} className="w-1/5 flex-shrink-0">
                    <Tile src={src} alt={`Residence A${i + 1}`} tall />
                  </div>
                ))}
              </div>
            </div>
            <span className="absolute bottom-8 left-8 text-[10px] uppercase tracking-[0.4em] text-paper/40">
              I — Skyline Residences
            </span>
          </div>

          {/* ROW B — 3 tiles, larger */}
          <div className="sticky top-0 h-screen w-full overflow-hidden bg-ink">
            <div className="flex h-full w-full items-center">
              <div className="flex w-full gap-4 px-4 md:gap-8 md:px-16">
                {PORTFOLIO.rowB.map((src, i) => (
                  <div key={i} className="w-1/3 flex-shrink-0">
                    <Tile src={src} alt={`Residence B${i + 1}`} tall />
                  </div>
                ))}
              </div>
            </div>
            <span className="absolute bottom-8 left-8 text-[10px] uppercase tracking-[0.4em] text-paper/40">
              II — Private Villas
            </span>
          </div>

          {/* ROW C — 5 tiles */}
          <div className="sticky top-0 h-screen w-full overflow-hidden bg-ink">
            <div className="flex h-full w-full items-center">
              <div className="flex w-full gap-4 px-4 md:gap-6 md:px-8">
                {PORTFOLIO.rowC.map((src, i) => (
                  <div key={i} className="w-1/5 flex-shrink-0">
                    <Tile src={src} alt={`Residence C${i + 1}`} tall />
                  </div>
                ))}
              </div>
            </div>
            <span className="absolute bottom-8 left-8 text-[10px] uppercase tracking-[0.4em] text-paper/40">
              III — Heritage Conversions
            </span>
          </div>
        </div>

        {/* OUTRO */}
        <div className="relative flex h-screen w-full items-center justify-center bg-ink">
          <div className="mx-auto max-w-3xl px-6 text-center">
            <p className="mb-6 text-xs uppercase tracking-[0.4em] text-paper/50">
              The Archive
            </p>
            <h3 className="font-serif text-4xl leading-tight tracking-tight md:text-6xl">
              Every residence, a singular work.
            </h3>
            <a
              href="#contact"
              className="mt-12 inline-flex items-center gap-3 border-b border-paper/30 pb-1 text-xs uppercase tracking-[0.3em] text-paper/80 transition hover:border-paper hover:text-paper"
            >
              Request the full portfolio →
            </a>
          </div>
        </div>
      </section>
    </ReactLenis>
  );
});

StickyScroll.displayName = "StickyScroll";

export default StickyScroll;
