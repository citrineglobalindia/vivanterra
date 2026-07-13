import Seo from "@/components/seo/Seo";
import { useMemo, useState } from "react";
import PageShell from "@/components/ui/PageShell";
import Reveal from "@/components/ui/Reveal";
import { motion } from "framer-motion";
import { ArrowUpRight, Clock, Search } from "lucide-react";

import { Link } from "react-router-dom";
import { POSTS, type Category, type Post } from "@/data/posts";

const CATEGORIES: ("All" | Category)[] = [
  "All",
  "Architecture",
  "Craft",
  "Vivanterra Notes",
  "News",
  "Updates",
  "Inside Vivanterra",
];

/* ── Component ───────────────────────────────────────── */

export default function Blogs() {
  const [category, setCategory] = useState<(typeof CATEGORIES)[number]>("All");
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    let xs: Post[] = POSTS;
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
  }, [category, query]);

  const counts = useMemo(() => {
    const map: Record<string, number> = { All: POSTS.length };
    for (const p of POSTS) map[p.category] = (map[p.category] || 0) + 1;
    return map;
  }, []);

  return (
    <PageShell
      title={
        <>
      <Seo
        title={"Journal"}
        description={"The Vivanterra Journal — essays, field notes, conversations and progress reports on materials, craft, and city."}
      />
          The Vivanterra <span className="">Journal.</span>
        </>
      }
    >
      {/* ───────── 02 · Filter + Search ───────── */}
      <section className="mb-12 md:mb-16">

        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
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
      <Link to={`/blogs/${post.slug}`} className="block">
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
      </Link>
    </motion.article>
  );
}
