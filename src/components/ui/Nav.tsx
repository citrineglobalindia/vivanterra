import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowUpRight,
  ChevronDown,
  Mail,
  Menu,
  MessageCircle,
  Phone,
  Plus,
  X,
} from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import logoLight from "@/assets/logo-light.png"; // cream wordmark on green — for dark backgrounds
import logoDark from "@/assets/logo-dark.png";   // green wordmark on cream — for light backgrounds

type NavItem = {
  label: string;
  to: string;
  external?: boolean;
  children?: { label: string; to: string }[];
};

const NAV_LINKS: NavItem[] = [
  { label: "Home", to: "/" },
  { label: "About Us", to: "/about" },
  {
    label: "Projects",
    to: "/projects",
    children: [
      { label: "Ongoing Projects", to: "/projects/ongoing" },
      { label: "Upcoming Projects", to: "/projects/upcoming" },
      { label: "Completed Projects", to: "/projects/completed" },
    ],
  },
  { label: "Velocity", to: "https://velocitirealestate.com/", external: true },
  { label: "Career", to: "/career" },
  { label: "Blogs", to: "/blogs" },
  { label: "Contact Us", to: "/contact" },
];

export default function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [openProjects, setOpenProjects] = useState(false);
  const location = useLocation();
  const onHome = location.pathname === "/";

  useEffect(() => {
    function onScroll() {
      setScrolled(window.scrollY > 80);
    }
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  // On home the hero is dark (deep sage) so use cream text; on inner pages use ink text.
  const textTone = onHome ? "text-paper" : "text-ink";
  const scrolledBg = onHome
    ? scrolled
      ? "rgba(78,115,83,0.92)"
      : "rgba(78,115,83,0)"
    : scrolled
      ? "rgba(250,248,244,0.92)"
      : "rgba(250,248,244,0)";

  return (
    <>
      <motion.header
        className={`fixed left-0 right-0 top-0 z-[100] ${textTone}`}
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: onHome ? 2.6 : 0.1, duration: 0.6, ease: [0.2, 0.8, 0.2, 1] }}
      >
        <motion.div
          className="absolute inset-0 backdrop-blur-md"
          initial={false}
          animate={{ backgroundColor: scrolledBg }}
          transition={{ duration: 0.4 }}
        />
        <div className="relative max-w-page container-x">
          <div className="flex items-center justify-between h-[72px] md:h-[88px]">
            <Link to="/" aria-label="Vivanterra — home" className="flex items-center">
              <img
                src={onHome ? logoLight : logoDark}
                alt="Vivanterra"
                className="h-8 md:h-10 w-auto select-none"
                draggable={false}
              />
            </Link>

            <nav className="hidden lg:flex items-center gap-8">
              {NAV_LINKS.map((l) =>
                l.children ? (
                  <div
                    key={l.to}
                    className="relative"
                    onMouseEnter={() => setOpenProjects(true)}
                    onMouseLeave={() => setOpenProjects(false)}
                  >
                    <Link
                      to={l.to}
                      className="nav-link inline-flex items-center gap-1 text-[12px] uppercase tracking-[0.18em] font-medium"
                    >
                      {l.label}
                      <ChevronDown size={12} />
                    </Link>
                    <AnimatePresence>
                      {openProjects && (
                        <motion.div
                          initial={{ opacity: 0, y: 8 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: 8 }}
                          transition={{ duration: 0.25, ease: [0.2, 0.8, 0.2, 1] }}
                          className="absolute left-1/2 top-full -translate-x-1/2 pt-4"
                        >
                          <div className="min-w-[220px] bg-paper text-ink shadow-xl ring-1 ring-line-dark rounded-sm py-3">
                            {l.children.map((c) => (
                              <Link
                                key={c.to}
                                to={c.to}
                                className="block px-5 py-2.5 text-[12px] uppercase tracking-[0.16em] hover:bg-sand/30 transition-colors"
                              >
                                {c.label}
                              </Link>
                            ))}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                ) : l.external ? (
                  <a
                    key={l.to}
                    href={l.to}
                    target="_blank"
                    rel="noreferrer"
                    className="nav-link inline-flex items-center gap-1 text-[12px] uppercase tracking-[0.18em] font-medium"
                  >
                    {l.label}
                    <ArrowUpRight size={12} className="opacity-70" />
                  </a>
                ) : (
                  <Link
                    key={l.to}
                    to={l.to}
                    className="nav-link text-[12px] uppercase tracking-[0.18em] font-medium"
                  >
                    {l.label}
                  </Link>
                ),
              )}
            </nav>

            <div className="flex items-center gap-4 md:gap-6">
              <Link
                to="/contact"
                className={`hidden md:inline-flex btn ${onHome ? "btn-light" : "btn-dark"}`}
              >
                Enquire Now
                <ArrowUpRight className="btn-arrow" size={16} />
              </Link>
              <button
                className="lg:hidden p-2 -mr-2"
                aria-label="Open menu"
                onClick={() => setOpen(true)}
              >
                <Menu size={22} />
              </button>
            </div>
          </div>
        </div>
      </motion.header>

      {/* ───────── Mobile panel ───────── */}
      <AnimatePresence>
        {open && (
          <MobileMenu
            currentPath={location.pathname}
            onClose={() => setOpen(false)}
          />
        )}
      </AnimatePresence>
    </>
  );
}

/* ============================================================
   Mobile menu — editorial slide-in with numbered links,
   accordion children, contact tiles and brand block.
   ============================================================ */
function MobileMenu({
  currentPath,
  onClose,
}: {
  currentPath: string;
  onClose: () => void;
}) {
  const [expanded, setExpanded] = useState<string | null>(null);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  return (
    <motion.div
      className="fixed inset-0 z-[150] lg:hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      role="dialog"
      aria-modal="true"
      aria-label="Site menu"
    >
      {/* Backdrop */}
      <button
        type="button"
        aria-label="Close menu"
        onClick={onClose}
        className="absolute inset-0 bg-ink/60 backdrop-blur-sm"
      />

      {/* Panel */}
      <motion.aside
        initial={{ x: "100%" }}
        animate={{ x: 0 }}
        exit={{ x: "100%" }}
        transition={{ duration: 0.55, ease: [0.77, 0, 0.18, 1] }}
        className="absolute right-0 top-0 h-full w-full max-w-[420px] bg-ink text-paper flex flex-col overflow-hidden"
        style={{
          boxShadow: "-30px 0 80px -20px rgba(0,0,0,0.6)",
        }}
      >
        {/* Pulsing gold ambient glow */}
        <div
          aria-hidden
          className="absolute -top-1/4 -right-1/3 w-[80%] h-[60%] pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse at center, rgba(196,169,106,0.18) 0%, rgba(196,169,106,0.05) 40%, rgba(0,0,0,0) 75%)",
            filter: "blur(40px)",
          }}
        />
        {/* Subtle film grain */}
        <div
          aria-hidden
          className="absolute inset-0 opacity-[0.06] mix-blend-overlay pointer-events-none"
          style={{
            backgroundImage:
              "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='200' height='200'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/></filter><rect width='100%' height='100%' filter='url(%23n)' opacity='0.7'/></svg>\")",
          }}
        />
        {/* Left gold rule */}
        <div
          aria-hidden
          className="absolute left-0 top-24 bottom-24 w-px bg-gradient-to-b from-transparent via-gold/60 to-transparent"
        />

        {/* Header */}
        <div className="relative px-6 pt-5 pb-4 flex items-center justify-between">
          <Link to="/" onClick={onClose} aria-label="Vivanterra — home">
            <img
              src={logoLight}
              alt="Vivanterra"
              className="h-8 w-auto"
              draggable={false}
            />
          </Link>
          <button
            onClick={onClose}
            aria-label="Close menu"
            className="w-10 h-10 rounded-full border border-paper/25 flex items-center justify-center hover:bg-gold hover:text-ink hover:border-gold transition-all duration-300 hover:rotate-90"
          >
            <X size={16} strokeWidth={2.4} />
          </button>
        </div>

        <div className="hairline opacity-30" />

        {/* Eyebrow */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25, duration: 0.5 }}
          className="relative px-6 pt-6 flex items-center gap-3"
        >
          <span className="h-px w-8 bg-gold" />
          <span className="eyebrow text-paper/60">Menu</span>
        </motion.div>

        {/* Nav list */}
        <nav className="relative flex-1 overflow-y-auto px-6 pt-3 pb-4">
          <ul className="flex flex-col">
            {NAV_LINKS.map((l, i) => {
              const isExpanded = expanded === l.to;
              const isActive =
                currentPath === l.to ||
                (l.children && currentPath.startsWith(l.to + "/"));
              const num = String(i + 1).padStart(2, "0");

              return (
                <motion.li
                  key={l.to}
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{
                    delay: 0.3 + i * 0.05,
                    duration: 0.5,
                    ease: [0.2, 0.8, 0.2, 1],
                  }}
                  className="border-b border-paper/10"
                >
                  <div className="flex items-center justify-between gap-3 py-3.5">
                    {(() => {
                      const inner = (
                        <>
                          <span className="text-[10px] tracking-[0.22em] text-gold tabular-nums w-7 shrink-0">
                            {num}
                          </span>
                          <span
                            className={[
                              "font-display flex-1 truncate transition-colors",
                              isActive ? "text-gold" : "text-paper group-hover:text-gold",
                            ].join(" ")}
                            style={{
                              fontSize: 28,
                              fontWeight: 400,
                              letterSpacing: "-0.02em",
                              lineHeight: 1.1,
                            }}
                          >
                            {l.label}
                          </span>
                          {!l.children && (
                            <ArrowUpRight
                              size={16}
                              className="text-paper/40 group-hover:text-gold group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all shrink-0"
                            />
                          )}
                        </>
                      );
                      const cls = "group flex items-baseline gap-4 flex-1 min-w-0";
                      return l.external ? (
                        <a
                          href={l.to}
                          target="_blank"
                          rel="noreferrer"
                          onClick={onClose}
                          className={cls}
                        >
                          {inner}
                        </a>
                      ) : (
                        <Link to={l.to} onClick={onClose} className={cls}>
                          {inner}
                        </Link>
                      );
                    })()}
                    {l.children && (
                      <button
                        onClick={() => setExpanded(isExpanded ? null : l.to)}
                        aria-label={isExpanded ? "Collapse" : "Expand"}
                        aria-expanded={isExpanded}
                        className="w-9 h-9 rounded-full border border-paper/25 flex items-center justify-center text-paper hover:bg-gold hover:border-gold hover:text-ink transition-colors shrink-0"
                      >
                        <Plus
                          size={14}
                          className={[
                            "transition-transform duration-300",
                            isExpanded ? "rotate-45" : "rotate-0",
                          ].join(" ")}
                        />
                      </button>
                    )}
                  </div>

                  {/* Children accordion */}
                  {l.children && (
                    <AnimatePresence initial={false}>
                      {isExpanded && (
                        <motion.div
                          key="sub"
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{
                            duration: 0.4,
                            ease: [0.2, 0.8, 0.2, 1],
                          }}
                          className="overflow-hidden"
                        >
                          <ul className="pb-4 pl-11 flex flex-col gap-1">
                            {l.children.map((c) => {
                              const cActive = currentPath === c.to;
                              return (
                                <li key={c.to}>
                                  <Link
                                    to={c.to}
                                    onClick={onClose}
                                    className={[
                                      "flex items-center justify-between py-1.5 text-[12px] tracking-[0.16em] uppercase transition-colors",
                                      cActive
                                        ? "text-gold"
                                        : "text-paper/65 hover:text-gold",
                                    ].join(" ")}
                                  >
                                    <span>{c.label}</span>
                                    <ArrowUpRight size={12} />
                                  </Link>
                                </li>
                              );
                            })}
                          </ul>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  )}
                </motion.li>
              );
            })}
          </ul>

          {/* Enquire CTA */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7, duration: 0.6 }}
            className="mt-6"
          >
            <Link
              to="/contact"
              onClick={onClose}
              className="group relative inline-flex items-center justify-between gap-2 w-full h-12 px-5 rounded-full bg-gold text-ink font-medium text-[12px] tracking-[0.10em] uppercase overflow-hidden transition-transform duration-300 hover:-translate-y-0.5"
              style={{
                boxShadow: "0 16px 40px -16px rgba(196,169,106,0.6)",
              }}
            >
              <span>Enquire now</span>
              <ArrowUpRight
                size={16}
                className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
              />
            </Link>
          </motion.div>

          {/* Contact tiles */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.78, duration: 0.6 }}
            className="mt-6"
          >
            <div className="flex items-center gap-3 mb-3">
              <span className="h-px w-8 bg-gold" />
              <span className="eyebrow text-paper/60">Direct</span>
            </div>
            <div className="grid grid-cols-3 gap-2">
              <ContactTile
                href="tel:+919986666774"
                icon={<Phone size={14} />}
                label="Call"
              />
              <ContactTile
                href="mailto:hello@velociti.com"
                icon={<Mail size={14} />}
                label="Email"
              />
              <ContactTile
                href="https://wa.me/919986666774"
                external
                icon={<MessageCircle size={14} />}
                label="WhatsApp"
              />
            </div>
          </motion.div>
        </nav>

        {/* Brand block (footer) */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.85, duration: 0.6 }}
          className="relative px-6 py-5 border-t border-paper/15"
        >
          <div className="flex items-end justify-between gap-4">
            <div>
              <div className="font-display text-paper text-xl font-light leading-tight">
                Vivanterra
              </div>
              <div className="eyebrow text-paper/60 mt-0.5">Real Estate</div>
            </div>
            <div className="text-right">
              <div className="text-[10px] tracking-[0.22em] text-gold tabular-nums">
                EST. BENGALURU
              </div>
              <div className="text-[10px] tracking-[0.22em] text-paper/50 tabular-nums mt-0.5">
                © {new Date().getFullYear()}
              </div>
            </div>
          </div>
        </motion.div>
      </motion.aside>
    </motion.div>
  );
}

function ContactTile({
  href,
  icon,
  label,
  external,
}: {
  href: string;
  icon: React.ReactNode;
  label: string;
  external?: boolean;
}) {
  const cls =
    "flex flex-col items-center justify-center gap-1.5 h-16 rounded-sm border border-paper/15 text-paper hover:bg-gold hover:text-ink hover:border-gold transition-colors";
  const inner = (
    <>
      {icon}
      <span className="text-[10px] tracking-[0.16em] uppercase">{label}</span>
    </>
  );
  return external ? (
    <a href={href} target="_blank" rel="noreferrer" className={cls}>
      {inner}
    </a>
  ) : (
    <a href={href} className={cls}>
      {inner}
    </a>
  );
}
