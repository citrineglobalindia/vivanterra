import Seo from "@/components/seo/Seo";
import PageShell from "@/components/ui/PageShell";
import Reveal from "@/components/ui/Reveal";
import { motion } from "framer-motion";
import {
  ArrowUpRight,
  Compass,
  Heart,
  Leaf,
  Mail,
  Quote,
  Users,
} from "lucide-react";
import { Link } from "react-router-dom";

const PRINCIPLES = [
  {
    icon: Leaf,
    title: "Biophilic by design",
    body: "Every plan begins by asking how natural light, air and greenery flow through the space — before walls, before fixtures, before anything else.",
  },
  {
    icon: Compass,
    title: "Sustainable engineering",
    body: "Materials, mechanical systems and operating costs all examined through a long-term lens. We build what holds up — for the resident and for the planet.",
  },
  {
    icon: Users,
    title: "Community first",
    body: "A wellness journey shouldn't be walked alone. Vivanterra residences are built to foster meaningful interactions and a shared culture of conscious living.",
  },
  {
    icon: Heart,
    title: "Customer-led",
    body: "We listen intently to evolving lifestyle needs. Every detail is shaped by the families who will live there, not the trends that will pass by.",
  },
] as const;

const FOUNDERS = [
  {
    slug: "tej-singh",
    name: "Tej Singh",
    role: "Founder",
    photo: "/founders/tej-singh.jpeg",
    headline: "Crafting Spaces with Intention and Purpose",
    eyebrow: "The Vision",
    statement: [
      "When we conceptualized Vivanterra, the goal wasn't just to build structures, but to engineer environments that actively contribute to your well-being. True wellness-first real estate requires a meticulous, uncompromising approach to planning and execution. It means asking how a space feels, how the air flows, how natural light interacts with daily life, and how seamlessly nature can be integrated into modern architecture.",
      "For me, execution is where philosophy meets reality. Every Vivanterra project is designed through the lens of biophilic architecture, sustainable engineering, and precise spatial harmony. We are deeply committed to turning visionary design into a tangible, high-quality reality — ensuring that from the foundational layout to the final finishing touch, every square foot serves a purpose: to elevate, restore, and sustain your health and peace of mind.",
    ],
  },
  {
    slug: "rajath",
    name: "Rajath",
    role: "Co-Founder",
    photo: "/founders/rajath.jpeg",
    headline: "Understanding the Need of the Hour & Nurturing Community",
    eyebrow: "The Pulse",
    statement: [
      "Today, more than ever, the world is demanding a return to balance. The fast-paced nature of modern life has made us realize that true luxury isn't just about opulence; it is about time, health, and a deep sense of belonging. Understanding this 'need of the hour' is what drives our customer-first approach at Vivanterra. We listen intently to the evolving lifestyle needs of families who seek sanctuary without isolation.",
      "But a wellness journey shouldn't be walked alone. Beyond the physical boundaries of a home, we are passionately focused on community building. We are creating ecosystems where like-minded individuals can connect, thrive, and share a conscious lifestyle. Vivanterra is built to foster meaningful interactions, vibrant community spaces, and a shared culture of wellness — because a healthy life is happiest when lived together.",
    ],
  },
] as const;

export default function About() {
  return (
    <>
      <Seo
        title="About — wellness-first real estate"
        description="Vivanterra builds wellness-first residences in Bengaluru — biophilic architecture, sustainable engineering, and ecosystems of community and health."
      />
      <PageShell
        eyebrow="About — Vivanterra"
        title={
          <>
            More than homes —{" "}
            <span className="">ecosystems of health.</span>
          </>
        }
        intro="Vivanterra is a wellness-first real estate studio. We build environments that contribute, every day, to how their residents breathe, rest, and live."
      >
        {/* ───────── 01 · Mission + Vision ───────── */}
        <section className="mb-28 md:mb-40">
          <Reveal>
          </Reveal>

          <div className="grid lg:grid-cols-12 gap-10 lg:gap-16">
            <Reveal className="lg:col-span-6" delay={0.05}>
              <article
                className="relative h-full bg-ink text-paper rounded-sm p-10 md:p-12"
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
                <div className="relative">
                  <div className="eyebrow text-gold mb-5">Mission</div>
                  <p
                    className="font-display uppercase mb-6"
                    style={{
                      fontSize: "clamp(24px, 2.6vw, 34px)",
                      fontWeight: 700,
                      letterSpacing: "-0.02em",
                      lineHeight: 1.05,
                    }}
                  >
                    We build more than homes; we cultivate{" "}
                    <span className="font-light normal-case">
                      ecosystems of health.
                    </span>
                  </p>
                  <p className="text-paper/80 leading-relaxed text-[15px] md:text-base">
                    By integrating advanced sustainable practices with
                    wellness-first amenities, we ensure our residents truly
                    breathe deeper and live better every single day.
                  </p>
                </div>
              </article>
            </Reveal>

            <Reveal className="lg:col-span-6" delay={0.15}>
              <article className="relative h-full bg-paper border border-line-dark rounded-sm p-10 md:p-12">
                <div className="eyebrow text-gold mb-5">Vision</div>
                <p
                  className="font-display text-ink uppercase mb-6"
                  style={{
                    fontSize: "clamp(24px, 2.6vw, 34px)",
                    fontWeight: 700,
                    letterSpacing: "-0.02em",
                    lineHeight: 1.05,
                  }}
                >
                  To inspire a world where home is{" "}
                  <span className="font-light normal-case">
                    the primary source of well-being.
                  </span>
                </p>
                <p className="text-ink/80 leading-relaxed text-[15px] md:text-base">
                  A reset for what residential real estate can be — measured
                  not by square footage or finish, but by the daily quality of
                  life it enables.
                </p>
              </article>
            </Reveal>
          </div>
        </section>

        {/* ───────── 02 · Leadership ───────── */}
        <section className="mb-28 md:mb-40">
          <div className="hairline-dark mb-16 md:mb-20" />
          <Reveal>
            <h2
              className="font-display text-ink mb-14 md:mb-20"
              style={{
                fontSize: "clamp(36px, 5vw, 72px)",
                fontWeight: 300,
                letterSpacing: "-0.02em",
                lineHeight: 1,
              }}
            >
              Two voices,{" "}
              <span className="">one studio.</span>
            </h2>
          </Reveal>

          <div className="space-y-24 md:space-y-32">
            {FOUNDERS.map((f, idx) => (
              <FounderBlock key={f.slug} founder={f} flip={idx % 2 === 1} />
            ))}
          </div>
        </section>

        {/* ───────── 03 · The Principles ───────── */}
        <section className="mb-24 md:mb-32">
          <div className="hairline-dark mb-16 md:mb-20" />
          <Reveal>
            <h2
              className="font-display text-ink mb-14 md:mb-16"
              style={{
                fontSize: "clamp(36px, 5vw, 64px)",
                fontWeight: 300,
                letterSpacing: "-0.02em",
                lineHeight: 1,
              }}
            >
              Four principles that{" "}
              <span className="">shape every plan.</span>
            </h2>
          </Reveal>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
            {PRINCIPLES.map((p, i) => {
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
                  className="bg-paper border border-line-dark rounded-sm p-7 md:p-8 h-full"
                >
                  <span className="inline-flex w-11 h-11 rounded-full bg-ink/5 text-gold items-center justify-center mb-5">
                    <Icon size={18} />
                  </span>
                  <h3
                    className="font-display text-ink mb-3"
                    style={{
                      fontSize: "clamp(18px, 1.8vw, 22px)",
                      fontWeight: 400,
                      letterSpacing: "-0.01em",
                      lineHeight: 1.15,
                    }}
                  >
                    {p.title}
                  </h3>
                  <p className="text-ink/75 text-sm leading-relaxed">
                    {p.body}
                  </p>
                </motion.article>
              );
            })}
          </div>
        </section>

        {/* ───────── 04 · CTA ───────── */}
        <section>
          <div className="hairline-dark mb-12 md:mb-16" />
          <Reveal>
            <div className="grid md:grid-cols-12 gap-10 items-end">
              <div className="md:col-span-7">
                <div className="eyebrow text-gold mb-5">
                  Begin a conversation
                </div>
                <h2
                  className="font-display text-ink"
                  style={{
                    fontSize: "clamp(28px, 3.4vw, 44px)",
                    fontWeight: 300,
                    letterSpacing: "-0.02em",
                    lineHeight: 1.05,
                  }}
                >
                  Looking for a residence{" "}
                  <span className="">
                    that breathes with you?
                  </span>
                </h2>
              </div>
              <div className="md:col-span-4 md:col-start-9">
                <div className="text-base text-muted-soft leading-relaxed mb-6">
                  Reach out to discuss residences, partnerships, or career
                  opportunities at Vivanterra.
                </div>
                <Link
                  to="/contact"
                  className="inline-flex items-center gap-2 btn btn-dark"
                >
                  Get in touch
                  <ArrowUpRight size={16} className="btn-arrow" />
                </Link>
              </div>
            </div>
          </Reveal>
        </section>
      </PageShell>
    </>
  );
}

/* ───────── Founder block ───────── */
type Founder = (typeof FOUNDERS)[number];

function FounderBlock({
  founder,
  flip,
}: {
  founder: Founder;
  flip: boolean;
}) {
  return (
    <article className="grid lg:grid-cols-12 gap-10 lg:gap-16 items-start">
      <Reveal
        className={`lg:col-span-5 ${flip ? "lg:order-2" : ""}`}
        delay={0.05}
      >
        <div className="relative img-zoom aspect-[4/5] overflow-hidden rounded-sm bg-ink">
          {/* Initials placeholder, sits behind the <img> until the photo loads */}
          <div
            aria-hidden
            className="absolute inset-0 flex items-center justify-center"
            style={{
              background:
                "radial-gradient(ellipse at center top, rgba(196,169,106,0.18) 0%, rgba(196,169,106,0) 65%), linear-gradient(180deg, #2a3a30 0%, #1a2620 100%)",
            }}
          >
            <span
              className="font-display text-gold/40 select-none"
              style={{
                fontSize: "clamp(120px, 18vw, 220px)",
                fontWeight: 300,
                letterSpacing: "-0.04em",
                lineHeight: 1,
              }}
            >
              {founder.name
                .split(" ")
                .map((n) => n[0])
                .join("")
                .slice(0, 2)
                .toUpperCase()}
            </span>
          </div>

          <img
            src={founder.photo}
            alt={`${founder.name}, ${founder.role}`}
            loading="lazy"
            className="relative h-full w-full object-cover transition-opacity duration-500"
            onError={(e) => {
              // Photo not deployed — hide so the initials placeholder shows.
              (e.currentTarget as HTMLImageElement).style.opacity = "0";
            }}
          />
          <div
            aria-hidden
            className="absolute inset-0 pointer-events-none"
            style={{
              background:
                "linear-gradient(180deg, rgba(0,0,0,0) 55%, rgba(14,14,16,0.65) 100%)",
            }}
          />
          <div className="absolute bottom-6 left-6 right-6 text-paper">
            <div className="text-[10px] tracking-[0.22em] text-gold tabular-nums mb-2">
              {founder.role.toUpperCase()}
            </div>
            <p
              className="font-display"
              style={{
                fontSize: "clamp(22px, 2.6vw, 32px)",
                fontWeight: 400,
                letterSpacing: "-0.01em",
                lineHeight: 1.15,
              }}
            >
              {founder.name}
            </p>
          </div>
        </div>
      </Reveal>

      <div
        className={`lg:col-span-7 relative ${flip ? "lg:order-1 lg:pr-8" : "lg:pl-2"}`}
      >
        <div
          aria-hidden
          className={`absolute -top-12 w-[360px] h-[360px] pointer-events-none ${flip ? "-left-12" : "-right-12"}`}
          style={{
            background:
              "radial-gradient(ellipse at center, rgba(196,169,106,0.10) 0%, rgba(196,169,106,0) 60%)",
            filter: "blur(20px)",
          }}
        />

        <Reveal delay={0.1}>
          <div className="eyebrow text-gold mb-3">{founder.eyebrow}</div>
          <h3
            className="font-display text-ink mb-6"
            style={{
              fontSize: "clamp(24px, 3vw, 36px)",
              fontWeight: 400,
              letterSpacing: "-0.01em",
              lineHeight: 1.15,
            }}
          >
            {founder.headline}
          </h3>
        </Reveal>

        <Reveal delay={0.15}>
          <Quote size={36} className="text-gold/40 mb-4" strokeWidth={1.2} />
          <div className="space-y-5 text-ink/85 leading-relaxed text-[15px] md:text-[16.5px]">
            {founder.statement.map((para, i) => (
              <p key={i}>{para}</p>
            ))}
          </div>
        </Reveal>

        <Reveal delay={0.25}>
          <div className="mt-8 flex items-center gap-6">
            <div className="h-px w-12 bg-gold" />
            <div>
              <p
                className="font-display italic text-ink"
                style={{
                  fontSize: "clamp(18px, 2vw, 22px)",
                  fontWeight: 400,
                  letterSpacing: "-0.01em",
                  lineHeight: 1,
                }}
              >
                {founder.name}
              </p>
              <p className="eyebrow text-muted-soft mt-2">
                {founder.role} · Vivanterra
              </p>
            </div>
            <a
              href="mailto:hello@vivanterra.in"
              className="ml-auto inline-flex items-center justify-center w-10 h-10 rounded-full border border-line-dark text-ink hover:bg-ink hover:text-paper hover:border-ink transition-colors"
              aria-label={`Email ${founder.name}`}
            >
              <Mail size={14} />
            </a>
          </div>
        </Reveal>
      </div>
    </article>
  );
}
