import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowUpRight, Menu, X } from "lucide-react";

const NAV_LINKS = [
  { label: "Residences", href: "#residences" },
  { label: "Developments", href: "#developments" },
  { label: "About", href: "#standard" },
  { label: "Press", href: "#press" },
  { label: "Contact", href: "#contact" },
];

export default function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

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
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  return (
    <>
      <motion.header
        className="fixed left-0 right-0 top-0 z-[100] text-paper"
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 2.6, duration: 0.6, ease: [0.2, 0.8, 0.2, 1] }}
      >
        <motion.div
          className="absolute inset-0 backdrop-blur-md"
          initial={false}
          animate={{
            backgroundColor: scrolled ? "rgba(14,14,16,0.85)" : "rgba(14,14,16,0)",
          }}
          transition={{ duration: 0.4 }}
        />
        <div className="relative max-w-page container-x">
          <div className="flex items-center justify-between h-[72px] md:h-[88px]">
            <a href="#top" className="font-display italic" style={{ fontSize: 22, fontWeight: 400 }}>
              MERIDIAN
            </a>

            <nav className="hidden md:flex items-center gap-9">
              {NAV_LINKS.map((l) => (
                <a
                  key={l.href}
                  href={l.href}
                  className="nav-link text-[12px] uppercase tracking-[0.18em] font-medium"
                >
                  {l.label}
                </a>
              ))}
            </nav>

            <div className="flex items-center gap-4 md:gap-6">
              <div className="hidden md:flex items-center gap-2 text-[11px] uppercase tracking-[0.2em] text-paper/70">
                <button className="hover:text-paper transition-colors">EN</button>
                <span className="text-paper/30">/</span>
                <button className="hover:text-paper transition-colors">AR</button>
              </div>
              <a href="#contact" className="hidden md:inline-flex btn btn-light">
                Book a viewing
                <ArrowUpRight className="btn-arrow" size={16} />
              </a>
              <button
                className="md:hidden p-2 -mr-2"
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
            className="fixed inset-0 z-[150] bg-ink text-paper md:hidden"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ duration: 0.6, ease: [0.77, 0, 0.18, 1] }}
          >
            <div className="container-x max-w-page flex h-[72px] items-center justify-between">
              <span className="font-display italic" style={{ fontSize: 22 }}>MERIDIAN</span>
              <button
                onClick={() => setOpen(false)}
                aria-label="Close menu"
                className="p-2 -mr-2"
              >
                <X size={22} />
              </button>
            </div>
            <div className="hairline" />
            <nav className="container-x max-w-page mt-12 flex flex-col gap-6">
              {NAV_LINKS.map((l, i) => (
                <motion.a
                  key={l.href}
                  href={l.href}
                  onClick={() => setOpen(false)}
                  className="font-display"
                  style={{ fontSize: 36, fontWeight: 300, letterSpacing: "-0.02em" }}
                  initial={{ y: 30, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.2 + i * 0.06, duration: 0.6, ease: [0.2, 0.8, 0.2, 1] }}
                >
                  {l.label}
                </motion.a>
              ))}
              <div className="hairline mt-10" />
              <a href="mailto:hello@meridianestates.com" className="text-paper/70 mt-6 text-sm">
                hello@meridianestates.com
              </a>
              <div className="mt-2 flex items-center gap-2 text-[11px] uppercase tracking-[0.2em] text-paper/70">
                <button>EN</button><span className="text-paper/30">/</span><button>AR</button>
              </div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
