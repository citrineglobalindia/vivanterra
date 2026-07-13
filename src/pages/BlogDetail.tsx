import { useParams, Link, Navigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  ArrowUpRight,
  BookOpen,
  Clock,
} from "lucide-react";
import Seo from "@/components/seo/Seo";
import PageShell from "@/components/ui/PageShell";
import Reveal from "@/components/ui/Reveal";
import { getPostBySlug, getRelatedPosts } from "@/data/posts";

export default function BlogDetail() {
  const { slug = "" } = useParams<{ slug: string }>();
  const post = getPostBySlug(slug);

  if (!post) {
    return <Navigate to="/404" replace />;
  }

  const related = getRelatedPosts(post.slug, 3);

  return (
    <>
      <Seo
        title={post.title}
        description={post.dek}
        image={post.image}
        path={`/blogs/${post.slug}`}
        type="article"
      />
    <PageShell
      eyebrow={`Journal — ${post.category}`}
      title={<>{post.title}</>}
      intro={post.dek}
    >
      {/* Back link */}
      <Reveal>
        <Link
          to="/blogs"
          className="inline-flex items-center gap-2 text-[11px] tracking-[0.18em] uppercase text-muted-soft hover:text-gold transition-colors"
        >
          <ArrowLeft size={14} />
          All essays
        </Link>
      </Reveal>

      {/* Hero image */}
      <Reveal>
        <div className="mt-12 md:mt-16 relative overflow-hidden rounded-sm bg-ink/5 aspect-[16/10]">
          <img
            src={post.image}
            alt={post.title}
            loading="eager"
            className="h-full w-full object-cover"
          />
        </div>
      </Reveal>


      {/* Body */}
      <article className="mt-16 md:mt-20 max-w-2xl mx-auto">
        {post.body.map((para, i) => (
          <Reveal key={i} delay={Math.min(i * 0.03, 0.3)}>
            <p
              className="text-ink/85 mb-6 leading-[1.85] text-[17px] md:text-[18px]"
              style={{ fontFamily: "Georgia, serif" }}
            >
              {para}
            </p>
          </Reveal>
        ))}
      </article>

      {/* Related */}
      {related.length > 0 && (
        <section className="mt-24 md:mt-32">
          <div className="hairline-dark mb-10 md:mb-16" />
          <div className="flex items-center gap-3 mb-10">
            <span className="h-px w-10 bg-gold" />
            <span className="eyebrow text-muted-soft">
              More from the journal
            </span>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10">
            {related.map((p, i) => (
              <motion.article
                key={p.slug}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-10% 0px" }}
                transition={{
                  duration: 0.6,
                  delay: i * 0.06,
                  ease: [0.2, 0.8, 0.2, 1],
                }}
                className="group"
              >
                <Link to={`/blogs/${p.slug}`} className="block">
                  <div className="relative img-zoom aspect-[4/5] overflow-hidden rounded-sm bg-ink/5 mb-5">
                    <img
                      src={p.image}
                      alt={p.title}
                      loading="lazy"
                      className="h-full w-full object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-[1.05]"
                    />
                    <span className="absolute top-4 left-4 inline-flex items-center gap-1.5 bg-paper/90 backdrop-blur-sm text-ink px-3 py-1 text-[10px] tracking-[0.18em] font-medium uppercase rounded-full">
                      {p.category}
                    </span>
                  </div>
                  <h3 className="font-display text-ink text-xl group-hover:text-gold transition-colors">
                    {p.title}
                  </h3>
                  <span className="inline-flex items-center gap-1 mt-4 text-[12px] tracking-[0.16em] uppercase font-medium text-ink nav-link group-hover:text-gold">
                    Read
                    <ArrowUpRight
                      size={13}
                      className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                    />
                  </span>
                </Link>
              </motion.article>
            ))}
          </div>
        </section>
      )}
    </PageShell>
    </>
  );
}
