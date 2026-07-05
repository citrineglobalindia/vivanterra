import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowUpRight,
  Cctv,
  Leaf,
  MapPin,
  Minus,
  Plus,
  TreePine,
  Trees,
  Waves,
  Wifi,
  Wind,
} from "lucide-react";
import Reveal from "@/components/ui/Reveal";

/* ───────── FAQs ───────── */

const FAQS = [
  {
    q: "What makes Vivanterra a 'wellness-first' real estate brand?",
    a: "Every Vivanterra residence is designed through the lens of biophilic architecture and sustainable engineering. We ask how air flows, how natural light interacts with daily life, and how nature can be integrated into modern living — before we ever ask about square footage. The goal is residences that actively contribute to your health and peace of mind.",
  },
  {
    q: "Where are Vivanterra residences located in Bengaluru?",
    a: "Our active and completed projects are concentrated in Bengaluru's most considered neighbourhoods — Sadashiva Nagar, Indiranagar, Jayanagar, Cooke Town, Domlur, Benson Town and Richmond Town. We choose sites for their mature greenery, walkability, and quiet adjacency to the city's cultural fabric.",
  },
  {
    q: "What configurations and unit sizes do you offer?",
    a: "Configurations span 2, 3 and 4 BHK residences and full-floor penthouses. Carpet areas range from roughly 1,650 sq ft in our compact 2 BHK plans up to ~6,000 sq ft in our by-invitation penthouse buildings. Each project page lists the typology and per-unit area in detail.",
  },
  {
    q: "When can I expect possession?",
    a: "Possession dates vary by project. Our nearest deliveries begin Q1 2027 (Aurelia Bay), with subsequent handovers through 2027 and 2029. Upcoming projects are in design or pre-construction with possession from 2029 onward. The current possession date is listed on every project card.",
  },
  {
    q: "Are Vivanterra residences for sale or by invitation only?",
    a: "Most of our residences are openly available — pricing is on request, given the bespoke configurations. A small number of boutique buildings (such as Quietude) are released by invitation to private clients only. The badge on each card and the project page indicates which.",
  },
  {
    q: "What amenities are included in a Vivanterra residence?",
    a: "Every building includes air-purification, biophilic landscaping, courtyards or shared green spaces, smart home integration, 24/7 security with biometric access, EV-ready parking, rainwater harvesting and solar-ready electrical systems. Larger projects add a wellness deck, yoga lawn, and clubhouse — see each project page for specifics.",
  },
  {
    q: "How do I schedule a private viewing?",
    a: "Reach out via the Enquire button on any project card, write to hello@vivanterra.in, or message us on WhatsApp at +91 88675 89797. Our concierge will arrange a private walk-through at our Sadashiva Nagar studio or, where possible, on site.",
  },
] as const;

function FaqItem({
  q,
  a,
  open,
  onToggle,
}: {
  q: string;
  a: string;
  open: boolean;
  onToggle: () => void;
}) {
  return (
    <div className="border-b border-line-dark/60">
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={open}
        className="w-full flex items-start justify-between gap-6 py-6 md:py-7 text-left group"
      >
        <span
          className="font-display text-ink group-hover:text-gold transition-colors pr-4"
          style={{
            fontSize: "clamp(17px, 1.5vw, 21px)",
            fontWeight: 400,
            letterSpacing: "-0.01em",
            lineHeight: 1.35,
          }}
        >
          {q}
        </span>
        <span className="shrink-0 w-9 h-9 rounded-full border border-line-dark group-hover:border-gold group-hover:text-gold flex items-center justify-center transition-colors">
          {open ? <Minus size={14} /> : <Plus size={14} />}
        </span>
      </button>
      <div
        className="grid transition-all duration-500 ease-out"
        style={{
          gridTemplateRows: open ? "1fr" : "0fr",
          opacity: open ? 1 : 0,
        }}
      >
        <div className="overflow-hidden">
          <p className="pb-7 pr-12 text-ink/80 leading-relaxed text-[15px] md:text-base">
            {a}
          </p>
        </div>
      </div>
    </div>
  );
}

/* ───────── Locations ───────── */

const LOCATIONS = [
  {
    name: "Sadashiva Nagar",
    body: "Quiet residential streets, mature trees, and easy proximity to Sankey Tank. Our studio is here; so is Aurelia Bay and Quietude.",
  },
  {
    name: "Indiranagar",
    body: "Vivanterra's compact-residence work — Marigold House sits on a narrow plot here, taking light from a stepped western façade.",
  },
  {
    name: "Jayanagar",
    body: "South Bengaluru's most walkable district. Sandalwood Row's five row-houses share a long garden here.",
  },
  {
    name: "Cooke Town",
    body: "Heritage roads, century-old trees. Kalpavriksha — our upcoming building wrapped around a hundred-year-old rain tree — is here.",
  },
  {
    name: "Domlur, Benson Town & Richmond Town",
    body: "Completed projects — The Frangipani in Domlur, Olive Court in Benson Town, and The Veranda's restored 1924 bungalow in Richmond Town.",
  },
] as const;

const AMENITIES = [
  {
    icon: Leaf,
    name: "Biophilic landscaping",
    desc: "Native plantings, courtyards, and shaded sit-outs that draw nature into the building.",
  },
  {
    icon: Wind,
    name: "Air & light by design",
    desc: "Cross-ventilation engineered per plan; sun-paths studied before walls are drawn.",
  },
  {
    icon: Waves,
    name: "Wellness deck",
    desc: "Larger projects include a yoga lawn, lap pool, and quiet reading room overlooking the courtyard.",
  },
  {
    icon: TreePine,
    name: "Mature trees retained",
    desc: "We plan around existing canopy — the building accommodates the tree, not the other way around.",
  },
  {
    icon: Wifi,
    name: "Smart home integration",
    desc: "App-controlled lighting, climate, blinds, and access. Cabled for fibre + 10G internal.",
  },
  {
    icon: Cctv,
    name: "Security & privacy",
    desc: "24/7 concierge, biometric access, CCTV with retention. Discreet — never intrusive.",
  },
] as const;

/* ───────── The full block ───────── */

export default function ProjectsGuide() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <div className="space-y-24 md:space-y-32 mt-24 md:mt-32">
      {/* FAQ */}
      <section id="faq">
        <Reveal>
          <div className="hairline-dark mb-10" />
          <div className="grid md:grid-cols-12 gap-8 mb-10 md:mb-14 items-end">
            <div className="md:col-span-7">
              <div className="flex items-center gap-3 mb-5">
                <span className="h-px w-10 bg-gold" />
                <span className="eyebrow text-muted-soft">04 / FAQ</span>
              </div>
              <h2
                className="font-display text-ink"
                style={{
                  fontSize: "clamp(32px, 4.5vw, 56px)",
                  fontWeight: 300,
                  letterSpacing: "-0.02em",
                  lineHeight: 1,
                }}
              >
                Questions, asked{" "}
                <span className="">honestly answered.</span>
              </h2>
            </div>
            <div className="md:col-span-4 md:col-start-9">
              <p className="text-muted-soft leading-relaxed">
                Practical answers to the questions we hear most often. For
                anything specific, our concierge is one message away.
              </p>
            </div>
          </div>
        </Reveal>

        <Reveal delay={0.05}>
          <div>
            {FAQS.map((f, i) => (
              <FaqItem
                key={f.q}
                q={f.q}
                a={f.a}
                open={open === i}
                onToggle={() => setOpen(open === i ? null : i)}
              />
            ))}
          </div>
        </Reveal>
      </section>

      {/* Guide */}
      <section id="guide">
        <Reveal>
          <div className="hairline-dark mb-10" />
          <div className="flex items-center gap-3 mb-5">
            <span className="h-px w-10 bg-gold" />
            <span className="eyebrow text-muted-soft">05 / Guide</span>
          </div>
          <h2
            className="font-display text-ink mb-12 md:mb-16"
            style={{
              fontSize: "clamp(32px, 4.5vw, 56px)",
              fontWeight: 300,
              letterSpacing: "-0.02em",
              lineHeight: 1,
            }}
          >
            A short guide to{" "}
            <span className="">
              wellness-first living in Bengaluru.
            </span>
          </h2>
        </Reveal>

        <div className="grid lg:grid-cols-12 gap-10 lg:gap-16">
          {/* Bengaluru intro */}
          <Reveal className="lg:col-span-6">
            <h3 className="eyebrow text-gold mb-4">Why Bengaluru</h3>
            <div className="space-y-4 text-ink/85 leading-relaxed text-[15px] md:text-base">
              <p>
                Bengaluru remains India's most quietly liveable major city — a
                rare combination of mature greenery, walkable neighbourhoods,
                temperate weather, and a cultural fabric that rewards staying.
                For wellness-first real estate, it is one of the few large
                cities where the climate and tree cover allow biophilic
                planning to actually deliver on its promise.
              </p>
              <p>
                Vivanterra residences are concentrated in the most considered
                pockets of the city — places where you can still walk to a
                quiet park before breakfast, and where the morning light isn't
                a battle.
              </p>
            </div>
          </Reveal>

          {/* Investment angle */}
          <Reveal className="lg:col-span-6" delay={0.1}>
            <h3 className="eyebrow text-gold mb-4">
              Why a Vivanterra residence is also a good asset
            </h3>
            <ol className="space-y-3 text-ink/85 leading-relaxed text-[15px] md:text-base list-decimal pl-5 marker:text-gold marker:tabular-nums">
              <li>
                Limited supply — small buildings, hand-finished work, by-plot
                pricing.
              </li>
              <li>
                Mature locations — Sadashiva Nagar, Indiranagar and Jayanagar
                have appreciated steadily for two decades.
              </li>
              <li>
                Long-life materials — stone, brass, oak — that reduce upkeep
                cost and look better with age.
              </li>
              <li>
                Wellness premium — buyers increasingly pay for clean air,
                quiet, and walkability. The market is moving towards us.
              </li>
              <li>
                Strong rentability — full-floor and 3–4 BHK plans rent
                particularly well to professionals and small families.
              </li>
            </ol>
          </Reveal>
        </div>

        {/* Locations */}
        <Reveal delay={0.15}>
          <div className="mt-16 md:mt-20">
            <h3 className="eyebrow text-gold mb-6">Neighbourhoods we build in</h3>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6">
              {LOCATIONS.map((l, i) => (
                <motion.article
                  key={l.name}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-10% 0px" }}
                  transition={{
                    duration: 0.55,
                    delay: i * 0.05,
                    ease: [0.2, 0.8, 0.2, 1],
                  }}
                  className="bg-paper border border-line-dark rounded-sm p-6"
                >
                  <span className="inline-flex w-9 h-9 rounded-full bg-ink/5 text-gold items-center justify-center mb-4">
                    <MapPin size={14} />
                  </span>
                  <h4 className="font-display text-ink text-lg mb-2">
                    {l.name}
                  </h4>
                  <p className="text-ink/75 text-sm leading-relaxed">
                    {l.body}
                  </p>
                </motion.article>
              ))}
            </div>
          </div>
        </Reveal>
      </section>

      {/* Amenities */}
      <section id="amenities">
        <Reveal>
          <div className="hairline-dark mb-10" />
          <div className="flex items-center gap-3 mb-5">
            <span className="h-px w-10 bg-gold" />
            <span className="eyebrow text-muted-soft">06 / Amenities</span>
          </div>
          <h2
            className="font-display text-ink mb-12"
            style={{
              fontSize: "clamp(32px, 4.5vw, 56px)",
              fontWeight: 300,
              letterSpacing: "-0.02em",
              lineHeight: 1,
            }}
          >
            What's included,{" "}
            <span className="">at every Vivanterra address.</span>
          </h2>
        </Reveal>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6">
          {AMENITIES.map((a, i) => {
            const Icon = a.icon;
            return (
              <motion.article
                key={a.name}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-10% 0px" }}
                transition={{
                  duration: 0.55,
                  delay: i * 0.05,
                  ease: [0.2, 0.8, 0.2, 1],
                }}
                className="flex gap-5 p-6 bg-paper border border-line-dark rounded-sm"
              >
                <span className="shrink-0 w-11 h-11 rounded-full border border-gold/40 text-gold flex items-center justify-center">
                  <Icon size={16} />
                </span>
                <div>
                  <h4 className="font-display text-ink text-lg mb-1.5 leading-tight">
                    {a.name}
                  </h4>
                  <p className="text-ink/75 text-sm leading-relaxed">
                    {a.desc}
                  </p>
                </div>
              </motion.article>
            );
          })}
        </div>
      </section>

      {/* Bottom CTA */}
      <section>
        <Reveal>
          <div
            className="relative overflow-hidden rounded-sm bg-ink text-paper p-10 md:p-16"
            style={{
              boxShadow:
                "0 30px 80px -30px rgba(78,115,83,0.6), 0 0 0 1px rgba(196,169,106,0.18)",
            }}
          >
            <div
              aria-hidden
              className="absolute -top-1/3 -right-1/4 w-[60%] h-[60%] pointer-events-none"
              style={{
                background:
                  "radial-gradient(ellipse at center, rgba(196,169,106,0.16) 0%, rgba(196,169,106,0) 70%)",
                filter: "blur(60px)",
              }}
            />
            <div className="relative grid md:grid-cols-12 gap-8 items-end">
              <div className="md:col-span-7">
                <div className="eyebrow text-gold mb-5">Visit the studio</div>
                <h2
                  className="font-display uppercase"
                  style={{
                    fontSize: "clamp(28px, 3.6vw, 48px)",
                    fontWeight: 700,
                    letterSpacing: "-0.02em",
                    lineHeight: 1,
                  }}
                >
                  Begin a conversation about your{" "}
                  <span className="font-light normal-case">
                    next residence.
                  </span>
                </h2>
                <p className="mt-6 text-paper/80 leading-relaxed max-w-xl">
                  Send a short note or call us at{" "}
                  <a
                    href="tel:+918867589797"
                    className="text-gold hover:underline tabular-nums"
                  >
                    +91 88675 89797
                  </a>{" "}
                  — our concierge will arrange a private walk-through.
                </p>
              </div>
              <div className="md:col-span-5 md:pl-6 lg:pl-12 flex flex-col gap-3">
                <Link
                  to="/contact"
                  className="group inline-flex items-center justify-between gap-3 h-14 px-6 bg-gold text-ink font-semibold text-[12px] tracking-[0.20em] uppercase rounded-sm hover:bg-paper transition-colors"
                >
                  Enquire now
                  <ArrowUpRight
                    size={16}
                    className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                  />
                </Link>
                <a
                  href="https://wa.me/918867589797"
                  target="_blank"
                  rel="noreferrer"
                  className="group inline-flex items-center justify-between gap-3 h-14 px-6 border border-paper/30 text-paper font-medium text-[12px] tracking-[0.20em] uppercase rounded-sm hover:bg-paper/10 transition-colors"
                >
                  Message on WhatsApp
                  <ArrowUpRight
                    size={16}
                    className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                  />
                </a>
              </div>
            </div>
          </div>
        </Reveal>
      </section>
    </div>
  );
}
