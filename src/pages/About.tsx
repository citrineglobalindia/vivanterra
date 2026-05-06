import PageShell from "@/components/ui/PageShell";
import Reveal from "@/components/ui/Reveal";
import { motion } from "framer-motion";
import { ArrowUpRight, Linkedin, Mail, Quote } from "lucide-react";
import { Link } from "react-router-dom";

const STATS = [
  { value: "17", suffix: "+", label: "Years in practice" },
  { value: "36", suffix: "", label: "Residences delivered" },
  { value: "11", suffix: "", label: "Industry awards" },
  { value: "100", suffix: "%", label: "Client retention" },
];

const VALUES = [
  {
    n: "01",
    title: "Patience",
    body: "We refuse the deadline that compromises the work. Every detail is held until it is right.",
  },
  {
    n: "02",
    title: "Restraint",
    body: "Less, but better. Our buildings whisper rather than shout — drawn, then drawn again.",
  },
  {
    n: "03",
    title: "Craft",
    body: "Hand-finished stone, joinery to the millimetre, glazing to the gulf of light. Made to outlast us.",
  },
];

const TEAM = [
  {
    name: "Aravind Menon",
    role: "Founder & Principal Architect",
    photo:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=900&q=85",
    bio: "Architect of two decades, founder of the studio. Trained in Bombay, taught in Berlin.",
    linkedin: "https://www.linkedin.com/",
    email: "aravind@velociti.com",
  },
  {
    name: "Reema Iyer",
    role: "Director, Design",
    photo:
      "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=900&q=85",
    bio: "Leads our interiors atelier. RIBA-trained, with eight years at a leading London studio.",
    linkedin: "https://www.linkedin.com/",
    email: "reema@velociti.com",
  },
  {
    name: "Karthik Rao",
    role: "Director, Projects",
    photo:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=900&q=85",
    bio: "Oversees site, contractor and craft. Has delivered every Vivanterra residence to date.",
    linkedin: "https://www.linkedin.com/",
    email: "karthik@velociti.com",
  },
  {
    name: "Anika Sharma",
    role: "Head of Client Experience",
    photo:
      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=900&q=85",
    bio: "Your concierge from first conversation to final handover. Reads every enquiry herself.",
    linkedin: "https://www.linkedin.com/",
    email: "anika@velociti.com",
  },
  {
    name: "Vivek Pillai",
    role: "Head of Acquisitions",
    photo:
      "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=900&q=85",
    bio: "Sources every site. Believes the address makes the residence — never the other way around.",
    linkedin: "https://www.linkedin.com/",
    email: "vivek@velociti.com",
  },
  {
    name: "Sara D'Souza",
    role: "Head of Press & Editorial",
    photo:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=900&q=85",
    bio: "Custodian of the studio's voice — print, digital and the occasional handwritten letter.",
    linkedin: "https://www.linkedin.com/",
    email: "sara@velociti.com",
  },
];

export default function About() {
  return (
    <PageShell
      eyebrow="About — Vivanterra Real Estate"
      title={
        <>
          Building with <span className="italic text-gold">conviction.</span>
        </>
      }
      intro="Vivanterra Real Estate is a Bengaluru-based developer crafting residences that pair contemporary architecture with quiet, considered detail."
    >
      {/* ───────── 01 · About the Company ───────── */}
      <section className="mb-28 md:mb-40">
        <div className="grid lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          {/* Image */}
          <Reveal className="lg:col-span-6">
            <div className="relative img-zoom aspect-[4/5] overflow-hidden rounded-sm bg-ink/5">
              <img
                src="https://images.unsplash.com/photo-1494526585095-c41746248156?auto=format&fit=crop&w=1400&q=85"
                alt="Vivanterra studio interior"
                loading="lazy"
                className="h-full w-full object-cover"
              />
              <div
                aria-hidden
                className="absolute inset-0 pointer-events-none"
                style={{
                  background:
                    "linear-gradient(180deg, rgba(0,0,0,0) 60%, rgba(14,14,16,0.45) 100%)",
                }}
              />
              <div className="absolute bottom-6 left-6 right-6 text-paper">
                <span className="text-[10px] tracking-[0.22em] text-gold tabular-nums">
                  EST. 2009 · BENGALURU
                </span>
                <p className="font-display italic text-xl mt-2 leading-snug">
                  "A studio of unusual restraint."
                  <span className="block text-paper/70 not-italic eyebrow mt-2">
                    — Wallpaper*
                  </span>
                </p>
              </div>
            </div>
          </Reveal>

          {/* Body */}
          <div className="lg:col-span-6 lg:pt-2">
            <Reveal>
              <div className="flex items-center gap-3 mb-5">
                <span className="h-px w-10 bg-gold" />
                <span className="eyebrow text-muted-soft">
                  01 / About the Studio
                </span>
              </div>
            </Reveal>
            <Reveal delay={0.1}>
              <h2
                className="font-display text-ink"
                style={{
                  fontSize: "clamp(32px, 4vw, 56px)",
                  fontWeight: 300,
                  letterSpacing: "-0.02em",
                  lineHeight: 1.05,
                }}
              >
                A small atelier composing
                <br />
                <span className="italic text-gold">private residences.</span>
              </h2>
            </Reveal>

            <Reveal delay={0.2}>
              <div className="mt-8 space-y-5 text-ink/85 leading-relaxed text-[15px] md:text-base">
                <p>
                  Vivanterra was founded in 2009 with a single, quiet
                  conviction — that the residences of the next century should
                  be drawn slowly, built honestly, and held to a standard that
                  outlasts any moment of fashion.
                </p>
                <p>
                  We work in small numbers. Each project is led by a partner of
                  the studio from first sketch to final handover. We choose our
                  sites the way we choose our materials — by hand, by light,
                  by long conversation with the place itself.
                </p>
                <p>
                  Our work is concentrated in Bengaluru, with a small portfolio
                  of by-invitation projects across south India.
                </p>
              </div>
            </Reveal>

            <Reveal delay={0.3}>
              <Link
                to="/projects"
                className="inline-flex items-center gap-2 mt-8 btn btn-dark"
              >
                Explore residences
                <ArrowUpRight size={16} className="btn-arrow" />
              </Link>
            </Reveal>
          </div>
        </div>

        {/* Stats strip */}
        <Reveal delay={0.15}>
          <div className="hairline-dark mt-20 md:mt-28" />
          <div className="grid grid-cols-2 md:grid-cols-4 gap-y-10 gap-x-6 mt-12 md:mt-16">
            {STATS.map((s, i) => (
              <motion.div
                key={s.label}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-10% 0px" }}
                transition={{
                  duration: 0.7,
                  delay: i * 0.08,
                  ease: [0.2, 0.8, 0.2, 1],
                }}
                className="border-l border-line-dark pl-5"
              >
                <div className="font-display text-ink leading-none flex items-baseline">
                  <span
                    style={{
                      fontSize: "clamp(40px, 5vw, 72px)",
                      fontWeight: 300,
                      letterSpacing: "-0.03em",
                    }}
                    className="tabular-nums"
                  >
                    {s.value}
                  </span>
                  <span className="text-gold text-2xl md:text-3xl">
                    {s.suffix}
                  </span>
                </div>
                <div className="eyebrow text-muted-soft mt-3">{s.label}</div>
              </motion.div>
            ))}
          </div>
        </Reveal>

        {/* Values */}
        <Reveal delay={0.2}>
          <div className="hairline-dark mt-20 md:mt-28" />
          <div className="grid md:grid-cols-3 gap-10 md:gap-16 mt-12 md:mt-16">
            {VALUES.map((v, i) => (
              <motion.div
                key={v.n}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-10% 0px" }}
                transition={{
                  duration: 0.7,
                  delay: i * 0.1,
                  ease: [0.2, 0.8, 0.2, 1],
                }}
                className="relative pt-6"
              >
                <span className="absolute top-0 left-0 w-12 h-px bg-gold" />
                <div className="text-[11px] tracking-[0.22em] text-gold tabular-nums mb-3">
                  {v.n}
                </div>
                <h3 className="font-display text-ink text-2xl md:text-3xl font-light mb-3">
                  {v.title}
                </h3>
                <p className="text-muted-soft text-sm leading-relaxed">
                  {v.body}
                </p>
              </motion.div>
            ))}
          </div>
        </Reveal>
      </section>

      {/* ───────── 02 · Director's Speech ───────── */}
      <section className="mb-28 md:mb-40">
        <div className="hairline-dark mb-16 md:mb-24" />

        <div className="flex items-center gap-3 mb-12">
          <span className="h-px w-10 bg-gold" />
          <span className="eyebrow text-muted-soft">
            02 / Director's Letter
          </span>
        </div>

        <div className="grid lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          {/* Portrait */}
          <Reveal className="lg:col-span-5">
            <div className="relative img-zoom aspect-[4/5] overflow-hidden rounded-sm bg-ink/5">
              <img
                src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=1200&q=85"
                alt="Aravind Menon, Founder & Principal Architect"
                loading="lazy"
                className="h-full w-full object-cover"
              />
              <div
                aria-hidden
                className="absolute inset-0 pointer-events-none"
                style={{
                  background:
                    "linear-gradient(180deg, rgba(0,0,0,0) 55%, rgba(14,14,16,0.55) 100%)",
                }}
              />
              <div className="absolute bottom-6 left-6 right-6 text-paper">
                <div className="text-[10px] tracking-[0.22em] text-gold tabular-nums mb-2">
                  THE FOUNDER
                </div>
                <p
                  className="font-display"
                  style={{
                    fontSize: "clamp(20px, 2.4vw, 28px)",
                    fontWeight: 400,
                    letterSpacing: "-0.01em",
                    lineHeight: 1.15,
                  }}
                >
                  Aravind Menon
                </p>
                <p className="eyebrow text-paper/75 mt-1">
                  Founder & Principal Architect
                </p>
              </div>
            </div>
          </Reveal>

          {/* Letter */}
          <div className="lg:col-span-7 relative">
            {/* Soft gold halo */}
            <div
              aria-hidden
              className="absolute -top-16 -right-16 w-[400px] h-[400px] pointer-events-none"
              style={{
                background:
                  "radial-gradient(ellipse at center, rgba(196,169,106,0.08) 0%, rgba(196,169,106,0) 60%)",
                filter: "blur(20px)",
              }}
            />

            <Reveal delay={0.1}>
              <Quote
                size={48}
                className="text-gold/40 mb-4"
                strokeWidth={1.2}
              />
            </Reveal>

            <Reveal delay={0.15}>
              <blockquote
                className="font-display text-ink italic"
                style={{
                  fontSize: "clamp(22px, 2.6vw, 32px)",
                  fontWeight: 300,
                  lineHeight: 1.35,
                  letterSpacing: "-0.01em",
                }}
              >
                When we set up Vivanterra in 2009, we promised ourselves we
                would never build more than we could draw by hand. Seventeen
                years on, that promise is still the loudest voice in every
                meeting. A residence is not a product — it is a long
                correspondence with light, with material, and with the family
                who will one day come home to it. We are honoured to be
                trusted with that correspondence.
              </blockquote>
            </Reveal>

            <Reveal delay={0.3}>
              <div className="mt-10 flex items-center gap-6">
                <div className="h-px w-16 bg-gold" />
                <div>
                  <p
                    className="font-display italic text-ink"
                    style={{
                      fontSize: "clamp(22px, 2.4vw, 28px)",
                      fontWeight: 400,
                      letterSpacing: "-0.01em",
                      lineHeight: 1,
                    }}
                  >
                    Aravind Menon
                  </p>
                  <p className="eyebrow text-muted-soft mt-2">
                    Founder & Principal Architect · Vivanterra Real Estate
                  </p>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ───────── 03 · The Team ───────── */}
      <section>
        <div className="hairline-dark mb-16 md:mb-24" />

        <div className="grid md:grid-cols-12 gap-8 mb-12 md:mb-16 items-end">
          <div className="md:col-span-7">
            <div className="flex items-center gap-3 mb-5">
              <span className="h-px w-10 bg-gold" />
              <span className="eyebrow text-muted-soft">03 / The Team</span>
            </div>
            <h2
              className="font-display text-ink"
              style={{
                fontSize: "clamp(36px, 5vw, 72px)",
                fontWeight: 300,
                letterSpacing: "-0.02em",
                lineHeight: 1,
              }}
            >
              The hands behind
              <br />
              <span className="italic text-gold">every residence.</span>
            </h2>
          </div>
          <div className="md:col-span-4 md:col-start-9">
            <p className="text-muted-soft leading-relaxed">
              A small, deliberate team. Each member leads their craft; together
              they hold the studio's standard.
            </p>
          </div>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {TEAM.map((m, i) => (
            <TeamCard key={m.name} member={m} index={i} />
          ))}
        </div>

        {/* CTA */}
        <Reveal delay={0.2}>
          <div className="hairline-dark mt-20 md:mt-24" />
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 mt-12">
            <div>
              <div className="eyebrow text-gold mb-3">Working with us</div>
              <p
                className="font-display text-ink"
                style={{
                  fontSize: "clamp(22px, 2.5vw, 32px)",
                  fontWeight: 300,
                  letterSpacing: "-0.01em",
                  lineHeight: 1.2,
                }}
              >
                We hire rarely, but always with care.
              </p>
            </div>
            <Link to="/career" className="btn btn-dark">
              View open roles
              <ArrowUpRight size={16} className="btn-arrow" />
            </Link>
          </div>
        </Reveal>
      </section>
    </PageShell>
  );
}

/* ── Team card ───────────────────────────────────────── */

type Member = (typeof TEAM)[number];

function TeamCard({ member, index }: { member: Member; index: number }) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-10% 0px" }}
      transition={{
        duration: 0.7,
        delay: index * 0.07,
        ease: [0.2, 0.8, 0.2, 1],
      }}
      className="group relative overflow-hidden rounded-sm bg-paper border border-line-dark hover:border-gold transition-colors duration-500"
      style={{
        boxShadow:
          "0 12px 30px -18px rgba(78,115,83,0.25), 0 0 0 1px rgba(196,169,106,0)",
      }}
    >
      {/* Photo */}
      <div className="relative aspect-[4/5] overflow-hidden bg-ink/5">
        <img
          src={member.photo}
          alt={member.name}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-[1.06]"
        />
        {/* Gradient on hover */}
        <div
          aria-hidden
          className="absolute inset-0 pointer-events-none transition-opacity duration-500 opacity-60 group-hover:opacity-90"
          style={{
            background:
              "linear-gradient(180deg, rgba(14,14,16,0) 35%, rgba(14,14,16,0.85) 100%)",
          }}
        />
        {/* Hover bio overlay */}
        <div className="absolute inset-x-5 bottom-5 text-paper">
          <p
            className="font-display"
            style={{
              fontSize: 22,
              fontWeight: 400,
              letterSpacing: "-0.01em",
              lineHeight: 1.15,
            }}
          >
            {member.name}
          </p>
          <p className="eyebrow text-gold mt-1.5">{member.role}</p>
          <p className="text-[12.5px] text-paper/85 leading-snug mt-3 max-h-0 overflow-hidden opacity-0 group-hover:max-h-32 group-hover:opacity-100 transition-all duration-500">
            {member.bio}
          </p>
        </div>

        {/* Top-right number tab */}
        <div className="absolute top-4 right-4 px-2 py-1 bg-ink/40 backdrop-blur-sm text-paper text-[10px] tracking-[0.22em] tabular-nums">
          {String(index + 1).padStart(2, "0")}
        </div>
      </div>

      {/* Footer with social */}
      <div className="flex items-center justify-between gap-3 px-5 py-4 bg-paper">
        <div className="min-w-0">
          <div className="text-ink text-sm font-medium truncate">
            {member.name}
          </div>
          <div className="text-muted-soft text-[11px] tracking-[0.16em] uppercase truncate">
            {member.role}
          </div>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <a
            href={member.linkedin}
            target="_blank"
            rel="noreferrer"
            aria-label={`${member.name} on LinkedIn`}
            className="w-8 h-8 rounded-full border border-line-dark flex items-center justify-center text-ink hover:bg-gold hover:text-ink hover:border-gold transition-colors"
          >
            <Linkedin size={13} />
          </a>
          <a
            href={`mailto:${member.email}`}
            aria-label={`Email ${member.name}`}
            className="w-8 h-8 rounded-full border border-line-dark flex items-center justify-center text-ink hover:bg-gold hover:text-ink hover:border-gold transition-colors"
          >
            <Mail size={13} />
          </a>
        </div>
      </div>
    </motion.article>
  );
}
