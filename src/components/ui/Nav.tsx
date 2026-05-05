import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowUpRight, ChevronDown, Menu, X } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import logoLight from "@/assets/logo-light.png"; // cream wordmark on green — for dark backgrounds
import logoDark from "@/assets/logo-dark.png";   // green wordmark on cream — for light backgrounds

type NavItem = {
  label: string;
  to: string;
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
  { label: "Velocity", to: "/velocity" },
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

      {/* Mobile panel */}
      <AnimatePresence>
        {open && (
          <motion.div
            className="fixed inset-0 z-[150] bg-ink text-paper lg:hidden"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ duration: 0.6, ease: [0.77, 0, 0.18, 1] }}
          >
            <div className="container-x max-w-page flex h-[72px] items-center justify-between">
              <img src={logoLight} alt="Vivanterra" className="h-8 w-auto" draggable={false} />
              <button onClick={() => setOpen(false)} aria-label="Close menu" className="p-2 -mr-2">
                <X size={22} />
              </button>
            </div>
            <div className="hairline" />
            <nav className="container-x max-w-page mt-10 flex flex-col gap-5 overflow-y-auto pb-12">
              {NAV_LINKS.map((l, i) => (
                <motion.div
                  key={l.to}
                  initial={{ y: 30, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.2 + i * 0.05, duration: 0.5, ease: [0.2, 0.8, 0.2, 1] }}
                >
                  <Link
                    to={l.to}
                    onClick={() => setOpen(false)}
                    className="font-display block"
                    style={{ fontSize: 32, fontWeight: 400, letterSpacing: "-0.02em" }}
                  >
                    {l.label}
                  </Link>
                  {l.children && (
                    <div className="mt-2 ml-4 flex flex-col gap-2">
                      {l.children.map((c) => (
                        <Link
                          key={c.to}
                          to={c.to}
                          onClick={() => setOpen(false)}
                          className="text-sm text-paper/70 uppercase tracking-[0.16em]"
                        >
                          {c.label}
                        </Link>
                      ))}
                    </div>
                  )}
                </motion.div>
              ))}
              <div className="hairline mt-8" />
              <a href="mailto:hello@velociti.com" className="text-paper/70 mt-4 text-sm">
                hello@velociti.com
              </a>
              <a href="tel:+919986666774" className="text-paper/70 text-sm">
                +91 99866 66774
              </a>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
