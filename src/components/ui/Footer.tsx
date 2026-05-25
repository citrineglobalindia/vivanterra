import { motion } from "framer-motion";
import { Instagram, Linkedin } from "lucide-react";
import { Link } from "react-router-dom";
import Reveal from "./Reveal";

type FooterLink = { label: string; to: string; external?: boolean };

const COLS: { title: string; links: FooterLink[] }[] = [
  {
    title: "Projects",
    links: [
      { label: "Aurelia Bay", to: "/projects/aurelia-bay" },
      { label: "Marigold House", to: "/projects/marigold-house" },
      { label: "Sandalwood Row", to: "/projects/sandalwood-row" },
      { label: "Ongoing", to: "/projects/ongoing" },
      { label: "Upcoming", to: "/projects/upcoming" },
      { label: "Completed", to: "/projects/completed" },
    ],
  },
  {
    title: "Studio",
    links: [
      { label: "About", to: "/about" },
      { label: "Velocity", to: "/velocity" },
      { label: "Careers", to: "/career" },
    ],
  },
  {
    title: "Journal",
    links: [
      { label: "All essays", to: "/blogs" },
      { label: "Studio Notes", to: "/blogs" },
      { label: "Architecture", to: "/blogs" },
      { label: "Craft", to: "/blogs" },
    ],
  },
  {
    title: "Contact",
    links: [
      { label: "Book a viewing", to: "/contact?scope=visit" },
      { label: "Private clients", to: "/contact?scope=residence" },
      { label: "Press enquiries", to: "/contact?scope=press" },
      { label: "hello@velociti.com", to: "mailto:hello@velociti.com", external: true },
    ],
  },
];

export default function Footer() {
  return (
    <footer className="bg-ink text-paper pt-24 md:pt-32 pb-10" id="footer">
      <div className="max-w-page container-x">
        <div className="overflow-hidden">
          <motion.div
            initial={{ y: "30%", opacity: 0 }}
            whileInView={{ y: "0%", opacity: 1 }}
            viewport={{ once: true, margin: "-10% 0px" }}
            transition={{ duration: 1.1, ease: [0.2, 0.8, 0.2, 1] }}
          >
            <h2
              className="font-display text-paper select-none whitespace-nowrap block w-full"
              style={{
                fontSize: "clamp(56px, 15vw, 220px)",
                fontWeight: 300,
                letterSpacing: "-0.03em",
                lineHeight: 0.9,
              }}
            >
              VIVANTERRA
            </h2>
            <div className="mt-3 md:mt-4 flex items-center gap-4">
              <span className="h-px w-10 md:w-16 bg-gold" />
              <span className="eyebrow text-paper/70">Real Estate</span>
            </div>
          </motion.div>
        </div>

        <div className="hairline mt-16" />

        <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-10">
          {COLS.map((col) => (
            <Reveal key={col.title}>
              <div className="eyebrow mb-5">{col.title}</div>
              <ul className="space-y-3">
                {col.links.map((l) => (
                  <li key={l.label}>
                    {l.external ? (
                      <a
                        href={l.to}
                        className="nav-link text-sm text-paper/80 hover:text-paper"
                      >
                        {l.label}
                      </a>
                    ) : (
                      <Link
                        to={l.to}
                        className="nav-link text-sm text-paper/80 hover:text-paper"
                      >
                        {l.label}
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            </Reveal>
          ))}
        </div>

        <div className="hairline mt-20" />

        <div className="mt-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 text-xs text-paper/60">
          <div className="flex flex-wrap items-center gap-6">
            <span>© {new Date().getFullYear()} Vivanterra Real Estate. All rights reserved.</span>

          </div>
          <div className="flex items-center gap-6">
            <a href="https://www.instagram.com/" target="_blank" rel="noreferrer" aria-label="Instagram" className="hover:text-paper transition-colors"><Instagram size={16} /></a>
            <a href="https://www.linkedin.com/" target="_blank" rel="noreferrer" aria-label="LinkedIn" className="hover:text-paper transition-colors"><Linkedin size={16} /></a>
            <div className="flex items-center gap-2 uppercase tracking-[0.2em]">
              <button>EN</button><span className="text-paper/30">/</span><button>AR</button>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
