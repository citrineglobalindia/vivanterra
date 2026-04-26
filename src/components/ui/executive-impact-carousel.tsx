"use client";

import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

interface Residence {
  id: string;
  title: string;
  location: string;
  price: string;
  exteriorImg: string;
  interiorImg: string;
}

const RESIDENCES: Residence[] = [
  {
    id: "1",
    title: "Maison Céleste",
    location: "Paris, 7ᵉ",
    price: "From €4.2M",
    exteriorImg: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=900&q=80",
    interiorImg: "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=900&q=80",
  },
  {
    id: "2",
    title: "The Linden House",
    location: "Mayfair, London",
    price: "From £6.8M",
    exteriorImg: "https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=900&q=80",
    interiorImg: "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=900&q=80",
  },
  {
    id: "3",
    title: "Ivory Tower",
    location: "Tribeca, NYC",
    price: "From $5.4M",
    exteriorImg: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=900&q=80",
    interiorImg: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=900&q=80",
  },
  {
    id: "4",
    title: "Villa del Mare",
    location: "Portofino",
    price: "From €7.9M",
    exteriorImg: "https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?w=900&q=80",
    interiorImg: "https://images.unsplash.com/photo-1618220179428-22790b461013?w=900&q=80",
  },
  {
    id: "5",
    title: "The Atrium",
    location: "Kyoto",
    price: "From ¥520M",
    exteriorImg: "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=900&q=80",
    interiorImg: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=900&q=80",
  },
  {
    id: "6",
    title: "Casa Lumière",
    location: "Comporta",
    price: "From €3.6M",
    exteriorImg: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=900&q=80",
    interiorImg: "https://images.unsplash.com/photo-1615873968403-89e068629265?w=900&q=80",
  },
  {
    id: "7",
    title: "Maison Noir",
    location: "Marrakech",
    price: "From €2.9M",
    exteriorImg: "https://images.unsplash.com/photo-1600573472550-8090b5e0745e?w=900&q=80",
    interiorImg: "https://images.unsplash.com/photo-1600585152220-90363fe7e115?w=900&q=80",
  },
  {
    id: "8",
    title: "The Crescent",
    location: "Dubai Marina",
    price: "From AED 22M",
    exteriorImg: "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=900&q=80",
    interiorImg: "https://images.unsplash.com/photo-1600210491892-03d54c0aaf87?w=900&q=80",
  },
  {
    id: "9",
    title: "Pavilion 21",
    location: "Aspen",
    price: "From $9.1M",
    exteriorImg: "https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?w=900&q=80",
    interiorImg: "https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=900&q=80",
  },
  {
    id: "10",
    title: "Maison Atelier",
    location: "Lisbon",
    price: "From €2.4M",
    exteriorImg: "https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?w=900&q=80",
    interiorImg: "https://images.unsplash.com/photo-1616137466211-f939a420be84?w=900&q=80",
  },
  {
    id: "11",
    title: "The Glasshouse",
    location: "Copenhagen",
    price: "From DKK 38M",
    exteriorImg: "https://images.unsplash.com/photo-1600607687644-c7171b42498f?w=900&q=80",
    interiorImg: "https://images.unsplash.com/photo-1600566753086-00f18fe6ba6e?w=900&q=80",
  },
  {
    id: "12",
    title: "Casa del Sol",
    location: "Tulum",
    price: "From $3.2M",
    exteriorImg: "https://images.unsplash.com/photo-1600585153490-76fb20a32601?w=900&q=80",
    interiorImg: "https://images.unsplash.com/photo-1600566753051-6057f1b7e1a4?w=900&q=80",
  },
  {
    id: "13",
    title: "The Conservatory",
    location: "Geneva",
    price: "From CHF 8.5M",
    exteriorImg: "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=900&q=80",
    interiorImg: "https://images.unsplash.com/photo-1600210491369-e753d80a41f3?w=900&q=80",
  },
  {
    id: "14",
    title: "Maison Verte",
    location: "Provence",
    price: "From €3.8M",
    exteriorImg: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=900&q=80",
    interiorImg: "https://images.unsplash.com/photo-1615874959474-d609969a20ed?w=900&q=80",
  },
  {
    id: "15",
    title: "Skyline Penthouse",
    location: "Singapore",
    price: "From SGD 14M",
    exteriorImg: "https://images.unsplash.com/photo-1565953522043-baea26b83b7e?w=900&q=80",
    interiorImg: "https://images.unsplash.com/photo-1600210492493-0946911123ea?w=900&q=80",
  },
];

const COL_1 = RESIDENCES.slice(0, 5);
const COL_2 = RESIDENCES.slice(5, 10);
const COL_3 = RESIDENCES.slice(10, 15);

const styles = `
  .residences-carousel {
    background-color: hsl(var(--background));
    color: hsl(var(--foreground));
    margin: 0;
    overflow-x: hidden;
    position: relative;
  }

  .residences-carousel__intro {
    padding: 12vh 6vw 6vh;
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
    max-width: 1400px;
  }

  .residences-carousel__eyebrow {
    font-size: 0.7rem;
    letter-spacing: 0.35em;
    text-transform: uppercase;
    opacity: 0.55;
  }

  .residences-carousel__title {
    font-family: 'Playfair Display', serif;
    font-weight: 400;
    font-size: clamp(2rem, 4.2vw, 3.6rem);
    line-height: 1.05;
    letter-spacing: -0.01em;
    max-width: 22ch;
    margin: 0;
  }

  .col-scroll {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    justify-items: center;
    min-height: 100vh;
    width: 90vw;
    margin: 0 auto;
    box-sizing: border-box;
  }

  @media (max-width: 768px) {
    .col-scroll {
      display: flex;
      flex-direction: column;
      width: 100%;
      gap: 5vh;
      align-items: center;
    }
  }

  .col-scroll__box {
    display: flex;
    flex-direction: column;
    padding: 10vh 0 15vh;
  }

  .col-scroll__box--odd {
    flex-direction: column-reverse;
    height: 100vh;
  }

  @media (max-width: 768px) {
    .col-scroll__box--odd { flex-direction: column; height: auto; padding: 0; }
    .col-scroll__box { width: 100%; align-items: center; padding: 2rem 0; }
  }

  .col-scroll__list {
    display: flex;
    flex-direction: column;
    will-change: transform;
    gap: 10vw;
  }

  .col-scroll__box--odd .col-scroll__list { flex-direction: column-reverse; }

  @media (max-width: 768px) {
    .col-scroll__box--odd .col-scroll__list { flex-direction: column; }
    .col-scroll__list { gap: 5vh; }
  }

  .residence-card {
    display: flex;
    flex-direction: column;
    align-items: center;
    margin: 0;
    padding: 0;
    width: 22vw;
    background: transparent;
    cursor: pointer;
    -webkit-tap-highlight-color: transparent;
  }

  @media (max-width: 768px) {
    .residence-card { width: 86vw; margin: 0 0 6vh 0; }
    .residence-card:last-child { margin-bottom: 0; }
  }

  .col-scroll__img-wrapper {
    position: relative;
    aspect-ratio: 0.78;
    width: 100%;
    overflow: hidden;
    border: 1px solid hsl(var(--border));
    background: hsl(var(--card));
  }

  .col-scroll__img-wrapper img {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: opacity 0.7s ease, transform 1.2s ease;
  }

  .exterior-img { z-index: 1; opacity: 1; }
  .interior-img { z-index: 2; opacity: 0; }

  .residence-card:hover .exterior-img,
  .residence-card:active .exterior-img { opacity: 0; transform: scale(1.04); }
  .residence-card:hover .interior-img,
  .residence-card:active .interior-img { opacity: 1; transform: scale(1.04); }

  .residence-card__overlay {
    position: absolute;
    inset: 0;
    z-index: 3;
    background: linear-gradient(to top, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0) 45%);
    pointer-events: none;
  }

  .residence-card__info {
    position: absolute;
    bottom: 1.75rem;
    left: 0;
    width: 100%;
    text-align: center;
    z-index: 4;
    padding: 0 1.25rem;
    box-sizing: border-box;
    transition: opacity 0.4s ease, transform 0.4s ease;
    color: #f4f1ea;
  }

  .residence-card:hover .residence-card__info,
  .residence-card:active .residence-card__info {
    opacity: 0;
    transform: translateY(8px);
  }

  .residence-card__location {
    font-size: 0.65rem;
    letter-spacing: 0.3em;
    text-transform: uppercase;
    opacity: 0.8;
    margin-bottom: 0.5rem;
  }

  .residence-card__title {
    margin: 0 0 0.4rem;
    font-family: 'Playfair Display', serif;
    font-weight: 400;
    font-size: 1.35rem;
    line-height: 1.2;
  }

  .residence-card__price {
    font-size: 0.78rem;
    letter-spacing: 0.18em;
    opacity: 0.85;
  }

  .residence-card__btn {
    position: absolute;
    bottom: 2rem;
    left: 50%;
    transform: translateX(-50%) translateY(20px);
    z-index: 5;
    opacity: 0;
    background: rgba(244, 241, 234, 0.95);
    border: 1px solid #1f1f1f;
    padding: 0.95rem 1.9rem;
    font-family: 'Playfair Display', serif;
    text-transform: uppercase;
    letter-spacing: 0.22em;
    font-size: 0.72rem;
    cursor: pointer;
    transition: all 0.4s ease;
    white-space: nowrap;
    color: #1f1f1f;
  }

  .residence-card:hover .residence-card__btn,
  .residence-card:active .residence-card__btn {
    opacity: 1;
    transform: translateX(-50%) translateY(0);
  }

  .residence-card__btn:hover { background: #1f1f1f; color: #f4f1ea; }

  @media (max-width: 768px) {
    .residence-card__title { font-size: 1.15rem; }
    .residence-card__btn { padding: 0.75rem 1.5rem; font-size: 0.65rem; }
  }

  @media (prefers-reduced-motion: reduce) {
    .col-scroll__list { transform: none !important; }
  }
`;

export default function ExecutiveImpactCarousel() {
  const containerRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    if (!containerRef.current) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const mm = gsap.matchMedia();

    mm.add("(min-width: 769px)", () => {
      const ctx = gsap.context(() => {
        const reverseTrigger = gsap.utils.toArray<HTMLElement>(
          ".col-scroll__box--odd .col-scroll__list"
        );

        reverseTrigger.forEach((element) => {
          const elementHeight = element.offsetHeight;
          const viewportHeight = window.innerHeight;
          const extraSpace = viewportHeight * 0.2;
          const scrollDistance = elementHeight + viewportHeight + extraSpace;

          gsap.to(element, {
            yPercent: 100,
            ease: "none",
            scrollTrigger: {
              trigger: element,
              start: 0,
              end: `+=${scrollDistance}`,
              scrub: true,
              pin: true,
            },
          });
        });
      }, containerRef);

      return () => ctx.revert();
    });

    return () => mm.revert();
  }, []);

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: styles }} />
      <section id="curated" className="residences-carousel">
        <div className="residences-carousel__intro">
          <span className="residences-carousel__eyebrow">Curated Portfolio</span>
          <h2 className="residences-carousel__title">
            A scroll through fifteen residences, each held to a single standard.
          </h2>
        </div>

        <div ref={containerRef} className="col-scroll">
          <div className="col-scroll__box col-scroll__box--odd">
            <div className="col-scroll__list">
              {COL_1.map((r) => (
                <ResidenceCard key={r.id} residence={r} />
              ))}
            </div>
          </div>

          <div className="col-scroll__box">
            <div className="col-scroll__list">
              {COL_2.map((r) => (
                <ResidenceCard key={r.id} residence={r} />
              ))}
            </div>
          </div>

          <div className="col-scroll__box col-scroll__box--odd">
            <div className="col-scroll__list">
              {COL_3.map((r) => (
                <ResidenceCard key={r.id} residence={r} />
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

function ResidenceCard({ residence }: { residence: Residence }) {
  return (
    <figure className="residence-card">
      <div className="col-scroll__img-wrapper">
        <img
          className="exterior-img"
          src={residence.exteriorImg}
          alt={residence.title}
          loading="lazy"
        />
        <img
          className="interior-img"
          src={residence.interiorImg}
          alt={`Interior of ${residence.title}`}
          loading="lazy"
        />
        <div className="residence-card__overlay" />

        <div className="residence-card__info">
          <div className="residence-card__location">{residence.location}</div>
          <h3 className="residence-card__title">{residence.title}</h3>
          <div className="residence-card__price">{residence.price}</div>
        </div>

        <button className="residence-card__btn">Enquire +</button>
      </div>
    </figure>
  );
}
