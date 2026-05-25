import PageShell from "@/components/ui/PageShell";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowUpRight, MapPin } from "lucide-react";
import Seo from "@/components/seo/Seo";
import { getProjects, type ProjectStatus } from "@/data/projects";

interface Props {
  status: ProjectStatus;
}

const COPY: Record<ProjectStatus, { intro: string; tagline: string }> = {
  Ongoing: {
    intro: "Sites currently under active construction.",
    tagline: "in motion.",
  },
  Upcoming: {
    intro: "New residences in design and pre-construction.",
    tagline: "in the making.",
  },
  Completed: {
    intro: "Delivered residences from our archive.",
    tagline: "delivered.",
  },
};

export default function ProjectsByStatus({ status }: Props) {
  const c = COPY[status];
  const projects = getProjects(status);

  return (
    <>
      <Seo
        title={`${status} Projects`}
        description={`Vivanterra ${status.toLowerCase()} projects — ${c.intro}`}
      />
    <PageShell
      eyebrow={`Projects — ${status}`}
      title={
        <>
          {status} <span className="italic text-gold">{c.tagline}</span>
        </>
      }
      intro={c.intro}
    >
      {projects.length === 0 ? (
        <div className="border border-dashed border-line-dark rounded-sm py-16 text-center text-muted-soft">
          No {status.toLowerCase()} projects to show yet. Check back soon.
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10">
          {projects.map((p, i) => (
            <motion.article
              key={p.slug}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-10% 0px" }}
              transition={{
                duration: 0.6,
                delay: i * 0.06,
                ease: [0.2, 0.8, 0.2, 1],
              }}
              className="group"
            >
              <Link to={`/projects/${p.slug}`} className="block">
                <div className="relative img-zoom aspect-[4/5] overflow-hidden rounded-sm bg-ink/5 mb-6">
                  <img
                    src={p.hero}
                    alt={p.title}
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
                  <span className="absolute top-4 left-4 inline-flex items-center gap-1.5 bg-paper/90 backdrop-blur-sm text-ink px-3 py-1 text-[10px] tracking-[0.18em] font-medium uppercase rounded-full">
                    {p.status}
                  </span>
                  {p.possession && (
                    <span className="absolute bottom-4 right-4 inline-flex items-center gap-1 text-paper/85 text-[11px] tabular-nums">
                      Possession {p.possession}
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-2 text-[11px] tracking-[0.16em] uppercase text-muted-soft mb-3">
                  <MapPin size={11} className="opacity-60" />
                  <span>{p.location}</span>
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
                  {p.title}
                </h3>
                <p className="mt-3 text-muted-soft text-sm leading-relaxed line-clamp-3">
                  {p.summary}
                </p>
                <span className="inline-flex items-center gap-1 mt-5 text-[12px] tracking-[0.16em] uppercase font-medium text-ink nav-link group-hover:text-gold">
                  View project
                  <ArrowUpRight
                    size={13}
                    className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                  />
                </span>
              </Link>
            </motion.article>
          ))}
        </div>
      )}
    </PageShell>
    </>
  );
}
