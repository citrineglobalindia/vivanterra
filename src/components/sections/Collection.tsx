import { useRef } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { FreeMode, Autoplay, Mousewheel } from "swiper/modules";
import type { Swiper as SwiperClass } from "swiper";
import "swiper/css";
import "swiper/css/free-mode";
import { ArrowLeft, ArrowRight, ArrowUpRight } from "lucide-react";
import { Link } from "react-router-dom";
import Reveal from "../ui/Reveal";

/**
 * The Collection — a horizontal, free-drag Swiper of staggered cards.
 * Masonry-style vertical offset (tall / short / tall) gives the premium,
 * editorial feel of a curated residence collection.
 *
 * Images are luxury-interior placeholders; swap the `image` values (or wire
 * to the admin Gallery) with your own photography.
 */
type Card = {
  label: string;
  place: string;
  image: string;
  /** Vertical rhythm: tall cards sit lower, short ones sit higher. */
  size: "tall" | "short";
};

const CARDS: Card[] = [
  {
    label: "The Penthouse Collection",
    place: "Sadashiva Nagar",
    image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1000&q=85",
    size: "tall",
  },
  {
    label: "The Atrium",
    place: "Indiranagar",
    image: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1000&q=85",
    size: "short",
  },
  {
    label: "Garden Residences",
    place: "Jayanagar",
    image: "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=1000&q=85",
    size: "tall",
  },
  {
    label: "The Courtyard",
    place: "Cooke Town",
    image: "https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=1000&q=85",
    size: "short",
  },
  {
    label: "Heritage Restorations",
    place: "Richmond Town",
    image: "https://images.unsplash.com/photo-1502672023488-70e25813eb80?auto=format&fit=crop&w=1000&q=85",
    size: "tall",
  },
  {
    label: "The Wellness Wing",
    place: "Benson Town",
    image: "https://images.unsplash.com/photo-1505691938895-1758d7feb511?auto=format&fit=crop&w=1000&q=85",
    size: "short",
  },
  {
    label: "Sky Villas",
    place: "Domlur",
    image: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1000&q=85",
    size: "tall",
  },
  {
    label: "The Reading Room",
    place: "Sadashiva Nagar",
    image: "https://images.unsplash.com/photo-1493809842364-78817add7ffb?auto=format&fit=crop&w=1000&q=85",
    size: "short",
  },
];

export default function Collection() {
  const ref = useRef<SwiperClass | null>(null);

  return (
    <section
      id="collection"
      className="relative bg-ink text-paper py-20 md:py-28 overflow-hidden"
    >
      {/* Soft gold ambient */}
      <div
        aria-hidden
        className="absolute -top-1/4 left-1/3 w-[50vw] h-[50vw] pointer-events-none"
        style={{
          background:
            "radial-gradient(circle, rgba(196,169,106,0.10) 0%, rgba(196,169,106,0) 70%)",
          filter: "blur(70px)",
        }}
      />

      <div className="relative max-w-page container-x mb-12 md:mb-16">
        <div className="flex items-end justify-between gap-8">
          <div>
            <Reveal>
              <div className="flex items-center gap-3 mb-5">
                <span className="h-px w-10 bg-gold" />
                <span className="eyebrow text-paper/60">The Collection</span>
              </div>
            </Reveal>
            <Reveal delay={0.05}>
              <h2
                className="font-display text-paper"
                style={{
                  fontSize: "clamp(34px, 5vw, 72px)",
                  fontWeight: 300,
                  letterSpacing: "-0.02em",
                  lineHeight: 1,
                }}
              >
                A portfolio composed{" "}
                <span className="italic text-gold">with intention.</span>
              </h2>
            </Reveal>
          </div>

          {/* Arrows */}
          <div className="hidden md:flex items-center gap-3 shrink-0">
            <button
              type="button"
              onClick={() => ref.current?.slidePrev()}
              aria-label="Previous"
              className="h-12 w-12 rounded-full border border-paper/25 flex items-center justify-center hover:bg-gold hover:text-ink hover:border-gold transition-colors"
            >
              <ArrowLeft size={16} />
            </button>
            <button
              type="button"
              onClick={() => ref.current?.slideNext()}
              aria-label="Next"
              className="h-12 w-12 rounded-full border border-paper/25 flex items-center justify-center hover:bg-gold hover:text-ink hover:border-gold transition-colors"
            >
              <ArrowRight size={16} />
            </button>
          </div>
        </div>
      </div>

      {/* Swiper — full-bleed, free drag */}
      <div className="relative pl-[max(1.25rem,calc((100vw-var(--page-max,1280px))/2+1.25rem))]">
        <Swiper
          modules={[FreeMode, Autoplay, Mousewheel]}
          onSwiper={(s) => (ref.current = s)}
          freeMode={{ enabled: true, momentum: true, momentumRatio: 0.6 }}
          slidesPerView="auto"
          spaceBetween={20}
          grabCursor
          autoplay={{ delay: 3200, disableOnInteraction: true, pauseOnMouseEnter: true }}
          className="!overflow-visible"
        >
          {CARDS.map((c, i) => (
            <SwiperSlide
              key={c.label + i}
              className="!w-[260px] sm:!w-[300px] md:!w-[340px]"
            >
              <CollectionCard card={c} />
            </SwiperSlide>
          ))}
          {/* Trailing CTA slide */}
          <SwiperSlide className="!w-[260px] sm:!w-[300px] md:!w-[340px]">
            <Link
              to="/projects"
              className="group flex flex-col items-start justify-end h-[420px] md:h-[480px] rounded-sm border border-paper/20 p-8 hover:border-gold transition-colors"
            >
              <span className="eyebrow text-gold mb-3">Explore all</span>
              <span
                className="font-display text-paper group-hover:text-gold transition-colors"
                style={{ fontSize: "clamp(26px, 3vw, 36px)", fontWeight: 300, lineHeight: 1.05 }}
              >
                See the full portfolio
              </span>
              <span className="mt-6 inline-flex items-center gap-1.5 text-[12px] tracking-[0.18em] uppercase text-paper/70 group-hover:text-gold transition-colors">
                View projects
                <ArrowUpRight size={14} className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </span>
            </Link>
          </SwiperSlide>
        </Swiper>
      </div>
    </section>
  );
}

function CollectionCard({ card }: { card: Card }) {
  const tall = card.size === "tall";
  return (
    <article
      className={[
        "group relative overflow-hidden rounded-sm bg-paper/5 transition-transform duration-500",
        tall ? "h-[460px] md:h-[520px]" : "h-[400px] md:h-[440px] md:mt-12",
      ].join(" ")}
    >
      <img
        src={card.image}
        alt={`${card.label}, ${card.place}`}
        loading="lazy"
        className="h-full w-full object-cover transition-transform duration-[1400ms] ease-out group-hover:scale-[1.06]"
      />
      <div
        aria-hidden
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "linear-gradient(180deg, rgba(0,0,0,0) 45%, rgba(14,14,16,0.72) 100%)",
        }}
      />
      {/* Gold corner accent */}
      <span className="absolute top-5 left-5 h-px w-10 bg-gold/80 origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-500" />

      <div className="absolute bottom-0 inset-x-0 p-6 md:p-7">
        <div className="text-[10px] tracking-[0.22em] uppercase text-gold mb-2">
          {card.place}
        </div>
        <h3
          className="font-display text-paper"
          style={{
            fontSize: "clamp(20px, 1.8vw, 26px)",
            fontWeight: 400,
            letterSpacing: "-0.01em",
            lineHeight: 1.15,
          }}
        >
          {card.label}
        </h3>
        <span className="inline-flex items-center gap-1 mt-3 text-[11px] tracking-[0.16em] uppercase text-paper/0 group-hover:text-paper/80 transition-colors duration-500">
          Discover
          <ArrowUpRight size={13} />
        </span>
      </div>
    </article>
  );
}
