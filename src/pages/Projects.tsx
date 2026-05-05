import PageShell from "@/components/ui/PageShell";
import { Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";
import { motion } from "framer-motion";

const STATUSES = [
  {
    to: "/projects/ongoing",
    label: "Ongoing Projects",
    desc: "Residences currently under construction across our active sites.",
    count: "06",
  },
  {
    to: "/projects/upcoming",
    label: "Upcoming Projects",
    desc: "New launches taking shape in design and pre-construction.",
    count: "04",
  },
  {
    to: "/projects/completed",
    label: "Completed Projects",
    desc: "Delivered residences and the families now calling them home.",
    count: "12",
  },
];

export default function Projects() {
  return (
    <PageShell
      eyebrow="Projects"
      title={
        <>
          A portfolio in <span className="italic text-gold">progress.</span>
        </>
      }
      intro="Browse our work by stage — from sites currently underway to homes already lived in."
    >
      <div className="grid md:grid-cols-3 gap-6 md:gap-8">
        {STATUSES.map((s, i) => (
          <motion.div
            key={s.to}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-10% 0px" }}
            transition={{ duration: 0.7, delay: i * 0.08, ease: [0.2, 0.8, 0.2, 1] }}
          >
            <Link
              to={s.to}
              className="group block bg-ink text-paper p-10 md:p-12 h-full transition-colors hover:bg-[var(--sage)]"
            >
              <div className="flex items-start justify-between mb-16">
                <span className="eyebrow text-gold">{s.count}</span>
                <ArrowUpRight
                  size={20}
                  className="transition-transform duration-500 group-hover:translate-x-1 group-hover:-translate-y-1"
                />
              </div>
              <h2
                className="font-display mb-4"
                style={{ fontSize: "clamp(28px, 3vw, 40px)", fontWeight: 300, letterSpacing: "-0.02em" }}
              >
                {s.label}
              </h2>
              <p className="text-paper/70 text-sm leading-relaxed">{s.desc}</p>
            </Link>
          </motion.div>
        ))}
      </div>
    </PageShell>
  );
}
