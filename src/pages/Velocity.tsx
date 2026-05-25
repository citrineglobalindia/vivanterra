import Seo from "@/components/seo/Seo";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowUpRight,
  Compass,
  Feather,
  Gem,
  Handshake,
  Hammer,
  Layers,
  MapPin,
} from "lucide-react";
import PageShell from "@/components/ui/PageShell";
import Reveal from "@/components/ui/Reveal";

const PILLARS = [
  {
    icon: Gem,
    title: "Material",
    body: "Every stone, every brass swatch, every metre of oak is selected by hand. We travel to the quarry. We mark the block in chalk. We accept that some material decisions cannot be made from a catalogue.",
  },
  {
    icon: Hammer,
    title: "Craft",
    body: "We work with the same cabinetmaker on nine of our last ten projects. We work with the same plasterer for fifteen years. Craft is a relationship, not a procurement line.",
  },
  {
    icon: Compass,
    title: "Site",
    body: "We plan around the trees. Around the light. Around the rain tree at the centre of the plot. The building is the second decision; the first is what we leave alone.",
  },
  {
    icon: Handshake,
    title: "Handover",
    body: "A Vivanterra handover is not a key ceremony. It is a slow, deliberate walk through every room — switch by switch, joint by joint, with the people who will live there.",
  },
] as const;

const STAGES = [
  {
    n: "01",
    title: "Brief & Site",
    body: "Every project begins with a slow read of the plot — orientation, light, neighbours, trees, the long view from the upper floors.",
  },
  {
    n: "02",
    title: "Material Selection",
    body: "Stone, joinery, brass and fixtures are selected before construction begins, not during. This means the building is designed to its materials, not the reverse.",
  },
  {
    n: "03",
    title: "Build & Inspect",
    body: "Weekly site walks with the principal architect. Snag lists are settled on the day; nothing is deferred to the punch list.",
  },
  {
    n: "04",
    title: "Finishes",
    body: "The slow phase. Stone-laying, joinery installs, plastering, the final coat. Most of the photographs in our journal are from this phase.",
  },
  {
    n: "05",
    title: "Walk-Through",
    body: "Three private walk-throughs with the owners — at finishes, at commissioning, and on handover day. We answer questions. We adjust.",
  },
  {
    n: "06",
    title: "After",
    body: "Twelve months of close support. We come back at six, then at twelve. We fix what needs fixing. We remember the building is yours, not ours.",
  },
] as const;

export default function Velocity() {
  return (
    <PageShell
      eyebrow="Velocity"
      title={
        <>
      <Seo
        title={"Velocity — our delivery standard"}
        description={"Four pillars, six stages. The program that defines how every Vivanterra residence is delivered, from the first walk of the plot to the twelfth month after handover."}
      />
          A standard <span className="italic text-gold">of our own.</span>
        </>
      }
      intro="Velocity is the program that defines how every Vivanterra residence is delivered — from the first walk of the plot to the twelfth month after handover."
    >
      {/* Pillars */}
      <section className="mt-4">
        <Reveal>
          <div className="flex items-center gap-3 mb-10">
            <span className="h-px w-10 bg-gold" />
            <span className="eyebrow text-muted-soft">01 / Four pillars</span>
          </div>
        </Reveal>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
          {PILLARS.map((p, i) => {
            const Icon = p.icon;
            return (
              <motion.article
                key={p.title}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-10% 0px" }}
                transition={{
                  duration: 0.6,
                  delay: i * 0.08,
                  ease: [0.2, 0.8, 0.2, 1],
                }}
                className="bg-ink text-paper rounded-sm p-8 md:p-9 h-full"
                style={{
                  boxShadow:
                    "0 30px 80px -30px rgba(78,115,83,0.6), 0 0 0 1px rgba(196,169,106,0.18)",
                }}
              >
                <span className="inline-flex w-11 h-11 rounded-full border border-gold/40 text-gold items-center justify-center mb-6">
                  <Icon size={18} />
                </span>
                <h3
                  className="font-display mb-4 uppercase"
                  style={{
                    fontSize: "clamp(20px, 2vw, 26px)",
                    fontWeight: 700,
                    letterSpacing: "-0.01em",
                    lineHeight: 1.05,
                  }}
                >
                  {p.title}
                </h3>
                <p className="text-paper/75 text-sm leading-relaxed">
                  {p.body}
                </p>
              </motion.article>
            );
          })}
        </div>
      </section>

      {/* Stages */}
      <section className="mt-24 md:mt-32">
        <Reveal>
          <div className="hairline-dark mb-12 md:mb-16" />
          <div className="flex items-center gap-3 mb-10">
            <span className="h-px w-10 bg-gold" />
            <span className="eyebrow text-muted-soft">02 / Six stages</span>
          </div>
          <h2
            className="font-display text-ink uppercase mb-12 md:mb-16"
            style={{
              fontSize: "clamp(36px, 5vw, 68px)",
              fontWeight: 700,
              letterSpacing: "-0.02em",
              lineHeight: 0.98,
            }}
          >
            From the first walk{" "}
            <span className="italic text-gold font-light normal-case">
              to the twelfth month.
            </span>
          </h2>
        </Reveal>

        <ol className="relative">
          {STAGES.map((s, i) => (
            <Reveal key={s.n} delay={i * 0.05}>
              <li className="grid md:grid-cols-12 gap-6 md:gap-12 py-10 md:py-12 border-b border-line-dark last:border-b-0">
                <div className="md:col-span-2">
                  <span className="font-display text-gold text-3xl md:text-4xl tabular-nums">
                    {s.n}
                  </span>
                </div>
                <div className="md:col-span-4">
                  <h3
                    className="font-display text-ink uppercase"
                    style={{
                      fontSize: "clamp(22px, 2.4vw, 30px)",
                      fontWeight: 700,
                      letterSpacing: "-0.01em",
                      lineHeight: 1.05,
                    }}
                  >
                    {s.title}
                  </h3>
                </div>
                <div className="md:col-span-6">
                  <p className="text-ink/80 leading-relaxed">{s.body}</p>
                </div>
              </li>
            </Reveal>
          ))}
        </ol>
      </section>

      {/* Promise + CTA */}
      <section className="mt-24 md:mt-32">
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
              className="absolute -top-1/4 -right-1/4 w-[80%] h-[80%] pointer-events-none"
              style={{
                background:
                  "radial-gradient(ellipse at center, rgba(196,169,106,0.18) 0%, rgba(196,169,106,0) 70%)",
                filter: "blur(40px)",
              }}
            />
            <div className="relative grid md:grid-cols-12 gap-8 items-start">
              <div className="md:col-span-7">
                <div className="eyebrow text-gold mb-5">The Promise</div>
                <h3
                  className="font-display uppercase"
                  style={{
                    fontSize: "clamp(28px, 3.6vw, 48px)",
                    fontWeight: 700,
                    letterSpacing: "-0.02em",
                    lineHeight: 1,
                  }}
                >
                  Velocity is what makes a Vivanterra residence{" "}
                  <span className="italic text-gold font-light normal-case">
                    a Vivanterra residence.
                  </span>
                </h3>
                <p className="mt-6 text-paper/80 leading-relaxed max-w-xl">
                  We do not move quickly. We move carefully, and at a pace the
                  building tells us it can hold. Velocity is not a deadline — it
                  is a standard.
                </p>
              </div>
              <div className="md:col-span-5 md:pl-6 lg:pl-12">
                <div className="flex flex-col gap-4">
                  <Link
                    to="/contact"
                    className="group inline-flex items-center justify-between gap-3 h-14 px-6 bg-gold text-ink font-semibold text-[12px] tracking-[0.20em] uppercase rounded-sm hover:bg-paper transition-colors"
                  >
                    Begin a conversation
                    <ArrowUpRight
                      size={16}
                      className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                    />
                  </Link>
                  <Link
                    to="/projects"
                    className="group inline-flex items-center justify-between gap-3 h-14 px-6 border border-paper/30 text-paper font-medium text-[12px] tracking-[0.20em] uppercase rounded-sm hover:bg-paper/10 transition-colors"
                  >
                    See the portfolio
                    <ArrowUpRight
                      size={16}
                      className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                    />
                  </Link>
                </div>

                <div className="mt-8 grid grid-cols-3 gap-4 text-paper/70">
                  <Stat icon={<Layers size={14} />} label="Projects" value="20+" />
                  <Stat icon={<MapPin size={14} />} label="Bengaluru" value="15 yrs" />
                  <Stat icon={<Feather size={14} />} label="Studio team" value="24" />
                </div>
              </div>
            </div>
          </div>
        </Reveal>
      </section>
    </PageShell>
  );
}

function Stat({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="flex flex-col gap-1">
      <span className="inline-flex items-center gap-1.5 text-gold">
        {icon}
        <span className="font-display text-paper text-xl md:text-2xl tabular-nums">
          {value}
        </span>
      </span>
      <span className="eyebrow text-paper/55 text-[10px]">{label}</span>
    </div>
  );
}
