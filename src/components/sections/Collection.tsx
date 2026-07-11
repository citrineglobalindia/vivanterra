import { ArrowUpRight } from "lucide-react";
import { Link } from "react-router-dom";
import Reveal from "../ui/Reveal";

/**
 * The Collection — all six Vivanterra residences shown at once in a
 * responsive grid (replaces the infinite marquee, which cropped cards).
 */
type Card = {
  label: string;
  place: string;
  slug: string;
  image: string;
  velociti?: boolean;
};

const CARDS: Card[] = [
  { label: "Bare & Bespoke Residence", place: "Yelahanka", slug: "bare-bespoke-residence", image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=900&q=85" },
  { label: "The Living Edit", place: "Shivaram Karanth Layout", slug: "the-living-edit", image: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=900&q=85" },
  { label: "Sense of Space", place: "Sadashiva Nagar", slug: "sense-of-space", image: "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=900&q=85" },
  { label: "Bellevue Nest", place: "IVC Road", slug: "bellevue-nest", image: "https://images.unsplash.com/photo-1502672023488-70e25813eb80?auto=format&fit=crop&w=900&q=85", velociti: true },
  { label: "Elite Serenity", place: "Devanahalli", slug: "elite-serenity", image: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=900&q=85", velociti: true },
  { label: "Elite Pristine", place: "Rajankunte", slug: "elite-pristine", image: "https://images.unsplash.com/photo-1493809842364-78817add7ffb?auto=format&fit=crop&w=900&q=85", velociti: true },
];

export default function Collection() {
  return (
    <section
      id="collection"
      className="relative bg-ink text-paper py-20 md:py-28 overflow-hidden"
    >
      <div
        aria-hidden
        className="absolute -top-1/4 left-1/3 w-[50vw] h-[50vw] pointer-events-none"
        style={{
          background:
            "radial-gradient(circle, rgba(196,169,106,0.10) 0%, rgba(196,169,106,0) 70%)",
          filter: "blur(70px)",
        }}
      />

      {/* Heading */}
      <div className="relative max-w-page container-x mb-12 md:mb-16">
        <Reveal>
          <div className="flex items-center gap-3 mb-5">
            <span className="h-px w-10 bg-gold" />
            <span className="eyebrow text-paper">The Collection</span>
          </div>
        </Reveal>
        <Reveal delay={0.05}>
          <h2
            className="font-display text-paper max-w-4xl"
            style={{
              fontSize: "clamp(32px, 5vw, 68px)",
              fontWeight: 300,
              letterSpacing: "-0.02em",
              lineHeight: 1.02,
            }}
          >
            A realm of residences,{" "}
            <span className="">curated with intention.</span>
          </h2>
        </Reveal>
        <Reveal delay={0.1}>
          <p className="mt-6 max-w-xl text-paper/65 leading-relaxed">
            Each Vivanterra address is composed in close collaboration with the
            craftspeople, materials and landscapes that define it.
          </p>
        </Reveal>
      </div>

      {/* All six residences */}
      <div className="relative max-w-page container-x">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 xl:grid-cols-6 gap-4 md:gap-5">
          {CARDS.map((c, i) => (
            <Reveal key={c.slug} delay={0.05 * i}>
              <CollectionCard card={c} />
            </Reveal>
          ))}
        </div>
      </div>

      {/* CTA */}
      <div className="relative max-w-page container-x mt-12 md:mt-16">
        <Reveal>
          <Link
            to="/projects"
            className="group inline-flex items-center gap-2 text-[12px] tracking-[0.18em] uppercase font-medium text-paper/80 hover:text-gold transition-colors"
          >
            Explore the full portfolio
            <ArrowUpRight
              size={15}
              className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
            />
          </Link>
        </Reveal>
      </div>
    </section>
  );
}

function CollectionCard({ card }: { card: Card }) {
  return (
    <Link
      to={`/projects/${card.slug}`}
      data-brand={card.velociti ? "Velociti" : undefined}
      className="group relative block h-[340px] sm:h-[420px] md:h-[480px] overflow-hidden rounded-sm bg-paper/5"
    >
      {card.velociti && <span className="sr-only">A Velociti residence</span>}
      <img
        src={card.image}
        alt={`${card.label}, ${card.place}`}
        loading="lazy"
        className="h-full w-full object-cover transition-transform duration-[1600ms] ease-out group-hover:scale-[1.07]"
      />
      <div
        aria-hidden
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "linear-gradient(180deg, rgba(0,0,0,0.18) 0%, rgba(0,0,0,0) 35%, rgba(14,14,16,0.78) 100%)",
        }}
      />
      {/* Wordmark, centered */}
      <div className="absolute inset-x-0 top-8 md:top-10 flex flex-col items-center text-center px-4">
        <span
          className="font-display text-paper/95 tracking-[0.04em]"
          style={{ fontSize: "clamp(14px, 1.1vw, 18px)", fontWeight: 400 }}
        >
          {card.label}
        </span>
        <span className="mt-2 h-px w-8 bg-gold/70" />
      </div>
      {/* Bottom place + discover */}
      <div className="absolute bottom-0 inset-x-0 p-5 md:p-6">
        <div className="text-[10px] tracking-[0.22em] uppercase text-gold mb-1.5">
          {card.place}
        </div>
        <span className="inline-flex items-center gap-1 text-[11px] tracking-[0.16em] uppercase text-paper/70 group-hover:text-paper transition-colors duration-500">
          Discover
          <ArrowUpRight size={13} />
        </span>
      </div>
    </Link>
  );
}
