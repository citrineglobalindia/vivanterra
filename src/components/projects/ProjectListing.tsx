import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowUpRight,
  Bed,
  Calendar,
  ChevronLeft,
  ChevronRight,
  IndianRupee,
  MapPin,
  Maximize2,
  Phone,
} from "lucide-react";
import Reveal from "@/components/ui/Reveal";
import { useProjects } from "@/lib/use-projects";
import {
  getProjectArea,
  getProjectConfig,
  getProjectPriceLabel,
  getProjectTypology,
  type Project,
  type ProjectStatus,
} from "@/data/projects";

type Filter = "All" | ProjectStatus;

const FILTERS: Filter[] = ["All", "Ongoing", "Upcoming", "Completed"];
const PAGE_SIZE = 6;

const FILTER_COPY: Record<Filter, { label: string; descriptor: string }> = {
  All: { label: "All Residences", descriptor: "Every Vivanterra project across stages." },
  Ongoing: { label: "Ongoing", descriptor: "Sites currently under active construction." },
  Upcoming: { label: "Upcoming", descriptor: "New residences in design and pre-construction." },
  Completed: { label: "Completed", descriptor: "Delivered residences from our archive." },
};

export default function ProjectListing({
  initialFilter = "All",
}: {
  initialFilter?: Filter;
}) {
  const [filter, setFilter] = useState<Filter>(initialFilter);
  const [page, setPage] = useState(1);
  const { projects: allProjects } = useProjects();

  const projects = useMemo(
    () =>
      filter === "All"
        ? allProjects
        : allProjects.filter((p) => p.status === filter),
    [filter, allProjects],
  );

  const totalPages = Math.max(1, Math.ceil(projects.length / PAGE_SIZE));
  const safePage = Math.min(page, totalPages);
  const visible = projects.slice(
    (safePage - 1) * PAGE_SIZE,
    safePage * PAGE_SIZE,
  );

  // Counts per filter for the pill badges
  const counts = useMemo(() => {
    return {
      All: allProjects.length,
      Ongoing: allProjects.filter((p) => p.status === "Ongoing").length,
      Upcoming: allProjects.filter((p) => p.status === "Upcoming").length,
      Completed: allProjects.filter((p) => p.status === "Completed").length,
    } satisfies Record<Filter, number>;
  }, [allProjects]);

  return (
    <div>
      {/* ───────── 01 · Filter tabs ───────── */}
      <Reveal>
        <div className="flex flex-wrap items-center gap-2.5 mb-10 md:mb-14">
          {FILTERS.map((f) => {
            const active = filter === f;
            return (
              <button
                key={f}
                type="button"
                onClick={() => {
                  setFilter(f);
                  setPage(1);
                }}
                aria-pressed={active}
                className={[
                  "inline-flex items-center gap-2 px-5 h-11 rounded-full border text-[11px] tracking-[0.16em] uppercase font-medium transition-all",
                  active
                    ? "bg-ink text-paper border-ink shadow-[0_8px_24px_-12px_rgba(78,115,83,0.5)]"
                    : "border-ink/25 text-ink hover:border-gold hover:text-gold",
                ].join(" ")}
              >
                <span>{f}</span>
                <span
                  className={[
                    "tabular-nums text-[10px] px-1.5 py-0.5 rounded-full",
                    active ? "bg-gold/30 text-paper" : "bg-ink/10 text-ink/70",
                  ].join(" ")}
                >
                  {counts[f]}
                </span>
              </button>
            );
          })}
        </div>
        <p className="text-muted-soft -mt-6 md:-mt-10 mb-10 md:mb-14 text-sm">
          {FILTER_COPY[filter].descriptor}
        </p>
      </Reveal>

      {/* ───────── 02 · Card grid ───────── */}
      {visible.length === 0 ? (
        <div className="border border-dashed border-line-dark rounded-sm py-16 text-center text-muted-soft">
          No {filter.toLowerCase()} projects to show. Try another filter.
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-7 md:gap-8">
          {visible.map((p, i) => (
            <ProjectCard key={p.slug} project={p} index={i} />
          ))}
        </div>
      )}

      {/* ───────── 03 · Pagination ───────── */}
      {totalPages > 1 && (
        <Reveal>
          <div className="mt-12 md:mt-16 flex items-center justify-center gap-2">
            <button
              type="button"
              disabled={safePage === 1}
              onClick={() => setPage((n) => Math.max(1, n - 1))}
              aria-label="Previous page"
              className="w-10 h-10 rounded-full border border-ink/25 flex items-center justify-center text-ink hover:border-gold hover:text-gold disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronLeft size={16} />
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => {
              const active = n === safePage;
              return (
                <button
                  key={n}
                  type="button"
                  onClick={() => setPage(n)}
                  aria-current={active ? "page" : undefined}
                  className={[
                    "w-10 h-10 rounded-full text-sm tabular-nums transition-colors",
                    active
                      ? "bg-ink text-paper"
                      : "text-ink hover:bg-ink/5",
                  ].join(" ")}
                >
                  {n}
                </button>
              );
            })}
            <button
              type="button"
              disabled={safePage === totalPages}
              onClick={() => setPage((n) => Math.min(totalPages, n + 1))}
              aria-label="Next page"
              className="w-10 h-10 rounded-full border border-ink/25 flex items-center justify-center text-ink hover:border-gold hover:text-gold disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </Reveal>
      )}
    </div>
  );
}

/* ───────── Project card ───────── */
function ProjectCard({ project, index }: { project: Project; index: number }) {
  const typology = getProjectTypology(project);
  const config = getProjectConfig(project);
  const area = getProjectArea(project);
  const price = getProjectPriceLabel(project);

  return (
    <motion.article
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-10% 0px" }}
      transition={{
        duration: 0.6,
        delay: index * 0.06,
        ease: [0.2, 0.8, 0.2, 1],
      }}
      className="group flex flex-col bg-paper border border-line-dark rounded-sm overflow-hidden hover:shadow-[0_24px_60px_-30px_rgba(0,0,0,0.18)] transition-shadow"
    >
      {/* Image */}
      <Link
        to={`/projects/${project.slug}`}
        className="relative img-zoom block aspect-[4/3] overflow-hidden bg-ink/5"
      >
        <img
          src={project.hero}
          alt={project.title}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-[1.05]"
        />
        <div
          aria-hidden
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "linear-gradient(180deg, rgba(0,0,0,0) 65%, rgba(14,14,16,0.5) 100%)",
          }}
        />
        <span className="absolute top-4 left-4 inline-flex items-center gap-1.5 bg-paper/90 backdrop-blur-sm text-ink px-3 py-1 text-[10px] tracking-[0.18em] font-medium uppercase rounded-full">
          {project.status}
        </span>
        {project.possession && (
          <span className="absolute top-4 right-4 inline-flex items-center gap-1 bg-ink/85 backdrop-blur-sm text-paper px-3 py-1 text-[10px] tracking-[0.18em] font-medium uppercase rounded-full">
            <Calendar size={11} />
            {project.possession}
          </span>
        )}
      </Link>

      {/* Body */}
      <div className="p-6 md:p-7 flex-1 flex flex-col">
        <Link to={`/projects/${project.slug}`} className="block">
          <h3
            className="font-display text-ink group-hover:text-gold transition-colors"
            style={{
              fontSize: "clamp(20px, 1.8vw, 24px)",
              fontWeight: 400,
              letterSpacing: "-0.01em",
              lineHeight: 1.2,
            }}
          >
            {project.title}
          </h3>
        </Link>
        <div className="mt-2 flex items-center gap-1.5 text-[11px] tracking-[0.14em] uppercase text-muted-soft">
          <MapPin size={11} className="opacity-70" />
          <span>{project.location}</span>
        </div>

        {/* Price strip */}
        <div className="mt-4 pb-4 border-b border-line-dark/60">
          <div className="text-[10px] tracking-[0.18em] uppercase text-gold mb-1">
            Price
          </div>
          <div className="font-display text-ink text-xl tabular-nums">
            {price}
          </div>
        </div>

        {/* Spec grid */}
        <dl className="mt-4 grid grid-cols-2 gap-y-3 gap-x-4 text-[12px]">
          {typology && (
            <SpecRow icon={<IndianRupee size={11} />} label="Type" value={typology} />
          )}
          {config && (
            <SpecRow icon={<Bed size={11} />} label="Config" value={config} />
          )}
          {area && (
            <SpecRow
              icon={<Maximize2 size={11} />}
              label="Unit size"
              value={area}
              span2
            />
          )}
        </dl>

        {/* CTAs */}
        <div className="mt-6 grid grid-cols-2 gap-2.5">
          <Link
            to={`/contact?project=${project.slug}&scope=visit`}
            className="inline-flex items-center justify-center gap-1.5 h-11 px-3 rounded-sm border border-ink/30 text-ink hover:bg-ink hover:text-paper hover:border-ink transition-colors text-[10.5px] tracking-[0.16em] uppercase font-medium"
          >
            <Phone size={12} />
            Site visit
          </Link>
          <Link
            to={`/contact?project=${project.slug}`}
            className="inline-flex items-center justify-center gap-1.5 h-11 px-3 rounded-sm bg-gold text-ink hover:bg-ink hover:text-paper transition-colors text-[10.5px] tracking-[0.16em] uppercase font-semibold"
          >
            Enquire now
          </Link>
        </div>

        <Link
          to={`/projects/${project.slug}`}
          className="inline-flex items-center gap-1 mt-5 text-[11px] tracking-[0.16em] uppercase font-medium text-ink hover:text-gold transition-colors self-start nav-link"
        >
          View project
          <ArrowUpRight size={12} />
        </Link>
      </div>
    </motion.article>
  );
}

function SpecRow({
  icon,
  label,
  value,
  span2,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  span2?: boolean;
}) {
  return (
    <div className={span2 ? "col-span-2" : undefined}>
      <dt className="flex items-center gap-1.5 text-[9.5px] tracking-[0.16em] uppercase text-muted-soft mb-1">
        <span className="text-gold opacity-80">{icon}</span>
        {label}
      </dt>
      <dd className="text-ink leading-snug">{value}</dd>
    </div>
  );
}
