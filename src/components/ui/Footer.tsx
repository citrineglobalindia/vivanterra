import { motion } from "framer-motion";
import {
  ArrowUp,
  Clock,
  Instagram,
  Linkedin,
  Mail,
  MapPin,
  MessageCircle,
  Phone,
} from "lucide-react";
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
      { label: "Journal", to: "/blogs" },
    ],
  },
  {
    title: "Contact",
    links: [
      { label: "Book a viewing", to: "/contact?scope=visit" },
      { label: "Private clients", to: "/contact?scope=residence" },
      { label: "Press enquiries", to: "/contact?scope=press" },
      { label: "Careers enquiries", to: "/contact?scope=career" },
    ],
  },
];

const PHONE_DISPLAY = "+91 88675 89797";
const PHONE_TEL = "+918867589797";
const WHATSAPP_URL = "https://wa.me/918867589797";
const EMAIL = "hello@vivanterra.in";
const STUDIO_ADDRESS_LINES = [
  "4th Floor, Cassini Towers,",
  "13th Cross Rd, Sadashiva Nagar,",
  "Bengaluru 560080",
];
const HOURS_LINES = ["Mon — Sat · 10am — 7pm IST", "Sunday by appointment"];

function scrollToTop() {
  window.scrollTo({ top: 0, behavior: "smooth" });
}

export default function Footer() {
  return (
    <footer
      className="bg-ink text-paper pt-24 md:pt-32 pb-10 relative overflow-hidden"
      id="footer"
    >
      {/* Soft gold ambient */}
      <div
        aria-hidden
        className="absolute -top-1/3 -right-1/4 w-[60%] h-[60%] pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse at center, rgba(196,169,106,0.10) 0%, rgba(196,169,106,0) 70%)",
          filter: "blur(60px)",
        }}
      />

      <div className="relative max-w-page container-x">
        {/* Wordmark + tagline */}
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
              <span className="eyebrow text-paper/70">
                Wellness-first real estate · Bengaluru
              </span>
            </div>
            <p className="mt-8 max-w-2xl text-paper/70 leading-relaxed text-[15px] md:text-base">
              We build more than homes; we cultivate ecosystems of health —
              ensuring our residents breathe deeper and live better, every
              single day.
            </p>
          </motion.div>
        </div>

        <div className="hairline mt-16" />

        {/* Main grid: contact block + 3 link columns */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-12 gap-12 md:gap-10">
          {/* Visit / contact card — spans 5 cols on desktop */}
          <Reveal className="md:col-span-5">
            <div className="eyebrow mb-5 text-paper/85">Visit the studio</div>
            <ContactRow icon={<MapPin size={14} />}>
              {STUDIO_ADDRESS_LINES.map((l, i) => (
                <span key={i} className="block">
                  {l}
                </span>
              ))}
            </ContactRow>
            <ContactRow icon={<Clock size={14} />}>
              {HOURS_LINES.map((l, i) => (
                <span
                  key={i}
                  className={i === 1 ? "block text-paper/55" : "block"}
                >
                  {l}
                </span>
              ))}
            </ContactRow>
            <ContactRow icon={<Phone size={14} />}>
              <a
                href={`tel:${PHONE_TEL}`}
                className="hover:text-gold transition-colors tabular-nums"
              >
                {PHONE_DISPLAY}
              </a>
            </ContactRow>
            <ContactRow icon={<Mail size={14} />}>
              <a
                href={`mailto:${EMAIL}`}
                className="hover:text-gold transition-colors break-all"
              >
                {EMAIL}
              </a>
            </ContactRow>
            <ContactRow icon={<MessageCircle size={14} />}>
              <a
                href={WHATSAPP_URL}
                target="_blank"
                rel="noreferrer"
                className="hover:text-gold transition-colors"
              >
                Message on WhatsApp
              </a>
            </ContactRow>
          </Reveal>

          {/* Link columns — 3 cols of links inside 7 cols */}
          <div className="md:col-span-7 grid grid-cols-2 sm:grid-cols-3 gap-10">
            {COLS.map((col) => (
              <Reveal key={col.title}>
                <div className="eyebrow mb-5 text-paper/85">{col.title}</div>
                <ul className="space-y-3">
                  {col.links.map((l) => (
                    <li key={l.label}>
                      {l.external ? (
                        <a
                          href={l.to}
                          className="nav-link text-sm text-paper/75 hover:text-paper transition-colors"
                          target="_blank"
                          rel="noreferrer"
                        >
                          {l.label}
                        </a>
                      ) : (
                        <Link
                          to={l.to}
                          className="nav-link text-sm text-paper/75 hover:text-paper transition-colors"
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
        </div>

        <div className="hairline mt-20" />

        {/* Bottom bar: copyright + social + back-to-top */}
        <div className="mt-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 text-xs text-paper/60">
          <div className="flex flex-wrap items-center gap-6">
            <span>
              © {new Date().getFullYear()} Vivanterra. All rights reserved.
            </span>
            <a
              href="https://vivanterra.in"
              target="_blank"
              rel="noreferrer"
              className="nav-link hover:text-paper"
            >
              vivanterra.in
            </a>
          </div>
          <div className="flex items-center gap-5">
            <a
              href="https://www.instagram.com/"
              target="_blank"
              rel="noreferrer"
              aria-label="Instagram"
              className="hover:text-paper transition-colors"
            >
              <Instagram size={16} />
            </a>
            <a
              href="https://www.linkedin.com/"
              target="_blank"
              rel="noreferrer"
              aria-label="LinkedIn"
              className="hover:text-paper transition-colors"
            >
              <Linkedin size={16} />
            </a>
            <a
              href={WHATSAPP_URL}
              target="_blank"
              rel="noreferrer"
              aria-label="WhatsApp"
              className="hover:text-paper transition-colors"
            >
              <MessageCircle size={16} />
            </a>
            <button
              type="button"
              onClick={scrollToTop}
              aria-label="Back to top"
              className="inline-flex items-center gap-2 px-3 h-8 rounded-full border border-paper/25 hover:border-gold hover:text-gold transition-colors uppercase tracking-[0.18em] text-[10px]"
            >
              Top
              <ArrowUp size={11} />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}

function ContactRow({
  icon,
  children,
}: {
  icon: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-start gap-3 mb-4 text-paper/85 text-[14px] leading-relaxed">
      <span className="mt-0.5 w-8 h-8 shrink-0 rounded-full border border-gold/35 text-gold flex items-center justify-center">
        {icon}
      </span>
      <div>{children}</div>
    </div>
  );
}
