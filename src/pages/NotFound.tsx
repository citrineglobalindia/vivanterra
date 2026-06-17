import { useLocation, Link } from "react-router-dom";
import Seo from "@/components/seo/Seo";
import { useEffect } from "react";
import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";

const EASE = [0.2, 0.8, 0.2, 1] as const;

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname,
    );
  }, [location.pathname]);

  return (
    <>
      <Seo title="Page not found" description="The page you're looking for has been moved, or never existed." />
    <main className="relative min-h-[100svh] flex items-center justify-center bg-ink text-paper overflow-hidden">
      {/* Pulsing gold ambient */}
      <motion.div
        aria-hidden
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse at center, rgba(196,169,106,0.18) 0%, rgba(196,169,106,0.04) 40%, rgba(0,0,0,0) 75%)",
          filter: "blur(40px)",
        }}
        animate={{ opacity: [0.7, 1, 0.7] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Film grain */}
      <div
        aria-hidden
        className="absolute inset-0 opacity-[0.06] mix-blend-overlay pointer-events-none"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='200' height='200'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/></filter><rect width='100%' height='100%' filter='url(%23n)' opacity='0.7'/></svg>\")",
        }}
      />

      <div className="relative max-w-page container-x text-center">
        <motion.div
          className="flex items-center justify-center gap-3 mb-8"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1, ease: EASE }}
        >
          <span className="h-px w-10 bg-gold" />
          <span className="eyebrow text-paper">Page Not Found</span>
          <span className="h-px w-10 bg-gold" />
        </motion.div>

        <motion.h1
          className="font-display text-paper select-none"
          style={{
            fontSize: "clamp(120px, 24vw, 320px)",
            fontWeight: 300,
            letterSpacing: "-0.04em",
            lineHeight: 0.85,
          }}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.2, ease: EASE }}
        >
          404
        </motion.h1>

        <motion.p
          className="font-display italic text-paper/80 mt-6 mx-auto max-w-md"
          style={{ fontSize: "clamp(18px, 2vw, 24px)", lineHeight: 1.4 }}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5, ease: EASE }}
        >
          The page you're looking for has been moved, or never existed.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.7, ease: EASE }}
          className="mt-12"
        >
          <Link
            to="/"
            className="group inline-flex items-center gap-2 h-12 px-7 rounded-full border border-paper/30 text-paper text-[12px] tracking-[0.10em] uppercase hover:bg-gold hover:text-ink hover:border-gold transition-colors"
          >
            Return home
            <ArrowUpRight
              size={14}
              className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
            />
          </Link>
        </motion.div>
      </div>
    </main>
    </>
  );
};

export default NotFound;
