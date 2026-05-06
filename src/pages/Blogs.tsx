import { useMemo, useState } from "react";
import PageShell from "@/components/ui/PageShell";
import Reveal from "@/components/ui/Reveal";
import { motion } from "framer-motion";
import { ArrowUpRight, BookOpen, Clock, Mail, Search } from "lucide-react";

/* ── Data ────────────────────────────────────────────── */

type Category =
  | "Architecture"
  | "Craft"
  | "Investment"
  | "Studio Notes"
  | "City";

type Post = {
  slug: string;
  title: string;
  dek: string;
  category: Category;
  author: string;
  date: string;
  readingTime: string;
  image: string;
  featured?: boolean;
};

const POSTS: Post[] = [
  {
    slug: "year-of-materials",
    title: "Inside the studio: a year of materials.",
    dek: "Twelve months of stone, brass and oak — our head of design walks through the year's discoveries and the houses they shaped.",
    category: "Craft",
    author: "Reema Iyer",
    date: "April 2026",
    readingTime: "8 min read",
    image:
      "https://images.unsplash.com/photo-1505691938895-1758d7feb511?auto=format&fit=crop&w=1600&q=85",
    featured: true,
  },
  {
    slug: "aurelia-bay-tops-out",
    title: "Aurelia Bay tops out in Sadashiva Nagar.",
    dek: "The first of our 2027 deliveries reaches its full height ahead of schedule. A note from the site, mid-celebration.",
    category: "Studio Notes",
    author: "Karthik Rao",
    date: "March 2026",
    readingTime: "5 min read",
    image:
      "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1200&q=85",
  },
  {
    slug: "founding-architect",
    title: "A conversation with our founding architect.",
    dek: "On patience, restraint and the future of the Bengaluru skyline. Aravind Menon, in conversation with our editorial lead.",
    category: "Architecture",
    author: "Sara D'Souza",
    date: "February 2026",
    readingTime: "12 min read",
    image:
      "https://images.unsplash.com/photo-1493809842364-78817add7ffb?auto=format&fit=crop&w=1200&q=85",
  },
  {
    slug: "courtyard-as-thesis",
    title: "The courtyard, again — a small thesis.",
    dek: "Why every Vivanterra residence begins, in some form, with a void at its centre. Light, breeze, and the long Indian afternoon.",
    category: "Architecture",
    author: "Aravind Menon",
    date: "February 2026",
    readingTime: "7 min read",
    image:
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=85",
  },
  {
    slug: "investment-the-long-view",
    title: "The long view: a residence as compound interest.",
    dek: "Quiet thoughts on land, location and the kind of architecture that gains rather than loses meaning over time.",
    category: "Investment",
    author: "Vivek Pillai",
    date: "January 2026",
    readingTime: "9 min read",
    image:
      "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=85",
  },
  {
    slug: "bengaluru-twelfth-floor",
    title: "Bengaluru, from a twelfth-floor window.",
    dek: "Fifteen years of watching this city grow — what we've seen and what we hope to keep.",
    category: "City",
    author: "Aravind Menon",
    date: "January 2026",
    readingTime: "6 min read",
    image:
      "https://images.unsplash.com/photo-1486325212027-8081e485255e?auto=format&fit=crop&w=1200&q=85",
  },
  {
    slug: "joinery-millimetre",
    title: "Joinery, to the millimetre.",
    dek: "A field note from our cabinetmaker's workshop — and what 'a hand-finished detail' actually costs to make.",
    category: "Craft",
    author: "Reema Iyer",
    date: "December 2025",
    readingTime: "5 min read",
    image:
      "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?auto=format&fit=crop&w=1200&q=85",
  },
  {
    slug: "ten-houses-in",
    title: "Ten houses in, and what we got wrong.",
    dek: "A candid retrospective from our principal architect on the lessons that shaped the next decade of work.",
    category: "Studio Notes",
    author: "Aravind Menon",
    date: "December 2025",
    readingTime: "10 min read",
    image:
      "https://images.unsplash.com/photo-1494526585095-c41746248156?auto=format&fit=crop&w=1200&q=85",
  },
  {
    slug: "stone-from-rajasthan",
    title: "On choosing stone from Rajasthan.",
    dek: "Why we travel for the right block — and what we look for when we get there.",
    category: "Craft",
    author: "Reema Iyer",
    date: "November 2025",
    readingTime: "6 min read",
    image:
      "https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?auto=format&fit=crop&w=1200&q=85",
  },
];

const CATEGORIES: ("All" | Category)[] = [
  "All",
  "Architecture",
  "Craft",
  "Studio Notes",
  "Investment",
  "City",
];

/* ── Component ───────────────────────────────────────── */

export default function Blogs() {
  const [category, setCategory] = useState<(typeof CATEGORIES)[number]>("All");
  const [query, setQuery] = useState("");

  const featured = POSTS.find((p) => p.featured) ?? POSTS[0];
  const others = POSTS.filter((p) => p !== featured);

  const filtered = useMemo(() => {
    let xs = others;
    if (category !== "All") xs = xs.filter((p) => p.category === category);
    if (query.trim()) {
      const q = query.toLowerCase();
      xs = xs.filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          p.dek.toLowerCase().includes(q) ||
          p.author.toLowerCase().includes(q),
      );
    }
    return xs;
  }, [category, query, others]);

  const counts = useMemo(() => {
    const map: Record<string, number> = { All: POSTS.length };
    for (const p of POSTS) map[p.category] = (map[p.category] || 0) + 1;
    return map;
  }, []);

  return (
    <PageShell
      eyebrow="Journal"
      title={
        <>
          Notes from <span className="italic text-gold">the studio.</span>
        </>
      }
      intro="Essays, field notes, conversations and progress reports — a quiet record of how we work, what we choose, and what we're learning."
    >
      {/* ───────── 01 · Featured ───────── */}
      <section className="mb-20 md:mb-28">
        <Reveal>
          <div className="flex items-center gap-3 mb-10">
            <span className="h-px w-10 bg-gold" />
            <span className="eyebrow text-muted-soft">01 / Featured Essay</span>
          </div>
        </Reveal>

        <Reveal delay={0.1}>
          <a
            href="#"
            className="group grid md:grid-cols-12 gap-8 md:gap-12 items-start"
          >
            <div className="md:col-span-7">
              <div className="relative img-zoom aspect-[16/10] overflow-hidden rounded-sm bg-ink/5">
                <img
                  src={featured.image}
                  alt={featured.title}
                  loading="eager"
                  className="h-full w-full object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-[1.04]"
                />
                <div
                  aria-hidden
                  className="absolute inset-0 pointer-events-none"
                  style={{
                    background:
                      "linear-gradient(180deg, rgba(0,0,0,0) 60%, rgba(14,14,16,0.35) 100%)",
                  }}
                />
                <span className="absolute top-5 left-5 inline-flex items-center gap-1.5 bg-gold text-ink px-3 py-1.5 text-[10px] tracking-[0.18em] font-semibold uppercase">
                  Featured
                </span>
              </div>
            </div>
            <div className="md:col-span-5 md:pt-2">
              <div className="flex items-center gap-3 text-[11px] tracking-[0.16em] uppercase text-muted-soft mb-5">
                <span className="text-gold">{featured.category}</span>
                <span className="w-1 h-1 rounded-full bg-ink/30" />
                <span>{featured.date}</span>
                <span className="w-1 h-1 rounded-full bg-ink/30" />
                <span className="inline-flex items-center gap-1">
                  <Clock size={11} className="opacity-60" />
                  {featured.readingTime}
                </span>
              </div>
              <h2
                className="font-display text-ink group-hover:text-gold transition-colors"
                style={{
                  fontSize: "clamp(28px, 3.6vw, 48px)",
                  fontWeight: 300,
                  letterSpacing: "-0.02em",
                  lineHeight: 1.05,
                }}
              >
                {featured.title}
              </h2>
              <p className="mt-6 text-ink/80 leading-relaxed text-[15px] md:text-base max-w-md">
                {featured.dek}
              </p>
              <div className="mt-7 flex items-center gap-4">
                <span className="w-10 h-10 rounded-full bg-ink/5 flex items-center justify-center text-gold">
                  <BookOpen size={14} />
                </span>
                <div>
                  <div className="text-ink text-sm font-medium">
                    {featured.author}
                  </div>
                  <div className="eyebrow text-muted-soft text-[10px]">
                    The studio
                  </div>
                </div>
              </div>
              <span className="inline-flex items-center gap-1 mt-8 text-[12px] tracking-[0.16em] uppercase font-medium text-ink nav-link group-hover:text-gold">
                Read essay
                <ArrowUpRight
                  size={14}
                  className="transition-transform group-hover:translate-x-1 group-hover:-translate-y-0.5"
                />
              </span>
            </div>
          </a>
        </Reveal>
      </section>

      {/* ───────── 02 · Filter + Search ───────── */}
      <section className="mb-12 md:mb-16">
        <div className="hairline-dark mb-12 md:mb-16" />

        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <Reveal>
            <div className="flex items-center gap-3">
              <span className="h-px w-10 bg-gold" />
              <span className="eyebrow text-muted-soft">02 / All Essays</span>
            </div>
          </Reveal>

          {/* Search */}
          <Reveal delay={0.1}>
            <div className="relative w-full lg:w-72">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ink/45 pointer-events-none">
                <Search size={14} />
              </span>
              <input
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search essays…"
                className="w-full bg-[rgba(78,115,83,0.04)] border border-line-dark rounded-full pl-9 pr-4 py-2.5 text-sm text-ink placeholder:text-ink/40 outline-none focus:border-gold focus:bg-paper transition-colors"
              />
            </div>
          </Reveal>
        </div>

        {/* Category chips */}
        <Reveal delay={0.15}>
          <div className="flex flex-wrap gap-2 mt-6">
            {CATEGORIES.map((c) => {
              const active = category === c;
              return (
                <button
                  key={c}
                  type="button"
                  onClick={() => setCategory(c)}
                  className={[
                    "inline-flex items-center gap-2 px-4 h-10 rounded-full border text-[11px] tracking-[0.16em] uppercase font-medium transition-all",
                    active
                      ? "bg-ink text-paper border-ink shadow-[0_8px_24px_-12px_rgba(78,115,83,0.5)]"
                      : "border-ink/25 text-ink hover:border-gold hover:text-gold",
                  ].join(" ")}
                  aria-pressed={active}
                >
                  <span>{c}</span>
                  <span
                    className={[
                      "tabular-nums text-[10px] px-1.5 py-0.5 rounded-full",
                      active ? "bg-gold/30 text-paper" : "bg-ink/10 text-ink/70",
                    ].join(" ")}
                  >
                    {counts[c] ?? 0}
                  </span>
                </button>
              );
            })}
          </div>
        </Reveal>
      </section>

      {/* ───────── 03 · Grid ───────── */}
      <section className="mb-24 md:mb-32">
        {filtered.length === 0 ? (
          <div className="border border-dashed border-line-dark rounded-sm py-16 text-center text-muted-soft">
            No essays match your search. Try another category or term.
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10">
            {filtered.map((p, i) => (
              <PostCard key={p.slug} post={p} index={i} />
            ))}
          </div>
        )}
      </section>

      {/* ───────── 04 · Subscribe ───────── */}
      <section>
        <div className="hairline-dark mb-16 md:mb-20" />

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-10% 0px" }}
          transition={{ duration: 0.7, ease: [0.2, 0.8, 0.2, 1] }}
          className="relative overflow-hidden rounded-sm bg-ink text-paper p-10 md:p-16"
          style={{
            boxShadow:
              "0 30px 80px -30px rgba(78,115,83,0.6), 0 0 0 1px rgba(196,169,106,0.18)",
          }}
        >
          {/* Ambient */}
          <div
            aria-hidden
            className="absolute -top-1/3 -right-1/4 w-[80%] h-[120%] pointer-events-none"
            style={{
              background:
                "radial-gradient(ellipse at center, rgba(196,169,106,0.18) 0%, rgba(196,169,106,0) 70%)",
              filter: "blur(40px)",
            }}
          />
          <div className="relative grid md:grid-cols-12 gap-8 items-center">
            <div className="md:col-span-7">
              <div className="eyebrow text-gold mb-4">The Journal</div>
              <h3
                className="font-display"
                style={{
                  fontSize: "clamp(28px, 3.6vw, 48px)",
                  fontWeight: 300,
                  letterSpacing: "-0.02em",
                  lineHeight: 1.05,
                }}
              >
                A quiet letter,
                <br />
                <span className="italic text-gold">once a season.</span>
              </h3>
              <p className="mt-5 text-paper/75 leading-relaxed max-w-xl">
                Field notes from the studio, four times a year. No marketing,
                no calendar invites — just one good read, in your inbox.
              </p>
            </div>
            <div className="md:col-span-5">
              <form
                onSubmit={(e) => e.preventDefault()}
                className="flex items-center gap-2"
              >
                <div className="relative flex-1">
                  <Mail
                    size={14}
                    className="absolute left-3.5 top-1/2 -translate-y-1/2 text-paper/50"
                  />
                  <input
                    type="email"
                    placeholder="you@studio.com"
                    className="w-full bg-paper/10 border border-paper/25 rounded-full pl-9 pr-4 py-3 text-sm text-paper placeholder:text-paper/40 outline-none focus:border-gold transition-colors"
                  />
                </div>
                <button
                  type="submit"
                  className="inline-flex items-center justify-center h-11 w-11 rounded-full bg-gold text-ink hover:bg-paper transition-colors"
                  aria-label="Subscribe"
                >
                  <ArrowUpRight size={16} />
                </button>
              </form>
              <p className="mt-3 text-[11px] text-paper/55 leading-relaxed">
                We send four letters a year. Unsubscribe in a click.
              </p>
            </div>
          </div>
        </motion.div>
      </section>
    </PageShell>
  );
}

/* ── Post card ───────────────────────────────────────── */

function PostCard({ post, index }: { post: Post; index: number }) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-10% 0px" }}
      transition={{
        duration: 0.6,
        delay: index * 0.06,
        ease: [0.2, 0.8, 0.2, 1],
      }}
      className="group"
    >
      <a href="#" className="block">
        <div className="relative img-zoom aspect-[4/5] overflow-hidden rounded-sm bg-ink/5 mb-6">
          <img
            src={post.image}
            alt={post.title}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-[1.05]"
          />
          <div
            aria-hidden
            className="absolute inset-0 pointer-events-none"
            style={{
              background:
                "linear-gradient(180deg, rgba(0,0,0,0) 65%, rgba(14,14,16,0.55) 100%)",
            }}
          />
          {/* Category tag */}
          <span className="absolute top-4 left-4 inline-flex items-center gap-1.5 bg-paper/90 backdrop-blur-sm text-ink px-3 py-1 text-[10px] tracking-[0.18em] font-medium uppercase rounded-full">
            {post.category}
          </span>
          {/* Reading time */}
          <span className="absolute bottom-4 right-4 inline-flex items-center gap-1 text-paper/85 text-[11px] tabular-nums">
            <Clock size={11} className="opacity-70" />
            {post.readingTime}
          </span>
        </div>

        <div className="flex items-center gap-3 text-[11px] tracking-[0.16em] uppercase text-muted-soft mb-3">
          <span>{post.date}</span>
          <span className="w-1 h-1 rounded-full bg-ink/30" />
          <span className="text-ink/70">{post.author}</span>
        </div>

        <h3
          className="font-display text-ink group-hover:text-gold transition-colors"
          style={{
            fontSize: "clamp(20px, 2vw, 26px)",
            fontWeight: 400,
            letterSpacing: "-0.01em",
            lineHeight: 1.2,
          }}
        >
          {post.title}
        </h3>
        <p className="mt-3 text-muted-soft text-sm leading-relaxed line-clamp-3">
          {post.dek}
        </p>
        <span className="inline-flex items-center gap-1 mt-5 text-[12px] tracking-[0.16em] uppercase font-medium text-ink nav-link group-hover:text-gold">
          Read
          <ArrowUpRight
            size={13}
            className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
          />
        </span>
      </a>
    </motion.article>
  );
}
